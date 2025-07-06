'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface TimelineItemProps {
  title: string;
  subtitle: string;
  period: string;
  description: string;
  delay?: number;
}

export default function TimelineItem({ title, subtitle, period, description, delay = 0 }: TimelineItemProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <motion.div
      ref={ref}
      className="timeline-item mb-8 glass-card p-6 rounded-lg"
      initial={{ opacity: 0, x: -50 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
    >
      <div className="timeline-dot" />
      <div className="mb-2">
        <h3 className="text-xl font-bold gradient-text">{title}</h3>
        <h4 className="text-lg text-[#76ABAE]">{subtitle}</h4>
        <span className="text-sm text-gray-400">{period}</span>
      </div>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </motion.div>
  );
}