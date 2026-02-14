import { settings } from "./settings.js";

/**
 * Control compartido de la música de fondo (song + forest).
 * Pausar/reanudar desde walk cuando el juego está en pausa.
 */
export const bgMusic = {
  song: null,
  forest: { source: null, startTime: 0 },
  paused: false,

  applyMute() {
    if (this.song) this.song.paused = settings.songMuted;
    if (settings.forestMuted && this.forest?.source) {
      if (typeof audioCtx !== "undefined") {
        const offset = (audioCtx.currentTime - this.forest.startTime) % (this.forest.source.buffer?.duration ?? 1);
        this.forest.pausedAt = offset;
      }
      this.forest.source.stop();
      this.forest.source = null;
    } else if (!settings.forestMuted && this.forest?.pausedAt != null && !this.paused) {
      const forest = getSound("forest");
      if (forest?.data?.buf && audioCtx) {
        const src = audioCtx.createBufferSource();
        src.buffer = forest.data.buf;
        src.loop = true;
        const panner = audioCtx.createStereoPanner();
        panner.pan.value = -0.4;
        const gain = audioCtx.createGain();
        gain.gain.value = 0.05;
        src.connect(panner).connect(gain).connect(audioCtx.destination);
        src.start(0, this.forest.pausedAt);
        this.forest = { source: src, startTime: audioCtx.currentTime - this.forest.pausedAt };
      }
    }
  },

  setSong(handle) {
    this.song = handle;
  },

  setForest(source, startTime) {
    this.forest = { source, startTime };
  },

  pause() {
    if (this.paused) return;
    this.paused = true;
    if (this.song) this.song.paused = true;
    if (this.forest?.source && typeof audioCtx !== "undefined") {
      const offset = (audioCtx.currentTime - this.forest.startTime) % (this.forest.source.buffer?.duration ?? 1);
      this.forest.pausedAt = offset;
      this.forest.source.stop();
      this.forest.source = null;
    }
  },

  resume() {
    if (!this.paused) return;
    this.paused = false;
    if (this.song) this.song.paused = settings.songMuted;
    if (settings.forestMuted) return;
    const forest = getSound("forest");
    if (forest?.data?.buf && audioCtx && this.forest?.pausedAt != null) {
      const src = audioCtx.createBufferSource();
      src.buffer = forest.data.buf;
      src.loop = true;
      const panner = audioCtx.createStereoPanner();
      panner.pan.value = -0.4;
      const gain = audioCtx.createGain();
      gain.gain.value = 0.05;
      src.connect(panner).connect(gain).connect(audioCtx.destination);
      src.start(0, this.forest.pausedAt);
      this.forest = { source: src, startTime: audioCtx.currentTime - this.forest.pausedAt };
    }
  },
};
