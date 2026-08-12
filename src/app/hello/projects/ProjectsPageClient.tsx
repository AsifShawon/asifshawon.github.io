"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import CustomBreadcrumb from "@/app/comps/breadCrumb";
import ShowcaseProjectCard from "./ShowcaseProjectCard";
import ProjectModal from "./ProjectModal";
import type { LegacyProject } from "./transform";

export default function ProjectsPageClient({ projects }: { projects: LegacyProject[] }) {
  const [selectedProject, setSelectedProject] = useState<LegacyProject | null>(null);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Breadcrumb */}
      <div className="pl-6 md:pl-10 opacity-70 font-mono pt-8">
        <CustomBreadcrumb
          pageNames={[
            { name: "Home", href: "/" },
            { name: "Projects", href: "/hello/projects" },
          ]}
        />
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-2 pb-20">
        {/* Two Column Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mt-16 mb-24">
          {/* Left - Tagline */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* The page's one H1 — same visual treatment as before, but the
                document now has a top-level heading instead of starting at H2. */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light italic text-white/90 leading-tight">
              Transforming vision and ideas into{" "}
              <span className="text-[#76ABAE]">valuable</span> and tangible
              products with measurable impact.
            </h1>
          </motion.div>

          {/* Right - Description */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex items-center"
          >
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Driven by my passion for technology and problem-solving, I
              developed expertise in both full-stack development and machine
              learning, allowing me to bridge the gap between elegant interfaces
              and intelligent systems. These days that same instinct for testing
              and iterating shows up in ecommerce — but here&apos;s the technical
              work that built the foundation.
            </p>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-20"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />

        {/* Project Cards */}
        <div className="space-y-32 md:space-y-40">
          {projects.map((project, index) => (
            <ShowcaseProjectCard
              key={project.id}
              project={project}
              onClick={() => setSelectedProject(project)}
              index={index}
            />
          ))}
        </div>

        {/* Footer CTA */}
        <motion.div
          className="text-center mt-32 pt-20 border-t border-gray-800"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-gray-500 text-sm mb-4">
            Interested in working together?
          </p>
          {/* Was a `mailto:your-email@example.com` placeholder — now points at
              the real contact page. */}
          <Link
            href="/contact"
            className="inline-block text-white text-lg font-medium border-b-2 border-[#76ABAE] pb-1 hover:text-[#76ABAE] transition-colors duration-300"
          >
            Let&apos;s Connect
          </Link>
        </motion.div>
      </div>

      {/* Project Modal */}
      {projects.length > 0 && (
        <ProjectModal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          project={selectedProject || projects[0]}
        />
      )}
    </div>
  );
}
