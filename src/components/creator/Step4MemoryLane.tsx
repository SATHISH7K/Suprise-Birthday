import React, { useRef, useState, useEffect } from 'react';
import { SurpriseData, MemoryPhoto } from '../../types';
import { playChime } from '../../utils/sound';
import { fireConfetti } from '../../utils/confetti';

interface Step4Props {
  data: SurpriseData;
  onChange: (updates: Partial<SurpriseData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step4MemoryLane: React.FC<Step4Props> = ({ data, onChange, onNext, onBack }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Staged audio before applying, or initialized from current custom music
  const [stagedAudio, setStagedAudio] = useState<{
    url: string;
    name: string;
    duration: number;
  } | null>(() => {
    if (data.customMusicUrl) {
      return {
        url: data.customMusicUrl,
        name: data.customMusicName || 'custom_music.mp3',
        duration: data.customMusicDuration || 0,
      };
    }
    return null;
  });

  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [appliedJustNow, setAppliedJustNow] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Cleanup preview audio on unmount
  useEffect(() => {
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }
    };
  }, []);

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

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioError(null);
    if (file.size > 25 * 1024 * 1024) {
      setAudioError('Audio file is larger than 25MB. Please choose a smaller MP3/WAV file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      if (!url) return;

      const tempAudio = new Audio(url);
      tempAudio.addEventListener('loadedmetadata', () => {
        const duration = Math.round(tempAudio.duration || 0);
        setStagedAudio({
          url,
          name: file.name,
          duration,
        });
      });
      tempAudio.addEventListener('error', () => {
        setStagedAudio({
          url,
          name: file.name,
          duration: 0,
        });
      });
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomMusic = () => {
    if (!stagedAudio) return;
    onChange({
      customMusicUrl: stagedAudio.url,
      customMusicName: stagedAudio.name,
      customMusicDuration: stagedAudio.duration,
      soundtrack: 'custom',
    });
    playChime([523.25, 659.25, 783.99, 1046.5], 0.08, 0.3);
    fireConfetti(window.innerWidth / 2, window.innerHeight * 0.45, 30);
    setAppliedJustNow(true);
    setTimeout(() => setAppliedJustNow(false), 3200);
  };

  const handleTogglePreview = () => {
    const audioUrl = stagedAudio?.url || data.customMusicUrl;
    if (!audioUrl) return;

    if (isPlayingPreview) {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
      setIsPlayingPreview(false);
    } else {
      if (!previewAudioRef.current || previewAudioRef.current.src !== audioUrl) {
        previewAudioRef.current = new Audio(audioUrl);
      }
      previewAudioRef.current.volume = (data.soundtrackVolume || 50) / 100;
      previewAudioRef.current.play()
        .then(() => setIsPlayingPreview(true))
        .catch((e) => console.log('Audio preview playback blocked:', e));

      previewAudioRef.current.onended = () => {
        setIsPlayingPreview(false);
      };
    }
  };

  const handleRemoveCustomMusic = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
    }
    setIsPlayingPreview(false);
    setStagedAudio(null);
    onChange({
      customMusicUrl: undefined,
      customMusicName: undefined,
      customMusicDuration: undefined,
      soundtrack: 'blue',
    });
  };

  const formatSeconds = (sec: number) => {
    if (!sec || isNaN(sec)) return '--:--';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
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

          {/* Custom Celebration Music Card for Uploaded Memories */}
          <div className="w-full bg-gradient-to-br from-[#fff7f4] via-[#fff1ec] to-[#fee9df] rounded-2xl p-4 border border-[#fbd4c4] shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#fee3d8] flex items-center justify-center text-[#ac331c] shadow-xs shrink-0">
                  <span className="material-symbols-outlined text-[20px]">music_note</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-[#261812]">
                      Custom Celebration Music
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ffd5c8] text-[#ac331c]">
                      Receiver Music
                    </span>
                  </div>
                  <p className="text-[11px] text-[#786155]">
                    Play your own song in {data.recipientName}’s background!
                  </p>
                </div>
              </div>

              {/* Upload Song trigger button */}
              <input
                type="file"
                ref={audioInputRef}
                accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.webm"
                onChange={handleAudioUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => audioInputRef.current?.click()}
                className="px-3 py-1.5 rounded-full bg-white hover:bg-[#fff4ef] text-[#ac331c] text-xs font-bold border border-[#fbd4c4] shadow-2xs hover:shadow-xs transition-all flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-[16px]">upload_file</span>
                <span>{stagedAudio ? 'Change Song' : 'Upload MP3'}</span>
              </button>
            </div>

            {audioError && (
              <p className="text-xs text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                ⚠️ {audioError}
              </p>
            )}

            {/* If staged or active custom audio */}
            {stagedAudio ? (
              <div className="w-full bg-white rounded-xl p-3 border border-[#fce8dc] shadow-2xs flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      type="button"
                      onClick={handleTogglePreview}
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FB923C] to-[#F43F5E] text-white flex items-center justify-center shrink-0 shadow-xs cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                      title={isPlayingPreview ? 'Pause Preview' : 'Play Preview'}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isPlayingPreview ? 'pause' : 'play_arrow'}
                      </span>
                    </button>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-[#261812] truncate">
                        {stagedAudio.name}
                      </span>
                      <span className="text-[10px] text-[#786155] flex items-center gap-1.5">
                        <span>🎵 Custom Music</span>
                        {stagedAudio.duration > 0 && (
                          <>
                            <span>•</span>
                            <span>{formatSeconds(stagedAudio.duration)}</span>
                          </>
                        )}
                        {isPlayingPreview && (
                          <span className="text-[#ac331c] font-semibold animate-pulse">
                            (Playing Preview...)
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveCustomMusic}
                    className="text-[#786155] hover:text-[#ba1a1a] p-1 rounded-lg hover:bg-stone-100 transition-colors"
                    title="Remove custom music and restore Blue instrumental"
                  >
                    <span className="material-symbols-outlined text-[17px]">delete</span>
                  </button>
                </div>

                {/* Apply Button */}
                <div className="flex items-center gap-2 pt-1 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={handleApplyCustomMusic}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                      data.customMusicUrl === stagedAudio.url
                        ? 'bg-emerald-600 text-white shadow-emerald-500/25'
                        : 'bg-gradient-to-r from-[#FB923C] to-[#F43F5E] text-white hover:opacity-95'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {data.customMusicUrl === stagedAudio.url ? 'check_circle' : 'bolt'}
                    </span>
                    <span>
                      {data.customMusicUrl === stagedAudio.url
                        ? 'Applied to Receiver Background Music ✓'
                        : 'Apply as Receiver Background Music ✨'}
                    </span>
                  </button>
                </div>

                {appliedJustNow && (
                  <p className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1.5 rounded-lg text-center animate-fade-in border border-emerald-200">
                    🎉 Song applied! {data.recipientName} will hear this custom song when they open their surprise!
                  </p>
                )}
              </div>
            ) : (
              /* Default Instrumental State */
              <div className="w-full bg-white/70 rounded-xl p-2.5 border border-[#fce8dc] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🎶</span>
                  <div>
                    <span className="text-xs font-semibold text-[#261812] block">
                      Default: Blue (Yung Kai Instrumental)
                    </span>
                    <span className="text-[10px] text-[#786155]">
                      Or upload your own MP3 to play for {data.recipientName}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => audioInputRef.current?.click()}
                  className="text-[11px] font-bold text-[#ac331c] hover:underline cursor-pointer shrink-0 ml-2"
                >
                  + Upload Own
                </button>
              </div>
            )}

            {/* Volume slider */}
            <div className="flex items-center justify-between text-xs px-1 text-[#786155]">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">volume_up</span>
                <span>Receiver Music Volume: {data.soundtrackVolume}%</span>
              </span>
              <input
                type="range"
                min="10"
                max="100"
                value={data.soundtrackVolume}
                onChange={(e) => onChange({ soundtrackVolume: parseInt(e.target.value, 10) })}
                className="w-28 accent-[#ff6f52] cursor-pointer"
              />
            </div>
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
