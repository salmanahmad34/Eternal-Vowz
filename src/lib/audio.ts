// Eternal Vowz (E&V) Signature Wedding Audio Player
// Plays the custom uploaded soulful wedding vocal track (/assets/audio/wedding-nasheed.mp3)
// across every wedding invitation card with smooth fade-in, seamless looping & mute control.

export const WEDDING_AUDIO_URL = '/assets/audio/wedding-nasheed.mp3';

class LuxuryAudioPlayer {
  private audio: HTMLAudioElement | null = null;
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private isMuted = false;
  private fadeTimer: number | null = null;
  private currentTrack = 'wedding-nasheed';
  private targetVolume = 0.78;

  private ensureAudioElement(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;
    if (!this.audio) {
      this.audio = new Audio(WEDDING_AUDIO_URL);
      this.audio.loop = true;
      this.audio.preload = 'auto';
      this.audio.volume = 0;
    }
    return this.audio;
  }

  private clearFade() {
    if (this.fadeTimer !== null && typeof window !== 'undefined') {
      window.clearInterval(this.fadeTimer);
      this.fadeTimer = null;
    }
  }

  // Soft tactile wax seal click sound on tap (non-intrusive)
  public playWaxSealCrack() {
    try {
      if (typeof window === 'undefined') return;
      if (!this.ctx) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      }
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(52, now + 0.14);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.17);
    } catch {
      // Ignore if AudioContext is unavailable
    }
  }

  // Starts the signature wedding MP3 immediately inside the user tap gesture with smooth volume fade-in
  public startAmbientMusic(trackId: string = 'wedding-nasheed') {
    this.currentTrack = trackId || 'wedding-nasheed';
    const el = this.ensureAudioElement();
    if (!el) return;

    this.clearFade();
    el.muted = this.isMuted;

    if (!this.isPlaying) {
      el.currentTime = 0;
      el.volume = this.isMuted ? 0 : 0.05;
    }

    const playPromise = el.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
          if (!this.isMuted) {
            let vol = el.volume;
            this.fadeTimer = window.setInterval(() => {
              if (!this.audio || this.isMuted || !this.isPlaying) {
                this.clearFade();
                return;
              }
              vol = Math.min(this.targetVolume, vol + 0.06);
              this.audio.volume = vol;
              if (vol >= this.targetVolume) {
                this.clearFade();
              }
            }, 80);
          }
        })
        .catch((err) => {
          console.warn('Wedding audio playback blocked until user interaction:', err);
          this.isPlaying = false;
        });
    }
  }

  public stop() {
    this.isPlaying = false;
    this.clearFade();
    if (this.audio) {
      try {
        this.audio.pause();
        this.audio.currentTime = 0;
      } catch {
        // Ignore pause errors
      }
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    this.clearFade();
    if (this.audio) {
      this.audio.muted = this.isMuted;
      if (!this.isMuted) {
        this.audio.volume = this.targetVolume;
        if (this.audio.paused) {
          this.audio.play().catch(() => {});
          this.isPlaying = true;
        }
      }
    }
    return this.isMuted;
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
      track: this.currentTrack,
      src: WEDDING_AUDIO_URL,
    };
  }
}

export const luxuryAudio = new LuxuryAudioPlayer();
