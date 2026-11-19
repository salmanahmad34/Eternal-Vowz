// 100% Original Web Audio API Romantic Orchestral & Harp Synthesizer
// Zero external copyrighted MP3 dependencies — generates lush polyphonic harp, piano & warm string pads in real time

class LuxuryAudioPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private isMuted = false;
  private timer: number | null = null;
  private masterGain: GainNode | null = null;
  private currentTrack = 'royal-harp';

  private initContext() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.22, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Realistic wax seal crack + golden sparkle chime
  public playWaxSealCrack() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Soft wax pop
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(48, now + 0.16);
      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);

      // Ascending golden harp glissando chime
      const sparkleNotes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      sparkleNotes.forEach((freq, i) => {
        if (!this.ctx) return;
        const chime = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();
        const startTime = now + 0.06 + i * 0.055;
        chime.type = 'sine';
        chime.frequency.setValueAtTime(freq, startTime);
        chimeGain.gain.setValueAtTime(0.06, startTime);
        chimeGain.gain.exponentialRampToValueAtTime(0.0008, startTime + 0.7);
        chime.connect(chimeGain);
        chimeGain.connect(this.ctx.destination);
        chime.start(startTime);
        chime.stop(startTime + 0.75);
      });
    } catch (e) {
      console.warn('Audio playWaxSealCrack failed:', e);
    }
  }

  public startAmbientMusic(trackId: string = 'royal-harp') {
    this.currentTrack = trackId;
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const notesByTrack: Record<string, number[][]> = {
      'royal-harp': [
        [293.66, 369.99, 440.0, 554.37, 587.33, 739.99], // Dmaj9
        [246.94, 293.66, 369.99, 440.0, 493.88, 659.25], // Bm9
        [196.0, 246.94, 293.66, 369.99, 392.0, 587.33],  // Gmaj7
        [220.0, 293.66, 329.63, 440.0, 554.37, 659.25],  // A9sus4
      ],
      'acoustic-romance': [
        [261.63, 329.63, 392.0, 493.88, 523.25], // Cmaj7
        [220.0, 261.63, 329.63, 392.0, 440.0],   // Am7
        [174.61, 220.0, 261.63, 329.63, 349.23], // Fmaj7
        [196.0, 246.94, 293.66, 349.23, 392.0],  // G7
      ],
      'cinematic-piano': [
        [220.0, 261.63, 329.63, 440.0, 523.25],
        [174.61, 220.0, 261.63, 349.23, 440.0],
        [261.63, 329.63, 392.0, 523.25, 659.25],
        [196.0, 246.94, 293.66, 392.0, 493.88],
      ],
      'candlelight-strings': [
        [329.63, 392.0, 493.88, 587.33, 659.25],
        [261.63, 329.63, 392.0, 523.25, 587.33],
        [196.0, 246.94, 293.66, 369.99, 493.88],
        [220.0, 277.18, 329.63, 440.0, 554.37],
      ],
    };

    const chords = notesByTrack[trackId] || notesByTrack['royal-harp'];
    let chordIdx = 0;
    let noteIdx = 0;

    const playNextNote = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;

      const currentChord = chords[chordIdx];
      const freq = currentChord[noteIdx];
      const now = this.ctx.currentTime;

      // Warm fundamental harp/piano tone
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.11, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.9);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 3.0);

      // Soft octave harmonic overtone on every first beat of the chord
      if (noteIdx === 0) {
        const pad = this.ctx.createOscillator();
        const padGain = this.ctx.createGain();
        pad.type = 'triangle';
        pad.frequency.setValueAtTime(freq / 2, now);
        padGain.gain.setValueAtTime(0.001, now);
        padGain.gain.linearRampToValueAtTime(0.05, now + 0.6);
        padGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.4);
        pad.connect(padGain);
        padGain.connect(this.masterGain);
        pad.start(now);
        pad.stop(now + 3.5);
      }

      noteIdx = (noteIdx + 1) % currentChord.length;
      if (noteIdx === 0) {
        chordIdx = (chordIdx + 1) % chords.length;
      }

      this.timer = window.setTimeout(playNextNote, 480);
    };

    playNextNote();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.22, now);
    }
    return this.isMuted;
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
      track: this.currentTrack,
    };
  }
}

export const luxuryAudio = new LuxuryAudioPlayer();
