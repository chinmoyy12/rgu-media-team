import React from 'react';
import { motion, Variants } from 'motion/react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  staggerChildren?: number;
  id?: string;
}

export const sectionContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (custom: { delay?: number; staggerChildren?: number } = {}) => ({
    opacity: 1,
    transition: {
      staggerChildren: custom.staggerChildren ?? 0.12,
      delayChildren: custom.delay ?? 0.05,
    },
  }),
};

export const fadeInUpItemVariants: Variants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  delay = 0,
  staggerChildren = 0.12,
  id,
}) => {
  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1],
        delay: delay,
        staggerChildren: staggerChildren,
        delayChildren: 0.08,
      },
    },
  };

  return (
    <motion.div
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.08, margin: '-40px' }}
      variants={sectionVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};
