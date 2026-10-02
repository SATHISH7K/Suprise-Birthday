import React, { useState, useEffect } from 'react';
import { SurpriseData } from '../../types';
import { fireConfetti } from '../../utils/confetti';

interface BirthdayFinaleSceneProps {
  data: SurpriseData;
  onReplay: () => void;
}

export const BirthdayFinaleScene: React.FC<BirthdayFinaleSceneProps> = ({
  data,
  onReplay,
}) => {
  const [hugSent, setHugSent] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  useEffect(() => {
    // Initial celebration confetti burst
    fireConfetti(window.innerWidth / 2, window.innerHeight * 0.35, 45);
    const timer = setTimeout(() => {
      fireConfetti(window.innerWidth * 0.3, window.innerHeight * 0.45, 30);
      fireConfetti(window.innerWidth * 0.7, window.innerHeight * 0.45, 30);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleSendHug = () => {
    setHugSent(true);
    fireConfetti(window.innerWidth / 2, window.innerHeight * 0.5, 30);
  };

  const currentPhoto = data.photos && data.photos.length > 0 ? data.photos[activePhotoIdx] : null;

  const whatsappMessage = encodeURIComponent(
    `Hey ${data.senderName}! 💖 Thank you so much for the incredible birthday surprise! It made my day so special ✨`
  );

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

      {/* Main Headline */}
      <div className="relative z-10 text-center pt-4 sm:pt-6 max-w-md">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-[0_8px_24px_rgba(255,213,107,0.3)] animate-bloom">
          HAPPY BIRTHDAY
          <span className="block mt-1 text-[#ffd56b]">
            {data.recipientName}!
          </span>
        </h1>
      </div>

      {/* Center Celebration Mascot / Photo */}
      <div className="relative z-10 my-auto flex flex-col items-center animate-fadeIn py-2">
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full p-2 bg-gradient-to-tr from-[#ffd56b] via-[#f43f5e] to-[#a855f7] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center">
          <div className="w-full h-full rounded-full overflow-hidden bg-white/10 backdrop-blur-md flex items-center justify-center p-2 relative">
            {/* If sender uploaded memory photos, display the active photo */}
            {currentPhoto ? (
              <img
                src={currentPhoto.url}
                alt={currentPhoto.caption || data.recipientName}
                className="w-full h-full object-cover rounded-full transition-all duration-500"
                referrerPolicy="no-referrer"
              />
            ) : (
              /* Celebration Illustration Mascot with Birthday Hat & Roses */
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-5xl sm:text-6xl animate-bounce">🐱</span>
                <div className="flex items-center gap-1 mt-1 text-2xl">
                  <span>🎩</span>
                  <span>💐</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail switcher if multiple photos exist */}
        {data.photos && data.photos.length > 1 && (
          <div className="flex items-center gap-2 mt-3 z-20">
            {data.photos.map((p, idx) => (
              <button
                key={p.id || idx}
                type="button"
                onClick={() => setActivePhotoIdx(idx)}
                className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${activePhotoIdx === idx
                    ? 'border-[#ffd56b] scale-110 shadow-md'
                    : 'border-white/30 opacity-60 hover:opacity-100'
                  }`}
              >
                <img
                  src={p.url}
                  alt={`Memory ${idx + 1}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>
        )}

        {/* Caption if active photo has one */}
        {currentPhoto && currentPhoto.caption && (
          <p className="mt-2 text-xs font-serif italic text-pink-100 max-w-xs text-center">
            "{currentPhoto.caption}"
          </p>
        )}

        {/* Dedication Byline */}
        <p className="mt-3 text-xs sm:text-sm text-pink-200/90 font-serif italic text-center">
          Made with love, just for you — <strong className="text-white font-bold">{data.senderName}</strong> 💛
        </p>
      </div>

      {/* Action Buttons Stack */}
      <div className="relative z-10 w-full max-w-sm flex flex-col gap-2.5 pb-4">
        {/* Reply on WhatsApp */}
        <a
          href={`https://api.whatsapp.com/send?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-6 rounded-full bg-[#25D366] hover:bg-[#1faa4b] text-white font-bold text-sm shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <span>Reply to {data.senderName} on WhatsApp 💬</span>
        </a>

        {/* Send a Hug */}
        <button
          type="button"
          onClick={handleSendHug}
          className={`w-full py-3 px-6 rounded-full text-xs sm:text-sm font-semibold border transition-all flex items-center justify-center gap-2 cursor-pointer ${hugSent
              ? 'bg-pink-600/30 border-pink-400 text-pink-200'
              : 'bg-white/15 hover:bg-white/20 border-white/25 text-white active:scale-98'
            }`}
        >
          <span>{hugSent ? 'Hug Sent! 🫂' : `Send ${data.senderName} a Hug 🤗`}</span>
        </button>

        {/* Replay */}
        <button
          type="button"
          onClick={onReplay}
          className="w-full py-2.5 px-6 rounded-full bg-transparent hover:bg-white/10 text-pink-200/80 hover:text-white text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">replay</span>
          <span>Replay the Whole Experience ↺</span>
        </button>
      </div>
    </div>
  );
};
