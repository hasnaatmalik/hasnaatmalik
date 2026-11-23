import { asset } from "@/lib/asset";

// Favourite films, drawn as cinema tickets. Adding one is one entry plus a poster in public/movies
// (get it with `scripts/fetch-poster.sh <tmdb-id> <slug>`). Full guide: docs/CONTENT.md → Movies.
//   posters                one poster, or several for a series (they fan out like a hand of cards)
//   series                 badge for a series counted as one favourite, e.g. "Trilogy · I II III"
//   paper / ink / accent   ticket colours; the poster is printed in `accent` until you hover it
//   row / seat             printed on the stub (row is the title's initial)
export interface Movie {
  title: string;
  year: string;
  director: string;
  language: "Hindi" | "English";
  posters: string[];
  /** A series counted as one favourite. The ticket admits as many as it has posters. */
  series?: string;
  paper: string;
  ink: string;
  accent: string;
  row: string;
  seat: string;
}

/** A file in public/movies. Bare names are .webp; new posters from scripts/fetch-poster.sh are .jpg. */
const poster = (file: string) => asset(`/movies/${file.includes(".") ? file : `${file}.webp`}`);

export const movies: Movie[] = [
  {
    title: "The Social Network",
    year: "2010",
    director: "David Fincher",
    language: "English",
    posters: [poster("the-social-network")],
    paper: "#dde4ec",
    ink: "#121a26",
    accent: "#5b7fc0",
    row: "S",
    seat: "10",
  },
  {
    title: "Yeh Jawaani Hai Deewani",
    year: "2013",
    director: "Ayan Mukerji",
    language: "Hindi",
    posters: [poster("yeh-jawaani-hai-deewani")],
    paper: "#f3e2c6",
    ink: "#2b1a12",
    accent: "#e0703c",
    row: "Y",
    seat: "13",
  },
  {
    title: "Love & Other Drugs",
    year: "2010",
    director: "Edward Zwick",
    language: "English",
    posters: [poster("love-and-other-drugs")],
    paper: "#ecd7da",
    ink: "#2a1520",
    accent: "#c4505d",
    row: "L",
    seat: "14",
  },
  {
    title: "3 Idiots",
    year: "2009",
    director: "Rajkumar Hirani",
    language: "Hindi",
    posters: [poster("3-idiots")],
    paper: "#f1d35e",
    ink: "#1f1a0e",
    accent: "#e2a72e",
    row: "I",
    seat: "03",
  },
  {
    title: "Crazy Rich Asians",
    year: "2018",
    director: "Jon M. Chu",
    language: "English",
    posters: [poster("crazy-rich-asians")],
    paper: "#14493f",
    ink: "#f3e7c4",
    accent: "#3fa58c",
    row: "C",
    seat: "08",
  },
  {
    title: "The Hangover",
    year: "2009 — 2013",
    director: "Todd Phillips",
    language: "English",
    posters: [
      poster("the-hangover"),
      poster("the-hangover-part-ii"),
      poster("the-hangover-part-iii"),
    ],
    series: "Trilogy · I II III",
    paper: "#24212c",
    ink: "#f2e8d2",
    accent: "#d99a3a",
    row: "H",
    seat: "I–III",
  },
  {
    title: "Spider-Man: Brand New Day",
    year: "2026",
    director: "Destin Daniel Cretton",
    language: "English",
    posters: [poster("spider-man-brand-new-day")],
    paper: "#a8262b",
    ink: "#fbeee4",
    accent: "#e5473d",
    row: "S",
    seat: "26",
  },
  {
    title: "Wake Up Sid",
    year: "2009",
    director: "Ayan Mukerji",
    language: "Hindi",
    posters: [poster("wake-up-sid")],
    paper: "#d6ebe6",
    ink: "#13302a",
    accent: "#4aa39b",
    row: "W",
    seat: "09",
  },
  {
    title: "Kabhi Khushi Kabhie Gham",
    year: "2001",
    director: "Karan Johar",
    language: "Hindi",
    posters: [poster("kabhi-khushi-kabhie-gham")],
    paper: "#6a1d2c",
    ink: "#f6e5c8",
    accent: "#d9a441",
    row: "K",
    seat: "01",
  },
  {
    title: "Home Alone 3",
    year: "1997",
    director: "Raja Gosnell",
    language: "English",
    posters: [poster("home-alone-3")],
    paper: "#e6eef3",
    ink: "#1a2939",
    accent: "#cf4a3f",
    row: "H",
    seat: "03",
  },
  {
    title: "Love Aaj Kal",
    year: "2009",
    director: "Imtiaz Ali",
    language: "Hindi",
    posters: [poster("love-aaj-kal")],
    paper: "#f3cdbb",
    ink: "#2e1a14",
    accent: "#e46e52",
    row: "L",
    seat: "09",
  },
  {
    title: "Ae Dil Hai Mushkil",
    year: "2016",
    director: "Karan Johar",
    language: "Hindi",
    posters: [poster("ae-dil-hai-mushkil")],
    paper: "#1f2739",
    ink: "#ece3d3",
    accent: "#8ea5d6",
    row: "A",
    seat: "16",
  },
  {
    title: "The Intern",
    year: "2015",
    director: "Nancy Meyers",
    language: "English",
    posters: [poster("the-intern")],
    paper: "#ebe5d9",
    ink: "#1e1e1c",
    accent: "#8aa57a",
    row: "T",
    seat: "15",
  },
  {
    title: "Harry Potter",
    year: "2001 — 2011",
    director: "Columbus to Yates",
    language: "English",
    posters: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => poster(`harry-potter-${n}`)),
    series: "All eight films",
    paper: "#efe1bf",
    ink: "#2a1d12",
    accent: "#b0813c",
    row: "P",
    seat: "1–8",
  },
];

/** Where the full watch history lives. */
export const bingers = {
  handle: "@hasnaat",
  href: "https://bingers.app/@hasnaat?ref=share",
};
