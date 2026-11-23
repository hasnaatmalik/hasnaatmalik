import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Link } from "@tanstack/react-router";
import { siGithub } from "simple-icons";
import { ArrowRight, ArrowUpRight, BrandIcon, Moon, Sun } from "@/components/Icon";
import Globe from "@/components/Globe";
import Mascot from "@/components/Mascot";
import { profile } from "@/constants/profile";
import { useLahoreTime } from "@/lib/time";
import { useTheme } from "@/lib/theme";
import { play, setMuted, useMuted } from "@/lib/sound";

/**
 * Tabs in the top bar on the home page. Each `id` is a section id in src/routes/index.tsx;
 * add a line here to give a new section a tab (keep them in page order).
 */
const sections = [
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "books", label: "Books" },
  { id: "movies", label: "Movies" },
  { id: "music", label: "Music" },
  { id: "photos", label: "Photos" },
];

/**
 * Scroll spy: the tab for whichever section you're reading lights up. A section counts as
 * "current" once its top passes 40% of the way down the screen.
 *
 * Clicking a tab pins it until the smooth scroll settles, so the highlight glides once
 * straight to the target instead of stepping through every section on the way.
 */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);
  const pinned = useRef<string | null>(null);
  const settle = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (pinned.current) return;
      const line = window.innerHeight * 0.4;
      let current: string | null = null;
      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    // Each scroll event pushes the unpin back; once scrolling stops, the spy takes over again.
    const onScroll = () => {
      if (pinned.current) {
        window.clearTimeout(settle.current);
        settle.current = window.setTimeout(() => {
          pinned.current = null;
          update();
        }, 140);
      }
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settle.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [enabled]);

  const jump = (id: string) => {
    pinned.current = id;
    setActive(id);
    // If the page is already there, no scroll event fires, so unpin on a timer as well.
    window.clearTimeout(settle.current);
    settle.current = window.setTimeout(() => (pinned.current = null), 900);
  };
  return [active, jump] as const;
}

/** Blur-in on scroll: anything marked `data-reveal` sharpens into place the first time it's seen. */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-shown])");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.setAttribute("data-shown", ""));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-shown", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function SiteFrame({
  children,
  home = false,
}: {
  children: ReactNode;
  home?: boolean;
}) {
  const { theme, toggle } = useTheme();
  const muted = useMuted();
  useReveal();
  const [active, jump] = useActiveSection(home);
  return (
    <div className="page">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="gutter gutter-left" aria-hidden="true" />
      <div className="gutter gutter-right" aria-hidden="true" />

      <header className="topbar">
        <nav className="topbar-nav" aria-label="Site">
          <Link to="/" className="logo" aria-label="Hasnaat Malik, home">
            <Mascot size={24} />
          </Link>
          {home ? (
            <>
              <Tabs active={active} onJump={jump} />
              <SectionMenu active={active} onJump={jump} />
            </>
          ) : (
            <Link to="/" className="pill pill-back">
              <span className="pill-back-arrow" aria-hidden="true">
                <ArrowRight size={13} />
              </span>
              Back home
            </Link>
          )}
          {/* Only the home page gets the Blog pill; elsewhere the way out is "Back home". */}
          {home && (
            <a
              href={profile.blog}
              className="pill pill-blog"
              target="_blank"
              rel="noopener noreferrer"
            >
              Blog
            </a>
          )}
        </nav>
        <div className="topbar-tools">
          <button
            type="button"
            className="tool"
            aria-pressed={!muted}
            aria-label={muted ? "Turn sounds on" : "Turn sounds off"}
            onClick={() => {
              setMuted(!muted);
              // Confirm with a click when sound comes back on, so you know it works.
              if (muted) play("tap");
            }}
          >
            <Speaker muted={muted} />
          </button>
          <a
            href={profile.github}
            className="tool"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub (opens in a new tab)"
          >
            <BrandIcon glyph={siGithub} size={15} />
          </a>
          <button
            type="button"
            className="tool"
            onClick={() => {
              play("toggle");
              toggle();
            }}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            <span className="tool-flip" data-theme-icon={theme}>
              <Sun />
              <Moon />
            </span>
          </button>
        </div>
      </header>

      <div className="frame">
        <main id="main" className="frame-main">
          {children}
        </main>
        <Footer />
        <Globe />
      </div>
    </div>
  );
}

type NavProps = { active: string | null; onJump: (id: string) => void };

/** Where a tab sits inside the bar, as styles for a highlight laid over it. */
function over(tab: HTMLElement | null | undefined, shown: CSSProperties = {}): CSSProperties {
  return tab
    ? { ...shown, width: tab.offsetWidth, transform: `translateX(${tab.offsetLeft}px)` }
    : { opacity: 0 };
}

/**
 * Wide screens: every tab in one bar. A solid highlight glides to the section you're reading,
 * and a fainter one follows the pointer, so the bar feels like one object rather than six links.
 */
function Tabs({ active, onJump }: NavProps) {
  const bar = useRef<HTMLDivElement>(null);
  const [glow, setGlow] = useState<CSSProperties>({ opacity: 0 });
  const [hover, setHover] = useState<CSSProperties>({ opacity: 0 });

  // useLayoutEffect so the highlight is placed before paint and never flashes in the wrong spot.
  const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
  useIsoLayoutEffect(() => {
    const place = () => {
      const tab = active ? bar.current?.querySelector<HTMLElement>(`[data-tab="${active}"]`) : null;
      setGlow(tab ? over(tab, { opacity: 1 }) : (g) => ({ ...g, opacity: 0 }));
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  return (
    <div
      className="tabs"
      ref={bar}
      // Leaving the bar fades the hover highlight where it is, rather than sliding it home.
      onPointerLeave={() => setHover((h) => ({ ...h, opacity: 0 }))}
    >
      <span className="tabs-hover" style={hover} aria-hidden="true" />
      <span className="tabs-glow" style={glow} aria-hidden="true" />
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="tab"
          data-tab={s.id}
          aria-current={active === s.id ? "location" : undefined}
          onPointerEnter={(e) =>
            setHover((h) => ({
              ...over(e.currentTarget, { opacity: 1 }),
              // The first time in, appear in place instead of sliding in from the left edge.
              transition: h.opacity ? undefined : "opacity 0.2s",
            }))
          }
          onClick={() => {
            play("tap");
            onJump(s.id);
          }}
        >
          {s.label}
        </a>
      ))}
    </div>
  );
}

/** Phones: one pill naming the current section, opening a menu of all of them. */
function SectionMenu({ active, onJump }: NavProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const current = sections.find((s) => s.id === active);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="section-menu" ref={root}>
      <button
        type="button"
        className="pill menu-trigger"
        aria-expanded={open}
        aria-controls="section-menu-list"
        onClick={() => {
          play("tap");
          setOpen((o) => !o);
        }}
      >
        <span key={current?.id ?? "menu"} className="menu-label">
          {current?.label ?? "Menu"}
        </span>
        <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true" className="menu-chevron">
          <path
            d="M3 4.5 6 7.5 9 4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {/* Always mounted, so it can animate closed as well as open; `inert` keeps it out of
          reach while hidden. */}
      <div className="menu" id="section-menu-list" data-open={open || undefined} inert={!open}>
        {sections.map((s, i) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="menu-item"
            style={{ "--i": i } as CSSProperties}
            aria-current={active === s.id ? "location" : undefined}
            onClick={() => {
              play("tap");
              onJump(s.id);
              setOpen(false);
            }}
          >
            {s.label}
          </a>
        ))}
        <a
          href={profile.blog}
          className="menu-item menu-item-out"
          style={{ "--i": sections.length } as CSSProperties}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
        >
          Blog <ArrowUpRight size={13} />
        </a>
      </div>
    </div>
  );
}

/** A speaker, with sound waves that fold away when muted. */
function Speaker({ muted }: { muted: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="15"
      height="15"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="speaker"
      data-muted={muted || undefined}
    >
      <path d="M2.5 6.2h2.2L8 3.4v9.2L4.7 9.8H2.5z" />
      <path className="speaker-wave" d="M10.4 6.1a2.6 2.6 0 0 1 0 3.8" />
      <path className="speaker-wave speaker-wave-far" d="M12.2 4.4a5 5 0 0 1 0 7.2" />
      <path className="speaker-off" d="m10.6 6.2 3.4 3.6m0-3.6-3.4 3.6" />
    </svg>
  );
}

function Footer() {
  const time = useLahoreTime();
  return (
    <footer className="footer">
      <p>
        Made with <span className="heart">&lt;3</span> and lots of chai.
      </p>
      <p className="footer-meta mono">
        <span>© {new Date().getFullYear()} Hasnaat Malik</span>
        <span aria-hidden="true">·</span>
        <span>{time ? `${time.label} in Lahore` : "Lahore, PK"}</span>
      </p>
    </footer>
  );
}
