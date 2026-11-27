import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number; // percentage of pulling (defaults to 0.3 or 30%)
}

export default function MagneticButton({ children, className = "", intensity = 0.3 }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Initialize motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Elite spring configurations matching Anime.js snappy elastic timings
  const springConfig = { stiffness: 150, damping: 15, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    const motionCheck = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(motionCheck);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reducedMotion || !ref.current) return;

    const { clientX, clientY } = e;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate displacement vectors
    const dx = clientX - centerX;
    const dy = clientY - centerY;

    // Pull toward the cursor by a proportion (e.g. 30%)
    x.set(dx * intensity);
    y.set(dy * intensity);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block ${className}`}
    >
      <motion.div
        style={{
          x: springX,
          y: springY,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
