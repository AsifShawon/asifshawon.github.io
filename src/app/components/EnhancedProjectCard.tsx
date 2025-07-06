'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Github, ExternalLink, Code } from 'lucide-react';

interface Project {
  title: string;
  images: string[];
  description: string;
  githubLink: string;
  siteLink?: {
    url: string;
    type: string;
  };
  technologies?: string[];
}

interface EnhancedProjectCardProps {
  project: Project;
  index: number;
}

export default function EnhancedProjectCard({ project, index }: EnhancedProjectCardProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { title, description, images, githubLink, siteLink, technologies = [] } = project;

  return (
    <motion.div
      ref={ref}
      className="lg:w-10/12 w-full"
      initial={{ opacity: 0, y: 50, rotateX: 10 }}
      animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: 10 }}
      transition={{ duration: 0.8, delay: index * 0.2, ease: 'easeOut' }}
    >
      <div className="project-card relative overflow-hidden rounded-[15px] glass-card group cursor-pointer">
        <div className="relative">
          <Image
            src={images[0]}
            alt={title}
            width={800}
            height={600}
            className="rounded-[15px] h-72 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Overlay */}
          <div className="project-overlay">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>
              <p className="text-white/90 mb-6 leading-relaxed">{description}</p>
              
              {technologies.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-white/20 rounded-full text-sm text-white backdrop-blur-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="flex justify-center gap-4">
                <motion.a
                  href={githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github size={18} />
                  Code
                </motion.a>
                
                {siteLink && (
                  <motion.a
                    href={siteLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors backdrop-blur-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink size={18} />
                    {siteLink.type === 'live' ? 'Live Site' : 'Demo'}
                  </motion.a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 gradient-text">{title}</h3>
          <div className="flex justify-end gap-4">
            <motion.a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#76ABAE] hover:text-white transition-colors flex items-center gap-1"
              whileHover={{ scale: 1.1 }}
            >
              <Github size={16} />
              GitHub
            </motion.a>
            
            {siteLink && (
              <motion.a
                href={siteLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#76ABAE] hover:text-white transition-colors flex items-center gap-1"
                whileHover={{ scale: 1.1 }}
              >
                <ExternalLink size={16} />
                {siteLink.type === 'live' ? 'Live Site' : 'Demo'}
              </motion.a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}