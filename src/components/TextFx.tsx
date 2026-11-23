import type { CSSProperties, ReactNode } from "react";
import { haptic, play } from "@/lib/sound";

/** Words that ink themselves in, one after another, like a pen across paper. */
export function InkText({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <span className="ink" aria-label={text}>
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          className="ink-word"
          aria-hidden="true"
          style={{ "--ink-delay": `${delay + i * 260}ms` } as CSSProperties}
        >
          {word}
        </span>
      ))}
    </span>
  );
}

/** A hand-drawn underline that draws itself in, and again on hover. */
export function Scribble({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <span className="scribble" style={{ "--draw-delay": `${delay}ms` } as CSSProperties}>
      {children}
      <svg viewBox="0 0 200 8" preserveAspectRatio="none" aria-hidden="true">
        <path d="M2 5.5C40 2.5 120 2 198 4.5" pathLength={1} />
      </svg>
    </span>
  );
}

/** Text with a light sweeping across it. */
export function Shimmer({ children }: { children: ReactNode }) {
  return <span className="shimmer">{children}</span>;
}

/** Waving hand that waves again on hover. */
export function Wave() {
  // The waving-hand glyph from Google's Material Symbols (Apache 2.0), with its motion lines.
  // Hovering or tapping it waves and buzzes, like a phone going off on a desk.
  const buzz = () => {
    play("buzz");
    haptic(40);
  };
  return (
    <span className="wave" aria-hidden="true" onPointerEnter={buzz}>
      <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
        <path d="M23 17c0 3.31-2.69 6-6 6v-1.5c2.48 0 4.5-2.02 4.5-4.5H23zM1 7c0-3.31 2.69-6 6-6v1.5C4.52 2.5 2.5 4.52 2.5 7H1zm7.01-2.68-4.6 4.6c-3.22 3.22-3.22 8.45 0 11.67s8.45 3.22 11.67 0l7.07-7.07c.49-.49.49-1.28 0-1.77a1.25 1.25 0 0 0-1.77 0l-4.42 4.42-.71-.71 6.54-6.54c.49-.49.49-1.28 0-1.77s-1.28-.49-1.77 0l-5.83 5.83-.71-.71 6.89-6.89c.49-.49.49-1.28 0-1.77s-1.28-.49-1.77 0l-6.89 6.89-.69-.7 5.48-5.48c.49-.49.49-1.28 0-1.77s-1.28-.49-1.77 0l-7.62 7.62a4.003 4.003 0 0 1-.33 5.28l-.71-.71a3 3 0 0 0 0-4.24l-.35-.35 4.07-4.07c.49-.49.49-1.28 0-1.77a1.27 1.27 0 0 0-1.78.01z" />
      </svg>
    </span>
  );
}
