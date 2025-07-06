'use client';
import CustomBreadcrumb from '@/app/comps/breadCrumb';
import PageTransition from '@/app/components/PageTransition';
import AnimatedSection from '@/app/components/AnimatedSection';
import { motion } from 'framer-motion';
import { GraduationCap, Award, BookOpen, Target } from 'lucide-react';

export default function Academics() {
  const courses = [
    { name: 'Data Structures & Algorithms', grade: 'A', credits: 3 },
    { name: 'Database Management Systems', grade: 'A-', credits: 3 },
    { name: 'Software Engineering', grade: 'A', credits: 3 },
    { name: 'Machine Learning', grade: 'A-', credits: 3 },
    { name: 'Web Technologies', grade: 'A+', credits: 3 },
    { name: 'Computer Networks', grade: 'A', credits: 3 },
  ];

  const achievements = [
    'Dean\'s List - Fall 2023',
    'Best Project Award - CSE482',
    'Programming Contest Participant',
    'Research Assistant - AI Lab'
  ];

  return (
    <PageTransition>
      <div className="min-h-screen relative z-10">
        <div className='pl-10 opacity-70 font-mono pt-10'>
          <CustomBreadcrumb pageNames={[{ name: "Home", href: "/" }, { name: "Academics", href: "/academics" }]} />
        </div>
        
        {/* Hero Section */}
        <AnimatedSection className="text-center py-20">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <GraduationCap className="text-[#76ABAE]" size={64} />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold gradient-text">
                Academic Journey
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Computer Science & Engineering at North South University
            </p>
          </motion.div>
        </AnimatedSection>

        {/* University Info */}
        <AnimatedSection className="py-20 px-10" delay={0.3}>
          <div className="max-w-6xl mx-auto">
            <div className="glass-card p-12 rounded-lg text-center">
              <h2 className="text-3xl font-bold gradient-text mb-6">North South University</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-[#76ABAE] mb-2">Degree</h3>
                  <p className="text-gray-300">Bachelor of Science</p>
                  <p className="text-gray-400">Computer Science & Engineering</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#76ABAE] mb-2">Duration</h3>
                  <p className="text-gray-300">2021 - 2025</p>
                  <p className="text-gray-400">Expected Graduation</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#76ABAE] mb-2">Focus Areas</h3>
                  <p className="text-gray-300">AI & Machine Learning</p>
                  <p className="text-gray-400">Full-Stack Development</p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Courses */}
        <AnimatedSection className="py-20 px-10" delay={0.5}>
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <BookOpen className="text-[#76ABAE]" size={32} />
                <h2 className="text-3xl font-bold gradient-text">Key Courses</h2>
              </div>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <motion.div
                  key={index}
                  className="glass-card p-6 rounded-lg"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <h3 className="font-bold text-[#76ABAE] mb-2">{course.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Grade: {course.grade}</span>
                    <span className="text-gray-400">{course.credits} Credits</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Achievements */}
        <AnimatedSection className="py-20 px-10" delay={0.7}>
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Award className="text-[#76ABAE]" size={32} />
                <h2 className="text-3xl font-bold gradient-text">Achievements</h2>
              </div>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  className="glass-card p-6 rounded-lg flex items-center gap-4"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Target className="text-[#76ABAE] flex-shrink-0" size={24} />
                  <span className="text-gray-300">{achievement}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </PageTransition>
  );
}