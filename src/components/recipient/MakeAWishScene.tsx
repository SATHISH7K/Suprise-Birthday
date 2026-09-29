import React, { useEffect } from 'react';

interface MakeAWishSceneProps {
  recipientName: string;
  onNext: () => void;
}

export const MakeAWishScene: React.FC<MakeAWishSceneProps> = ({
  recipientName,
  onNext,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 2800);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div
      onClick={onNext}
      className="fixed inset-0 w-full h-full bg-gradient-to-b from-[#b8004f] via-[#c20b57] to-[#8a0038] flex flex-col items-center justify-center p-6 text-white cursor-pointer select-none overflow-hidden transition-all duration-700 animate-fadeIn"
    >
      {/* Background Soft Ambient Light */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[600px] h-[600px] rounded-full bg-[#ff2d7a]/30 blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-xl mx-auto">
        {/* Subtitle Top */}
        <p className="text-base sm:text-lg font-serif italic text-pink-200 tracking-wider mb-2 opacity-95 animate-fadeIn">
          make a wish...
        </p>

        {/* Main Title */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tight leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.25)] animate-bloom">
          Happy
          <span className="block mt-1 sm:mt-2 text-white">
            Birthday
          </span>
        </h1>

        {/* Decorative Divider */}
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#ffd56b] to-transparent my-5" />

        {/* Subtitle Bottom */}
        <p className="text-sm sm:text-base font-medium text-pink-100 tracking-widest uppercase opacity-90">
          to someone worth celebrating
        </p>
        {recipientName && (
          <p className="text-xs text-pink-200/80 mt-2 font-mono">
            {recipientName} ✨
          </p>
        )}
      </div>

      <div className="absolute bottom-6 text-[11px] text-pink-200/60 uppercase tracking-widest">
        Tap to continue
      </div>
    </div>
  );
};
