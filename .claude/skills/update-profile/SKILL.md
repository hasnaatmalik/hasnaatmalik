---
name: update-profile
description: Update the general bits of Hasnaat's portfolio — contact links, socials, the Stack chips and their icons, the hero headline/bio/status badge, About bullets, the Spotify playlist, the top-bar tabs, the mascot's phrases, the critters, sound effects, the footer, page title/description/favicon, and the résumé. Use for any site-wide text or link change that isn't a movie, book, photo, project or job.
---

# Update profile, links and site text

| What                                     | Where                                              |
| ---------------------------------------- | -------------------------------------------------- |
| email, GitHub, blog, Spotify             | `src/constants/profile.ts` → `profile`             |
| social links                             | `src/constants/profile.ts` → `socials`             |
| stack chips and icons                    | `src/constants/profile.ts` → `stack`               |
| headline, bio, "Open to…" badge          | `src/routes/index.tsx` → `Hero()`                  |
| About bullets                            | `src/routes/index.tsx` → `About()`                 |
| Notes and contact cards, the quote       | `src/routes/index.tsx` → `Elsewhere()`, `Quote()`  |
| margin notes on sections                 | the `note` prop on each `<Section>` in `index.tsx` |
| top-bar tabs                             | `src/components/SiteFrame.tsx` → `sections`        |
| footer line                              | `src/components/SiteFrame.tsx` → `Footer()`        |
| mascot phrases                           | `src/components/Mascot.tsx` → `phrases`            |
| critters on the Activity strip           | `src/components/Critters.tsx` → `cast`             |
| footer globe (pin, colours)              | `src/components/Globe.tsx`, `.globe` in styles.css |
| sound effects                            | `src/lib/sound.ts` → `play()`                      |
| title, description, social card, favicon | `src/routes/__root.tsx`                            |
| résumé                                   | replace `public/cv.pdf` and keep the name          |

## Icons for stack chips and socials

Every chip and social link needs a real icon.

1. **Look in simple-icons first:** `ls node_modules/simple-icons/icons | grep -i docker`. Import it
   as `si` + PascalCase slug: `import { siDocker } from "simple-icons"`.
2. **Not there?** Draw a `Glyph` in `profile.ts` on a 24×24 grid, like `pinecone`, `groq`, `rag`
   and `llm`:
   - `path`: the SVG path;
   - `hex`: the brand colour, shown on hover; near-black colours are skipped automatically;
   - `stroke: true`: for line drawings.

   Base it on the real brand mark. Render it large in headless Chrome to check it before using it.

Socials are a two-column grid, so keep an even number of entries.

## Top-bar tabs

`sections` in `SiteFrame.tsx` lists `{ id, label }` in page order. Each `id` must match a
section id in `index.tsx`. The tab for the section on screen lights up automatically. At 600px
and narrower the tabs fold into a menu pill, which picks up the same list. If the bar gets
crowded at tablet widths with a new tab, raise that 600px breakpoint in `styles.css`
("Small screens") rather than shrinking the text.

## Writing voice

Hasnaat's copy is plain, warm and specific: first person, short sentences, no buzzwords, a little
humour. Read the existing copy before writing, and keep each text the same length as the one it
replaces unless he asks for more. He prefers less text over more.

## Verify

```sh
npx prettier --write src && npx tsc --noEmit -p . && npm run lint
```

Screenshot the changed area (see `CLAUDE.md`), in both themes if colours changed. Use the theme
toggle, or set `localStorage.theme`.
