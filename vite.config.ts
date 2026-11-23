// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// `GITHUB_PAGES=true npm run build` writes a fully static site to dist/client.
// BASE_PATH is the URL prefix ("/" for a custom domain, "/<repo>/" for project pages).
const githubPages = process.env["GITHUB_PAGES"] === "true";
const base = process.env["BASE_PATH"] ?? "/";

export default defineConfig(
  githubPages
    ? {
        vite: { base },
        nitro: false,
        tanstackStart: {
          // Explicit pages (no link crawling): crawling would also "prerender" /cv.pdf and overwrite the real file.
          pages: [{ path: "/" }, { path: "/photography" }],
          prerender: { enabled: true, crawlLinks: false, autoSubfolderIndex: true },
        },
      }
    : {
        nitro: {
          preset: "vercel",
        },
      },
);
