# Hasnaat's portfolio: notes for Claude

A personal portfolio built with TanStack Start, React 19 and plain CSS. It's a static build on
GitHub Pages. The owner, Hasnaat, edits it through Claude Code, mostly to add content: films,
books, photos, projects and jobs.

## Where things are

- **Content is data:** it lives in `src/constants/*.ts`. Prefer editing data over components.
- **Home page:** `src/routes/index.tsx`, with one function per section, in page order.
- **Styles:** every style is in `src/styles.css`. Tokens are at the top, then one commented block
  per section. Plain CSS; Tailwind is loaded but unused.
- **Guides:** step-by-step guides for each kind of edit are in `.claude/skills/`. Use the matching
  skill: add-movie, add-book, add-photos, add-project, update-experience, update-profile, ship.
- **Docs:** full documentation is in `docs/CONTENT.md` (every editable thing) and `docs/DESIGN.md`
  (tokens, motion, components, taste notes). Keep them in sync when you change how something
  works.

## Rules

- **Paths:** wrap every public file path in `asset()` from `@/lib/asset`. Bare `/…` paths break on
  GitHub Pages.
- **Colours:** use the CSS tokens (`var(--fg)`, `var(--line)`…), never raw colours, so light and
  dark themes both work. The movie tickets and books have their own palettes on purpose.
- **Sound:** effects come from `play()` in `src/lib/sound.ts`, one per deliberate action. No
  audio files, and never on scroll.
- **Motion:** use `--ease-out`. For anything that moves a lot, follow the smoothness rules in
  `docs/DESIGN.md#motion-system`. Respect `prefers-reduced-motion`.
- **Comments:** comments explain why, in plain sentences, like the existing ones.
- **Dependencies:** don't add new ones without asking. Image work uses macOS `sips`, through
  `scripts/fetch-poster.sh` and `scripts/prepare-photo.sh`.
- **Git:** commit or push only when asked. Hasnaat commits straight to `main`, and pushing to
  `main` deploys.

## Hasnaat's taste

These come from his feedback, so respect them.

- **Less text:** no descriptions or captions on photos, and no intro copy on the photography page.
- **Photography is one collection:** no categories, chapters or numbering; only "Back home" in its
  top bar.
- **Movies:** in no particular order. No numbers, ranks or ratings.
- **Real assets:** real logos and icons for everything, and HD artwork (posters from TMDB, never
  Wikipedia thumbnails).
- **Cohesive and creative:** treatments that hold a set together, with subtle motion graphics.
  Nothing cluttered: long lists become interactive objects, like the shelf or the ticket pile.
- **Smooth motion:** never janky, never bouncy.
- **The hero GIF:** keep `public/gifs/chai-shop.gif` as the original GIF, never re-encoded or
  upscaled. The banner is a short strip (16 / 5.4); change its height, not its zoom.

## Verify every change

```sh
npx prettier --write src && npx tsc --noEmit -p . && npm run lint
```

For visual changes, run the dev server (`npm run dev -- --port 5199`) and screenshot it with
headless Chrome. Take the full page and crop it: `#hash` URLs render blank headless.

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu \
  --hide-scrollbars --force-device-scale-factor=2 --window-size=1100,5000 \
  --virtual-time-budget=14000 --screenshot="$SCRATCH/page.png" http://localhost:5199/
# $SCRATCH: your scratchpad directory; never write screenshots into the repo
```

Headless windows can't go narrower than about 500px. For phone widths, load the page in a
390px-wide `<iframe>` inside a local HTML file.
