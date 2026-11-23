import { useEffect, useMemo, useRef, useState } from "react";
import { profile } from "@/constants/profile";

interface Day {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

const WEEKS = 53;
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dayLabel = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

/** Last year of GitHub activity, drawn as a dot grid. Loads in the browser; the page never waits on it. */
export default function ContributionGraph() {
  const [days, setDays] = useState<Day[] | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);
  const [hovered, setHovered] = useState<Day | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // On narrow screens the graph scrolls; start at the most recent weeks.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [days]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`https://github-contributions-api.jogruber.de/v4/${profile.githubUser}?y=last`, {
      signal: controller.signal,
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: { total: Record<string, number>; contributions: Day[] }) => {
        setDays(data.contributions);
        setTotal(Object.values(data.total)[0] ?? null);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setFailed(true);
        void error;
      });
    return () => controller.abort();
  }, []);

  // Columns are weeks starting on Sunday, like GitHub's own graph.
  const { weeks, labels } = useMemo(() => {
    if (!days?.length) {
      return {
        weeks: Array.from({ length: WEEKS }, () => Array<Day | null>(7).fill(null)),
        labels: [],
      };
    }
    const firstWeekday = new Date(`${days[0]!.date}T00:00:00Z`).getUTCDay();
    const padded: (Day | null)[] = [...Array<null>(firstWeekday).fill(null), ...days];
    const cols: (Day | null)[][] = [];
    for (let i = 0; i < padded.length; i += 7) cols.push(padded.slice(i, i + 7));
    // A month label sits over the first week whose first day falls in that month.
    const monthOf = (col: (Day | null)[] | undefined) => col?.find(Boolean)?.date.slice(5, 7);
    const marks = cols.flatMap((col, i) => {
      const m = monthOf(col);
      return m && m !== monthOf(cols[i - 1]) ? [{ col: i, label: months[Number(m) - 1]! }] : [];
    });
    // Drop a leading partial month whose label would collide with the next one.
    if (marks.length > 1 && marks[1]!.col - marks[0]!.col < 3) marks.shift();
    return { weeks: cols, labels: marks };
  }, [days]);

  const caption = hovered
    ? `${hovered.count === 0 ? "No" : hovered.count} contribution${hovered.count === 1 ? "" : "s"} on ${dayLabel.format(new Date(`${hovered.date}T00:00:00Z`))}`
    : total !== null
      ? `${total.toLocaleString()} contributions in the last year`
      : failed
        ? "Couldn't reach GitHub just now."
        : "Counting commits…";

  return (
    <figure className="graph" aria-busy={!days && !failed}>
      <div className="graph-scroll" ref={scrollRef}>
        <div className="graph-inner" style={{ ["--weeks" as string]: weeks.length }}>
          <div className="graph-months" aria-hidden="true">
            {labels.map((m) => (
              <span key={`${m.col}-${m.label}`} style={{ gridColumnStart: m.col + 1 }}>
                {m.label}
              </span>
            ))}
          </div>
          <div
            className="graph-grid"
            role="img"
            aria-label={caption}
            onMouseLeave={() => setHovered(null)}
          >
            {weeks.map((week, w) =>
              week.map((day, d) => (
                <span
                  key={`${w}-${d}`}
                  className="graph-dot"
                  data-level={day?.level ?? (days ? "none" : "loading")}
                  style={{ gridColumn: w + 1, gridRow: d + 1, ["--w" as string]: w }}
                  onMouseEnter={day ? () => setHovered(day) : undefined}
                />
              )),
            )}
          </div>
        </div>
      </div>
      <figcaption className="graph-caption">
        <span className="mono">{caption}</span>
        <span className="graph-legend" aria-hidden="true">
          Less
          {[0, 1, 2, 3, 4].map((l) => (
            <span key={l} className="graph-dot" data-level={l} />
          ))}
          More
        </span>
      </figcaption>
    </figure>
  );
}
