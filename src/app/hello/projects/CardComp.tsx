"use client";

import React, { useState } from "react";
import EnhancedProjectCard from "./EnhancedProjectCard";
import ProjectModal from "./ProjectModal";
import cardData from "./projectData.json";

const List = () => {
  const [selectedProject, setSelectedProject] = useState<any>(null);

  return (
    <>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
        {cardData.map((project, index) => (
          <EnhancedProjectCard
            key={project.id}
            project={project}
            onClick={() => setSelectedProject(project)}
            index={index}
          />
        ))}
      </div>

      <ProjectModal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject || cardData[0]}
      />
    </>
  );
};

export default function CardComp() {
  return <List />;
}
