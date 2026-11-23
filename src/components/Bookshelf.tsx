import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { books, type Book } from "@/constants/books";
import { play } from "@/lib/sound";

/**
 * A row of spines on a shelf. Picking a book widens its slot to the width of its cover, the
 * spine fades into the real cover, and the neighbours slide over to make room. Clicking
 * anywhere else, or Escape, puts it back.
 */
export default function Bookshelf() {
  const [open, setOpen] = useState<string | null>(books[0]?.id ?? null);
  const root = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = books.find((b) => b.id === open);
  const openRef = useRef(open);
  openRef.current = open;

  const toggle = (book: Book) => {
    const next = open === book.id ? null : book.id;
    play(next ? "open" : "close");
    setOpen(next);
  };

  // Close on a click outside the books (the top bar doesn't count) or on Escape.
  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (target?.closest("[data-book], header")) return;
      if (!openRef.current) return;
      play("close");
      setOpen(null);
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // On narrow screens the shelf scrolls, so glide the opened book to the middle. The width it
  // is growing to is known up front, so this runs alongside the opening, not after it.
  useEffect(() => {
    const index = books.findIndex((b) => b.id === open);
    const el = refs.current[index];
    const box = rail.current;
    const book = books[index];
    if (!el || !box || !book) return;
    const width = book.height * (book.cover.width / book.cover.height) * scale(box);
    const left = Math.max(
      0,
      Math.min(box.scrollWidth - box.clientWidth, el.offsetLeft - (box.clientWidth - width) / 2),
    );
    if (Math.abs(left - box.scrollLeft) > 1) box.scrollTo({ left, behavior: "smooth" });
  }, [open]);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    const edge = e.key === "Home" ? 0 : e.key === "End" ? books.length - 1 : null;
    if (!delta && edge === null) return;
    e.preventDefault();
    const target = edge ?? (index + delta + books.length) % books.length;
    refs.current[target]?.focus();
  };

  return (
    <div className="shelf" ref={root}>
      <div className="shelf-rail" ref={rail}>
        <div className="shelf-books" role="group" aria-label="Bookshelf">
          {books.map((book, index) => {
            const isOpen = open === book.id;
            return (
              <div
                key={book.id}
                className="book-slot"
                data-reveal=""
                style={{ "--rd": `${index * 50}ms` } as CSSProperties}
              >
                <button
                  ref={(el) => {
                    refs.current[index] = el;
                  }}
                  type="button"
                  className="book"
                  data-book={book.id}
                  data-open={isOpen}
                  aria-pressed={isOpen}
                  aria-label={`${book.title}, by ${book.author}`}
                  onClick={() => toggle(book)}
                  onKeyDown={(e) => onKeyDown(e, index)}
                  style={
                    {
                      "--h": `${book.height}px`,
                      "--d": `${book.depth}px`,
                      "--ratio": book.cover.width / book.cover.height,
                      "--paper": book.paper,
                      "--ink": book.ink,
                      "--accent": book.accent,
                    } as CSSProperties
                  }
                >
                  <span className="book-art" aria-hidden="true">
                    <span className="book-cover">
                      <img
                        src={book.cover.src}
                        width={book.cover.width}
                        height={book.cover.height}
                        alt=""
                        decoding="async"
                      />
                    </span>
                    <Spine book={book} />
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="shelf-plank" aria-hidden="true" />
      <p className="shelf-caption" aria-live="polite">
        {current ? (
          <span key={current.id} className="shelf-caption-in">
            <span className="shelf-caption-title">{current.title}</span>
            <span className="muted"> by {current.author}</span>
            {current.note && <span className="shelf-caption-note">{current.note}</span>}
          </span>
        ) : (
          <span className="muted shelf-caption-in">Pick a book off the shelf.</span>
        )}
      </p>
    </div>
  );
}

/** The shelf's size multiplier (`--s`, smaller on phones), read from CSS. */
function scale(el: HTMLElement) {
  return parseFloat(getComputedStyle(el).getPropertyValue("--s")) || 1;
}

/** The first author's surname, for the spine: "Martin Kleppmann & Chris Riccomini" → "Kleppmann". */
function surname(author: string) {
  return author
    .split(/\s*(?:&|\band\b)\s*/)[0]!
    .trim()
    .split(" ")
    .slice(-1)[0];
}

function Spine({ book }: { book: Book }) {
  return (
    <span className="book-spine" data-face={book.face}>
      <span className="spine-band" />
      <span className="spine-title">{book.spine ?? book.title}</span>
      <span className="spine-author">{surname(book.author)}</span>
      <span className="spine-mark" />
    </span>
  );
}
