# Hasnaat Malik: portfolio

A personal site in one narrow column. An illustrated mascot blinks and talks when poked. Projects
are grouped by year, next to experience with company logos, a stack with brand icons, a live
GitHub graph, a bookshelf of real covers, a pile of cinema tickets for favourite films, a Spotify playlist and
a photography page. It has dark and light themes, and text blurs in and inks itself as you scroll.

Built with TanStack Start, React 19 and plain CSS. It's deployed as a static site on GitHub Pages.

## Run it

```sh
npm install
npm run dev        # then open the URL it prints
```

## Docs

| Read                               | When you want to                                                               |
| ---------------------------------- | ------------------------------------------------------------------------------ |
| [docs/CONTENT.md](docs/CONTENT.md) | change anything on the page: text, projects, jobs, books, films, photos, links |
| [docs/DESIGN.md](docs/DESIGN.md)   | change the look or motion, or understand how a component works                 |
| [CLAUDE.md](CLAUDE.md)             | (for Claude Code) project rules and the checks to run                          |

## Quick map: what to edit for…

| Change                           | File                                          | Guide                                        |
| -------------------------------- | --------------------------------------------- | -------------------------------------------- |
| email, GitHub, blog, Spotify     | `src/constants/profile.ts` → `profile`        | [Profile](docs/CONTENT.md#profile-and-links) |
| headline, bio, status badge      | `src/routes/index.tsx` → `Hero()`             | [Hero](docs/CONTENT.md#hero)                 |
| a project                        | `src/constants/projects.ts`                   | [Work](docs/CONTENT.md#work)                 |
| a job, a degree, a company logo  | `src/constants/experience.ts`, `public/logos` | [Experience](docs/CONTENT.md#experience)     |
| a stack chip or its icon         | `src/constants/profile.ts` → `stack`          | [Stack](docs/CONTENT.md#stack)               |
| a book                           | `src/constants/books.ts`                      | [Bookshelf](docs/CONTENT.md#bookshelf)       |
| a film or a series               | `src/constants/movies.ts`, `public/movies`    | [Movies](docs/CONTENT.md#movies)             |
| a photo                          | `src/constants/gallery.ts`, `public/gallery`  | [Photos](docs/CONTENT.md#photos)             |
| a social link                    | `src/constants/profile.ts` → `socials`        | [Socials](docs/CONTENT.md#socials)           |
| a top-bar tab                    | `src/components/SiteFrame.tsx` → `sections`   | [Top bar](docs/CONTENT.md#top-bar)           |
| what the mascot says             | `src/components/Mascot.tsx` → `phrases`       | [Mascot](docs/CONTENT.md#mascot)             |
| page title, description, favicon | `src/routes/__root.tsx`                       | [SEO](docs/CONTENT.md#footer-title-and-seo)  |
| colours, fonts, spacing          | top of `src/styles.css`                       | [Tokens](docs/DESIGN.md#tokens)              |

## Helper scripts (macOS)

```sh
scripts/fetch-poster.sh <tmdb-id> <slug>   # HD film poster → public/movies/<slug>.jpg
scripts/prepare-photo.sh <photo> <slug>    # resize a photo (HEIC ok) → public/gallery/<slug>.jpg
```

Both print the exact line to paste into the constants file.

## Claude Code skills

If you use Claude Code in this repo, these skills walk it through common updates step by step.
They live in `.claude/skills/`. Ask in plain words ("add Interstellar to my movies") or type the
name as a slash command.

| Skill                | Does                                                             |
| -------------------- | ---------------------------------------------------------------- |
| `/add-movie`         | finds the HD poster, picks ticket colours, adds a film or series |
| `/add-book`          | adds a book: official cover plus a spine to match                |
| `/add-photos`        | resizes photos and mixes them into the one collection            |
| `/add-project`       | adds a project under the right year                              |
| `/update-experience` | adds or updates a job, moves "current", fetches the company logo |
| `/update-profile`    | links, socials, stack icons, hero text, tabs, mascot lines, SEO  |
| `/ship`              | runs every check, builds like GitHub does, commits and pushes    |

## Project layout

```
src/
  routes/          index.tsx (home, one function per section), photography.tsx, __root.tsx (head, fonts, 404)
  components/      SiteFrame, Section, Mascot, Critters, Globe, Bookshelf, Tickets, ContributionGraph, SpotifyEmbed, Icon, TextFx
  constants/       the content: profile, projects, experience, books, movies, gallery
  lib/             asset() base-path helper, theme, time
  styles.css       all styles; tokens at the top, then one block per section
public/
  gifs/            chai-shop (hero), desk (Notes card), night-block (contact card), spider-mask (quote)
  mascot/          the mascot and its blink frame
  logos/           company and Bingers logos
  movies/          film posters (480×720)
  gallery/         photos (1600px long edge)
  cv.pdf, favicon.png, apple-touch-icon.png
scripts/           build-pages.mjs (GitHub Pages build), fetch-poster.sh, prepare-photo.sh
docs/              CONTENT.md, DESIGN.md
.claude/skills/    step-by-step skills for Claude Code
```

## Checks

```sh
npx prettier --write src
npx tsc --noEmit -p .
npm run lint
npm run build:pages     # the exact build GitHub runs; output in dist/client
```

## Deploy

Pushing to `main` deploys automatically: `.github/workflows/deploy.yml` runs `npm run
build:pages` and publishes `dist/client` to GitHub Pages.

First-time setup: in the GitHub repo, open **Settings → Pages** and set **Source** to **GitHub
Actions**.

The site is served at `https://<user>.github.io/<repo>/`, and every public path goes through
`asset()` so that prefix works. For a custom domain, add `public/CNAME` containing the domain; the
build then uses `/` as the base. A plain `npm run build` still produces a Vercel build.
