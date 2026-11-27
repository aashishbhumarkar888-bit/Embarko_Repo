import React from "react";
import { motion } from "motion/react";

interface ChapterDividerProps {
  chapter: string;
  title: string;
  subtitle?: string;
  rune: string;
  accent?: string;
  isHighlighted?: boolean;
  align?: "center" | "left";
}

export default function ChapterDivider({
  chapter,
  title,
  subtitle,
  rune,
  accent = "#98F5E1",
  isHighlighted = false,
  align = "center",
}: ChapterDividerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={`mb-10 sm:mb-12 ${align === "center" ? "text-center" : "text-left"}`}
    >
      {/* Animated Horizontal Hairline Rule + Central Glowing Pastel Rune */}
      <div className="flex items-center justify-center gap-4 mb-5">
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="h-px flex-1 origin-right"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${accent}66 75%, ${accent}CC 100%)`,
          }}
        />

        <div
          className="relative w-10 h-10 flex items-center justify-center shrink-0 transition-transform duration-500"
          style={{
            transform: isHighlighted ? "scale(1.14)" : "scale(1)",
          }}
          aria-hidden="true"
        >
          {/* Etched diamond frame */}
          <span
            className="absolute inset-1 rotate-45 rounded-[3px] border bg-[#0C1020] transition-shadow duration-500"
            style={{
              borderColor: isHighlighted ? accent : `${accent}88`,
              boxShadow: isHighlighted
                ? `0 0 24px ${accent}99, inset 0 0 12px ${accent}44`
                : `0 0 14px ${accent}44`,
            }}
          />
          <span
            className="relative font-serif text-base font-bold leading-none select-none"
            style={{
              color: accent,
              textShadow: `0 0 10px ${accent}99`,
            }}
          >
            {rune}
          </span>
        </div>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="h-px flex-1 origin-left"
          style={{
            background: `linear-gradient(270deg, transparent 0%, ${accent}66 75%, ${accent}CC 100%)`,
          }}
        />
      </div>

      {/* Cinzel Chapter Header */}
      <div className={align === "center" ? "max-w-2xl mx-auto space-y-2" : "max-w-2xl space-y-2"}>
        <p
          className="font-mythic text-[11px] sm:text-xs font-semibold tracking-[0.22em]"
          style={{ color: accent }}
        >
          {chapter} <span className="mx-1.5 opacity-50">◆</span> {title}
        </p>
        {subtitle && (
          <p className="text-sm sm:text-[15px] text-[#A6B0CF] leading-relaxed text-balance">
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
}
