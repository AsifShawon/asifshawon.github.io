/**
 * The one place the About page's 7 sections are declared — both the section
 * index nav (`AboutSectionIndex`) and each section component read from this
 * so the IDs, numbers and order can never drift apart.
 */
export interface AboutSectionMeta {
  id: string;
  number: string;
  navLabel: string;
}

export const ABOUT_SECTIONS: AboutSectionMeta[] = [
  { id: "about-intro", number: "01", navLabel: "Introduction" },
  { id: "about-practice", number: "02", navLabel: "Commerce × Engineering" },
  { id: "about-achievements", number: "03", navLabel: "Achievements" },
  { id: "about-journey", number: "04", navLabel: "Journey" },
  { id: "about-capabilities", number: "05", navLabel: "Capabilities" },
  { id: "about-principles", number: "06", navLabel: "Beyond the title" },
  { id: "about-contact", number: "07", navLabel: "Contact" },
];
