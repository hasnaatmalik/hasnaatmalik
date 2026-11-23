import { useEffect, useState } from "react";
import { profile } from "@/constants/profile";

const clock = new Intl.DateTimeFormat("en-US", {
  timeZone: profile.timeZone,
  hour: "numeric",
  minute: "2-digit",
});
const hourOnly = new Intl.DateTimeFormat("en-US", {
  timeZone: profile.timeZone,
  hour: "numeric",
  hourCycle: "h23",
});

/** Current time in Lahore. Null until mounted, so the prerendered HTML never shows a stale time. */
export function useLahoreTime() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(id);
  }, []);
  if (!now) return null;
  const hour = Number(hourOnly.format(now));
  return { label: clock.format(now), hour };
}

export type DayPart = "morning" | "afternoon" | "evening" | "night";

const greetings: Record<DayPart, string> = {
  morning: "Good morning",
  afternoon: "Good afternoon",
  evening: "Good evening",
  night: "Up late?",
};

export function dayPart(hour: number): DayPart {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 22) return "evening";
  return "night";
}

/**
 * Greets the visitor by their own clock, and keeps up if they leave the tab open across a boundary.
 * Null until mounted, so prerendered HTML never bakes in the build machine's time of day.
 */
export function useGreeting() {
  const [part, setPart] = useState<DayPart | null>(null);
  useEffect(() => {
    const update = () => setPart(dayPart(new Date().getHours()));
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return part ? { part, text: greetings[part] } : null;
}
