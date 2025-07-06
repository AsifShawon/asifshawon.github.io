'use client';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function ScrollIndicator() {
  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <motion.div
      className="scroll-indicator cursor-pointer"
      onClick={scrollToNext}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 1 }}
    >
      <motion.div
        className="flex flex-col items-center text-[#76ABAE]"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-sm mb-2">Scroll to explore</span>
        <ChevronDown size={24} />
      </motion.div>
    </motion.div>
  );
}