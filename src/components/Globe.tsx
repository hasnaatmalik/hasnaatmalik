import { useEffect, useRef } from "react";
import { isLand } from "@/lib/land";

/** Lahore, where the pin goes. */
const HOME = { lat: 31.55, lon: 74.35 };
/** Spacing of the dot grid, in degrees. */
const STEP = 2.4;
/** The view looks a little south of the equator, so Asia and Europe sit across the top. */
const TILT = (-18 * Math.PI) / 180;
const SPIN = 3.2; // degrees per second when left alone
const RAD = Math.PI / 180;

interface Dot {
  sinLat: number;
  cosLat: number;
  lon: number; // radians
  /** Which heatmap shade it's painted in: 0 for sea, 1–3 for land. */
  shade: number;
}

/** A dot every STEP degrees, with fewer per ring toward the poles so the spacing stays even. */
function makeDots(): Dot[] {
  const dots: Dot[] = [];
  for (let lat = -84; lat <= 84; lat += STEP) {
    const ring = Math.max(1, Math.round((360 * Math.cos(lat * RAD)) / STEP));
    for (let i = 0; i < ring; i++) {
      const lon = -180 + (i + 0.5) * (360 / ring);
      // Land takes the brighter heatmap shades, scattered like a contribution graph. The
      // scatter is hashed from the dot's position, so it's the same on every visit.
      const hash = Math.abs(Math.sin(lat * 12.9898 + lon * 78.233) * 43758.5453) % 1;
      dots.push({
        sinLat: Math.sin(lat * RAD),
        cosLat: Math.cos(lat * RAD),
        lon: lon * RAD,
        shade: isLand(lat, lon) === 1 ? (hash < 0.45 ? 1 : hash < 0.8 ? 2 : 3) : 0,
      });
    }
  }
  return dots;
}

/**
 * The footer's horizon: a dot-matrix Earth rising out of the bottom of the page, turning slowly,
 * with a chai-coloured pin on Lahore. It's painted in the Activity heatmap's blues (`--h1`…`--h4`):
 * faint sea, brighter land. Drag it to spin it; it glides to a stop and carries on.
 * Drawn on a canvas in the theme's own colours, and only animated while it's on screen.
 */
export default function Globe() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    const dots = makeDots();
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let colours = { shades: ["#21436c", "#1a5fac", "#5081f3", "#54a2ff"], pin: "#f59e0b" };
    let center = HOME.lon * RAD; // the longitude facing you
    let velocity = 0; // radians per ms, from a drag
    let dragging: { x: number; t: number } | null = null;
    let visible = false;
    let frame = 0;
    let last = 0;

    const readColours = () => {
      const css = getComputedStyle(el);
      colours = {
        shades: ["--h1", "--h2", "--h3", "--h4"].map(
          (v, i) => css.getPropertyValue(v).trim() || colours.shades[i]!,
        ),
        pin: css.getPropertyValue("--globe-pin").trim() || "#f59e0b",
      };
    };

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = el.clientWidth;
      height = el.clientHeight;
      el.width = Math.round(width * dpr);
      el.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      const r = Math.min(width * 0.5, 380);
      const cx = width / 2;
      const cy = 22 + r;
      const dot = Math.max(1.3, r / 200);
      const sinT = Math.sin(TILT);
      const cosT = Math.cos(TILT);
      ctx.clearRect(0, 0, width, height);

      // A soft atmosphere hugging the rim.
      const glow = ctx.createRadialGradient(cx, cy, r * 0.9, cx, cy, r * 1.14);
      glow.addColorStop(0, "transparent");
      glow.addColorStop(0.4, colours.shades[2]!);
      glow.addColorStop(1, "transparent");
      ctx.globalAlpha = 0.28;
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      // Dots, batched by shade and by depth (four alpha steps), so it's a handful of fills.
      const batches: [Path2D, string, number][] = [];
      for (let b = 0; b < 4; b++) {
        for (let shade = 0; shade < 4; shade++) {
          const alpha = shade ? 0.42 + b * 0.19 : 0.12 + b * 0.06;
          batches.push([new Path2D(), colours.shades[shade]!, alpha]);
        }
      }
      for (const d of dots) {
        const dl = d.lon - center;
        const cosDl = Math.cos(dl);
        const z = sinT * d.sinLat + cosT * d.cosLat * cosDl;
        if (z <= 0.04) continue;
        const y = cy - r * (cosT * d.sinLat - sinT * d.cosLat * cosDl);
        if (y > height + 4) continue;
        const x = cx + r * d.cosLat * Math.sin(dl);
        const depth = Math.min(3, Math.floor(z * 4));
        const path = batches[depth * 4 + d.shade]![0];
        const size = dot * (0.55 + 0.45 * z) * (d.shade ? 1.05 : 0.75);
        path.moveTo(x + size, y);
        path.arc(x, y, size, 0, Math.PI * 2);
      }
      for (const [path, colour, alpha] of batches) {
        ctx.globalAlpha = alpha;
        ctx.fillStyle = colour;
        ctx.fill(path);
      }

      // Lahore: a pin with a slow ripple, while it's on the near side.
      const hl = HOME.lon * RAD - center;
      const sinH = Math.sin(HOME.lat * RAD);
      const cosH = Math.cos(HOME.lat * RAD);
      const hz = sinT * sinH + cosT * cosH * Math.cos(hl);
      if (hz > 0.08) {
        const hx = cx + r * cosH * Math.sin(hl);
        const hy = cy - r * (cosT * sinH - sinT * cosH * Math.cos(hl));
        const fade = Math.min(1, (hz - 0.08) * 5);
        const t = still ? 0.35 : (((time / 2400) % 1) + 1) % 1;
        ctx.globalAlpha = fade * (1 - t) * 0.7;
        ctx.strokeStyle = colours.pin;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(hx, hy, 4 + t * 16, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = fade;
        ctx.fillStyle = colours.pin;
        ctx.beginPath();
        ctx.arc(hx, hy, 3.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const tick = (time: number) => {
      frame = 0;
      const dt = last ? Math.min(64, time - last) : 16;
      last = time;
      if (!dragging) {
        // A drag's momentum eases away into the usual slow turn.
        velocity *= Math.pow(0.94, dt / 16);
        center += velocity * dt + (still ? 0 : SPIN * RAD * (dt / 1000));
      }
      draw(time);
      if (visible && !still) frame = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!frame) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    };

    const onDown = (e: PointerEvent) => {
      dragging = { x: e.clientX, t: e.timeStamp };
      velocity = 0;
      el.setPointerCapture(e.pointerId);
      el.dataset["dragging"] = "";
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const r = Math.min(width * 0.5, 380);
      const delta = -(e.clientX - dragging.x) / r;
      const dt = Math.max(1, e.timeStamp - dragging.t);
      center += delta;
      velocity = velocity * 0.6 + (delta / dt) * 0.4;
      dragging = { x: e.clientX, t: e.timeStamp };
      start();
    };
    const onUp = () => {
      dragging = null;
      delete el.dataset["dragging"];
      start();
    };

    readColours();
    resize();
    draw(0);

    const io = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
      if (visible) start();
    });
    io.observe(el);
    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(el);
    // Repaint in the new colours when the theme changes.
    const mo = new MutationObserver(() => {
      readColours();
      draw(performance.now());
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <div className="globe">
      <canvas
        ref={canvas}
        className="globe-canvas"
        role="img"
        aria-label="A slowly turning globe with a pin on Lahore, Pakistan"
      />
    </div>
  );
}
