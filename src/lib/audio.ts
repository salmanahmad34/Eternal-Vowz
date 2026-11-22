// Eternal Vowz (E&V) Luxury Wedding Audio Engine
// Plays curated background music tracks or custom uploaded bride & groom songs
// with smooth volume fade-in, seamless looping, sample listening preview & mute control.

export const DEFAULT_WEDDING_AUDIO = '/assets/audio/wedding-nasheed.mp3';

export const TRACK_MAP: Record<string, string> = {
  'wedding-nasheed': '/assets/audio/wedding-nasheed.mp3',
  'dhadkan-rab-ne-milayi': '/assets/audio/dhadkan-rab-ne-milayi.mp3',
  'royal-bansuri-flute': '/assets/audio/royal-bansuri-flute.mp3',
  'romantic-piano-strings': '/assets/audio/romantic-piano-strings.mp3',
  'shahi-sitar-melodies': '/assets/audio/shahi-sitar-melodies.mp3',
  'ethereal-harp-strings': '/assets/audio/ethereal-harp-strings.mp3',

  // Legacy theme aliases
  'royal-harp': '/assets/audio/ethereal-harp-strings.mp3',
  'acoustic-romance': '/assets/audio/royal-bansuri-flute.mp3',
  'cinematic-piano': '/assets/audio/romantic-piano-strings.mp3',
};

export function resolveTrackUrl(trackIdOrUrl?: string): string {
  if (!trackIdOrUrl) return DEFAULT_WEDDING_AUDIO;
  if (TRACK_MAP[trackIdOrUrl]) {
    return TRACK_MAP[trackIdOrUrl];
  }
  if (
    trackIdOrUrl.startsWith('http://') ||
    trackIdOrUrl.startsWith('https://') ||
    (trackIdOrUrl.startsWith('/') && !trackIdOrUrl.startsWith('//')) ||
    trackIdOrUrl.startsWith('data:') ||
    trackIdOrUrl.startsWith('blob:')
  ) {
    return trackIdOrUrl;
  }
  return DEFAULT_WEDDING_AUDIO;
}

class LuxuryAudioPlayer {
  private audio: HTMLAudioElement | null = null;
  private previewAudio: HTMLAudioElement | null = null;
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private isMuted = false;
  private fadeTimer: number | null = null;
  private currentTrackOrUrl = 'wedding-nasheed';
  private previewTrackOrUrl: string | null = null;
  private targetVolume = 0.78;

  private ensureAudioElement(targetUrl: string): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;
    if (!this.audio) {
      this.audio = new Audio(targetUrl);
      this.audio.loop = true;
      this.audio.preload = 'auto';
      this.audio.volume = 0;
    } else {
      // Check if URL changed
      const currentSrc = this.audio.src;
      const isSame = currentSrc === targetUrl || currentSrc.endsWith(targetUrl);
      if (!isSame) {
        this.audio.pause();
        this.audio.src = targetUrl;
        this.audio.currentTime = 0;
      }
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
  public startAmbientMusic(trackIdOrUrl?: string) {
    this.stopPreview();
    const resolvedUrl = resolveTrackUrl(trackIdOrUrl);
    this.currentTrackOrUrl = trackIdOrUrl || 'wedding-nasheed';

    const el = this.ensureAudioElement(resolvedUrl);
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

  // Previews an audio sample in the editor / dashboard form
  public togglePreview(trackIdOrUrl: string): boolean {
    const resolvedUrl = resolveTrackUrl(trackIdOrUrl);

    // If currently previewing this track, pause it
    if (this.previewAudio && this.previewTrackOrUrl === trackIdOrUrl && !this.previewAudio.paused) {
      this.previewAudio.pause();
      this.previewTrackOrUrl = null;
      return false;
    }

    // Stop ambient music if playing
    this.stop();

    if (!this.previewAudio) {
      this.previewAudio = new Audio();
      this.previewAudio.volume = 0.85;
      this.previewAudio.onended = () => {
        this.previewTrackOrUrl = null;
      };
    } else {
      this.previewAudio.pause();
    }

    this.previewAudio.src = resolvedUrl;
    this.previewAudio.currentTime = 0;
    this.previewTrackOrUrl = trackIdOrUrl;

    const p = this.previewAudio.play();
    if (p !== undefined) {
      p.catch((err) => {
        console.warn('Preview blocked:', err);
        this.previewTrackOrUrl = null;
      });
    }
    return true;
  }

  public stopPreview() {
    if (this.previewAudio) {
      try {
        this.previewAudio.pause();
        this.previewAudio.currentTime = 0;
      } catch {}
      this.previewTrackOrUrl = null;
    }
  }

  public getPreviewTrack(): string | null {
    if (this.previewAudio && !this.previewAudio.paused) {
      return this.previewTrackOrUrl;
    }
    return null;
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
      track: this.currentTrackOrUrl,
      src: this.audio?.src || DEFAULT_WEDDING_AUDIO,
    };
  }
}

export const luxuryAudio = new LuxuryAudioPlayer();
