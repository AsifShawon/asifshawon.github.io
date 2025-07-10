import * as React from "react";
import { motion, useDeprecatedInvertedScale, TransformProperties } from "framer-motion";
import { closeSpring, openSpring } from "./animations";

interface TitleProps {
  title: string;
  techStack: string[];
  isSelected: boolean;
}

export const Title: React.FC<TitleProps> = ({ title, techStack, isSelected }) => {
  const inverted = useDeprecatedInvertedScale();
  const x = isSelected ? 30 : 15;
  const y = x;

  return (
    <motion.div
      className="title-container"
      initial={false}
      animate={{ x, y }}
      transition={isSelected ? openSpring as any : closeSpring as any}
      transformTemplate={scaleTranslate}
      style={{ ...inverted, originX: 0, originY: 0 }}
    >
      <div className="tech-stack">
        {techStack.slice(0,3).map((tech) => (
          <span key={tech} className="tech-item">{tech}</span>
        ))}
      </div>
      <h2>{title}</h2>
    </motion.div>
  );
};

const scaleTranslate = ({ x, y, scaleX, scaleY }: TransformProperties): string =>
  `scaleX(${scaleX || 1}) scaleY(${scaleY || 1}) translate(${x || 0}, ${y || 0}) translateZ(0)`;
