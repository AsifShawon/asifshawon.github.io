'use client';
import React from 'react';
import { motion } from 'framer-motion';
import TypingEffect from '../comps/textTyping';
import Menu from '../comps/menu';
import ScrollIndicator from './ScrollIndicator';

export default function EnhancedHome() {
  return (
    <motion.div 
      className='p-5 relative z-10'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.h1 
          className='text-[40px] font-medium gradient-text'
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Asif Bhuiyan Shawon
        </motion.h1>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <TypingEffect />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <Menu />
      </motion.div>
      
      <ScrollIndicator />
    </motion.div>
  );
}