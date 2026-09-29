import React, { useState } from 'react';
import { SurpriseData, BalloonItem } from '../../types';

interface Step3Props {
  data: SurpriseData;
  onChange: (updates: Partial<SurpriseData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step3Balloons: React.FC<Step3Props> = ({ data, onChange, onNext, onBack }) => {
  const sparkBank = [
    '✨ That late-night drive to get ice cream',
    '✨ The way you make everyone feel included',
    '✨ How you support my wildest dreams',
    '✨ Your unmatched playlist curation skills',
    '✨ Always picking up on the first ring',
    '✨ That unforgettable road trip where we got lost',
    '✨ The comforting hug that resets any bad day',
    '✨ Remembering tiny details from years ago',
    '✨ That impromptu karaoke session at 2 AM',
  ];

  const [sparkPoolIndex, setSparkPoolIndex] = useState(0);

  const displayedSparks = [
    sparkBank[(sparkPoolIndex * 4) % sparkBank.length],
    sparkBank[(sparkPoolIndex * 4 + 1) % sparkBank.length],
    sparkBank[(sparkPoolIndex * 4 + 2) % sparkBank.length],
    sparkBank[(sparkPoolIndex * 4 + 3) % sparkBank.length],
  ];

  const handleShuffleSparks = () => {
    setSparkPoolIndex((prev) => prev + 1);
  };

  const handleUseSpark = (sparkText: string) => {
    const cleanText = sparkText.replace(/^✨\s*/, '').trim();
    // Fill the first empty balloon or append if < 5
    const balloons = [...data.balloons];
    const emptyIndex = balloons.findIndex((b) => !b.text.trim());

    if (emptyIndex !== -1) {
      balloons[emptyIndex].text = cleanText;
      onChange({ balloons });
    } else if (balloons.length < 5) {
      handleAddBalloon(cleanText);
    } else {
      // Overwrite the last one
      balloons[balloons.length - 1].text = cleanText;
      onChange({ balloons });
    }
  };

  const handleAddBalloon = (initialText = '') => {
    if (data.balloons.length >= 5) return;
    const num = data.balloons.length + 1;
    const presets = [
      { name: 'Berry Balloon', tagColor: 'text-purple-600', tagBg: 'bg-purple-100', color: 'bg-purple-500' },
      { name: 'Peach Balloon', tagColor: 'text-orange-600', tagBg: 'bg-orange-100', color: 'bg-orange-500' },
    ];
    const preset = presets[(num - 4) % presets.length] || presets[0];

    const newBalloon: BalloonItem = {
      id: `b${Date.now()}`,
      name: preset.name,
      color: preset.color,
      textColor: 'text-white',
      tagColor: preset.tagColor,
      tagBg: preset.tagBg,
      text: initialText,
      popNumber: num,
      popped: false,
    };

    onChange({ balloons: [...data.balloons, newBalloon] });
  };

  const handleUpdateBalloonText = (index: number, text: string) => {
    const updated = [...data.balloons];
    updated[index] = { ...updated[index], text };
    onChange({ balloons: updated });
  };

  const handleRemoveBalloon = (index: number) => {
    if (data.balloons.length <= 1) return;
    const filtered = data.balloons.filter((_, i) => i !== index).map((b, idx) => ({
      ...b,
      popNumber: idx + 1,
    }));
    onChange({ balloons: filtered });
  };

  return (
    <div className="flex flex-col w-full items-center justify-center py-8 px-4 relative select-none">
      {/* Ambient Warm Orbs */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#ff6f52]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-[#ffc329]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Stepper Tracker */}
      <div className="w-full max-w-[480px] flex flex-col items-center mb-6 z-10">
        <div className="flex items-center justify-between w-full mb-2 px-1">
          <span className="text-[11px] font-bold tracking-widest uppercase text-[#786155] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ff6f52] animate-pulse" />
            Step 3 of 5
          </span>
          <span className="text-sm font-bold text-[#ac331c] tracking-tight">BALLOONS</span>
        </div>

        {/* Stepper indicators */}
        <div className="flex items-center justify-between w-full bg-[#fff1ec] px-4 py-2 rounded-full shadow-xs">
          <div className="flex items-center gap-2">
            {/* Step 1 Complete */}
            <div className="w-8 h-8 rounded-full bg-[#ff6f52]/20 flex items-center justify-center text-[#ac331c]" title="Step 1: The Star">
              <span className="material-symbols-outlined text-[18px]">check</span>
            </div>
            {/* Step 2 Complete */}
            <div className="w-8 h-8 rounded-full bg-[#ff6f52]/20 flex items-center justify-center text-[#ac331c]" title="Step 2: Cake">
              <span className="material-symbols-outlined text-[18px]">cake</span>
            </div>
            {/* Step 3 Active */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FB923C] to-[#F43F5E] flex items-center justify-center text-white shadow-sm scale-105" title="Step 3: Balloons">
              <span className="text-[15px] leading-none">🎈</span>
            </div>
            {/* Step 4 Pending */}
            <div className="w-8 h-8 rounded-full bg-[#f8ddd2]/50 flex items-center justify-center text-[#786155]/50" title="Step 4: Memories">
              <span className="material-symbols-outlined text-[16px]">photo_library</span>
            </div>
            {/* Step 5 Pending */}
            <div className="w-8 h-8 rounded-full bg-[#f8ddd2]/50 flex items-center justify-center text-[#786155]/50" title="Step 5: Letter">
              <span className="material-symbols-outlined text-[16px]">mail</span>
            </div>
          </div>

          {/* Balloon Visual Gauge (5 items) */}
          <div className="flex items-center gap-1.5 px-1">
            {[1, 2, 3, 4, 5].map((idx) => {
              const isFilled = idx <= data.balloons.length;
              return (
                <svg
                  key={idx}
                  className={`w-4 h-5 transition-transform hover:scale-110 ${isFilled ? 'text-[#ac331c] drop-shadow-xs' : 'text-[#e0bfb8]/50'}`}
                  fill="currentColor"
                  viewBox="0 0 24 28"
                >
                  <path d="M12 0C5.37 0 0 5.15 0 11.5c0 4.8 3.12 8.9 7.57 10.63L11 25.5v2.5h2v-2.5l3.43-3.37C20.88 20.4 24 16.3 24 11.5 24 5.15 18.63 0 12 0z" />
                </svg>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Stage Card */}
      <div className="w-full max-w-[480px] bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#786155]/5 border border-[#fce8dc] relative z-10 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-2">
            <div className="w-16 h-16 rounded-full bg-[#fee3d8] flex items-center justify-center text-3xl shadow-inner shadow-[#ff6f52]/5">
              🎈
            </div>
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#F59E0B] text-white text-[10px] font-bold shadow-xs">
              ✨
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#261812] tracking-tight mb-1">
            Fill the balloons
          </h1>
          <p className="text-sm text-[#786155] max-w-sm">
            Each balloon hides one reason they're loved. They'll pop them one by one. ✨
          </p>
        </div>

        {/* Popping Hint Pill */}
        <div className="flex items-center gap-3 bg-[#FFF0E6]/80 px-4 py-2.5 rounded-2xl text-[#59413c] border border-[#fce8dc]">
          <span className="material-symbols-outlined text-[#ac331c] text-[20px] shrink-0">
            volume_up
          </span>
          <span className="text-xs leading-tight font-medium">
            They'll hear a cheerful pop effect & confetti when unboxing each one! 🍿🎉
          </span>
        </div>

        {/* Balloon Notes List */}
        <div className="flex flex-col gap-3">
          {data.balloons.map((balloon, index) => (
            <div
              key={balloon.id}
              className="flex flex-col gap-1.5 bg-[#fff1ec]/60 border border-[#fce8dc] rounded-2xl p-4 transition-all duration-200 focus-within:bg-[#fff1ec] focus-within:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#ac331c] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                    {balloon.popNumber}
                  </span>
                  <span className="font-semibold text-sm text-[#261812]">{balloon.name}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#ac331c] bg-[#ffdad3] px-2 py-0.5 rounded-full">
                    Pop #{balloon.popNumber}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#786155] font-medium">
                    {balloon.text.length}/120
                  </span>
                  {data.balloons.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveBalloon(index)}
                      className="text-[#8c716b] hover:text-[#ba1a1a] transition-colors p-0.5"
                      title="Remove reason"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="relative">
                <textarea
                  rows={2}
                  maxLength={120}
                  value={balloon.text}
                  onChange={(e) => handleUpdateBalloonText(index, e.target.value)}
                  placeholder="Write a sweet memory or reason..."
                  className="w-full bg-white rounded-xl p-3 text-sm text-[#261812] placeholder:text-[#e0bfb8] focus:outline-none focus:ring-2 focus:ring-[#ff6f52]/20 resize-none border border-[#fce8dc]"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Add Another Balloon Button */}
        {data.balloons.length < 5 && (
          <button
            type="button"
            onClick={() => handleAddBalloon()}
            className="w-full py-3 px-4 rounded-2xl bg-[#FFF0E6]/70 hover:bg-[#FFF0E6] text-[#ac331c] font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99] group shadow-xs border border-[#fce8dc] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:rotate-90">
              add_circle
            </span>
            <span>Add another reason ({data.balloons.length}/5)</span>
          </button>
        )}

        {/* Spark Suggestions */}
        <div className="flex flex-col gap-2 pt-1 border-t border-[#fce8dc]/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#786155] uppercase tracking-wider font-bold flex items-center gap-1">
              <span>✨</span> NEED A SPARK? TAP TO USE
            </span>
            <button
              type="button"
              onClick={handleShuffleSparks}
              className="text-xs text-[#ac331c] font-semibold cursor-pointer hover:underline flex items-center gap-1"
            >
              <span>Shuffle</span>
              <span className="material-symbols-outlined text-[14px]">casino</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {displayedSparks.map((spark, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleUseSpark(spark)}
                className="text-left px-3.5 py-1.5 rounded-full bg-[#fff1ec] hover:bg-[#fee3d8] text-[#59413c] hover:text-[#261812] text-xs font-medium transition-all hover:scale-102 active:scale-98 border border-[#fce8dc]"
              >
                {spark}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-3 pt-2">
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
            <span>📸</span>
          </button>
        </div>
      </div>

      {/* Helper Note */}
      <div className="mt-6 flex items-center gap-1.5 text-[#786155] text-xs text-center">
        <span className="material-symbols-outlined text-[16px] text-[#F59E0B]">auto_awesome</span>
        <span>You can edit or add more reasons before finalizing in Step 6</span>
      </div>
    </div>
  );
};
