import { useEffect, useRef, useState, type CSSProperties } from "react";
import { asset } from "@/lib/asset";
import { play } from "@/lib/sound";

const phrases = [
  "say hi, I don't bite.",
  "chai first, then code.",
  "it works on my machine.",
  "salaam!",
  "one more commit…",
  "ship it.",
];

interface MascotProps {
  /** Rendered width in px. */
  size: number;
  /** Speech bubble on click (and once on load when `greet` is set). */
  talk?: boolean;
  greet?: boolean;
  className?: string;
  style?: CSSProperties;
  label?: string;
}

/** Hasnaat, drawn. Blinks now and then, squashes when poked, and occasionally has something to say. */
export default function Mascot({
  size,
  talk = false,
  greet = false,
  className = "",
  style,
  label = "Hasnaat, illustrated",
}: MascotProps) {
  const [pokes, setPokes] = useState(0);
  const [bubble, setBubble] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const say = (text: string) => {
    window.clearTimeout(timer.current);
    setBubble(text);
    timer.current = window.setTimeout(() => setBubble(null), 2600);
  };

  useEffect(() => {
    if (!greet) return;
    const t = window.setTimeout(() => say(phrases[0]!), 1300);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(timer.current);
    };
  }, [greet]);

  const poke = () => {
    play("boop");
    setPokes((n) => n + 1);
    if (talk) say(phrases[(pokes + 1) % phrases.length]!);
  };

  const art = (
    <span className="mascot-art" key={pokes} data-poked={pokes > 0}>
      <img src={asset("/mascot/hasnaat.webp")} alt="" width={437} height={480} draggable={false} />
      <img
        className="mascot-blink"
        src={asset("/mascot/hasnaat-blink.webp")}
        alt=""
        width={437}
        height={480}
        draggable={false}
      />
    </span>
  );

  return (
    <span className={`mascot ${className}`} style={{ ...style, width: size }}>
      {talk ? (
        <button
          type="button"
          className="mascot-hit"
          onClick={poke}
          aria-label={`${label}. Poke him.`}
        >
          {art}
        </button>
      ) : (
        <span className="mascot-hit" role="img" aria-label={label}>
          {art}
        </span>
      )}
      {talk && (
        <span className="bubble" data-show={bubble !== null} aria-live="polite">
          {bubble ?? ""}
        </span>
      )}
    </span>
  );
}
