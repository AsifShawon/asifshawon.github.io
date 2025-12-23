"use client";

import React from 'react';
import PageTransition from '@/app/components/PageTransition';
import AnimatedSection from '@/app/components/AnimatedSection';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

export default function ChatbotPage() {
  return (
    <PageTransition>
      <div className="min-h-screen p-8 bg-background">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <MessageSquare className="text-emerald-400" size={56} />
                <h1 className="text-4xl font-bold gradient-text">AI Chatbot</h1>
              </div>
              <p className="text-gray-300 max-w-2xl mx-auto">An experimental conversational assistant demonstrating RAG-powered retrieval and simple chat UI. Click a project to explore live demos.</p>
            </motion.div>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-start gap-4">
                <MessageSquare className="w-8 h-8 text-emerald-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Try the demo</h3>
                  <p className="text-sm text-gray-400">This page contains a simple demo placeholder. The full chatbot integrates a conversational UI, system prompts, and external knowledge sources.</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </PageTransition>
  );
}
