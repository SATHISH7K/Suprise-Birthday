import React, { useState } from 'react';
import { BalloonItem } from '../../types';
import { playPopSound } from '../../utils/sound';
import { fireConfetti } from '../../utils/confetti';

interface StarryBalloonsSceneProps {
  balloons: BalloonItem[];
  onNext: () => void;
}

export const StarryBalloonsScene: React.FC<StarryBalloonsSceneProps> = ({
  balloons,
  onNext,
}) => {
  // Array of boolean popped states
  const [poppedIds, setPoppedIds] = useState<Record<string, boolean>>({});

  const balloonColors = [
    { bg: 'from-[#ff8da1] to-[#ff597b]', knot: '#ff597b' },
    { bg: 'from-[#ffd56b] to-[#f59e0b]', knot: '#f59e0b' },
    { bg: 'from-[#c084fc] to-[#a855f7]', knot: '#a855f7' },
    { bg: 'from-[#7dd3fc] to-[#38bdf8]', knot: '#38bdf8' },
    { bg: 'from-[#fda4af] to-[#f43f5e]', knot: '#f43f5e' },
  ];

  const handlePopBalloon = (id: string, e?: React.MouseEvent) => {
    if (poppedIds[id]) return;
    setPoppedIds((prev) => ({ ...prev, [id]: true }));
    playPopSound();
    fireConfetti(e?.clientX || window.innerWidth / 2, e?.clientY || window.innerHeight * 0.35, 20);
  };

  const handlePopAllRemaining = () => {
    const nextState = { ...poppedIds };
    balloons.forEach((b) => {
      nextState[b.id] = true;
    });
    setPoppedIds(nextState);
    playPopSound();
    fireConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 35);
  };

  const poppedCount = Object.values(poppedIds).filter(Boolean).length;
  const allPopped = poppedCount === balloons.length;

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-b from-[#180a2b] via-[#24103d] to-[#120520] text-white flex flex-col items-center justify-between p-4 sm:p-6 select-none overflow-y-auto no-scrollbar">
      {/* Starry Night Sky Background with Stardust */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(40)].map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              width: `${(i % 3) + 1.5}px`,
              height: `${(i % 3) + 1.5}px`,
              left: `${(i * 17) % 100}%`,
              top: `${(i * 29) % 100}%`,
              opacity: (i % 4) * 0.2 + 0.25,
              animationDelay: `${(i * 0.23) % 3}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 text-center pt-4 sm:pt-6 max-w-md">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
          <span>Pop the balloons</span>
          <span>🎈</span>
        </h2>
        <p className="text-xs sm:text-sm text-pink-200/80 mt-1">
          {balloons.length} balloons. Each one holds a reason you're loved. Pop them all.
        </p>
      </div>

      {/* Floating Balloons Cluster */}
      <div className="relative z-10 w-full max-w-lg my-4 flex items-center justify-center gap-3 sm:gap-4 flex-wrap min-h-[170px]">
        {balloons.map((b, idx) => {
          const isPopped = Boolean(poppedIds[b.id]);
          const color = balloonColors[idx % balloonColors.length];

          if (isPopped) {
            return (
              <div
                key={b.id}
                className="w-16 h-20 flex flex-col items-center justify-center opacity-30 scale-75 transition-all"
              >
                <span className="text-xl">✨</span>
                <span className="text-[10px] text-pink-200 font-mono">#{idx + 1} Popped</span>
              </div>
            );
          }

          return (
            <div
              key={b.id}
              onClick={(e) => handlePopBalloon(b.id, e)}
              className="relative flex flex-col items-center cursor-pointer animate-gentle-bob active:scale-90 transition-transform group"
              style={{
                animationDelay: `${idx * 0.4}s`,
                animationDuration: `${2.8 + (idx % 3) * 0.4}s`,
              }}
              title="Tap to pop!"
            >
              {/* Balloon Oval */}
              <div
                className={`w-16 h-20 sm:w-20 sm:h-24 rounded-[50%_50%_50%_50%_/_45%_45%_55%_55%] bg-gradient-to-br ${color.bg} shadow-[0_12px_24px_rgba(0,0,0,0.35)] flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform`}
              >
                {/* Shiny highlight */}
                <div className="absolute top-2 left-2.5 w-4 h-6 rounded-[50%] bg-white/40 rotate-[-25deg] blur-[0.5px]" />
                <span className="text-base sm:text-lg font-bold text-white drop-shadow-sm">
                  {idx + 1}
                </span>
              </div>

              {/* Knot */}
              <div
                className="w-2.5 h-1.5 -mt-0.5 rounded-b-xs"
                style={{ backgroundColor: color.knot }}
              />

              {/* String */}
              <svg className="w-4 h-6 text-white/40 -mt-0.5" viewBox="0 0 16 24" fill="none">
                <path d="M8 0 C6 6 10 12 8 24" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </div>
          );
        })}
      </div>

      {/* Popped Reasons List (Slide up from below) */}
      <div className="relative z-10 w-full max-w-md flex flex-col gap-2.5 mb-4">
        {balloons.map((b, idx) => {
          const isPopped = Boolean(poppedIds[b.id]);
          if (!isPopped) return null;

          return (
            <div
              key={b.id}
              className="w-full p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md flex flex-col gap-1 animate-bloom"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#ffd56b] flex items-center gap-1">
                  <span>REASON NO. {idx + 1}</span>
                  <span>💛</span>
                </span>
                <span className="text-[10px] text-pink-200/60 font-mono">#{idx + 1}</span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-white/95 leading-snug">
                "{b.text}"
              </p>
            </div>
          );
        })}

        {/* When all are popped */}
        {allPopped && (
          <div className="w-full text-center py-2 animate-fadeIn">
            <p className="text-sm font-serif italic text-pink-200 drop-shadow-sm">
              ...and a thousand more reasons 💖
            </p>
          </div>
        )}
      </div>

      {/* Bottom CTA Button */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-2 pb-4">
        {allPopped ? (
          <button
            type="button"
            onClick={onNext}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#ffd56b] to-[#f59e0b] text-[#180a2b] font-bold text-sm sm:text-base shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer animate-pulse"
          >
            <span>Keep going</span>
            <span>💛 →</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePopAllRemaining}
            className="w-full py-3 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs sm:text-sm font-semibold active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Pop all balloons ({poppedCount}/{balloons.length})</span>
            <span>🎈</span>
          </button>
        )}
      </div>
    </div>
  );
};
