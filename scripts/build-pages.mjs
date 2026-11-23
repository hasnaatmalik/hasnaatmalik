// Builds the static site for GitHub Pages into dist/client.
// BASE_PATH is "/" with a custom domain (public/CNAME) and "/<repo>/" otherwise.
import { execSync } from "node:child_process";
import { copyFileSync, existsSync, writeFileSync } from "node:fs";

const repo = (process.env.GITHUB_REPOSITORY ?? "").split("/")[1] ?? "portfolio";
const base =
  process.env.BASE_PATH ??
  (existsSync("public/CNAME") || repo.endsWith(".github.io") ? "/" : `/${repo}/`);

execSync("npx vite build", {
  stdio: "inherit",
  env: { ...process.env, GITHUB_PAGES: "true", BASE_PATH: base },
});
copyFileSync("dist/client/index.html", "dist/client/404.html"); // unknown URLs fall back to the app
writeFileSync("dist/client/.nojekyll", ""); // serve files/folders that start with "_" as-is
console.log(`GitHub Pages build ready in dist/client (base ${base})`);
