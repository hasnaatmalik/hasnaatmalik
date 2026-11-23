---
name: add-photos
description: Add, remove or reorder photos on Hasnaat's photography page and the home-page photo strip. Resizes originals (HEIC is fine) and mixes them into the single, uncategorised collection. Use when given new photos or asked to change the gallery or the home strip.
---

# Add photos

Photos live in `src/constants/gallery.ts`, and image files in `public/gallery/`.

The photography page is **one collection**: no categories or chapters, no numbers, no captions,
no text besides the title. Hasnaat asked for that explicitly. Never add groupings, labels or
"a random collection"-style copy.

## 1. Prepare each photo

```sh
scripts/prepare-photo.sh ~/Desktop/IMG_4821.HEIC hunza-sunset
```

This saves `public/gallery/hunza-sunset.jpg` at 1600px on the long edge and prints an entry with
its width and height. **Open the saved image** to:

- check it's the right way up;
- see what it shows, so you can write the alt text.

Use a short, descriptive, lowercase-dashed slug.

## 2. Place it

The list order is the page order. Mountains, trails and the city are deliberately mixed, so put
a new photo somewhere in the list where its neighbours look different from it. Don't append a
run of similar shots together.

## 3. Write the alt text

Write plain, specific alt text: what's in the frame, e.g. "Horses grazing in a meadow below a
pine-covered hill". It's for screen readers and **isn't shown on the page**.

## 4. Home page strip (optional)

`previewPhotos` near the top of `src/routes/index.tsx` lists the six photos on the home page by
slug. Swap one in only if he asks, or if the new photo is clearly a standout.

## 5. Verify

```sh
npx prettier --write src && npx tsc --noEmit -p . && npm run lint
```

Screenshot `/photography` (see `CLAUDE.md`) and check the new photo shows and nothing is
sideways. Lazy images below the fold may render as empty tiles headless; that's fine.

**Removing a photo:** delete its entry and its file.
