import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

interface StaggeredTextProps {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
}

export default function StaggeredText({ text, className = "", delay = 0, once = true }: StaggeredTextProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const motionCheck = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(motionCheck);
  }, []);

  const words = text.split(" ");

  // Container variants with stagger configuration
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: 0.08,
      },
    },
  };

  // Word slide-up mask reveal variants using a smooth cubic-bezier curve
  const wordVariants = {
    hidden: { 
      y: "110%", 
      opacity: 0 
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // Custom elite Anime.js easing
      },
    },
  };

  if (reducedMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span
      className={`inline-flex flex-wrap ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-50px" }}
    >
      {words.map((word, index) => (
        <span key={index} className="overflow-hidden inline-block mr-[0.2em] py-1 max-w-full leading-normal">
          <motion.span
            variants={wordVariants}
            className="inline-block break-words"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
