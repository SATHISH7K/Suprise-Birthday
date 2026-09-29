import React, { useState, useEffect, useRef } from 'react';
import { SurpriseData } from '../../types';
import { fireConfetti } from '../../utils/confetti';
import { playBlowSound, playChime, pauseBackgroundMusicForSpeech, resumeBackgroundMusicAfterSpeech } from '../../utils/sound';

interface MidnightCakeSceneProps {
  data: SurpriseData;
  onNext: () => void;
}

export const MidnightCakeScene: React.FC<MidnightCakeSceneProps> = ({
  data,
  onNext,
}) => {
  const [cakeStep, setCakeStep] = useState<0 | 1 | 2>(0); // 0: baking, 1: cake built & candle lit, 2: candle blown
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [voiceFinished, setVoiceFinished] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const candleAudioUrl =
    data.voiceNoteCandle?.audioUrl ||
    (data.voiceNote?.trigger === 'chapter1' ? data.voiceNote.audioUrl : (!data.voiceNoteLetter?.audioUrl ? data.voiceNote?.audioUrl : undefined));
  const hasVoiceNote = Boolean(candleAudioUrl);

  // Progressive cake baking assembly
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setCakeStep(1);
      fireConfetti(window.innerWidth / 2, window.innerHeight * 0.45, 25);
      playChime([523.25, 659.25, 783.99], 0.08, 0.2);
    }, 1400);

    return () => clearTimeout(timer1);
  }, []);

  // Cleanup audio on unmount and ensure music is resumed
  useEffect(() => {
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
      resumeBackgroundMusicAfterSpeech(data.soundtrackVolume / 100, data.soundtrack || 'blue', data.customMusicUrl);
    };
  }, [data.soundtrackVolume, data.soundtrack, data.customMusicUrl]);

  const triggerVoicePlayback = () => {
    if (hasVoiceNote && audioPlayerRef.current) {
      audioPlayerRef.current.currentTime = 0;
      pauseBackgroundMusicForSpeech();
      audioPlayerRef.current.play()
        .then(() => {
          setIsPlayingVoice(true);
        })
        .catch((e) => {
          console.log('Audio autoplay blocked, tap to play:', e);
          resumeBackgroundMusicAfterSpeech(data.soundtrackVolume / 100, data.soundtrack || 'blue', data.customMusicUrl);
        });

      audioPlayerRef.current.onended = () => {
        setIsPlayingVoice(false);
        setVoiceFinished(true);
        resumeBackgroundMusicAfterSpeech(data.soundtrackVolume / 100, data.soundtrack || 'blue', data.customMusicUrl);
      };
    }
  };

  const handleBlowCandle = () => {
    if (cakeStep === 1) {
      setCakeStep(2);
      playBlowSound();
      fireConfetti(window.innerWidth / 2, window.innerHeight * 0.45, 35);
      setTimeout(() => {
        triggerVoicePlayback();
      }, 500);
    } else if (cakeStep === 2) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      resumeBackgroundMusicAfterSpeech(data.soundtrackVolume / 100, data.soundtrack || 'blue', data.customMusicUrl);
      onNext();
    }
  };

  const handleToggleVoice = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioPlayerRef.current) return;
    if (isPlayingVoice) {
      audioPlayerRef.current.pause();
      setIsPlayingVoice(false);
      resumeBackgroundMusicAfterSpeech(data.soundtrackVolume / 100, data.soundtrack || 'blue', data.customMusicUrl);
    } else {
      pauseBackgroundMusicForSpeech();
      audioPlayerRef.current.play()
        .then(() => setIsPlayingVoice(true))
        .catch(() => resumeBackgroundMusicAfterSpeech(data.soundtrackVolume / 100, data.soundtrack || 'blue', data.customMusicUrl));
    }
  };

  return (
    <div
      onClick={cakeStep === 2 ? handleBlowCandle : undefined}
      className="fixed inset-0 w-full h-full bg-gradient-to-b from-[#180a2b] via-[#24103d] to-[#120520] text-white flex flex-col items-center justify-between p-6 select-none overflow-hidden"
    >
      {/* Starry Night Sky Background with Stardust */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(40)].map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              width: `${(i % 3) + 1.5}px`,
              height: `${(i % 3) + 1.5}px`,
              left: `${(i * 19) % 100}%`,
              top: `${(i * 23) % 100}%`,
              opacity: (i % 5) * 0.2 + 0.2,
              animationDelay: `${(i * 0.17) % 3}s`,
            }}
          />
        ))}
      </div>

      {/* Top Title */}
      <div className="relative z-10 text-center pt-4 sm:pt-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-pink-200 uppercase tracking-widest font-semibold shadow-sm mb-1">
          <span>First things first</span>
          <span>🎂</span>
        </div>
      </div>

      {/* Central Interactive Cake Display */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-md">
        {/* Step 0: "Baking something sweet..." */}
        {cakeStep === 0 && (
          <div className="flex flex-col items-center gap-4 animate-fadeIn">
            <div className="w-40 h-20 rounded-full bg-[#fde047]/30 blur-2xl absolute" />
            <div className="w-36 h-12 rounded-full bg-[#f5e6d3] shadow-md border-2 border-[#eedac2] flex items-center justify-center">
              <span className="w-28 h-6 rounded-full bg-[#e8cbb1]" />
            </div>
            <p className="text-xs uppercase tracking-widest text-pink-200/80 animate-pulse">
              Baking something sweet...
            </p>
          </div>
        )}

        {/* Step 1 & 2: Assembled Cake with Candle */}
        {cakeStep >= 1 && (
          <div className="flex flex-col items-center animate-bloom">
            {/* The Candle */}
            <div
              onClick={cakeStep === 1 ? handleBlowCandle : undefined}
              className="relative flex flex-col items-center cursor-pointer group"
              title={cakeStep === 1 ? 'Tap or blow to make a wish!' : ''}
            >
              {/* Flame (visible when step === 1) */}
              {cakeStep === 1 ? (
                <div className="relative flex flex-col items-center -mb-1 animate-flame">
                  <div className="w-4 h-6 rounded-[50%_50%_20%_20%] bg-gradient-to-t from-[#ff512f] via-[#f09819] to-[#ffffaa] shadow-[0_0_20px_#ff9900]" />
                  <div className="w-1.5 h-3 rounded-full bg-white/80 -mt-4 blur-[0.5px]" />
                </div>
              ) : (
                /* Smoke puff after blown */
                <div className="relative -mb-1 flex flex-col items-center animate-fadeIn">
                  <span className="text-xs text-stone-300 opacity-60 animate-twinkle">
                    ☁️
                  </span>
                </div>
              )}

              {/* Candle Wick & Body */}
              <div className="w-0.5 h-2 bg-stone-700" />
              <div className="w-3.5 h-12 bg-gradient-to-b from-[#ffd56b] via-[#f59e0b] to-[#d97706] rounded-t-xs shadow-md border border-amber-300/30 flex flex-col justify-around py-1">
                <span className="w-full h-1 bg-white/40 rotate-[-20deg]" />
                <span className="w-full h-1 bg-white/40 rotate-[-20deg]" />
              </div>
            </div>

            {/* Cake Structure */}
            <div className="relative flex flex-col items-center mt-0.5">
              {/* Top Frosting Drip */}
              <div className="w-48 h-5 bg-[#fff8f0] rounded-t-2xl shadow-sm z-10 flex justify-around px-3 items-end">
                <span className="w-3 h-3 rounded-full bg-[#fff8f0] -mb-1.5" />
                <span className="w-3.5 h-4 rounded-full bg-[#fff8f0] -mb-2" />
                <span className="w-3 h-3 rounded-full bg-[#fff8f0] -mb-1.5" />
                <span className="w-3 h-3.5 rounded-full bg-[#fff8f0] -mb-2" />
                <span className="w-3 h-3 rounded-full bg-[#fff8f0] -mb-1.5" />
              </div>

              {/* Cake Sponge Tier 1 */}
              <div className="w-48 h-12 bg-gradient-to-b from-[#f9d7bc] to-[#e4ba9c] shadow-inner flex items-center justify-around px-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7]" />
              </div>

              {/* Middle Cream Layer */}
              <div className="w-52 h-2.5 bg-[#fff8f0] rounded-full shadow-xs -my-0.5 z-10" />

              {/* Cake Sponge Tier 2 */}
              <div className="w-52 h-14 bg-gradient-to-b from-[#e4ba9c] to-[#c79a7a] rounded-b-xl shadow-lg flex items-center justify-around px-4">
                <span className="w-2 h-2 rounded-full bg-[#fbbf24]/80" />
                <span className="w-2 h-2 rounded-full bg-[#f43f5e]/80" />
                <span className="w-2 h-2 rounded-full bg-[#38bdf8]/80" />
                <span className="w-2 h-2 rounded-full bg-[#4ade80]/80" />
              </div>

              {/* Ceramic Cake Stand */}
              <div className="w-60 h-3 rounded-full bg-white/90 shadow-md mt-1" />
              <div className="w-20 h-2 bg-white/70 rounded-b-md shadow-xs" />
            </div>

            {/* Dedication Text Under Cake */}
            <div className="mt-5 text-center">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Happy Birthday, {data.recipientName}!
              </h3>
              <p className="text-xs sm:text-sm text-pink-200/90 mt-1 font-serif italic">
                {cakeStep === 1 ? 'Make a wish & blow the candle 🕯️' : 'Your wish is sealed in the stars ✨'}
              </p>
            </div>

            {/* Embedded Audio Element */}
            {hasVoiceNote && (
              <audio ref={audioPlayerRef} src={candleAudioUrl} className="hidden" />
            )}

            {/* Voice Note Banner (Revealed after candle is blown) */}
            {cakeStep === 2 && hasVoiceNote && (
              <div
                onClick={handleToggleVoice}
                className="mt-4 w-full max-w-xs p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/25 shadow-lg flex items-center gap-3 cursor-pointer hover:bg-white/15 transition-all animate-fadeIn"
              >
                <button
                  type="button"
                  className="w-10 h-10 rounded-full bg-[#e11d48] text-white flex items-center justify-center shrink-0 shadow-md active:scale-95"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {isPlayingVoice ? 'pause' : 'play_arrow'}
                  </span>
                </button>
                <div className="flex-1 min-w-0 text-left">
                  <span className="text-[10px] uppercase font-bold text-pink-200 tracking-wider block">
                    Voice Wish from {data.senderName}
                  </span>
                  <p className="text-xs font-semibold text-white truncate">
                    {isPlayingVoice ? 'Speaking to you now...' : voiceFinished ? 'Tap to listen again' : 'Tap to hear your wish'}
                  </p>
                </div>
                {isPlayingVoice && (
                  <div className="flex items-end gap-0.5 h-4 shrink-0">
                    <span className="w-0.5 h-2 bg-pink-400 rounded-full animate-pulse" />
                    <span className="w-0.5 h-4 bg-pink-400 rounded-full animate-pulse" />
                    <span className="w-0.5 h-1.5 bg-pink-400 rounded-full animate-pulse" />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Action Area */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-2 pb-2">
        {cakeStep === 1 && (
          <button
            type="button"
            onClick={handleBlowCandle}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#e11d48] text-white text-sm font-semibold shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Blow Candle &amp; Make a Wish</span>
            <span>🕯️ ✨</span>
          </button>
        )}

        {cakeStep === 2 && (
          <button
            type="button"
            onClick={handleBlowCandle}
            className="w-full py-3.5 rounded-full bg-white text-[#180a2b] hover:bg-pink-50 text-sm font-bold shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer animate-pulse"
          >
            <span>Pop the balloons</span>
            <span>🎈 →</span>
          </button>
        )}

        <span className="text-[11px] text-pink-200/60 mt-1">
          {cakeStep === 1 ? 'Tap flame or blow into microphone' : 'Tap anywhere to continue'}
        </span>
      </div>
    </div>
  );
};
