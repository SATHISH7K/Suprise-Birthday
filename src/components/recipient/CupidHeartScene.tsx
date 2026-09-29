import React, { useState, useRef } from 'react';
import { playChime } from '../../utils/sound';

interface CupidHeartSceneProps {
  onNext: () => void;
  onStartSoundtrack?: () => void;
}

export const CupidHeartScene: React.FC<CupidHeartSceneProps> = ({
  onNext,
  onStartSoundtrack,
}) => {
  const [shot, setShot] = useState(false);
  const [hit, setHit] = useState(false);
  const [pullProgress, setPullProgress] = useState(0); // 0 to 1
  const isDraggingRef = useRef(false);

  const triggerShot = () => {
    if (shot) return;
    setShot(true);
    if (onStartSoundtrack) {
      onStartSoundtrack();
    }
    playChime([440, 554.37, 659.25], 0.05, 0.25);

    // Arrow flight takes ~450ms to hit heart
    setTimeout(() => {
      setHit(true);
      playChime([659.25, 830.61, 987.77, 1318.51], 0.06, 0.3);
      // Wait for heart burst animation, then advance to Scene 2
      setTimeout(() => {
        onNext();
      }, 1200);
    }, 450);
  };

  return (
    <div
      className="fixed inset-0 w-full h-full bg-[#fdf8f5] flex flex-col items-center justify-between py-10 px-4 select-none overflow-hidden"
      onPointerUp={() => {
        if (isDraggingRef.current && !shot) {
          isDraggingRef.current = false;
          triggerShot();
        }
      }}
    >
      {/* Soft Ambient Radial Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[520px] h-[520px] rounded-full bg-gradient-to-r from-[#ff9bb2]/35 via-[#ff6584]/25 to-[#ffc3a0]/30 blur-3xl" />
      </div>

      {/* Top Header */}
      <div className="relative z-10 text-center pt-4 sm:pt-6">
        <p className="text-xl sm:text-2xl font-serif italic text-[#633e38] tracking-wide">
          a little something, for you
        </p>
      </div>

      {/* Central Glowing 3D Pink Heart */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full">
        <div className="relative flex items-center justify-center">
          {/* Heart Glow Behind */}
          <div
            className={`absolute w-56 h-56 rounded-full bg-[#ff4d79]/30 blur-2xl transition-all duration-500 ${
              hit ? 'scale-150 bg-[#ff2664]/50' : 'animate-pulse'
            }`}
          />

          {/* 3D Heart SVG */}
          <div
            className={`relative transition-transform duration-300 ${
              hit ? 'scale-110' : 'animate-heart-beat'
            }`}
          >
            <svg
              className="w-44 h-44 sm:w-52 sm:h-52 drop-shadow-[0_20px_35px_rgba(255,77,121,0.45)]"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="heartGrad" x1="20%" y1="10%" x2="80%" y2="90%">
                  <stop offset="0%" stopColor="#ff7597" />
                  <stop offset="50%" stopColor="#ff4371" />
                  <stop offset="100%" stopColor="#e61c53" />
                </linearGradient>
                <radialGradient id="heartHighlight" cx="35%" cy="30%" r="40%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                  <stop offset="60%" stopColor="#ff8ea8" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#ff4371" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Heart Shape */}
              <path
                d="M50 88 C20 68 8 50 8 32 C8 17 20 8 33 8 C41 8 47 13 50 18 C53 13 59 8 67 8 C80 8 92 17 92 32 C92 50 80 68 50 88 Z"
                fill="url(#heartGrad)"
              />
              {/* Gloss Highlight */}
              <ellipse cx="36" cy="28" rx="14" ry="9" fill="url(#heartHighlight)" />
            </svg>

            {/* Embedded Arrow after Hit */}
            {hit && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-4 pointer-events-none rotate-[-35deg] animate-pulse">
                {/* Golden Arrow shaft through heart */}
                <div className="w-full h-1 bg-gradient-to-r from-[#d99b26] via-[#ffd56b] to-[#d99b26] rounded-full shadow-md relative">
                  {/* Pink Arrowhead */}
                  <div className="absolute -right-2 -top-1.5 w-0 h-0 border-y-4 border-y-transparent border-l-8 border-l-[#ff2a5f]" />
                  {/* Feathers */}
                  <div className="absolute left-0 -top-2 flex gap-0.5">
                    <span className="w-1.5 h-4 bg-[#ffd56b] skew-x-[-20deg] rounded-xs" />
                    <span className="w-1.5 h-4 bg-[#ff4d79] skew-x-[-20deg] rounded-xs" />
                  </div>
                </div>
              </div>
            )}

            {/* Floating Mini Hearts on Hit */}
            {hit && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(16)].map((_, i) => (
                  <span
                    key={i}
                    className="absolute text-lg sm:text-xl text-[#ff3366] animate-bloom"
                    style={{
                      left: `${45 + (Math.random() * 40 - 20)}%`,
                      top: `${40 + (Math.random() * 40 - 20)}%`,
                      animationDelay: `${i * 0.06}s`,
                      transform: `translate(${(i - 8) * 18}px, ${-40 - i * 10}px) scale(${0.7 + (i % 3) * 0.3})`,
                      opacity: 0,
                    }}
                  >
                    ❤️
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lower Cupid's Bow & Arrow Controller */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center pb-6">
        <div
          onClick={triggerShot}
          onPointerDown={() => {
            isDraggingRef.current = true;
            setPullProgress(0.8);
          }}
          onPointerLeave={() => {
            if (isDraggingRef.current && !shot) {
              isDraggingRef.current = false;
              triggerShot();
            }
          }}
          className="relative w-44 h-40 cursor-pointer active:scale-95 transition-transform group flex items-center justify-center"
          title="Tap or pull to shoot arrow at the heart"
        >
          {/* Animated Arrow in Bow */}
          <div
            className={`absolute left-6 bottom-8 origin-bottom-left transition-all duration-500 ${
              shot
                ? 'translate-x-[220px] translate-y-[-240px] rotate-[32deg] opacity-0'
                : 'rotate-[40deg]'
            }`}
            style={{
              transform: !shot && pullProgress > 0 ? 'translate(-8px, 8px) rotate(38deg)' : undefined,
            }}
          >
            {/* The Arrow */}
            <div className="relative w-28 h-2 flex items-center">
              {/* Arrow shaft */}
              <div className="w-full h-1 bg-[#8c5825] rounded-full shadow-sm" />
              {/* Feathers */}
              <div className="absolute left-0 -top-1.5 flex gap-0.5">
                <span className="w-1.5 h-3 bg-[#f59e0b] skew-x-[-25deg] rounded-xs" />
                <span className="w-1.5 h-3 bg-[#f43f5e] skew-x-[-25deg] rounded-xs" />
              </div>
              {/* Arrowhead */}
              <div className="absolute -right-2 -top-1.5 w-0 h-0 border-y-4 border-y-transparent border-l-8 border-l-[#f43f5e]" />
            </div>
          </div>

          {/* Wooden Bow SVG */}
          <svg
            className="w-32 h-32 text-[#8c5825] drop-shadow-md"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
          >
            {/* Bow stave */}
            <path
              d="M20 80 Q60 50 80 20"
              stroke="#73431a"
              strokeWidth="4"
            />
            {/* Bowstring */}
            <path
              d={pullProgress > 0 && !shot ? 'M20 80 L40 60 L80 20' : 'M20 80 L80 20'}
              stroke="#e2cfbc"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        {/* Text Instruction */}
        <p className="mt-2 text-xs uppercase tracking-[0.25em] font-semibold text-[#8c6760] flex items-center gap-1.5 animate-pulse">
          <span>PULL &amp; RELEASE</span>
          <span>💘</span>
        </p>
        <span className="text-[11px] text-[#aa8780] mt-0.5">
          Tap the bow to release the love arrow
        </span>
      </div>
    </div>
  );
};
