import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

/**
 * Runs in <head> before first paint so there is no flash of the wrong theme.
 * An explicit choice is remembered; otherwise the site follows the system.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="dark"}})()`;

const read = (): Theme =>
  typeof document !== "undefined" && document.documentElement.dataset["theme"] === "light"
    ? "light"
    : "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(read());
    // Keep every subscriber (toggle, Spotify embed) in sync.
    const observer = new MutationObserver(() => setTheme(read()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = read() === "dark" ? "light" : "dark";
    const apply = () => {
      document.documentElement.dataset["theme"] = next;
      try {
        localStorage.setItem("theme", next);
      } catch {
        /* private mode: the choice just isn't remembered */
      }
    };
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (doc.startViewTransition && !reduced) doc.startViewTransition(apply);
    else apply();
  }, []);

  return { theme, toggle };
}
