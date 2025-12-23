"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Github, ExternalLink, Code2 } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id: string;
    projectTitle: string;
    image: string;
    techStack: string[];
    shortDescription: string;
    description: string;
    links: {
      live?: string;
      github?: string;
    };
    modalImages?: string[];
    backgroundColor: string;
  };
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, project }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
            <motion.div
              className="relative w-full max-w-5xl max-h-[90vh] bg-gradient-to-br from-[#1a1f2e] to-[#0f1419] rounded-2xl shadow-2xl overflow-hidden"
              style={{
                border: `2px solid ${project.backgroundColor}40`,
                boxShadow: `0 0 60px ${project.backgroundColor}30, 0 0 120px ${project.backgroundColor}15`,
              }}
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-3 rounded-full transition-all duration-300 hover:rotate-90 hover:scale-110 shadow-lg"
                style={{
                  backgroundColor: `${project.backgroundColor}30`,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${project.backgroundColor}60`,
                }}
                aria-label="Close modal"
              >
                <X className="text-white" size={24} />
              </button>

              {/* Scrollable Content */}
              <div className="overflow-y-auto max-h-[90vh] custom-scrollbar">
                {/* Header Image */}
                <div className="relative h-64 md:h-80 w-full overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.projectTitle}
                    fill
                    className="object-cover brightness-90"
                    priority
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, #0f1419 0%, ${project.backgroundColor}25 50%, transparent 100%)`,
                    }}
                  />
                  {/* Accent Line */}
                  <div
                    className="absolute bottom-0 left-0 w-full h-1.5"
                    style={{
                      background: `linear-gradient(90deg, ${project.backgroundColor}, ${project.backgroundColor}80, ${project.backgroundColor})`,
                    }}
                  />
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 lg:p-10">
                  {/* Title */}
                  <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                    {project.projectTitle}
                  </h2>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.techStack.map((tech, index) => (
                      <motion.span
                        key={index}
                        className="px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 hover:scale-105"
                        style={{
                          backgroundColor: `${project.backgroundColor}25`,
                          color: '#ffffff',
                          border: `1px solid ${project.backgroundColor}60`,
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex flex-wrap gap-4 mb-8">
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
                        style={{
                          backgroundColor: `${project.backgroundColor}30`,
                          border: `2px solid ${project.backgroundColor}70`,
                          color: '#ffffff',
                        }}
                      >
                        <Github size={20} />
                        <span>View Code</span>
                      </a>
                    )}
                    {project.links.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
                        style={{
                          background: `linear-gradient(135deg, ${project.backgroundColor}, ${project.backgroundColor}DD)`,
                          color: '#ffffff',
                        }}
                      >
                        <ExternalLink size={20} />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>

                  {/* Description */}
                  <div className="prose prose-invert prose-lg max-w-none mb-8">
                    <ReactMarkdown
                      components={{
                        h1: ({ ...props }) => (
                          <h1 className="text-3xl font-bold text-white mb-4" {...props} />
                        ),
                        h2: ({ ...props }) => (
                          <h2 
                            className="text-2xl font-bold mt-8 mb-4" 
                            style={{ color: project.backgroundColor }}
                            {...props} 
                          />
                        ),
                        h3: ({ ...props }) => (
                          <h3 className="text-xl font-bold text-gray-200 mt-6 mb-3" {...props} />
                        ),
                        p: ({ ...props }) => (
                          <p className="text-gray-300 leading-relaxed mb-4" {...props} />
                        ),
                        ul: ({ ...props }) => (
                          <ul className="list-none space-y-2 mb-4" {...props} />
                        ),
                        li: ({ ...props }) => (
                          <li className="flex items-start gap-2 text-gray-300">
                            <Code2 
                              className="mt-1 flex-shrink-0" 
                              size={16}
                              style={{ color: project.backgroundColor }}
                            />
                            <span {...props} />
                          </li>
                        ),
                        strong: ({ ...props }) => (
                          <strong 
                            className="font-semibold" 
                            style={{ color: project.backgroundColor }}
                            {...props} 
                          />
                        ),
                      }}
                    >
                      {project.description}
                    </ReactMarkdown>
                  </div>

                  {/* Modal Images Gallery */}
                  {project.modalImages && project.modalImages.length > 0 && (
                    <div className="mt-8">
                      <h3 
                        className="text-2xl font-bold mb-6"
                        style={{ color: project.backgroundColor }}
                      >
                        Project Gallery
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {project.modalImages.map((img, index) => (
                          <motion.div
                            key={index}
                            className="relative aspect-video rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
                            style={{
                              border: `2px solid ${project.backgroundColor}30`,
                              boxShadow: `0 4px 12px ${project.backgroundColor}20`,
                            }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Image
                              src={img}
                              alt={`${project.projectTitle} screenshot ${index + 1}`}
                              fill
                              className="object-cover hover:scale-110 transition-transform duration-500"
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
