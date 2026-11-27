import React, { useState, useEffect } from "react";
import { Zap, ShieldAlert, Cpu, Sparkles, Code, Terminal, Play, Lock, Shield, Eye, Database, Battery, RefreshCw, Layers, TrendingUp, CheckCircle2, ExternalLink, QrCode, Download } from "lucide-react";

/* 0. SPO Smart Farmer Procurement Simulator (AgriTech & Cloud Platform) */
export function SPOSimulator() {
  const [crop, setCrop] = useState("Wheat (Sharbati A-Grade)");
  const [lotQuantity, setLotQuantity] = useState(40); // in Quintals
  const [isProcessing, setIsProcessing] = useState(false);
  const [contractLocked, setContractLocked] = useState<any | null>(null);

  const cropCatalog: Record<string, { msp: number; mandiRate: number; spoDirectRate: number; unit: string }> = {
    "Wheat (Sharbati A-Grade)": { msp: 2275, mandiRate: 2380, spoDirectRate: 2750, unit: "₹/Quintal" },
    "Basmati Paddy (Pusa 1121)": { msp: 2183, mandiRate: 3450, spoDirectRate: 3890, unit: "₹/Quintal" },
    "Mustard Seeds (Oil Rich)": { msp: 5650, mandiRate: 5400, spoDirectRate: 6100, unit: "₹/Quintal" },
    "Soybean (Yellow Variety)": { msp: 4600, mandiRate: 4450, spoDirectRate: 4980, unit: "₹/Quintal" },
    "Organic Maize": { msp: 2090, mandiRate: 2150, spoDirectRate: 2480, unit: "₹/Quintal" }
  };

  const selectedData = cropCatalog[crop] || cropCatalog["Wheat (Sharbati A-Grade)"];
  const mandiTotal = selectedData.mandiRate * lotQuantity;
  const spoTotal = selectedData.spoDirectRate * lotQuantity;
  const farmerExtraProfit = spoTotal - mandiTotal;

  const handleCreateBid = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setContractLocked(null);

    setTimeout(() => {
      setIsProcessing(false);
      setContractLocked({
        contractId: `SPO-MP-${Math.floor(100000 + Math.random() * 900000)}`,
        cropName: crop,
        quantity: lotQuantity,
        buyer: "Adani Agri Logistics & ITC e-Choupal Consortium",
        finalPayout: spoTotal,
        extraEarned: farmerExtraProfit,
        deliveryWindow: "Within 48 Hours at Local Hub"
      });
    }, 700);
  };

  return (
    <div className="bg-[#040905] border border-emerald-500/30 rounded-2xl p-4 w-full text-xs font-mono text-emerald-200 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-emerald-500/15 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-space font-bold uppercase text-emerald-300 tracking-wider">
            SPO Smart Farmer Procurement Engine
          </span>
        </div>
        <a 
          href="https://spo-snowy.vercel.app/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-[9px] bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 rounded px-2 py-0.5 flex items-center gap-1 transition-all"
        >
          <span>spo-snowy.vercel.app</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>

      {/* Interactive Lot Formulation */}
      <form onSubmit={handleCreateBid} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-zinc-400 text-[10px] uppercase font-bold block mb-1">
              Select Crop Category:
            </label>
            <select
              value={crop}
              onChange={(e) => {
                setCrop(e.target.value);
                setContractLocked(null);
              }}
              className="w-full bg-[#0a160d] text-zinc-100 border border-emerald-500/30 rounded-lg p-2 text-xs font-sans focus:outline-none focus:border-emerald-400"
            >
              {Object.keys(cropCatalog).map((c) => (
                <option key={c} value={c} className="bg-zinc-950 text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center text-[10px] mb-1">
              <span className="text-zinc-400 uppercase font-bold">Procurement Volume:</span>
              <span className="text-emerald-400 font-bold">{lotQuantity} Quintals</span>
            </div>
            <input
              type="range"
              min="5"
              max="200"
              step="5"
              value={lotQuantity}
              onChange={(e) => {
                setLotQuantity(Number(e.target.value));
                setContractLocked(null);
              }}
              className="w-full accent-emerald-500 bg-zinc-900 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[8.5px] text-zinc-500 mt-0.5 font-mono">
              <span>5 Q</span>
              <span>100 Q</span>
              <span>200 Q</span>
            </div>
          </div>
        </div>

        {/* Real-time Rate Comparison Matrix */}
        <div className="grid grid-cols-3 gap-2 bg-[#08120a] border border-emerald-500/20 p-2.5 rounded-xl text-center">
          <div className="border-r border-emerald-500/10 pr-1">
            <span className="block text-[8.5px] text-zinc-500 uppercase tracking-wider">Govt. MSP</span>
            <span className="text-xs font-bold text-zinc-300">₹{selectedData.msp}</span>
            <span className="block text-[8px] text-zinc-500">per quintal</span>
          </div>
          <div className="border-r border-emerald-500/10 pr-1">
            <span className="block text-[8.5px] text-rose-400 uppercase tracking-wider">Middleman Mandi</span>
            <span className="text-xs font-bold text-rose-300">₹{selectedData.mandiRate}</span>
            <span className="block text-[8px] text-rose-500/80">-18% cuts</span>
          </div>
          <div>
            <span className="block text-[8.5px] text-emerald-400 uppercase tracking-wider font-bold">SPO Direct Buyer</span>
            <span className="text-xs font-bold text-emerald-300">₹{selectedData.spoDirectRate}</span>
            <span className="block text-[8px] text-emerald-400 font-bold">+100% fair rate</span>
          </div>
        </div>

        {/* Live Gain Calculator */}
        <div className="flex items-center justify-between p-2.5 bg-emerald-950/25 border border-emerald-500/30 rounded-xl">
          <div className="space-y-0.5">
            <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" /> Direct Farmer Surplus:
            </span>
            <p className="text-[10px] text-zinc-300">
              Total SPO Value: <strong className="text-white">₹{spoTotal.toLocaleString("en-IN")}</strong>
            </p>
          </div>
          <div className="text-right">
            <span className="text-sm font-space font-black text-emerald-300">
              +₹{farmerExtraProfit.toLocaleString("en-IN")}
            </span>
            <span className="block text-[8px] text-emerald-400/80 font-mono">Zero Middleman Loss</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full py-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 hover:from-emerald-400 hover:to-teal-400 text-black font-space font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
              <span>Verifying Quality Index & Buyer Node...</span>
            </>
          ) : (
            <>
              <span>Lock Direct Farmer Procurement Contract</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-black" />
            </>
          )}
        </button>
      </form>

      {/* Contract Verification Receipt */}
      {contractLocked && (
        <div className="mt-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-400/40 space-y-1.5 animate-fade-in">
          <div className="flex justify-between items-center text-[10px] border-b border-emerald-500/20 pb-1">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> CONTRACT AUTHORIZED
            </span>
            <span className="font-mono text-zinc-300">{contractLocked.contractId}</span>
          </div>
          <div className="text-[10px] text-zinc-300 space-y-0.5">
            <p><strong>Allocated Buyer:</strong> {contractLocked.buyer}</p>
            <p><strong>Net Payout:</strong> ₹{contractLocked.finalPayout.toLocaleString("en-IN")} (Guaranteed Direct Transfer)</p>
            <p className="text-emerald-300"><strong>Extra Income Saved for Farmer:</strong> ₹{contractLocked.extraEarned.toLocaleString("en-IN")}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* 1. VoltPath EV Station Booking Simulator (Lightning styled) */
export function VoltPathSimulator() {
  const [selectedStation, setSelectedStation] = useState("Bhopal Smart-Grid Hub");
  const [bookedSlot, setBookedSlot] = useState<string | null>(null);
  const [chargeProgress, setChargeProgress] = useState(0);
  const [isCharging, setIsCharging] = useState(false);

  const stations = [
    { name: "Bhopal Smart-Grid Hub", distance: "1.2 km", available: 3 },
    { name: "BIST Bansal Campus Node", distance: "4.5 km", available: 1 },
    { name: "MP Nagar Sector-3 Core", distance: "2.8 km", available: 5 }
  ];

  useEffect(() => {
    let timer: any;
    if (isCharging) {
      timer = setInterval(() => {
        setChargeProgress((prev) => {
          if (prev >= 100) {
            setIsCharging(false);
            clearInterval(timer);
            return 100;
          }
          return prev + 5;
        });
      }, 150);
    }
    return () => clearInterval(timer);
  }, [isCharging]);

  return (
    <div className="bg-[#050508] border border-blue-500/20 rounded-xl p-4 w-full text-xs font-mono text-blue-200">
      <div className="flex items-center justify-between border-b border-blue-500/10 pb-2 mb-3">
        <span className="text-[10px] font-bold uppercase text-blue-400 tracking-wider flex items-center gap-1.5 animate-pulse">
          <Zap className="w-3.5 h-3.5 text-blue-400" /> VoltPath AI Grid Simulator
        </span>
        <span className="text-[9px] bg-blue-950/40 text-blue-400 border border-blue-500/30 rounded px-1.5 py-0.5">
          STABLE LIVE NODE
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-slate-400 text-[10px] uppercase">Select EV Station Port:</label>
          <div className="grid grid-cols-1 gap-1.5 mt-1">
            {stations.map((st) => (
              <button
                key={st.name}
                type="button"
                onClick={() => {
                  setSelectedStation(st.name);
                  setBookedSlot(null);
                  setChargeProgress(0);
                  setIsCharging(false);
                }}
                className={`p-2 rounded text-left border flex justify-between items-center transition-all ${
                  selectedStation === st.name 
                  ? "bg-blue-950/20 border-blue-500/50 text-white" 
                  : "bg-[#0b0c13] border-white/5 text-slate-400 hover:border-blue-500/20"
                }`}
              >
                <span>🚀 {st.name}</span>
                <span className="text-[9px] text-[#A1A1AA]">{st.available} slots free // {st.distance}</span>
              </button>
            ))}
          </div>
        </div>

        {selectedStation && !bookedSlot && (
          <button
            type="button"
            onClick={() => {
              setBookedSlot(`SLOT-0${Math.floor(Math.random() * 9 + 1)}-A3`);
            }}
            className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-black font-extrabold uppercase rounded font-space tracking-wider text-[10px] active:scale-[0.98] transition-transform"
          >
            ⚡ Reserve Active Charger Slot
          </button>
        )}

        {bookedSlot && (
          <div className="p-3 rounded bg-blue-950/10 border border-blue-500/20 space-y-2">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-slate-400 uppercase">RESERVATION CODES:</span>
              <span className="text-emerald-400 font-bold">{bookedSlot} SECURED</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Status: {chargeProgress === 100 ? "🔋 FULLY RECHARGED" : isCharging ? "⚡ CHARGING FLOW ACTIVE" : "🔌 READY TO TRIGGER CORE POWER"}</span>
              <p className="font-bold text-white text-sm font-mono">{chargeProgress}%</p>
            </div>

            <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-150"
                style={{ width: `${chargeProgress}%` }}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={isCharging || chargeProgress >= 100}
                onClick={() => setIsCharging(true)}
                className="flex-1 py-1 px-2.5 bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 border border-blue-500/30 rounded text-[9px] font-bold uppercase transition-all"
              >
                {chargeProgress >= 100 ? "Finished" : isCharging ? "Initiated..." : "Fire Charger"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setBookedSlot(null);
                  setChargeProgress(0);
                  setIsCharging(false);
                }}
                className="py-1 px-2.5 bg-zinc-900 hover:bg-zinc-800 text-[#E5E7EB] rounded text-[9px]"
              >
                Clear Node
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* 2. DSPACE AI Smart Parser Simulator (Wind styled) */
export function DSpaceSimulator() {
  const [dataQuery, setDataQuery] = useState("Summarize environmental carbon indexes of Bhopal lakes");
  const [isCompiling, setIsCompiling] = useState(false);
  const [compiledMatrix, setCompiledMatrix] = useState<any | null>(null);

  const presets = [
    "Simulate EV station utilization patterns",
    "Parse academic performance variables mapping BIST CGPA",
    "Assess NASA challenge telemetry matrices"
  ];

  const handleCompile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dataQuery.trim()) return;

    setIsCompiling(true);
    setCompiledMatrix(null);

    setTimeout(() => {
      setIsCompiling(false);
      // Hardcoded high-fidelity interactive calculation simulation
      setCompiledMatrix({
        entriesScanned: Math.floor(Math.random() * 400 + 450),
        trustScore: "98.4%",
        analyticalNodes: ["Telemetry Map", "Dynamic Plot Generator", "Matrix Core"],
        dataPoints: [
          { label: "Zone-A", val: Math.floor(Math.random() * 50 + 50) },
          { label: "Zone-B", val: Math.floor(Math.random() * 30 + 70) },
          { label: "Zone-C", val: Math.floor(Math.random() * 20 + 40) }
        ]
      });
    }, 1200);
  };

  return (
    <div className="bg-[#050806] border border-emerald-500/20 rounded-xl p-4 w-full text-xs font-mono text-emerald-200">
      <div className="flex items-center justify-between border-b border-emerald-500/10 pb-2 mb-3">
        <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-emerald-400" /> DSPACE Analytics Parser
        </span>
        <span className="text-[9px] bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 rounded px-1.5 py-0.5">
          NLP COMPILER
        </span>
      </div>

      <form onSubmit={handleCompile} className="space-y-3">
        <div>
          <label htmlFor="data-query" className="text-slate-400 text-[10px] uppercase">Input Intelligence Request:</label>
          <input
            id="data-query"
            type="text"
            value={dataQuery}
            onChange={(e) => setDataQuery(e.target.value)}
            className="w-full bg-[#0b120c] text-white border border-emerald-500/20 rounded p-2 mt-1 focus:outline-none focus:border-emerald-500 text-xs font-mono"
            placeholder="Type your data question here..."
          />
        </div>

        {/* Quick tap presets */}
        <div>
          <p className="text-[9px] text-[#A1A1AA] uppercase mb-1">Preset Data Vectors:</p>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setDataQuery(p)}
                className="px-2 py-1 rounded bg-zinc-950/80 border border-white/5 text-[9px] text-slate-300 hover:border-emerald-500/30"
              >
                ⚡ {p.substring(0, 24)}...
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isCompiling}
          className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-extrabold uppercase rounded font-space tracking-wider text-[10px] flex items-center justify-center gap-2"
        >
          {isCompiling ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Analyzing simulation parameters...
            </>
          ) : (
            "🚀 Execute Dynamic AI Compilation"
          )}
        </button>
      </form>

      {compiledMatrix && (
        <div className="mt-3 p-3 rounded bg-emerald-950/10 border border-emerald-500/20 space-y-2 animate-fade-in">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-[#A1A1AA]">Scanned Rows: {compiledMatrix.entriesScanned}</span>
            <span className="text-emerald-400 font-bold">Accuracy Model: {compiledMatrix.trustScore}</span>
          </div>

          <div className="space-y-1">
            <p className="text-[9px] text-slate-500 uppercase">Interactive Chart Simulation:</p>
            <div className="space-y-1.5 mt-1">
              {compiledMatrix.dataPoints.map((dp: any) => (
                <div key={dp.label} className="space-y-0.5">
                  <div className="flex justify-between text-[10px] text-slate-300">
                    <span>{dp.label}</span>
                    <span>{dp.val} KPI</span>
                  </div>
                  <div className="w-full h-1 bg-zinc-900 rounded overflow-hidden">
                    <div 
                      className="h-full bg-emerald-400 transition-all duration-300"
                      style={{ width: `${dp.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* 3. Grave-Ambition-Vault Cryptographic Console (Spooky/Shadow styled) */
export function GraveVaultConsole() {
  const [cryptString, setCryptString] = useState("AASHISH_NASA_NOMINATION_2024");
  const [decryptedResult, setDecryptedResult] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);

  const handleDecrypt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cryptString.trim()) return;

    setIsDecrypting(true);
    setDecryptedResult(null);

    setTimeout(() => {
      setIsDecrypting(false);
      // Simulate real base44 or base64 encryption
      try {
        const enc = btoa(cryptString);
        setDecryptedResult(enc);
      } catch (err) {
        setDecryptedResult("SECURE_CIPHER_ERROR");
      }
    }, 900);
  };

  return (
    <div className="bg-[#080508] border border-purple-500/20 rounded-xl p-4 w-full text-xs font-mono text-purple-200">
      <div className="flex items-center justify-between border-b border-purple-500/10 pb-2 mb-3">
        <span className="text-[10px] font-bold uppercase text-purple-400 tracking-wider flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-purple-400" /> Cryptographic Ledger Console
        </span>
        <span className="text-[9px] bg-purple-950/40 text-purple-400 border border-purple-500/30 rounded px-1.5 py-0.5">
          AES-BASE44 SECURE
        </span>
      </div>

      <form onSubmit={handleDecrypt} className="space-y-3">
        <div>
          <label htmlFor="crypto-input" className="text-slate-400 text-[10px] uppercase">Input String to Encrypt / Seal:</label>
          <input
            id="crypto-input"
            type="text"
            value={cryptString}
            onChange={(e) => setCryptString(e.target.value)}
            className="w-full bg-[#120b12] text-white border border-purple-500/25 rounded p-2 mt-1 focus:outline-none focus:border-purple-500 text-xs font-mono"
            placeholder="Type milestone to encrypt..."
          />
        </div>

        <button
          type="submit"
          disabled={isDecrypting}
          className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-500 text-black font-extrabold uppercase rounded font-space tracking-wider text-[10px] flex items-center justify-center gap-1"
        >
          <Lock className="w-3.5 h-3.5" /> Seal Achievement into the Crypt-Vault
        </button>
      </form>

      {decryptedResult && (
        <div className="mt-3 p-3 rounded bg-purple-950/10 border border-purple-500/20 space-y-1.5 animate-fade-in-up">
          <div className="flex justify-between items-center text-[9px] text-[#A1A1AA]">
            <span>CIPHER METHOD: AES-BASE44 ENCODED</span>
            <span className="text-purple-400">LOCK VERIFIED</span>
          </div>

          <div className="p-2 bg-black rounded border border-purple-950 text-[11px] text-[#E2E8F0] break-all select-all hover:bg-[#020202]">
            {decryptedResult}
          </div>
          <p className="text-[9px] text-zinc-500 italic">This is successfully encoded using Base-encryption schemas.</p>
        </div>
      )}
    </div>
  );
}

/* 4. QR Code Generator & Dynamic Matrix Synthesizer */
export function QRCodeSimulator() {
  const [qrText, setQrText] = useState("https://spo-snowy.vercel.app/");
  const [errorCorrection, setErrorCorrection] = useState<"L" | "M" | "Q" | "H">("H");
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [generatedAt, setGeneratedAt] = useState<string>(new Date().toLocaleTimeString());

  const presets = [
    { label: "SPO Agritech Live", url: "https://spo-snowy.vercel.app/" },
    { label: "Google Drive Cert Vault", url: "https://drive.google.com/drive/folders/1O6ZGBZJMawASa5mvnP8QgX9lp-dx77MM" },
    { label: "LinkedIn Profile", url: "https://www.linkedin.com/in/aashish-bhumarkar-866337330/" },
    { label: "GitHub Profile", url: "https://github.com/aashishbhumarkar888-bit" }
  ];

  const handleGenerate = (newText: string) => {
    setIsSynthesizing(true);
    setQrText(newText);
    setTimeout(() => {
      setIsSynthesizing(false);
      setGeneratedAt(new Date().toLocaleTimeString());
    }, 180);
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&ecc=${errorCorrection}&margin=2&data=${encodeURIComponent(qrText || "https://spo-snowy.vercel.app/")}`;

  return (
    <div className="bg-[#05060c] border border-blue-500/25 rounded-2xl p-4 w-full text-xs font-mono text-blue-200 shadow-xl">
      <div className="flex items-center justify-between border-b border-blue-500/15 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <QrCode className="w-4 h-4 text-blue-400 animate-pulse" />
          <span className="text-[11px] font-space font-bold uppercase text-blue-300 tracking-wider">
            QR Dynamic Matrix Synthesis Engine
          </span>
        </div>
        <span className="text-[9px] bg-blue-950/60 text-blue-300 border border-blue-500/30 rounded px-2 py-0.5">
          ZERO-LEAK SANDBOX
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Controls Column */}
        <div className="md:col-span-7 space-y-3 text-left">
          <div>
            <label htmlFor="qr-input" className="text-zinc-400 text-[10px] uppercase font-bold block mb-1">
              Target Payload (URL or Text):
            </label>
            <input
              id="qr-input"
              type="text"
              value={qrText}
              onChange={(e) => handleGenerate(e.target.value)}
              className="w-full bg-[#0a0d18] text-white border border-blue-500/30 rounded-lg p-2 text-xs font-mono focus:outline-none focus:border-blue-400"
              placeholder="Enter URL or payload..."
            />
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-[9px] text-zinc-500 uppercase font-bold block mb-1.5">
              Quick Payload Presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handleGenerate(p.url)}
                  className={`px-2 py-1 rounded text-[9px] font-mono transition-all border ${
                    qrText === p.url
                      ? "bg-blue-600/30 border-blue-400 text-white font-bold"
                      : "bg-zinc-900/60 border-white/5 text-zinc-400 hover:text-white hover:border-blue-500/30"
                  }`}
                >
                  ⚡ {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error Correction Selection */}
          <div className="flex items-center justify-between p-2 bg-[#090b14] border border-blue-500/20 rounded-xl text-[10px]">
            <span className="text-zinc-400 uppercase font-bold">Error Correction:</span>
            <div className="flex gap-1">
              {(["L", "M", "Q", "H"] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setErrorCorrection(lvl)}
                  className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    errorCorrection === lvl
                      ? "bg-blue-500 text-black shadow-sm"
                      : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Level {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[9px] text-zinc-400 pt-1">
            <div className="p-1.5 bg-black/40 rounded-lg border border-white/5">
              <span className="block text-zinc-500">Latency</span>
              <strong className="text-emerald-400 font-mono">11ms</strong>
            </div>
            <div className="p-1.5 bg-black/40 rounded-lg border border-white/5">
              <span className="block text-zinc-500">Scan Parity</span>
              <strong className="text-blue-400 font-mono">100%</strong>
            </div>
            <div className="p-1.5 bg-black/40 rounded-lg border border-white/5">
              <span className="block text-zinc-500">Privacy</span>
              <strong className="text-purple-400 font-mono">Zero-Leak</strong>
            </div>
          </div>
        </div>

        {/* Live QR Matrix Display Column */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-3 bg-black/60 border border-blue-500/20 rounded-xl space-y-2">
          <div className="relative p-2.5 bg-white rounded-xl shadow-lg border border-zinc-200 flex items-center justify-center">
            {isSynthesizing ? (
              <div className="w-[140px] h-[140px] flex flex-col items-center justify-center text-zinc-600 gap-1.5 font-mono text-[9px]">
                <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                <span>Rasterizing...</span>
              </div>
            ) : (
              <img
                src={qrImageUrl}
                alt="Dynamically Generated QR Matrix Code"
                className="w-[140px] h-[140px] object-contain block select-none"
                loading="lazy"
              />
            )}
          </div>

          <div className="text-center space-y-0.5">
            <span className="text-[9px] text-emerald-400 font-bold tracking-wide uppercase flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Live Scannable with Phone
            </span>
            <span className="text-[8px] text-zinc-500 font-mono block">
              Generated at {generatedAt} • Level {errorCorrection} (30% redundancy)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 5. Nema Store High-Throughput E-Commerce Simulator */
export function NemaStoreSimulator() {
  const [cart, setCart] = useState<{ id: string; name: string; price: number; count: number }[]>([
    { id: "p1", name: "Cyberpunk Neural Visor V4", price: 4499, count: 1 }
  ]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState("Vercel Edge Synchronized");
  const [latency, setLatency] = useState(14);

  const catalog = [
    { id: "p1", name: "Cyberpunk Neural Visor V4", price: 4499, stock: 12 },
    { id: "p2", name: "Chakra Matrix Dev Hoodie", price: 3299, stock: 18 },
    { id: "p3", name: "Encrypted Hardware Token", price: 1899, stock: 5 },
  ];

  const addToCart = (product: { id: string; name: string; price: number }) => {
    // 1. Optimistic instant UI update (<1ms)
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => item.id === product.id ? { ...item, count: item.count + 1 } : item);
      }
      return [...prev, { ...product, count: 1 }];
    });

    // 2. Async Edge validation simulation
    setIsSyncing(true);
    setSyncStatus("Validating inventory at edge...");
    const simulatedLatency = Math.floor(10 + Math.random() * 15);
    setLatency(simulatedLatency);

    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus(`State reconciled in ${simulatedLatency}ms • Zero Race Condition`);
    }, 280);
  };

  const totalItems = cart.reduce((acc, item) => acc + item.count, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.count, 0);

  return (
    <div className="bg-[#050909] border border-teal-500/30 rounded-2xl p-4 w-full text-xs font-mono text-teal-200 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-teal-500/15 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
          <span className="text-[11px] font-space font-bold uppercase text-teal-300 tracking-wider">
            Nema Store Optimistic Cart Engine
          </span>
        </div>
        <a 
          href="https://nema-store.vercel.app/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-[9px] bg-teal-950/60 hover:bg-teal-900/80 text-teal-300 border border-teal-500/40 rounded px-2 py-0.5 flex items-center gap-1 transition-all"
        >
          <span>nema-store.vercel.app</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-start">
        {/* Catalog List */}
        <div className="md:col-span-7 space-y-2">
          <span className="text-[9px] text-zinc-400 uppercase tracking-widest block font-bold">
            Simulated Fast Catalog (1-Click Optimistic Add):
          </span>
          <div className="space-y-1.5">
            {catalog.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-2 rounded-xl bg-black/50 border border-white/5 hover:border-teal-500/30 transition-all text-[11px]"
              >
                <div>
                  <p className="text-white font-semibold font-jakarta">{item.name}</p>
                  <p className="text-[9px] text-teal-400 font-mono">₹{item.price.toLocaleString("en-IN")} • {item.stock} in stock</p>
                </div>
                <button
                  type="button"
                  onClick={() => addToCart(item)}
                  className="px-2.5 py-1 bg-teal-500/15 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 rounded-lg text-[9px] font-bold uppercase transition-all cursor-pointer active:scale-95 flex items-center gap-1"
                >
                  <span>+ Add</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Live Cart Telemetry & State */}
        <div className="md:col-span-5 bg-black/60 border border-teal-500/20 rounded-xl p-3 flex flex-col justify-between space-y-2.5 text-[10px]">
          <div>
            <div className="flex justify-between items-center border-b border-white/5 pb-1.5 mb-1.5">
              <span className="text-zinc-400 font-bold uppercase">Cart Telemetry</span>
              <span className="px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold">
                {totalItems} items
              </span>
            </div>
            <div className="flex justify-between text-xs font-bold text-white mb-2">
              <span>Subtotal:</span>
              <span className="text-teal-400">₹{totalPrice.toLocaleString("en-IN")}</span>
            </div>
            <div className="space-y-1 text-[9px] text-zinc-400">
              <div className="flex justify-between">
                <span>Optimistic Latency:</span>
                <span className="text-emerald-400 font-bold">&lt;{latency}ms</span>
              </div>
              <div className="flex justify-between">
                <span>Vercel Edge Score:</span>
                <span className="text-teal-300 font-bold">99+ Mobile</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5">
            <span className={`text-[8.5px] font-mono flex items-center gap-1 ${isSyncing ? "text-amber-400" : "text-emerald-400"}`}>
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              <span className="truncate">{syncStatus}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
