import React, { useState, useRef, useEffect } from 'react';
import { playChime } from '../../utils/sound';

interface SoundtrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSoundtrack: string;
  volume: number;
  customMusicUrl?: string;
  customMusicName?: string;
  onSelectSoundtrack: (id: string, volume: number, customAudio?: { url: string; name: string }) => void;
}

export const SoundtrackStudioModal: React.FC<SoundtrackModalProps> = ({
  isOpen,
  onClose,
  selectedSoundtrack,
  volume,
  customMusicUrl,
  customMusicName,
  onSelectSoundtrack,
}) => {
  const [activeTrack, setActiveTrack] = useState(selectedSoundtrack || (customMusicUrl ? 'custom' : 'blue'));
  const [activeVolume, setActiveVolume] = useState(volume || 40);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeCategory, setActiveCategory] = useState('romantic');

  const [customAudio, setCustomAudio] = useState<{ url: string; name: string } | null>(() => {
    if (customMusicUrl) {
      return { url: customMusicUrl, name: customMusicName || 'My Custom Song' };
    }
    return null;
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (customMusicUrl) {
      setCustomAudio({ url: customMusicUrl, name: customMusicName || 'My Custom Song' });
    }
  }, [customMusicUrl, customMusicName]);

  useEffect(() => {
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }
    };
  }, []);

  if (!isOpen) return null;

  const handleCustomAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      if (url) {
        setCustomAudio({ url, name: file.name });
        setActiveTrack('custom');
        setIsPlaying(true);

        if (previewAudioRef.current) {
          previewAudioRef.current.pause();
        }
        previewAudioRef.current = new Audio(url);
        previewAudioRef.current.volume = activeVolume / 100;
        previewAudioRef.current.play().catch(() => {});
      }
    };
    reader.readAsDataURL(file);
  };

  const tracks = [
    {
      id: 'blue',
      title: 'Blue (Yung Kai Aesthetic)',
      genre: 'Slow dreamy acoustic guitar & warm vintage chords • Soulful & Romantic',
      duration: '3:22',
      category: 'romantic',
      curated: true,
      tag: 'User Choice ★',
    },
    {
      id: 'acoustic',
      title: 'Acoustic Warmth',
      genre: 'Gentle acoustic guitar & warm cello • Warm & Tender',
      duration: '2:48',
      category: 'romantic',
      curated: false,
      tag: 'Curated Pick',
    },
    {
      id: 'piano',
      title: 'Midnight Sunset Chords',
      genre: 'Soft electric piano with ambient reverb • Nostalgic & Dreamy',
      duration: '3:12',
      category: 'romantic',
      tag: 'Dreamy',
    },
    {
      id: 'starlit',
      title: 'Starlit Memories',
      genre: 'Fingerpicked ukulele & gentle glockenspiel • Sweet & Whimsical',
      duration: '2:15',
      category: 'acoustic',
      tag: 'Whimsical',
    },
    {
      id: 'cinematic',
      title: 'Our First Dance',
      genre: 'Cinematic slow strings & delicate harp • Romantic & Soulful',
      duration: '3:40',
      category: 'cinematic',
      tag: 'Cinematic',
    },
    {
      id: 'lofi',
      title: 'Café Chai & Raindrops',
      genre: 'Mellow acoustic beat with gentle vinyl crackle • Chill & Cozy',
      duration: '2:30',
      category: 'lofi',
      tag: 'Lo-Fi',
    },
    {
      id: 'waltz',
      title: 'Birthday Confetti Waltz',
      genre: 'Uplifting piano & sparkling bells crescendo • Joyful Celebration',
      duration: '2:05',
      category: 'joyful',
      tag: 'Joyful',
    },
  ];

  const categories = [
    { id: 'all', label: 'All Melodies (12)' },
    { id: 'romantic', label: 'Romantic & Warm 💕' },
    { id: 'acoustic', label: 'Acoustic & Gentle 🎸' },
    { id: 'joyful', label: 'Joyful & Playful 🎉' },
    { id: 'cinematic', label: 'Cinematic Nostalgia 🎞️' },
    { id: 'lofi', label: 'Lo-Fi Midnight 🌙' },
  ];

  const filteredTracks = activeCategory === 'all'
    ? tracks
    : tracks.filter((t) => t.category === activeCategory || t.id === activeTrack);

  const currentTrackObj = tracks.find((t) => t.id === activeTrack) || tracks[0];

  const handleApply = () => {
    if (activeTrack === 'custom' && customAudio) {
      onSelectSoundtrack('custom', activeVolume, customAudio);
    } else {
      onSelectSoundtrack(activeTrack, activeVolume);
    }
    playChime([523.25, 659.25, 783.99, 1046.5], 0.05, 0.2);
    onClose();
  };

  const handleTogglePlay = (trackId?: string) => {
    if (trackId && trackId !== activeTrack) {
      setActiveTrack(trackId);
      setIsPlaying(true);
      playChime([440, 554.37, 659.25], 0.08, 0.2);
    } else {
      setIsPlaying(!isPlaying);
      if (!isPlaying) {
        playChime([440, 554.37, 659.25], 0.08, 0.2);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl my-auto rounded-3xl bg-[#fff8f6] border border-[#fce8dc] shadow-[0_24px_60px_-12px_rgba(58,42,35,0.22)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-b from-[#FFF0E6]/70 to-[#fff8f6] border-b border-[#fce8dc]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#ffe9e1] flex items-center justify-center text-2xl shadow-xs text-[#ac331c]">
                🎵
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold uppercase text-[#ac331c] tracking-wider">
                    Ambient Atmosphere
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                  <span className="text-[11px] font-bold uppercase text-[#786155] tracking-wider">
                    Midnight Surprise
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#261812] tracking-tight mt-0.5">
                  Choose a Celebration Soundtrack
                </h1>
                <p className="text-xs sm:text-sm text-[#59413c] mt-0.5">
                  Soft, emotional music gently plays in the background while they open their surprise at midnight.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-[#FFF0E6] text-[#786155] hover:text-[#261812] hover:bg-[#ffe9e1] transition-all flex items-center justify-center shadow-xs flex-shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Volume Preset Banner & Category Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff1ec] text-[#786155] border border-[#fce8dc]">
              <span className="material-symbols-outlined text-[16px] text-[#ac331c]">volume_up</span>
              <span className="text-xs">
                Preset: <strong className="text-[#261812]">Gentle Ambient ({activeVolume}%)</strong>
              </span>
            </div>

            {/* Mood Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-[#ac331c] text-white shadow-xs'
                      : 'bg-[#fff1ec] text-[#59413c] hover:text-[#261812] hover:bg-[#fee3d8]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Body Scrollable Area */}
        <div className="px-6 py-4 overflow-y-auto space-y-4 flex-1">
          {/* Active Playing Hero Track Banner */}
          <div className="p-4 rounded-2xl bg-[#ffe9e1] border border-[#fce8dc] relative overflow-hidden shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Left Info with Musical Icon Badge */}
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FB923C] to-[#F43F5E] flex items-center justify-center text-white shadow-md flex-shrink-0">
                  <span className="material-symbols-outlined text-[28px] animate-pulse">
                    music_note
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-[#FFF0E6] text-[#ac331c] text-[10px] uppercase font-bold tracking-wider">
                      Recommended for Letters &amp; Reveals
                    </span>
                    <span className="text-[#F59E0B] text-xs font-semibold">★ Curated Pick</span>
                  </div>
                  <h3 className="text-base font-bold text-[#261812] truncate mt-0.5">
                    {currentTrackObj.title}
                  </h3>
                  <p className="text-xs text-[#59413c] flex items-center gap-1.5 mt-0.5">
                    <span>{currentTrackObj.genre}</span>
                  </p>
                </div>
              </div>

              {/* Central / Right Audio Controls & Interactive Waveform */}
              <div className="flex-1 lg:max-w-md flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[#786155] text-xs">
                  <span className="font-semibold text-[#ac331c]">01:14</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#59413c] font-bold">
                    Live Waveform Preview
                  </span>
                  <span>{currentTrackObj.duration}</span>
                </div>

                {/* Animated Waveform */}
                <div className="h-10 w-full rounded-lg bg-white/80 px-2 flex items-center justify-between gap-1 shadow-inner border border-[#fce8dc]">
                  <div className="flex items-center gap-1 w-full h-7">
                    {[12, 18, 14, 22, 26, 19, 14, 24, 28, 16, 22, 26, 18, 12, 16, 20, 14, 18, 24, 15, 10].map((h, i) => (
                      <span
                        key={i}
                        className={`w-1 rounded-full transition-all duration-300 ${
                          i < 12
                            ? isPlaying
                              ? 'bg-[#ac331c] animate-pulse'
                              : 'bg-[#ac331c]'
                            : 'bg-[#efd4ca]'
                        }`}
                        style={{ height: `${h}px` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Compact Controls Strip */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleTogglePlay()}
                      className="w-8 h-8 rounded-full bg-[#ac331c] text-white flex items-center justify-center shadow hover:scale-105 transition-transform cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isPlaying ? 'pause' : 'play_arrow'}
                      </span>
                    </button>
                    <span className="text-xs text-[#786155] font-medium">Seamless loop</span>
                  </div>

                  {/* Volume Slider */}
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#786155]">
                      volume_down
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={activeVolume}
                      onChange={(e) => setActiveVolume(Number(e.target.value))}
                      className="w-20 h-1.5 bg-[#f8ddd2] rounded-lg appearance-none cursor-pointer accent-[#ac331c]"
                    />
                    <span className="text-xs text-[#786155] font-semibold">{activeVolume}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Custom Song Upload Section */}
          <div className="p-4 rounded-2xl bg-[#FFF6F2] border-2 border-dashed border-[#FCA5A5]/60 hover:border-[#F43F5E] transition-all flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FB923C] to-[#F43F5E] text-white flex items-center justify-center text-lg shadow-xs shrink-0">
                🎵
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#261812]">
                    {customAudio ? customAudio.name : 'Upload Your Own Song'}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-[#fee3d8] text-[#ac331c] text-[10px] font-bold">
                    {customAudio ? 'Uploaded Audio' : 'Custom Audio'}
                  </span>
                </div>
                <p className="text-xs text-[#786155]">
                  {customAudio
                    ? 'Selected as background soundtrack for recipient'
                    : 'Upload any MP3, WAV or song to play as background music'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <input
                type="file"
                ref={fileInputRef}
                accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.webm"
                onChange={handleCustomAudioUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-full bg-white hover:bg-[#fff1ec] text-[#ac331c] text-xs font-bold border border-[#fce8dc] shadow-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[16px]">upload</span>
                <span>{customAudio ? 'Replace Song' : 'Choose Audio File'}</span>
              </button>

              {customAudio && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTrack('custom');
                    setIsPlaying(true);
                    if (previewAudioRef.current) {
                      previewAudioRef.current.pause();
                    }
                    previewAudioRef.current = new Audio(customAudio.url);
                    previewAudioRef.current.volume = activeVolume / 100;
                    previewAudioRef.current.play().catch(() => {});
                  }}
                  className={`px-3 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    activeTrack === 'custom'
                      ? 'bg-[#ac331c] text-white'
                      : 'bg-[#ffe9e1] text-[#ac331c] hover:bg-[#fed7cc]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">
                    {activeTrack === 'custom' ? 'check' : 'play_arrow'}
                  </span>
                  <span>{activeTrack === 'custom' ? 'Selected' : 'Use This'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Track List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-[#261812]">Curated Melodies</h4>
              <span className="text-xs text-[#786155]">{filteredTracks.length} available</span>
            </div>

            <div className="space-y-2">
              {filteredTracks.map((track) => {
                const isSelected = activeTrack === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => handleTogglePlay(track.id)}
                    className={`p-3 rounded-2xl transition-all shadow-xs flex items-center justify-between gap-3 cursor-pointer border ${
                      isSelected
                        ? 'bg-gradient-to-r from-white via-[#FFF0E6]/60 to-white border-[#ac331c]'
                        : 'bg-white hover:bg-[#fff1ec] border-[#fce8dc]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        type="button"
                        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected ? 'bg-[#ac331c] text-white shadow-xs' : 'bg-[#ffe9e1] text-[#ac331c]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {isSelected && isPlaying ? 'pause' : 'play_arrow'}
                        </span>
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs sm:text-sm text-[#261812] truncate">
                            {track.title}
                          </span>
                          <span className="px-2 py-0.2 rounded-full bg-[#fee3d8] text-[#ac331c] text-[10px] font-bold uppercase">
                            {track.tag}
                          </span>
                        </div>
                        <p className="text-xs text-[#59413c] truncate mt-0.5">
                          {track.genre}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xs text-[#786155] font-medium">{track.duration}</span>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          isSelected ? 'bg-[#ac331c] text-white' : 'bg-[#fee3d8] text-[#786155]/40'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {isSelected ? 'check' : 'add'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="px-6 py-4 bg-[#fff1ec] border-t border-[#fce8dc] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <button
            type="button"
            onClick={() => playChime([523.25, 659.25, 783.99], 0.1, 0.25)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-white hover:bg-[#fee3d8] text-[#786155] hover:text-[#261812] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs border border-[#fce8dc] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-[#ac331c]">headphones</span>
            <span>Test Recipient Audio Experience</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 sm:w-auto px-5 py-2.5 rounded-full text-xs font-semibold text-[#786155] hover:text-[#261812] hover:bg-[#fee3d8] transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="w-1/2 sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FB923C] to-[#F43F5E] text-white text-xs sm:text-sm font-semibold shadow-[0_8px_20px_-4px_rgba(255,111,82,0.35)] hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Apply Soundtrack</span>
              <span>✨</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
