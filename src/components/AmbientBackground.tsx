import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "motion/react";

interface AmbientBackgroundProps {
  activeSection?: string;
}

export default function AmbientBackground({ activeSection = "hero" }: AmbientBackgroundProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  // Monitor real-time page scroll
  const { scrollY } = useScroll();

  // Dynamic color configuration for each scroll narrative chapter
  const getOrbColors = (section: string) => {
    switch (section) {
      case "hero":
      case "origin":
        return {
          orb1: "from-orange-500/12",
          orb2: "from-amber-600/8",
          gridColor: "rgba(249, 115, 22, 1)"
        };
      case "projects":
        return {
          orb1: "from-purple-500/14",
          orb2: "from-blue-600/10",
          gridColor: "rgba(139, 92, 246, 1)"
        };
      case "credentials":
        return {
          orb1: "from-sky-500/12",
          orb2: "from-slate-600/10",
          gridColor: "rgba(14, 165, 233, 1)"
        };
      case "coding-profiles":
        return {
          orb1: "from-emerald-500/14",
          orb2: "from-yellow-600/10",
          gridColor: "rgba(16, 185, 129, 1)"
        };
      case "mentor":
        return {
          orb1: "from-indigo-500/14",
          orb2: "from-cyan-600/10",
          gridColor: "rgba(99, 102, 241, 1)"
        };
      case "hire-me":
        return {
          orb1: "from-rose-500/14",
          orb2: "from-orange-600/10",
          gridColor: "rgba(244, 63, 94, 1)"
        };
      case "contact":
        return {
          orb1: "from-teal-500/12",
          orb2: "from-blue-600/10",
          gridColor: "rgba(20, 184, 166, 1)"
        };
      default:
        return {
          orb1: "from-indigo-500/10",
          orb2: "from-purple-500/8",
          gridColor: "rgba(99, 102, 241, 1)"
        };
    }
  };

  const colors = getOrbColors(activeSection);

  // Create a scroll-linked opacity that sharpens and fades in the grid lines upon scrolling
  // Maps scroll from 0px (unscrolled) to 200px (first 200px) transitioning from 0 to 0.4 (0% to 40%) for a system-boot feel
  const rawGridOpacity = useTransform(scrollY, [0, 200], [0, 0.4]);
  const gridOpacity = useSpring(rawGridOpacity, { stiffness: 60, damping: 22 });

  // Mouse coordinate tracker motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // High-dampening, low-stiffness springs for ultra-smooth lagging movement (Anime.js character)
  const springConfig = { stiffness: 45, damping: 25, mass: 1.2 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const motionCheck = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(motionCheck);

    if (motionCheck) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized position from -30px to 30px
      const xOffset = ((e.clientX / window.innerWidth) - 0.5) * 60;
      const yOffset = ((e.clientY / window.innerHeight) - 0.5) * 60;
      mouseX.set(xOffset);
      mouseY.set(yOffset);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Grid Overlay with scroll-linked spring-smoothed sharpening/fade-in opacity and dynamic colors */}
      <motion.div 
        className="absolute inset-0 bg-[size:4rem_4rem]" 
        style={{ 
          opacity: gridOpacity,
          backgroundImage: `linear-gradient(to right, ${colors.gridColor} 0.08px, transparent 0.08px), linear-gradient(to bottom, ${colors.gridColor} 0.08px, transparent 0.08px)`
        }}
      />

      {reducedMotion ? (
        <>
          {/* Static Ambient light orbs for reduced motion */}
          <div className="absolute top-[10%] left-[15%] w-[45vw] h-[45vw] rounded-full bg-indigo-500/5 blur-[120px]" />
          <div className="absolute bottom-[15%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/5 blur-[140px]" />
        </>
      ) : (
        <>
          {/* Reactive Primary Orb with Dynamic Color */}
          <motion.div
            className={`absolute top-[5%] left-[10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-br ${colors.orb1} to-transparent blur-[110px] transition-all duration-[1000ms] ease-out`}
            style={{
              x: springX,
              y: springY,
            }}
            animate={{
              scale: [1, 1.08, 0.95, 1],
              opacity: [0.6, 0.8, 0.7, 0.6],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Reactive Secondary Orb with Dynamic Color (Floating in opposite direction) */}
          <motion.div
            className={`absolute bottom-[10%] right-[5%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full bg-gradient-to-tl ${colors.orb2} to-transparent blur-[130px] transition-all duration-[1000ms] ease-out`}
            style={{
              x: useTransform(springX, (val) => -val * 1.2),
              y: useTransform(springY, (val) => -val * 1.2),
            }}
            animate={{
              scale: [1, 0.93, 1.05, 1],
              opacity: [0.5, 0.7, 0.6, 0.5],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </>
      )}
    </div>
  );
}
