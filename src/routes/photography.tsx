import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import SiteFrame from "@/components/SiteFrame";
import { InkText } from "@/components/TextFx";
import { galleryPhotos } from "@/constants/gallery";

export const Route = createFileRoute("/photography")({
  head: () => ({
    meta: [
      { title: "Photography · Hasnaat Malik" },
      {
        name: "description",
        content: "Photographs by Hasnaat Malik, from northern Pakistan and Lahore.",
      },
    ],
  }),
  component: Photography,
});

const pad = (n: number) => String(n).padStart(2, "0");

function Photography() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);

  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();
  const step = useCallback(
    (delta: number) =>
      setIndex((i) => (i === null ? i : (i + delta + galleryPhotos.length) % galleryPhotos.length)),
    [],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!dialogRef.current?.open) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  const photo = index === null ? null : galleryPhotos[index];

  return (
    <SiteFrame>
      <header className="ph-intro">
        <Viewfinder />
        <h1>
          <InkText text="Photography" delay={150} />
        </h1>
      </header>

      {/* One collection, no categories or captions: just the photos. */}
      <div className="ph-grid ph-collection">
        {galleryPhotos.map((p, n) => (
          <button
            key={p.src}
            type="button"
            className="ph-item"
            data-reveal=""
            style={{ "--rd": `${(n % 3) * 90}ms` } as CSSProperties}
            onClick={() => open(n)}
            aria-label={`View photo ${n + 1}: ${p.alt}`}
          >
            <img
              src={p.src}
              width={p.width}
              height={p.height}
              alt=""
              loading={n < 6 ? "eager" : "lazy"}
              decoding="async"
            />
            <span className="ph-focus" aria-hidden="true" />
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label={photo?.alt ?? "Photo"}
        onClose={() => setIndex(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        onTouchStart={(e) => {
          touchX.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          const start = touchX.current;
          const end = e.changedTouches[0]?.clientX;
          touchX.current = null;
          if (start === null || end === undefined || Math.abs(end - start) < 40) return;
          step(end < start ? 1 : -1);
        }}
      >
        {photo && (
          <figure className="lightbox-figure">
            <img
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
            />
            <figcaption className="mono muted">
              {pad(index! + 1)} / {pad(galleryPhotos.length)}
            </figcaption>
          </figure>
        )}
        <div className="lightbox-controls">
          <button type="button" onClick={() => step(-1)} aria-label="Previous photo">
            ←
          </button>
          <button type="button" onClick={close} aria-label="Close">
            ✕
          </button>
          <button type="button" onClick={() => step(1)} aria-label="Next photo">
            →
          </button>
        </div>
      </dialog>
    </SiteFrame>
  );
}

/** A tiny camera viewfinder: the brackets close in, and the focus box hunts, then locks. */
function Viewfinder() {
  return (
    <svg className="viewfinder" viewBox="0 0 120 80" aria-hidden="true">
      <g className="vf-corners" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 16V4h12" />
        <path d="M104 4h12v12" />
        <path d="M116 64v12h-12" />
        <path d="M16 76H4V64" />
      </g>
      <rect className="vf-focus" x="48" y="28" width="24" height="24" rx="2" />
      <path className="vf-cross" d="M60 36v8M56 40h8" />
    </svg>
  );
}
