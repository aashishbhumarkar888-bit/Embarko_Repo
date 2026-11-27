/**
 * Cinematic Mythic Web Audio Synthesizer (100% Native Web Audio API)
 * Zero external audio files, zero harsh 8-bit square beeps.
 * Synthesizes deep stone hums, metallic forge chimes, spinning blade whooshes,
 * heavy catch thuds, and Nordic horn chords while honoring browser autoplay rules.
 */

class MythicAudioEngine {
  private ctx: AudioContext | null = null;
  private enabled = true;

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(next: boolean): void {
    this.enabled = next;
    if (next) {
      this.ensureContext();
      this.playClick();
      if (this.currentPadMood) {
        this.startAmbientPad(this.currentPadMood);
      }
    } else {
      this.stopIgniteCharge();
      this.stopAmbientPad(false);
    }
  }

  private ensureContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return null;
      try {
        this.ctx = new AudioCtx();
      } catch {
        return null;
      }
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /** Filtered warm oscillator voice helper */
  private playVoice(opts: {
    freq: number;
    endFreq?: number;
    duration: number;
    type?: OscillatorType;
    volume?: number;
    delay?: number;
    attack?: number;
    filterFreq?: number;
    filterEndFreq?: number;
  }): void {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime + (opts.delay ?? 0);
      const dur = opts.duration;
      const attack = Math.min(opts.attack ?? 0.015, dur * 0.4);
      const vol = opts.volume ?? 0.06;

      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = opts.type ?? "triangle";
      osc.frequency.setValueAtTime(opts.freq, now);
      if (opts.endFreq !== undefined) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(24, opts.endFreq), now + dur);
      }

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(opts.filterFreq ?? 2200, now);
      if (opts.filterEndFreq !== undefined) {
        filter.frequency.exponentialRampToValueAtTime(
          Math.max(120, opts.filterEndFreq),
          now + dur
        );
      }
      filter.Q.value = 1.2;

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(vol, now + attack);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + dur + 0.04);
    } catch {
      // Fail silently if audio output is restricted
    }
  }

  /** Filtered noise burst helper for cinematic air whooshes & stone impacts */
  private playNoise(opts: {
    duration: number;
    volume?: number;
    delay?: number;
    bandFreq?: number;
    bandEndFreq?: number;
    q?: number;
  }): void {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime + (opts.delay ?? 0);
      const dur = opts.duration;
      const sampleRate = ctx.sampleRate;
      const frameCount = Math.max(1, Math.floor(sampleRate * dur));
      const buffer = ctx.createBuffer(1, frameCount, sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < frameCount; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const src = ctx.createBufferSource();
      src.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(opts.bandFreq ?? 900, now);
      if (opts.bandEndFreq !== undefined) {
        filter.frequency.exponentialRampToValueAtTime(
          Math.max(80, opts.bandEndFreq),
          now + dur
        );
      }
      filter.Q.value = opts.q ?? 1.8;

      const gain = ctx.createGain();
      const vol = opts.volume ?? 0.05;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      src.start(now);
      src.stop(now + dur + 0.02);
    } catch {
      // Fail silently
    }
  }

  /** Subtle obsidian slate UI click */
  public playClick(): void {
    this.playVoice({
      freq: 360,
      endFreq: 520,
      duration: 0.065,
      type: "sine",
      volume: 0.045,
      filterFreq: 1600,
    });
  }

  /** Deep resonant stone hum + crystalline overtone on chapter/codex open */
  public playLevelChime(): void {
    this.playVoice({
      freq: 98,
      endFreq: 92,
      duration: 0.45,
      type: "triangle",
      volume: 0.075,
      attack: 0.05,
      filterFreq: 320,
    });
    this.playVoice({
      freq: 293.66, // D4
      duration: 0.34,
      type: "sine",
      volume: 0.045,
      delay: 0.04,
      filterFreq: 1400,
    });
    this.playVoice({
      freq: 440, // A4
      duration: 0.42,
      type: "sine",
      volume: 0.038,
      delay: 0.1,
      filterFreq: 1600,
    });
  }

  /** Low resonant stone hum when entering a new chapter or realm gate */
  public playChapterHum(): void {
    this.playVoice({
      freq: 73.42, // D2
      endFreq: 69,
      duration: 0.55,
      type: "sawtooth",
      volume: 0.045,
      attack: 0.08,
      filterFreq: 240,
      filterEndFreq: 140,
    });
    this.playVoice({
      freq: 146.83, // D3
      duration: 0.48,
      type: "triangle",
      volume: 0.05,
      attack: 0.06,
      filterFreq: 420,
    });
  }

  /** Crisp metallic rune socket / power-up equip ascending arpeggio */
  public playEquip(equipping: boolean): void {
    if (equipping) {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        this.playVoice({
          freq,
          duration: idx === notes.length - 1 ? 0.28 : 0.14,
          type: idx === 0 ? "triangle" : "sine",
          volume: 0.045,
          delay: idx * 0.04,
          filterFreq: 3000,
        });
      });
    } else {
      this.playVoice({
        freq: 340,
        endFreq: 190,
        duration: 0.15,
        type: "sine",
        volume: 0.045,
        filterFreq: 1000,
      });
    }
  }

  /** Tactile retro arcade blip when squashing a bug in Bonus Stage */
  public playBugSquash(combo = 1, isGolden = false): void {
    const pitchBoost = Math.min(combo, 12) * 32;
    const baseFreq = (isGolden ? 740 : 520) + pitchBoost;
    this.playVoice({
      freq: baseFreq,
      endFreq: baseFreq * 1.45,
      duration: 0.095,
      type: "triangle",
      volume: 0.06,
      attack: 0.006,
      filterFreq: 2800,
    });
    if (isGolden) {
      this.playVoice({
        freq: baseFreq * 1.5,
        endFreq: baseFreq * 2,
        duration: 0.14,
        type: "sine",
        volume: 0.045,
        delay: 0.045,
        filterFreq: 3400,
      });
    }
  }

  /** Crisp 3-note ready jingle when starting Bug Squasher Bonus Stage */
  public playBonusStart(): void {
    const notes = [440, 554.37, 659.25];
    notes.forEach((freq, idx) => {
      this.playVoice({
        freq,
        duration: 0.14,
        type: "triangle",
        volume: 0.05,
        delay: idx * 0.065,
        filterFreq: 2400,
      });
    });
  }

  /** Pleasant celebratory chime when Bug Squasher round completes */
  public playBonusFinish(isNewHighScore = false): void {
    const notes = isNewHighScore
      ? [523.25, 659.25, 783.99, 1046.5, 1318.5]
      : [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      this.playVoice({
        freq,
        duration: idx === notes.length - 1 ? 0.42 : 0.16,
        type: "triangle",
        volume: 0.05,
        delay: idx * 0.07,
        filterFreq: 2600,
      });
    });
  }

  /** Warm crystalline XP shimmer */
  public playXpPing(): void {
    this.playVoice({
      freq: 587.33,
      duration: 0.16,
      type: "sine",
      volume: 0.045,
      filterFreq: 2200,
    });
    this.playVoice({
      freq: 880,
      duration: 0.26,
      type: "triangle",
      volume: 0.04,
      delay: 0.07,
      filterFreq: 2600,
    });
  }

  /** Celebratory mythic harmonic cadence on MAX REALM */
  public playMaxLevelFanfare(): void {
    const chord = [293.66, 440, 587.33, 739.99, 880];
    chord.forEach((n, idx) => {
      this.playVoice({
        freq: n,
        duration: idx === chord.length - 1 ? 0.65 : 0.26,
        type: "triangle",
        volume: 0.05,
        delay: idx * 0.08,
        filterFreq: 2400,
      });
    });
  }

  /** Confirmation chord when contact transmission is sent */
  public playTransmission(): void {
    this.playVoice({ freq: 440, duration: 0.16, type: "sine", volume: 0.05, delay: 0 });
    this.playVoice({ freq: 587.33, duration: 0.2, type: "sine", volume: 0.05, delay: 0.09 });
    this.playVoice({ freq: 880, duration: 0.34, type: "triangle", volume: 0.05, delay: 0.18 });
  }

  /** Smooth frost-air dodge roll whoosh */
  public playDash(): void {
    this.playNoise({
      duration: 0.18,
      volume: 0.055,
      bandFreq: 1100,
      bandEndFreq: 260,
      q: 1.4,
    });
    this.playVoice({
      freq: 185,
      endFreq: 75,
      duration: 0.15,
      type: "triangle",
      volume: 0.055,
      filterFreq: 520,
    });
  }

  /** Time-dilation frost ring & golden critical chime on Perfect Dodge */
  public playPerfectDodge(): void {
    this.playVoice({
      freq: 165,
      endFreq: 48,
      duration: 0.36,
      type: "sine",
      volume: 0.1,
      attack: 0.01,
      filterFreq: 380,
    });
    [587.33, 880, 1174.66, 1567.98].forEach((freq, idx) => {
      this.playVoice({
        freq,
        endFreq: freq * 1.03,
        duration: 0.38,
        type: "sine",
        volume: 0.042,
        delay: idx * 0.032,
        filterFreq: 3600,
      });
    });
  }

  /** Metallic forge resonance & blade flourish */
  public playBladeSwing(): void {
    this.playNoise({
      duration: 0.16,
      volume: 0.045,
      bandFreq: 1400,
      bandEndFreq: 480,
      q: 2.2,
    });
    this.playVoice({
      freq: 523.25,
      endFreq: 510,
      duration: 0.28,
      type: "triangle",
      volume: 0.05,
      filterFreq: 2400,
    });
    this.playVoice({
      freq: 1046.5,
      duration: 0.34,
      type: "sine",
      volume: 0.032,
      delay: 0.02,
      filterFreq: 3200,
    });
  }

  /** Spinning Runic Blade throw whoosh */
  public playBladeThrow(): void {
    this.playNoise({
      duration: 0.26,
      volume: 0.06,
      bandFreq: 650,
      bandEndFreq: 1850,
      q: 2.4,
    });
    this.playVoice({
      freq: 260,
      endFreq: 680,
      duration: 0.14,
      type: "triangle",
      volume: 0.05,
      filterFreq: 1800,
    });
    this.playVoice({
      freq: 520,
      endFreq: 290,
      duration: 0.18,
      type: "sine",
      volume: 0.035,
      delay: 0.09,
      filterFreq: 1900,
    });
  }

  /** Frost-mint Blade Recall pull whistle */
  public playBladeRecall(): void {
    this.playNoise({
      duration: 0.24,
      volume: 0.055,
      bandFreq: 1600,
      bandEndFreq: 420,
      q: 2.8,
    });
    this.playVoice({
      freq: 380,
      endFreq: 880,
      duration: 0.2,
      type: "sine",
      volume: 0.045,
      filterFreq: 2400,
    });
  }

  /** Heavy satisfying thud when the recalled Runic Blade snaps into the hero's hand */
  public playBladeCatch(): void {
    this.playVoice({
      freq: 135,
      endFreq: 42,
      duration: 0.16,
      type: "sine",
      volume: 0.11,
      attack: 0.005,
      filterFreq: 320,
    });
    this.playVoice({
      freq: 820,
      endFreq: 540,
      duration: 0.12,
      type: "triangle",
      volume: 0.04,
      attack: 0.004,
      filterFreq: 2000,
    });
  }

  /** Resonant boss impact or shield shatter crunch */
  public playBossHit(isShieldBreak = false, isBlocked = false): void {
    if (isBlocked) {
      this.playVoice({
        freq: 920,
        endFreq: 640,
        duration: 0.14,
        type: "triangle",
        volume: 0.05,
        filterFreq: 2600,
      });
      return;
    }

    this.playVoice({
      freq: isShieldBreak ? 150 : 120,
      endFreq: 38,
      duration: isShieldBreak ? 0.34 : 0.2,
      type: "triangle",
      volume: isShieldBreak ? 0.11 : 0.08,
      attack: 0.006,
      filterFreq: 480,
    });

    if (isShieldBreak) {
      // Crystalline shatter chime
      [1174.66, 1479.98, 1760, 2217.46].forEach((freq, idx) => {
        this.playVoice({
          freq,
          endFreq: freq * 0.88,
          duration: 0.32,
          type: "sine",
          volume: 0.036,
          delay: idx * 0.035,
          filterFreq: 4000,
        });
      });
      this.playNoise({
        duration: 0.32,
        volume: 0.075,
        bandFreq: 2400,
        bandEndFreq: 700,
        q: 1.3,
      });
    } else {
      this.playVoice({
        freq: 420,
        endFreq: 210,
        duration: 0.14,
        type: "sine",
        volume: 0.045,
        filterFreq: 1400,
      });
    }
  }

  /** Heavy muffled impact when player takes damage */
  public playPlayerHit(): void {
    this.playVoice({
      freq: 105,
      endFreq: 36,
      duration: 0.24,
      type: "sawtooth",
      volume: 0.075,
      attack: 0.005,
      filterFreq: 280,
      filterEndFreq: 90,
    });
    this.playNoise({
      duration: 0.16,
      volume: 0.05,
      bandFreq: 380,
      bandEndFreq: 120,
      q: 1.0,
    });
  }

  /** Deep cinematic God of War-style Nordic horn brass chord on Boss defeat */
  public playNordicHornFanfare(): void {
    // Deep shatter boom first
    this.playVoice({
      freq: 92,
      endFreq: 30,
      duration: 0.7,
      type: "sine",
      volume: 0.13,
      attack: 0.01,
      filterFreq: 220,
    });
    this.playNoise({
      duration: 0.55,
      volume: 0.07,
      bandFreq: 1100,
      bandEndFreq: 220,
      q: 0.9,
    });

    // Warm layered Nordic D-major / D5 brass horn swell (D2, A2, D3, F#3, A3)
    const hornNotes = [
      { freq: 73.42, vol: 0.075, delay: 0.15, dur: 1.75 },
      { freq: 110.0, vol: 0.06, delay: 0.22, dur: 1.65 },
      { freq: 146.83, vol: 0.055, delay: 0.3, dur: 1.55 },
      { freq: 185.0, vol: 0.04, delay: 0.48, dur: 1.35 },
      { freq: 220.0, vol: 0.045, delay: 0.56, dur: 1.3 },
    ];

    hornNotes.forEach((n) => {
      this.playVoice({
        freq: n.freq,
        duration: n.dur,
        type: "sawtooth",
        volume: n.vol,
        delay: n.delay,
        attack: 0.22,
        filterFreq: 540,
        filterEndFreq: 260,
      });
      this.playVoice({
        freq: n.freq * 2,
        duration: n.dur * 0.9,
        type: "triangle",
        volume: n.vol * 0.35,
        delay: n.delay + 0.04,
        attack: 0.24,
        filterFreq: 980,
      });
    });
  }

  /** Deep AAA PlayStation-style Nordic sub-bass swell + crystalline Bifröst rift */
  public playBifrostRift(): void {
    // Deep sub-bass tectonic drop
    this.playVoice({
      freq: 68,
      endFreq: 32,
      duration: 1.55,
      type: "sine",
      volume: 0.16,
      attack: 0.18,
      filterFreq: 180,
    });
    // Low Nordic horn fifth swell (D2 + A2 + D3)
    this.playVoice({
      freq: 73.42,
      endFreq: 71,
      duration: 1.45,
      type: "sawtooth",
      volume: 0.065,
      attack: 0.24,
      filterFreq: 360,
      filterEndFreq: 150,
    });
    this.playVoice({
      freq: 110,
      duration: 1.35,
      type: "triangle",
      volume: 0.055,
      delay: 0.08,
      attack: 0.22,
      filterFreq: 520,
    });
    // Filtered wind-rift expansion sweep
    this.playNoise({
      duration: 1.25,
      volume: 0.075,
      bandFreq: 260,
      bandEndFreq: 2200,
      q: 1.2,
    });
    // Ethereal frost-gold shimmer harmonics
    [587.33, 880, 1174.66].forEach((freq, idx) => {
      this.playVoice({
        freq,
        duration: 0.9,
        type: "sine",
        volume: 0.032,
        delay: 0.18 + idx * 0.08,
        attack: 0.12,
        filterFreq: 3200,
      });
    });
  }

  /** Forward 3D warp-tunnel rush when transitioning between Story Mode Acts */
  public playActWarp(): void {
    this.playNoise({
      duration: 0.72,
      volume: 0.06,
      bandFreq: 320,
      bandEndFreq: 1800,
      q: 1.5,
    });
    this.playVoice({
      freq: 92,
      endFreq: 54,
      duration: 0.65,
      type: "triangle",
      volume: 0.09,
      attack: 0.05,
      filterFreq: 340,
    });
    this.playVoice({
      freq: 440,
      endFreq: 659.25,
      duration: 0.42,
      type: "sine",
      volume: 0.035,
      delay: 0.08,
      filterFreq: 2400,
    });
  }

  /** Resonant metallic steel-ring chord on Act I Perfect Parry */
  public playParrySteelRing(combo = 1): void {
    const pitchScale = 1 + Math.min(combo, 8) * 0.035;
    // Heavy kinetic bass thump
    this.playVoice({
      freq: 145,
      endFreq: 40,
      duration: 0.24,
      type: "sine",
      volume: 0.13,
      attack: 0.004,
      filterFreq: 340,
    });
    // Crisp metallic sword-clang overtones (inharmonic steel ring + crystalline fifth)
    const partials = [
      { freq: 587.33 * pitchScale, dur: 0.48, vol: 0.055, type: "triangle" as OscillatorType, delay: 0 },
      { freq: 880 * pitchScale, dur: 0.56, vol: 0.048, type: "sine" as OscillatorType, delay: 0.01 },
      { freq: 1318.5 * pitchScale, dur: 0.62, vol: 0.038, type: "sine" as OscillatorType, delay: 0.018 },
      { freq: 1760 * pitchScale, dur: 0.5, vol: 0.028, type: "sine" as OscillatorType, delay: 0.025 },
      { freq: 2489 * pitchScale, dur: 0.34, vol: 0.018, type: "triangle" as OscillatorType, delay: 0.012 },
    ];
    partials.forEach((p) => {
      this.playVoice({
        freq: p.freq,
        endFreq: p.freq * 0.992,
        duration: p.dur,
        type: p.type,
        volume: p.vol,
        delay: p.delay,
        attack: 0.004,
        filterFreq: 4800,
      });
    });
    // High-energy spark burst noise
    this.playNoise({
      duration: 0.16,
      volume: 0.065,
      bandFreq: 2900,
      bandEndFreq: 1100,
      q: 2.2,
    });
  }

  /** Jagged crimson impact crunch when a Logic Spear breaches the Aegis Core */
  public playParryMiss(): void {
    this.playVoice({
      freq: 112,
      endFreq: 38,
      duration: 0.32,
      type: "sawtooth",
      volume: 0.09,
      attack: 0.005,
      filterFreq: 320,
      filterEndFreq: 85,
    });
    this.playVoice({
      freq: 185,
      endFreq: 125,
      duration: 0.22,
      type: "sawtooth",
      volume: 0.045,
      delay: 0.02,
      filterFreq: 680,
    });
    this.playNoise({
      duration: 0.24,
      volume: 0.075,
      bandFreq: 650,
      bandEndFreq: 140,
      q: 1.1,
    });
  }

  /** Heroic ascending milestone banner chime in Act I (4 DSA unlocks) */
  public playMilestoneUnlock(stageIndex = 1): void {
    const base = 293.66 * (1 + stageIndex * 0.08);
    const notes = [base, base * 1.25, base * 1.5, base * 2];
    notes.forEach((freq, idx) => {
      this.playVoice({
        freq,
        duration: idx === notes.length - 1 ? 0.62 : 0.24,
        type: idx === 0 ? "triangle" : "sine",
        volume: 0.055,
        delay: idx * 0.06,
        attack: 0.012,
        filterFreq: 3400,
      });
    });
  }

  /** High-velocity golden warp flythrough rush (Act I -> Act II) */
  public playGoldWarpFlythrough(): void {
    this.playVoice({
      freq: 73.42,
      endFreq: 146.83,
      duration: 1.35,
      type: "sawtooth",
      volume: 0.065,
      attack: 0.2,
      filterFreq: 240,
      filterEndFreq: 1100,
    });
    this.playNoise({
      duration: 1.4,
      volume: 0.085,
      bandFreq: 220,
      bandEndFreq: 3200,
      q: 1.35,
    });
    [440, 659.25, 880, 1174.66, 1318.5].forEach((freq, idx) => {
      this.playVoice({
        freq,
        endFreq: freq * 1.18,
        duration: 0.8,
        type: "sine",
        volume: 0.032,
        delay: 0.14 + idx * 0.08,
        attack: 0.09,
        filterFreq: 3800,
      });
    });
  }

  // Continuous ascending charge synth nodes for Act II 1.2s Hold-to-Ignite
  private chargeOscA: OscillatorNode | null = null;
  private chargeOscB: OscillatorNode | null = null;
  private chargeFilter: BiquadFilterNode | null = null;
  private chargeGain: GainNode | null = null;

  /** Begin ascending harmonic charge hum while holding IGNITE THE ARTIFACT */
  public startIgniteCharge(): void {
    this.stopIgniteCharge();
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const oscA = ctx.createOscillator();
      const oscB = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      oscA.type = "sawtooth";
      oscA.frequency.setValueAtTime(110, now);

      oscB.type = "triangle";
      oscB.frequency.setValueAtTime(165, now);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(280, now);
      filter.Q.value = 3.2;

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.055, now + 0.12);

      oscA.connect(filter);
      oscB.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      oscA.start(now);
      oscB.start(now);

      this.chargeOscA = oscA;
      this.chargeOscB = oscB;
      this.chargeFilter = filter;
      this.chargeGain = gain;
    } catch {
      // Fail silently
    }
  }

  /** Smoothly pitch-shift the active ignite charge synth from 0..1 */
  public updateIgniteCharge(progress: number): void {
    if (!this.ctx || !this.chargeOscA || !this.chargeOscB || !this.chargeFilter || !this.chargeGain) {
      return;
    }
    try {
      const p = Math.max(0, Math.min(1, progress));
      const now = this.ctx.currentTime;
      const freqA = 110 + p * p * 440;
      const freqB = freqA * 1.5;
      this.chargeOscA.frequency.setTargetAtTime(freqA, now, 0.03);
      this.chargeOscB.frequency.setTargetAtTime(freqB, now, 0.03);
      this.chargeFilter.frequency.setTargetAtTime(280 + p * 3200, now, 0.03);
      this.chargeGain.gain.setTargetAtTime(0.05 + p * 0.065, now, 0.03);
    } catch {
      // Fail silently
    }
  }

  /** Cleanly release/stop the ignite charge synth */
  public stopIgniteCharge(): void {
    const oscA = this.chargeOscA;
    const oscB = this.chargeOscB;
    const gain = this.chargeGain;
    this.chargeOscA = null;
    this.chargeOscB = null;
    this.chargeFilter = null;
    this.chargeGain = null;

    if (!this.ctx || !gain || !oscA || !oscB) return;
    try {
      const now = this.ctx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setTargetAtTime(0.0001, now, 0.035);
      oscA.stop(now + 0.14);
      oscB.stop(now + 0.14);
    } catch {
      // Already stopped
    }
  }

  /** Blinding crystalline shockwave detonation when an Act II Artifact reaches 100% */
  public playArtifactDetonate(): void {
    this.stopIgniteCharge();
    // Sub-bass shockwave boom
    this.playVoice({
      freq: 130,
      endFreq: 30,
      duration: 0.85,
      type: "sine",
      volume: 0.16,
      attack: 0.008,
      filterFreq: 260,
    });
    // Radiant crystal chime bloom
    const chord = [523.25, 659.25, 783.99, 1046.5, 1567.98];
    chord.forEach((freq, idx) => {
      this.playVoice({
        freq,
        endFreq: freq * 1.01,
        duration: 0.95,
        type: idx < 2 ? "triangle" : "sine",
        volume: 0.048 - idx * 0.005,
        delay: 0.02 + idx * 0.03,
        attack: 0.015,
        filterFreq: 4200,
      });
    });
    // Wide pastel shockwave sweep
    this.playNoise({
      duration: 0.65,
      volume: 0.085,
      bandFreq: 2600,
      bandEndFreq: 320,
      q: 1.0,
    });
  }

  /** Act II -> Act III Plot Twist: abrupt cutoff into eerie volcanic sub-bass rumble & crack */
  public playPlotTwistRumble(): void {
    this.stopIgniteCharge();
    // Sharp fracture snap
    this.playNoise({
      duration: 0.22,
      volume: 0.1,
      bandFreq: 1850,
      bandEndFreq: 260,
      q: 1.4,
    });
    // Ominous low volcanic rumble (D1 + Ab1 tritone dread)
    this.playVoice({
      freq: 46,
      endFreq: 28,
      duration: 1.75,
      type: "sawtooth",
      volume: 0.12,
      delay: 0.06,
      attack: 0.18,
      filterFreq: 165,
      filterEndFreq: 95,
    });
    this.playVoice({
      freq: 65.4,
      endFreq: 61.7,
      duration: 1.65,
      type: "sawtooth",
      volume: 0.065,
      delay: 0.12,
      attack: 0.25,
      filterFreq: 260,
      filterEndFreq: 110,
    });
    // Secondary obsidian crackle
    this.playNoise({
      duration: 0.45,
      volume: 0.075,
      delay: 0.42,
      bandFreq: 1200,
      bandEndFreq: 180,
      q: 2.2,
    });
    // Distant dark war horn warning
    this.playVoice({
      freq: 92.5,
      endFreq: 87.3,
      duration: 1.25,
      type: "triangle",
      volume: 0.07,
      delay: 0.55,
      attack: 0.2,
      filterFreq: 360,
    });
  }

  // Continuous low-volume cinematic ambient pad nodes per Act
  private padOscA: OscillatorNode | null = null;
  private padOscB: OscillatorNode | null = null;
  private padOscC: OscillatorNode | null = null;
  private padFilter: BiquadFilterNode | null = null;
  private padGain: GainNode | null = null;
  private currentPadMood: "storm" | "forge" | "crucible" | "dawn" | null = null;

  /** Start or morph moody low-volume ambient soundtrack pad for the active Act */
  public startAmbientPad(mood: "storm" | "forge" | "crucible" | "dawn"): void {
    this.currentPadMood = mood;
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    // Harmonic voicings tuned to D (non-intrusive warm sub-pad)
    const chords: Record<
      "storm" | "forge" | "crucible" | "dawn",
      { a: number; b: number; c: number; filter: number; vol: number }
    > = {
      storm: { a: 73.42, b: 110.0, c: 174.61, filter: 320, vol: 0.022 }, // D minor brooding
      forge: { a: 73.42, b: 110.0, c: 164.81, filter: 420, vol: 0.022 }, // D sus2 cosmic
      crucible: { a: 65.41, b: 98.0, c: 155.56, filter: 280, vol: 0.026 }, // C minor volcanic tension
      dawn: { a: 73.42, b: 110.0, c: 185.0, filter: 620, vol: 0.026 }, // D major serene golden dawn
    };
    const cfg = chords[mood];

    try {
      const now = ctx.currentTime;
      if (this.padOscA && this.padOscB && this.padOscC && this.padFilter && this.padGain) {
        this.padOscA.frequency.setTargetAtTime(cfg.a, now, 0.45);
        this.padOscB.frequency.setTargetAtTime(cfg.b, now, 0.45);
        this.padOscC.frequency.setTargetAtTime(cfg.c, now, 0.45);
        this.padFilter.frequency.setTargetAtTime(cfg.filter, now, 0.45);
        this.padGain.gain.setTargetAtTime(cfg.vol, now, 0.35);
        return;
      }

      const oscA = ctx.createOscillator();
      const oscB = ctx.createOscillator();
      const oscC = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      oscA.type = "sine";
      oscA.frequency.setValueAtTime(cfg.a, now);

      oscB.type = "triangle";
      oscB.frequency.setValueAtTime(cfg.b, now);
      oscB.detune.setValueAtTime(4, now);

      oscC.type = "sine";
      oscC.frequency.setValueAtTime(cfg.c, now);
      oscC.detune.setValueAtTime(-4, now);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(cfg.filter, now);
      filter.Q.value = 0.8;

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(cfg.vol, now + 0.9);

      oscA.connect(filter);
      oscB.connect(filter);
      oscC.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      oscA.start(now);
      oscB.start(now);
      oscC.start(now);

      this.padOscA = oscA;
      this.padOscB = oscB;
      this.padOscC = oscC;
      this.padFilter = filter;
      this.padGain = gain;
    } catch {
      // Fail silently
    }
  }

  /** Cleanly fade out and release the ambient pad */
  public stopAmbientPad(clearMood = true): void {
    if (clearMood) {
      this.currentPadMood = null;
    }
    const oscA = this.padOscA;
    const oscB = this.padOscB;
    const oscC = this.padOscC;
    const gain = this.padGain;
    this.padOscA = null;
    this.padOscB = null;
    this.padOscC = null;
    this.padFilter = null;
    this.padGain = null;

    if (!this.ctx || !gain || !oscA || !oscB || !oscC) return;
    try {
      const now = this.ctx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setTargetAtTime(0.0001, now, 0.08);
      oscA.stop(now + 0.32);
      oscB.stop(now + 0.32);
      oscC.stop(now + 0.32);
    } catch {
      // Already stopped
    }
  }

  /** QTE Finisher: Frost-gold lightning bolt slam + ascending Nordic synth brass */
  public playQteLightningSlam(charge: number): void {
    const p = Math.max(0, Math.min(1, charge));
    const brassFreq = 146.83 * (1 + p * 0.85);
    // Crackling lightning snap
    this.playNoise({
      duration: 0.14,
      volume: 0.075 + p * 0.035,
      bandFreq: 2600 + p * 1400,
      bandEndFreq: 680,
      q: 1.9,
    });
    // Heavy sub-punch
    this.playVoice({
      freq: 120 + p * 45,
      endFreq: 38,
      duration: 0.22,
      type: "sine",
      volume: 0.12 + p * 0.04,
      attack: 0.004,
      filterFreq: 340,
    });
    // Ascending Nordic brass fifth
    this.playVoice({
      freq: brassFreq,
      endFreq: brassFreq * 1.04,
      duration: 0.28,
      type: "sawtooth",
      volume: 0.055 + p * 0.025,
      attack: 0.012,
      filterFreq: 750 + p * 1600,
    });
    this.playVoice({
      freq: brassFreq * 1.5,
      duration: 0.26,
      type: "triangle",
      volume: 0.04,
      delay: 0.015,
      filterFreq: 1800 + p * 1800,
    });
  }

  /** Blinding White-Gold Supernova Boss Finisher Explosion */
  public playSupernovaExplosion(): void {
    // Massive tectonic slow-motion shockwave boom
    this.playVoice({
      freq: 140,
      endFreq: 24,
      duration: 1.85,
      type: "sine",
      volume: 0.18,
      attack: 0.008,
      filterFreq: 260,
    });
    this.playNoise({
      duration: 1.45,
      volume: 0.11,
      bandFreq: 2200,
      bandEndFreq: 180,
      q: 0.85,
    });
    // Crystalline obsidian shatter cascade
    [1174.66, 1479.98, 1760, 2349.32, 2959.96].forEach((freq, idx) => {
      this.playVoice({
        freq,
        endFreq: freq * 0.92,
        duration: 0.72,
        type: "sine",
        volume: 0.036,
        delay: 0.03 + idx * 0.045,
        attack: 0.01,
        filterFreq: 4800,
      });
    });
    // Sweeping golden heroic brass bloom
    [73.42, 110, 146.83, 220, 293.66].forEach((freq, idx) => {
      this.playVoice({
        freq,
        duration: 2.1,
        type: idx < 2 ? "sawtooth" : "triangle",
        volume: 0.055 - idx * 0.005,
        delay: 0.18 + idx * 0.05,
        attack: 0.28,
        filterFreq: 680 + idx * 240,
      });
    });
  }

  /** Act IV Golden Dawn: Deep emotional triumphant warm pad chord */
  public playDawnTriumphChord(): void {
    const notes = [146.83, 220.0, 293.66, 369.99, 440.0, 587.33]; // Dmaj9
    notes.forEach((freq, idx) => {
      this.playVoice({
        freq,
        duration: 2.8,
        type: idx < 2 ? "triangle" : "sine",
        volume: 0.038 - idx * 0.003,
        delay: idx * 0.09,
        attack: 0.45,
        filterFreq: 1800,
      });
    });
  }
}

export const retroAudio = new MythicAudioEngine();

