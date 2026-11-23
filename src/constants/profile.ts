import {
  siDjango,
  siGit,
  siGithub,
  siGmail,
  siJavascript,
  siMedium,
  siMongodb,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPython,
  siReact,
  siRust,
  siSpotify,
  siSqlite,
  siTailwindcss,
  siTauri,
  siTypescript,
} from "simple-icons";
import { asset } from "@/lib/asset";

export const profile = {
  name: "Hasnaat Malik",
  location: "Lahore, Pakistan",
  timeZone: "Asia/Karachi",
  email: "hasnaatmalik2003@gmail.com",
  blog: "https://medium.com/@hasnaatmalik",
  github: "https://github.com/hasnaatmalik",
  githubUser: "hasnaatmalik",
  spotifyPlaylist: "0KZdqbocmiKLl84yWGEBLu",
};

/** Minimal shape of a simple-icons icon, so hand-drawn icons can sit alongside them. */
export interface Glyph {
  path: string;
  hex?: string;
  /** Draw the path as a line instead of a filled shape. */
  stroke?: boolean;
}

const linkedin: Glyph = {
  hex: "0A66C2",
  path: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z",
};

const document: Glyph = {
  path: "M14 1H5a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8zm-1 2.5L18.5 9H13zM7 13h10v1.6H7zm0 3.6h10v1.6H7zm0-7.2h4v1.6H7z",
};

export const socials: { label: string; handle: string; href: string; icon: Glyph }[] = [
  { label: "GitHub", handle: "@hasnaatmalik", href: profile.github, icon: siGithub },
  {
    label: "LinkedIn",
    handle: "in/hasnaatmalik",
    href: "https://www.linkedin.com/in/hasnaatmalik",
    icon: linkedin,
  },
  { label: "Email", handle: profile.email, href: `mailto:${profile.email}`, icon: siGmail },
  { label: "Medium", handle: "@hasnaatmalik", href: profile.blog, icon: siMedium },
  {
    label: "Spotify",
    handle: "what's on repeat",
    href: `https://open.spotify.com/playlist/${profile.spotifyPlaylist}`,
    icon: siSpotify,
  },
  { label: "Résumé", handle: "cv.pdf", href: asset("/cv.pdf"), icon: document },
];

// Brand marks simple-icons doesn't carry, plus two concept glyphs, drawn on its 24px grid.
const pinecone: Glyph = {
  hex: "1C17FF",
  path: "M12 1.6 15.4 5l-1.25 1.25L12 4.1 9.85 6.25 8.6 5zm0 5.6 4.9 4.9-1.25 1.25L12 9.7l-3.65 3.65-1.25-1.25zm0 5.6 5.9 5.9-1.25 1.25L12 15.3l-4.65 4.65-1.25-1.25zM11.1 19.7h1.8v2.7h-1.8z",
};
const groq: Glyph = {
  hex: "F55036",
  path: "M12 3a7 7 0 1 0 0 14h3.2v-2.6H12a4.4 4.4 0 1 1 4.4-4.4v6.2a4.4 4.4 0 0 1-7.5 3.1l-1.85 1.85A7 7 0 0 0 19 16.2V10a7 7 0 0 0-7-7z",
};
const rag: Glyph = {
  stroke: true,
  path: "M3.5 5.8c0-1.5 2.9-2.6 6.5-2.6s6.5 1.1 6.5 2.6-2.9 2.6-6.5 2.6-6.5-1.1-6.5-2.6zm0 0v11.8c0 1.4 2.5 2.5 5.8 2.6M16.5 5.8v3.6M3.5 11.7c0 1.4 2.5 2.5 5.8 2.6M17 20.4a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8zm2.5-.9 2 2",
};
const llm: Glyph = {
  path: "M10.5 2.5 12.4 8l5.6 1.9-5.6 1.9-1.9 5.6-1.9-5.6L3 9.9 8.6 8zm8 10.5.95 2.55L22 16.5l-2.55.95L18.5 20l-.95-2.55L15 16.5l2.55-.95z",
};

export const stack: { group: string; items: { name: string; icon: Glyph }[] }[] = [
  {
    group: "Language",
    items: [
      { name: "TypeScript", icon: siTypescript },
      { name: "Python", icon: siPython },
      { name: "Rust", icon: siRust },
      { name: "JavaScript", icon: siJavascript },
    ],
  },
  {
    group: "Frontend",
    items: [
      { name: "React", icon: siReact },
      { name: "Next.js", icon: siNextdotjs },
      { name: "Tailwind CSS", icon: siTailwindcss },
      { name: "Tauri", icon: siTauri },
    ],
  },
  {
    group: "Backend",
    items: [
      { name: "Node.js", icon: siNodedotjs },
      { name: "Django", icon: siDjango },
      { name: "PostgreSQL", icon: siPostgresql },
      { name: "MongoDB", icon: siMongodb },
      { name: "SQLite", icon: siSqlite },
    ],
  },
  {
    group: "AI & Workflow",
    items: [
      { name: "RAG", icon: rag },
      { name: "LLMs", icon: llm },
      { name: "Pinecone", icon: pinecone },
      { name: "Groq", icon: groq },
      { name: "Git", icon: siGit },
    ],
  },
];
