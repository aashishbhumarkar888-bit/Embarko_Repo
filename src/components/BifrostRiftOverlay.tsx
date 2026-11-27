import React from "react";
import { motion, AnimatePresence } from "motion/react";

interface BifrostRiftOverlayProps {
  active: boolean;
  origin: { x: number; y: number };
}

/**
 * 1.4-second AAA "Shatter into the Realm" full-screen cinematic transition.
 * - Blinding frost-gold Bifröst rift expands radially from the exact button coordinates
 * - Brief tectonic viewport shake
 * - Dark obsidian cinema letterbox bars (2.39:1 framing) slide cleanly into top and bottom
 */
export default function BifrostRiftOverlay({
  active,
  origin,
}: BifrostRiftOverlayProps) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="bifrost-rift"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          aria-hidden="true"
          className="fixed inset-0 z-[80] pointer-events-none overflow-hidden animate-rift-shake"
        >
          {/* Radial Blinding Frost-Gold Bifröst Rift Expanding From CTA Coordinates */}
          <motion.div
            initial={{ scale: 0.04, opacity: 0.9 }}
            animate={{
              scale: [0.04, 1.35, 3.2],
              opacity: [0.95, 1, 0],
            }}
            transition={{
              duration: 1.35,
              times: [0, 0.52, 1],
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              left: origin.x,
              top: origin.y,
              width: "120vmax",
              height: "120vmax",
              marginLeft: "-60vmax",
              marginTop: "-60vmax",
              background:
                "radial-gradient(circle, #FFFFFF 0%, #E6C999 18%, #A5E8FF 42%, rgba(165,232,255,0.22) 66%, transparent 82%)",
            }}
            className="absolute rounded-full"
          />

          {/* Crisp Expanding Frost-Gold Shockwave Ring */}
          <motion.div
            initial={{ scale: 0.08, opacity: 1 }}
            animate={{ scale: 2.8, opacity: 0 }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
            style={{
              left: origin.x,
              top: origin.y,
              width: "90vmax",
              height: "90vmax",
              marginLeft: "-45vmax",
              marginTop: "-45vmax",
              border: "3px solid rgba(245, 232, 200, 0.95)",
              boxShadow:
                "0 0 60px rgba(165, 232, 255, 0.9), inset 0 0 40px rgba(230, 201, 153, 0.85)",
            }}
            className="absolute rounded-full"
          />

          {/* Peak White-Frost Exposure Flash Before Story Mode Reveals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.92, 0] }}
            transition={{ duration: 1.38, times: [0, 0.5, 1], ease: "easeInOut" }}
            className="absolute inset-0 bg-[#EEF8FF]"
          />

          {/* 2.39:1 Dark Obsidian Cinema Letterbox Bars Sliding Smoothly In */}
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.72, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 inset-x-0 h-14 sm:h-16 bg-[#05070D] border-b border-white/[0.08]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.72, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-0 inset-x-0 h-12 sm:h-14 bg-[#05070D] border-t border-white/[0.08]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
