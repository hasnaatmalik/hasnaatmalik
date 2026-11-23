import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { haptic, play } from "@/lib/sound";

/**
 * Little paper critters hanging on to the top of the Activity strip, holding on with both hands. Their
 * eyes follow the pointer; click one and it ducks below the edge and someone else pops up.
 * The cast is a Lahore street-food-and-weather crew: chai, samosa, patang, mango and a
 * monsoon raindrop.
 *
 * Each critter is drawn on a 64 × 56 grid. The rule sits at y = 46; anything below is hidden,
 * so bodies just run off the bottom.
 */
interface Critter {
  id: string;
  name: string;
  /** Body colour, the darker shade printed under it, and the outline. */
  base: string;
  shade: string;
  shape: ReactNode;
  eyes: { left: [number, number]; right: [number, number]; happy?: boolean };
  /** Drawn over the body, inside the grain. */
  details?: ReactNode;
  /** Drawn over everything, outside the body (steam, leaves). */
  extra?: ReactNode;
}

const cast: Critter[] = [
  {
    id: "chai",
    name: "the cup of chai",
    base: "#ead8bb",
    shade: "#b9a07a",
    shape: (
      <>
        <path d="M14.5 21.5c0-1.4 1.1-2.5 2.5-2.5h30c1.4 0 2.5 1.1 2.5 2.5L47 58H17Z" />
        <path
          d="M49 27.5c5.5-.6 8.5 2.4 7.6 6.6-.8 3.6-4.4 5.6-9.4 5.2"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          className="critter-stroke"
        />
      </>
    ),
    details: <path d="M15.4 22.6h33.2l-.3 4.4H15.7Z" fill="#a8703f" opacity=".85" />,
    eyes: { left: [27, 34], right: [37, 34] },
    extra: (
      <g className="critter-steam" fill="none" strokeWidth="1.6" strokeLinecap="round">
        <path d="M26 14c-2-2.4 2-3.6 0-6.4" />
        <path d="M33 13c-2-2.4 2-3.6 0-6.4" />
        <path d="M40 14c-2-2.4 2-3.6 0-6.4" />
      </g>
    ),
  },
  {
    id: "samosa",
    name: "the samosa",
    base: "#e2a84f",
    shade: "#a8732c",
    shape: <path d="M29.2 10.4c1.3-2.3 4.3-2.3 5.6 0L56 50c1 2 .5 8-2 8H10c-2.5 0-3-6-2-8Z" />,
    details: (
      <g fill="none" stroke="#a8732c" strokeWidth="1.3" strokeLinecap="round" opacity=".7">
        <path d="M27 17.5l3 1.4M23.5 24.3l3 1.4M20 31l3 1.4M16.6 37.7l3 1.4" />
        <path d="M37 17.5l-3 1.4M40.5 24.3l-3 1.4M44 31l-3 1.4M47.4 37.7l-3 1.4" />
      </g>
    ),
    eyes: { left: [28, 34], right: [36, 34], happy: true },
  },
  {
    id: "patang",
    name: "the patang",
    base: "#d9668c",
    shade: "#9c3d5f",
    shape: <path d="M32 5.5 54 31 32 60 10 31Z" />,
    details: (
      <g fill="none" stroke="#f3c7d6" strokeWidth="1.1" opacity=".75">
        <path d="M32 6v52M10.5 31h43" />
      </g>
    ),
    eyes: { left: [27.5, 26], right: [36.5, 26] },
  },
  {
    id: "mango",
    name: "the mango",
    base: "#f2b33d",
    shade: "#c27a1c",
    shape: <path d="M31 14.5c12.5-1.5 22 7.5 22 21V58H13V33c0-10 7-17.6 18-18.5Z" />,
    details: <ellipse cx="44" cy="40" rx="7" ry="9" fill="#e9862c" opacity=".55" />,
    eyes: { left: [27, 31], right: [36, 31] },
    extra: (
      <g>
        <path
          d="M31.5 15c-.4-3 .2-5.4 2-7.2"
          fill="none"
          stroke="#6b4a2b"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M33.4 9.6c3.6-4 9.6-4.6 13.6-1.8-3.6 4-9.6 4.6-13.6 1.8Z"
          fill="#6f9a4b"
          stroke="#4d7232"
          strokeWidth=".8"
        />
      </g>
    ),
  },
  {
    id: "drop",
    name: "the raindrop",
    base: "#8dbde6",
    shade: "#4f86b8",
    shape: <path d="M32 5.5c6 9.5 18 19.2 18 32.5V58H14V38c0-13.3 12-23 18-32.5Z" />,
    eyes: { left: [27.5, 35], right: [36.5, 35] },
  },
];

const seats = [
  { side: "left", seed: 4, delay: 250 },
  { side: "right", seed: 11, delay: 520 },
] as const;

/** The next critter after `current` that isn't already sitting at the other seat. */
function next(current: number, other: number) {
  let n = (current + 1) % cast.length;
  if (n === other) n = (n + 1) % cast.length;
  return n;
}

/**
 * `start` picks who sits on each side at first (indexes into `cast`), so two ledges on the same
 * page can open with different critters.
 */
export default function Critters({ start = [0, 1] }: { start?: [number, number] }) {
  const [who, setWho] = useState<[number, number]>(start);
  const [ducked, setDucked] = useState<[boolean, boolean]>([false, false]);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  // They render sitting up, so they're always there even if a script fails. If the page
  // loads with them still out of sight, they slip below the line and wait, then pop up one by
  // one once they're properly on screen.
  useEffect(() => {
    const first = refs.current[0];
    if (!first || first.getBoundingClientRect().top < window.innerHeight) return;
    setDucked([true, true]);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        seats.forEach((seat, i) => {
          timers.current.push(
            window.setTimeout(
              () => setDucked((d) => (i ? [d[0], false] : [false, d[1]])),
              seat.delay,
            ),
          );
        });
      },
      { threshold: 0.5 },
    );
    observer.observe(first);
    return () => observer.disconnect();
  }, []);

  // Eyes follow the pointer: each critter gets --ex / --ey between -1 and 1.
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || still.matches) return;
    let frame = 0;
    let x = 0;
    let y = 0;
    const update = () => {
      frame = 0;
      for (const el of refs.current) {
        if (!el) continue;
        const r = el.getBoundingClientRect();
        const dx = (x - r.left - r.width / 2) / 240;
        const dy = (y - r.top - r.height / 2) / 180;
        el.style.setProperty("--ex", Math.max(-1, Math.min(1, dx)).toFixed(3));
        el.style.setProperty("--ey", Math.max(-1, Math.min(1, dy)).toFixed(3));
      }
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const swap = (seat: 0 | 1) => {
    if (ducked[seat]) return;
    play("duck");
    haptic(10);
    setDucked((d) => (seat ? [d[0], true] : [true, d[1]]));
    // Once it's out of sight, change who's sitting there and bring them up.
    timers.current.push(
      window.setTimeout(() => {
        setWho((w) => {
          const other = w[seat ? 0 : 1];
          const n = next(w[seat], other);
          return seat ? [w[0], n] : [n, w[1]];
        });
        setDucked((d) => (seat ? [d[0], false] : [false, d[1]]));
        play("pop");
      }, 260),
    );
  };

  return (
    <>
      {seats.map((seat, i) => {
        const critter = cast[who[i]!]!;
        return (
          <button
            key={seat.side}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            className="critter"
            data-side={seat.side}
            data-ducked={ducked[i] || undefined}
            aria-label={`Say hi to ${critter.name}`}
            onClick={() => swap(i as 0 | 1)}
          >
            <CritterArt critter={critter} seed={seat.seed} />
          </button>
        );
      })}
    </>
  );
}

function CritterArt({ critter, seed }: { critter: Critter; seed: number }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const { eyes } = critter;
  const tone = { "--base": critter.base, "--shade": critter.shade } as CSSProperties;
  return (
    <svg
      viewBox="0 0 64 56"
      aria-hidden="true"
      focusable="false"
      className="critter-art"
      style={tone}
    >
      <defs>
        <clipPath id={`${id}-ledge`}>
          <rect x="-12" y="-20" width="88" height="66" />
        </clipPath>
        <clipPath id={`${id}-shape`}>{critter.shape}</clipPath>
        {/* Paper grain: dark specks and a few light flecks, like cheap card stock. */}
        <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.3"
            numOctaves="1"
            seed={seed}
            stitchTiles="stitch"
          />
          <feColorMatrix values="0 0 0 0 0.1  0 0 0 0 0.07  0 0 0 0 0.04  16 0 0 0 -9.6" />
        </filter>
        <filter id={`${id}-flecks`} x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.05"
            seed={seed + 7}
            stitchTiles="stitch"
          />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 16 0 0 -9.4" />
        </filter>
        <radialGradient id={`${id}-light`} cx="32%" cy="22%" r="75%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.42" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.06" />
          <stop offset="1" stopColor="#000" stopOpacity="0.16" />
        </radialGradient>
      </defs>

      <g clipPath={`url(#${id}-ledge)`}>
        <g className="critter-body">
          <g className="critter-shade" transform="translate(2.4 1.6)">
            {critter.shape}
          </g>
          <g className="critter-base">{critter.shape}</g>
          <g clipPath={`url(#${id}-shape)`}>
            {critter.details}
            <rect width="64" height="64" fill={`url(#${id}-light)`} />
            <rect width="64" height="64" filter={`url(#${id}-grain)`} opacity="0.4" />
            <rect width="64" height="64" filter={`url(#${id}-flecks)`} opacity="0.16" />
          </g>
          <g className="critter-face">
            <Eye x={eyes.left[0]} y={eyes.left[1]} happy={eyes.happy} />
            <Eye x={eyes.right[0]} y={eyes.right[1]} happy={eyes.happy} />
            <ellipse
              cx={eyes.left[0] - 3.6}
              cy={eyes.left[1] + 4.8}
              rx="2.4"
              ry="1.3"
              className="critter-cheek"
            />
            <ellipse
              cx={eyes.right[0] + 3.6}
              cy={eyes.right[1] + 4.8}
              rx="2.4"
              ry="1.3"
              className="critter-cheek"
            />
          </g>
          {critter.extra}
        </g>
      </g>

      {/* Two little hands gripping the edge. */}
      <g className="critter-hands">
        {[20.5, 43.5].map((x, i) => (
          <g key={x} transform={`rotate(${i ? 6 : -6} ${x} 46)`}>
            <rect x={x - 5.2} y="44" width="11.4" height="5.8" rx="2.9" className="critter-shade" />
            <rect
              x={x - 5.8}
              y="43.1"
              width="11.4"
              height="5.6"
              rx="2.8"
              className="critter-base"
            />
            <path d={`M${x - 1.6} 44.2v2.2M${x + 1.6} 44.2v2.2`} className="critter-knuckles" />
          </g>
        ))}
      </g>
    </svg>
  );
}

function Eye({ x, y, happy }: { x: number; y: number; happy?: boolean | undefined }) {
  if (happy) {
    return <path d={`M${x - 2.6} ${y + 1.2}q2.6-3.4 5.2 0`} className="critter-smile" />;
  }
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="critter-eye">
        <rect x="-2.2" y="-3.6" width="4.4" height="7.2" rx="2.2" />
        <circle cx="0.7" cy="-1.6" r="0.9" className="critter-glint" />
      </g>
    </g>
  );
}
