import React, { useRef } from 'react';
import { SurpriseData, MemoryPhoto } from '../../types';

interface Step4Props {
  data: SurpriseData;
  onChange: (updates: Partial<SurpriseData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step4MemoryLane: React.FC<Step4Props> = ({ data, onChange, onNext, onBack }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleLibrary = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDCS53hqs-0p7kYHbtbyxFjMZCYrLFOtL9XYS7iIP3jd1b12wmg723WayJfQmtd3J1WueeHNfBN8-3ZohP1V7WzYXby_v883Yh1ItDIsOyJ9ZwJIvQbGr69xyqof8cJS5RaG2qNqb8mlnYmWLPmopZJHgswIecixm0OKZNsDcu3pfEzY0TTVlqXAh5EzudboMwR9PDJHPgh78anT6WE9Dr5GJGAfaY2h5kmqluACphWri61n_66VwKY',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAMGVcyhpItKmXg9fOKIvipd5ceF17k6DSz6qyX5V1YAyTgKPVHtUZRzZ4DZlcuq7sD3PbGk0VpelxADx3QzTN5jHvS_i6qIdOQi7527343keAL07Z6SZ1T-C0CUQXMv-lLMHneWqCBBxiI9MLW7eTOdZncBpqEtUhuaQI5Bp4pVOcmMCxPg0Ayfh2ZgCZDUgIBnjRSLLtFOo3e9t4oZrqMP20uh70odj3Z5yztOVwb8zTHn6d6UkNq',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      if (url && data.photos.length < 5) {
        const newPhoto: MemoryPhoto = {
          id: `p${Date.now()}`,
          url,
          caption: 'Special Memory ✨',
          date: '2024',
        };
        onChange({ photos: [...data.photos, newPhoto] });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddSample = () => {
    if (data.photos.length >= 5) return;
    const url = sampleLibrary[data.photos.length % sampleLibrary.length];
    const newPhoto: MemoryPhoto = {
      id: `p${Date.now()}`,
      url,
      caption: 'Sunset laughter 🌅',
      date: '2024',
    };
    onChange({ photos: [...data.photos, newPhoto] });
  };

  const handleUpdateCaption = (index: number, caption: string) => {
    const updated = [...data.photos];
    updated[index] = { ...updated[index], caption };
    onChange({ photos: updated });
  };

  const handleRemovePhoto = (index: number) => {
    const updated = data.photos.filter((_, i) => i !== index);
    onChange({ photos: updated });
  };



  return (
    <div className="flex flex-col w-full items-center justify-center py-8 px-4 relative select-none">
      {/* Ambient Warm Orbs */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-[#ffdad3]/30 via-[#ffe9e1]/20 to-transparent blur-3xl pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-36 -left-20 w-72 h-72 bg-[#ffdf9f]/30 blur-3xl pointer-events-none -z-10 rounded-full" />

      {/* Stepper Header */}
      <div className="w-full max-w-[480px] mx-auto flex flex-col items-center mb-6">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[11px] font-bold uppercase text-[#786155] tracking-wider">Step 4 of 5</span>
          <span className="text-[#786155]">•</span>
          <span className="text-[11px] font-bold uppercase text-[#ac331c] tracking-wider">Memory Lane</span>
        </div>

        {/* Stepper Balloons */}
        <div className="flex items-center justify-center gap-2 mt-1 py-1 px-3 rounded-full bg-[#fff1ec] shadow-[0_2px_8px_rgba(120,97,85,0.06)]">
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-[19px] text-[#ac331c]">bubble_chart</span>
            <span className="w-0.5 h-1.5 bg-[#ac331c]/40 rounded-full" />
          </div>
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-[19px] text-[#ac331c]">bubble_chart</span>
            <span className="w-0.5 h-1.5 bg-[#ac331c]/40 rounded-full" />
          </div>
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-[19px] text-[#ac331c]">bubble_chart</span>
            <span className="w-0.5 h-1.5 bg-[#ac331c]/40 rounded-full" />
          </div>
          <div className="flex flex-col items-center relative">
            <span className="material-symbols-outlined text-[21px] text-[#ff6f52] animate-pulse">bubble_chart</span>
            <span className="w-0.5 h-1.5 bg-[#ff6f52] rounded-full" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F59E0B] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F59E0B]" />
            </span>
          </div>
          <div className="flex flex-col items-center opacity-30">
            <span className="material-symbols-outlined text-[19px] text-[#786155]">bubble_chart</span>
            <span className="w-0.5 h-1.5 bg-[#786155]/50 rounded-full" />
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[480px] bg-white rounded-[2rem] shadow-[0_18px_48px_-8px_rgba(120,97,85,0.12),0_4px_12px_-2px_rgba(120,97,85,0.05)] border border-[#fce8dc] p-6 sm:p-8 flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-[#ffe9e1] flex items-center justify-center shadow-[0_4px_16px_rgba(255,111,82,0.18)] mb-2 relative">
            <span className="text-2xl select-none">📸</span>
            <span className="absolute -bottom-0.5 -right-0.5 text-xs">✨</span>
          </div>
          <h1 className="text-2xl font-bold text-[#261812] tracking-tight">Hang up some memories</h1>
          <p className="text-sm text-[#786155] mt-1 max-w-sm px-2">
            Up to 5 photos, strung on fairy lights. A caption like <span className="text-[#261812] font-semibold">“Goa, 2023”</span> makes hearts melt. ✨
          </p>
        </div>

        {/* Fairy Lights Overhead Decorative String & Bulbs */}
        <div className="relative w-full mt-6 select-none pointer-events-none">
          <svg className="w-full h-8 overflow-visible" fill="none" preserveAspectRatio="none" viewBox="0 0 420 30">
            <path d="M 0 12 Q 105 28, 210 14 Q 315 28, 420 12" fill="none" stroke="#D1B39D" strokeWidth="1.75" />
            <circle className="animate-pulse" cx="42" cy="18" fill="#F59E0B" r="4.5" />
            <circle cx="42" cy="18" fill="#F59E0B" fillOpacity="0.25" r="9" />
            <circle cx="126" cy="23" fill="#FFB2B9" r="4.5" />
            <circle cx="126" cy="23" fill="#FF6F52" fillOpacity="0.2" r="9" />
            <circle className="animate-pulse" cx="210" cy="14" fill="#FFC329" r="5" />
            <circle cx="210" cy="14" fill="#FFC329" fillOpacity="0.3" r="11" />
            <circle cx="294" cy="23" fill="#FFB2B9" r="4.5" />
            <circle cx="294" cy="23" fill="#FF6F52" fillOpacity="0.2" r="9" />
            <circle className="animate-pulse" cx="378" cy="18" fill="#F59E0B" r="4.5" />
            <circle cx="378" cy="18" fill="#F59E0B" fillOpacity="0.25" r="9" />
          </svg>
        </div>

        {/* Photo Clothesline Carousel */}
        <div className="w-full mt-2 flex flex-col gap-4">
          <div className="w-full overflow-x-auto pb-3 pt-2 flex items-start gap-4 snap-x snap-mandatory no-scrollbar focus:outline-none">
            {data.photos.map((photo, index) => (
              <div
                key={photo.id}
                className="snap-center shrink-0 w-44 bg-[#fff1ec] rounded-2xl p-2.5 shadow-[0_8px_20px_-4px_rgba(120,97,85,0.12)] border border-[#fce8dc] flex flex-col items-center relative transition-transform hover:-translate-y-1 duration-200"
              >
                {/* Wooden Clothespin Graphic */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3.5 h-6 bg-[#CDB099] rounded-xs shadow-xs flex flex-col items-center justify-between py-0.5 z-10">
                  <span className="w-full h-0.5 bg-[#8C716B]/40" />
                  <span className="w-2 h-2 rounded-full bg-[#8C716B]/30" />
                </div>

                {/* Photo Frame */}
                <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#ffe9e1] relative group">
                  <img
                    alt={photo.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={photo.url}
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-2 right-2 bg-black/60 text-white text-[11px] px-2 py-0.5 rounded-full font-medium backdrop-blur-xs">
                    {index + 1}/5
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(index)}
                    aria-label="Delete photo"
                    className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/90 text-[#ba1a1a] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-white cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>

                {/* Editable Caption */}
                <div className="w-full mt-2 flex flex-col">
                  <div className="flex items-center gap-1 bg-white rounded-xl px-2.5 py-1.5 shadow-xs border border-[#fce8dc]">
                    <input
                      type="text"
                      value={photo.caption}
                      onChange={(e) => handleUpdateCaption(index, e.target.value)}
                      placeholder="Add cute note..."
                      className="w-full text-xs text-[#261812] bg-transparent focus:outline-none truncate font-medium"
                    />
                    <span className="material-symbols-outlined text-[15px] text-[#786155] shrink-0">
                      edit
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Dropzone Upload Slot (if < 5) */}
            {data.photos.length < 5 && (
              <div className="snap-center shrink-0 w-44 min-h-[238px] bg-[#FFF0E6]/80 hover:bg-[#FFF0E6] rounded-2xl p-2.5 shadow-[0_8px_20px_-4px_rgba(120,97,85,0.08)] border-2 border-dashed border-[#ff6f52]/40 flex flex-col items-center justify-center text-center transition-all duration-200 relative">
                {/* Clothespin */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3.5 h-6 bg-[#CDB099]/80 rounded-xs shadow-xs flex flex-col items-center justify-between py-0.5 z-10">
                  <span className="w-full h-0.5 bg-[#8C716B]/40" />
                  <span className="w-2 h-2 rounded-full bg-[#8C716B]/30" />
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className="w-full h-full rounded-xl bg-white/70 flex flex-col items-center justify-center px-2 py-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-12 h-12 rounded-full bg-[#ffdad3]/70 hover:bg-[#ffdad3] flex items-center justify-center text-[#ac331c] transition-transform hover:scale-105 mb-2 cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[24px]">add_photo_alternate</span>
                  </button>
                  <span className="font-semibold text-xs text-[#261812]">Tap to add photo</span>
                  <span className="text-[11px] font-medium text-[#ac331c] mt-0.5">
                    Slot {data.photos.length + 1} of 5
                  </span>

                  <button
                    type="button"
                    onClick={handleAddSample}
                    className="mt-2 text-[10px] text-[#786155] underline hover:text-[#ac331c] cursor-pointer"
                  >
                    + or use sample memory
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Indicator Hint */}
          <div className="w-full flex items-center justify-between px-1 text-xs text-[#786155] font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ac331c] inline-block" />
              {data.photos.length} / 5 photos hung
            </span>
            <div className="flex items-center gap-1">
              <span>Swipe photos</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </div>
          </div>

          {/* Fairy Lights Animation Toggle */}
          <div className="w-full bg-[#fff1ec] rounded-2xl p-3 flex items-center justify-between gap-3 border border-[#fce8dc]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#F59E0B] shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[19px]">flare</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-xs text-[#261812] truncate">
                  ✨ Fairy Lights Animation
                </span>
                <span className="text-[11px] text-[#786155] truncate">
                  Twinkling effect enabled on reveal
                </span>
              </div>
            </div>

            {/* Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={data.fairyLightsActive}
              onClick={() => onChange({ fairyLightsActive: !data.fairyLightsActive })}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 flex items-center cursor-pointer shrink-0 focus:outline-none ${
                data.fairyLightsActive ? 'bg-[#ff6f52]' : 'bg-[#efd4ca]'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 flex items-center justify-center text-[10px] text-[#ac331c] ${
                  data.fairyLightsActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              >
                ✨
              </span>
            </button>
          </div>


        </div>

        {/* Navigation Buttons */}
        <div className="w-full mt-6 flex flex-col gap-3">
          <div className="w-full flex items-center gap-3">
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
              <span>💌</span>
            </button>
          </div>

          <div className="w-full flex justify-center">
            <button
              type="button"
              onClick={onNext}
              className="group inline-flex items-center gap-1 text-xs text-[#786155] hover:text-[#ac331c] transition-colors py-1 px-3 rounded-full cursor-pointer font-medium"
            >
              <span>Skip photos for now</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="w-full mt-4 flex items-center justify-center gap-1.5 text-[#786155] text-xs text-center px-4 max-w-sm">
        <span className="material-symbols-outlined text-[16px] text-[#ac331c] shrink-0">lock</span>
        <span>Photos are stored securely in your private surprise link and stay live for 90 days</span>
      </div>
    </div>
  );
};
