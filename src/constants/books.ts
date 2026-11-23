import { asset } from "@/lib/asset";

// The bookshelf. Each book is a spine drawn in CSS, which opens to show the real cover.
// Adding one is an entry here plus a cover image in public/books (see docs/CONTENT.md → Books).
//   cover    the official cover: file in public/books, with its pixel width and height
//   height   spine height in px (books look better when these vary a little)
//   depth    spine thickness in px
//   paper    spine colour, sampled from the cover; ink = spine text; accent = the band and dot
//   face     typeface on the spine: "serif" | "sans" | "display"
export interface Book {
  id: string;
  title: string;
  author: string;
  cover: { src: string; width: number; height: number };
  height: number;
  depth: number;
  paper: string;
  ink: string;
  accent: string;
  face: "serif" | "sans" | "display";
  /** Shorter title for the spine, when the full one won't fit. */
  spine?: string;
  note?: string;
}

const cover = (file: string, width: number, height: number) => ({
  src: asset(`/books/${file}`),
  width,
  height,
});

export const books: Book[] = [
  {
    id: "kite-runner",
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    cover: cover("kite-runner.jpg", 651, 1000),
    height: 262,
    depth: 36,
    paper: "#b5cfe4",
    ink: "#7a221a",
    accent: "#3d5d86",
    face: "serif",
  },
  {
    id: "splendid-suns",
    title: "A Thousand Splendid Suns",
    author: "Khaled Hosseini",
    cover: cover("splendid-suns.jpg", 651, 1000),
    height: 270,
    depth: 40,
    paper: "#f1d68c",
    ink: "#9c3b22",
    accent: "#b4471f",
    face: "display",
  },
  {
    id: "train-to-pakistan",
    title: "Train to Pakistan",
    author: "Khushwant Singh",
    cover: cover("train-to-pakistan.jpg", 760, 1000),
    height: 246,
    depth: 28,
    paper: "#b80f06",
    ink: "#f6ead6",
    accent: "#1f2a4d",
    face: "sans",
  },
  {
    id: "normal-people",
    title: "Normal People",
    author: "Sally Rooney",
    cover: cover("normal-people.jpg", 622, 1000),
    height: 252,
    depth: 30,
    paper: "#bebb0e",
    ink: "#1f2d4a",
    accent: "#ffffff",
    face: "display",
  },
  {
    id: "conversations-with-friends",
    title: "Conversations with Friends",
    author: "Sally Rooney",
    cover: cover("conversations-with-friends.jpg", 666, 1000),
    height: 256,
    depth: 32,
    paper: "#f5b901",
    ink: "#1b2440",
    accent: "#3aa5d8",
    face: "display",
  },
  {
    id: "ddia",
    title: "Designing Data-Intensive Applications (2nd edition)",
    spine: "Data-Intensive Applications",
    author: "Martin Kleppmann & Chris Riccomini",
    cover: cover("ddia.jpg", 762, 1000),
    height: 284,
    depth: 52,
    paper: "#f6f4f1",
    ink: "#1d1d1b",
    accent: "#e31f3d",
    face: "sans",
  },
  {
    id: "hp-philosophers-stone",
    title: "Harry Potter and the Philosopher's Stone",
    spine: "Philosopher's Stone",
    author: "J.K. Rowling",
    cover: cover("hp-philosophers-stone.jpg", 651, 1000),
    height: 258,
    depth: 34,
    paper: "#16163a",
    ink: "#e9c66c",
    accent: "#e9c66c",
    face: "serif",
  },
  {
    id: "hp-prisoner-of-azkaban",
    title: "Harry Potter and the Prisoner of Azkaban",
    spine: "Prisoner of Azkaban",
    author: "J.K. Rowling",
    cover: cover("hp-prisoner-of-azkaban.jpg", 651, 1000),
    height: 264,
    depth: 42,
    paper: "#1d4c72",
    ink: "#f0d48a",
    accent: "#97cfe1",
    face: "serif",
  },
  {
    id: "hp-deathly-hallows",
    title: "Harry Potter and the Deathly Hallows",
    spine: "Deathly Hallows",
    author: "J.K. Rowling",
    cover: cover("hp-deathly-hallows.jpg", 651, 1000),
    height: 272,
    depth: 56,
    paper: "#3d2f47",
    ink: "#f0d48a",
    accent: "#a08aa5",
    face: "serif",
  },
];
