import React, { useState } from 'react';
import { MemoryPhoto } from '../../types';

interface StarryMemoryLaneSceneProps {
  photos: MemoryPhoto[];
  onNext: () => void;
}

export const StarryMemoryLaneScene: React.FC<StarryMemoryLaneSceneProps> = ({
  photos,
  onNext,
}) => {
  const [photoIndex, setPhotoIndex] = useState(0);

  // If no photos provided, fallback placeholder
  const activePhoto = photos && photos[photoIndex]
    ? photos[photoIndex]
    : {
        id: 'sample',
        url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
        caption: 'A moment worth keeping ✨',
      };

  const handleNextPhoto = () => {
    if (photoIndex < photos.length - 1) {
      setPhotoIndex((prev) => prev + 1);
    } else {
      onNext();
    }
  };

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
              left: `${(i * 19) % 100}%`,
              top: `${(i * 23) % 100}%`,
              opacity: (i % 4) * 0.2 + 0.25,
              animationDelay: `${(i * 0.17) % 3}s`,
            }}
          />
        ))}
      </div>

      {/* Header matching 00:33 in video */}
      <div className="relative z-10 text-center pt-4 sm:pt-6 max-w-md">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          A walk down memory lane
        </h2>
        <p className="text-xs sm:text-sm text-pink-200/80 mt-1 font-serif italic">
          a moment worth keeping ✨
        </p>
      </div>

      {/* Center Fairy Light String & Hanging Polaroid */}
      <div className="relative z-10 w-full max-w-sm my-auto flex flex-col items-center justify-center">
        {/* Fairy Light Golden String */}
        <div className="w-full flex items-center justify-around relative mb-[-12px] z-20">
          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#ffd56b]/60 to-transparent" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#fde047] shadow-[0_0_12px_#fde047] animate-pulse" />
          <span className="w-3 h-3 rounded-full bg-[#fde047] shadow-[0_0_16px_#fde047] animate-pulse" style={{ animationDelay: '0.4s' }} />
          <span className="w-2.5 h-2.5 rounded-full bg-[#fde047] shadow-[0_0_12px_#fde047] animate-pulse" style={{ animationDelay: '0.8s' }} />
        </div>

        {/* Clothespin */}
        <div className="w-3.5 h-7 bg-[#c28e57] rounded-xs shadow-md z-30 mb-[-8px] flex items-center justify-center border border-[#9b6837]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7a4e25]" />
        </div>

        {/* Polaroid Card */}
        <div
          onClick={handleNextPhoto}
          className="relative w-64 sm:w-72 bg-white rounded-2xl p-4 shadow-[0_20px_45px_rgba(0,0,0,0.5)] border border-[#fce8dc] cursor-pointer active:scale-98 transition-transform group animate-bloom"
        >
          {/* Photo Frame */}
          <div className="w-full h-56 sm:h-64 rounded-xl overflow-hidden bg-[#fee3d8] relative shadow-inner">
            <img
              src={activePhoto.url}
              alt={activePhoto.caption || 'Memory'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            {photos && photos.length > 1 && (
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white font-mono">
                {photoIndex + 1} / {photos.length}
              </div>
            )}
          </div>

          {/* Caption */}
          <div className="pt-3 pb-1 text-center">
            <p className="text-xs sm:text-sm font-serif font-medium text-[#261812] leading-snug">
              {activePhoto.caption || 'Cherished Moments'}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA matching 00:35 in video */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center pb-4">
        <button
          type="button"
          onClick={handleNextPhoto}
          className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#ffd56b] to-[#f59e0b] text-[#180a2b] font-bold text-sm sm:text-base shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer animate-pulse"
        >
          <span>{photos && photoIndex < photos.length - 1 ? 'Next Memory' : 'Keep going'}</span>
          <span>💛 →</span>
        </button>
      </div>
    </div>
  );
};
