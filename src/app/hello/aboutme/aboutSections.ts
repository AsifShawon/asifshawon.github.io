/**
 * The one place the About page's 7 sections are declared — both the section
 * index nav (`AboutSectionIndex`) and each section component read from this
 * so the IDs, numbers and order can never drift apart.
 */
export interface AboutSectionMeta {
  id: string;
  number: string;
  navLabel: string;
  /** Compact form for the horizontal mobile/tablet tab strip — the full
   *  `navLabel` (e.g. "Commerce × Engineering") is too wide to sit
   *  comfortably in a scrolling row of pills. */
  shortLabel: string;
}

export const ABOUT_SECTIONS: AboutSectionMeta[] = [
  { id: "about-intro", number: "01", navLabel: "Introduction", shortLabel: "Intro" },
  { id: "about-practice", number: "02", navLabel: "Commerce × Engineering", shortLabel: "Commerce" },
  { id: "about-achievements", number: "03", navLabel: "Achievements", shortLabel: "Achievements" },
  { id: "about-journey", number: "04", navLabel: "Journey", shortLabel: "Journey" },
  { id: "about-capabilities", number: "05", navLabel: "Capabilities", shortLabel: "Capabilities" },
  { id: "about-principles", number: "06", navLabel: "Beyond the title", shortLabel: "Beyond" },
];
