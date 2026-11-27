import React, { useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring, useMotionTemplate } from "motion/react";

interface CardRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export default function CardReveal({ children, delay = 0, className = "" }: CardRevealProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values to track cursor position normalized relative to the card's dimensions (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Dynamic 3D rotation transformations linked to mapped coordinates with physical spring damping
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 120, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 20 });

  // Precise cursor tracking inside card for inner-glow coordinates (px)
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);

  // Glow intensity state (fade in/out smoothly)
  const glowOpacity = useSpring(0, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Pixel offset from top-left corner
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Normalizing coords with center as (0, 0)
    const normX = (mouseX / width) - 0.5;
    const normY = (mouseY / height) - 0.5;

    x.set(normX);
    y.set(normY);

    // Update glow coordinate values
    glowX.set(mouseX);
    glowY.set(mouseY);
    glowOpacity.set(1);
  };

  const handleMouseLeave = () => {
    // Return smoothly back to rest position
    x.set(0);
    y.set(0);
    glowOpacity.set(0);
  };

  // String interpolation for modern radial gradient
  const glowBackground = useMotionTemplate`radial-gradient(280px circle at ${glowX}px ${glowY}px, rgba(249, 115, 22, 0.12), rgba(139, 92, 246, 0.04) 50%, transparent 100%)`;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 45, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        type: "spring",
        stiffness: 90,
        damping: 15,
        mass: 1.3, // Slightly higher mass for physical "anticipation" weight
        delay: delay,
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
        rotateX,
        rotateY,
      }}
      className={`relative group overflow-hidden ${className}`}
    >
      {/* Interactive inner-glow cursor tracker */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          opacity: glowOpacity,
          background: glowBackground,
        }}
      />

      {/* Embedded highlight border reflection */}
      <div className="absolute inset-0 rounded-3xl border border-white/5 group-hover:border-orange-500/20 transition-colors duration-500 pointer-events-none z-10" />

      {/* Children content offset to produce 3D depth separation */}
      <div style={{ transform: "translateZ(15px)" }} className="relative z-20 h-full w-full">
        {children}
      </div>
    </motion.div>
  );
}

