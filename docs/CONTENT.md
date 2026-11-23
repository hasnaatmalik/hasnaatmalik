# Content guide

Everything on the site, where it lives and how to change it. Most content is plain data in
`src/constants/`, so an update is usually one entry in one file. After any change, run the checks in
[Before you push](#before-you-push).

**Contents:** [Profile and links](#profile-and-links) · [Hero](#hero) · [Work](#work) ·
[Experience](#experience) · [Stack](#stack) · [About](#about) · [Activity](#activity) ·
[Bookshelf](#bookshelf) · [Movies](#movies) · [Music](#music) · [Photos](#photos) ·
[Elsewhere](#elsewhere-the-two-gif-cards) · [Quote](#quote) · [Socials](#socials) ·
[Top bar](#top-bar) · [Mascot](#mascot) · [Footer, title and SEO](#footer-title-and-seo) ·
[Images and paths](#images-and-paths)

---

## Profile and links

**File:** `src/constants/profile.ts` → `profile`

| Field             | Used for                                                           |
| ----------------- | ------------------------------------------------------------------ |
| `name`            | the hero heading (it inks itself in)                               |
| `location`        | the pin next to the name                                           |
| `timeZone`        | the live Lahore clock in the hero banner, the About bar and footer |
| `email`           | the "Say hello" button, the contact card and Socials               |
| `blog`            | the Blog tab and the Notes card                                    |
| `github`          | the GitHub button in the top bar and Socials                       |
| `githubUser`      | the contribution graph (Activity)                                  |
| `spotifyPlaylist` | the playlist in Music: the id from the Spotify playlist URL        |

The résumé is `public/cv.pdf`. Replace the file and keep the name.

## Hero

**File:** `src/routes/index.tsx` → `Hero()`

- **Headline:** "I build _AI systems_ and _full-stack products_". Each `<Scribble>` draws a hand-drawn
  underline under its words.
- **Bio line:** "{role} at {company}, working on AI for healthcare." The role and company come
  from the entry in `experience.ts` with `current: true`. The words after the comma are typed in
  `Hero()`, so update them there when the job changes.
- **Status badge:** "Open to remote work and freelance". Change the text inside `<Shimmer>`, or
  delete the line to hide the badge.
- **Banner:** `public/gifs/chai-shop.gif`, with the "live from lahore" clock on top.

## Work

**File:** `src/constants/projects.ts`

```ts
{
  name: "Munshi",
  tagline: "FBR-compliant e-invoicing",       // shown on the row
  description: "Desktop e-invoicing app…",    // shown when the row opens
  stack: ["React", "Tauri", "Rust", "SQLite"],
  href: "https://munshi-one.vercel.app/",
  year: 2026,                                  // rows are grouped under year folders
  isNew: true,                                 // optional "new" badge
},
```

Years are listed newest first. Within a year, rows follow the order in the file.

## Experience

**File:** `src/constants/experience.ts`

```ts
{
  company: "PRAID AI",
  role: "Application Engineer",
  period: "Nov 2026 — Present",       // use an em dash: —
  current: true,                      // exactly one entry; the hero bio reads from it
  description: "Building across an AI healthcare platform…",
  href: "https://www.praid-ai.com/",
  logo: asset("/logos/praid-ai.svg"), // optional; without it the row shows the initial
},
```

**Logos** sit on a small white tile, so a logo in its normal colours on a white or transparent
background looks right.

1. **Find it:** the company's own `favicon.svg` is best. Look for `<link rel="icon">` in the
   source of their homepage. A 512px PNG icon is the next best thing.
2. **Save it:** put it in `public/logos/` with a lowercase dashed name.
3. **Resize big files:** `sips -Z 160 public/logos/name.png`.
4. **Link it:** set `logo: asset("/logos/name.svg")`.

When someone leaves a job, set that entry's `current: false`, add the new job at the top with
`current: true`, and check the hero bio wording.

## Stack

**File:** `src/constants/profile.ts` → `stack` (groups of chips, in order).

Every chip needs an `icon`. Icons stay grey and take their brand colour on hover. Near-black
brand colours, like Next.js or Rust, stay neutral on purpose.

- **Brand icons** come from [simple-icons](https://simpleicons.org). Search the site, then import
  it as `si` + the slug in PascalCase: `import { siDocker } from "simple-icons"`.
- **Icons not in simple-icons** are drawn by hand in `profile.ts`. See `pinecone`, `groq`, `rag`
  and `llm` there. A `Glyph` is an SVG `path` on a 24×24 grid, an optional `hex` brand colour,
  and `stroke: true` for line drawings.

## About

**File:** `src/routes/index.tsx` → `About()`

- **Greeting:** follows the visitor's clock: "Good morning" (5–12), "Good afternoon" (12–5pm),
  "Good evening" (5–10pm) and "Up late?" after that. The rules are in `src/lib/time.ts`.
- **Clock chip:** the time in Lahore, with a sun or moon icon by the hour there.
- **Bullets:** edit the three `<li>` items. The bold lead-in is `<strong>`.

## Activity

The contribution graph comes from `github-contributions-api.jogruber.de` for
`profile.githubUser`. Nothing to edit.

## Bookshelf

**File:** `src/constants/books.ts`. Covers in `public/books/`.

The shelf is a row of spines drawn in CSS. Clicking one widens its slot to the cover's width,
the spine fades into the real cover, and the neighbours slide over. Clicking anywhere else, or
Escape, closes it.

```ts
{
  id: "normal-people",          // unique, lowercase-dashed
  title: "Normal People",
  author: "Sally Rooney",       // the spine shows the surname
  cover: cover("normal-people.jpg", 529, 800), // file in public/books, its width and height
  height: 252,                  // spine height in px; vary between ~245 and ~285
  depth: 30,                    // spine thickness in px; ~26 thin to ~56 thick
  paper: "#82b04c",             // spine colour, sampled from the cover
  ink: "#10180c",               // spine text colour
  accent: "#7398be",            // the band at the top and the dot at the bottom
  face: "display",              // spine type: "serif" | "sans" | "display"
  spine: "Philosopher's Stone", // optional shorter spine title for long names
  note: "…",                    // optional line under the shelf when the book is open
},
```

- **Covers:** official and HD (1500px+ at the source, saved at 1000px tall). Apple Books'
  search API is the best source, then Goodreads by ISBN; Open Library is too soft. Avoid TV
  tie-ins and study guides. The `add-book` skill has the commands.
- **Spine colours** come from the cover, so open and closed look like the same book.
- The first book in the list is open on load.

## Movies

**File:** `src/constants/movies.ts`. Posters go in `public/movies/`.

The section is a pile of cinema tickets beside a "Now showing" board, plus a link to Bingers.
**The list isn't ranked.** The section says "In no particular order", so don't add numbers,
ranks or ratings.

**Adding a film:**

1. **Find its TMDB id:** search [themoviedb.org](https://www.themoviedb.org). The id is the number
   in the film's URL, e.g. `themoviedb.org/movie/257211-the-intern` → `257211`.
2. **Get the poster:** `scripts/fetch-poster.sh 257211 the-intern`. This saves
   `public/movies/the-intern.jpg` at 480×720. Don't use Wikipedia posters: they're tiny and look
   pixelated.
3. **Add an entry:**

```ts
{
  title: "The Intern",
  year: "2015",
  director: "Nancy Meyers",
  language: "English",              // "Hindi" | "English" (add more to the type if needed)
  posters: [poster("the-intern.jpg")],
  paper: "#ebe5d9",                 // ticket colour
  ink: "#1e1e1c",                   // text colour on the ticket
  accent: "#8aa57a",                // the poster is printed in this colour until hovered
  row: "T",                         // the title's initial
  seat: "15",                       // anything short and fun (e.g. the year's last two digits)
},
```

**Series** (one ticket for several films): put every poster in `posters`, in release order. Add
a `series` badge, e.g. `"Trilogy · I II III"` or `"All eight films"`, set `year` to a range like
`"2001 — 2011"`, and use a range seat like `"1–8"`. The ticket then says "Admit three", "Admit
eight" and so on, and the posters fan out like a hand of cards. Any count works.

**Picking colours:**

- `paper` and `ink` need strong contrast, either light paper with dark ink or the reverse.
- `accent` should be mid-toned. Dark posters print darker, so lean lighter for them.
- Alternate light and dark tickets so neighbours don't blend.

**Bingers:** the `bingers` export at the bottom of `movies.ts` holds the handle and link.

## Music

Change `profile.spotifyPlaylist` to another playlist id. The player loads when it scrolls into
view and follows the light or dark theme.

## Photos

**Gallery files:** `src/constants/gallery.ts`. Images go in `public/gallery/`.

The photography page is **one collection**: no categories, chapters, numbers or captions, and no
text beyond the title. Hasnaat asked for exactly that, so don't add groupings back.

**Adding a photo:**

1. Run `scripts/prepare-photo.sh ~/Desktop/IMG_1234.HEIC hunza-sunset`. It resizes the photo to
   1600px on the long edge, saves `public/gallery/hunza-sunset.jpg`, and prints the entry.
2. Open the saved file and check it's the right way up.
3. Paste the entry into `photos` in `gallery.ts` and write a plain `alt` describing the photo. The
   alt text is for screen readers and isn't shown on the page.
4. Put it somewhere in the middle of the list, not next to similar shots. The list order is the
   page order, and mountains, trails and the city are mixed on purpose.

**Home page strip:** `previewPhotos` near the top of `src/routes/index.tsx` lists the six photos,
by file name without `.jpg`.

**Photography page:** `src/routes/photography.tsx`. The title and viewfinder, then the grid. The
top bar there shows only "← Back home" (no Blog pill). The lightbox shows `03 / 19` and nothing
else.

## Elsewhere (the two GIF cards)

**File:** `src/routes/index.tsx` → `Elsewhere()`

- **Notes:** `desk.gif` (typing hands), linking to the blog.
- **Say hello:** `night-block.gif` (lit windows), linking to email.

## Quote

**File:** `src/routes/index.tsx` → `Quote()`. The Spidey-mask GIF, the "Pinned above the desk"
kicker, the line with a scribbled word, and the attribution.

## Socials

**File:** `src/constants/profile.ts` → `socials`. Each entry has `label`, `handle`, `href` and an
`icon` (a simple-icons import or a hand-drawn `Glyph`). Keep an even number of entries: the
grid is two columns.

## Top bar

**File:** `src/components/SiteFrame.tsx` → `sections`

On the home page the bar shows a tab for each section. Each tab's `id` is a section id from
`index.tsx`. Keep them in page order.

- The tab for the section you're reading lights up as you scroll: a highlight glides under it,
  and a fainter one follows the pointer.
- Clicking a tab pins it until the scroll settles, so the highlight moves once, straight there.
- At 600px and narrower the tabs fold into one pill naming the current section. It opens a menu
  of every section plus Blog.
- On other pages the tabs become "← Back home".
- The Blog tab and the sound, GitHub and theme buttons are in the same file.

## Critters

**File:** `src/components/Critters.tsx`

Two paper critters hang on to the top border of the Activity strip, one at each end. It's a
`<Critters start={[a, b]} />` in `Activity()`, where `start` picks who sits there first; the
headroom comes from `#activity { padding-top }` in `styles.css`. They were tried on the footer and the About strip too,
but he wants them here, so keep them to this one spot. Their eyes follow the pointer,
and clicking one makes it duck and another pop up. The cast lives in `cast`: each has a body
`shape` on a 64 × 56 grid (the ledge is at y = 46), `base` and `shade` colours, eye positions,
and optional `details` (inside the body) and `extra` (steam, a leaf). Keep new ones on theme:
small, round, a little Lahore.

## Globe

**File:** `src/components/Globe.tsx`

A dot-matrix Earth rising out of the bottom of every page, under the footer. It turns slowly,
can be dragged to spin, and pins Lahore (`HOME`). Its colours are the `--globe-land`,
`--globe-sea` and `--globe-pin` tokens on `.globe` in `styles.css` (with light-theme values).
The coastlines are a small bitmap in `src/lib/land.ts`, made from Natural Earth's public-domain
land data; there's no reason to touch it.

## Sound

**File:** `src/lib/sound.ts`

Small sounds synthesised with the Web Audio API, so there are no audio files. They play only
when the visitor does something:

| Sound    | When                                   |
| -------- | -------------------------------------- |
| `tap`    | tabs, the phone menu, pulling a ticket |
| `toggle` | the theme switch                       |
| `open`   | opening a book (`close` to shut it)    |
| `flick`  | flicking a ticket off the pile         |
| `boop`   | poking the mascot                      |
| `duck`   | a critter ducking (`pop` coming up)    |
| `buzz`   | hovering the waving hand               |

Call `play("tap")` from any click handler. The speaker button in the top bar mutes everything,
and the choice is saved in `localStorage("sound")`. Keep sounds rare and quiet: one per
deliberate action, never on scroll or plain hover (the waving hand is the one exception).

## Mascot

**File:** `src/components/Mascot.tsx`

- **Phrases:** what he says when poked are in `phrases`. The first one is his greeting on load.
- **Art:** `public/mascot/hasnaat.webp`, plus the blink frame `hasnaat-blink.webp`. They're cut
  from the line drawing and must stay the same size so the blink lines up.

## Footer, title and SEO

- **Footer:** `src/components/SiteFrame.tsx` → `Footer()`. The line reads "Made with <3 and
  lots of chai."; the `<3` turns red and beats on hover.
- **Title, description, social card text, favicon:** `src/routes/__root.tsx`. If you replace
  `public/favicon.png`, bump its `?v=` number so browsers fetch the new one.
- **Photography page title and description:** the `head()` in `src/routes/photography.tsx`.

## Images and paths

- Always wrap public file paths in `asset()`, e.g. `asset("/logos/x.svg")`. On GitHub Pages the
  site lives under `/<repo>/`, and `asset()` adds that prefix. A bare `"/logos/x.svg"` works
  locally but breaks once deployed.
- **Each GIF has one job:**
  - `chai-shop.gif`: hero banner;
  - `desk.gif`: Notes card;
  - `night-block.gif`: contact card;
  - `spider-mask.gif`: the quote.

  The hero GIF stays as the original GIF. The user preferred it over a smoothed WebP version.

## Before you push

```sh
npx prettier --write src     # format
npx tsc --noEmit -p .        # types
npm run lint                 # eslint
npm run build:pages          # the same build GitHub runs
```

Then commit and push to `main`. GitHub Actions deploys it. See [the README](../README.md#deploy).
