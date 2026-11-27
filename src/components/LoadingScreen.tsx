import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight } from "lucide-react";
import CyberAvatarSvg from "./CyberAvatarSvg";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [sequence, setSequence] = useState<"scan" | "name" | "titles" | "exit">("scan");
  const [active, setActive] = useState(true);
  const [morphIndex, setMorphIndex] = useState(0);
  const [scanProgress, setScanProgress] = useState(15);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Avatar source resolution
  const [avatarSrc, setAvatarSrc] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aashish_avatar_custom");
      if (saved) return saved;
    }
    return "/Cyberpunk Developer Profile HUD.png";
  });

  const [useSvgFallback, setUseSvgFallback] = useState(false);

  // Rotating roles
  const titles = [
    "Full-Stack Developer",
    "React & Node Builder",
    "3rd-Year IT Student",
    "Competitive Programmer"
  ];

  // Scan progress counter
  useEffect(() => {
    if (sequence !== "scan") return;
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 35;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [sequence]);

  // Stage sequence timing (snappy ~1.5s duration)
  useEffect(() => {
    const scanTimer = setTimeout(() => {
      setSequence("name");
    }, 700);

    const nameTimer = setTimeout(() => {
      setSequence("titles");
    }, 1300);

    const exitTimer = setTimeout(() => {
      setSequence("exit");
      setTimeout(() => {
        setActive(false);
        onComplete();
      }, 300);
    }, 2200);

    return () => {
      clearTimeout(scanTimer);
      clearTimeout(nameTimer);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  // Morphing titles cycle
  useEffect(() => {
    if (sequence !== "titles") return;

    const interval = setInterval(() => {
      setMorphIndex((prev) => {
        if (prev < titles.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setSequence("exit");
            setTimeout(() => {
              setActive(false);
            }, 600);
          }, 1000);
          return prev;
        }
      });
    }, 1600);

    return () => clearInterval(interval);
  }, [sequence]);

  // Instant skip
  const handleSkip = () => {
    setSequence("exit");
    setTimeout(() => {
      setActive(false);
      onComplete();
    }, 250);
  };

  // Subtle animated particle background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    class Particle {
      x = Math.random() * width;
      y = Math.random() * height;
      vx = (Math.random() - 0.5) * 0.3;
      vy = (Math.random() - 0.5) * 0.3;
      radius = Math.random() * 1.5 + 0.5;
      color = Math.random() > 0.5 ? "249, 115, 22" : "0, 240, 255";
      alpha = Math.random() * 0.4 + 0.1;

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw(c: CanvasRenderingContext2D) {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        c.fill();
      }
    }

    const particles = Array.from({ length: 35 }, () => new Particle());

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.fillStyle = "rgba(4, 6, 12, 0.25)";
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const nameLetters = "Aashish Bhumarkar".split("");

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {active && (
        <motion.div
          id="cinematic-loader"
          className="fixed inset-0 bg-[#04060c] z-[9999] flex flex-col items-center justify-center overflow-hidden select-none"
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: "blur(10px)",
            transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] }
          }}
        >
          {/* Ambient Particles Canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

          {/* Top Control Bar: Skip Button */}
          <div className="absolute top-5 right-5 z-30">
            <button
              type="button"
              onClick={handleSkip}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 hover:border-orange-500/40 text-zinc-400 hover:text-white font-mono text-[11px] tracking-wider flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-md"
            >
              SKIP INTRO <ChevronRight className="w-3.5 h-3.5 text-orange-400" />
            </button>
          </div>

          {/* ======================================================== */}
          {/* PERFECTLY CENTERED HUD STAGE                             */}
          {/* ======================================================== */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-lg px-4 text-center my-auto">
            
            {/* Master Cyberpunk HUD Artwork Frame - Precision Centered */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 aspect-square rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-orange-500/40 bg-[#060913] shadow-[0_0_60px_rgba(249,115,22,0.25)] flex items-center justify-center p-1.5 transition-all"
            >
              {/* Outer Precision Corner Brackets */}
              <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-orange-500 z-20 pointer-events-none" />
              <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-cyan-400 z-20 pointer-events-none" />
              <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-orange-500 z-20 pointer-events-none" />
              <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-cyan-400 z-20 pointer-events-none" />

              {/* Glowing Inner Border Ring */}
              <div className="absolute inset-2 rounded-xl sm:rounded-2xl border border-cyan-400/30 pointer-events-none z-20" />

              {/* Subtle Laser Scan Beam */}
              <motion.div
                animate={{ y: ["-100%", "200%"] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-x-0 h-8 bg-gradient-to-b from-transparent via-cyan-400/25 to-transparent pointer-events-none z-20"
              />

              {/* Display Image (Flawlessly aligned, centered, no distortion) */}
              <div className="w-full h-full rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center bg-black/60 relative">
                {useSvgFallback ? (
                  <CyberAvatarSvg className="w-full h-full object-contain p-2" />
                ) : (
                  <img
                    src={avatarSrc}
                    alt="Aashish Bhumarkar Cyberpunk HUD Profile"
                    onError={() => {
                      if (avatarSrc !== "/profile_avatar.png") {
                        setAvatarSrc("/profile_avatar.png");
                      } else {
                        setUseSvgFallback(true);
                      }
                    }}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transition-transform duration-500"
                  />
                )}
              </div>
            </motion.div>

            {/* Stable Sub-Frame: Telemetry & Stage Text (Fixed Height to prevent jumping) */}
            <div className="w-full h-28 sm:h-32 mt-5 flex flex-col items-center justify-center">
              
              {/* STAGE 1: Scan Telemetry */}
              {sequence === "scan" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex flex-col items-center space-y-2 w-full max-w-xs"
                >
                  <div className="flex items-center justify-between w-full text-[10px] font-mono text-zinc-400">
                    <span className="text-orange-400 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                      CYBERPUNK NEURAL HUD
                    </span>
                    <span className="text-cyan-400 font-bold">{Math.min(scanProgress, 100)}%</span>
                  </div>

                  {/* High tech progress bar */}
                  <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden border border-white/10">
                    <motion.div
                      className="h-full bg-gradient-to-r from-orange-500 to-cyan-400"
                      style={{ width: `${Math.min(scanProgress, 100)}%` }}
                    />
                  </div>

                  <p className="text-[9px] font-mono text-zinc-500 tracking-widest uppercase">
                    CHAKRA MATRIX INITIALIZED // BHOPAL [MP]
                  </p>
                </motion.div>
              )}

              {/* STAGE 2: Kinetic Name Reveal */}
              {sequence === "name" && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col items-center justify-center space-y-1.5"
                >
                  <div className="flex flex-wrap justify-center items-center">
                    {nameLetters.map((char, index) => (
                      <motion.span
                        key={index}
                        className="text-2xl sm:text-4xl md:text-5xl font-space font-black tracking-tight select-none block"
                        style={{
                          marginRight: char === " " ? "0.5rem" : "0.01rem",
                          color: index === 0 || index === 8 ? "#ff7b00" : "#ffffff",
                          textShadow:
                            index === 0 || index === 8
                              ? "0 0 25px rgba(255,123,0,0.8)"
                              : "0 0 15px rgba(255,255,255,0.2)"
                        }}
                        variants={{
                          hidden: { opacity: 0, y: 12, scale: 0.95 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            transition: {
                              type: "spring",
                              stiffness: 110,
                              damping: 14,
                              delay: index * 0.03
                            }
                          },
                          exit: { opacity: 0, y: -12, transition: { duration: 0.25 } }
                        }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </div>
                  <p className="font-mono text-[10px] sm:text-xs text-orange-400/90 tracking-[0.25em] uppercase font-bold">
                    Full-Stack Software Engineer & AI Systems Developer
                  </p>
                </motion.div>
              )}

              {/* STAGE 3: Morphing Titles */}
              {sequence === "titles" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center space-y-2.5"
                >
                  <div className="font-mono text-[9px] tracking-[0.35em] uppercase text-zinc-500">
                    PORTFOLIO DIRECTORY
                  </div>
                  <div className="h-8 flex items-center justify-center">
                    <motion.span
                      key={morphIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="font-space text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-400 via-amber-200 to-cyan-300 bg-clip-text text-transparent"
                    >
                      {titles[morphIndex]}
                    </motion.span>
                  </div>
                  <div className="flex gap-1.5 pt-1">
                    {titles.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          idx === morphIndex ? "w-5 bg-orange-500" : "w-1.5 bg-zinc-800"
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STAGE 4: Exit */}
              {sequence === "exit" && (
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  className="font-mono text-xs text-orange-400 tracking-widest uppercase animate-pulse"
                >
                  PORTAL SECURED — ENTERING COCKPIT
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
