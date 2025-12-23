"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface ShowcaseProjectCardProps {
  project: {
    id: string;
    projectTitle: string;
    image: string;
    techStack: string[];
    shortDescription: string;
    links: {
      live?: string;
      github?: string;
    };
    backgroundColor: string;
  };
  onClick: () => void;
  index: number;
}

const ShowcaseProjectCard: React.FC<ShowcaseProjectCardProps> = ({
  project,
  onClick,
  index,
}) => {
  const isReversed = index % 2 !== 0;
  const firstLetter = project.projectTitle.charAt(0).toUpperCase();

  return (
    <motion.div
      className="relative w-full cursor-pointer group"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: 0.1 }}
      onClick={onClick}
    >
      <div
        className={`flex flex-col ${
          isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
        } items-center gap-8 lg:gap-16`}
      >
        {/* Image Section */}
        <motion.div
          className="relative w-full lg:w-1/2 aspect-[4/3] overflow-hidden rounded-lg"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.4 }}
        >
          <Image
            src={project.image}
            alt={project.projectTitle}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: `linear-gradient(135deg, ${project.backgroundColor}66, transparent 60%)`,
            }}
          />
          {/* Subtle overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
        </motion.div>

        {/* Content Section with Large Letter */}
        <div
          className={`relative w-full lg:w-1/2 ${
            isReversed ? "lg:text-right lg:pr-8" : "lg:text-left lg:pl-8"
          }`}
        >
          {/* Large Decorative Letter */}
          <motion.div
            className={`absolute ${
              isReversed
                ? "right-0 lg:-right-4"
                : "left-0 lg:-left-4"
            } -top-16 lg:-top-20 pointer-events-none select-none`}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span
              className="text-[120px] lg:text-[200px] font-bold leading-none"
              style={{
                background: `linear-gradient(180deg, ${project.backgroundColor}, ${project.backgroundColor}44)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                opacity: 0.8,
              }}
            >
              {firstLetter}
            </span>
          </motion.div>

          {/* Project Info */}
          <div className="relative z-10 pt-20 lg:pt-28">
            <motion.h3
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {project.projectTitle}
            </motion.h3>

            <motion.p
              className="text-gray-400 text-sm md:text-base mb-6 leading-relaxed max-w-md"
              style={{ marginLeft: isReversed ? "auto" : "0" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {project.shortDescription.replace(/\*\*/g, "").replace(/:/g, " –")}
            </motion.p>

            {/* Missions Label */}
            <motion.div
              className={`flex items-center gap-2 mb-3 ${
                isReversed ? "justify-end" : "justify-start"
              }`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <span
                className="text-sm font-semibold tracking-wider"
                style={{ color: project.backgroundColor }}
              >
                +
              </span>
              <span className="text-xs font-bold tracking-[0.2em] text-white/80 uppercase">
                Tech Stack
              </span>
            </motion.div>

            {/* Tech Tags */}
            <motion.div
              className={`flex flex-wrap gap-3 ${
                isReversed ? "justify-end" : "justify-start"
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              {project.techStack.slice(0, 4).map((tech, i) => (
                <span
                  key={i}
                  className="text-xs text-gray-400 hover:text-white transition-colors duration-300"
                >
                  {tech}
                  {i < Math.min(project.techStack.length, 4) - 1 && (
                    <span className="ml-3 text-gray-600">•</span>
                  )}
                </span>
              ))}
            </motion.div>

            {/* Action Links */}
            <motion.div
              className={`flex gap-4 mt-6 ${
                isReversed ? "justify-end" : "justify-start"
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs font-medium tracking-wide text-gray-400 hover:text-white transition-colors duration-300 uppercase border-b border-transparent hover:border-white pb-0.5"
                >
                  View Code
                </a>
              )}
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs font-medium tracking-wide uppercase pb-0.5 transition-colors duration-300 border-b"
                  style={{
                    color: project.backgroundColor,
                    borderColor: project.backgroundColor,
                  }}
                >
                  Live Demo
                </a>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ShowcaseProjectCard;
