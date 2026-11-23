# Design and how it works

How the site looks and moves, and the rules that keep it consistent. Read this before changing
layout, styles or motion. For content edits, see [CONTENT.md](CONTENT.md).

## The look

- **Layout:** one narrow column (`--frame: 768px`) between dotted gutters. Each section starts
  with a dashed rule and a tinted heading strip.
- **Margin notes:** handwritten notes in the gutter (Caveat) that write themselves in, then draw
  an arrow. Set them with `note` and `noteSide` on `<Section>`. They only show on wide screens.
- **Themes:** dark by default, plus light. The toggle in the top bar uses a view transition. The
  choice is saved in `localStorage("theme")`, and a script in `<head>` applies it before paint,
  so the page never flashes.
- **Motion:** subtle and purposeful. A few small "motion graphics" carry the personality:
  - the blinking mascot;
  - the paper critters on top of the Activity strip;
  - the turning globe under the footer;
  - marquee bulbs on the Movies board;
  - the camera viewfinder on the Photography page;
  - the live clocks.

  Nothing bounces for the sake of it.

## Tokens

All tokens are at the top of `src/styles.css`. Dark values are on `:root` and light values on
`:root[data-theme="light"]`. Always use the tokens, not raw colours, so both themes work.

| Token                                 | Use                                         |
| ------------------------------------- | ------------------------------------------- |
| `--bg`, `--fg`                        | page background, main text                  |
| `--muted`, `--faint`                  | secondary text, tertiary text               |
| `--line`, `--line-strong`             | hairlines, dashed section rules             |
| `--strip`, `--surface`, `--secondary` | heading strips, cards, pills and buttons    |
| `--primary`                           | links and focus rings                       |
| `--live`, `--amber`                   | the "now" badge and status dots             |
| `--h0`…`--h4`                         | contribution graph shades                   |
| `--ease-out`                          | **the** easing curve; use it for motion     |
| `--ease-spring`                       | overshoot; small UI flourishes only         |
| `--frame`, `--pad`                    | column width, side padding (16px on phones) |

## Type

All fonts load from Google Fonts in `src/routes/__root.tsx`.

| Font             | Variable       | Where                                                       |
| ---------------- | -------------- | ----------------------------------------------------------- |
| DM Sans          | `--font-sans`  | body and UI                                                 |
| Instrument Serif | `--font-serif` | the name, page titles, the greeting, book and ticket titles |
| Geist Mono       | `--font-mono`  | dates, labels, counters (`.mono`)                           |
| Caveat           | `--font-hand`  | margin notes                                                |

## Motion system

- **Scroll reveal:** add `data-reveal=""` to any element and it blurs, fades and slides in the
  first time it scrolls into view. `useReveal()` in `SiteFrame.tsx` sets `data-shown`. Stagger
  siblings with the `--rd` delay; `stagger(i)` in `index.tsx` gives 55ms steps. Elements that
  need their own entrance override `[data-reveal]`: photography tiles (`.ph-item`) wipe in
  instead of blurring.
- **Hero:** animates with pure CSS on first paint, so it shows even before JavaScript loads.
- **Text effects** in `src/components/TextFx.tsx`:
  - `InkText`: words ink in one by one, used for the name and page titles;
  - `Scribble`: a hand-drawn underline that draws itself;
  - `Shimmer`: a light sweep across text;
  - `Wave`: the waving hand.
- **Reduced motion:** a `prefers-reduced-motion` rule at the bottom of `styles.css` cuts every
  animation to near zero. Script-driven animations check it themselves (see `reduce()` in
  `Tickets.tsx`).
- **Smoothness rules** come from feedback on the movie tickets, so follow them for anything that
  moves a lot:
  - Use one curve, `cubic-bezier(0.22, 1, 0.36, 1)`, with no overshoot on big moves.
  - Never let an element jump layers (`z-index`) while it's visible. Fade it out first.
  - Give moving elements `will-change: transform, opacity`, so they slide as layers instead of
    repainting shadows, masks and blend modes on every frame.
  - Don't paint what can't be seen: set `visibility: hidden` deep in stacks.
  - Animate things out as well as in: keep menus mounted and toggle a `data-open` attribute
    (with `inert` while closed) instead of unmounting them, as `SectionMenu` does.

## Components

| Component               | What it is                                                               |
| ----------------------- | ------------------------------------------------------------------------ |
| `SiteFrame`             | top bar (tabs or phone menu, scroll spy), gutters, footer; scroll reveal |
| `Section`, `MarginNote` | a section with its heading strip and optional handwritten note           |
| `Mascot`                | the illustrated mascot: blinks, squishes when poked, talks in a bubble   |
| `Bookshelf`             | spines on a shelf: click one, it widens and fades into its real cover    |
| `Tickets` (`MovieDeck`) | pile of cinema tickets plus the "Now showing" board and the Bingers link |
| `Critters`              | paper critters on top of the Activity strip: eyes follow, click to swap  |
| `Globe`                 | dot-matrix Earth under the footer, pinned on Lahore; drag to spin        |
| `ContributionGraph`     | GitHub activity heatmap                                                  |
| `SpotifyEmbed`          | lazy Spotify player that follows the theme                               |
| `Icon`                  | `BrandIcon` (simple-icons and hand-drawn glyphs), arrows, sun and moon   |
| `TextFx`                | `InkText`, `Scribble`, `Shimmer`, `Wave`                                 |

`src/lib/`:

- `asset()` adds the GitHub Pages base path to public files;
- `theme.ts` handles the theme toggle and the no-flash script;
- `time.ts` has the Lahore clock and the visitor's greeting;
- `sound.ts` has the synthesised sound effects and the mute setting.

## How the movie tickets work

- **Ticket:** a poster panel above a perforated stub. The notches are cut with CSS masks, so the
  drop shadow sits on a wrapper (`.ticket-card`).
- **Print look:** each poster is printed as a grayscale image multiplied over the ticket's
  `accent`, with film grain on top. On hover the original colours fade in. Phones (no hover)
  show the colours straight away.
- **Pile:** every ticket sits in the same grid cell, and `pose(depth, index)` gives each one a
  slight, fixed angle by its depth. Flicking (Web Animations API) glides the top ticket left
  while it fades. It only drops behind the pile once invisible. Pulling a ticket fades it in from
  the same spot.
- **Series fan:** posters are positioned with `--o` (offset from the middle) and `--z`. Three
  posters put the first film in front; longer series form a hand of cards. The spread is shared
  out by `--n`, so any count fits.

## Sound

Sound is part of the personality, so it follows the same rules as motion: subtle and
intentional. Every effect is synthesised in `src/lib/sound.ts` (no files), lasts well under a
quarter of a second, and answers a deliberate action. The top bar's speaker mutes it all. See
[CONTENT.md](CONTENT.md#sound) for the list.

## Accessibility

- A skip link, real `<button>`s and `<a>`s, and visible focus rings.
- The current top-bar tab has `aria-current`.
- Live regions announce the shelf caption and the ticket counter.
- Every image has `alt` text, or `alt=""` when it's decorative. Cards hidden in the ticket pile
  are `inert`.
- Without JavaScript, everything marked `data-reveal` simply shows.

## Taste notes (from the user's feedback)

- **Less text:** no captions or descriptions on photos, and no intro copy on the photography
  page.
- **No ranking:** no numbers, ranks or ratings on the movies. The board uses colour dots instead.
- **Real assets:** real logos and icons for everything, and HD artwork, never pixelated
  thumbnails.
- **Cohesive treatments:** one visual language applied across a set, like the ticket print style.
- **Restrained motion:** smooth, subtle, a little personality, never janky or bouncy.
- **Sections stay compact:** if a list gets long, turn it into something interactive, like the
  shelf or the ticket pile, instead of a long grid.

## Known quirks

- Headless Chrome screenshots of URLs with a `#hash` render blank. That's a headless artifact;
  real browsers are fine. To check a section, screenshot the full page and crop it.
- Wikipedia's film posters are low resolution. Use TMDB (`scripts/fetch-poster.sh`).
- The helper scripts use macOS `sips`, which reads WebP but can't write it, so new posters and
  photos are saved as JPEG. Older posters are `.webp`; `poster()` accepts both.
