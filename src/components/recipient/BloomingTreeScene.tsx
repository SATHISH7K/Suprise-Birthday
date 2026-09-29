import React, { useState, useEffect } from 'react';
import { playChime } from '../../utils/sound';

interface BloomingTreeSceneProps {
  recipientName: string;
  onNext: () => void;
}

export const BloomingTreeScene: React.FC<BloomingTreeSceneProps> = ({
  recipientName,
  onNext,
}) => {
  const [bloomed, setBloomed] = useState(false);

  useEffect(() => {
    // Start tree blooming animation
    const timer = setTimeout(() => {
      setBloomed(true);
      playChime([523.25, 659.25, 783.99, 1046.5], 0.08, 0.25);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Pre-calculated coordinates forming a full lush heart-shaped crown canopy
  const heartLeaves = [
    // Center heart crown
    { x: 50, y: 35, s: 1.1, c: '#ff5c8a', d: 0.1 },
    { x: 45, y: 30, s: 0.9, c: '#ff85a2', d: 0.2 },
    { x: 55, y: 30, s: 0.95, c: '#ffa3b8', d: 0.25 },
    { x: 40, y: 24, s: 1.05, c: '#ff4d79', d: 0.3 },
    { x: 60, y: 24, s: 1.0, c: '#fca5a5', d: 0.35 },
    { x: 34, y: 18, s: 0.85, c: '#ff7096', d: 0.4 },
    { x: 66, y: 18, s: 0.9, c: '#ff85a2', d: 0.45 },
    { x: 28, y: 22, s: 0.8, c: '#fecdd3', d: 0.5 },
    { x: 72, y: 22, s: 0.85, c: '#fda4af', d: 0.52 },
    { x: 24, y: 28, s: 0.75, c: '#ff4d79', d: 0.55 },
    { x: 76, y: 28, s: 0.8, c: '#fb7185', d: 0.58 },
    { x: 30, y: 34, s: 0.95, c: '#f43f5e', d: 0.6 },
    { x: 70, y: 34, s: 0.9, c: '#fda4af', d: 0.62 },
    { x: 38, y: 40, s: 1.0, c: '#ff5c8a', d: 0.65 },
    { x: 62, y: 40, s: 0.95, c: '#fecdd3', d: 0.68 },
    { x: 44, y: 46, s: 1.05, c: '#e11d48', d: 0.7 },
    { x: 56, y: 46, s: 1.0, c: '#ff7096', d: 0.72 },
    { x: 50, y: 52, s: 0.9, c: '#fda4af', d: 0.75 },
    // Fillers for heart shape
    { x: 48, y: 20, s: 0.7, c: '#fff1f2', d: 0.3 },
    { x: 52, y: 20, s: 0.75, c: '#ffd56b', d: 0.32 },
    { x: 42, y: 14, s: 0.8, c: '#ff85a2', d: 0.4 },
    { x: 58, y: 14, s: 0.8, c: '#ffa3b8', d: 0.42 },
    { x: 35, y: 12, s: 0.7, c: '#fecdd3', d: 0.48 },
    { x: 65, y: 12, s: 0.75, c: '#ff5c8a', d: 0.5 },
    { x: 50, y: 12, s: 0.8, c: '#ffe4e6', d: 0.45 },
    { x: 48, y: 27, s: 1.0, c: '#f43f5e', d: 0.35 },
    { x: 52, y: 27, s: 0.95, c: '#ff7096', d: 0.38 },
  ];

  return (
    <div
      onClick={onNext}
      className="fixed inset-0 w-full h-full bg-[#fdf8f5] flex flex-col items-center justify-between p-6 select-none cursor-pointer overflow-hidden transition-all"
    >
      {/* Soft Ambient Floating Glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-[#fecdd3]/40 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-96 h-96 rounded-full bg-[#fed7aa]/35 blur-3xl pointer-events-none" />

      {/* Floating Sparkles in the air */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="absolute text-xs sm:text-sm text-[#ff85a2] animate-twinkle opacity-70"
            style={{
              left: `${10 + (i * 7.5) % 80}%`,
              top: `${15 + (i * 6.5) % 70}%`,
              animationDelay: `${i * 0.35}s`,
            }}
          >
            {i % 2 === 0 ? '🌸' : '✨'}
          </span>
        ))}
      </div>

      {/* Content Layout: Text on Left / Top & Tree Center */}
      <div className="relative z-10 w-full max-w-4xl flex-1 flex flex-col md:flex-row items-center justify-around gap-6 pt-6 sm:pt-10">
        {/* Left Side: Dedication Banner */}
        <div className="text-center md:text-left max-w-sm shrink-0">
          <p className="text-xs sm:text-sm text-[#8a5b51] font-medium tracking-widest uppercase mb-1">
            it's officially your day
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#c20b57] tracking-tight leading-tight">
            Happy Birthday,
            <span className="block text-[#e11d48]">{recipientName || 'Beautiful'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#8c655d] mt-2 font-serif italic">
            here's to a year that blooms with joy &amp; magic 🌸
          </p>
        </div>

        {/* Right / Center: The Blooming Heart Tree */}
        <div className="relative w-72 h-80 sm:w-80 sm:h-96 flex items-center justify-center shrink-0">
          {/* Tree SVG Trunk & Branches */}
          <svg
            className="w-full h-full drop-shadow-sm"
            viewBox="0 0 100 100"
            fill="none"
          >
            {/* Trunk */}
            <path
              d="M50 95 L50 62 Q50 55 46 50 Q40 44 32 36 M50 60 Q50 53 54 48 Q60 42 68 36 M50 56 L50 42 Q49 35 45 28 M50 48 Q52 38 55 30"
              stroke="#5a3328"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          </svg>

          {/* Blossoming Heart Crown Leaf Elements */}
          {bloomed && (
            <div className="absolute inset-0 pointer-events-none">
              {heartLeaves.map((leaf, idx) => (
                <div
                  key={idx}
                  className="absolute animate-bloom"
                  style={{
                    left: `${leaf.x}%`,
                    top: `${leaf.y}%`,
                    transform: `translate(-50%, -50%) scale(${leaf.s})`,
                    animationDelay: `${leaf.d}s`,
                  }}
                >
                  <svg
                    className="w-6 h-6 drop-shadow-sm"
                    viewBox="0 0 24 24"
                    fill={leaf.c}
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Pill */}
      <div className="relative z-10 w-full flex justify-center pb-4">
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-3 rounded-full bg-[#c20b57] hover:bg-[#a00947] text-white text-xs sm:text-sm font-semibold shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>First things first</span>
          <span>🎂 ✨</span>
        </button>
      </div>
    </div>
  );
};
