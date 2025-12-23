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

const EnhancedProjectCard: React.FC<EnhancedProjectCardProps> = ({ project, onClick, index }) => {
  return (
    <motion.div
      className="group cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      whileHover={{ y: -6 }}
      onClick={onClick}
    >
      <div
        className="relative flex flex-col md:flex-row overflow-hidden rounded-2xl shadow-xl"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
          border: `1px solid ${project.backgroundColor}22`,
        }}
      >
        {/* Left: Screenshot area */}
        <div className="w-full md:w-1/2 relative min-h-[220px] md:min-h-[260px] overflow-hidden rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
          <Image src={project.image} alt={project.projectTitle} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(0,0,0,0.45), transparent)` }} />
          <div className="absolute top-4 right-4 px-3 py-2 rounded bg-black/30 text-xs text-white/90">Project Preview</div>
        </div>

        {/* Right: Paper content */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white mb-3">{project.projectTitle}</h3>
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">{project.shortDescription.replace(/\*\*/g, "")}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {project.techStack.map((tech, i) => (
                <span key={i} className="px-3 py-1.5 text-xs font-medium rounded-md" style={{ background: `${project.backgroundColor}18`, color: '#fff', border: `1px solid ${project.backgroundColor}33` }}>{tech}</span>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            {project.links.github && (
              <a href={project.links.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex-1 text-center px-4 py-2 rounded-md border transition-all duration-200" style={{ background: 'transparent', borderColor: `${project.backgroundColor}44`, color: '#fff' }}>
                Code
              </a>
            )}

            {project.links.live && (
              <a href={project.links.live} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex-1 text-center px-4 py-2 rounded-md text-white font-semibold transition-all duration-200" style={{ background: `linear-gradient(90deg, ${project.backgroundColor}, ${project.backgroundColor}BB)` }}>
                Live
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
    };

    export default EnhancedProjectCard;
