import type { ReactNode } from "react";
import { ScribbleArrow } from "@/components/Icon";

interface SectionProps {
  id?: string;
  title: ReactNode;
  /** Handwritten aside in the page margin (wide screens only). */
  note?: string;
  noteSide?: "left" | "right";
  aside?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export default function Section({
  id,
  title,
  note,
  noteSide = "right",
  aside,
  children,
  footer,
}: SectionProps) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section id={id} className="section" aria-labelledby={headingId}>
      {note && <MarginNote side={noteSide}>{note}</MarginNote>}
      <div className="section-head">
        <h2 id={headingId} data-reveal="">
          {title}
        </h2>
        {aside && <div className="section-aside">{aside}</div>}
      </div>
      {children}
      {footer && <div className="section-foot">{footer}</div>}
    </section>
  );
}

/** A note scrawled in the margin: the words write themselves in, then the arrow draws. */
export function MarginNote({
  children,
  side = "right",
}: {
  children: string;
  side?: "left" | "right";
}) {
  return (
    <aside className="margin-note" data-side={side} data-reveal="" aria-hidden="true">
      <span className="margin-note-text">{children}</span>
      <ScribbleArrow flip={side === "left"} />
    </aside>
  );
}
