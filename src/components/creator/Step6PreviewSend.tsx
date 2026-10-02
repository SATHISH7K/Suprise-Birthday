import React, { useState, useEffect } from 'react';
import { SurpriseData, MemoryPhoto } from '../../types';
import { CAKE_OPTIONS } from '../../defaultData';
import { fireConfetti } from '../../utils/confetti';

import { compressSurprise } from '../../utils/compression';

interface Step6Props {
  data: SurpriseData;
  onSelectStep: (step: number) => void;
  onOpenPreview: (isReceiverView?: boolean) => void;
  surpriseId?: string;
  onSaveSurprise?: () => Promise<string>;
}

export const Step6PreviewSend: React.FC<Step6Props> = ({
  data,
  onSelectStep,
  onOpenPreview,
  surpriseId,
  onSaveSurprise,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeId, setActiveId] = useState(surpriseId || '');
  const [compressedPayload, setCompressedPayload] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<MemoryPhoto | null>(null);
  const [isPlayingCustomAudio, setIsPlayingCustomAudio] = useState(false);
  const audioPreviewRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
        audioPreviewRef.current = null;
      }
    };
  }, []);

  // Compute compressed data payload for bulletproof offline/mobile fallback
  useEffect(() => {
    let isMounted = true;
    compressSurprise(data).then((compressed) => {
      if (isMounted && compressed) {
        setCompressedPayload(compressed);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [data]);

  const handleTogglePreview = () => {
    if (!data.customMusicUrl) return;
    if (isPlayingCustomAudio) {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
      }
      setIsPlayingCustomAudio(false);
    } else {
      if (!audioPreviewRef.current || audioPreviewRef.current.src !== data.customMusicUrl) {
        audioPreviewRef.current = new Audio(data.customMusicUrl);
      }
      audioPreviewRef.current.volume = (data.soundtrackVolume || 50) / 100;
      audioPreviewRef.current.play()
        .then(() => setIsPlayingCustomAudio(true))
        .catch(() => { });
      audioPreviewRef.current.onended = () => {
        setIsPlayingCustomAudio(false);
      };
    }
  };

  const selectedCake = CAKE_OPTIONS.find((c) => c.id === data.cake) || CAKE_OPTIONS[0];

  useEffect(() => {
    if (surpriseId) {
      setActiveId(surpriseId);
    } else if (onSaveSurprise) {
      setIsSaving(true);
      onSaveSurprise()
        .then((id) => {
          if (id) setActiveId(id);
        })
        .catch((err) => console.warn('Could not auto-save surprise:', err))
        .finally(() => setIsSaving(false));
    }
  }, [surpriseId, onSaveSurprise]);

  // Construct clean, compact URL using the server surprise ID
  const queryParams = new URLSearchParams();
  if (activeId) {
    queryParams.set('id', activeId);
  } else if (compressedPayload) {
    // Only use compressed fallback if server ID is not available
    queryParams.set('d', compressedPayload);
    queryParams.set('star', data.recipientName);
    queryParams.set('from', data.senderName);
  }
  queryParams.set('receiver', 'true');

  const shareUrl = `${window.location.origin}?${queryParams.toString()}`;

  const getEffectiveShareUrl = async (): Promise<string> => {
    if (activeId) {
      return `${window.location.origin}?id=${activeId}&receiver=true`;
    }
    if (onSaveSurprise) {
      try {
        setIsSaving(true);
        const id = await onSaveSurprise();
        if (id) {
          setActiveId(id);
          return `${window.location.origin}?id=${id}&receiver=true`;
        }
      } catch (err) {
        console.warn('Auto-save error before share:', err);
      } finally {
        setIsSaving(false);
      }
    }
    return shareUrl;
  };

  const handleCopyLink = async () => {
    const url = await getEffectiveShareUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    fireConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 30);
    setTimeout(() => setCopied(false), 2800);
  };

  const handleShareWhatsApp = async (e: React.MouseEvent) => {
    e.preventDefault();
    const url = await getEffectiveShareUrl();
    const msg = encodeURIComponent(
      `Hey ${data.recipientName}! 🎀 I handcrafted something special and unforgettable just for your birthday... Open your surprise here: ${url} ✨`
    );
    window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    const url = await getEffectiveShareUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Birthday Surprise for ${data.recipientName}`,
          text: `A handcrafted birthday surprise for ${data.recipientName} with love by ${data.senderName}`,
          url: url,
        });
      } catch {
        // User canceled or share failed
      }
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2800);
    }
  };

  return (
    <div className="flex flex-col w-full items-center justify-center py-8 px-4 relative select-none">
      {/* Ambient background glows */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[680px] h-[360px] bg-gradient-to-b from-[#ffdad3]/40 via-[#ffe9e1]/30 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-[#ffdf9f]/30 blur-3xl pointer-events-none rounded-full" />

      {/* Header */}
      <div className="w-full max-w-3xl flex flex-col items-center text-center mb-8 z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fee3d8] text-[#ac331c] text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
          <span>✨</span>
          <span>Step 6 of 6 • Preview &amp; Send</span>
          <span>🎀</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#261812] tracking-tight mb-2">
          Your surprise for {data.recipientName} is ready!
        </h1>
        <p className="text-sm sm:text-base text-[#786155] max-w-lg">
          Baked with love by <strong className="text-[#261812]">{data.senderName}</strong>. Test the exact experience {data.recipientName} will receive or share their private magic link!
        </p>

        {/* Large Primary Action Launch Bar */}
        <div className="w-full max-w-xl mt-6 p-4 sm:p-5 rounded-3xl bg-white border border-[#fce8dc] shadow-[0_16px_40px_-8px_rgba(120,97,85,0.12)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FB923C] to-[#F43F5E] flex items-center justify-center text-white shadow-md shrink-0">
              <span className="material-symbols-outlined text-[28px]">redeem</span>
            </div>
            <div>
              <span className="font-bold text-base text-[#261812] block">
                Test Recipient Experience
              </span>
              <span className="text-xs text-[#786155]">
                Starts at Cupid bow with {data.customMusicUrl ? `custom song "${data.customMusicName || 'Your Music'}"` : '"Blue" instrumental melody'}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onOpenPreview(true)}
              className="w-full sm:w-auto px-5 py-3 rounded-full bg-gradient-to-r from-[#FB923C] to-[#F43F5E] hover:opacity-95 text-white font-semibold text-xs sm:text-sm shadow-[0_10px_24px_-4px_rgba(255,111,82,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <span>Preview as Receiver ✨</span>
              <span className="material-symbols-outlined text-[17px]">visibility</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenPreview(false)}
              className="w-full sm:w-auto px-3.5 py-3 rounded-full bg-[#fff1ec] hover:bg-[#ffe9e1] text-[#ac331c] font-semibold text-xs border border-[#fce8dc] transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
              title="Test with scene jump controls"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>Chapters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Bento Grid */}
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4 z-10 mb-6">
        {/* Card 1: The Star */}
        <div className="bg-white rounded-2xl p-5 border border-[#fce8dc] shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#fee3d8] flex items-center justify-center text-xl">
                🌟
              </div>
              <div>
                <span className="text-[11px] uppercase font-bold text-[#ac331c] tracking-wider block">
                  Chapter 1 • Dedication
                </span>
                <span className="font-bold text-base text-[#261812]">
                  {data.recipientName} {data.age ? `(Turning ${data.age})` : ''}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onSelectStep(1)}
              className="text-xs text-[#ac331c] font-semibold hover:underline"
            >
              Edit
            </button>
          </div>
          <p className="text-xs text-[#786155] mt-3">
            Birthday: {data.birthMonth} {data.birthDay || '—'} • Wrapped with gift ribbon
          </p>
        </div>

        {/* Card 2: The Cake */}
        <div className="bg-white rounded-2xl p-5 border border-[#fce8dc] shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#fee3d8] flex items-center justify-center text-xl">
                🎂
              </div>
              <div>
                <span className="text-[11px] uppercase font-bold text-[#ac331c] tracking-wider block">
                  Chapter 2 • Cake
                </span>
                <span className="font-bold text-base text-[#261812]">
                  {selectedCake.title}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onSelectStep(2)}
              className="text-xs text-[#ac331c] font-semibold hover:underline"
            >
              Edit
            </button>
          </div>
          <p className="text-xs text-[#786155] mt-3 flex items-center gap-2">
            <span>{selectedCake.sub}</span>
            <span>•</span>
            <span className="text-[#F59E0B] font-medium">Virtual candles ready to blow 🕯️</span>
          </p>
        </div>

        {/* Card 3: Balloons */}
        <div className="bg-white rounded-2xl p-5 border border-[#fce8dc] shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#fee3d8] flex items-center justify-center text-xl">
                🎈
              </div>
              <div>
                <span className="text-[11px] uppercase font-bold text-[#ac331c] tracking-wider block">
                  Chapter 3 • Balloons
                </span>
                <span className="font-bold text-base text-[#261812]">
                  {data.balloons.length} Reasons Attached
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onSelectStep(3)}
              className="text-xs text-[#ac331c] font-semibold hover:underline"
            >
              Edit
            </button>
          </div>
          <p className="text-xs text-[#786155] mt-3 truncate">
            "{data.balloons[0]?.text || 'No reasons yet'}"
          </p>
        </div>

        {/* Card 4: Letter & Wax Seal */}
        <div className="bg-white rounded-2xl p-5 border border-[#fce8dc] shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#fee3d8] flex items-center justify-center text-xl">
                💌
              </div>
              <div>
                <span className="text-[11px] uppercase font-bold text-[#ac331c] tracking-wider block">
                  Chapter 4 • The Letter
                </span>
                <span className="font-bold text-base text-[#261812]">
                  Sealed with {data.waxSeal.toUpperCase()} stamp
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onSelectStep(5)}
              className="text-xs text-[#ac331c] font-semibold hover:underline"
            >
              Edit
            </button>
          </div>
          <p className="text-xs text-[#786155] mt-3 line-clamp-1 italic">
            "{data.letter}"
          </p>
        </div>

        {/* Dual Voice Notes Summary Badge */}
        <div className="bg-gradient-to-r from-[#FFF0E6] via-white to-[#FFF0E6] rounded-2xl p-4 border border-[#fce8dc] shadow-sm flex flex-col gap-2 md:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#ac331c]">
              <span className="material-symbols-outlined text-[18px]">record_voice_over</span>
              <span>Attached Audio Voice Notes</span>
            </div>
            <span className="text-[11px] text-[#786155]">
              Soundtrack: <strong className="text-[#261812]">{data.soundtrack === 'blue' ? 'Blue (Yung Kai Instrumental) 🎵' : 'Acoustic Warmth'}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#fff1ec] border border-[#fce8dc]">
              <div className="flex items-center gap-2">
                <span>🎂</span>
                <div>
                  <span className="text-xs font-semibold text-[#261812] block">Candle Blow Recording</span>
                  <span className="text-[10px] text-[#786155]">Plays when candles are blown</span>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${data.voiceNoteCandle?.audioUrl ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                }`}>
                {data.voiceNoteCandle?.audioUrl ? 'Attached ✓' : 'Optional'}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#fff1ec] border border-[#fce8dc]">
              <div className="flex items-center gap-2">
                <span>💌</span>
                <div>
                  <span className="text-xs font-semibold text-[#261812] block">Letter Voice Note</span>
                  <span className="text-[10px] text-[#786155]">Plays on letter chapter</span>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${data.voiceNoteLetter?.audioUrl ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                }`}>
                {data.voiceNoteLetter?.audioUrl ? 'Attached ✓' : 'Optional'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 
        PROMINENT UPLOADED IMAGES GALLERY SHOWCASE
        "the uploaded image wants to come in when sender completed the total surprise in last it wants to come and then the link to share wants to come"
      */}
      <div className="w-full max-w-3xl bg-white rounded-3xl p-6 sm:p-7 border border-[#fce8dc] shadow-[0_12px_36px_rgba(120,97,85,0.08)] z-10 mb-6 flex flex-col">
        {/* Header with fairy lights decoration */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#fee3d8] flex items-center justify-center text-xl text-[#ac331c] shadow-xs">
              📸
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[#261812] tracking-tight">
                  Uploaded Memory Polaroids
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#fee3d8] text-[#ac331c] text-[11px] font-bold">
                  {data.photos?.length || 0} Photos
                </span>
              </div>
              <p className="text-xs text-[#786155]">
                Hanging on twinkling fairy lights for {data.recipientName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectStep(4)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#fff1ec] hover:bg-[#fee3d8] text-[#ac331c] text-xs font-bold border border-[#fce8dc] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
            <span>Edit Photos</span>
          </button>
        </div>

        {/* Fairy Light Golden String Above Photos */}
        <div className="w-full flex items-center justify-around relative mb-3">
          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#ffd56b]/80 to-transparent" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#fde047] shadow-[0_0_10px_#fde047] animate-pulse" />
          <span className="w-3 h-3 rounded-full bg-[#fde047] shadow-[0_0_14px_#fde047] animate-pulse" style={{ animationDelay: '0.3s' }} />
          <span className="w-2.5 h-2.5 rounded-full bg-[#fde047] shadow-[0_0_10px_#fde047] animate-pulse" style={{ animationDelay: '0.6s' }} />
          <span className="w-3 h-3 rounded-full bg-[#fde047] shadow-[0_0_14px_#fde047] animate-pulse" style={{ animationDelay: '0.9s' }} />
        </div>

        {/* Photos Grid Showcase */}
        {data.photos && data.photos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1">
            {data.photos.map((photo, idx) => {
              const rotStyles = ['-rotate-1', 'rotate-1', '-rotate-2', 'rotate-2'];
              const rotClass = rotStyles[idx % rotStyles.length];

              return (
                <div
                  key={photo.id || idx}
                  onClick={() => setSelectedPhoto(photo)}
                  className={`relative bg-[#fcf9f7] rounded-2xl p-3 border border-[#fce8dc] shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.03] cursor-pointer flex flex-col group ${rotClass}`}
                >
                  {/* Clothespin indicator */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-6 bg-[#d49c65] rounded-xs shadow-xs z-20 flex items-center justify-center border border-[#ad7842]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7a4e25]" />
                  </div>

                  {/* Photo Thumbnail Container */}
                  <div className="w-full h-44 rounded-xl overflow-hidden bg-[#fee3d8] relative shadow-inner mb-2.5">
                    <img
                      src={photo.url}
                      alt={photo.caption || `Memory ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">zoom_in</span>
                      <span>Zoom</span>
                    </span>
                  </div>

                  {/* Caption & Metadata */}
                  <div className="flex flex-col text-center px-1">
                    <p className="text-xs font-serif font-semibold text-[#261812] line-clamp-1">
                      {photo.caption || 'Cherished Memory ✨'}
                    </p>
                    <div className="flex items-center justify-center gap-1.5 mt-1 text-[10px] text-[#8c6760]">
                      {photo.location && <span>📍 {photo.location}</span>}
                      {photo.date && <span>• {photo.date}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Photos State */
          <div
            onClick={() => onSelectStep(4)}
            className="w-full p-8 rounded-2xl border-2 border-dashed border-[#fce8dc] hover:border-[#ac331c] bg-[#fffaf8] flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-[#fee3d8] text-[#ac331c] flex items-center justify-center text-2xl mb-2">
              📸
            </div>
            <p className="text-sm font-bold text-[#261812]">
              No uploaded photos yet
            </p>
            <p className="text-xs text-[#786155] mt-1 max-w-sm">
              Add your favorite memories with {data.recipientName} to showcase them on the fairy lights wire!
            </p>
            <span className="mt-3 inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#ac331c] text-white text-xs font-semibold shadow-xs">
              <span>+ Upload Photos</span>
            </span>
          </div>
        )}

        {/* Background Music Status Bar for Uploaded Memories */}
        <div className="mt-4 pt-3 border-t border-[#fce8dc] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#fff8f5] rounded-2xl p-3 border border-[#fae3d8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#fee3d8] text-[#ac331c] flex items-center justify-center text-sm shadow-xs shrink-0">
              🎵
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#261812]">
                  {data.customMusicUrl
                    ? (data.customMusicName || 'Custom Song')
                    : 'Blue (Yung Kai Instrumental)'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {data.customMusicUrl ? 'Custom Song Applied ✓' : 'Default Music'}
                </span>
              </div>
              <p className="text-[11px] text-[#786155]">
                {data.customMusicUrl
                  ? `Plays continuously as ${data.recipientName}’s background music`
                  : `Plays as background music • You can upload your own custom song in Step 4`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {data.customMusicUrl && (
              <button
                type="button"
                onClick={handleTogglePreview}
                className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FB923C] to-[#F43F5E] text-white text-xs font-semibold shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">
                  {isPlayingCustomAudio ? 'pause' : 'play_arrow'}
                </span>
                <span>{isPlayingCustomAudio ? 'Pause' : 'Test Audio'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onSelectStep(4)}
              className="px-3 py-1.5 rounded-full bg-white hover:bg-[#fee3d8] text-[#ac331c] text-xs font-bold border border-[#fce8dc] shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">music_note</span>
              <span>{data.customMusicUrl ? 'Change Song' : '+ Add Own Music'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 
        DELIVER THE MAGIC (SHARE SECTION)
        "in last it wants to come and then the link to share wants to come"
      */}
      <div className="w-full max-w-3xl bg-[#fff1ec] rounded-3xl p-6 sm:p-8 border border-[#fce8dc] shadow-sm z-10 flex flex-col gap-5">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-[#ac331c] tracking-wider block">
              Deliver The Magic
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#261812] tracking-tight mt-0.5">
              Share this private surprise link with {data.recipientName}
            </h2>
            <p className="text-xs sm:text-sm text-[#786155] mt-1">
              When {data.recipientName} opens this link, their surprise starts right at Cupid's bow with your photos, voice notes, and {data.customMusicUrl ? `your custom background song "${data.customMusicName || 'Your Music'}"` : 'the "Blue" instrumental melody'}!
            </p>
          </div>
          {isSaving && (
            <span className="text-xs text-[#ac331c] bg-[#ffdcd3] px-2.5 py-1 rounded-full animate-pulse font-semibold">
              Syncing...
            </span>
          )}
        </div>

        {/* Link Input Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full relative">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full h-12 px-4 rounded-2xl bg-white border border-[#fce8dc] text-xs sm:text-sm text-[#261812] font-mono select-all focus:outline-none"
            />
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#ac331c] text-[18px]">
              link
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full sm:w-auto h-12 px-6 rounded-2xl bg-[#ac331c] hover:bg-[#8a1b06] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm cursor-pointer whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[18px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Link Copied!' : 'Copy Magic Link'}</span>
          </button>
        </div>

        {/* Social Quick Share Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs sm:text-sm shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <span>Share via WhatsApp 💬</span>
          </button>

          <button
            type="button"
            onClick={handleNativeShare}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-[#261812] font-semibold text-xs sm:text-sm border border-[#fce8dc] shadow-xs hover:bg-[#ffe9e1] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
            <span>More Options</span>
          </button>
        </div>
      </div>

      {/* Lightbox Zoom Modal for Uploaded Polaroids */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl border border-white/20 animate-bloom flex flex-col items-center"
          >
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-[#261812] text-sm font-bold cursor-pointer"
            >
              ✕
            </button>

            <div className="w-full h-72 sm:h-80 rounded-2xl overflow-hidden bg-[#fee3d8] mb-4 shadow-inner">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption || 'Memory'}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <h4 className="text-base sm:text-lg font-serif font-bold text-[#261812] text-center">
              {selectedPhoto.caption || 'Cherished Moment ✨'}
            </h4>

            {(selectedPhoto.location || selectedPhoto.date) && (
              <p className="text-xs text-[#8c6760] mt-1 text-center font-medium">
                {selectedPhoto.location ? `📍 ${selectedPhoto.location}` : ''}
                {selectedPhoto.location && selectedPhoto.date ? ' • ' : ''}
                {selectedPhoto.date ? `🗓️ ${selectedPhoto.date}` : ''}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
