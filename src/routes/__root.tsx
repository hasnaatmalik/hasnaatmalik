import { HeadContent, Link, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";

import Mascot from "@/components/Mascot";
import { asset } from "@/lib/asset";
import { themeInitScript } from "@/lib/theme";
import appCss from "../styles.css?url";

const description =
  "Hasnaat Malik is a software engineer in Lahore building AI systems and full-stack products. Shoots film on the side.";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Hasnaat Malik" },
      { name: "description", content: description },
      { name: "author", content: "Hasnaat Malik" },
      { name: "theme-color", content: "#0a0a0a", media: "(prefers-color-scheme: dark)" },
      { name: "theme-color", content: "#ffffff", media: "(prefers-color-scheme: light)" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Hasnaat Malik — Software Engineer" },
      { property: "og:description", content: description },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Caveat:wght@500&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: asset("/favicon.png") + "?v=5", type: "image/png" },
      { rel: "apple-touch-icon", href: asset("/apple-touch-icon.png") },
    ],
  }),
  shellComponent: RootShell,
  component: Outlet,
  notFoundComponent: NotFound,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <HeadContent />
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;filter:none!important;translate:none!important}`}</style>
        </noscript>
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <div className="not-found">
      <Mascot size={110} talk />
      <p className="mono muted">404</p>
      <h1>This page swung off somewhere.</h1>
      <Link to="/" className="text-link">
        Back home
      </Link>
    </div>
  );
}
