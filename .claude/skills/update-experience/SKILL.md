---
name: update-experience
description: Add or update jobs and education in Hasnaat's portfolio Experience section, including company logos, which role is current, and the hero bio that reads from it. Use when he starts a new job, changes role or title, leaves a company, or asks to fix an experience entry or logo.
---

# Update experience

Jobs and education live in `src/constants/experience.ts`, newest first, and logos in
`public/logos/`.

## 1. Write the entry

```ts
{
  company: "PRAID AI",
  role: "Application Engineer",
  period: "Nov 2026 — Present",        // em dash; "Mon YYYY — Mon YYYY" or "Mon — Mon YYYY"
  current: true,
  description: "Building across an AI healthcare platform, mainly Scribe, the voice dictation and reporting product.",
  href: "https://www.praid-ai.com/",
  logo: asset("/logos/praid-ai.svg"),
},
```

**The description:** one sentence on what he does there, written like a thoughtful engineer: what
he builds or owns and for what, with no buzzwords. Keep the facts he gives you, and generalise
when he asks.

**Exactly one entry has `current: true`.** The hero bio reads "{role} at {company}, working on
…" from it.

**On a new job:**

1. Set the old entry's `current: false` and close its `period` (e.g. "Sept — Nov 2026").
2. Add the new job at the top with `current: true`.
3. Update the words after the comma in `Hero()` in `src/routes/index.tsx` ("working on AI for
   healthcare") to fit the new role.

## 2. Get the company logo

Logos sit on a white tile, so the company's normal full-colour mark works best.

```sh
curl -sL -A "Mozilla/5.0" https://company.com/ | grep -oiE '<link[^>]+icon[^>]*>'
```

- **Prefer** their `favicon.svg`. Download it and look at it before using it.
- **Otherwise** use the largest PNG icon (192–512px), then `sips -Z 160 file.png` to resize it.
- **Wordmark only:** a wide wordmark with an emblem (like FAST-NUCES) needs the emblem cropped
  out into a square. Ask for help or a better file if you can't crop it cleanly.
- **Can't find one:** some sites block scripts, so try browser-like headers, or Google's favicon
  service (`https://www.google.com/s2/favicons?domain=…&sz=256`), though it's often tiny. If it's
  still missing, ask Hasnaat to send the logo. Never invent one.

Save it as `public/logos/<company>.svg|png`. Set `logo: asset("/logos/…")`, and make sure
`asset` is imported at the top of the file.

## 3. Verify

```sh
npx prettier --write src && npx tsc --noEmit -p . && npm run lint
```

Screenshot the home page (see `CLAUDE.md`). Check the Experience logos are crisp and centred on
their tiles, and the hero bio reads naturally.
