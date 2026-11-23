---
name: add-movie
description: Add, remove or reorder films in the Movies section of Hasnaat's portfolio (the pile of cinema tickets). Fetches the HD poster from TMDB, picks ticket colours and writes the entry, including whole series such as a trilogy as one ticket. Use when asked to add a movie or film, a franchise or series, or to change the movie list or the Bingers link.
---

# Add a movie

Films live in `src/constants/movies.ts`, and posters in `public/movies/`. The list order is the
order of the pile and the "Now showing" board. **It is not a ranking:** never add numbers, ranks
or ratings.

## 1. Pin down each film

Confirm the exact film, its release year, the director, and Hindi or English. Watch for remakes
and same-name films: _Love Aaj Kal_ means the 2009 original unless he says 2020. If it's
genuinely unclear which film he means, ask.

## 2. Find the TMDB id and fetch the poster

Search TMDB and read the id from the film's page URL:

```sh
curl -sL -A "Mozilla/5.0" "https://www.themoviedb.org/search/movie?query=The%20Intern" \
  | grep -oE 'href="/movie/[0-9]+[^"]*"' | head -5
# open the candidates; confirm title and year in each page's <title>
```

Then:

```sh
scripts/fetch-poster.sh 257211 the-intern     # → public/movies/the-intern.jpg (480×720)
```

The script prints the film title and year. Check it's the right one, then look at the image.
Never use Wikipedia posters: they're low resolution and look pixelated.

For a **series**, fetch every film's poster, in release order (`harry-potter-1` … `-8`).

## 3. Add the entry

Add it at the end of `movies` unless he gives a position:

```ts
{
  title: "The Intern",
  year: "2015",
  director: "Nancy Meyers",
  language: "English",
  posters: [poster("the-intern.jpg")],
  paper: "#ebe5d9",
  ink: "#1e1e1c",
  accent: "#8aa57a",
  row: "T",          // the title's initial
  seat: "15",        // short and fun: e.g. the year's last two digits
},
```

**For a series:**

- `posters`: all of them, in order;
- `series`: the badge, e.g. `"Trilogy · I II III"` or `"All eight films"`;
- `year`: a range like `"2001 — 2011"`;
- `director`: e.g. `"Columbus to Yates"` when it changed;
- `seat`: a range like `"1–8"`.

The ticket then reads "Admit three", "Admit eight" and so on, and the fan adapts to any count.

## 4. Pick the colours

The poster is printed in `accent` (grayscale multiplied over it) until it's hovered. The ticket
body is `paper`, with `ink` text.

- **Match the film's mood:** warm cream and orange for a sunny Bollywood film, jade and gold for
  _Crazy Rich Asians_, night purple and gold for _The Hangover_.
- **Contrast:** `paper` against `ink` must read easily. Use light paper with dark ink, or the
  reverse.
- **Accent:** mid-toned. Dark posters (_Harry Potter_) print dark, so lean lighter for them.
- **Neighbours:** check the films either side of it, and alternate light and dark tickets.

## 5. Verify

```sh
npx prettier --write src && npx tsc --noEmit -p . && npm run lint
```

Screenshot the home page (see `CLAUDE.md`) and crop the Movies section. The new film should be
on the board with its colour dot. To see its ticket on top, temporarily move it first in the
list, take the screenshot, and **restore the order**.

## Removing or reordering

- **Remove:** delete the entry and its poster file(s) in `public/movies/`.
- **Reorder:** move the entries. Keep the "In no particular order" copy.

## Bingers

The `bingers` export at the bottom of `movies.ts` (`handle`, `href`) drives the "Everything else
I've watched" card. The logo is `public/logos/bingers.svg`.
