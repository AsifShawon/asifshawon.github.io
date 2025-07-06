'use client';
import CustomBreadcrumb from '@/app/comps/breadCrumb';
import EnhancedProjectCard from '@/app/components/EnhancedProjectCard';
import PageTransition from '@/app/components/PageTransition';
import AnimatedSection from '@/app/components/AnimatedSection';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FolderCode } from 'lucide-react';

export default function Page() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('/assets/projects.json')
      .then((response) => response.json())
      .then((data) => {
        // Add technologies to projects
        const enhancedProjects = data.map((project: any, index: number) => ({
          ...project,
          technologies: index === 0 ? ['Python', 'LangChain', 'AI/ML'] :
                       index === 1 ? ['React', 'Next.js', 'TailwindCSS'] :
                       ['React', 'Node.js', 'Security']
        }));
        setProjects(enhancedProjects);
      })
      .catch((error) => console.error('Error loading projects:', error));
  }, []);

  return (
    <PageTransition>
      <div className='lg:pl-5 lg:pr-5 min-h-screen relative z-10'>
        <div className='pl-10 opacity-70 font-mono pt-10'>
          <CustomBreadcrumb pageNames={[{ name: "Home", href: "/" }, { name: "Projects", href: "/hello/projects" }]} />
        </div>
        
        <AnimatedSection className='pt-5'>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <FolderCode className="text-[#76ABAE]" size={48} />
              <h1 className='text-[40px] font-bold gradient-text'>Projects Gallery</h1>
            </div>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              A showcase of my latest work in AI, web development, and innovative solutions
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-10 pl-4 pr-4 lg:pl-16">
            {projects.map((project, index) => (
              <EnhancedProjectCard key={index} project={project} index={index} />
            ))}
          </div>
        </AnimatedSection>
      </div>
    </PageTransition>
  );
}