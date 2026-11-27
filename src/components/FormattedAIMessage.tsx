import React, { useState } from "react";
import { ExternalLink, Copy, Check, Terminal, Sparkles, FolderCheck, Github, Globe } from "lucide-react";

interface FormattedAIMessageProps {
  content: string;
  isCopilot?: boolean;
}

export default function FormattedAIMessage({ content, isCopilot = true }: FormattedAIMessageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to parse inline markdown (bold, inline code, links)
  const renderInlineFormatted = (text: string) => {
    // Match markdown links [text](url) or raw urls (http:// or https://) or **bold** or `code`
    const tokens: React.ReactNode[] = [];
    let remaining = text;
    let keyIdx = 0;

    // Pattern for:
    // 1. Markdown link: \[([^\]]+)\]\((https?:\/\/[^\s)]+)\)
    // 2. Bold text: \*\*([^*]+)\*\*
    // 3. Inline code: `([^`]+)`
    // 4. Raw URL: (https?:\/\/[^\s]+)
    const regex = /(\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`|(https?:\/\/[^\s)\]]+))/g;
    let match: RegExpExecArray | null;
    let lastIndex = 0;

    while ((match = regex.exec(text)) !== null) {
      // Push preceding text
      if (match.index > lastIndex) {
        tokens.push(<span key={`text-${keyIdx++}`}>{text.substring(lastIndex, match.index)}</span>);
      }

      if (match[2] && match[3]) {
        // [text](url)
        tokens.push(
          <a
            key={`mdlink-${keyIdx++}`}
            href={match[3]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 text-orange-400 hover:text-orange-300 underline underline-offset-2 font-medium transition-colors"
          >
            <span>{match[2]}</span>
            <ExternalLink className="w-2.5 h-2.5 ml-0.5 opacity-80" />
          </a>
        );
      } else if (match[4]) {
        // **bold**
        tokens.push(
          <strong key={`bold-${keyIdx++}`} className="font-bold text-white tracking-wide">
            {match[4]}
          </strong>
        );
      } else if (match[5]) {
        // `code`
        tokens.push(
          <code
            key={`code-${keyIdx++}`}
            className="px-1.5 py-0.5 mx-0.5 rounded bg-zinc-800 text-orange-300 font-mono text-[11px] border border-white/10"
          >
            {match[5]}
          </code>
        );
      } else if (match[6]) {
        // Raw URL
        const rawUrl = match[6];
        tokens.push(
          <a
            key={`rawurl-${keyIdx++}`}
            href={rawUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 text-orange-400 hover:text-orange-300 underline underline-offset-2 break-all font-mono text-[10px] transition-colors"
          >
            <span>{rawUrl.length > 40 ? rawUrl.substring(0, 37) + "..." : rawUrl}</span>
            <ExternalLink className="w-2.5 h-2.5 ml-0.5 shrink-0 opacity-80" />
          </a>
        );
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      tokens.push(<span key={`text-${keyIdx++}`}>{text.substring(lastIndex)}</span>);
    }

    return tokens.length > 0 ? tokens : text;
  };

  // Split content into lines and group into structured blocks
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let currentList: { type: "bullet" | "number"; items: { prefix?: string; content: string }[] } | null = null;

  const flushList = () => {
    if (!currentList) return;
    if (currentList.type === "bullet") {
      blocks.push(
        <ul key={`list-${blocks.length}`} className="my-2 space-y-1.5 pl-1">
          {currentList.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-zinc-300 leading-relaxed text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0 shadow-[0_0_6px_rgba(249,115,22,0.6)]" />
              <div className="flex-1">{renderInlineFormatted(item.content)}</div>
            </li>
          ))}
        </ul>
      );
    } else {
      blocks.push(
        <ol key={`list-${blocks.length}`} className="my-2 space-y-1.5 pl-1">
          {currentList.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-zinc-300 leading-relaxed text-xs">
              <span className="font-mono text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.2 rounded shrink-0 mt-0.5">
                {item.prefix || `${idx + 1}`}
              </span>
              <div className="flex-1">{renderInlineFormatted(item.content)}</div>
            </li>
          ))}
        </ol>
      );
    }
    currentList = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    // Markdown Headers: #, ##, ###
    if (trimmed.startsWith("### ")) {
      flushList();
      blocks.push(
        <div key={`h3-${i}`} className="mt-3 mb-1.5 pb-1 border-b border-white/10">
          <h4 className="text-sm font-space font-bold text-orange-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            {renderInlineFormatted(trimmed.replace(/^###\s+/, ""))}
          </h4>
        </div>
      );
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushList();
      blocks.push(
        <div key={`h2-${i}`} className="mt-3.5 mb-1.5 pb-1 border-b border-orange-500/20">
          <h3 className="text-sm font-space font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-orange-400" />
            {renderInlineFormatted(trimmed.replace(/^##\s+/, ""))}
          </h3>
        </div>
      );
      continue;
    }

    if (trimmed.startsWith("# ")) {
      flushList();
      blocks.push(
        <div key={`h1-${i}`} className="mt-4 mb-2 pb-1.5 border-b border-orange-500/30">
          <h2 className="text-base font-space font-black text-white uppercase tracking-wide">
            {renderInlineFormatted(trimmed.replace(/^#\s+/, ""))}
          </h2>
        </div>
      );
      continue;
    }

    // Bullet points: • or - or *
    if (trimmed.startsWith("• ") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const itemText = trimmed.replace(/^[•\-\*]\s+/, "");
      if (!currentList || currentList.type !== "bullet") {
        flushList();
        currentList = { type: "bullet", items: [] };
      }
      currentList.items.push({ content: itemText });
      continue;
    }

    // Numbered list: 1. or 2)
    const numMatch = trimmed.match(/^(\d+[\.\)])\s+(.*)$/);
    if (numMatch) {
      if (!currentList || currentList.type !== "number") {
        flushList();
        currentList = { type: "number", items: [] };
      }
      currentList.items.push({ prefix: numMatch[1], content: numMatch[2] });
      continue;
    }

    // Regular paragraph or title
    flushList();
    blocks.push(
      <p key={`p-${i}`} className="text-xs text-zinc-300 leading-relaxed my-1 font-jakarta">
        {renderInlineFormatted(trimmed)}
      </p>
    );
  }

  flushList();

  // Check if content mentions specific key resources to provide quick action chips
  const hasSPO = content.toLowerCase().includes("spo") || content.includes("spo-snowy.vercel.app");
  const hasDrive = content.toLowerCase().includes("drive.google.com") || content.toLowerCase().includes("certificate");
  const hasGitHub = content.toLowerCase().includes("github.com");
  const hasVoltPath = content.toLowerCase().includes("voltpath");

  return (
    <div className="space-y-2 text-left">
      <div className="space-y-1">{blocks}</div>

      {/* Quick Action Badges for direct access */}
      {(hasSPO || hasDrive || hasGitHub || hasVoltPath) && (
        <div className="pt-2 mt-2 border-t border-white/10 flex flex-wrap items-center gap-1.5 select-none">
          {hasSPO && (
            <a
              href="https://spo-snowy.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-300 text-[10px] font-mono rounded-lg transition-all"
            >
              <Globe className="w-2.5 h-2.5 text-orange-400" />
              <span>SPO Live Demo</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
          {hasVoltPath && (
            <a
              href="https://voltpath-ai.base44.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono rounded-lg transition-all"
            >
              <Globe className="w-2.5 h-2.5 text-cyan-400" />
              <span>VoltPath App</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
          {hasDrive && (
            <a
              href="https://drive.google.com/drive/folders/1O6ZGBZJMawASa5mvnP8QgX9lp-dx77MM"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono rounded-lg transition-all"
            >
              <FolderCheck className="w-2.5 h-2.5 text-emerald-400" />
              <span>Google Drive Vault</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
          {hasGitHub && (
            <a
              href="https://github.com/aashishbhumarkar888-bit"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-[10px] font-mono rounded-lg transition-all"
            >
              <Github className="w-2.5 h-2.5 text-purple-400" />
              <span>GitHub Profile</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-mono rounded-lg border border-white/10 transition-all cursor-pointer"
            title="Copy answer to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-2.5 h-2.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-2.5 h-2.5 text-zinc-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
