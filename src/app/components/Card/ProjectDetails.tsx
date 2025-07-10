import * as React from "react";
import { motion, useDeprecatedInvertedScale } from "framer-motion";

interface ProjectDetailsProps {
    description: string;
    links: {
        github?: string;
        live?: string;
    };
    modalImages: string[];
}

export const ProjectDetails: React.FC<ProjectDetailsProps> = React.memo(({ description, links, modalImages }) => {
  const inverted = useDeprecatedInvertedScale();
  return (
    <motion.div
      className="content-container"
      style={{ ...inverted, originY: 0, originX: 0 }}
    >
        <p>{description}</p>
        <div className="links-container">
            <a href={links.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            {links.live && <a href={links.live} target="_blank" rel="noopener noreferrer">Live Demo</a>}
        </div>
        <div className="modal-images-container">
            {modalImages.map((src, index) => (
                <img key={index} src={src} alt={`Project image ${index + 1}`} className="modal-image" />
            ))}
        </div>
    </motion.div>
  );
});

ProjectDetails.displayName = "ProjectDetails";
