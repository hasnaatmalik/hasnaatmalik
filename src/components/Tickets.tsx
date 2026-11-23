import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { ArrowRight, ArrowUpRight } from "@/components/Icon";
import { bingers, movies, type Movie } from "@/constants/movies";
import { asset } from "@/lib/asset";
import { play } from "@/lib/sound";

const counts = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const pad = (n: number) => String(n).padStart(2, "0");

/** Each ticket's own slight angle in the pile, so it looks dropped on a desk, not stacked by a machine. */
const jitter = [-5, 4, -3, 6, -6, 3, -4, 5];
/** How many tickets show under the top one; the rest wait out of sight. */
const VISIBLE = 4;

function pose(depth: number, index: number) {
  if (depth === 0) return "translate(0px, 0px) rotate(0deg) scale(1)";
  const d = Math.min(depth, VISIBLE - 1);
  const side = index % 2 ? 1 : -1;
  return `translate(${side * (3 + d * 3)}px, ${-d * 8}px) rotate(${jitter[index % jitter.length]! * (0.6 + d * 0.2)}deg) scale(${1 - d * 0.035})`;
}
/** Just off the pile to the left: where a ticket fades out to, and where a pulled one fades in from. */
const aside = "translate(-34%, 2%) rotate(-8deg) scale(0.97)";
/** One smooth curve for everything: quick to start, long gentle settle, no overshoot. */
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/** One cinema ticket: a poster (or a fan of them for a series) above a perforated stub. */
function Ticket({ movie }: { movie: Movie }) {
  return (
    <article className="ticket-card" aria-label={`${movie.title}, ${movie.year}`}>
      <div
        className="ticket-art"
        data-count={movie.posters.length}
        data-fan={movie.posters.length > 1 ? "" : undefined}
        style={{ "--n": movie.posters.length } as CSSProperties}
      >
        {movie.posters.map((src, p) => {
          const n = movie.posters.length;
          // Three cards: the first film in front, sequels splayed behind. More: a hand of cards, in order.
          const { o, z } =
            n === 3 ? { o: [0, -1, 1][p]!, z: 3 - p } : { o: p - (n - 1) / 2, z: p + 1 };
          return (
            <span key={src} className="poster" style={{ "--o": o, "--z": z } as CSSProperties}>
              <img className="poster-print" src={src} alt="" width={480} height={720} />
              <img className="poster-color" src={src} alt="" width={480} height={720} />
            </span>
          );
        })}
        {movie.series && <span className="ticket-badge mono">{movie.series}</span>}
      </div>
      <div className="ticket-stub">
        <p className="ticket-top mono">
          <span>Admit {counts[movie.posters.length - 1] ?? movie.posters.length}</span>
          <span>{movie.language}</span>
        </p>
        <h3 className="ticket-title">{movie.title}</h3>
        <p className="ticket-meta mono">
          {movie.year} · {movie.director}
        </p>
        <div className="ticket-foot" aria-hidden="true">
          <span className="ticket-seat mono">
            <span>Row</span>
            <b>{movie.row}</b>
          </span>
          <span className="ticket-seat mono">
            <span>Seat</span>
            <b>{movie.seat}</b>
          </span>
          <Barcode movie={movie} />
        </div>
      </div>
    </article>
  );
}

/**
 * Favourite films as a pile of ticket stubs beside a "now showing" board. Click the top ticket
 * (or use the arrows) to flick it to the back of the pile; pick a title on the board to pull
 * that ticket out.
 */
export default function MovieDeck() {
  const [active, setActive] = useState(0);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const n = movies.length;
  const reduce = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const show = (next: number, direction: "toss" | "pull") => {
    const target = ((next % n) + n) % n;
    if (target === active) return;
    play(direction === "toss" ? "flick" : "tap");
    const fast = reduce();
    if (direction === "toss") {
      // The top ticket glides off to the left and fades away. It's invisible before it drops
      // behind the pile, so it never pops through the other tickets.
      const el = cards.current[active];
      el?.getAnimations().forEach((a) => a.finish());
      el?.animate(
        [
          { transform: pose(0, active), opacity: 1, zIndex: n + 1, visibility: "visible" },
          { transform: aside, opacity: 0, zIndex: n + 1, visibility: "visible", offset: 0.62 },
          { transform: pose(VISIBLE, active), opacity: 0, zIndex: 0, offset: 0.63 },
          { transform: pose(VISIBLE, active), opacity: 0, zIndex: 0 },
        ],
        { duration: fast ? 1 : 620, easing: "cubic-bezier(0.4, 0, 0.2, 1)" },
      );
    } else {
      // The chosen ticket fades in from the left and settles on top of the pile.
      const el = cards.current[target];
      el?.getAnimations().forEach((a) => a.finish());
      el?.animate(
        [
          { transform: aside, opacity: 0, zIndex: n + 1 },
          { transform: pose(0, target), opacity: 1, zIndex: n + 1 },
        ],
        { duration: fast ? 1 : 650, easing: EASE },
      );
    }
    setActive(target);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") show(active + 1, "toss");
    else if (e.key === "ArrowLeft") show(active - 1, "pull");
    else return;
    e.preventDefault();
  };

  return (
    <div className="cinema">
      <div className="deck-wrap" data-reveal="">
        <div
          className="deck"
          role="group"
          aria-roledescription="carousel"
          aria-label="Favourite movies"
          tabIndex={0}
          onKeyDown={onKeyDown}
        >
          {movies.map((movie, i) => {
            const depth = (i - active + n) % n;
            return (
              <div
                key={movie.title}
                ref={(el) => {
                  cards.current[i] = el;
                }}
                className="ticket"
                data-top={depth === 0 || undefined}
                aria-hidden={depth !== 0}
                inert={depth !== 0}
                onClick={() => depth === 0 && show(active + 1, "toss")}
                style={
                  {
                    "--paper": movie.paper,
                    "--ink": movie.ink,
                    "--accent": movie.accent,
                    transform: pose(depth, i),
                    zIndex: n - depth,
                    opacity: depth < VISIBLE ? 1 : 0,
                    // Deep in the pile there's nothing to see, so don't paint it.
                    visibility: depth > VISIBLE ? "hidden" : "visible",
                  } as CSSProperties
                }
              >
                <Ticket movie={movie} />
              </div>
            );
          })}
        </div>
        <div className="deck-controls">
          <button
            type="button"
            className="rail-btn rail-btn-prev"
            onClick={() => show(active - 1, "pull")}
            aria-label="Previous ticket"
          >
            <ArrowRight size={13} />
          </button>
          <span className="mono" aria-live="polite">
            {pad(active + 1)} <span className="muted">/ {pad(n)}</span>
          </span>
          <button
            type="button"
            className="rail-btn"
            onClick={() => show(active + 1, "toss")}
            aria-label="Next ticket"
          >
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      <div className="board" data-reveal="" style={{ "--rd": "120ms" } as CSSProperties}>
        <p className="board-head mono">
          <span className="bulbs" aria-hidden="true">
            {Array.from({ length: 5 }, (_, b) => (
              <i key={b} style={{ "--b": b } as CSSProperties} />
            ))}
          </span>
          Now showing
          <span className="muted">{n} favourites</span>
        </p>
        <ol className="board-list">
          {movies.map((movie, i) => (
            <li key={movie.title}>
              <button
                type="button"
                className="board-row"
                aria-current={i === active || undefined}
                onClick={() => show(i, "pull")}
                style={{ "--accent": movie.accent } as CSSProperties}
              >
                <span className="board-dot" aria-hidden="true" />
                <span className="board-title">
                  {movie.title}
                  {movie.posters.length > 1 && (
                    <span className="board-count mono">×{movie.posters.length}</span>
                  )}
                </span>
                <span className="board-leader" aria-hidden="true" />
                <span className="board-year mono">{movie.year.slice(0, 4)}</span>
              </button>
            </li>
          ))}
        </ol>
        <a className="bingers" href={bingers.href} target="_blank" rel="noopener noreferrer">
          <img src={asset("/logos/bingers.svg")} alt="" width={34} height={34} />
          <span className="bingers-text">
            Everything else I've watched
            <span className="mono muted">{bingers.handle} on Bingers</span>
          </span>
          <ArrowUpRight size={14} />
        </a>
      </div>
    </div>
  );
}

/** A barcode that's unique to each film: bar widths come from the title's letters. */
function Barcode({ movie }: { movie: Movie }) {
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  for (const ch of movie.title.replace(/\s/g, "") + movie.year) {
    const code = ch.charCodeAt(0);
    const w = 1 + (code % 3);
    bars.push({ x, w });
    x += w + 1 + ((code >> 2) % 2);
    if (x > 44) break;
  }
  return (
    <svg className="ticket-barcode" viewBox={`0 0 ${x} 20`} preserveAspectRatio="none">
      {bars.map((b) => (
        <rect key={b.x} x={b.x} width={b.w} height="20" fill="currentColor" />
      ))}
    </svg>
  );
}
