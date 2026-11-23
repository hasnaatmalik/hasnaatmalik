/** Prefix a /public path with the deploy base (e.g. "/portfolio/" on GitHub Pages project sites). */
export const asset = (path: string) =>
  `${import.meta.env.BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
