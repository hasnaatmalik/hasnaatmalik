---
name: add-book
description: Add, remove or reorder books on the bookshelf in Hasnaat's portfolio. Finds the official cover, saves it to public/books, and designs a CSS spine in colours sampled from that cover. Use when asked to add a book, change the shelf, or change which book is open by default.
---

# Add a book

Books live in `src/constants/books.ts`, and covers in `public/books/`. The shelf shows a CSS
spine for each book; clicking one fades the spine into the real cover.

## 1. Check the details

Get the exact title, the author's full name, and the edition if it matters. The spine prints
the author's surname. Use the original or best-known edition: never a TV tie-in, a study guide
or a summary.

## 2. Get the official cover

He wants **HD, official covers**. Aim for 1500px tall or more, and save at 1000px. Try these in
order:

```sh
# 1. Apple Books: publishers' own artwork, often 3000px. Swap 100x100bb for 3000x3000bb.
curl -s "https://itunes.apple.com/search?media=ebook&limit=8&country=gb&term=the%20kite%20runner" \
  | python3 -c "import json,sys;[print(r['trackName'],'|',r['artworkUrl100']) for r in json.load(sys.stdin)['results']]"
# (try country=us and country=in too)

# 2. Goodreads, by ISBN: the og:image is the original upload, sometimes 1500px+.
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36"
curl -sL -A "$UA" "https://www.goodreads.com/book/isbn/9780571333141" \
  | grep -oE 'property="og:image" content="[^"]+"'

# 3. O'Reilly books: https://www.oreilly.com/covers/urn:orm:book:<isbn>/1200w/
```

Open Library covers top out around 500px and look soft, so only use them as a last resort.

Pick the edition carefully: the set the shelf already uses (Bloomsbury UK for Hosseini, Faber
for Rooney, Bloomsbury's Jonny Duddle editions for _Harry Potter_), never a TV tie-in, a
"Hulu" or award sticker you can avoid, a study guide or a summary.

Download into your scratchpad, **look at it** (right book, right edition, no stickers or
badges), then save it:

```sh
sips -s format jpeg -s formatOptions 86 --resampleHeight 1000 cover.jpg --out public/books/<id>.jpg
sips -g pixelWidth -g pixelHeight public/books/<id>.jpg
```

## 3. Sample the spine colours

Spines should look like the same book as the cover. Sample the cover:

```sh
python3 - <<'EOF'
from PIL import Image
from collections import Counter
im = Image.open("public/books/<id>.jpg").convert("RGB").resize((40, 60)).quantize(5)
pal = im.getpalette()
print(["#%02x%02x%02x" % tuple(pal[i*3:i*3+3]) for i, _ in Counter(im.getdata()).most_common(4)])
EOF
```

- `paper`: the cover's main colour (or its spine colour, if you know it);
- `ink`: the title colour on the cover, with strong contrast against `paper`;
- `accent`: a second colour from the cover, for the band and dot.

## 4. Add the entry

| Field    | Guidance                                                                    |
| -------- | --------------------------------------------------------------------------- |
| `id`     | unique, lowercase-dashed; also the cover's file name                        |
| `cover`  | `cover("<id>.jpg", width, height)`, with the saved file's real pixel size   |
| `height` | 245–285. Vary it against the neighbours so the shelf isn't flat             |
| `depth`  | spine thickness: ~26 for a slim novel, ~56 for a doorstop                   |
| `face`   | `serif` (literary), `sans` (modern, technical), `display` (bold, uppercase) |
| `spine`  | optional shorter title when the full one won't fit                          |
| `note`   | optional one-liner shown under the shelf when the book is open              |

Put books by the same author or series next to each other: the Rooney pair, the Hosseini pair,
the _Harry Potter_ run. The first book in the list is open when the page loads.

## 5. Verify

```sh
npx prettier --write src && npx tsc --noEmit -p . && npm run lint
```

Screenshot the home page (see `CLAUDE.md`) and crop the Bookshelf. Check that the spine title
fits (use `spine` if not), its colour stands apart from its neighbours, and the shelf still fits
the column. To see the new cover open, temporarily move the book first, screenshot, and
**restore the order**.

**Removing a book:** delete its entry and its file in `public/books/`.
