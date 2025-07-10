import * as React from "react";
import { memo, useRef, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";
import { useInvertedBorderRadius } from "../utils/use-inverted-border-radius";
import { CardData } from "../../types";
import { ProjectDetails } from "./ProjectDetails";
import { Title } from "./Title";
import { Image } from "./Image";
import { openSpring, closeSpring } from "./animations";
import { useScrollConstraints } from "../utils/use-scroll-constraints";
import { useWheelScroll } from "../utils/use-wheel-scroll";
import "./card.css";

interface Props extends CardData {
  isSelected: boolean;
  history: {
    push: (id: string | null) => void;
  };
}

const dismissDistance = 150;

export const Card = memo(
  ({
    isSelected,
    id,
    projectTitle,
    image,
    techStack,
    shortDescription,
    description,
    links,
    modalImages,
    backgroundColor,
    history,
  }: Props) => {
    const y = useMotionValue(0);
    const zIndex = useMotionValue(isSelected ? 2 : 0);
    const inverted = useInvertedBorderRadius(20);
    const cardRef = useRef(null);
    const constraints = useScrollConstraints(cardRef, isSelected);

    // Handle body scroll lock when modal is open
    useEffect(() => {
      if (isSelected) {
        document.body.classList.add('modal-open');
        // Reset scroll position when opening modal
        window.scrollTo(0, 0);
      } else {
        document.body.classList.remove('modal-open');
      }

      // Cleanup on unmount
      return () => {
        document.body.classList.remove('modal-open');
      };
    }, [isSelected]);

    function checkSwipeToDismiss() {
      if (y.get() > dismissDistance) {
        history.push(null);
      }
    }

    function checkZIndex(latest: any) {
      if (isSelected) {
        zIndex.set(2);
      } else if (!isSelected && latest.scaleX < 1.01) {
        zIndex.set(0);
      }
    }

    const containerRef = useRef(null);
    
    // Only use wheel scroll for drag interactions, not for modal content scrolling
    useWheelScroll(
      containerRef,
      y,
      constraints,
      checkSwipeToDismiss,
      isSelected && !isSelected // Disable wheel scroll for modal
    );

    return (
      <li ref={containerRef} className={`card`}>
        <Overlay isSelected={isSelected} onClick={() => history.push(null)} />
        <div className={`card-content-container ${isSelected && "open"}`}>
          <motion.div
            ref={cardRef}
            className="card-content"
            style={{ 
              ...inverted, 
              zIndex, 
              y: isSelected ? 0 : y // Don't apply y transform when selected
            }}
            layout
            transition={isSelected ? openSpring : closeSpring}
            drag={isSelected ? "y" : false}
            dragConstraints={constraints}
            onDragEnd={checkSwipeToDismiss}
            onUpdate={checkZIndex}
          >
            <Image
              id={id}
              imageSrc={image}
              isSelected={isSelected}
              alt={projectTitle}
              backgroundColor={backgroundColor}
            />
            <Title title={projectTitle} techStack={techStack} isSelected={isSelected} />
            <div className="short-description">
                <p>{shortDescription}</p>
            </div>
            {isSelected && <ProjectDetails description={description} links={links} modalImages={modalImages} />}
          </motion.div>
        </div>
        {!isSelected && (
          <motion.button
            className="card-open-link"
            onClick={() => history.push(id)}
            aria-label={`Open card: ${projectTitle}`}
          />
        )}
      </li>
    );
  },
  (prev, next) => prev.isSelected === next.isSelected
);

Card.displayName = "Card";

const Overlay: React.FC<{ isSelected: boolean; onClick: () => void }> = ({ isSelected, onClick }) => (
  <motion.div
    initial={false}
    animate={{ opacity: isSelected ? 1 : 0 }}
    transition={{ duration: 0.2 }}
    className="overlay"
    style={{ pointerEvents: isSelected ? "auto" : "none" }}
    onClick={onClick}
  />
);