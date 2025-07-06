'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import PageTransition from '@/app/components/PageTransition';
import AnimatedSection from '@/app/components/AnimatedSection';
import { BookOpen, ArrowRight, Brain } from 'lucide-react';

const notes = [
  {
    id: 1,
    title: "CSE465",
    description: "Deep Learning and Neural Networks",
    link: "/notes/CSE465/Spring2025/Deep Learning CSE/Deep Learning CSE.html",
    color: "from-[#76ABAE] to-[#5a9ca0]",
    topics: ["Neural Networks", "Deep Learning", "AI Fundamentals"]
  },
];

export default function Notes() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background p-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <AnimatedSection>
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <Brain className="text-[#76ABAE]" size={64} />
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold gradient-text">
                  Study Notes
                </h1>
              </div>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Comprehensive notes and insights from my academic journey in Computer Science
              </p>
            </motion.div>
          </AnimatedSection>
          
          {/* Notes Grid */}
          <AnimatedSection delay={0.3}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {notes.map((note, index) => {
                const [ref, inView] = useInView({
                  triggerOnce: true,
                  threshold: 0.1,
                });

                return (
                  <motion.div
                    key={note.id}
                    ref={ref}
                    initial={{ opacity: 0, y: 50, rotateY: 10 }}
                    animate={inView ? { opacity: 1, y: 0, rotateY: 0 } : { opacity: 0, y: 50, rotateY: 10 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    whileHover={{ y: -10, rotateY: 5 }}
                    className="group"
                  >
                    <Link href={note.link} className="block">
                      <div className="glass-card relative overflow-hidden transition-all duration-500 hover:shadow-2xl transform perspective-1000">
                        {/* Gradient Background */}
                        <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${note.color}`} />
                        
                        {/* Content */}
                        <div className="p-8">
                          <div className="flex items-center gap-3 mb-4">
                            <BookOpen className="w-8 h-8 text-[#76ABAE]" />
                            <h2 className="text-2xl font-bold gradient-text">{note.title}</h2>
                          </div>
                          
                          <p className="text-gray-300 mb-6 leading-relaxed">{note.description}</p>
                          
                          {/* Topics */}
                          <div className="mb-6">
                            <h4 className="text-sm font-semibold text-[#76ABAE] mb-3">Topics Covered:</h4>
                            <div className="flex flex-wrap gap-2">
                              {note.topics.map((topic, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300 backdrop-blur-sm"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          {/* Action */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Click to view notes</span>
                            <motion.div
                              className="flex items-center gap-2 text-[#76ABAE]"
                              whileHover={{ x: 5 }}
                              transition={{ duration: 0.2 }}
                            >
                              <span className="text-sm font-medium">Open</span>
                              <ArrowRight className="w-4 h-4" />
                            </motion.div>
                          </div>
                        </div>
                        
                        {/* Hover Effect Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#76ABAE]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </AnimatedSection>

          {/* Coming Soon Section */}
          <AnimatedSection delay={0.5} className="mt-16">
            <motion.div
              className="text-center glass-card p-12 rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl font-bold gradient-text mb-4">More Notes Coming Soon</h3>
              <p className="text-gray-400 mb-6">
                I'm continuously adding new study materials and insights from my courses.
                Stay tuned for updates on Data Structures, Algorithms, and more!
              </p>
              <div className="flex justify-center gap-4 text-sm text-gray-500">
                <span>• Data Structures & Algorithms</span>
                <span>• Software Engineering</span>
                <span>• Database Systems</span>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </div>
    </PageTransition>
  );
}