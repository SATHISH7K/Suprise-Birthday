import React, { useState, useEffect } from 'react';
import { SurpriseData } from '../../types';
import { PARCEL_BOX_IMG } from '../../defaultData';
import { fireConfetti } from '../../utils/confetti';
import { playUnwrapSound } from '../../utils/sound';

interface RecipientGiftBoxProps {
  data: SurpriseData;
  onNext: () => void;
  isSoundOn: boolean;
  onToggleSound: () => void;
}

export const RecipientGiftBox: React.FC<RecipientGiftBoxProps> = ({
  data,
  onNext,
  isSoundOn,
  onToggleSound,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(14 * 60 + 38);
  const [unwrapped, setUnwrapped] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(secondsLeft / 3600);
  const mins = Math.floor((secondsLeft % 3600) / 60);
  const secs = secondsLeft % 60;

  const handleUnwrap = (e?: React.MouseEvent) => {
    if (unwrapped) {
      onNext();
      return;
    }
    setUnwrapped(true);
    playUnwrapSound();
    fireConfetti(e?.clientX, e?.clientY, 32);
  };

  return (
    <div className="flex flex-col w-full relative overflow-hidden select-none pb-12 pt-2 px-4 max-w-[440px] mx-auto">
      {/* Soft Ambient Floating Glows and Shimmering Particles */}
      <div className="absolute -top-12 left-1/4 w-72 h-72 rounded-full bg-[#FB923C]/20 blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute top-1/3 -right-16 w-80 h-80 rounded-full bg-[#ff6f52]/20 blur-3xl pointer-events-none" />
      <div className="absolute top-2/3 -left-12 w-64 h-64 rounded-full bg-[#ffdf9f]/25 blur-3xl pointer-events-none" />

      {/* Floating Animated Sparkles & Twinkle Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <span className="absolute top-24 left-6 text-sm animate-twinkle text-[#F59E0B]">✦</span>
        <span className="absolute top-36 right-8 text-xs animate-twinkle text-[#FB923C]" style={{ animationDelay: '1.1s' }}>★</span>
        <span className="absolute top-72 left-8 text-xs animate-twinkle text-[#F43F5E]" style={{ animationDelay: '0.6s' }}>✨</span>
        <span className="absolute top-80 right-10 text-base animate-twinkle text-[#F59E0B]" style={{ animationDelay: '1.8s' }}>✦</span>
        <span className="absolute bottom-40 left-12 text-sm animate-twinkle text-[#FB923C]" style={{ animationDelay: '1.4s' }}>★</span>
        <span className="absolute bottom-28 right-8 text-xs animate-twinkle text-[#F43F5E]" style={{ animationDelay: '0.9s' }}>✨</span>
      </div>

      {/* Top Header Row for Recipient Screen */}
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
          <span className="text-[11px] font-medium text-[#59413c] truncate max-w-[110px]">
            {isSoundOn ? (data.soundtrack === 'blue' ? 'Blue 🎵' : 'Acoustic Sunset') : 'Muted'}
          </span>
        </button>
      </div>

      {/* Top Dedication Pill Badge */}
      <div className="flex justify-center mb-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fee3d8]/90 shadow-xs backdrop-blur-md border border-[#fce8dc]">
          <span className="text-[14px]">🎀</span>
          <span className="text-xs font-medium text-[#261812] tracking-wide">
            A surprise for <strong className="text-[#ac331c] font-bold">{data.recipientName}</strong>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#F43F5E] animate-ping" />
        </div>
      </div>

      {/* Festive Headline */}
      <div className="text-center w-full mb-5">
        <h1 className="text-2xl sm:text-[26px] font-bold text-[#261812] tracking-tight mb-1">
          The magic unlocks at midnight
        </h1>
        <p className="text-xs sm:text-sm text-[#59413c] max-w-[320px] mx-auto leading-relaxed italic">
          “Some things are worth the wait. This is one of them.”
        </p>
        <div className="inline-flex items-center gap-1 mt-1.5 px-3 py-0.5 rounded-full bg-[#fff1ec] text-[#786155] text-[10px] font-bold uppercase tracking-wider border border-[#fce8dc]">
          <span>12:00 AM sharp for maximum happy tears</span>
          <span className="text-xs">🥹</span>
        </div>
      </div>

      {/* Countdown Timer Display */}
      <div className="w-full bg-white/90 backdrop-blur-xl rounded-3xl p-4 shadow-[0_12px_32px_-8px_rgba(120,97,85,0.12)] border border-[#fce8dc] mb-5">
        <div className="flex items-center justify-between gap-1 text-center">
          {/* Hours Box */}
          <div className="flex-1 bg-[#fff1ec]/80 py-2.5 px-1 rounded-2xl flex flex-col items-center">
            <span className="text-3xl font-bold text-[#ac331c] font-mono tracking-tight">
              {String(hours).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-bold text-[#59413c] uppercase mt-0.5 tracking-wider">
              Hours
            </span>
          </div>

          <div className="flex flex-col gap-1 items-center justify-center pb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FB923C] animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#F43F5E] animate-bounce" style={{ animationDelay: '150ms' }} />
          </div>

          {/* Mins Box */}
          <div className="flex-1 bg-[#fff1ec]/80 py-2.5 px-1 rounded-2xl flex flex-col items-center">
            <span className="text-3xl font-bold text-[#ac331c] font-mono tracking-tight">
              {String(mins).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-bold text-[#59413c] uppercase mt-0.5 tracking-wider">
              Mins
            </span>
          </div>

          <div className="flex flex-col gap-1 items-center justify-center pb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FB923C] animate-bounce" style={{ animationDelay: '100ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#F43F5E] animate-bounce" style={{ animationDelay: '250ms' }} />
          </div>

          {/* Secs Box */}
          <div className="flex-1 bg-[#fff1ec]/80 py-2.5 px-1 rounded-2xl flex flex-col items-center relative overflow-hidden">
            <span className="text-3xl font-bold text-[#F43F5E] font-mono tracking-tight">
              {String(secs).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-bold text-[#59413c] uppercase mt-0.5 tracking-wider">
              Secs
            </span>
            <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-[#FB923C] to-[#F43F5E]" />
          </div>
        </div>

        {/* Live status subtitle */}
        <div className="mt-3 pt-1 flex items-center justify-center gap-1.5 text-center">
          <span className="material-symbols-outlined text-[14px] text-[#F59E0B]">auto_awesome</span>
          <span className="text-xs text-[#786155] font-medium">
            Synchronized for midnight celebration
          </span>
        </div>
      </div>

      {/* Interactive Tactile Gift Box Container */}
      <div className="relative w-full flex flex-col items-center justify-center mb-6">
        {/* Ambient Backglow */}
        <div
          className={`absolute w-52 h-52 rounded-full bg-gradient-to-tr from-[#FB923C]/30 to-[#F43F5E]/30 blur-2xl transition-all duration-700 pointer-events-none ${
            unwrapped ? 'scale-125 from-[#F59E0B]/40 to-[#F43F5E]/50' : 'scale-100'
          }`}
        />

        {/* Sparkle icons */}
        <div className="absolute -top-3 left-8 pointer-events-none text-[#F59E0B] animate-pulse">
          <span className="material-symbols-outlined text-[20px]">star</span>
        </div>
        <div className="absolute top-8 right-6 pointer-events-none text-[#FB923C] animate-bounce">
          <span className="material-symbols-outlined text-[18px]">celebration</span>
        </div>

        {/* The Parcel Card */}
        <div
          onClick={(e) => handleUnwrap(e)}
          className={`relative z-10 w-64 h-64 bg-white rounded-3xl p-3.5 shadow-[0_20px_44px_-10px_rgba(120,97,85,0.18)] border border-[#fce8dc] cursor-pointer active:scale-95 transition-all duration-300 flex flex-col items-center justify-center group overflow-hidden ${
            !unwrapped ? 'animate-gentle-bob hover:scale-102' : ''
          }`}
        >
          <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#fee3d8] flex items-center justify-center">
            <img
              src={PARCEL_BOX_IMG}
              alt="Artisanal birthday gift parcel"
              className={`w-full h-full object-cover transition-transform duration-500 ${
                unwrapped ? 'scale-110 filter brightness-105' : 'group-hover:scale-105'
              }`}
              referrerPolicy="no-referrer"
            />

            {/* Ribbon Overlay (hides when unwrapped) */}
            {!unwrapped && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex flex-col justify-end p-3 pointer-events-none transition-opacity duration-300">
                <div className="flex items-center justify-between text-white drop-shadow-md">
                  <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">touch_app</span>
                    Touch to pull ribbon
                  </span>
                  <span className="text-xs">🎁</span>
                </div>
              </div>
            )}

            {/* Unwrapped celebratory state */}
            {unwrapped && (
              <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-[#ffe9e1]/95 to-white/95 p-4 flex flex-col items-center justify-center text-center animate-fadeIn">
                <div className="w-14 h-14 rounded-full bg-[#ffc329]/30 flex items-center justify-center mb-2 animate-bounce">
                  <span className="material-symbols-outlined text-[32px] text-[#ac331c]">
                    redeem
                  </span>
                </div>
                <p className="text-lg font-bold text-[#ac331c] leading-tight">
                  It's Unwrapped! 🎉
                </p>
                <p className="text-xs text-[#59413c] mt-1 font-medium">
                  Ready to step into your birthday surprise
                </p>
              </div>
            )}
          </div>

          {/* Pull Tag Affordance */}
          {!unwrapped && (
            <div className="absolute -top-1.5 px-3 py-0.5 rounded-full bg-[#ffc329] shadow-md text-[#6f5100] text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 group-hover:scale-105 transition-transform">
              <span>Pull ribbon</span>
              <span className="material-symbols-outlined text-[12px]">keyboard_arrow_up</span>
            </div>
          )}
        </div>

        {/* Micro prompt */}
        <p className="text-xs text-[#786155] mt-3 flex items-center gap-1.5 font-medium">
          {unwrapped ? (
            <span className="text-[#ac331c] font-bold">✨ Ribbon Pulled! Tap below to open chapters</span>
          ) : (
            <>
              <span className="text-[#FB923C]">👆</span>
              <span>Tap box or ribbon for a quick peek 💖</span>
            </>
          )}
        </p>
      </div>

      {/* Primary Action Button */}
      <div className="w-full flex flex-col items-center gap-2 mb-4">
        <button
          type="button"
          onClick={(e) => handleUnwrap(e)}
          className="w-full h-14 rounded-full bg-gradient-to-r from-[#FB923C] to-[#F43F5E] text-white text-base font-semibold shadow-[0_12px_28px_-6px_rgba(255,111,82,0.42)] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
        >
          {unwrapped ? (
            <>
              <span>Open Birthday Chapters</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </>
          ) : (
            <>
              <span>Unwrap Surprise</span>
              <span className="text-lg">✨</span>
            </>
          )}
        </button>

        {/* Made with love badge */}
        <div className="flex items-center justify-center gap-1.5 py-1 px-4 rounded-full bg-[#fff1ec]/80 border border-[#fce8dc]">
          <span className="text-xs text-[#786155]">Made with love by</span>
          <span className="text-xs font-bold text-[#ac331c] flex items-center gap-1">
            {data.senderName}
            <span className="material-symbols-outlined text-[13px] text-[#F43F5E]">favorite</span>
          </span>
        </div>
      </div>

      {/* Footer Hint */}
      <div className="text-center px-4">
        <p className="text-xs text-[#8c716b] flex items-center justify-center gap-1.5">
          <span className="material-symbols-outlined text-[15px] text-[#786155]">headphones</span>
          <span>Sound on for full magic • Tap to unwrap and begin your story</span>
        </p>
      </div>
    </div>
  );
};
