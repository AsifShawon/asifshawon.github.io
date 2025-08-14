import * as React from "react";
import { motion, useDeprecatedInvertedScale } from "framer-motion";
import { closeSpring, openSpring } from "./animations";

interface ImageProps {
  id: string;
  imageSrc: string;
  isSelected: boolean;
  alt: string;
  backgroundColor?: string;
}

export const Image: React.FC<ImageProps> = ({ 
  id, 
  imageSrc, 
  isSelected, 
  alt, 
  backgroundColor 
}) => {
  const inverted = useDeprecatedInvertedScale();

  return (
    <motion.div
      className="card-image-container"
      style={{ 
        ...inverted, 
        backgroundColor: backgroundColor || '#f0f0f0',
        originX: 0.5, 
        originY: 0 
      }}
      transition={isSelected ? openSpring : closeSpring}
    >
      <motion.img
        className="card-image"
        src={imageSrc}
        alt={alt}
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center'
        }}
        initial={false}
        animate={{ 
          scale: isSelected ? 1 : 1 
        }}
        transition={isSelected ? openSpring : closeSpring}
      />
    </motion.div>
  );
};
