export interface CardData {
  id: string;
  projectTitle: string;
  image: string;
  techStack: string[];
  shortDescription: string;
  description: string;
  links: {
    github?: string;
    live?: string;
  };
  modalImages: string[];
  backgroundColor: string;
}
