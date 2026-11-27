import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function CustomCursor() {
  const [hidden, setHidden] = useState(true);
  const [cursorText, setCursorText] = useState("");
  const [isMagnetic, setIsMagnetic] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Highly responsive spring configuration for an elastic, fluid spring effect
  const springConfig = { stiffness: 220, damping: 25, mass: 0.35 };
  const ringX = useSpring(cursorX, springConfig);
  const ringY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Detect mobile touch devices or reduced motion accessibility preference
    const touchCheck = window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
    const motionCheck = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setIsTouchDevice(touchCheck);
    setReducedMotion(motionCheck);

    if (touchCheck || motionCheck) return;

    // Preserve default system cursor
    document.body.style.cursor = "auto";
    setHidden(false);

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseLeave = () => setHidden(true);
    const handleMouseEnter = () => setHidden(false);

    const handleMouseOver = (e: MouseEvent) => {
      let target = e.target as HTMLElement | null;
      if (!target) return;

      // Find if any parent has cursor custom meta
      const hasCursorText = target.closest("[data-cursor-text]") as HTMLElement | null;
      const isButton = target.closest("button") || target.closest("a") || target.tagName === "BUTTON" || target.tagName === "A" || target.getAttribute("role") === "button" || target.classList.contains("cursor-pointer");

      if (hasCursorText) {
        setCursorText(hasCursorText.getAttribute("data-cursor-text") || "");
        setIsHovering(true);
      } else if (isButton) {
        setCursorText("");
        setIsHovering(true);
        setIsMagnetic(true);
      } else {
        setCursorText("");
        setIsHovering(false);
        setIsMagnetic(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
      document.body.style.cursor = "auto";
    };
  }, [cursorX, cursorY]);

  if (isTouchDevice || reducedMotion || hidden) return null;

  return (
    <>
      {/* Spotlight Ambient Follower: Emits a soft orange/purple glow behind the cursor */}
      <motion.div
        className="fixed top-0 left-0 w-64 h-64 rounded-full pointer-events-none z-[9998] mix-blend-screen opacity-20 blur-3xl"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, rgba(249, 115, 22, 0.4) 0%, rgba(99, 102, 241, 0.1) 50%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* Lagging Outer Ring / Interactive Badge */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] flex items-center justify-center font-mono font-black text-[9px] uppercase tracking-wider text-white"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: cursorText ? 64 : isHovering ? 48 : 20,
          height: cursorText ? 64 : isHovering ? 48 : 20,
          backgroundColor: cursorText 
            ? "rgba(249, 115, 22, 0.95)" // soft premium orange badge
            : isHovering 
              ? "rgba(255, 255, 255, 0.1)" 
              : "rgba(255, 255, 255, 0)",
          border: cursorText 
            ? "1px solid rgba(249, 115, 22, 1)" 
            : isHovering 
              ? "1px solid rgba(249, 115, 22, 0.8)" 
              : "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: cursorText 
            ? "0 0 15px rgba(249, 115, 22, 0.4)" 
            : isHovering 
              ? "0 0 10px rgba(249, 115, 22, 0.2)" 
              : "none",
        }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
      >
        {cursorText && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="whitespace-nowrap px-1 select-none font-bold text-zinc-950 font-space text-[9px] tracking-widest text-center"
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>

    </>
  );
}
