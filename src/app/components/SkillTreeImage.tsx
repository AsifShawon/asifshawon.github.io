"use client";
import { motion } from "framer-motion";
import React from "react";

interface TechItem {
  name: string;
  icon?: string;
}

interface CategoryData {
  title: string;
  color: string;
  items: TechItem[];
}

const SkillTreeImage = () => {
  const categories: CategoryData[] = [
    {
      title: "FRONTEND",
      color: "#76ABAE",
      items: [
        { name: "HTML" },
        { name: "CSS" },
        { name: "JavaScript" },
        { name: "React" },
        { name: "Next.js" },
        { name: "TailwindCSS" },
        { name: "TypeScript" },
      ],
    },
    {
      title: "BACKEND",
      color: "#5a9ca0",
      items: [
        { name: "Node.js" },
        { name: "Express" },
        { name: "Python" },
        { name: "Flask" },
        { name: "Django" },
        { name: "PostgreSQL" },
        { name: "MongoDB" },
      ],
    },
    {
      title: "AI / ML",
      color: "#88c0d0",
      items: [
        { name: "Machine Learning" },
        { name: "TensorFlow" },
        { name: "Pandas" },
        { name: "NumPy" },
        { name: "Scikit-learn" },
        { name: "NLP" },
      ],
    },
    {
      title: "TOOLS",
      color: "#7aa2a2",
      items: [
        { name: "Git" },
        { name: "GitHub" },
        { name: "Docker" },
        { name: "AWS" },
        { name: "Vercel" },
        { name: "Linux" },
      ],
    },
  ];

  return (
    <div className="w-full py-8">
      {/* Root Node */}
      <motion.div
        className="text-center mb-12"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-block relative">
          <div className="glass-card px-8 py-4 rounded-lg border-2 border-[#76ABAE]">
            <h3 className="text-2xl font-bold gradient-text">Technical Skills</h3>
          </div>
          {/* Vertical line from root */}
          <div className="absolute left-1/2 top-full w-0.5 h-12 bg-gradient-to-b from-[#76ABAE] to-transparent transform -translate-x-1/2"></div>
        </div>
      </motion.div>

      {/* Categories Grid - Responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 max-w-7xl mx-auto px-4">
        {categories.map((category, catIndex) => (
          <motion.div
            key={category.title}
            className="relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: catIndex * 0.15 }}
          >
            {/* Connector line to root (hidden on mobile) */}
            <div className="hidden lg:block absolute bottom-full left-1/2 w-0.5 h-12 bg-gradient-to-t from-[#76ABAE] to-transparent transform -translate-x-1/2"></div>
            
            {/* Category Header */}
            <div className="mb-6">
              <div
                className="glass-card px-6 py-3 rounded-lg text-center border-2 hover:scale-105 transition-transform duration-300"
                style={{ borderColor: category.color }}
              >
                <h4
                  className="text-lg font-bold uppercase tracking-wider"
                  style={{ color: category.color }}
                >
                  {category.title}
                </h4>
              </div>
              {/* Vertical line from category */}
              <div
                className="mx-auto w-0.5 h-8"
                style={{
                  background: `linear-gradient(to bottom, ${category.color}, transparent)`,
                }}
              ></div>
            </div>

            {/* Skills Items */}
            <div className="space-y-4">
              {category.items.map((item, itemIndex) => (
                <motion.div
                  key={item.name}
                  className="relative"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: catIndex * 0.15 + itemIndex * 0.05,
                  }}
                >
                  {/* Horizontal connector */}
                  <div className="absolute -left-4 top-1/2 w-4 h-0.5 bg-gradient-to-r from-transparent to-[#76ABAE] transform -translate-y-1/2 opacity-50"></div>
                  
                  {/* Skill Badge */}
                  <div
                    className="glass-card px-4 py-2.5 rounded-md hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer border border-transparent hover:border-[#76ABAE]/50"
                    style={{
                      background: `linear-gradient(135deg, rgba(118, 171, 174, 0.1), rgba(90, 156, 160, 0.05))`,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-gray-300 text-sm font-medium">
                        {item.name}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mobile Connection Hint */}
      <motion.div
        className="lg:hidden text-center mt-8 text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Swipe to explore all skill categories
      </motion.div>
    </div>
  );
};

export default SkillTreeImage;
