import React, { useState } from 'react';
import { SurpriseData } from '../../types';
import { playHeartChime, playChime } from '../../utils/sound';

interface RecipientMemoryProps {
  data: SurpriseData;
  onNext: () => void;
  isSoundOn: boolean;
  onToggleSound: () => void;
}

export const RecipientMemoryLane: React.FC<RecipientMemoryProps> = ({
  data,
  onNext,
  isSoundOn,
  onToggleSound,
}) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const photos = data.photos.length > 0 ? data.photos : [
    {
      id: 'p1',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCarEWR4Z-0pInieNEQUheFB-REXurWsRY6sIhHJzZK5vBz0PP5-QLM0iGSnR_PoWKbh92FLbyZ0ZToe9A7eZkfKaPsCA7oBOCXPw8rHY0SbnCG9tRQRN3CtOXZXN-6mJ1XtUB_TV-nQMyJ1D-ThFPDwdgc_okLcu3dDujsMB-UGwOVQJP0txrre4X9-cBWv6i6vqlsBEIzb8YEgqPxt74y2nBVTFGwzMepJhsOguBVI_d70tvoLY47',
      caption: 'Coffee date laughs & 2 AM deep talks ☕✨',
      location: 'Bangalore',
      date: 'Nov 2023',
    },
  ];

  const currentPhoto = photos[photoIndex] || photos[0];

  const handleNextPhoto = () => {
    if (photoIndex < photos.length - 1) {
      setPhotoIndex(photoIndex + 1);
      setIsLiked(false);
      playChime([523.25, 659.25], 0.05, 0.15);
    }
  };

  const handlePrevPhoto = () => {
    if (photoIndex > 0) {
      setPhotoIndex(photoIndex - 1);
      setIsLiked(false);
      playChime([659.25, 523.25], 0.05, 0.15);
    }
  };

  const handleToggleHeart = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      playHeartChime();
    }
  };

  return (
    <div className="flex flex-col w-full relative overflow-hidden select-none pb-12 pt-2 px-4 max-w-[440px] mx-auto">
      {/* Golden Fairy Glow */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-[#ffdf9f]/30 via-[#FB923C]/15 to-transparent blur-3xl pointer-events-none rounded-full" />

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

      {/* Header and Step Indicator */}
      <div className="flex flex-col items-center text-center gap-1 mb-2">
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#fee3d8] text-[#59413c] text-[10px] font-bold tracking-wider uppercase border border-[#fce8dc]">
            <span>📸</span>
            <span>MEMORY LANE • STEP 3 OF 4</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ffdad3] text-[#8a1b06] text-xs font-semibold">
            <span>Photo {photoIndex + 1} of {photos.length}</span>
            <span>✨</span>
          </span>
        </div>

        <h1 className="text-2xl font-bold text-[#261812] tracking-tight mt-1">
          A walk down memory lane 💛
        </h1>
        <p className="text-xs sm:text-sm text-[#59413c] max-w-[320px] mx-auto">
          Strung with fairy lights just for you, {data.recipientName}. Swipe through moments frozen in time.
        </p>

        {/* Twinkling status */}
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white shadow-xs border border-[#fce8dc] mt-1">
          <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-ping" />
          <span className="text-[10px] uppercase font-bold text-[#786155] tracking-wider">
            FAIRY LIGHTS TWINKLING GENTLY
          </span>
        </div>
      </div>

      {/* Fairy Lights & Polaroid Stage */}
      <section className="relative w-full pt-4 pb-2">
        {/* Fairy lights wire SVG */}
        <div className="w-full relative h-12 pointer-events-none">
          <svg className="w-full h-12 overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 48">
            <path
              d="M-10,10 Q100,32 200,20 T410,12"
              fill="none"
              stroke="#D1B39D"
              strokeWidth="1.8"
              opacity="0.8"
            />
            {/* Glowing Bulbs */}
            <circle cx="35" cy="18" fill="#f9bd22" r="3.5" />
            <circle cx="35" cy="18" fill="#ffc329" opacity="0.35" r="9" className="animate-pulse" />

            <circle cx="105" cy="26" fill="#ffdf9f" r="4" />
            <circle cx="105" cy="26" fill="#ffc329" opacity="0.4" r="11" />

            <circle cx="175" cy="22" fill="#f9bd22" r="3.5" />
            <circle cx="175" cy="22" fill="#ffc329" opacity="0.3" r="10" className="animate-pulse" />

            <circle cx="230" cy="19" fill="#ffdf9f" r="4" />
            <circle cx="230" cy="19" fill="#ffc329" opacity="0.45" r="12" className="animate-pulse" />

            <circle cx="305" cy="15" fill="#f9bd22" r="3.5" />
            <circle cx="305" cy="15" fill="#ffc329" opacity="0.3" r="9" />

            <circle cx="365" cy="13" fill="#ffdf9f" r="4" />
            <circle cx="365" cy="13" fill="#ffc329" opacity="0.4" r="10" className="animate-pulse" />
          </svg>
        </div>

        {/* Wooden Clothespin Graphic */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
          <div className="w-3.5 h-6 rounded-xs bg-gradient-to-b from-[#e7b98d] via-[#d49b67] to-[#b37946] shadow-xs flex items-center justify-center relative">
            <div className="w-full h-0.5 bg-[#8c716b]/70 absolute top-2.5" />
          </div>
        </div>

        {/* Active Polaroid Card with Carousel */}
        <div className="relative w-full -mt-2 flex items-center justify-center">
          {/* Main Active Polaroid */}
          <div className="w-full max-w-[316px] bg-white p-3.5 pb-4 rounded-3xl shadow-[0_20px_48px_-10px_rgba(120,97,85,0.18)] border border-[#fce8dc] z-20 transition-all duration-300 transform rotate-[-1deg] relative">
            {/* Top string indicator */}
            <div className="w-full flex justify-center -mt-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#786155]/20" />
            </div>

            {/* Photo Frame */}
            <div className="relative w-full aspect-[4/4.2] rounded-2xl overflow-hidden bg-[#ffe9e1] shadow-inner">
              <img
                src={currentPhoto.url}
                alt={currentPhoto.caption}
                className="w-full h-full object-cover object-center transition-all duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-white/85 backdrop-blur-xs shadow-xs">
                <span className="text-xs font-bold text-[#261812]">
                  {photoIndex + 1} / {photos.length}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-[#FB923C]/15 via-transparent to-white/20 pointer-events-none" />
            </div>

            {/* Handwritten Caption Section */}
            <div className="mt-3 px-1 flex flex-col gap-1">
              <p className="text-base sm:text-lg font-bold text-[#261812] italic leading-snug">
                "{currentPhoto.caption}"
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#786155]">
                  {currentPhoto.date || '2024'} {currentPhoto.location ? `• ${currentPhoto.location}` : ''}
                </span>

                <button
                  type="button"
                  onClick={handleToggleHeart}
                  aria-label="Heart this memory"
                  className={`w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-transform shadow-xs cursor-pointer ${
                    isLiked ? 'bg-[#ffdadc] text-[#F43F5E]' : 'bg-[#FFF0E6] text-[#ac331c]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isLiked ? 'favorite' : 'favorite_border'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Pagination & Swipe Cues */}
        <div className="flex flex-col items-center gap-1.5 mt-4">
          <div className="flex items-center gap-2 py-1">
            <button
              type="button"
              disabled={photoIndex === 0}
              onClick={handlePrevPhoto}
              className="p-1 rounded-full text-[#786155] disabled:opacity-30 hover:bg-[#fff1ec] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>

            {photos.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPhotoIndex(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === photoIndex
                    ? 'w-6 h-2 bg-gradient-to-r from-[#FB923C] to-[#F43F5E]'
                    : 'w-2 h-2 bg-[#786155]/20'
                }`}
              />
            ))}

            <button
              type="button"
              disabled={photoIndex === photos.length - 1}
              onClick={handleNextPhoto}
              className="p-1 rounded-full text-[#786155] disabled:opacity-30 hover:bg-[#fff1ec] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[#786155] text-[11px] font-bold tracking-widest uppercase">
            <span>Tap arrows or dots to flip photos</span>
          </div>
        </div>
      </section>

      {/* Up Next Teaser Card */}
      <div className="w-full bg-white rounded-3xl p-4 shadow-[0_8px_24px_rgba(120,97,85,0.06)] border border-[#fce8dc] flex items-center gap-3.5 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-[#fee3d8] flex-shrink-0 flex items-center justify-center relative shadow-inner">
          <span className="material-symbols-outlined text-[#a93349] text-[26px]">
            mark_email_unread
          </span>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#ac331c] flex items-center justify-center shadow-md text-white text-[10px] font-bold">
            {data.senderName?.[0] || 'R'}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-[#a93349] tracking-widest uppercase">
              UP NEXT • CHAPTER 4 🔒
            </span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-[#261812] truncate">
            The Grand Finale: Wax-Sealed Letter
          </p>
          <p className="text-xs text-[#59413c] truncate">
            A handwritten letter sealed with {data.waxSeal} wax from {data.senderName}
          </p>
        </div>

        <div className="w-8 h-8 rounded-full bg-[#fff1ec] flex items-center justify-center shrink-0 text-[#786155]">
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="w-full flex flex-col gap-2 mb-4">
        <button
          type="button"
          onClick={onNext}
          className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#FB923C] to-[#F43F5E] text-white font-semibold text-base shadow-[0_12px_28px_-6px_rgba(255,111,82,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg"
        >
          <span>Continue to Letter</span>
          <span>💌</span>
        </button>

        <p className="text-center text-xs italic text-[#786155] px-4 mt-1">
          "The best things in life are the people we love and the memories we've made."
        </p>
      </div>
    </div>
  );
};
