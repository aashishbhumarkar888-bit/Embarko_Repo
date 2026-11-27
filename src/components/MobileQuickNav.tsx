import React from "react";

interface MobileQuickNavProps {
  activeSection: string;
  onJump: (sectionId: string) => void;
}

const CHAPTER_PILLS = [
  { id: "origin", label: "Origin", rune: "ᛟ" },
  { id: "arena", label: "Arena", rune: "ᚱ" },
  { id: "levels", label: "Realms", rune: "ᛉ" },
  { id: "powerups", label: "Forge", rune: "ᚦ" },
  { id: "trophies", label: "Honor", rune: "ᛏ" },
];

export default function MobileQuickNav({ activeSection, onJump }: MobileQuickNavProps) {
  return (
    <nav
      aria-label="Mobile chapter navigation"
      className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-24px)] max-w-[380px]"
    >
      <div className="bg-[#090C16]/90 backdrop-blur-xl border border-white/[0.1] rounded-full p-1 shadow-[0_14px_36px_rgba(0,0,0,0.85)] grid grid-cols-5 gap-0.5">
        {CHAPTER_PILLS.map((item) => {
          const isActive =
            activeSection === item.id ||
            (item.id === "origin" && activeSection === "start") ||
            (item.id === "trophies" && activeSection === "contact");

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onJump(item.id)}
              aria-current={isActive ? "location" : undefined}
              className={`min-h-[44px] rounded-full flex flex-col items-center justify-center gap-0.5 px-1 transition-all duration-150 cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E6C999] ${
                isActive
                  ? "bg-white/[0.08] text-[#E6C999]"
                  : "text-[#8B95B2] hover:text-[#F2F4FB]"
              }`}
            >
              <span
                aria-hidden="true"
                className="font-serif text-xs leading-none"
                style={{ color: isActive ? "#E6C999" : "#6E7896" }}
              >
                {item.rune}
              </span>
              <span className="font-mythic text-[8.5px] font-semibold tracking-[0.08em] leading-none whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
