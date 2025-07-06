'use client';
import CustomBreadcrumb from '@/app/comps/breadCrumb';
import PageTransition from '@/app/components/PageTransition';
import AnimatedSection from '@/app/components/AnimatedSection';
import TimelineItem from '@/app/components/TimelineItem';
import SkillBar from '@/app/components/SkillBar';
import { motion } from 'framer-motion';
import { User, GraduationCap, Code, Brain } from 'lucide-react';

export default function Page() {
  const skills = [
    { name: 'JavaScript/TypeScript', percentage: 90 },
    { name: 'React/Next.js', percentage: 85 },
    { name: 'Node.js/Express', percentage: 80 },
    { name: 'Python/AI/ML', percentage: 75 },
    { name: 'MongoDB/SQL', percentage: 70 },
    { name: 'TailwindCSS', percentage: 85 },
  ];

  const timeline = [
    {
      title: 'Computer Science & Engineering',
      subtitle: 'North South University',
      period: '2021 - Present',
      description: 'Pursuing Bachelor\'s degree with focus on AI, Machine Learning, and Full-Stack Development. Maintaining strong academic performance while working on innovative projects.'
    },
    {
      title: 'Full-Stack Developer',
      subtitle: 'Freelance & Personal Projects',
      period: '2022 - Present',
      description: 'Developing modern web applications using React, Next.js, and Node.js. Specialized in creating responsive, user-friendly interfaces with clean, maintainable code.'
    },
    {
      title: 'AI & Machine Learning Enthusiast',
      subtitle: 'Research & Development',
      period: '2023 - Present',
      description: 'Exploring deep learning, neural networks, and AI applications. Built physics chatbot and working on innovative AI-powered solutions.'
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen relative z-10">
        <div className='pl-10 opacity-70 font-mono pt-10'>
          <CustomBreadcrumb pageNames={[{ name: "Home", href: "/" }, { name: "About Me", href: "/aboutme" }]} />
        </div>
        
        {/* Hero Section */}
        <AnimatedSection className="text-center py-20">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#76ABAE] to-[#5a9ca0] flex items-center justify-center">
              <User size={64} className="text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold gradient-text mb-4">
              Hello, I'm Asif Bhuiyan Shawon
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              A passionate Computer Science student at North South University, specializing in AI, Machine Learning, 
              and Full-Stack Development. I love creating innovative solutions that bridge technology and user experience.
            </p>
          </motion.div>
        </AnimatedSection>

        {/* Skills Section */}
        <AnimatedSection className="py-20 px-10" delay={0.3}>
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Code className="text-[#76ABAE]" size={32} />
                <h2 className="text-3xl font-bold gradient-text">Technical Skills</h2>
              </div>
              <p className="text-gray-400">Technologies I work with</p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass-card p-8 rounded-lg">
                <h3 className="text-xl font-bold mb-6 text-[#76ABAE]">Frontend & Backend</h3>
                {skills.slice(0, 3).map((skill, index) => (
                  <SkillBar
                    key={skill.name}
                    skill={skill.name}
                    percentage={skill.percentage}
                    delay={index * 0.1}
                  />
                ))}
              </div>
              
              <div className="glass-card p-8 rounded-lg">
                <h3 className="text-xl font-bold mb-6 text-[#76ABAE]">AI & Databases</h3>
                {skills.slice(3).map((skill, index) => (
                  <SkillBar
                    key={skill.name}
                    skill={skill.name}
                    percentage={skill.percentage}
                    delay={(index + 3) * 0.1}
                  />
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Timeline Section */}
        <AnimatedSection className="py-20 px-10" delay={0.5}>
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <GraduationCap className="text-[#76ABAE]" size={32} />
                <h2 className="text-3xl font-bold gradient-text">My Journey</h2>
              </div>
              <p className="text-gray-400">Education and experience timeline</p>
            </motion.div>
            
            <div className="relative">
              {timeline.map((item, index) => (
                <TimelineItem
                  key={index}
                  title={item.title}
                  subtitle={item.subtitle}
                  period={item.period}
                  description={item.description}
                  delay={index * 0.2}
                />
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* AI Focus Section */}
        <AnimatedSection className="py-20 px-10" delay={0.7}>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className="glass-card p-12 rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <Brain className="text-[#76ABAE]" size={48} />
                <h2 className="text-3xl font-bold gradient-text">AI & Innovation</h2>
              </div>
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                I'm passionate about artificial intelligence and its potential to solve real-world problems. 
                Currently exploring deep learning, neural networks, and building AI-powered applications 
                that make technology more accessible and intuitive.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 bg-white/5 rounded-lg">
                  <h4 className="font-bold text-[#76ABAE] mb-2">Machine Learning</h4>
                  <p className="text-sm text-gray-400">Building predictive models and intelligent systems</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <h4 className="font-bold text-[#76ABAE] mb-2">Deep Learning</h4>
                  <p className="text-sm text-gray-400">Neural networks and advanced AI architectures</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <h4 className="font-bold text-[#76ABAE] mb-2">AI Applications</h4>
                  <p className="text-sm text-gray-400">Practical AI solutions for everyday problems</p>
                </div>
              </div>
            </motion.div>
          </div>
        </AnimatedSection>
      </div>
    </PageTransition>
  );
}