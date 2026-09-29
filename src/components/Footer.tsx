import React from 'react';

interface FooterProps {
  onOpenPreview: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPreview }) => {
  return (
    <footer className="w-full bg-[#fff1ec] border-t border-[#fce8dc] shadow-[0_-1px_12px_rgba(120,97,85,0.04)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Trust markers */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-[#786155] text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#F59E0B] text-[18px]">verified</span>
            <span>Handcrafted Moments</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#ac331c] text-[18px]">lock</span>
            <span>Private & Secure Link</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#a93349] text-[18px]">favorite</span>
            <span>100% Ad-Free Experience</span>
          </div>
        </div>

        {/* Right side prompt and Instant Preview */}
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#786155] hidden lg:inline font-medium">
            Crafted with warmth for celebratory smiles ✨
          </span>
          <button
            type="button"
            onClick={onOpenPreview}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FB923C] to-[#F43F5E] text-white text-xs sm:text-sm font-semibold shadow-[0_8px_20px_-3px_rgba(255,111,82,0.38)] hover:shadow-[0_12px_28px_-2px_rgba(255,111,82,0.48)] transition-all active:scale-95"
          >
            <span>Instant Preview</span>
            <span className="material-symbols-outlined text-[18px]">visibility</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
