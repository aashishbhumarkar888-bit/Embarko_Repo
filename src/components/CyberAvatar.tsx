import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ZoomIn, ShieldCheck, ExternalLink, Github, Linkedin, Mail, FolderCheck } from "lucide-react";
import { PROFILE_INFO } from "../data";
import CyberAvatarSvg from "./CyberAvatarSvg";

export interface CyberAvatarProps {
  size?: "sm" | "md" | "lg" | "xl" | "showcase";
  variant?: "circle" | "hud";
  className?: string;
  showStatusIndicator?: boolean;
  interactive?: boolean;
  altText?: string;
}

export const CyberAvatar: React.FC<CyberAvatarProps> = ({
  size = "md",
  variant = "circle",
  className = "",
  showStatusIndicator = true,
  interactive = false,
  altText = "Aashish Bhumarkar Profile",
}) => {
  const [imgSrc, setImgSrc] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aashish_avatar_custom");
      if (saved) return saved;
    }
    return "/Cyberpunk Developer Profile HUD.png";
  });

  const [useSvgComponent, setUseSvgComponent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync with local storage
  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem("aashish_avatar_custom");
      if (saved) {
        setImgSrc(saved);
        setUseSvgComponent(false);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleImageError = () => {
    if (imgSrc !== "/profile_avatar.png") {
      setImgSrc("/profile_avatar.png");
    } else {
      setUseSvgComponent(true);
    }
  };

  // Dimensions based on size for circular variant
  const circleSizeClasses = {
    sm: "w-9 h-9 sm:w-10 sm:h-10",
    md: "w-16 h-16 sm:w-20 sm:h-20",
    lg: "w-24 h-24 sm:w-28 sm:h-28",
    xl: "w-36 h-36 sm:w-44 sm:h-44",
    showcase: "w-64 h-64 sm:w-80 sm:h-80 aspect-square",
  };

  // Dimensions based on size for HUD frame variant (clean aspect preservation)
  const hudSizeClasses = {
    sm: "w-16 h-16",
    md: "w-32 h-32",
    lg: "w-48 h-48",
    xl: "w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 aspect-square",
    showcase: "w-full max-w-[360px] aspect-square",
  };

  const mailSubject = "Inquiry regarding Full-Stack / AI Roles";
  const mailBody = "Hi Aashish, I saw your developer portfolio and wanted to connect regarding engineering opportunities.";
  const mailtoUrl = `mailto:${PROFILE_INFO.email}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

  return (
    <>
      {variant === "circle" ? (
        /* ======================================================== */
        /* VARIANT 1: Circular Quantum HUD Emblem                  */
        /* ======================================================== */
        <div
          className={`relative group inline-block select-none ${interactive ? "cursor-pointer" : ""} ${className}`}
          onClick={() => {
            if (interactive) setIsModalOpen(true);
          }}
          title={interactive ? "Click to inspect developer profile artwork" : undefined}
        >
          {/* Outer Pulsing Ambient Chakra Glow */}
          <div className="absolute -inset-1.5 bg-gradient-to-tr from-orange-500/40 via-amber-500/20 to-cyan-500/40 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-all duration-500 animate-pulse pointer-events-none" />

          {/* Rotating Outer Orange Chakra HUD Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-2 rounded-full border border-dashed border-orange-500/50 pointer-events-none"
          />

          {/* Counter-rotating Inner Cyan Quantum Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-1 rounded-full border border-dotted border-cyan-400/50 pointer-events-none"
          />

          {/* Main Avatar Container — Preserves image framing without cutting off */}
          <div
            className={`relative rounded-full overflow-hidden border-2 border-orange-500/70 shadow-2xl bg-zinc-950 flex items-center justify-center ${circleSizeClasses[size]}`}
          >
            {/* Subtle scanning laser overlay */}
            <motion.div
              animate={{ y: ["-120%", "220%"] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-x-0 h-8 bg-gradient-to-b from-transparent via-cyan-400/25 to-transparent pointer-events-none z-10"
            />

            {/* Actual Avatar Display — Clean framing, no aggressive scale crop */}
            {useSvgComponent ? (
              <CyberAvatarSvg cropToCircle={true} className="w-full h-full object-cover" />
            ) : (
              <img
                src={imgSrc}
                alt={altText}
                onError={handleImageError}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-[center_20%] transition-opacity duration-300"
              />
            )}

            {/* Hover Overlay with Zoom Icon */}
            {interactive && (
              <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                <ZoomIn className="w-5 h-5 text-white drop-shadow-md" />
              </div>
            )}
          </div>

          {/* Live Active System Indicator Pill */}
          {showStatusIndicator && (
            <div className="absolute bottom-0 right-0 z-20 flex items-center justify-center">
              <span className="relative flex h-3.5 w-3.5 sm:h-4 sm:w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 bg-emerald-500 border-2 border-zinc-950 shadow-md shadow-emerald-500/50" />
              </span>
            </div>
          )}
        </div>
      ) : (
        /* ======================================================== */
        /* VARIANT 2: Full-Frame Cyberpunk Hologram Stage (HUD)    */
        /* Engineered so the image is NEVER cropped when zoomed     */
        /* ======================================================== */
        <div
          className={`relative group inline-block select-none ${interactive ? "cursor-pointer" : ""} ${className}`}
          onClick={() => {
            if (interactive) setIsModalOpen(true);
          }}
          title={interactive ? "Click to view full uncropped HUD profile" : undefined}
        >
          {/* Ambient Outer Halo */}
          <div className="absolute -inset-2 bg-gradient-to-tr from-orange-500/25 via-amber-500/15 to-cyan-500/25 rounded-3xl blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none" />

          {/* Hologram Display Box */}
          <div
            className={`relative rounded-2xl sm:rounded-3xl border-2 border-orange-500/40 bg-[#060913] shadow-[0_0_40px_rgba(249,115,22,0.2)] overflow-hidden flex items-center justify-center p-1.5 transition-all duration-300 group-hover:border-orange-500/70 ${hudSizeClasses[size]}`}
          >
            {/* Outer Precision Corner Brackets */}
            <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-orange-500 z-20 pointer-events-none" />
            <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-cyan-400 z-20 pointer-events-none" />
            <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-orange-500 z-20 pointer-events-none" />
            <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-cyan-400 z-20 pointer-events-none" />

            {/* Glowing Inner Border Ring */}
            <div className="absolute inset-2 rounded-xl sm:rounded-2xl border border-cyan-400/25 pointer-events-none z-20" />

            {/* Subtle Laser Scan Beam */}
            <motion.div
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-x-0 h-8 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent pointer-events-none z-20"
            />

            {/* Image Canvas — Perfectly Uncropped (never cut off when zoomed or viewed) */}
            <div className="w-full h-full rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center bg-zinc-950 relative p-1">
              {useSvgComponent ? (
                <CyberAvatarSvg cropToCircle={false} className="w-full h-full object-contain p-1" />
              ) : (
                <img
                  src={imgSrc}
                  alt={altText}
                  onError={handleImageError}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain object-center transition-all duration-300"
                />
              )}

              {/* Hover Zoom Prompt */}
              {interactive && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-1 z-20 text-white">
                  <ZoomIn className="w-6 h-6 text-orange-400" />
                  <span className="font-space text-xs font-bold tracking-wider uppercase">Inspect Profile</span>
                </div>
              )}
            </div>

            {/* Live Status Indicator */}
            {showStatusIndicator && (
              <div className="absolute bottom-3 right-3 z-30">
                <span className="px-2 py-0.5 rounded-full bg-black/80 border border-emerald-500/40 text-emerald-400 font-mono text-[9px] uppercase font-bold flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* Lightbox / High-Definition Avatar Modal (Zero Upload UI)  */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-xl"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="relative w-full max-w-xl bg-zinc-950/95 border border-orange-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-orange-500/10 overflow-hidden z-10 text-left"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer border border-white/10 z-30"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header Badge */}
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-mono font-bold tracking-wider uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  AUTHENTICATED DEVELOPER IDENTITY
                </span>
                <span className="text-[10px] font-mono text-zinc-500">Bhopal, MP • India</span>
              </div>

              {/* Full-Frame Uncropped Master Artwork Display */}
              <div className="relative flex justify-center py-2">
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 aspect-square rounded-2xl overflow-hidden border border-orange-500/40 bg-zinc-950 shadow-[0_0_40px_rgba(249,115,22,0.25)] flex items-center justify-center p-1.5">
                  {/* Outer Precision Corner Brackets */}
                  <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-orange-500 z-20 pointer-events-none" />
                  <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan-400 z-20 pointer-events-none" />
                  <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-orange-500 z-20 pointer-events-none" />
                  <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-cyan-400 z-20 pointer-events-none" />

                  {/* Inner Glowing Border */}
                  <div className="absolute inset-2 rounded-xl border border-cyan-400/25 pointer-events-none z-20" />

                  {useSvgComponent ? (
                    <CyberAvatarSvg cropToCircle={false} className="w-full h-full object-contain" />
                  ) : (
                    <img
                      src={imgSrc}
                      alt="Aashish Bhumarkar Full HUD Artwork"
                      onError={handleImageError}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain object-center rounded-xl"
                    />
                  )}

                  {/* Laser Scanner animation */}
                  <motion.div
                    animate={{ y: ["-105%", "205%"] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-x-0 h-8 bg-gradient-to-b from-transparent via-cyan-400/25 to-transparent pointer-events-none z-10"
                  />
                </div>
              </div>

              {/* Identity Details */}
              <div className="text-center mt-3 space-y-1">
                <h3 className="text-xl font-space font-black text-white flex items-center justify-center gap-2">
                  {PROFILE_INFO.name}
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold">
                    ONLINE
                  </span>
                </h3>
                <p className="text-xs text-orange-400 font-mono tracking-wider font-semibold">
                  Full-Stack Developer
                </p>
                <p className="text-[11px] text-zinc-400 font-jakarta">
                  B.Tech IT (2024–2028) • Bansal Institute of Science and Technology
                </p>
              </div>

              {/* Developer Action Links (Replaced all photo upload controls) */}
              <div className="mt-5 pt-4 border-t border-white/10 space-y-2.5">
                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href={PROFILE_INFO.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-white/10 font-mono text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                    <span>LinkedIn Profile</span>
                    <ExternalLink className="w-3 h-3 text-zinc-500" />
                  </a>

                  <a
                    href={PROFILE_INFO.github}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-white/10 font-mono text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Github className="w-3.5 h-3.5 text-zinc-300" />
                    <span>GitHub Code</span>
                    <ExternalLink className="w-3 h-3 text-zinc-500" />
                  </a>
                </div>

                <div className="flex items-center gap-2.5">
                  <a
                    href={PROFILE_INFO.certificateVaultUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 px-3 rounded-xl bg-orange-950/30 hover:bg-orange-900/50 border border-orange-500/40 text-orange-300 hover:text-white font-mono text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <FolderCheck className="w-3.5 h-3.5 text-orange-400" />
                    <span>Google Drive Certificate Vault</span>
                    <ExternalLink className="w-3 h-3 text-orange-400" />
                  </a>

                  <a
                    href={mailtoUrl}
                    className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-zinc-950 font-space font-bold text-xs flex items-center justify-center gap-1.5 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-zinc-950" />
                    <span>Hire Me</span>
                  </a>
                </div>
              </div>

              {/* Status Footer */}
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>Verified System Node // Bhopal [MP]</span>
                <span className="text-emerald-400">Available for Summer / Full-Time SWE Roles</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CyberAvatar;
