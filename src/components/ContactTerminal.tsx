import React, { useState } from "react";
import {
  Copy,
  Check,
  Send,
  Github,
  Linkedin,
  ExternalLink,
  Mail,
  Phone,
  Download,
  Code2,
  Youtube,
  Instagram,
} from "lucide-react";
import { PORTFOLIO_DATA } from "../data/portfolioData";
import ChapterDivider from "./ChapterDivider";
import ScrollReveal from "./ScrollReveal";

interface ContactTerminalProps {
  onTransmissionSent: () => void;
  onSoundClick: () => void;
}

export default function ContactTerminal({
  onTransmissionSent,
  onSoundClick,
}: ContactTerminalProps) {
  const { profile, codingProfiles, contact } = PORTFOLIO_DATA;

  const [emailCopied, setEmailCopied] = useState(false);
  const [name, setName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [subject, setSubject] = useState<string>(contact.subjectPresets[0]);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [dispatched, setDispatched] = useState(false);

  const handleCopyEmail = () => {
    onSoundClick();
    navigator.clipboard.writeText(profile.email).catch(() => {});
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanName = name.trim();
    const cleanEmail = senderEmail.trim();
    const cleanMessage = message.trim();

    if (!cleanName || !cleanEmail || !cleanMessage) {
      setErrorMsg("Please complete your name, email address, and message.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    try {
      const existing = JSON.parse(localStorage.getItem("aashish_sent_transmissions") || "[]");
      existing.unshift({
        name: cleanName,
        email: cleanEmail,
        subject,
        message: cleanMessage,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem(
        "aashish_sent_transmissions",
        JSON.stringify(existing.slice(0, 10))
      );
    } catch {
      // Ignore private storage errors
    }

    setDispatched(true);
    onTransmissionSent();
  };

  const handleResetForm = () => {
    onSoundClick();
    setName("");
    setSenderEmail("");
    setMessage("");
    setErrorMsg("");
    setDispatched(false);
  };

  const mailtoHref = `mailto:${profile.email}?subject=${encodeURIComponent(
    subject || "Engineering Inquiry"
  )}&body=${encodeURIComponent(
    message ? `Hi Aashish,\n\n${message}\n\n— ${name || "Visitor"}` : "Hi Aashish,"
  )}`;

  return (
    <section id="contact" className="py-16 sm:py-22 px-4 sm:px-6 max-w-6xl mx-auto">
      <ChapterDivider
        chapter="EPILOGUE"
        title="DIRECT CORRESPONDENCE"
        subtitle={contact.subtitle}
        rune="ᛗ"
        accent="#A5E8FF"
      />

      <ScrollReveal>
        <div className="obsidian-panel rounded-2xl overflow-hidden">
          <div className="p-6 sm:p-9 grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
            {/* Left 5 Columns: Direct Channels, Socials & Coding Profiles */}
            <div className="lg:col-span-5 space-y-5">
              {/* 1-Click Direct Email */}
              <div className="rounded-xl bg-[#070A13]/90 border border-white/[0.08] p-4 sm:p-5 space-y-3">
                <p className="font-mythic text-[10px] tracking-[0.18em] text-[#E6C999]">
                  DIRECT EMAIL
                </p>
                <p className="font-mono text-xs sm:text-sm text-[#F2F4FB] break-all">
                  {profile.email}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="min-h-[42px] px-4 py-2 rounded-lg bg-[#E6C999] hover:bg-[#f0dab4] text-[#06080E] font-mythic text-[10px] font-bold tracking-[0.14em] inline-flex items-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    {emailCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>COPY EMAIL</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`mailto:${profile.email}`}
                    onClick={onSoundClick}
                    className="min-h-[42px] px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-[#F2F4FB] font-mono text-xs inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#A5E8FF]" />
                    <span>Open Mail</span>
                  </a>
                </div>
              </div>

              {/* Phone & WhatsApp */}
              <div className="rounded-xl bg-[#070A13]/85 border border-white/[0.07] p-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E7896]">
                    Phone &amp; WhatsApp
                  </p>
                  <p className="font-mono text-sm text-[#F2F4FB] font-medium mt-0.5">
                    {profile.phone}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={profile.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onSoundClick}
                    className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#98F5E1]/10 border border-[#98F5E1]/35 text-[#98F5E1] font-mono text-xs inline-flex items-center gap-1 hover:bg-[#98F5E1]/18 transition-colors"
                  >
                    <span>WhatsApp</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={`tel:${profile.phone.replace(/\s+/g, "")}`}
                    onClick={onSoundClick}
                    aria-label="Call Aashish"
                    className="min-h-[38px] w-[38px] rounded-lg bg-white/[0.04] border border-white/[0.1] text-[#9EA8C4] hover:text-[#F2F4FB] inline-flex items-center justify-center transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Verified Network Links */}
              <div className="space-y-2.5">
                <p className="font-mythic text-[10px] tracking-[0.18em] text-[#C7B8FF]">
                  VERIFIED CHANNELS
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={profile.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onSoundClick}
                    className="min-h-[40px] px-3 py-2 rounded-lg bg-[#070A13] border border-white/[0.08] hover:border-[#98F5E1]/45 text-xs font-mono text-[#F2F4FB] inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Github className="w-3.5 h-3.5 text-[#98F5E1]" />
                    <span>GitHub</span>
                  </a>
                  <a
                    href={profile.links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onSoundClick}
                    className="min-h-[40px] px-3 py-2 rounded-lg bg-[#070A13] border border-white/[0.08] hover:border-[#A5E8FF]/45 text-xs font-mono text-[#F2F4FB] inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5 text-[#A5E8FF]" />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href={profile.links.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onSoundClick}
                    className="min-h-[40px] px-3 py-2 rounded-lg bg-[#070A13] border border-white/[0.08] hover:border-[#C7B8FF]/45 text-xs font-mono text-[#F2F4FB] inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Youtube className="w-3.5 h-3.5 text-[#C7B8FF]" />
                    <span>Showcase</span>
                  </a>
                  <a
                    href={profile.links.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onSoundClick}
                    className="min-h-[40px] px-3 py-2 rounded-lg bg-[#070A13] border border-white/[0.08] hover:border-[#E6C999]/45 text-xs font-mono text-[#F2F4FB] inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Instagram className="w-3.5 h-3.5 text-[#E6C999]" />
                    <span>Instagram</span>
                  </a>
                  <a
                    href={profile.links.resumeDriveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onSoundClick}
                    className="min-h-[40px] px-3 py-2 rounded-lg bg-[#E6C999]/10 border border-[#E6C999]/35 hover:bg-[#E6C999]/18 text-xs font-mono text-[#E6C999] inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Resume (Drive)</span>
                  </a>
                </div>
              </div>

              {/* Competitive Coding Profiles */}
              <div className="space-y-2.5">
                <p className="font-mythic text-[10px] tracking-[0.18em] text-[#A5E8FF] flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>COMPETITIVE PROFILES</span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {codingProfiles.map((cp) => (
                    <a
                      key={cp.id}
                      href={cp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onSoundClick}
                      className="min-h-[40px] px-3 py-2 rounded-lg bg-[#070A13] border border-white/[0.08] hover:border-[#A5E8FF]/45 text-xs font-mono flex items-center justify-between gap-1.5 transition-colors"
                    >
                      <span className="text-[#F2F4FB] truncate">{cp.name}</span>
                      <span className="text-[#98F5E1] font-bold shrink-0">{cp.solved}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 7 Columns: Clean Correspondence Form */}
            <div className="lg:col-span-7">
              {dispatched ? (
                <div className="h-full min-h-[340px] rounded-xl bg-[#070A13]/90 border border-[#98F5E1]/35 p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#98F5E1]/12 border border-[#98F5E1]/45 flex items-center justify-center">
                    <Check className="w-6 h-6 text-[#98F5E1]" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="font-mythic text-sm sm:text-base font-bold text-[#F2F4FB] tracking-[0.1em]">
                      MESSAGE RECORDED
                    </p>
                    <p className="text-sm text-[#9EA8C4] max-w-md leading-relaxed">
                      Thank you, <span className="text-[#F2F4FB] font-semibold">{name}</span>. Your
                      note regarding <span className="text-[#E6C999]">{subject}</span> is ready—you
                      can also send it immediately via your email client below.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <a
                      href={mailtoHref}
                      className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#E6C999] hover:bg-[#f0dab4] text-[#06080E] font-mythic text-[10.5px] font-bold tracking-[0.14em] inline-flex items-center gap-2 transition-all active:scale-[0.98]"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>OPEN IN EMAIL APP</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="min-h-[44px] px-4 py-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-[#F2F4FB] font-mono text-xs cursor-pointer"
                    >
                      Compose Another
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="rounded-xl bg-[#070A13]/85 border border-white/[0.07] p-5 sm:p-6 space-y-4"
                  noValidate
                >
                  {/* Inquiry Topic */}
                  <div className="space-y-2">
                    <label className="block font-mythic text-[10px] tracking-[0.18em] text-[#E6C999]">
                      INQUIRY TOPIC
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {contact.subjectPresets.map((preset) => {
                        const active = subject === preset;
                        return (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => {
                              onSoundClick();
                              setSubject(preset);
                            }}
                            className={`min-h-[36px] px-3 py-1.5 rounded-lg border font-mono text-xs transition-all cursor-pointer ${
                              active
                                ? "bg-white/[0.08] border-[#E6C999]/55 text-[#F2F4FB]"
                                : "bg-[#0B0F1C] border-white/[0.08] text-[#9EA8C4] hover:text-[#F2F4FB]"
                            }`}
                          >
                            {preset}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name & Email Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-name"
                        className="block font-mono text-xs text-[#9EA8C4]"
                      >
                        Your Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Doe / Recruiter"
                        className="w-full min-h-[44px] rounded-lg bg-[#0B0F1C] border border-white/[0.1] focus:border-[#A5E8FF] px-3.5 py-2.5 text-sm text-[#F2F4FB] placeholder:text-[#555F7C] focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-email"
                        className="block font-mono text-xs text-[#9EA8C4]"
                      >
                        Your Email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full min-h-[44px] rounded-lg bg-[#0B0F1C] border border-white/[0.1] focus:border-[#A5E8FF] px-3.5 py-2.5 text-sm text-[#F2F4FB] placeholder:text-[#555F7C] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-message"
                      className="block font-mono text-xs text-[#9EA8C4]"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share details about the role, project, or collaboration..."
                      className="w-full rounded-lg bg-[#0B0F1C] border border-white/[0.1] focus:border-[#A5E8FF] px-3.5 py-2.5 text-sm text-[#F2F4FB] placeholder:text-[#555F7C] focus:outline-none transition-colors resize-y"
                    />
                  </div>

                  {errorMsg && (
                    <p
                      role="alert"
                      className="text-xs font-mono text-[#E6C999] bg-[#E6C999]/10 border border-[#E6C999]/35 rounded-lg px-3 py-2"
                    >
                      {errorMsg}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <span className="font-mono text-[11px] text-[#6E7896]">
                      Direct response within 24 hours
                    </span>
                    <button
                      type="submit"
                      className="min-h-[44px] px-6 py-2.5 rounded-lg bg-[#E6C999] hover:bg-[#f0dab4] text-[#06080E] font-mythic text-[10.5px] font-bold tracking-[0.16em] inline-flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>SEND MESSAGE</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
