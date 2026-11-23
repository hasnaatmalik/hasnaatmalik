---
name: add-project
description: Add, edit or remove a project in the Work section of Hasnaat's portfolio, where projects are grouped by year with an optional "new" badge. Use when asked to add a project, update a project's link, stack or description, or mark something new.
---

# Add a project

Projects live in `src/constants/projects.ts`. The page groups them under year folders, newest
first. Within a year, rows follow the order in the file.

## 1. Gather the details

Collect the name, a link (live site or GitHub repo), the year, the stack, and what it does. If he
gives a repo, read its README to get the facts right.

## 2. Write the entry

```ts
{
  name: "Munshi",
  tagline: "FBR-compliant e-invoicing",   // ≤ ~5 words, shown on the row
  description:
    "Desktop e-invoicing app for Pakistani businesses, compliant with FBR's digital invoicing.",
  stack: ["React", "Tauri", "Rust", "SQLite"],
  href: "https://munshi-one.vercel.app/",
  year: 2026,
  isNew: true,                            // optional: "new" badge for the latest thing
},
```

- **`tagline`:** what it is, in a few plain words, not marketing.
- **`description`:** one sentence about what it does and who it's for. It shows when the row is
  opened.
- **`stack`:** 3–4 main technologies, using their usual names.
- **`isNew`:** at most one or two projects should be new. Remove the badge from older ones when
  adding a new one.

Put the most important project of a year first. A new year starts a new folder automatically.

## 3. Verify

```sh
npx prettier --write src && npx tsc --noEmit -p . && npm run lint
```

Screenshot the home page (see `CLAUDE.md`) and crop Work. Check the tagline fits on one row at
desktop width.
