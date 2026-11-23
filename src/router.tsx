import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () =>
  createRouter({
    routeTree,
    // Matches vite's `base`, so the site works under /<repo>/ on GitHub Pages.
    basepath: import.meta.env.BASE_URL.replace(/\/$/, "") || "/",
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });
