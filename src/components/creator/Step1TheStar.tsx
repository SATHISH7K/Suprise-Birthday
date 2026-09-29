import React, { useState } from 'react';
import { SurpriseData } from '../../types';
import { fireConfetti } from '../../utils/confetti';

interface Step1Props {
  data: SurpriseData;
  onChange: (updates: Partial<SurpriseData>) => void;
  onNext: () => void;
}

export const Step1TheStar: React.FC<Step1Props> = ({ data, onChange, onNext }) => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.recipientName.trim() || !data.senderName.trim()) return;

    setSubmitting(true);
    fireConfetti(window.innerWidth / 2, window.innerHeight * 0.6, 20);

    setTimeout(() => {
      setSubmitting(false);
      onNext();
    }, 700);
  };

  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const months = [
    { val: 'Jan', label: 'January' },
    { val: 'Feb', label: 'February' },
    { val: 'Mar', label: 'March' },
    { val: 'Apr', label: 'April' },
    { val: 'May', label: 'May' },
    { val: 'Jun', label: 'June' },
    { val: 'Jul', label: 'July' },
    { val: 'Aug', label: 'August' },
    { val: 'Sep', label: 'September' },
    { val: 'Oct', label: 'October' },
    { val: 'Nov', label: 'November' },
    { val: 'Dec', label: 'December' },
  ];

  return (
    <div className="flex flex-col w-full items-center justify-center py-8 px-4 relative select-none">
      {/* Ambient background glows */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[580px] h-[340px] bg-gradient-to-b from-[#ffdad3]/40 via-[#ffe9e1]/30 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#ffdf9f]/20 blur-3xl pointer-events-none rounded-full" />

      {/* Stepper Indicator */}
      <div className="relative z-10 flex flex-col items-center justify-center mb-6">
        <div className="flex items-center gap-3 mb-2">
          {/* Active Balloon Step 1 */}
          <div className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-110">
            <span className="text-[22px] leading-none drop-shadow-[0_4px_8px_rgba(244,63,94,0.35)] animate-bounce" style={{ animationDuration: '2.4s' }}>
              🎈
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ac331c] mt-1 shadow-sm" />
          </div>
          {/* Step 2 */}
          <div className="flex flex-col items-center opacity-40">
            <span className="text-[18px] leading-none grayscale">🎈</span>
            <span className="w-1 h-1 rounded-full bg-[#e0bfb8] mt-1.5" />
          </div>
          {/* Step 3 */}
          <div className="flex flex-col items-center opacity-40">
            <span className="text-[18px] leading-none grayscale">🎈</span>
            <span className="w-1 h-1 rounded-full bg-[#e0bfb8] mt-1.5" />
          </div>
          {/* Step 4 */}
          <div className="flex flex-col items-center opacity-40">
            <span className="text-[18px] leading-none grayscale">🎈</span>
            <span className="w-1 h-1 rounded-full bg-[#e0bfb8] mt-1.5" />
          </div>
          {/* Step 5 */}
          <div className="flex flex-col items-center opacity-40">
            <span className="text-[18px] leading-none grayscale">🎈</span>
            <span className="w-1 h-1 rounded-full bg-[#e0bfb8] mt-1.5" />
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] uppercase tracking-wider text-[#786155] font-bold">Step 1 of 5</span>
          <span className="text-[#e0bfb8]">•</span>
          <span className="text-[11px] uppercase tracking-wider text-[#ac331c] font-bold">The Star</span>
        </div>
      </div>

      {/* Floating Card Canvas */}
      <div className="relative z-10 w-full max-w-[460px] bg-white rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_-10px_rgba(120,97,85,0.12),0_4px_16px_-2px_rgba(120,97,85,0.06)] border border-[#fce8dc] backdrop-blur-md">
        {/* Top Celebration Icon Badge */}
        <div className="flex justify-center mb-4">
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#ffe9e1] via-[#fee3d8] to-[#fff8f6] flex items-center justify-center shadow-[0_4px_16px_rgba(245,158,11,0.18)]">
            <span className="text-3xl filter drop-shadow-sm select-none transform hover:rotate-12 transition-transform duration-300">
              🌟
            </span>
            <span className="absolute -top-1 -right-1 text-xs">✨</span>
          </div>
        </div>

        {/* Header Text Block */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#261812] tracking-tight mb-1">
            Who's the birthday star?
          </h1>
          <p className="text-sm text-[#786155] flex items-center justify-center gap-1">
            <span>You're about to make someone's day unforgettable</span>
            <span className="text-[15px]">🎀</span>
          </p>
        </div>

        {/* Interactive Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Field 1: Their Name */}
          <div className="flex flex-col gap-1.5 group">
            <label className="text-sm text-[#261812] font-semibold flex items-center justify-between" htmlFor="recipientName">
              <span>Their name <span className="text-[#ac331c]">*</span></span>
              {data.recipientName && (
                <span className="text-xs text-[#8c716b] font-medium">{data.recipientName.length}/24</span>
              )}
            </label>
            <div className="relative">
              <input
                id="recipientName"
                type="text"
                required
                maxLength={24}
                value={data.recipientName}
                onChange={(e) => onChange({ recipientName: e.target.value })}
                placeholder="e.g. Ananya"
                className="w-full h-[52px] px-4 rounded-2xl bg-white text-[#261812] text-base placeholder:text-[#e0bfb8] border-[1.5px] border-[#fce8dc] focus:border-[#ff6f52] focus:outline-none focus:ring-4 focus:ring-[#ff6f52]/15 transition-all shadow-[0_2px_4px_rgba(120,97,85,0.02)]"
              />
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#e0bfb8] pointer-events-none group-focus-within:text-[#ac331c] transition-colors text-[20px]">
                celebration
              </span>
            </div>
          </div>

          {/* Field 2: Your Name */}
          <div className="flex flex-col gap-1.5 group">
            <label className="text-sm text-[#261812] font-semibold" htmlFor="senderName">
              Your name <span className="text-[#ac331c]">*</span>
            </label>
            <div className="relative">
              <input
                id="senderName"
                type="text"
                required
                value={data.senderName}
                onChange={(e) => onChange({ senderName: e.target.value })}
                placeholder="e.g. Rahul"
                className="w-full h-[52px] px-4 rounded-2xl bg-white text-[#261812] text-base placeholder:text-[#e0bfb8] border-[1.5px] border-[#fce8dc] focus:border-[#ff6f52] focus:outline-none focus:ring-4 focus:ring-[#ff6f52]/15 transition-all shadow-[0_2px_4px_rgba(120,97,85,0.02)]"
              />
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#e0bfb8] pointer-events-none group-focus-within:text-[#ac331c] transition-colors text-[20px]">
                favorite
              </span>
            </div>
          </div>

          {/* Field 3: Turning age (optional) */}
          <div className="flex flex-col gap-1.5 group">
            <label className="text-sm text-[#261812] font-semibold" htmlFor="recipientAge">
              Turning age <span className="text-xs text-[#786155] font-normal">(optional)</span>
            </label>
            <div className="relative">
              <input
                id="recipientAge"
                type="number"
                min="1"
                max="120"
                value={data.age}
                onChange={(e) => onChange({ age: e.target.value })}
                placeholder="e.g. 25"
                className="w-full h-[52px] px-4 rounded-2xl bg-white text-[#261812] text-base placeholder:text-[#e0bfb8] border-[1.5px] border-[#fce8dc] focus:border-[#ff6f52] focus:outline-none focus:ring-4 focus:ring-[#ff6f52]/15 transition-all shadow-[0_2px_4px_rgba(120,97,85,0.02)]"
              />
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#e0bfb8] pointer-events-none group-focus-within:text-[#ac331c] transition-colors text-[20px]">
                cake
              </span>
            </div>
          </div>

          {/* Field 4: Birthday Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#261812] font-semibold leading-snug">
              Their birthday <span className="text-xs text-[#ac331c] font-medium">(optional — unlocks midnight magic)</span>
            </label>
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              {/* Day Select */}
              <div className="relative">
                <select
                  value={data.birthDay}
                  onChange={(e) => onChange({ birthDay: e.target.value })}
                  className="w-full h-[52px] pl-4 pr-9 rounded-2xl bg-white text-[#261812] text-sm border-[1.5px] border-[#fce8dc] focus:border-[#ff6f52] focus:outline-none focus:ring-4 focus:ring-[#ff6f52]/15 appearance-none cursor-pointer transition-all shadow-[0_2px_4px_rgba(120,97,85,0.02)]"
                >
                  <option value="">Day —</option>
                  {days.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#ff6f52] pointer-events-none text-[20px]">
                  expand_more
                </span>
              </div>

              {/* Month Select */}
              <div className="relative">
                <select
                  value={data.birthMonth}
                  onChange={(e) => onChange({ birthMonth: e.target.value })}
                  className="w-full h-[52px] pl-4 pr-9 rounded-2xl bg-white text-[#261812] text-sm border-[1.5px] border-[#fce8dc] focus:border-[#ff6f52] focus:outline-none focus:ring-4 focus:ring-[#ff6f52]/15 appearance-none cursor-pointer transition-all shadow-[0_2px_4px_rgba(120,97,85,0.02)]"
                >
                  <option value="">Month —</option>
                  {months.map((m) => (
                    <option key={m.val} value={m.val}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#ff6f52] pointer-events-none text-[20px]">
                  expand_more
                </span>
              </div>
            </div>

            {/* Helper note */}
            <p className="text-xs text-[#786155] mt-1.5 flex items-start gap-1.5 px-1 leading-relaxed">
              <span className="shrink-0">🎈</span>
              <span>If they open early, a countdown holds the surprise until 12:00 AM</span>
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full h-[54px] rounded-full bg-gradient-to-r from-[#FB923C] to-[#F43F5E] hover:opacity-95 text-white text-base font-semibold tracking-wide shadow-[0_10px_24px_-4px_rgba(255,111,82,0.38)] hover:shadow-[0_14px_30px_-3px_rgba(255,111,82,0.48)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <span>Baking surprise for {data.recipientName}...</span>
                  <span className="animate-spin text-lg">✨</span>
                </>
              ) : (
                <>
                  <span>Let's begin</span>
                  <span className="text-lg">🎂</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Social Trust micro-banner */}
      <div className="relative z-10 mt-6 flex items-center gap-2 text-[#786155] text-xs font-medium">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Over 12,000+ birthday surprises baked this month</span>
      </div>
    </div>
  );
};
