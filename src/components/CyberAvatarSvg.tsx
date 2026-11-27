import React from "react";

interface CyberAvatarSvgProps {
  className?: string;
  size?: number | string;
  cropToCircle?: boolean;
}

export const CyberAvatarSvg: React.FC<CyberAvatarSvgProps> = ({
  className = "",
  size = "100%",
  cropToCircle = true,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 800"
      width={size}
      height={size}
      className={`select-none ${className}`}
    >
      <defs>
        {/* Background gradient */}
        <radialGradient id="cyberHudBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#080e1e" />
          <stop offset="55%" stopColor="#04060d" />
          <stop offset="85%" stopColor="#020306" />
          <stop offset="100%" stopColor="#000000" />
        </radialGradient>

        {/* Outer Orange Glow */}
        <radialGradient id="chakraOrangeGlow" cx="30%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff7700" stopOpacity="0.4" />
          <stop offset="70%" stopColor="#ff4400" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        {/* Outer Cyan Glow */}
        <radialGradient id="chakraCyanGlow" cx="70%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.4" />
          <stop offset="70%" stopColor="#4facfe" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        {/* Ring Gradients */}
        <linearGradient id="cyberOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff9a00" />
          <stop offset="50%" stopColor="#ff5500" />
          <stop offset="100%" stopColor="#ff2200" />
        </linearGradient>

        <linearGradient id="cyberCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f2fe" />
          <stop offset="50%" stopColor="#00c0ff" />
          <stop offset="100%" stopColor="#0077ff" />
        </linearGradient>

        <filter id="neonGlowOrange" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="neonGlowCyan" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Dark Cyber Aperture Base */}
      <circle cx="400" cy="400" r="390" fill="url(#cyberHudBg)" stroke="#1a2234" strokeWidth="2" />
      <circle cx="400" cy="400" r="390" fill="url(#chakraOrangeGlow)" />
      <circle cx="400" cy="400" r="390" fill="url(#chakraCyanGlow)" />

      {/* Futuristic Grid Pattern */}
      <g opacity="0.15" stroke="#00f2fe" strokeWidth="0.75">
        <line x1="100" y1="400" x2="700" y2="400" strokeDasharray="4 6" />
        <line x1="400" y1="100" x2="400" y2="700" strokeDasharray="4 6" />
        <line x1="200" y1="200" x2="600" y2="600" strokeDasharray="2 8" />
        <line x1="200" y1="600" x2="600" y2="200" strokeDasharray="2 8" />
      </g>

      {/* Concentric Rotating Cyber HUD Rings */}
      <circle
        cx="400"
        cy="400"
        r="360"
        fill="none"
        stroke="url(#cyberOrangeGrad)"
        strokeWidth="3"
        strokeDasharray="40 18 100 24 16 12 70 30"
        filter="url(#neonGlowOrange)"
      />

      <circle
        cx="400"
        cy="400"
        r="330"
        fill="none"
        stroke="url(#cyberCyanGrad)"
        strokeWidth="2.5"
        strokeDasharray="60 30 140 20 20 40"
        filter="url(#neonGlowCyan)"
      />

      <circle
        cx="400"
        cy="400"
        r="300"
        fill="none"
        stroke="#ff7700"
        strokeWidth="1.5"
        strokeDasharray="4 8"
        opacity="0.6"
      />

      <circle
        cx="400"
        cy="400"
        r="270"
        fill="none"
        stroke="#00f2fe"
        strokeWidth="2"
        strokeDasharray="18 18"
        opacity="0.75"
      />

      {/* Technical HUD Axis Reticles & Angle Marks */}
      <g stroke="#ff7700" strokeWidth="2" opacity="0.8">
        <line x1="400" y1="35" x2="400" y2="65" />
        <line x1="400" y1="735" x2="400" y2="765" />
        <line x1="35" y1="400" x2="65" y2="400" stroke="#00f2fe" />
        <line x1="735" y1="400" x2="765" y2="400" stroke="#00f2fe" />
      </g>

      {/* Central Holographic Core */}
      <circle cx="400" cy="400" r="180" fill="#070c18" stroke="#ff7700" strokeWidth="2" opacity="0.9" />
      <circle cx="400" cy="400" r="150" fill="none" stroke="#00f2fe" strokeWidth="1.5" strokeDasharray="12 6" />

      {/* Centerpiece: Glowing Konoha Emblem Crest */}
      <g transform="translate(400, 390) scale(1.4)" filter="url(#neonGlowOrange)">
        <path
          d="M0 -55 C-24 -40 -38 -15 -35 15 C-32 40 -12 55 15 55 C45 55 58 30 55 5 C52 -18 35 -38 10 -42 C-10 -46 -22 -32 -20 -15 C-18 2 -5 14 10 12 C22 10 26 -2 20 -10"
          fill="none"
          stroke="url(#cyberOrangeGrad)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 -38 L42 -55"
          fill="none"
          stroke="url(#cyberOrangeGrad)"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </g>

      {/* Telemetry Typography */}
      <text
        x="400"
        y="505"
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize="17"
        fontWeight="800"
        letterSpacing="4"
        fill="#ff9a00"
      >
        AASHISH BHUMARKAR
      </text>

      <text
        x="400"
        y="530"
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize="12"
        fontWeight="600"
        letterSpacing="3"
        fill="#00f2fe"
        opacity="0.9"
      >
        + ナルト CHAKRA HUD MATRIX +
      </text>

      <text
        x="400"
        y="555"
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize="10"
        letterSpacing="2"
        fill="#8892b0"
      >
        NEURAL ARCHITECTURE // 23.2599° N, 77.4126° E
      </text>

      {/* Outer Status Ring Accents */}
      <g opacity="0.8" fontFamily="ui-monospace, monospace" fontSize="9" fill="#00f2fe" letterSpacing="1.5">
        <text x="400" y="95" textAnchor="middle">SYSTEM ONLINE [V4.8]</text>
        <text x="400" y="715" textAnchor="middle">PORTFOLIO APERTURE READY</text>
      </g>
    </svg>
  );
};

export default CyberAvatarSvg;
