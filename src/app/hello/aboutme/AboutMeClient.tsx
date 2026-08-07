"use client";
import CustomBreadcrumb from "@/app/comps/breadCrumb";
import PageTransition from "@/app/components/PageTransition";
import AnimatedSection from "@/app/components/AnimatedSection";
import TimelineItem from "@/app/components/TimelineItem";
import SkillTreeImage from "@/app/components/SkillTreeImage"; // ⬅️ New image-like skill map
import { motion } from "framer-motion";
import type { Profile } from "@/lib/supabase/types";
import {
  User,
  GraduationCap,
  Code,
  Brain,
  Award,
  MapPin,
  Mail,
  Phone,
  Globe,
} from "lucide-react";

const ACHIEVEMENT_ICONS: Record<string, React.ReactNode> = {
  award: <Award className="text-[#76ABAE]" size={24} />,
  code: <Code className="text-[#76ABAE]" size={24} />,
  brain: <Brain className="text-[#76ABAE]" size={24} />,
};

export default function AboutMeClient({ profile }: { profile: Profile | null }) {
  const fullName = profile?.full_name || "Asif Bhuiyan Shawon";
  const tagline =
    profile?.tagline ||
    "Computer Science & Engineering Student | AI/ML Engineer | Full-Stack Developer";
  const intro = profile?.bio?.intro || "";
  const timeline = profile?.bio?.timeline ?? [];
  const achievements = profile?.bio?.achievements ?? [];
  const socials = profile?.socials || {};

  return (
    <PageTransition>
      <div className="min-h-screen relative z-10">
        <div className="pl-10 opacity-70 font-mono pt-10">
          <CustomBreadcrumb
            pageNames={[
              { name: "Home", href: "/" },
              { name: "About Me", href: "/aboutme" },
            ]}
          />
        </div>

        {/* Hero Section */}
        <AnimatedSection className="text-center py-20">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#76ABAE] to-[#5a9ca0] flex items-center justify-center overflow-hidden">
              {profile?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={64} className="text-white" />
              )}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold gradient-text mb-4">
              {fullName}
            </h1>
            <p className="text-2xl text-[#76ABAE] mb-4 font-semibold">
              {tagline}
            </p>
            {intro && (
              <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
                {intro}
              </p>
            )}

            {/* Contact Info */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              {socials.email && (
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>{socials.email}</span>
                </div>
              )}
              {socials.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>{socials.phone}</span>
                </div>
              )}
              {socials.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>{socials.location}</span>
                </div>
              )}
              {socials.website && (
                <div className="flex items-center gap-2">
                  <Globe size={16} />
                  <span>{socials.website}</span>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatedSection>

        {/* Achievements Section */}
        {achievements.length > 0 && (
          <AnimatedSection className="py-20 px-10" delay={0.2}>
            <div className="max-w-6xl mx-auto">
              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Award className="text-[#76ABAE]" size={32} />
                  <h2 className="text-3xl font-bold gradient-text">Key Achievements</h2>
                </div>
                <p className="text-gray-400">Highlights of my academic and professional journey</p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    className="glass-card p-6 rounded-lg text-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                  >
                    <div className="flex justify-center mb-4">
                      {ACHIEVEMENT_ICONS[achievement.icon] ?? (
                        <Award className="text-[#76ABAE]" size={24} />
                      )}
                    </div>
                    <h3 className="font-bold text-[#76ABAE] mb-2">{achievement.title}</h3>
                    <p className="text-sm text-gray-400">{achievement.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Skills Section */}
        <AnimatedSection className="py-20 px-6 md:px-10" delay={0.4}>
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-12 md:mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Code className="text-[#76ABAE]" size={32} />
                <h2 className="text-3xl font-bold gradient-text">Technical Expertise</h2>
              </div>
              <p className="text-gray-400">A connected view of the tools I use to build, learn, and ship.</p>
            </motion.div>

            <SkillTreeImage />
          </div>
        </AnimatedSection>

        {/* Timeline Section */}
        {timeline.length > 0 && (
          <AnimatedSection className="py-20 px-10" delay={0.6}>
            <div className="max-w-4xl mx-auto">
              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <GraduationCap className="text-[#76ABAE]" size={32} />
                  <h2 className="text-3xl font-bold gradient-text">Professional Journey</h2>
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
        )}

        {/* AI Focus Section */}
        <AnimatedSection className="py-20 px-10" delay={0.8}>
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Brain className="text-[#76ABAE]" size={32} />
                <h2 className="text-3xl font-bold gradient-text">Specializations & Interests</h2>
              </div>
              <p className="text-gray-400">Areas of expertise and research focus</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                className="glass-card p-8 rounded-lg"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h3 className="text-xl font-bold gradient-text mb-6">
                  Artificial Intelligence & Machine Learning
                </h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Passionate about developing intelligent systems that solve real-world problems. My expertise includes
                  deep learning, neural networks, natural language processing, and computer vision applications.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#76ABAE] rounded-full"></div>
                    <span className="text-sm text-gray-400">Deep Learning & Neural Networks</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#76ABAE] rounded-full"></div>
                    <span className="text-sm text-gray-400">Natural Language Processing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#76ABAE] rounded-full"></div>
                    <span className="text-sm text-gray-400">Computer Vision & Image Processing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#76ABAE] rounded-full"></div>
                    <span className="text-sm text-gray-400">Predictive Analytics & Data Science</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="glass-card p-8 rounded-lg"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <h3 className="text-xl font-bold gradient-text mb-6">Full-Stack Development</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Building modern, scalable web applications with focus on user experience and performance. Experienced in both
                  frontend and backend technologies with cloud deployment expertise.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#76ABAE] rounded-full"></div>
                    <span className="text-sm text-gray-400">React, Next.js & Modern Frontend</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#76ABAE] rounded-full"></div>
                    <span className="text-sm text-gray-400">Python, Django & Flask Backends</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#76ABAE] rounded-full"></div>
                    <span className="text-sm text-gray-400">Database Design & Management</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#76ABAE] rounded-full"></div>
                    <span className="text-sm text-gray-400">Cloud Deployment & DevOps</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </PageTransition>
  );
}
