import { useEffect, useRef } from "react";

interface ChakraParticlesProps {
  intensity?: number;
  interactive?: boolean;
}

export default function ChakraParticles({ intensity = 25, interactive = true }: ChakraParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      fadeSpeed: number;
      color: string;
      glow: boolean;
    }

    const particles: Particle[] = [];
    const colors = [
      "rgba(249, 115, 22, ",  // orange
      "rgba(251, 146, 60, ",  // amber
      "rgba(59, 130, 246, ",  // electric blue
      "rgba(14, 165, 233, ",  // cyan
      "rgba(168, 85, 247, ",  // purple for vault
    ];

    const mousePos = { x: -1000, y: -1000, active: false };

    // Set canvas sizes
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = canvas.width = entry.contentRect.width;
        height = canvas.height = entry.contentRect.height;
      }
    });
    resizeObserver.observe(canvas);

    // Mouse movement listeners
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mousePos.x = e.clientX - rect.left;
      mousePos.y = e.clientY - rect.top;
      mousePos.active = true;

      // Spawn cursor particle
      if (Math.random() < 0.6) {
        spawnParticle(mousePos.x, mousePos.y, true);
      }
    };

    const handleMouseLeave = () => {
      mousePos.active = false;
    };

    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseleave", handleMouseLeave);
    }

    // Spawn a particle
    const spawnParticle = (x: number, y: number, isCursor = false) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = isCursor ? Math.random() * 2 + 0.5 : Math.random() * 0.8 + 0.1;
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed + (isCursor ? (Math.random() - 0.5) * 1 : 0),
        vy: Math.sin(angle) * speed - (isCursor ? Math.random() * 1.5 : 0.4), // rise slightly
        size: Math.random() * (isCursor ? 4.5 : 3) + 0.8,
        alpha: Math.random() * 0.7 + 0.4,
        fadeSpeed: Math.random() * 0.01 + 0.005,
        color: randomColor,
        glow: Math.random() > 0.4,
      });
    };

    // Draw background particles periodically
    const drawParticles = () => {
      ctx.clearRect(0, 0, width, height);

      // Randomly spawn background floaters
      if (particles.length < intensity && Math.random() < 0.15) {
        spawnParticle(Math.random() * width, Math.random() * height + height * 0.1);
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.fadeSpeed;

        // Interactive gravity pull to mouse if close enough
        if (mousePos.active && interactive) {
          const dx = mousePos.x - p.x;
          const dy = mousePos.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            // subtle wind whirlpool pull
            p.vx += (dx / dist) * 0.06;
            p.vy += (dy / dist) * 0.06;
          }
        }

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;

        if (p.glow) {
          ctx.shadowBlur = p.size * 3;
          ctx.shadowColor = p.color === colors[2] ? "#3b82f6" : "#f97316";
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    drawParticles();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      if (canvas) {
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [intensity, interactive]);

  return (
    <canvas
      ref={canvasRef}
      id="chakra-particles-canvas"
      className="absolute inset-0 w-full h-full pointer-events-none opacity-85 mix-blend-screen"
    />
  );
}
