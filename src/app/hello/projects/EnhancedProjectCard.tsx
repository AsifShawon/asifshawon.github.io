"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink, Github, Code2 } from "lucide-react";

interface EnhancedProjectCardProps {
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

const EnhancedProjectCard: React.FC<EnhancedProjectCardProps> = ({
  project,
  onClick,
  index,
}) => {
  return (
    <motion.div
      className="group relative cursor-pointer"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      onClick={onClick}
    >
      {/* Card Container */}
      <div
        className="relative overflow-hidden rounded-2xl border-2 transition-all duration-500 bg-[#1a1f2e]/90 backdrop-blur-sm"
        style={{
          borderColor: `${project.backgroundColor}30`,
          boxShadow: `0 10px 40px -10px ${project.backgroundColor}60, 0 0 0 1px ${project.backgroundColor}20`,
        }}
      >
        {/* Accent Border - Left Side */}
        <div
          className="absolute left-0 top-0 w-1.5 h-full transition-all duration-500 group-hover:w-2"
          style={{ 
            background: `linear-gradient(to bottom, ${project.backgroundColor}, ${project.backgroundColor}80)`,
          }}
        />

        {/* Image Section */}
        <div className="relative h-64 md:h-72 overflow-hidden">
          <Image
            src={project.image}
            alt={project.projectTitle}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110 brightness-90 group-hover:brightness-100"
          />
          {/* Gradient Overlay */}
          <div
            className="absolute inset-0 opacity-90"
            style={{
              background: `linear-gradient(to top, #0f1419 0%, ${project.backgroundColor}15 50%, transparent 100%)`,
            }}
          />
          
          {/* Hover Overlay */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${project.backgroundColor}CC, #1a1f2eCC)`,
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <Code2 className="text-white mx-auto mb-2" size={48} />
              <p className="text-white font-semibold text-lg">View Project Details</p>
            </motion.div>
          </div>

          {/* Project Preview Label */}
          <div className="absolute top-4 right-4 px-4 py-2 rounded-lg backdrop-blur-md bg-black/40 border border-white/20">
            <p className="text-white/90 text-xs font-medium">Project Preview</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 bg-gradient-to-b from-[#1a1f2e] to-[#0f1419]">
          {/* Title */}
          <h3 
            className="text-xl md:text-2xl font-bold mb-3 transition-colors duration-300"
            style={{
              color: '#ffffff',
            }}
          >
            {project.projectTitle}
          </h3>

          {/* Short Description */}
          <div className="text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
            {project.shortDescription.replace(/\*\*/g, "")}
          </div>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.techStack.slice(0, 4).map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: `${project.backgroundColor}20`,
                  color: '#ffffff',
                  border: `1px solid ${project.backgroundColor}50`,
                }}
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span 
                className="px-3 py-1.5 text-xs font-medium rounded-lg"
                style={{
                  backgroundColor: `${project.backgroundColor}20`,
                  color: '#ffffff',
                  border: `1px solid ${project.backgroundColor}50`,
                }}
              >
                +{project.techStack.length - 4} more
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t" style={{ borderColor: `${project.backgroundColor}30` }}>
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 flex-1 justify-center group/btn border hover:scale-105"
                style={{
                  backgroundColor: `${project.backgroundColor}25`,
                  borderColor: `${project.backgroundColor}60`,
                  color: '#ffffff',
                }}
              >
                <Github size={18} className="group-hover/btn:scale-110 transition-transform" />
                <span className="text-sm font-semibold">Code</span>
              </a>
            )}
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 flex-1 justify-center group/btn hover:scale-105 shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${project.backgroundColor}, ${project.backgroundColor}DD)`,
                  color: '#ffffff',
                }}
              >
                <ExternalLink size={18} className="group-hover/btn:scale-110 transition-transform" />
                <span className="text-sm font-semibold">Live</span>
              </a>
            )}
          </div>
        </div>

        {/* Accent Border on Hover - Top */}
        <div
          className="absolute top-0 left-0 w-full h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
          style={{ backgroundColor: project.backgroundColor }}
        />
      </div>
    </motion.div>
  );
};

export default EnhancedProjectCard;
