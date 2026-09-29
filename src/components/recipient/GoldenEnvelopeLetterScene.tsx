import React, { useState, useRef, useEffect } from 'react';
import { SurpriseData } from '../../types';
import { playChime, pauseBackgroundMusicForSpeech, resumeBackgroundMusicAfterSpeech } from '../../utils/sound';
import { fireConfetti } from '../../utils/confetti';

interface GoldenEnvelopeLetterSceneProps {
  data: SurpriseData;
  onNext: () => void;
}

export const GoldenEnvelopeLetterScene: React.FC<GoldenEnvelopeLetterSceneProps> = ({
  data,
  onNext,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const letterVoice =
    data.voiceNoteLetter?.audioUrl ||
    (data.voiceNote?.trigger === 'chapter4' ? data.voiceNote.audioUrl : (!data.voiceNoteCandle?.audioUrl ? data.voiceNote?.audioUrl : undefined));
  const hasVoice = Boolean(letterVoice);

  // Ensure audio is stopped and music is resumed on unmount
  useEffect(() => {
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
      resumeBackgroundMusicAfterSpeech(data.soundtrackVolume / 100, data.soundtrack || 'blue', data.customMusicUrl);
    };
  }, [data.soundtrackVolume, data.soundtrack, data.customMusicUrl]);

  const handleOpenEnvelope = () => {
    if (isOpen) return;
    setIsOpen(true);
    playChime([659.25, 830.61, 987.77, 1318.51], 0.08, 0.3);
    fireConfetti(window.innerWidth / 2, window.innerHeight * 0.45, 25);

    // Simultaneously play the 2nd voice recording as requested!
    if (hasVoice) {
      setTimeout(() => {
        if (audioPlayerRef.current) {
          pauseBackgroundMusicForSpeech();
          audioPlayerRef.current.currentTime = 0;
          audioPlayerRef.current.play()
            .then(() => {
              setIsPlayingVoice(true);
            })
            .catch((e) => {
              console.log('Voice autoplay on open letter prevented, tap to play:', e);
              resumeBackgroundMusicAfterSpeech(data.soundtrackVolume / 100, data.soundtrack || 'blue', data.customMusicUrl);
            });

          audioPlayerRef.current.onended = () => {
            setIsPlayingVoice(false);
            resumeBackgroundMusicAfterSpeech(data.soundtrackVolume / 100, data.soundtrack || 'blue', data.customMusicUrl);
          };
        }
      }, 400);
    }
  };

  const handleToggleVoice = () => {
    if (!audioPlayerRef.current) return;
    if (isPlayingVoice) {
      audioPlayerRef.current.pause();
      setIsPlayingVoice(false);
      resumeBackgroundMusicAfterSpeech(data.soundtrackVolume / 100, data.soundtrack || 'blue', data.customMusicUrl);
    } else {
      pauseBackgroundMusicForSpeech();
      audioPlayerRef.current.play()
        .then(() => setIsPlayingVoice(true))
        .catch(() => resumeBackgroundMusicAfterSpeech(data.soundtrackVolume / 100, data.soundtrack || 'blue', data.customMusicUrl));
    }
  };

  const handleContinueNext = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    resumeBackgroundMusicAfterSpeech(data.soundtrackVolume / 100, data.soundtrack || 'blue');
    onNext();
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
              left: `${(i * 13) % 100}%`,
              top: `${(i * 31) % 100}%`,
              opacity: (i % 4) * 0.2 + 0.25,
              animationDelay: `${(i * 0.19) % 3}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 text-center pt-4 sm:pt-6 max-w-md">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          One last thing, {data.recipientName}...
        </h2>
        <p className="text-xs sm:text-sm text-pink-200/80 mt-1 font-serif italic">
          {data.senderName} wrote you a letter.
        </p>
      </div>

      {/* Center: The Golden Envelope & Letter Canvas */}
      <div className="relative z-10 w-full max-w-md my-auto flex flex-col items-center justify-center min-h-[380px]">
        {!isOpen ? (
          /* Sealed Golden Envelope State */
          <div
            onClick={handleOpenEnvelope}
            className="relative flex flex-col items-center cursor-pointer group active:scale-95 transition-transform"
            title="Tap to open your letter"
          >
            {/* Ambient Golden Glow Behind */}
            <div className="absolute w-64 h-48 rounded-full bg-[#f59e0b]/25 blur-3xl pointer-events-none" />

            {/* Golden Envelope Body */}
            <div className="relative w-72 h-48 sm:w-80 sm:h-52 bg-gradient-to-br from-[#d97706] via-[#f59e0b] to-[#b45309] rounded-2xl shadow-[0_20px_45px_rgba(0,0,0,0.5)] border-2 border-[#fde68a]/40 overflow-hidden flex items-center justify-center group-hover:scale-102 transition-transform">
              {/* Envelope Flap Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 320 208" fill="none">
                <path d="M0 0 L160 110 L320 0" fill="#f59e0b" stroke="#fde68a" strokeWidth="1.5" />
                <path d="M0 208 L160 95 L320 208" fill="#d97706" opacity="0.6" stroke="#fde68a" strokeWidth="1.2" />
              </svg>

              {/* Center Golden Wax Seal Stamp */}
              <div className="relative z-10 w-14 h-14 rounded-full bg-gradient-to-tr from-[#991b1b] via-[#dc2626] to-[#b91c1c] shadow-[0_4px_16px_rgba(0,0,0,0.4)] border-2 border-[#fecaca]/50 flex items-center justify-center animate-pulse">
                <span className="font-serif font-black text-xl text-amber-200 drop-shadow-sm select-none">
                  {data.senderName ? data.senderName[0].toUpperCase() : '♥'}
                </span>
              </div>
            </div>

            {/* Instruction Below Envelope */}
            <div className="mt-5 flex flex-col items-center gap-1 animate-pulse">
              <span className="text-xs uppercase tracking-widest text-amber-200 font-bold flex items-center gap-1.5">
                <span>Tap to open your letter</span>
                <span>👇</span>
              </span>
            </div>
          </div>
        ) : (
          /* Unfolded Parchment Letter View */
          <div className="w-full bg-[#fffcf5] text-[#261812] rounded-3xl p-6 sm:p-7 shadow-[0_25px_50px_rgba(0,0,0,0.5)] border border-[#fef3c7] flex flex-col gap-4 animate-bloom">
            {/* Letter Header */}
            <div className="flex items-center justify-between border-b border-[#fde68a]/60 pb-3">
              <span className="text-xs font-serif italic text-[#8c6760]">
                A personal birthday keepsake
              </span>
              <span className="text-sm">🌸 💌</span>
            </div>

            {/* Salutation */}
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#ac331c]">
              Dear {data.recipientName},
            </h3>

            {/* Body */}
            <p className="text-xs sm:text-sm text-[#382721] font-serif leading-relaxed whitespace-pre-line">
              {data.letter}
            </p>

            {/* Closing */}
            <div className="text-right pt-2">
              <p className="text-xs font-serif italic text-[#8c6760]">With all my love,</p>
              <p className="text-sm sm:text-base font-serif font-bold text-[#ac331c] mt-0.5">
                {data.senderName}
              </p>
            </div>

            {/* Attached Letter Voice Recording Player */}
            {hasVoice && (
              <div className="mt-2 p-3 rounded-2xl bg-[#fff0ea] border border-[#fce8dc] flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className="w-9 h-9 rounded-full bg-[#ac331c] text-white flex items-center justify-center shrink-0 shadow-xs active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isPlayingVoice ? 'pause' : 'play_arrow'}
                  </span>
                </button>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#ac331c] block">
                    Letter Voice Note from {data.senderName} 🎙️
                  </span>
                  <p className="text-[11px] text-[#786155] truncate">
                    {isPlayingVoice ? 'Speaking personal message...' : 'Tap to hear personal audio'}
                  </p>
                </div>
                <audio
                  ref={audioPlayerRef}
                  src={letterVoice}
                  onEnded={() => setIsPlayingVoice(false)}
                  className="hidden"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Action Area */}
      {isOpen && (
        <div className="relative z-10 w-full max-w-sm flex flex-col items-center pb-4 animate-fadeIn">
          <button
            type="button"
            onClick={handleContinueNext}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#ffd56b] to-[#f59e0b] text-[#180a2b] font-bold text-sm sm:text-base shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer animate-pulse"
          >
            <span>Continue</span>
            <span>💌 →</span>
          </button>
        </div>
      )}
    </div>
  );
};
