class SoundManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private enabled: boolean = true;
  private volume: number = 0.5;

  async init() {
    if (this.audioContext) return;

    try {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      console.warn('AudioContext not supported');
    }
  }

  private createSound(type: 'tap' | 'success' | 'levelUp' | 'achievement' | 'coin' | 'whoosh' | 'pop' | 'spin' | 'claim'): AudioBuffer | null {
    if (!this.audioContext) return null;

    const ctx = this.audioContext;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      const t = i / ctx.sampleRate;

      switch (type) {
        case 'tap': {
          const freq = 800 + Math.random() * 200;
          data[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 10) * 0.15;
          break;
        }
        case 'success': {
          const freq = 523.25 + t * 200;
          data[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 3) * 0.2;
          break;
        }
        case 'levelUp': {
          const freq = 440 * Math.pow(2, t * 2);
          data[i] = (Math.sin(2 * Math.PI * freq * t) + Math.sin(2 * Math.PI * freq * 1.5 * t)) * Math.exp(-t * 2) * 0.2;
          break;
        }
        case 'achievement': {
          const freq = 660;
          data[i] = (Math.sin(2 * Math.PI * freq * t) + Math.sin(2 * Math.PI * freq * 2 * t) * 0.5) * Math.exp(-t * 1.5) * 0.25;
          break;
        }
        case 'coin': {
          const freq = 1200 + Math.random() * 400;
          data[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 15) * 0.2;
          break;
        }
        case 'whoosh': {
          const noise = Math.random() * 2 - 1;
          data[i] = noise * Math.exp(-t * 5) * 0.1;
          break;
        }
        case 'pop': {
          const freq = 400 + t * 300;
          data[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 20) * 0.2;
          break;
        }
        case 'spin': {
          const freq = 300 + Math.sin(t * 20) * 100;
          data[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 2) * 0.15;
          break;
        }
        case 'claim': {
          const freq = 587.33;
          data[i] = (Math.sin(2 * Math.PI * freq * t) + Math.sin(2 * Math.PI * freq * 2 * t)) * Math.exp(-t * 2) * 0.25;
          break;
        }
      }
    }

    return buffer;
  }

  async loadSounds() {
    await this.init();

    const types: Array<'tap' | 'success' | 'levelUp' | 'achievement' | 'coin' | 'whoosh' | 'pop' | 'spin' | 'claim'> =
      ['tap', 'success', 'levelUp', 'achievement', 'coin', 'whoosh', 'pop', 'spin', 'claim'];

    types.forEach(type => {
      const buffer = this.createSound(type);
      if (buffer) {
        this.sounds.set(type, buffer);
      }
    });
  }

  play(type: 'tap' | 'success' | 'levelUp' | 'achievement' | 'coin' | 'whoosh' | 'pop' | 'spin' | 'claim') {
    if (!this.enabled || !this.audioContext) return;

    const buffer = this.sounds.get(type);
    if (!buffer) return;

    try {
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      source.buffer = buffer;
      gainNode.gain.value = this.volume;

      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      source.start();
    } catch {
      // Ignore audio errors
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  isEnabled() {
    return this.enabled;
  }

  getVolume() {
    return this.volume;
  }
}

export const soundManager = new SoundManager();

let initialized = false;

export const initSounds = () => {
  if (initialized) return;
  initialized = true;

  const onClick = () => {
    soundManager.loadSounds();
    document.removeEventListener('click', onClick);
    document.removeEventListener('touchstart', onClick);
  };

  document.addEventListener('click', onClick);
  document.addEventListener('touchstart', onClick);
};

export default soundManager;



