import { asset } from "@/lib/asset";

// `logo` is a file in public/logos. Leave it out and the row shows the company's initial instead.
export const experience: {
  company: string;
  role: string;
  period: string;
  current: boolean;
  description: string;
  href: string;
  logo?: string;
}[] = [
  {
    company: "PRAID AI",
    role: "Application Engineer",
    period: "Nov 2026 — Present",
    current: true,
    description:
      "Building across an AI healthcare platform, mainly Scribe, the voice dictation and reporting product.",
    href: "https://www.praid-ai.com/",
    logo: asset("/logos/praid-ai.svg"),
  },
  {
    company: "Bitlogix",
    role: "Software Quality Assurance Engineer",
    period: "Sept — Nov 2026",
    current: false,
    description:
      "Manual testing and QA for a lab management SaaS: gathering business requirements, writing test cases, and working closely with developers to find, report and verify fixes before release.",
    href: "https://ebitlogix.com/",
    logo: asset("/logos/bitlogix.png"),
  },
  {
    company: "MyndEdge",
    role: "Backend Intern",
    period: "Dec 2025 — Feb 2026",
    current: false,
    description:
      "Backend and APIs for a MERN health-tech app, including an AI chatbot integration and CI/CD.",
    href: "https://www.linkedin.com/company/myndedge/",
    logo: asset("/logos/myndedge.svg"),
  },
  {
    company: "FAST-NUCES",
    role: "BS Computer Science",
    period: "2022 — 2026",
    current: false,
    description: "Dean's List, Fall '24.",
    href: "https://www.nu.edu.pk/",
    logo: asset("/logos/fast-nuces.png"),
  },
];
