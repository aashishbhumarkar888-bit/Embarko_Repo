import React, { useState } from "react";
import { 
  Award, 
  ExternalLink, 
  Maximize2, 
  X, 
  Folder, 
  FileText,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { CERTIFICATIONS_DATA, PROFILE_INFO } from "../data";
import { Certification } from "../types";

export default function CertificateVault() {
  const [activeModalCert, setActiveModalCert] = useState<Certification | null>(null);
  const [showCollapsedList, setShowCollapsedList] = useState(false);

  // Filter the 3 strongest technical certificates
  const topThreeCerts = [
    CERTIFICATIONS_DATA.find(c => c.name.includes("Oracle")),
    CERTIFICATIONS_DATA.find(c => c.name.includes("C++ Essentials")),
    CERTIFICATIONS_DATA.find(c => c.name.includes("IBM Introduction"))
  ].filter(Boolean) as Certification[];

  // The remaining 9 certifications collapsed to one line
  const remainingCerts = CERTIFICATIONS_DATA.filter(c => !topThreeCerts.some(top => top.name === c.name));

  return (
    <div id="certifications" className="space-y-6 mb-14 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400">
              <Award className="w-5 h-5" />
            </span>
            <h3 className="text-xl sm:text-2xl font-space font-bold text-white">
              Accredited Certifications
            </h3>
          </div>
          <p className="text-sm text-zinc-300 font-jakarta mt-1">
            Verified vendor accreditations in cloud infrastructure, C++, and systems.
          </p>
        </div>

        {/* Master Drive Link CTA */}
        <a
          href={PROFILE_INFO.certificateVaultUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-orange-500/30 hover:border-orange-500 text-orange-400 hover:text-white rounded-xl font-mono text-xs sm:text-sm font-semibold tracking-wider transition-all duration-200 shadow-sm shrink-0"
        >
          <Folder className="w-4 h-4 text-orange-400" />
          <span>Open Drive Vault ({CERTIFICATIONS_DATA.length} Files)</span>
          <ExternalLink className="w-3.5 h-3.5 ml-1" />
        </a>
      </div>

      {/* 3 Strongest Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {topThreeCerts.map((cert) => (
          <div
            key={cert.name}
            className="group relative bg-[#09090e] border border-white/10 hover:border-orange-500/40 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-lg text-left"
          >
            {/* Thumbnail Preview Banner */}
            <div 
              className="relative w-full h-44 bg-zinc-950 overflow-hidden cursor-pointer flex items-center justify-center border-b border-white/10"
              onClick={() => setActiveModalCert(cert)}
              title="Click to inspect scanned copy"
            >
              {cert.previewImage ? (
                <img
                  src={cert.previewImage}
                  alt={`Scanned certificate copy for ${cert.name}`}
                  loading="lazy"
                  className="w-full h-full object-contain p-2 bg-[#050508] transition-transform duration-300 group-hover:scale-102"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : null}

              {/* Inspect overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white z-10">
                <span className="p-2 rounded-xl bg-orange-500 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-lg">
                  <Maximize2 className="w-4 h-4" />
                  <span>Inspect Scan</span>
                </span>
              </div>

              {/* Category Badge */}
              <div className="absolute top-3 right-3 z-20">
                <span className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-sm border border-white/10 text-zinc-300 font-mono text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Verified</span>
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${cert.badgeColor}`}>
                    {cert.category}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    {cert.year}
                  </span>
                </div>

                <h4 className="text-base font-space font-bold text-white group-hover:text-orange-400 transition-colors leading-snug">
                  {cert.name}
                </h4>

                <p className="text-xs text-zinc-400 font-mono">
                  Issuer: <strong className="text-zinc-200">{cert.issuer}</strong>
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModalCert(cert)}
                  className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Quick View</span>
                </button>

                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
                >
                  <span>Google Drive</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Collapsed One-Line Summary for the remaining certificates */}
      <div className="p-4 bg-zinc-950/70 border border-white/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-zinc-300">
          <FileText className="w-4 h-4 text-orange-400 shrink-0" />
          <span>
            <strong className="text-white font-semibold">9 additional certificates</strong> (TCS iON Career Edge, Saylor Academy professional courses, IEEE MANIT Bhopal, and College technical workshops) verified in Google Drive.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowCollapsedList(!showCollapsedList)}
            className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/10 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{showCollapsedList ? "Hide List" : "View Collapsed (9)"}</span>
            {showCollapsedList ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <a
            href={PROFILE_INFO.certificateVaultUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-xl text-xs flex items-center gap-1 transition-colors"
          >
            <span>Drive Folder ↗</span>
          </a>
        </div>
      </div>

      {/* Expandable list if user chooses to view the collapsed ones */}
      {showCollapsedList && (
        <div className="p-4 bg-zinc-950/90 border border-white/10 rounded-2xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 animate-fade-in text-xs font-mono">
          {remainingCerts.map(cert => (
            <a
              key={cert.name}
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-zinc-900/60 hover:bg-zinc-900 border border-white/5 hover:border-orange-500/30 rounded-xl flex items-center justify-between gap-2 text-zinc-300 hover:text-white transition-all group"
            >
              <div className="truncate">
                <p className="truncate text-white font-medium">{cert.name}</p>
                <p className="text-[10px] text-zinc-500">{cert.issuer}</p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-orange-400 shrink-0" />
            </a>
          ))}
        </div>
      )}

      {/* Modal for inspect view */}
      {activeModalCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0c0d12] border border-orange-500/30 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${activeModalCert.badgeColor}`}>
                  {activeModalCert.category}
                </span>
                <h3 className="text-xl font-space font-bold text-white mt-1">
                  {activeModalCert.name}
                </h3>
                <p className="text-xs text-zinc-400 font-mono">
                  Issued by {activeModalCert.issuer} ({activeModalCert.year})
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveModalCert(null)}
                className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {activeModalCert.previewImage && (
              <div className="w-full max-h-[55vh] overflow-hidden rounded-xl border border-white/10 bg-black flex items-center justify-center p-2">
                <img
                  src={activeModalCert.previewImage}
                  alt={activeModalCert.name}
                  className="max-h-[50vh] object-contain rounded-lg"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveModalCert(null)}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-xs rounded-xl border border-white/10 cursor-pointer"
              >
                Close
              </button>

              <a
                href={activeModalCert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-black font-space font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
              >
                <span>Open in Google Drive</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
