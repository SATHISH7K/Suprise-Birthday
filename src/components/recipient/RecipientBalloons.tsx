import React, { useState } from 'react';
import { SurpriseData } from '../../types';
import { fireConfetti } from '../../utils/confetti';
import { playPopSound, playChime } from '../../utils/sound';

interface RecipientBalloonsProps {
  data: SurpriseData;
  onNext: () => void;
  isSoundOn: boolean;
  onToggleSound: () => void;
}

export const RecipientBalloons: React.FC<RecipientBalloonsProps> = ({
  data,
  onNext,
  isSoundOn,
  onToggleSound,
}) => {
  // Start with 1 already popped as in the mock, or user can pop all
  const [poppedMap, setPoppedMap] = useState<Record<string, boolean>>({
    [data.balloons[0]?.id || 'b1']: true,
  });

  const totalBalloons = data.balloons.length;
  const poppedCount = Object.values(poppedMap).filter(Boolean).length;
  const allPopped = poppedCount >= totalBalloons;

  const handlePop = (id: string, e?: React.MouseEvent) => {
    if (poppedMap[id]) return;
    playPopSound();
    fireConfetti(e?.clientX, e?.clientY, 26);
    setPoppedMap((prev) => ({ ...prev, [id]: true }));
  };

  const handlePopNextOrContinue = () => {
    if (allPopped) {
      playChime([523.25, 659.25, 783.99], 0.08, 0.25);
      onNext();
      return;
    }
    // Find first unpopped
    const nextUnpopped = data.balloons.find((b) => !poppedMap[b.id]);
    if (nextUnpopped) {
      handlePop(nextUnpopped.id);
    }
  };

  return (
    <div className="flex flex-col w-full relative overflow-hidden select-none pb-12 pt-2 px-4 max-w-[440px] mx-auto">
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
            {isSoundOn ? 'Acoustic Sunset' : 'Muted'}
          </span>
        </button>
      </div>

      {/* Progress Tracker */}
      <div className="flex flex-col items-center text-center mb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fee3d8] shadow-xs mb-2 border border-[#fce8dc]">
          <span className="text-xs">🎈</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#ac331c]">
            Step 2 of 4 • Pop the Balloons
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white shadow-xs mb-2 border border-[#fce8dc]">
          <span className={`w-2 h-2 rounded-full ${allPopped ? 'bg-emerald-500' : 'bg-[#F59E0B] animate-ping'}`} />
          <span className="text-xs font-semibold text-[#59413c]">
            {allPopped ? 'All Popped! 🎊 Memories Unlocked' : `${poppedCount} of ${totalBalloons} Popped 💥`}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-[#261812] tracking-tight mb-1">
          Pop each balloon! 🎈✨
        </h1>
        <p className="text-xs sm:text-sm text-[#59413c] max-w-[340px]">
          {data.senderName} hid reasons why you're adored behind each one. Tap a balloon to pop it and reveal your surprise note!
        </p>
      </div>

      {/* Interactive Balloon Canvas Stage */}
      <div className="relative w-full rounded-3xl bg-white border border-[#fce8dc] p-4 sm:p-5 shadow-xl flex flex-col gap-4 overflow-hidden mb-5">
        {data.balloons.map((b, idx) => {
          const isPopped = !!poppedMap[b.id];

          if (isPopped) {
            // Revealed Note Card
            return (
              <div
                key={b.id}
                className="w-full rounded-2xl bg-gradient-to-r from-[#ffe9e1] to-[#fff1ec] p-4 shadow-xs border border-[#fce8dc] transition-all animate-fadeIn"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#fee3d8] flex items-center justify-center shrink-0 shadow-inner">
                    <span className="text-base">💌</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold text-[#ac331c] tracking-wider">
                        Reason #{idx + 1} Unlocked
                      </span>
                      <span className="material-symbols-outlined text-[16px] text-[#ac331c]">
                        check_circle
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#261812] font-medium leading-relaxed italic">
                      "{b.text}"
                    </p>
                    <span className="block mt-1 text-[11px] text-[#786155] font-semibold">
                      — {data.senderName}
                    </span>
                  </div>
                </div>
              </div>
            );
          }

          // Unpopped 3D Floating Balloon
          return (
            <div key={b.id} className="w-full flex flex-col items-center py-2">
              <button
                type="button"
                onClick={(e) => handlePop(b.id, e)}
                className="relative group cursor-pointer flex flex-col items-center focus:outline-none transition-transform duration-200 active:scale-95 animate-gentle-bob"
              >
                {/* Pop Action Tag */}
                <div className="absolute -top-3 z-30 px-3 py-0.5 rounded-full bg-white shadow-md border border-[#fce8dc] flex items-center gap-1 scale-95 group-hover:scale-105 transition-transform">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FB923C] animate-ping" />
                  <span className="text-[10px] font-bold text-[#ac331c] tracking-wider uppercase">
                    Tap to Pop! 🎈
                  </span>
                </div>

                {/* Balloon Body */}
                <div className="relative w-28 h-32 rounded-[50%_50%_50%_50%_/_45%_45%_55%_55%] bg-gradient-to-br from-[#FB923C] via-[#ff6f52] to-[#F43F5E] shadow-lg flex items-center justify-center overflow-hidden">
                  {/* Gloss shine reflection */}
                  <div className="absolute top-3 left-4 w-7 h-10 rounded-[50%] bg-white/40 rotate-[-28deg] blur-[1px]" />
                  <div className="absolute top-2 left-6 w-2 h-3 rounded-[50%] bg-white/60 rotate-[-20deg]" />
                  <span className="text-2xl text-white font-bold drop-shadow-sm select-none">
                    {idx + 1}
                  </span>
                </div>

                {/* Knot */}
                <div className="w-3 h-2 bg-[#ac331c] -mt-0.5 rounded-b-xs" />

                {/* Trailing string */}
                <svg className="w-6 h-8 text-[#e0bfb8] -mt-0.5" fill="none" viewBox="0 0 24 32">
                  <path
                    d="M12 0 C12 8 8 16 14 24 C16 27 13 30 11 32"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          );
        })}

        {/* Micro hint pill */}
        <div className="flex items-center justify-center gap-1.5 py-1 px-3 rounded-full bg-[#fee3d8]/60 self-center text-[#59413c] text-[11px] font-medium border border-[#fce8dc]">
          <span className="material-symbols-outlined text-[14px]">volume_up</span>
          <span>Realistic pop sound &amp; confetti enabled</span>
        </div>
      </div>

      {/* Visual Memory Snapshot Teaser */}
      {data.photos[0] && (
        <div className="rounded-2xl bg-[#fff1ec] p-2.5 flex items-center gap-3 border border-[#fce8dc] shadow-xs mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#fee3d8] overflow-hidden relative shrink-0">
            <img
              src={data.photos[0].url}
              alt={data.photos[0].caption}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-[#ac331c] uppercase tracking-wider block">
              Sneak Peek
            </span>
            <p className="text-xs text-[#261812] font-medium truncate">
              Unlocked memory: {data.photos[0].caption}
            </p>
          </div>
          <span className="material-symbols-outlined text-[18px] text-[#ac331c] mr-1">
            photo_library
          </span>
        </div>
      )}

      {/* Action CTA & Next Chapter */}
      <div className="flex flex-col gap-2.5 mb-4">
        <button
          type="button"
          onClick={handlePopNextOrContinue}
          className="w-full h-14 rounded-full bg-gradient-to-r from-[#FB923C] to-[#F43F5E] text-white font-semibold text-sm sm:text-base shadow-[0_10px_24px_-4px_rgba(255,111,82,0.35)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {allPopped ? (
            <>
              <span>Continue to Photo Memories</span>
              <span>📸 ✨</span>
            </>
          ) : (
            <>
              <span>Pop All to Continue ({poppedCount}/{totalBalloons}) ✨</span>
            </>
          )}
        </button>

        {/* Up Next Sneak Peek */}
        <div
          className={`rounded-2xl p-3.5 shadow-xs flex items-center justify-between gap-3 border transition-all ${
            allPopped
              ? 'bg-[#fee3d8] border-[#ac331c]/30'
              : 'bg-white border-[#fce8dc]'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${allPopped ? 'bg-[#ac331c] text-white' : 'bg-[#fff1ec] text-[#786155]'}`}>
              <span className="material-symbols-outlined text-[20px]">photo_camera</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold text-[#786155] tracking-widest">
                  Up Next
                </span>
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold uppercase ${
                  allPopped ? 'bg-[#ffdad3] text-[#ac331c]' : 'bg-[#f8ddd2] text-[#786155]'
                }`}>
                  {allPopped ? 'Unlocked' : 'Locked'}
                </span>
              </div>
              <p className="text-xs font-semibold text-[#261812] truncate">
                A walk down memory lane
              </p>
            </div>
          </div>

          <span className="material-symbols-outlined text-[18px] text-[#786155]">
            {allPopped ? 'lock_open' : 'lock'}
          </span>
        </div>
      </div>

      {/* Footnote */}
      <p className="text-center text-xs italic text-[#786155] px-4">
        "Every little memory with you is worth celebrating forever."
      </p>
    </div>
  );
};
