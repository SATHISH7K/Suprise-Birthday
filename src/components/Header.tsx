import React from 'react';
import { BRAND_LOGO } from '../defaultData';

interface HeaderProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  isSoundOn: boolean;
  onToggleSound: () => void;
  onOpenPreview: () => void;
  onOpenSoundtrackStudio: () => void;
  onOpenVoiceModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onSelectStep,
  isSoundOn,
  onToggleSound,
  onOpenPreview,
  onOpenSoundtrackStudio,
  onOpenVoiceModal,
}) => {
  const steps = [
    { num: 1, label: '1. The Star' },
    { num: 2, label: '2. Pick Cake' },
    { num: 3, label: '3. Balloons' },
    { num: 4, label: '4. Memory Lane' },
    { num: 5, label: '5. Letter' },
    { num: 6, label: '6. Preview & Send' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#fff8f6]/95 backdrop-blur-xl border-b border-[#fce8dc] shadow-[0_1px_8px_rgba(120,97,85,0.06)]">
      <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div 
          onClick={() => onSelectStep(1)}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          <img
            alt="OurMoments Logo"
            className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
            src={BRAND_LOGO}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="flex flex-col">
            <span className="font-bold text-lg text-[#261812] tracking-tight flex items-center gap-1.5">
              OurMoments
            </span>
            <span className="hidden sm:inline text-xs text-[#786155]">
              Make someone's day unforgettable 🎀
            </span>
          </div>
        </div>

        {/* Wizard Steps Navigation */}
        <nav className="hidden xl:flex items-center gap-1 bg-[#fff1ec] p-1 rounded-full shadow-[0_2px_8px_rgba(120,97,85,0.04)]">
          {steps.map((s) => {
            const isActive = currentStep === s.num;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => onSelectStep(s.num)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#ff6f52] text-white font-semibold shadow-[0_4px_12px_rgba(255,111,82,0.3)]'
                    : 'text-[#59413c] hover:text-[#261812] hover:bg-[#ffe9e1]/60'
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Sound, Soundtrack Studio, Voice Note, Avatar, and Instant Preview */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Voice Note Button */}
          <button
            type="button"
            onClick={onOpenVoiceModal}
            title="Record Voice Note"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ffe9e1] hover:bg-[#fedbd0] text-[#ac331c] text-xs font-medium transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[17px]">mic</span>
            <span className="hidden md:inline">Voice Note</span>
          </button>

          {/* Soundtrack Studio Button */}
          <button
            type="button"
            onClick={onOpenSoundtrackStudio}
            title="Soundtrack Studio"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ffe9e1] hover:bg-[#fedbd0] text-[#ac331c] text-xs font-medium transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[17px]">music_note</span>
            <span className="hidden md:inline">Music</span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              isSoundOn
                ? 'bg-[#ffe9e1] text-[#ac331c] font-semibold'
                : 'bg-[#fff1ec] text-[#786155] hover:bg-[#ffe9e1]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isSoundOn ? 'volume_up' : 'volume_off'}
            </span>
            <span className="hidden md:inline">
              {isSoundOn ? 'Sound On' : 'Sound Off'}
            </span>
          </button>

          {/* User profile avatar */}
          <div className="w-8 h-8 rounded-full bg-[#ac331c] text-white flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>

          {/* Instant Preview Button (mobile & desktop) */}
          <button
            type="button"
            onClick={onOpenPreview}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#FB923C] to-[#F43F5E] text-white text-xs sm:text-sm font-semibold shadow-[0_6px_20px_-2px_rgba(255,111,82,0.4)] hover:shadow-[0_8px_24px_-2px_rgba(255,111,82,0.5)] transition-all active:scale-95"
          >
            <span>Instant Preview</span>
            <span className="material-symbols-outlined text-[18px]">visibility</span>
          </button>
        </div>
      </div>
    </header>
  );
};
