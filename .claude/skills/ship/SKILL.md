---
name: ship
description: Check, build and publish Hasnaat's portfolio. Runs formatting, type checks and lint, does the exact GitHub Pages build, then commits and pushes to main, which deploys. Use when he says ship, deploy, publish, push or commit, or asks if the site is ready.
---

# Ship

Pushing to `main` deploys: `.github/workflows/deploy.yml` builds with `npm run build:pages` and
publishes to GitHub Pages. Only commit or push when Hasnaat asks.

## 1. Check

```sh
npx prettier --write src
npx tsc --noEmit -p .
npm run lint
npm run build:pages        # the same build GitHub runs; output in dist/client
```

Fix anything that fails before going on. If the build fails, report the error output; don't
guess.

## 2. Review what's going out

```sh
git status --short
git diff --stat
```

- **No stray files:** no screenshots, `_test` files, or `.env` files. `dist/` is ignored.
- **Large files:** new images should be posters around 50–110KB and photos around 200–500KB. Look
  into anything over 2MB.

## 3. Commit

He commits straight to `main`. Write a short, plain message that says what changed for a visitor,
e.g. "Add The Intern and the Harry Potter series to movies". End it with the attribution line the
session asks for.

```sh
git add <the specific files>
git commit -m "…"
```

Push only if he asked to ship, deploy or push:

```sh
git push origin main
```

## 4. After pushing

The deploy takes about two minutes. Check it with `gh run list --limit 1`, or on the repo's
Actions tab. Give him the result, and the error output if it failed.
