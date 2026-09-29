import React, { useState, useEffect } from 'react';
import { SurpriseData } from '../../types';
import { CAKE_OPTIONS } from '../../defaultData';
import { playChime } from '../../utils/sound';

interface CraftingSurpriseIntroProps {
  data: SurpriseData;
  onComplete: () => void;
}

export const CraftingSurpriseIntro: React.FC<CraftingSurpriseIntroProps> = ({
  data,
  onComplete,
}) => {
  const [completedSteps, setCompletedSteps] = useState<number>(0);
  const selectedCake = CAKE_OPTIONS.find((c) => c.id === data.cake) || CAKE_OPTIONS[0];

  const steps = [
    { label: `Baking the ${selectedCake.title}`, emoji: '🎂' },
    { label: 'Lighting the candles', emoji: '🕯️' },
    { label: `Filling ${data.balloons.length || 5} balloons with your words`, emoji: '🎈' },
    { label: `Hanging ${data.photos.length || 1} memory on fairy lights`, emoji: '📸' },
    { label: 'Sealing your letter inside the card', emoji: '💌' },
  ];

  useEffect(() => {
    // Tick steps quickly to build anticipation
    const intervals = [350, 700, 1050, 1400, 1750];
    const timers = intervals.map((delay, index) =>
      setTimeout(() => {
        setCompletedSteps(index + 1);
        playChime([523.25 + index * 60], 0.04, 0.12);
      }, delay)
    );

    const finishTimer = setTimeout(() => {
      onComplete();
    }, 2200);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 w-full h-full bg-[#fcf6f2] flex items-center justify-center p-4 select-none z-50 animate-fadeIn">
      {/* Soft warm background glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-[#ffd8d0]/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-[#ffe8d6]/50 blur-3xl pointer-events-none" />

      {/* Center White Checklist Card */}
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(120,97,85,0.15)] border border-[#fce8dc] flex flex-col items-center text-center animate-bloom">
        <div className="w-14 h-14 rounded-2xl bg-[#fff0ea] flex items-center justify-center text-3xl mb-3 shadow-inner">
          🎂
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-[#261812] tracking-tight mb-4">
          Crafting {data.recipientName}'s surprise...
        </h2>

        {/* Steps Checklist */}
        <div className="w-full flex flex-col gap-2.5 text-left mb-5">
          {steps.map((st, idx) => {
            const isDone = completedSteps > idx;
            return (
              <div
                key={idx}
                className={`flex items-center gap-2.5 text-xs sm:text-sm font-medium transition-all duration-300 ${
                  isDone ? 'text-[#261812] opacity-100' : 'text-[#a38b82] opacity-40'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold transition-all ${
                    isDone
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-stone-100 text-stone-400'
                  }`}
                >
                  {isDone ? '✓' : '○'}
                </span>
                <span className="truncate">{st.label}</span>
                <span className="shrink-0">{st.emoji}</span>
              </div>
            );
          })}
        </div>

        {/* Signoff Footer */}
        <div className="w-full pt-3 border-t border-[#fce8dc] text-xs font-serif italic text-[#8c6760] flex items-center justify-center gap-1">
          <span>Signed with love —</span>
          <strong className="text-[#ac331c] font-bold not-italic">{data.senderName}</strong>
          <span>💖</span>
        </div>
      </div>
    </div>
  );
};
