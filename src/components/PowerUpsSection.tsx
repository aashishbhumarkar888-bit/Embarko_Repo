import React, { useMemo, useState } from "react";
import { Zap, RotateCcw, ArrowUpRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  PORTFOLIO_DATA,
  RuneSlotKey,
  ForgeAttributeKey,
  SocketedLoadout,
  ForgeVisualProfile,
  PowerUpSkill,
} from "../data/portfolioData";
import ChapterDivider from "./ChapterDivider";
import ScrollReveal from "./ScrollReveal";

interface PowerUpsSectionProps {
  socketedLoadout: SocketedLoadout;
  forgeProfile: ForgeVisualProfile;
  shockwaveState: { slot: RuneSlotKey | "all"; key: number } | null;
  onSocketRune: (skill: PowerUpSkill) => void;
  onEquipRecommended: () => void;
  onResetLoadout: () => void;
  onJumpToRealm: () => void;
  isHighlighted?: boolean;
}

const SOCKET_POSITIONS: Record<
  RuneSlotKey,
  { cx: number; cy: number; labelX: number; labelY: number; anchor: "start" | "end" }
> = {
  coreLanguage: { cx: 88, cy: 112, labelX: 88, labelY: 162, anchor: "start" },
  interfaceRune: { cx: 312, cy: 112, labelX: 312, labelY: 162, anchor: "end" },
  engineRune: { cx: 88, cy: 288, labelX: 88, labelY: 338, anchor: "start" },
  arcaneRune: { cx: 312, cy: 288, labelX: 312, labelY: 338, anchor: "end" },
};

export default function PowerUpsSection({
  socketedLoadout,
  forgeProfile,
  shockwaveState,
  onSocketRune,
  onEquipRecommended,
  onResetLoadout,
  onJumpToRealm,
  isHighlighted = false,
}: PowerUpsSectionProps) {
  const { skillGroups, forgeSlotsMeta, forgeAttributesMeta, recommendedSocketLoadout } =
    PORTFOLIO_DATA;

  const [focusedSlot, setFocusedSlot] = useState<RuneSlotKey | "all">("all");

  const { skillById, skillsBySlot } = useMemo(() => {
    const byId = new Map<string, PowerUpSkill>();
    const bySlot: Record<RuneSlotKey, PowerUpSkill[]> = {
      coreLanguage: [],
      interfaceRune: [],
      engineRune: [],
      arcaneRune: [],
    };
    for (const group of skillGroups) {
      for (const skill of group.skills) {
        byId.set(skill.id, skill);
        bySlot[skill.socketSlot].push(skill);
      }
    }
    return { skillById: byId, skillsBySlot: bySlot };
  }, [skillGroups]);

  const attributeValues = useMemo(() => {
    const totals: Record<ForgeAttributeKey, number> = {
      architecture: forgeAttributesMeta[0].base,
      algorithms: forgeAttributesMeta[1].base,
      systems: forgeAttributesMeta[2].base,
      aiCraft: forgeAttributesMeta[3].base,
    };

    (Object.values(socketedLoadout) as string[]).forEach((skillId) => {
      const skill = skillById.get(skillId);
      if (!skill) return;
      (Object.keys(skill.forgeBoost) as ForgeAttributeKey[]).forEach((k) => {
        totals[k] = Math.min(100, totals[k] + skill.forgeBoost[k]);
      });
    });

    return totals;
  }, [socketedLoadout, skillById, forgeAttributesMeta]);

  const isRecommendedEquipped = useMemo(() => {
    return (Object.keys(recommendedSocketLoadout) as RuneSlotKey[]).every(
      (k) => socketedLoadout[k] === recommendedSocketLoadout[k]
    );
  }, [socketedLoadout, recommendedSocketLoadout]);

  const visibleSlots = useMemo(() => {
    if (focusedSlot === "all") return forgeSlotsMeta;
    return forgeSlotsMeta.filter((s) => s.key === focusedSlot);
  }, [focusedSlot, forgeSlotsMeta]);

  return (
    <section id="powerups" className="py-16 sm:py-22 px-4 sm:px-6 max-w-6xl mx-auto">
      <ChapterDivider
        chapter="CHAPTER III"
        title="THE RUNIC FORGE"
        subtitle="Socket engineering runes into the Architect Core—every configuration dynamically updates your attribute profile and live Runic Blade glow inside Story Mode's Boss Trial."
        rune="ᚦ"
        accent="#E6C999"
        isHighlighted={isHighlighted}
      />

      {/* Top Synergy Readout & Stack Presets */}
      <ScrollReveal className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="text-left space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-[#6E7896] uppercase tracking-[0.14em]">
              Active Configuration
            </span>
            <span className="text-white/20">·</span>
            <span
              className="font-mythic text-sm sm:text-base font-bold tracking-[0.1em]"
              style={{ color: forgeProfile.bladePrimary }}
            >
              {forgeProfile.synergyTitle}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#9EA8C4]">{forgeProfile.synergySubtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onEquipRecommended}
            className={`min-h-[44px] px-4 sm:px-5 py-2.5 rounded-lg font-mythic text-[10.5px] font-bold tracking-[0.14em] inline-flex items-center gap-2 transition-all active:scale-[0.98] whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6C999] ${
              isRecommendedEquipped
                ? "bg-[#E6C999]/14 border border-[#E6C999]/50 text-[#E6C999]"
                : "bg-[#E6C999] hover:bg-[#f0dab4] text-[#06080E]"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>
              {isRecommendedEquipped ? "RECOMMENDED ACTIVE" : "EQUIP RECOMMENDED"}
            </span>
          </button>

          <button
            type="button"
            onClick={onResetLoadout}
            className="min-h-[44px] px-3.5 py-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.1] text-[#9EA8C4] hover:text-[#F2F4FB] font-mono text-xs inline-flex items-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
            title="Reset to default forge runes"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </ScrollReveal>

      {/* Main Obsidian Workbench Split */}
      <ScrollReveal>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT 5 COLUMNS: Interactive SVG Runic Forge Blade + 4 Circular Sockets */}
          <div className="lg:col-span-5 obsidian-panel rounded-2xl p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden">
            {/* Subtle Ambient Forge Glow responding to live socket colors */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 transition-all duration-700"
              style={{
                background: `radial-gradient(circle at 50% 48%, ${forgeProfile.bladePrimary}16 0%, ${forgeProfile.auraColor}0B 44%, transparent 72%)`,
              }}
            />

            <div className="relative z-10 flex items-center justify-between gap-2 pb-3 border-b border-white/[0.07] text-left">
              <div>
                <p className="font-mythic text-[10.5px] tracking-[0.18em] text-[#E6C999]">
                  ARCHITECT CORE · 4 SOCKETS
                </p>
                <p className="font-mono text-[11px] text-[#6E7896] mt-0.5">
                  Select a socket ring to filter runes
                </p>
              </div>
              <button
                type="button"
                onClick={onJumpToRealm}
                className="min-h-[34px] px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.1] text-[11px] font-mono text-[#A5E8FF] inline-flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
                title="Test your socketed Runic Blade inside Story Mode"
              >
                <span>Test in Story Mode</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            {/* Interactive SVG Centerpiece */}
            <div className="relative z-10 my-2 flex items-center justify-center">
              <svg
                viewBox="0 0 400 400"
                className="w-full max-w-[360px] h-auto select-none"
                role="img"
                aria-label="Interactive Runic Forge Blade with four glowing circular rune sockets"
              >
                <defs>
                  <linearGradient id="forgeBladeCore" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={forgeProfile.bladePrimary} />
                    <stop offset="52%" stopColor={forgeProfile.bladeSecondary} />
                    <stop offset="100%" stopColor={forgeProfile.auraColor} />
                  </linearGradient>
                  <linearGradient id="forgeSteel" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1E2744" />
                    <stop offset="50%" stopColor="#101527" />
                    <stop offset="100%" stopColor="#080B14" />
                  </linearGradient>
                  <filter id="forgeGlow" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="4.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Concentric Etched Mandala Rings */}
                <circle
                  cx="200"
                  cy="200"
                  r="142"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"
                  strokeDasharray="3 6"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="98"
                  fill="none"
                  stroke={`${forgeProfile.auraColor}28`}
                  strokeWidth="1"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="54"
                  fill="#070A13"
                  stroke={`${forgeProfile.bladePrimary}44`}
                  strokeWidth="1"
                />

                {/* Conduit Energy Lines */}
                {forgeSlotsMeta.map((slot) => {
                  const pos = SOCKET_POSITIONS[slot.key];
                  const equippedSkill = skillById.get(socketedLoadout[slot.key]);
                  const color = equippedSkill?.auraColor ?? slot.defaultColor;
                  return (
                    <line
                      key={`line-${slot.key}`}
                      x1={pos.cx}
                      y1={pos.cy}
                      x2="200"
                      y2="200"
                      stroke={color}
                      strokeOpacity="0.4"
                      strokeWidth="1.2"
                      strokeDasharray="3 3"
                    />
                  );
                })}

                {/* Sculpted Obsidian Runic Blade */}
                <g>
                  <path
                    d="M200 28 L220 74 L214 252 L200 266 L186 252 L180 74 Z"
                    fill="url(#forgeSteel)"
                    stroke={`${forgeProfile.bladeSecondary}88`}
                    strokeWidth="1.2"
                  />
                  <path
                    d="M200 44 L211 78 L207 244 L200 253 L193 244 L189 78 Z"
                    fill="#0A0E1B"
                    stroke={`${forgeProfile.bladePrimary}55`}
                    strokeWidth="1"
                  />
                  <line
                    x1="200"
                    y1="52"
                    x2="200"
                    y2="246"
                    stroke="url(#forgeBladeCore)"
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    filter="url(#forgeGlow)"
                  />
                  <line
                    x1="200"
                    y1="58"
                    x2="200"
                    y2="242"
                    stroke="#F2F4FB"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                  />

                  <path
                    d="M150 260 L186 248 L200 264 L214 248 L250 260 L236 274 L200 268 L164 274 Z"
                    fill="#141A2E"
                    stroke="#E6C999"
                    strokeOpacity="0.65"
                    strokeWidth="1.2"
                  />
                  <polygon
                    points="200,250 210,262 200,274 190,262"
                    fill={forgeProfile.bladePrimary}
                    filter="url(#forgeGlow)"
                  />

                  <rect
                    x="194"
                    y="273"
                    width="12"
                    height="62"
                    rx="3"
                    fill="#0E1322"
                    stroke="rgba(230,201,153,0.4)"
                    strokeWidth="1"
                  />
                  <line x1="194" y1="289" x2="206" y2="289" stroke="#E6C999" strokeOpacity="0.38" />
                  <line x1="194" y1="305" x2="206" y2="305" stroke="#E6C999" strokeOpacity="0.38" />
                  <line x1="194" y1="321" x2="206" y2="321" stroke="#E6C999" strokeOpacity="0.38" />

                  <polygon
                    points="200,335 213,348 200,366 187,348"
                    fill="#141A2E"
                    stroke={forgeProfile.auraColor}
                    strokeWidth="1.2"
                  />
                </g>

                {/* 4 Interactive Rune Sockets */}
                {forgeSlotsMeta.map((slot) => {
                  const pos = SOCKET_POSITIONS[slot.key];
                  const equippedSkill = skillById.get(socketedLoadout[slot.key]);
                  const color = equippedSkill?.auraColor ?? slot.defaultColor;
                  const isSlotFocused = focusedSlot === slot.key;
                  const shouldShockwave =
                    shockwaveState &&
                    (shockwaveState.slot === slot.key || shockwaveState.slot === "all");

                  return (
                    <g
                      key={slot.key}
                      onClick={() =>
                        setFocusedSlot((prev) => (prev === slot.key ? "all" : slot.key))
                      }
                      className="cursor-pointer"
                      role="button"
                      tabIndex={0}
                      aria-label={`Filter by ${slot.label}. Currently socketed: ${
                        equippedSkill?.name ?? "None"
                      }`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setFocusedSlot((prev) => (prev === slot.key ? "all" : slot.key));
                        }
                      }}
                    >
                      <AnimatePresence>
                        {shouldShockwave && (
                          <motion.circle
                            key={`shock-${slot.key}-${shockwaveState.key}`}
                            cx={pos.cx}
                            cy={pos.cy}
                            r={30}
                            fill="none"
                            stroke={color}
                            strokeWidth="2.2"
                            initial={{ scale: 0.75, opacity: 0.9 }}
                            animate={{ scale: 2.0, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                            style={{ transformOrigin: `${pos.cx}px ${pos.cy}px` }}
                          />
                        )}
                      </AnimatePresence>

                      <circle
                        cx={pos.cx}
                        cy={pos.cy}
                        r={isSlotFocused ? 33 : 30}
                        fill="#070A13"
                        stroke={color}
                        strokeWidth={isSlotFocused ? 2 : 1.4}
                        filter={isSlotFocused ? "url(#forgeGlow)" : undefined}
                      />
                      <circle
                        cx={pos.cx}
                        cy={pos.cy}
                        r="23"
                        fill={`${color}14`}
                        stroke={`${color}55`}
                        strokeWidth="1"
                      />

                      <text
                        x={pos.cx}
                        y={pos.cy + 7}
                        textAnchor="middle"
                        fill={color}
                        fontSize="20"
                        fontWeight="700"
                        fontFamily="Georgia, serif"
                      >
                        {equippedSkill?.runeSymbol ?? "ᛟ"}
                      </text>

                      <text
                        x={pos.cx}
                        y={pos.labelY}
                        textAnchor="middle"
                        fill={color}
                        fontSize="8.5"
                        fontWeight="700"
                        letterSpacing="1.5"
                        fontFamily="'Cinzel', Georgia, serif"
                      >
                        {slot.label}
                      </text>
                      <text
                        x={pos.cx}
                        y={pos.labelY + 14}
                        textAnchor="middle"
                        fill="#F2F4FB"
                        fontSize="10"
                        fontWeight="600"
                        fontFamily="'JetBrains Mono', monospace"
                      >
                        {equippedSkill
                          ? equippedSkill.name.length > 17
                            ? `${equippedSkill.name.slice(0, 16)}…`
                            : equippedSkill.name
                          : "Empty"}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="relative z-10 pt-3 border-t border-white/[0.07] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#9EA8C4]">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: forgeProfile.bladePrimary }}
                  />
                  <span>Blade</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: forgeProfile.auraColor }}
                  />
                  <span>Cloak Aura</span>
                </span>
              </div>
              <span className="text-[#E6C999]">Live Synced</span>
            </div>
          </div>

          {/* RIGHT 7 COLUMNS: 4 Attribute Meters + Rune Inventory */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="obsidian-panel rounded-2xl p-5 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {forgeAttributesMeta.map((attr) => {
                  const value = attributeValues[attr.key];
                  return (
                    <div key={attr.key} className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mythic text-[10.5px] tracking-[0.16em] text-[#F2F4FB]">
                          {attr.label}
                        </span>
                        <span
                          className="font-mono text-xs sm:text-sm font-bold tabular-nums"
                          style={{ color: attr.color }}
                        >
                          {value}/100
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#06080E] border border-white/[0.08] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-transform duration-300 ease-out origin-left"
                          style={{
                            transform: `scaleX(${Math.max(0.05, value / 100)})`,
                            backgroundColor: attr.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="obsidian-panel rounded-2xl p-5 sm:p-6 flex-1 flex flex-col gap-5">
              {/* Segmented Slot Filter Controls */}
              <div className="flex flex-wrap items-center gap-1.5 pb-4 border-b border-white/[0.07]">
                <button
                  type="button"
                  onClick={() => setFocusedSlot("all")}
                  className={`min-h-[38px] px-3 py-1.5 rounded-lg font-mono text-xs transition-colors cursor-pointer whitespace-nowrap ${
                    focusedSlot === "all"
                      ? "bg-[#F2F4FB] text-[#06080E] font-bold"
                      : "bg-[#070A13] text-[#9EA8C4] hover:text-[#F2F4FB] border border-white/[0.08]"
                  }`}
                >
                  All 4 Sockets
                </button>
                {forgeSlotsMeta.map((slot) => {
                  const active = focusedSlot === slot.key;
                  return (
                    <button
                      key={slot.key}
                      type="button"
                      onClick={() => setFocusedSlot(slot.key)}
                      className={`min-h-[38px] px-3 py-1.5 rounded-lg font-mono text-xs transition-colors cursor-pointer whitespace-nowrap border ${
                        active
                          ? "bg-white/[0.08] text-[#F2F4FB] border-[#E6C999]/45"
                          : "bg-[#070A13] text-[#9EA8C4] hover:text-[#F2F4FB] border-white/[0.08]"
                      }`}
                    >
                      {slot.shortLabel}
                    </button>
                  );
                })}
              </div>

              {/* Socketable Real Skill Runes */}
              <div className="space-y-5 text-left">
                {visibleSlots.map((slot) => {
                  const skills = skillsBySlot[slot.key];
                  const activeSkillId = socketedLoadout[slot.key];
                  return (
                    <div key={slot.key} className="space-y-2.5">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3
                          className="font-mythic text-[10.5px] font-semibold tracking-[0.18em]"
                          style={{ color: slot.defaultColor }}
                        >
                          {slot.label}
                        </h3>
                        <span className="font-mono text-[11px] text-[#6E7896]">
                          {slot.description}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {skills.map((skill) => {
                          const isSocketed = activeSkillId === skill.id;
                          return (
                            <button
                              key={skill.id}
                              type="button"
                              onClick={() => onSocketRune(skill)}
                              aria-pressed={isSocketed}
                              className={`min-h-[54px] px-3.5 py-2.5 rounded-xl border text-left transition-all duration-150 active:scale-[0.98] cursor-pointer flex items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A5E8FF] ${
                                isSocketed
                                  ? "bg-white/[0.06] text-[#F2F4FB]"
                                  : "bg-[#070A13]/85 border-white/[0.07] text-[#9EA8C4] hover:border-white/[0.18] hover:text-[#F2F4FB]"
                              }`}
                              style={
                                isSocketed
                                  ? {
                                      borderColor: `${skill.auraColor}80`,
                                    }
                                  : undefined
                              }
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span
                                  className="w-8 h-8 rounded-lg bg-[#06080E] border flex items-center justify-center font-serif text-sm font-bold shrink-0"
                                  style={{
                                    borderColor: isSocketed
                                      ? `${skill.auraColor}70`
                                      : "rgba(255,255,255,0.08)",
                                    color: skill.auraColor,
                                  }}
                                >
                                  {skill.runeSymbol}
                                </span>
                                <div className="min-w-0">
                                  <span className="font-space text-xs sm:text-[13px] font-semibold block truncate">
                                    {skill.name}
                                  </span>
                                  <span className="font-mono text-[10px] text-[#6E7896] block truncate">
                                    {skill.shortDesc}
                                  </span>
                                </div>
                              </div>

                              <span
                                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                  isSocketed
                                    ? "border-transparent text-[#06080E]"
                                    : "border-white/[0.12] text-transparent"
                                }`}
                                style={
                                  isSocketed ? { backgroundColor: skill.auraColor } : undefined
                                }
                              >
                                <Check className="w-3 h-3 stroke-[3]" />
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
