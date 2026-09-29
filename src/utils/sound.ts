// Web Audio API sound synthesis and effects engine for OurMoments

let audioCtx: AudioContext | null = null;
let bgGainNode: GainNode | null = null;
let bgInterval: number | null = null;
let isMusicPlaying = false;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Balloon pop sound: crisp snap + low frequency resonant pop
 */
export function playPopSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Oscillator 1: Rapid pitch down (balloon membrane burst)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.14);

    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.14);

    // Noise burst (the air decompression)
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(1400, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
  } catch {
    // Ignore audio play errors on unsupported environments
  }
}

/**
 * Candle blow sound: soft puff of wind followed by a gentle warm sparkle chime
 */
export function playBlowSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Breath puff
    const bufferSize = ctx.sampleRate * 0.25;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, now);
    filter.Q.value = 1.2;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);

    // Sweet subtle twinkle
    playChime([523.25, 659.25, 783.99], 0.15, 0.15);
  } catch {
    // Ignore
  }
}

/**
 * Wax seal break sound: crisp mechanical crackle + warm chord
 */
export function playWaxBreakSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.2);

    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);

    // Warm harp chord
    playChime([440, 554.37, 659.25, 880], 0.1, 0.35);
  } catch {
    // Ignore
  }
}

/**
 * Heart reaction chime: cheerful warm ding
 */
export function playHeartChime() {
  try {
    playChime([587.33, 739.99, 880], 0, 0.25);
  } catch {
    // Ignore
  }
}

/**
 * Ribbon unwrap sound
 */
export function playUnwrapSound() {
  try {
    playChime([392, 523.25, 659.25, 783.99, 1046.5], 0.08, 0.4);
  } catch {
    // Ignore
  }
}

/**
 * Play a sequenced chime of frequencies
 */
export function playChime(frequencies: number[], staggerSeconds = 0.08, volume = 0.2) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    frequencies.forEach((freq, idx) => {
      const startTime = now + idx * staggerSeconds;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.85);
    });
  } catch {
    // Ignore
  }
}

/**
 * Background Gentle Celebration Music Loop
 * Plays an authentic, dreamy instrumental version of Yung Kai - "Blue"
 * (Dmaj7 -> F#m7 -> Gmaj7 -> A7 / Bm7 / Em7)
 * Built with rich dual-oscillator Rhodes/music-box synthesis, warm sub-bass,
 * and the iconic nostalgic waltz melody.
 */
let currentTrackStyle = 'blue';
let activeCustomUrl: string | null = null;
let customAudioEl: HTMLAudioElement | null = null;

export function toggleBackgroundMusic(enable: boolean, volume = 0.28, trackStyle = 'blue', customAudioUrl?: string) {
  currentTrackStyle = trackStyle;
  if (!enable) {
    stopBackgroundMusic();
    return;
  }
  startBackgroundMusic(volume, trackStyle, customAudioUrl);
}

export function startBackgroundMusic(volume = 0.28, trackStyle = 'blue', customAudioUrl?: string) {
  currentTrackStyle = trackStyle;

  // If a custom audio track (file/data URL) is provided, play it
  if (customAudioUrl && customAudioUrl.trim().length > 0) {
    try {
      // Stop procedural synth if it was running
      if (bgInterval) {
        clearInterval(bgInterval);
        bgInterval = null;
      }
      if (bgGainNode && audioCtx) {
        try {
          bgGainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
        } catch {
          // Ignore
        }
      }

      if (!customAudioEl || activeCustomUrl !== customAudioUrl) {
        if (customAudioEl) {
          customAudioEl.pause();
          customAudioEl = null;
        }
        customAudioEl = new Audio(customAudioUrl);
        customAudioEl.loop = true;
        activeCustomUrl = customAudioUrl;
      }

      customAudioEl.volume = Math.max(0, Math.min(1, volume));
      const playPromise = customAudioEl.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            isMusicPlaying = true;
          })
          .catch((err) => {
            console.log('Custom audio autoplay restriction until user interaction:', err);
            isMusicPlaying = false;
          });
      } else {
        isMusicPlaying = true;
      }
      return;
    } catch (err) {
      console.warn('Failed to start custom audio, falling back to instrumental:', err);
    }
  }

  // If no custom audio, ensure any custom audio element is paused
  if (customAudioEl) {
    try {
      customAudioEl.pause();
    } catch {
      // Ignore
    }
  }

  if (isMusicPlaying && !customAudioUrl) {
    if (bgGainNode && audioCtx) {
      bgGainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    }
    return;
  }

  try {
    const ctx = getAudioContext();
    isMusicPlaying = true;

    // Master background gain
    bgGainNode = ctx.createGain();
    bgGainNode.gain.setValueAtTime(volume, ctx.currentTime);

    // Warm low-pass filter to give lofi / vinyl / tape warmth of "Blue"
    const masterFilter = ctx.createBiquadFilter();
    masterFilter.type = 'lowpass';
    masterFilter.frequency.setValueAtTime(1750, ctx.currentTime);
    masterFilter.Q.setValueAtTime(1.1, ctx.currentTime);

    bgGainNode.connect(masterFilter);
    masterFilter.connect(ctx.destination);

    // Yung Kai "Blue" Instrumental Progression in D Major (3/4 time, ~74 BPM)
    // Measure duration ~ 2.43s (0.81s per quarter beat)
    // Structure of Blue:
    // Bar 1: Dmaj7  (Bass D3, Chords F#4-A4-C#5, Melody: F#4 -> A4 -> D5 -> C#5)
    // Bar 2: F#m7   (Bass F#3, Chords A4-C#5-E5, Melody: C#5 -> B4 -> A4 -> F#4)
    // Bar 3: Gmaj7  (Bass G3, Chords B4-D5-F#5, Melody: B4 -> D5 -> C#5 -> B4)
    // Bar 4: A7/Gm6 (Bass A2, Chords G4-C#5-E5, Melody: A4 -> C#5 -> B4 -> A4)
    // Bar 5: Dmaj7  (Melody: "Your love is like a song" - D5 -> C#5 -> B4 -> A4)
    // Bar 6: Bm7    (Melody: F#4 -> A4 -> D5 -> B4)
    // Bar 7: Em7    (Melody: G4 -> B4 -> D5 -> C#5)
    // Bar 8: A7sus4 (Melody: E4 -> G4 -> A4 -> F#4 resolving to D)

    interface BlueMeasure {
      bassFreq: number;
      chordFreqs: number[];
      melodyNotes: { freq: number; delay: number; duration: number }[];
    }

    const blueMeasures: BlueMeasure[] = [
      {
        // 1. Dmaj7
        bassFreq: 146.83, // D3
        chordFreqs: [369.99, 440.0, 554.37], // F#4, A4, C#5
        melodyNotes: [
          { freq: 369.99, delay: 0.0, duration: 0.65 },  // F#4
          { freq: 440.00, delay: 0.72, duration: 0.65 },  // A4
          { freq: 587.33, delay: 1.44, duration: 0.55 },  // D5
          { freq: 554.37, delay: 1.95, duration: 0.45 },  // C#5
        ],
      },
      {
        // 2. F#m7
        bassFreq: 185.00, // F#3
        chordFreqs: [440.0, 554.37, 659.25], // A4, C#5, E5
        melodyNotes: [
          { freq: 554.37, delay: 0.0, duration: 0.65 },  // C#5
          { freq: 493.88, delay: 0.72, duration: 0.65 },  // B4
          { freq: 440.00, delay: 1.44, duration: 0.55 },  // A4
          { freq: 369.99, delay: 1.95, duration: 0.45 },  // F#4
        ],
      },
      {
        // 3. Gmaj7
        bassFreq: 196.00, // G3
        chordFreqs: [493.88, 587.33, 739.99], // B4, D5, F#5
        melodyNotes: [
          { freq: 392.00, delay: 0.0, duration: 0.65 },  // G4
          { freq: 493.88, delay: 0.72, duration: 0.65 },  // B4
          { freq: 587.33, delay: 1.44, duration: 0.55 },  // D5
          { freq: 493.88, delay: 1.95, duration: 0.45 },  // B4
        ],
      },
      {
        // 4. A7
        bassFreq: 110.00, // A2
        chordFreqs: [392.0, 554.37, 659.25], // G4, C#5, E5
        melodyNotes: [
          { freq: 440.00, delay: 0.0, duration: 0.65 },  // A4
          { freq: 554.37, delay: 0.72, duration: 0.65 },  // C#5
          { freq: 493.88, delay: 1.44, duration: 0.55 },  // B4
          { freq: 440.00, delay: 1.95, duration: 0.45 },  // A4
        ],
      },
      {
        // 5. Dmaj7 ("Your love is like a song...")
        bassFreq: 146.83, // D3
        chordFreqs: [369.99, 440.0, 554.37],
        melodyNotes: [
          { freq: 587.33, delay: 0.0, duration: 0.55 },  // D5
          { freq: 554.37, delay: 0.55, duration: 0.55 }, // C#5
          { freq: 493.88, delay: 1.10, duration: 0.55 }, // B4
          { freq: 440.00, delay: 1.65, duration: 0.75 }, // A4
        ],
      },
      {
        // 6. Bm7 ("Boy I'd be all yours...")
        bassFreq: 123.47, // B2
        chordFreqs: [369.99, 440.0, 587.33], // F#4, A4, D5
        melodyNotes: [
          { freq: 369.99, delay: 0.0, duration: 0.55 },  // F#4
          { freq: 440.00, delay: 0.55, duration: 0.55 },  // A4
          { freq: 587.33, delay: 1.10, duration: 0.65 },  // D5
          { freq: 493.88, delay: 1.75, duration: 0.65 },  // B4
        ],
      },
      {
        // 7. Em7 ("It's like a dream...")
        bassFreq: 164.81, // E3
        chordFreqs: [392.0, 493.88, 587.33], // G4, B4, D5
        melodyNotes: [
          { freq: 392.00, delay: 0.0, duration: 0.55 },  // G4
          { freq: 493.88, delay: 0.55, duration: 0.55 },  // B4
          { freq: 587.33, delay: 1.10, duration: 0.65 },  // D5
          { freq: 554.37, delay: 1.75, duration: 0.65 },  // C#5
        ],
      },
      {
        // 8. A7sus4 -> A7 ("All I need is you and me...")
        bassFreq: 110.00, // A2
        chordFreqs: [392.0, 440.0, 554.37],
        melodyNotes: [
          { freq: 329.63, delay: 0.0, duration: 0.55 },  // E4
          { freq: 392.00, delay: 0.55, duration: 0.55 },  // G4
          { freq: 440.00, delay: 1.10, duration: 0.65 },  // A4
          { freq: 369.99, delay: 1.75, duration: 0.65 },  // F#4 -> resolves back
        ],
      },
    ];

    let measureIdx = 0;

    const playMeasure = () => {
      if (!isMusicPlaying || !ctx || !bgGainNode) return;
      const now = ctx.currentTime;
      const measure = blueMeasures[measureIdx % blueMeasures.length];
      measureIdx++;

      // 1. Play Soft Sub Bass Note (Round, warm sine)
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(measure.bassFreq, now);

      bassGain.gain.setValueAtTime(0, now);
      bassGain.gain.linearRampToValueAtTime(0.09, now + 0.08);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 2.3);

      bassOsc.connect(bassGain);
      bassGain.connect(bgGainNode);
      bassOsc.start(now);
      bassOsc.stop(now + 2.35);

      // 2. Play Waltz Arpeggiated Chord Pad (Beats 2 and 3)
      [0.72, 1.44].forEach((beatDelay) => {
        const chordTime = now + beatDelay;
        measure.chordFreqs.forEach((freq, idx) => {
          const chordOsc = ctx.createOscillator();
          const chordNoteGain = ctx.createGain();

          chordOsc.type = 'triangle';
          chordOsc.frequency.setValueAtTime(freq, chordTime);

          chordNoteGain.gain.setValueAtTime(0, chordTime);
          chordNoteGain.gain.linearRampToValueAtTime(0.038, chordTime + 0.04);
          chordNoteGain.gain.exponentialRampToValueAtTime(0.001, chordTime + 1.1);

          chordOsc.connect(chordNoteGain);
          chordNoteGain.connect(bgGainNode!);
          chordOsc.start(chordTime);
          chordOsc.stop(chordTime + 1.15);
        });
      });

      // 3. Play Lead Melody Notes of Yung Kai "Blue"
      measure.melodyNotes.forEach((mNote) => {
        const noteTime = now + mNote.delay;
        const melOsc = ctx.createOscillator();
        const melOscHarmonic = ctx.createOscillator();
        const melGain = ctx.createGain();

        // Warm Rhodes / Vibraphone character
        melOsc.type = 'sine';
        melOsc.frequency.setValueAtTime(mNote.freq, noteTime);

        // Gentle octave sparkle harmonic
        melOscHarmonic.type = 'triangle';
        melOscHarmonic.frequency.setValueAtTime(mNote.freq * 2, noteTime);

        melGain.gain.setValueAtTime(0, noteTime);
        melGain.gain.linearRampToValueAtTime(0.085, noteTime + 0.03);
        melGain.gain.exponentialRampToValueAtTime(0.001, noteTime + mNote.duration + 0.35);

        melOsc.connect(melGain);
        melOscHarmonic.connect(melGain);
        melGain.connect(bgGainNode!);

        melOsc.start(noteTime);
        melOscHarmonic.start(noteTime);
        melOsc.stop(noteTime + mNote.duration + 0.4);
        melOscHarmonic.stop(noteTime + mNote.duration + 0.4);
      });
    };

    playMeasure();
    bgInterval = window.setInterval(playMeasure, 2400);
  } catch {
    // Ignore audio autoplay restrictions
  }
}

export function stopBackgroundMusic() {
  isMusicPlaying = false;
  if (customAudioEl) {
    try {
      customAudioEl.pause();
    } catch {
      // Ignore
    }
  }
  if (bgInterval) {
    clearInterval(bgInterval);
    bgInterval = null;
  }
  if (bgGainNode && audioCtx) {
    try {
      bgGainNode.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
    } catch {
      // Ignore
    }
  }
}

let wasMusicPlayingBeforeSpeech = false;

/**
 * Pauses background music while a personal voice recording is actively speaking
 */
export function pauseBackgroundMusicForSpeech() {
  if (isMusicPlaying) {
    wasMusicPlayingBeforeSpeech = true;
    if (customAudioEl && !customAudioEl.paused) {
      customAudioEl.pause();
    }
    stopBackgroundMusic();
  }
}

/**
 * Resumes background music after personal voice note finishes playing
 */
export function resumeBackgroundMusicAfterSpeech(volume = 0.25, trackStyle = 'blue', customAudioUrl?: string) {
  if (wasMusicPlayingBeforeSpeech) {
    wasMusicPlayingBeforeSpeech = false;
    startBackgroundMusic(volume, trackStyle, customAudioUrl || activeCustomUrl || undefined);
  }
}

/**
 * Helper to get the duration of an audio source URL
 */
export function getAudioFileDuration(audioUrl: string): Promise<number> {
  return new Promise((resolve) => {
    try {
      const audio = new Audio(audioUrl);
      audio.addEventListener('loadedmetadata', () => {
        resolve(audio.duration || 0);
      });
      audio.addEventListener('error', () => {
        resolve(0);
      });
    } catch {
      resolve(0);
    }
  });
}

