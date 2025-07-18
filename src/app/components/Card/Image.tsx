import * as React from "react";
import { motion, useDeprecatedInvertedScale } from "framer-motion";
import { closeSpring } from "./animations";

interface ImageProps {
  id: string;
  imageSrc: string;
  isSelected: boolean;
  pointOfInterest?: number;
  backgroundColor: string;
  alt?: string;
}

export const Image: React.FC<ImageProps> = ({
  id,
  imageSrc,
  isSelected,
  pointOfInterest = 0,
  backgroundColor,
  alt = "",
}) => {
  const inverted = useDeprecatedInvertedScale();

  return (
    <motion.div
      className="card-image-container"
      style={{ ...inverted, backgroundColor, originX: 0, originY: 0 }}
    >
      <motion.img
        className="card-image"
        src={imageSrc}
        alt={alt}
        initial={false}
        animate={
          isSelected ? { x: -20, y: -20 } : { x: -pointOfInterest, y: 0 }
        }
        transition={closeSpring}
      />
    </motion.div>
  );
};