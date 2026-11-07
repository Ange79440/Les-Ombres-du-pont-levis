// Mirrors backend/models/save.py — keep in sync by hand.
export type SceneId = "path" | "house" | "drawbridge" | "hall" | "alchemy" | "astronomy" | "crypt";

export interface Clue {
  id: string;
  title: string;
  text: string;
  scene: SceneId;
}

export interface GameState {
  player_name: string;
  scene: SceneId;
  x: number;
  y: number;
  inventory: string[];
  solved: string[];
  clues: Clue[];
  drawbridge_lowered: boolean;
  completed: boolean;
}

export interface SaveGame extends GameState {
  slot: number;
  updated_at: string;
}

export type ToolId = "infrared" | "camera";
export type Facing = "up" | "down" | "left" | "right";

import { useEffect, useRef } from "react";

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private eventTimer: number | null = null;
  private secondaryTimer: number | null = null;
  private currentScene: SceneId | null = null;
  private muted = false;

  private init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioCtx();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.muted ? 0 : 0.35;
    this.masterGain.connect(this.ctx.destination);

    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }

    this.noiseSource = this.ctx.createBufferSource();
    this.noiseSource.buffer = buffer;
    this.noiseSource.loop = true;

    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = "bandpass";
    this.filterNode.frequency.value = 300;
    this.filterNode.Q.value = 2.5;

    this.noiseSource.connect(this.filterNode);
    this.filterNode.connect(this.masterGain);
    this.noiseSource.start();
  }

  public setMuted(mute: boolean) {
    this.muted = mute;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(mute ? 0 : 0.35, this.ctx.currentTime, 0.2);
    }
  }

  private clearTimers() {
    if (this.eventTimer) {
      window.clearTimeout(this.eventTimer);
      this.eventTimer = null;
    }
    if (this.secondaryTimer) {
      window.clearInterval(this.secondaryTimer);
      this.secondaryTimer = null;
    }
  }

  public playScene(scene: SceneId) {
    this.init();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    if (this.currentScene === scene) return;
    this.currentScene = scene;
    this.clearTimers();

    if (!this.filterNode || !this.ctx) return;
    const now = this.ctx.currentTime;

    // --- CHAPITRE I ---
    if (scene === "path") {
      this.filterNode.type = "lowpass";
      this.filterNode.frequency.setTargetAtTime(210, now, 0.8);
      this.filterNode.Q.setTargetAtTime(1.2, now, 0.8);
      this.scheduleOwl();
    } else if (scene === "house") {
      this.filterNode.type = "lowpass";
      this.filterNode.frequency.setTargetAtTime(95, now, 0.8);
      this.filterNode.Q.setTargetAtTime(0.8, now, 0.8);
      this.scheduleClockTick();
      this.scheduleFireCrackle();
    } else if (scene === "drawbridge") {
      this.filterNode.type = "lowpass";
      this.filterNode.frequency.setTargetAtTime(240, now, 0.8);
      this.filterNode.Q.setTargetAtTime(1.8, now, 0.8);
      this.scheduleChainClink();
    } else if (scene === "hall") {
      this.filterNode.type = "bandpass";
      this.filterNode.frequency.setTargetAtTime(140, now, 0.8);
      this.filterNode.Q.setTargetAtTime(3.0, now, 0.8);
    } else if (scene === "alchemy") {
      this.filterNode.type = "lowpass";
      this.filterNode.frequency.setTargetAtTime(110, now, 0.8);
      this.filterNode.Q.setTargetAtTime(1.0, now, 0.8);
      this.scheduleBubbles();
    } else if (scene === "astronomy") {
      this.filterNode.type = "bandpass";
      this.filterNode.frequency.setTargetAtTime(380, now, 0.8);
      this.filterNode.Q.setTargetAtTime(4.0, now, 0.8);
      this.scheduleStarChime();
    } else if (scene === "crypt") {
      this.filterNode.type = "lowpass";
      this.filterNode.frequency.setTargetAtTime(70, now, 0.8);
      this.filterNode.Q.setTargetAtTime(2.0, now, 0.8);
      this.scheduleWaterDrop();
    }
    // --- CHAPITRE II ---
    else if (scene === "ramparts") {
      this.filterNode.type = "bandpass";
      this.filterNode.frequency.setTargetAtTime(480, now, 0.8);
      this.filterNode.Q.setTargetAtTime(5.5, now, 0.8);
      this.scheduleWindGusts();
    } else if (scene === "cemetery") {
      this.filterNode.type = "lowpass";
      this.filterNode.frequency.setTargetAtTime(220, now, 0.8);
      this.filterNode.Q.setTargetAtTime(1.5, now, 0.8);
      this.scheduleCrow();
    } else if (scene === "forest") {
      this.filterNode.type = "bandpass";
      this.filterNode.frequency.setTargetAtTime(650, now, 0.8);
      this.filterNode.Q.setTargetAtTime(1.8, now, 0.8);
      this.scheduleCreak();
    } else if (scene === "garden") {
      this.filterNode.type = "lowpass";
      this.filterNode.frequency.setTargetAtTime(180, now, 0.8);
      this.filterNode.Q.setTargetAtTime(1.0, now, 0.8);
    }
  }

  // --- BRUITAGES CHAPITRE I ---
  private scheduleOwl() {
    if (this.currentScene !== "path") return;
    if (this.ctx && this.masterGain && !this.muted) {
      const now = this.ctx.currentTime;
      const hoot = (delay: number, dur: number, freq: number) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + delay);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.85, now + delay + dur);
        gain.gain.setValueAtTime(0.001, now + delay);
        gain.gain.linearRampToValueAtTime(0.14, now + delay + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + dur);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + delay);
        osc.stop(now + delay + dur + 0.05);
      };
      hoot(0, 0.35, 390);
      hoot(0.55, 0.55, 350);
    }
    this.eventTimer = window.setTimeout(() => this.scheduleOwl(), 7000 + Math.random() * 6000);
  }

  private scheduleClockTick() {
    let high = true;
    this.secondaryTimer = window.setInterval(() => {
      if (this.currentScene !== "house" || !this.ctx || !this.masterGain || this.muted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(high ? 820 : 640, now);
      high = !high;
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.05);
    }, 1000);
  }

  private scheduleFireCrackle() {
    if (this.currentScene !== "house") return;
    if (this.ctx && this.masterGain && !this.muted) {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(140 + Math.random() * 220, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.04);
    }
    this.eventTimer = window.setTimeout(() => this.scheduleFireCrackle(), 400 + Math.random() * 1400);
  }

  private scheduleChainClink() {
    if (this.currentScene !== "drawbridge") return;
    if (this.ctx && this.masterGain && !this.muted) {
      const now = this.ctx.currentTime;
      [0, 0.14].forEach((offset, i) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(i === 0 ? 290 : 210, now + offset);
        gain.gain.setValueAtTime(0.09, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.12);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + offset);
        osc.stop(now + offset + 0.13);
      });
    }
    this.eventTimer = window.setTimeout(() => this.scheduleChainClink(), 5000 + Math.random() * 5000);
  }

  private scheduleBubbles() {
    if (this.currentScene !== "alchemy") return;
    if (this.ctx && this.masterGain && !this.muted) {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      const base = 260 + Math.random() * 180;
      osc.frequency.setValueAtTime(base, now);
      osc.frequency.exponentialRampToValueAtTime(base * 1.75, now + 0.11);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.13);
    }
    this.eventTimer = window.setTimeout(() => this.scheduleBubbles(), 600 + Math.random() * 1600);
  }

  private scheduleStarChime() {
    if (this.currentScene !== "astronomy") return;
    if (this.ctx && this.masterGain && !this.muted) {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      const freq = notes[Math.floor(Math.random() * notes.length)];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.09, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 1.5);
    }
    this.eventTimer = window.setTimeout(() => this.scheduleStarChime(), 4500 + Math.random() * 4500);
  }

  private scheduleWaterDrop() {
    if (this.currentScene !== "crypt") return;
    if (this.ctx && this.masterGain && !this.muted) {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(750, now);
    osc.frequency.exponentialRampToValueAtTime(1250, now + 0.08);
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.16);
    }
    this.eventTimer = window.setTimeout(() => this.scheduleWaterDrop(), 3500 + Math.random() * 4000);
    }
    // --- BRUITAGES CHAPITRE II ---
    private scheduleWindGusts() {
    if (this.currentScene !== "ramparts" || !this.ctx || !this.filterNode) return;
    const now = this.ctx.currentTime;
    const targetFreq = 350 + Math.random() * 450;
    this.filterNode.frequency.exponentialRampToValueAtTime(targetFreq, now + 2.5);
    this.eventTimer = window.setTimeout(() => this.scheduleWindGusts(), 3000 + Math.random() * 3000);
    }
    private triggerCrowSound() {
    if (!this.ctx || !this.masterGain || this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(620 + Math.random() * 80, now);
    osc.frequency.exponentialRampToValueAtTime(340, now + 0.35);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.4);
    }
    private scheduleCrow() {
    if (this.currentScene !== "cemetery") return;
    this.triggerCrowSound();
    if (Math.random() > 0.45) {
    window.setTimeout(() => this.triggerCrowSound(), 480);
    }
    this.eventTimer = window.setTimeout(() => this.scheduleCrow(), 5500 + Math.random() * 6500);
    }
    private triggerWoodCreak() {
    if (!this.ctx || !this.masterGain || this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    const startFreq = 110 + Math.random() * 70;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.linearRampToValueAtTime(startFreq * 0.65, now + 0.18);
    osc.frequency.linearRampToValueAtTime(startFreq * 1.15, now + 0.35);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.28, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.45);
    }
    private scheduleCreak() {
    if (this.currentScene !== "forest") return;
    this.triggerWoodCreak();
    this.eventTimer = window.setTimeout(() => this.scheduleCreak(), 4000 + Math.random() * 5000);
    }
    }
    export const ambientAudio = new AmbientAudioEngine();
    export function useSceneAmbience(scene: SceneId, muted: boolean) {
    const started = useRef(false);
    useEffect(() => {
    ambientAudio.setMuted(muted);
    }, [muted]);
    useEffect(() => {
    const startAudio = () => {
    started.current = true;
    ambientAudio.playScene(scene);
    };
    if (started.current) {
    ambientAudio.playScene(scene);
    }
    window.addEventListener("keydown", startAudio, { once: true });
    window.addEventListener("pointerdown", startAudio, { once: true });
    return () => {
    window.removeEventListener("keydown", startAudio);
    window.removeEventListener("pointerdown", startAudio);
    };
    }, [scene]);
    }