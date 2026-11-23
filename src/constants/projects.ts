export interface Project {
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  href: string;
  year: number;
  isNew?: boolean;
}

// Grouped by year on the page, newest first, in the order listed here.
export const projects: Project[] = [
  {
    name: "Munshi",
    tagline: "FBR-compliant e-invoicing",
    description:
      "Desktop e-invoicing app for Pakistani businesses, compliant with FBR's digital invoicing.",
    stack: ["React", "Tauri", "Rust", "SQLite"],
    href: "https://munshi-one.vercel.app/",
    year: 2026,
    isNew: true,
  },
  {
    name: "Kiryana Hisaab",
    tagline: "Offline-first khata ledger",
    description: "Cloud-backed, offline-first digital ledger for local grocery stores.",
    stack: ["React", "TypeScript", "Appwrite", "Tailwind"],
    href: "https://kiryana-hisaab.vercel.app/",
    year: 2026,
  },
  {
    name: "AskQanoon",
    tagline: "Legal assistant for Pakistani law",
    description: "RAG-powered, bilingual answers on Pakistani law, with citations.",
    stack: ["Next.js", "Groq", "Pinecone"],
    href: "https://askqanoon.vercel.app/",
    year: 2026,
  },
  {
    name: "RepoRevive",
    tagline: "Django 2.x → 5.x upgrades",
    description: "Drops into a Django repository and hands you an upgrade and migration plan.",
    stack: ["Python", "Django", "LLM", "React"],
    href: "https://github.com/hasnaatmalik/reporevive",
    year: 2025,
  },
  {
    name: "CryptoLab",
    tagline: "Classical ciphers, step by step",
    description: "Interactive walkthroughs of classical cryptographic algorithms.",
    stack: ["Python", "Streamlit"],
    href: "https://cryptographic-algos-rr5mktwx7bgusaalmiqctp.streamlit.app/",
    year: 2025,
  },
];

export const projectsByYear = Object.entries(
  projects.reduce<Record<number, Project[]>>((groups, project) => {
    (groups[project.year] ??= []).push(project);
    return groups;
  }, {}),
)
  .map(([year, items]) => ({ year: Number(year), items }))
  .sort((a, b) => b.year - a.year);
