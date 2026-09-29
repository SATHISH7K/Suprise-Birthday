import React, { useState, useRef, useEffect } from 'react';
import { SurpriseData } from '../../types';
import { fireConfetti } from '../../utils/confetti';
import { playBlowSound, playChime } from '../../utils/sound';

interface RecipientCakeProps {
  data: SurpriseData;
  onNext: () => void;
  isSoundOn: boolean;
  onToggleSound: () => void;
}

export const RecipientCakeCandles: React.FC<RecipientCakeProps> = ({
  data,
  onNext,
  isSoundOn,
  onToggleSound,
}) => {
  const [candles, setCandles] = useState({ 1: true, 2: true, 3: true });
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [voiceFinished, setVoiceFinished] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const activeCount = Object.values(candles).filter(Boolean).length;
  const candleAudioUrl = data.voiceNoteCandle?.audioUrl || (data.voiceNote?.trigger === 'chapter1' ? data.voiceNote.audioUrl : (!data.voiceNoteLetter?.audioUrl ? data.voiceNote?.audioUrl : undefined));
  const hasVoiceNote = Boolean(candleAudioUrl);

  const triggerVoiceNotePlayback = () => {
    if (candleAudioUrl) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      const audio = new Audio(candleAudioUrl);
      audioPlayerRef.current = audio;
      setIsPlayingVoice(true);

      audio.onended = () => {
        setIsPlayingVoice(false);
        setVoiceFinished(true);
      };

      audio.onerror = () => {
        setIsPlayingVoice(false);
        setVoiceFinished(true);
      };

      audio.play().catch((e) => {
        console.warn('Voice note playback auto-start error:', e);
        setIsPlayingVoice(false);
      });
    }
  };

  useEffect(() => {
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
    };
  }, []);

  const handleExtinguish = (id: 1 | 2 | 3) => {
    if (!candles[id]) return;
    setCandles((prev) => {
      const nextState = { ...prev, [id]: false };
      const remaining = Object.values(nextState).filter(Boolean).length;
      playBlowSound();
      if (remaining === 0) {
        fireConfetti(window.innerWidth / 2, window.innerHeight * 0.45, 30);
        setTimeout(() => {
          triggerVoiceNotePlayback();
        }, 500);
      }
      return nextState;
    });
  };

  const handleBlowAll = () => {
    if (activeCount > 0) {
      setCandles({ 1: false, 2: false, 3: false });
      playBlowSound();
      fireConfetti(window.innerWidth / 2, window.innerHeight * 0.45, 36);
      setTimeout(() => {
        triggerVoiceNotePlayback();
      }, 500);
    } else {
      // Proceed to Next Chapter (Balloons)
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      playChime([523.25, 659.25, 783.99, 1046.5], 0.06, 0.25);
      onNext();
    }
  };

  const handleToggleManualVoice = () => {
    if (!data.voiceNote?.audioUrl) return;
    if (isPlayingVoice) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      setIsPlayingVoice(false);
    } else {
      triggerVoiceNotePlayback();
    }
  };

  const handleRelight = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    setIsPlayingVoice(false);
    setVoiceFinished(false);
    setCandles({ 1: true, 2: true, 3: true });
  };

  // Color schemes based on cake choice
  const isStrawberry = data.cake === 'strawberry-blush';
  const isVanilla = data.cake === 'vanilla-gold';

  const cakeTopBg = isStrawberry
    ? 'from-[#fecdd3] to-[#fb7185]'
    : isVanilla
    ? 'from-[#fef3c7] to-[#fde68a]'
    : 'from-[#3E2319] to-[#26150F]';

  const cakeBottomBg = isStrawberry
    ? 'from-[#fb7185] to-[#f43f5e]'
    : isVanilla
    ? 'from-[#fde68a] to-[#f59e0b]'
    : 'from-[#2B1812] to-[#1F0E09]';

  return (
    <div className="flex flex-col w-full relative overflow-hidden select-none pb-12 pt-2 px-4 max-w-[440px] mx-auto">
      {/* Ambient glow backdrop */}
      <div
        className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-gradient-to-b from-[#ff6f52]/20 via-[#FB923C]/15 to-transparent blur-3xl transition-opacity duration-1000"
        style={{ opacity: activeCount * 0.35 }}
      />

      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-4 pt-1">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-xl shadow-xs border border-[#fce8dc]">
          <span className="w-2 h-2 rounded-full bg-[#FB923C] animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#786155]">
            OurMoments
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleSound}
          className="px-3 py-1 flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur-xl shadow-xs border border-[#fce8dc] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px] text-[#ac331c]">
            {isSoundOn ? 'volume_up' : 'volume_off'}
          </span>
          <span className="text-[11px] font-medium text-[#59413c]">
            {isSoundOn ? (data.soundtrack === 'blue' ? 'Blue 🎵' : 'Acoustic Sunset') : 'Muted'}
          </span>
        </button>
      </div>

      {/* Step Breadcrumb & Live Candle Counter */}
      <div className="w-full flex items-center justify-between mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fee3d8]/80 backdrop-blur-md shadow-xs border border-[#fce8dc]">
          <span className="text-sm">🎂</span>
          <span className="text-[10px] uppercase font-bold text-[#59413c] tracking-wider">
            Make a Wish
          </span>
          <span className="w-1 h-1 rounded-full bg-[#ac331c]/40" />
          <span className="text-[11px] font-bold text-[#ac331c]">Step 1 of 4</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff1ec] shadow-xs border border-[#fce8dc]">
          <span className={`w-2 h-2 rounded-full ${activeCount > 0 ? 'bg-[#F59E0B] animate-ping' : 'bg-emerald-500'}`} />
          <span className="text-xs font-semibold text-[#59413c]">
            {activeCount > 0 ? `${activeCount} of 3 lit ✨` : 'Wish Made! 🎉'}
          </span>
        </div>
      </div>

      {/* Headline */}
      <div className="text-center px-2 mb-5">
        <h1 className="text-2xl font-bold text-[#261812] tracking-tight mb-1">
          First things first, make a wish! ✨
        </h1>
        <p className="text-xs sm:text-sm text-[#59413c] max-w-[340px] mx-auto leading-relaxed">
          Close your eyes, picture your brightest dream for {data.age || 'this year'}, and gently blow into your mic or tap the flames!
        </p>
      </div>

      {/* Cake Stage Card */}
      <div className="relative w-full rounded-3xl bg-white shadow-[0_18px_48px_-8px_rgba(120,97,85,0.12),0_4px_12px_-2px_rgba(120,97,85,0.05)] border border-[#fce8dc] p-6 flex flex-col items-center justify-center overflow-hidden mb-5">
        {/* Floating Sparkles */}
        <span className="absolute top-5 left-7 text-[#F59E0B]/70 text-xs animate-pulse">✦</span>
        <span className="absolute top-10 right-8 text-[#FB923C]/60 text-sm animate-bounce" style={{ animationDuration: '2.4s' }}>★</span>
        <span className="absolute bottom-8 left-6 text-[#F59E0B]/50 text-xs">✨</span>

        {/* Cake Illustration & Candle Cluster */}
        <div className="relative flex flex-col items-center justify-end w-full max-w-[280px] h-[250px] pt-4">
          {/* 3 Candles */}
          <div className="relative z-20 flex items-end justify-center gap-7 w-full mb-[-2px]">
            {/* Candle 1 (Left) */}
            <div
              onClick={() => handleExtinguish(1)}
              className="flex flex-col items-center cursor-pointer group"
            >
              {candles[1] ? (
                <div className="relative flex items-center justify-center w-6 h-9 transition-transform group-active:scale-90">
                  <div className="absolute w-6 h-8 rounded-full bg-[#F59E0B]/30 blur-md animate-pulse" />
                  <div className="w-3.5 h-6 rounded-full bg-gradient-to-t from-[#F43F5E] via-[#F59E0B] to-white shadow-[0_0_14px_#F59E0B] animate-flame" />
                  <div className="absolute bottom-0 w-1.5 h-2 rounded-full bg-blue-300 opacity-70" />
                </div>
              ) : (
                <div className="w-6 h-9 flex items-center justify-center">
                  <span className="text-xs text-[#786155]/60 animate-bounce">💨</span>
                </div>
              )}
              {/* Wick */}
              <div className="w-0.5 h-2 bg-[#261812]/70" />
              {/* Stick */}
              <div className="w-3.5 h-14 rounded-t-xs bg-gradient-to-r from-[#ffdadc] via-[#f96f83] to-[#ffdadc] shadow-inner flex flex-col justify-around py-1">
                <div className="w-full h-1 bg-white/40 transform -rotate-12" />
                <div className="w-full h-1 bg-white/40 transform -rotate-12" />
              </div>
            </div>

            {/* Candle 2 (Center - Hero Taller) */}
            <div
              onClick={() => handleExtinguish(2)}
              className="flex flex-col items-center cursor-pointer group -translate-y-2"
            >
              {candles[2] ? (
                <div className="relative flex items-center justify-center w-7 h-10 transition-transform group-active:scale-90">
                  <div className="absolute w-7 h-9 rounded-full bg-[#F59E0B]/40 blur-lg animate-pulse" />
                  <div className="w-4 h-7 rounded-full bg-gradient-to-t from-[#FB923C] via-[#F59E0B] to-white shadow-[0_0_18px_#FB923C] animate-flame" />
                  <div className="absolute bottom-0 w-1.5 h-2.5 rounded-full bg-blue-400 opacity-80" />
                </div>
              ) : (
                <div className="w-7 h-10 flex items-center justify-center">
                  <span className="text-xs text-[#786155]/60 animate-bounce">💨</span>
                </div>
              )}
              {/* Wick */}
              <div className="w-0.5 h-2.5 bg-[#261812]/80" />
              {/* Stick */}
              <div className="w-4 h-16 rounded-t-xs bg-gradient-to-r from-[#ffdf9f] via-[#ffc329] to-[#ffdf9f] shadow-inner flex flex-col justify-around py-1.5">
                <div className="w-full h-1 bg-white/50 transform -rotate-12" />
                <div className="w-full h-1 bg-white/50 transform -rotate-12" />
                <div className="w-full h-1 bg-white/50 transform -rotate-12" />
              </div>
            </div>

            {/* Candle 3 (Right) */}
            <div
              onClick={() => handleExtinguish(3)}
              className="flex flex-col items-center cursor-pointer group"
            >
              {candles[3] ? (
                <div className="relative flex items-center justify-center w-6 h-9 transition-transform group-active:scale-90">
                  <div className="absolute w-6 h-8 rounded-full bg-[#F59E0B]/30 blur-md animate-pulse" />
                  <div className="w-3.5 h-6 rounded-full bg-gradient-to-t from-[#F43F5E] via-[#F59E0B] to-white shadow-[0_0_14px_#F59E0B] animate-flame" />
                  <div className="absolute bottom-0 w-1.5 h-2 rounded-full bg-blue-300 opacity-70" />
                </div>
              ) : (
                <div className="w-6 h-9 flex items-center justify-center">
                  <span className="text-xs text-[#786155]/60 animate-bounce">💨</span>
                </div>
              )}
              {/* Wick */}
              <div className="w-0.5 h-2 bg-[#261812]/70" />
              {/* Stick */}
              <div className="w-3.5 h-14 rounded-t-xs bg-gradient-to-r from-[#ffdadc] via-[#f96f83] to-[#ffdadc] shadow-inner flex flex-col justify-around py-1">
                <div className="w-full h-1 bg-white/40 transform -rotate-12" />
                <div className="w-full h-1 bg-white/40 transform -rotate-12" />
              </div>
            </div>
          </div>

          {/* Cake Layers */}
          <div className="relative w-full flex flex-col items-center">
            {/* Top Frosting Rosettes */}
            <div className="relative z-10 w-44 h-5 flex justify-between px-1">
              <span className="w-7 h-5 rounded-full bg-[#ffdad3] shadow-xs" />
              <span className="w-7 h-5 rounded-full bg-[#ffb4a5] shadow-xs -mt-0.5" />
              <span className="w-8 h-5 rounded-full bg-[#ffdad3] shadow-xs" />
              <span className="w-7 h-5 rounded-full bg-[#ffb4a5] shadow-xs -mt-0.5" />
              <span className="w-7 h-5 rounded-full bg-[#ffdad3] shadow-xs" />
            </div>

            {/* Tier 1 */}
            <div className={`relative z-0 w-44 h-14 rounded-t-2xl bg-gradient-to-b ${cakeTopBg} shadow-inner flex flex-col justify-between overflow-hidden`}>
              <div className="flex justify-around w-full opacity-90">
                <div className="w-4 h-4 rounded-b-full bg-[#ffdad3]" />
                <div className="w-3 h-6 rounded-b-full bg-[#ffdad3]" />
                <div className="w-4 h-3 rounded-b-full bg-[#ffdad3]" />
                <div className="w-5 h-5 rounded-b-full bg-[#ffdad3]" />
                <div className="w-3 h-4 rounded-b-full bg-[#ffdad3]" />
              </div>

              <div className="flex justify-around items-center px-4 pb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]/80" />
                <span className="w-1 h-1 rounded-full bg-[#FB923C]/80" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]/80" />
                <span className="w-1 h-1 rounded-full bg-[#F43F5E]/80" />
              </div>
            </div>

            {/* Cream Divider */}
            <div className="w-52 h-2.5 bg-[#ffdad3] rounded-full shadow-xs z-10 -my-1" />

            {/* Tier 2 */}
            <div className={`w-52 h-16 rounded-b-xl bg-gradient-to-b ${cakeBottomBg} shadow-md flex items-center justify-around px-4 relative overflow-hidden`}>
              <div className="absolute inset-x-0 top-0 h-1 bg-white/15" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
            </div>

            {/* Stand */}
            <div className="w-64 h-3 rounded-full bg-[#fee3d8] shadow-[0_4px_12px_rgba(38,24,18,0.1)] mt-1" />
            <div className="w-24 h-2.5 bg-[#f8ddd2] rounded-b-lg shadow-xs" />
          </div>
        </div>

        {/* Mic Sensor Prompt or Voice Note Player once blown */}
        <div className="mt-5 w-full flex flex-col items-center gap-3">
          {activeCount > 0 ? (
            <button
              type="button"
              onClick={handleBlowAll}
              className="px-4 py-2 rounded-full bg-[#fff1ec] hover:bg-[#fee3d8] transition-all flex items-center gap-2 shadow-xs border border-[#fce8dc] cursor-pointer"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ac331c] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ac331c]" />
              </span>
              <span className="material-symbols-outlined text-[18px] text-[#ac331c]">mic</span>
              <span className="text-xs font-semibold text-[#59413c]">
                Blow into mic or tap flames
              </span>
            </button>
          ) : (
            <div className="w-full flex flex-col items-center gap-2 animate-fadeIn">
              <div className="px-4 py-1.5 rounded-full bg-[#ecfdf5] border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Candles Blown Out! Wish is sealed ✨</span>
              </div>

              {/* Voice Note Banner right after blowing candles */}
              {hasVoiceNote && (
                <div className="w-full mt-2 p-3.5 rounded-2xl bg-gradient-to-r from-[#FFF0E6] via-[#ffe9e1] to-[#FFF0E6] border border-[#fce8dc] shadow-sm flex flex-col gap-2 animate-bounce-once">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#ac331c] bg-[#ffdcd3] px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">mic</span>
                      <span>Voice Wish from {data.senderName}</span>
                    </span>
                    <span className="text-[11px] font-semibold text-[#786155]">
                      {isPlayingVoice ? 'Playing now 🎙️' : voiceFinished ? 'Listened ✓' : 'Tap to hear'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleToggleManualVoice}
                      className="w-10 h-10 rounded-full bg-[#ac331c] hover:bg-[#8a1b06] text-white flex items-center justify-center shrink-0 shadow-xs cursor-pointer active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {isPlayingVoice ? 'pause' : 'play_arrow'}
                      </span>
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#261812] truncate">
                        {data.senderName}'s birthday voice note
                      </p>
                      <p className="text-[11px] text-[#59413c]">
                        {isPlayingVoice ? 'Speaking right to you...' : 'Personal audio message'}
                      </p>
                    </div>
                  </div>

                  {/* Audio Element */}
                  <audio
                    ref={audioPlayerRef}
                    src={candleAudioUrl}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="w-full flex flex-col gap-2 items-center mb-4">
        <button
          type="button"
          onClick={handleBlowAll}
          className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#FB923C] to-[#F43F5E] text-white font-semibold text-sm sm:text-base shadow-[0_10px_24px_-4px_rgba(255,111,82,0.35)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{activeCount > 0 ? '🕯️' : '🍰'}</span>
          <span>{activeCount > 0 ? 'Make a Wish & Blow' : 'Cut Cake & Pop Balloons 🎈 →'}</span>
        </button>

        {activeCount === 0 && (
          <button
            type="button"
            onClick={handleRelight}
            className="text-xs text-[#ac331c] font-semibold hover:underline flex items-center gap-1 cursor-pointer py-1"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            <span>Light them again</span>
          </button>
        )}
      </div>

      {/* Up Next Sneak Peek Ticker */}
      <div className="w-full rounded-2xl bg-[#fff1ec]/90 backdrop-blur-xs p-3.5 flex items-center justify-between border border-[#fce8dc] shadow-xs mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#ffdad3] flex items-center justify-center text-lg shrink-0 shadow-inner">
            🎈
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#ac331c]">
              Up Next
            </span>
            <p className="text-xs text-[#261812] truncate font-semibold">
              Pop {data.balloons.length} surprise balloons from {data.senderName}
            </p>
          </div>
        </div>
        <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#786155] shrink-0 shadow-xs">
          <span className="material-symbols-outlined text-[15px]">lock</span>
        </div>
      </div>

      {/* Quote */}
      <p className="text-center text-xs italic text-[#786155] px-4">
        “May this chapter bring you all the warmth you give to everyone around you.”
      </p>
    </div>
  );
};
