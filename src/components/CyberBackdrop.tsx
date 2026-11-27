import React from "react";

interface CyberBackdropProps {
  auraColor?: string;
}

export default function CyberBackdrop({ auraColor = "#A5E8FF" }: CyberBackdropProps) {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#06080E]"
    >
      {/* Subtle Volumetric Nordic Twilight Fog Gradients */}
      <div
        className="absolute -top-48 left-[-10%] w-[640px] h-[520px] rounded-full blur-[160px] opacity-[0.075] transition-colors duration-700"
        style={{
          background: `radial-gradient(circle, ${auraColor} 0%, transparent 72%)`,
        }}
      />
      <div
        className="absolute top-[28%] right-[-14%] w-[620px] h-[560px] rounded-full blur-[170px] opacity-[0.065]"
        style={{
          background: "radial-gradient(circle, #C7B8FF 0%, transparent 72%)",
        }}
      />
      <div
        className="absolute bottom-[-180px] left-[22%] w-[680px] h-[460px] rounded-full blur-[170px] opacity-[0.055]"
        style={{
          background: "radial-gradient(circle, #E6C999 0%, transparent 74%)",
        }}
      />

      {/* Fine Obsidian Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 20%, transparent 0%, rgba(6,8,14,0.42) 72%, rgba(4,6,11,0.88) 100%)",
        }}
      />
    </div>
  );
}
