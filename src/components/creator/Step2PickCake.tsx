import React from 'react';
import { SurpriseData } from '../../types';
import { CAKE_OPTIONS } from '../../defaultData';

interface Step2Props {
  data: SurpriseData;
  onChange: (updates: Partial<SurpriseData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2PickCake: React.FC<Step2Props> = ({ data, onChange, onNext, onBack }) => {
  const selectedCake = CAKE_OPTIONS.find((c) => c.id === data.cake) || CAKE_OPTIONS[0];

  return (
    <div className="flex flex-col w-full items-center justify-start py-8 px-4 relative select-none">
      {/* Subtle ambient glows */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#ff6f52]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-[#ffc329]/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Stepper Progress */}
      <div className="flex flex-col items-center gap-1.5 mb-6">
        <div className="flex items-center gap-4">
          {/* Step 1 Completed */}
          <div className="flex flex-col items-center group cursor-pointer" onClick={onBack}>
            <span className="text-[20px] transition-transform duration-300 group-hover:scale-110 opacity-70">🎈</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ac331c]/50 mt-0.5" />
          </div>
          {/* Step 2 Active */}
          <div className="flex flex-col items-center relative scale-110">
            <span className="text-[22px] drop-shadow-[0_4px_10px_rgba(255,111,82,0.45)] animate-bounce" style={{ animationDuration: '2.2s' }}>
              🎈
            </span>
            <span className="w-2 h-2 rounded-full bg-[#ac331c] mt-0.5 shadow-[0_0_8px_rgba(172,51,28,0.8)]" />
          </div>
          {/* Step 3 */}
          <div className="flex flex-col items-center opacity-30">
            <span className="text-[18px] grayscale">🎈</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#786155]/30 mt-0.5" />
          </div>
          {/* Step 4 */}
          <div className="flex flex-col items-center opacity-30">
            <span className="text-[18px] grayscale">🎈</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#786155]/30 mt-0.5" />
          </div>
          {/* Step 5 */}
          <div className="flex flex-col items-center opacity-30">
            <span className="text-[18px] grayscale">🎈</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#786155]/30 mt-0.5" />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#786155] font-medium mt-1">
          <span className="text-[#ac331c] font-semibold">Step 2</span>
          <span>of 5</span>
          <span className="inline-block w-1 h-1 rounded-full bg-[#786155]/40" />
          <span className="text-[#261812] font-semibold">Pick Cake</span>
        </div>
      </div>

      {/* Primary Stage Card */}
      <div className="w-full max-w-[480px] bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_20px_50px_-10px_rgba(120,97,85,0.12),0_4px_16px_rgba(120,97,85,0.04)] border border-[#fce8dc] relative transition-all duration-300">
        {/* Stage Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-[#fee3d8] flex items-center justify-center text-[28px] mb-2 shadow-[0_6px_16px_rgba(254,227,216,0.8)] transform hover:scale-105 transition-transform duration-200">
            🎂
          </div>
          <h1 className="text-2xl font-bold text-[#261812] tracking-tight mb-1">
            Pick their cake
          </h1>
          <p className="text-sm text-[#786155] max-w-xs">
            They'll light it, wish on it, and cut it. ✨
          </p>
        </div>

        {/* Live Cake Spotlight Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-[#fff1ec] transition-all duration-300 flex items-center gap-4 shadow-xs">
          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative bg-[#ffe9e1] shadow-inner">
            <img
              src={selectedCake.thumb}
              alt={selectedCake.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {data.virtualCandles && (
              <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-[#F59E0B] shadow-[0_0_8px_#F59E0B] animate-ping opacity-90" />
            )}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-[#ac331c] tracking-wider">
                {selectedCake.flavorBadge}
              </span>
              <span className={`text-xs font-medium flex items-center gap-1 ${data.virtualCandles ? 'text-[#F59E0B]' : 'text-[#786155]'}`}>
                <span className="material-symbols-outlined text-[16px]">
                  {data.virtualCandles ? 'local_fire_department' : 'mode_standby'}
                </span>
                <span>{data.virtualCandles ? 'Lit 🕯️' : 'Unlit'}</span>
              </span>
            </div>
            <div className="font-semibold text-base text-[#261812] truncate mt-0.5">
              {selectedCake.title}
            </div>
            <p className="text-xs text-[#786155] line-clamp-1 mt-0.5">
              {selectedCake.ingredients}
            </p>
          </div>
        </div>

        {/* Interactive 3-Card Cake Selector */}
        <div className="space-y-3 mb-6">
          {CAKE_OPTIONS.map((c) => {
            const isSelected = data.cake === c.id;
            return (
              <div
                key={c.id}
                onClick={() => onChange({ cake: c.id })}
                className={`relative flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200 shadow-[0_2px_12px_rgba(120,97,85,0.06)] ${
                  isSelected
                    ? 'ring-2 ring-[#ac331c] bg-[#fff1ec]/70'
                    : 'bg-white hover:bg-[#fff1ec]/30'
                }`}
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 relative bg-[#ffe9e1]">
                  <img
                    src={c.img}
                    alt={c.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span className="absolute bottom-1 left-1.5 text-[14px]">{c.emoji}</span>
                </div>

                <div className="flex flex-col flex-1 min-w-0 pr-6">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm sm:text-base text-[#261812]">{c.title}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#fee3d8] text-[10px] font-bold uppercase text-[#59413c] shrink-0">
                      {c.tag}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm text-[#59413c] font-medium">{c.sub}</span>
                  <span className="text-xs text-[#786155] line-clamp-1 mt-0.5">{c.desc}</span>
                </div>

                <div
                  className={`absolute top-3.5 right-3.5 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#ac331c] text-white shadow-[0_2px_8px_rgba(172,51,28,0.4)]'
                      : 'bg-[#fee3d8] text-[#786155]/40'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] font-bold">
                    {isSelected ? 'check' : 'circle'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Candle & Sparkle Toggle Card */}
        <div className="mb-8 p-4 rounded-2xl bg-[#fee3d8]/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ffe9e1] flex items-center justify-center text-[18px]">
              🕯️
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-[#261812]">Light virtual candles</span>
              <span className="text-xs text-[#786155]">They'll blow them out by blowing into the microphone</span>
            </div>
          </div>

          {/* Pill Toggle */}
          <button
            type="button"
            role="switch"
            aria-checked={data.virtualCandles}
            onClick={() => onChange({ virtualCandles: !data.virtualCandles })}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${
              data.virtualCandles ? 'bg-[#ff6f52]' : 'bg-[#efd4ca]'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                data.virtualCandles ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="h-14 px-6 rounded-full bg-[#fff1ec] hover:bg-[#fee3d8] text-[#786155] hover:text-[#261812] font-semibold text-sm flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 shrink-0 shadow-xs"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            className="h-14 flex-1 rounded-full bg-gradient-to-r from-[#FB923C] to-[#F43F5E] text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-1.5 shadow-[0_10px_24px_-4px_rgba(255,111,82,0.38)] hover:shadow-[0_14px_30px_-2px_rgba(255,111,82,0.48)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <span>Continue</span>
            <span>🎈</span>
          </button>
        </div>
      </div>

      {/* Intimate Helper Note */}
      <div className="mt-6 flex items-center gap-1.5 text-[#786155] text-xs max-w-sm text-center justify-center">
        <span className="material-symbols-outlined text-[16px] text-[#ac331c]">magic_button</span>
        <span>You can preview the slice-cutting interaction in Step 6</span>
      </div>
    </div>
  );
};
