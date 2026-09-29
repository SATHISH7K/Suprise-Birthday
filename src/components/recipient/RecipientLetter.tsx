import React, { useState } from 'react';
import { SurpriseData } from '../../types';
import { fireConfetti } from '../../utils/confetti';
import { playWaxBreakSound, playHeartChime } from '../../utils/sound';

interface RecipientLetterProps {
  data: SurpriseData;
  onReplay: () => void;
  isSoundOn: boolean;
  onToggleSound: () => void;
}

export const RecipientLetter: React.FC<RecipientLetterProps> = ({
  data,
  onReplay,
  isSoundOn,
  onToggleSound,
}) => {
  const [isBroken, setIsBroken] = useState(false);
  const [hearts, setHearts] = useState(12);
  const [hugSent, setHugSent] = useState(false);
  const [isPlayingSong, setIsPlayingSong] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2800);
  };

  const handleCrackSeal = () => {
    setIsBroken(!isBroken);
    playWaxBreakSound();
    fireConfetti(window.innerWidth / 2, window.innerHeight * 0.55, 24);
    showToast(
      !isBroken
        ? 'The wax seal crackles gently... Your letter is kept forever ❤️'
        : 'Wax seal resealed'
    );
  };

  const handleHeart = () => {
    setHearts((prev) => prev + 1);
    playHeartChime();
    showToast(`You sent love to ${data.senderName}! 💖`);
  };

  const handleSendHug = () => {
    setHugSent(true);
    playHeartChime();
    showToast(`Warmest hug sent straight to ${data.senderName}! 🫂`);
  };

  const handleSavePhoto = () => {
    showToast('Letter saved to your photos gallery! 📷');
  };

  const whatsappMessage = encodeURIComponent(
    `${data.senderName}, I just opened your birthday surprise on OurMoments and read your letter... I am in tears 🥹❤️ Thank you so much!`
  );

  return (
    <div className="flex flex-col w-full relative overflow-hidden select-none pb-12 pt-2 px-4 max-w-[440px] mx-auto">
      {/* Toast popup */}
      {toastMsg && (
        <div className="fixed top-20 inset-x-4 z-50 flex justify-center pointer-events-none animate-fadeIn">
          <div className="bg-[#261812] text-white px-4 py-2.5 rounded-full shadow-lg text-xs font-medium flex items-center gap-2">
            <span>✨</span>
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

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
            {isSoundOn ? (data.soundtrack === 'blue' ? 'Blue 🎵' : 'Acoustic Sunset') : 'Muted'}
          </span>
        </button>
      </div>

      {/* Step Banner Strip */}
      <div className="flex flex-col items-center gap-1.5 mb-4 text-center">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#fee3d8] rounded-full text-[#59413c] text-[10px] font-bold uppercase border border-[#fce8dc] shadow-xs">
          <span>💌</span>
          <span>The Grand Finale • Step 4 of 4</span>
          <span className="w-1 h-1 rounded-full bg-[#ac331c]/40" />
          <span className="text-[#ac331c] font-bold">Sealed with Love ❤️</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-0.5 bg-[#fff1ec] rounded-full shadow-xs text-[#786155] text-xs border border-[#fce8dc]">
          <div className="flex items-end gap-0.5 h-3 w-3 pb-0.5">
            <span className="w-0.5 bg-[#ac331c] rounded-full h-1.5 animate-pulse" />
            <span className="w-0.5 bg-[#ac331c] rounded-full h-3 animate-pulse" />
            <span className="w-0.5 bg-[#ac331c] rounded-full h-2 animate-pulse" />
          </div>
          <span className="font-semibold text-[#261812]">
            {data.soundtrack === 'blue' ? 'Blue (Yung Kai Aesthetic)' : 'Acoustic Warmth'}
          </span>
          <span className="text-[10px] text-[#786155]">
            {data.soundtrack === 'blue' ? '· Dreamy slow chords' : '· Gentle strings'}
          </span>
        </div>
      </div>

      {/* Narrative Header */}
      <div className="text-center px-2 mb-5">
        <div className="inline-flex items-center justify-center gap-1 mb-1 text-[#F59E0B]">
          <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#795900]">
            Private Birthday Keepsake
          </span>
          <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
        </div>

        <h1 className="text-2xl font-bold text-[#261812] mb-1">
          A letter just for you 💌
        </h1>
        <p className="text-xs sm:text-sm text-[#59413c] max-w-xs mx-auto">
          Written from the heart by {data.senderName}. Take your time, {data.recipientName} — this one was made to last forever.
        </p>

        {/* Tap Wax Seal prompt */}
        <div
          onClick={handleCrackSeal}
          className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1 bg-[#ffdad3] rounded-full text-[#8a1b06] text-[10px] font-bold uppercase tracking-wider shadow-xs cursor-pointer hover:bg-[#ffb4a5] transition-all"
        >
          <span className="animate-bounce">✨</span>
          <span>{isBroken ? '❤️ SEAL BROKEN · CHERISHED FOREVER' : 'TAP WAX SEAL TO BREAK & UNFOLD'}</span>
        </div>
      </div>

      {/* Main Envelope & Letter Canvas */}
      <div className="relative w-full mb-8">
        <div className="absolute inset-0 bg-[#ff6f52]/10 blur-2xl rounded-full pointer-events-none" />

        {/* Envelope back flap */}
        <div className="relative mx-auto w-full rounded-2xl bg-[#fee3d8] p-2 shadow-[0_18px_48px_-8px_rgba(120,97,85,0.18)] border border-[#fce8dc]">
          <div className="w-full bg-[#ffe9e1] rounded-xl p-2.5 pb-6 relative overflow-hidden">
            {/* Header Interior */}
            <div className="flex items-center justify-between mb-2 px-2 text-[#786155]/70 text-[10px] font-bold uppercase tracking-wider">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">local_post_office</span>
                <span>Personal Delivery</span>
              </div>
              <span className="font-mono">No. 1024</span>
            </div>

            {/* Parchment Letter Paper */}
            <div className="relative w-full rounded-xl bg-white p-5 shadow-[0_4px_20px_rgba(120,97,85,0.08)] border border-[#fce8dc] transition-all duration-300">
              {/* Corner Ornaments */}
              <div className="absolute top-2 left-2 w-4 h-4 pointer-events-none opacity-40 text-[#795900]">
                <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
                  <path d="M2 12V2H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="absolute top-2 right-2 w-4 h-4 pointer-events-none opacity-40 text-[#795900]">
                <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
                  <path d="M12 2H22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>

              {/* Note Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#fce8dc]/60">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">🌸</span>
                  <span className="text-[10px] font-bold text-[#59413c] uppercase tracking-wider">
                    A Birthday Note
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#786155] font-mono">
                  <span className="material-symbols-outlined text-[13px]">schedule</span>
                  <span>11:58 PM</span>
                </div>
              </div>

              {/* Letter Content */}
              <div className="space-y-3 pt-1">
                <div className="text-xl font-bold text-[#ac331c]">
                  Dear {data.recipientName},
                </div>

                <p className="text-xs sm:text-sm text-[#261812] leading-relaxed whitespace-pre-line font-normal">
                  {data.letter}
                </p>

                {/* Embedded Memory Polaroids Strip */}
                {data.photos.length >= 2 && (
                  <div className="grid grid-cols-2 gap-2 my-2 py-1">
                    <div className="rounded-lg overflow-hidden bg-[#fff1ec] p-1 shadow-xs border border-[#fce8dc] transform -rotate-1">
                      <img
                        alt="memory 1"
                        className="w-full h-24 object-cover rounded"
                        src={data.photos[0].url}
                        referrerPolicy="no-referrer"
                      />
                      <div className="pt-1 text-center text-[10px] text-[#59413c] truncate font-medium">
                        {data.photos[0].caption}
                      </div>
                    </div>

                    <div className="rounded-lg overflow-hidden bg-[#fff1ec] p-1 shadow-xs border border-[#fce8dc] transform rotate-1">
                      <img
                        alt="memory 2"
                        className="w-full h-24 object-cover rounded"
                        src={data.photos[1].url}
                        referrerPolicy="no-referrer"
                      />
                      <div className="pt-1 text-center text-[10px] text-[#59413c] truncate font-medium">
                        {data.photos[1].caption}
                      </div>
                    </div>
                  </div>
                )}

                {/* Sign-off */}
                <div className="pt-2 flex flex-col items-end text-right">
                  <span className="text-xs text-[#59413c] italic">With all my love and warm hugs,</span>
                  <span className="text-base font-bold text-[#ac331c] flex items-center gap-1 mt-0.5">
                    {data.senderName} <span className="text-[#F43F5E]">❤️</span>
                  </span>
                  <span className="text-[10px] text-[#786155] uppercase tracking-wider mt-0.5">
                    {data.birthMonth} {data.birthDay}, 2024 · Sealed with Love
                  </span>
                </div>
              </div>

              {/* 3D Wax Seal Stamp at Bottom */}
              <div className="relative flex justify-center -mb-9 mt-3">
                <button
                  type="button"
                  onClick={handleCrackSeal}
                  className={`group relative w-16 h-16 rounded-full shadow-[0_8px_20px_rgba(172,51,28,0.45)] flex items-center justify-center text-white active:scale-95 transition-all duration-300 cursor-pointer ${
                    data.waxSeal === 'gold'
                      ? 'bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-700'
                      : data.waxSeal === 'blush'
                      ? 'bg-gradient-to-br from-pink-300 via-rose-400 to-rose-600'
                      : 'bg-gradient-to-br from-[#a93349] via-[#ac331c] to-[#6d0021]'
                  }`}
                >
                  <div className="absolute inset-0.5 rounded-full border border-white/30 pointer-events-none" />
                  <span className="material-symbols-outlined text-[26px] drop-shadow-sm">
                    {isBroken ? 'favorite_border' : 'favorite'}
                  </span>
                  <span className="absolute top-1 right-2 text-[#F59E0B] text-[10px] opacity-80 pointer-events-none">✦</span>
                  <span className="absolute bottom-2 left-2 text-[#F59E0B] text-[8px] opacity-70 pointer-events-none">✦</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Letter Micro-Interactions Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-[0_4px_16px_rgba(120,97,85,0.06)] border border-[#fce8dc] mb-4">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#fce8dc]">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#ffe9e1] flex items-center justify-center text-[#ac331c]">
              <span className="material-symbols-outlined text-[18px]">mail</span>
            </span>
            <div>
              <div className="font-semibold text-xs text-[#261812]">{data.senderName}'s Letter</div>
              <div className="text-[11px] text-[#786155]">Saved to your private vault 🔒</div>
            </div>
          </div>

          {/* Heart count reaction */}
          <button
            type="button"
            onClick={handleHeart}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fff1ec] text-[#F43F5E] font-bold text-xs active:scale-90 transition-transform cursor-pointer border border-[#fce8dc]"
          >
            <span className="material-symbols-outlined text-[17px]">favorite</span>
            <span>{hearts}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleSavePhoto}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#fff1ec] text-[#261812] font-semibold text-xs active:bg-[#fee3d8] transition-colors cursor-pointer border border-[#fce8dc]"
          >
            <span className="material-symbols-outlined text-[16px] text-[#ac331c]">photo_camera</span>
            <span>Save to Photos</span>
          </button>

          <button
            type="button"
            onClick={handleSendHug}
            className={`w-full flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-[#fce8dc] ${
              hugSent ? 'bg-[#ffdad3] text-[#8a1b06]' : 'bg-[#fff1ec] text-[#261812] active:bg-[#fee3d8]'
            }`}
          >
            <span className="text-[15px]">🤗</span>
            <span>{hugSent ? 'Hug Sent! 🫂' : `Send ${data.senderName} a Hug`}</span>
          </button>
        </div>
      </div>

      {/* Voice Note Player for the Letter if sender attached one */}
      {(() => {
        const letterVoice = data.voiceNoteLetter?.audioUrl
          ? data.voiceNoteLetter
          : (data.voiceNote?.trigger === 'chapter4' ? data.voiceNote : (!data.voiceNoteCandle?.audioUrl ? data.voiceNote : null));
        if (!letterVoice?.audioUrl) return null;

        return (
          <div className="w-full rounded-2xl bg-gradient-to-r from-[#FFF0E6] via-[#ffe9e1] to-[#FFF0E6] p-4 mb-4 border border-[#fce8dc] shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#ac331c] bg-[#ffdcd3] px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">mic</span>
                <span>Letter Voice Note from {data.senderName} 🎙️</span>
              </span>
              <span className="text-[11px] font-mono text-[#786155]">
                {letterVoice.duration ? `${Math.floor(letterVoice.duration / 60)}:${String(letterVoice.duration % 60).padStart(2, '0')}` : '0:30'}
              </span>
            </div>

            <audio
              controls
              src={letterVoice.audioUrl}
              className="w-full h-10 accent-[#ac331c] rounded-lg mt-1"
            />
          </div>
        );
      })()}

      {/* Audio Waveform Player Strip */}
      <div className="w-full rounded-2xl bg-[#fff1ec] p-3.5 mb-4 flex items-center justify-between border border-[#fce8dc] shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPlayingSong(!isPlayingSong)}
            className="w-9 h-9 rounded-full bg-[#ac331c] text-white flex items-center justify-center shadow-xs active:scale-95 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isPlayingSong ? 'pause' : 'play_arrow'}
            </span>
          </button>
          <div className="flex flex-col">
            <span className="font-semibold text-xs text-[#261812] leading-tight">
              {data.soundtrack === 'blue' ? 'Blue (Yung Kai Aesthetic)' : 'Acoustic Warmth'}
            </span>
            <span className="text-[11px] text-[#786155]">
              {data.soundtrack === 'blue' ? 'Dreamy Slow Progression · 3:14' : 'Gentle Birthday Strings · 2:48'}
            </span>
          </div>
        </div>

        {/* Equalizer Waveform animation */}
        <div className="flex items-end gap-1 h-6 pr-1">
          <span className={`w-1 bg-[#ff6f52] rounded-full ${isPlayingSong ? 'h-3 animate-pulse' : 'h-1'}`} />
          <span className={`w-1 bg-[#ff6f52] rounded-full ${isPlayingSong ? 'h-5 animate-pulse' : 'h-2'}`} />
          <span className={`w-1 bg-[#ac331c] rounded-full ${isPlayingSong ? 'h-6 animate-pulse' : 'h-3'}`} />
          <span className={`w-1 bg-[#ff6f52] rounded-full ${isPlayingSong ? 'h-4 animate-pulse' : 'h-1'}`} />
          <span className={`w-1 bg-[#ac331c] rounded-full ${isPlayingSong ? 'h-2 animate-pulse' : 'h-2'}`} />
          <span className={`w-1 bg-[#ff6f52] rounded-full ${isPlayingSong ? 'h-5 animate-pulse' : 'h-1'}`} />
        </div>
      </div>

      {/* Grand Finale Celebration Card */}
      <div className="relative w-full rounded-3xl bg-white p-6 shadow-[0_18px_48px_-8px_rgba(120,97,85,0.12)] border border-[#fce8dc] text-center mb-5 overflow-hidden">
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#ffc329]/30 flex items-center justify-center text-[#795900] shadow-xs">
          <span className="material-symbols-outlined text-[32px]">celebration</span>
        </div>

        <div className="inline-flex items-center gap-1 px-3 py-0.5 bg-[#ffdad3] rounded-full text-[#8a1b06] text-[10px] font-bold uppercase tracking-wider mb-2">
          <span>Chapter Complete</span>
        </div>

        <h2 className="text-xl font-bold text-[#261812] mb-1">
          You've unlocked the full surprise! 🎉
        </h2>
        <p className="text-xs text-[#59413c] max-w-xs mx-auto mb-5 leading-relaxed">
          Every cake candle, floating balloon, memory photo, and handwritten word was made with all of {data.senderName}'s heart.
        </p>

        {/* CTAs Stack */}
        <div className="flex flex-col gap-2.5 w-full">
          <a
            href={`https://api.whatsapp.com/send?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#FB923C] to-[#F43F5E] text-white font-semibold text-sm shadow-[0_10px_24px_-4px_rgba(255,111,82,0.38)] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            <span>Reply to {data.senderName} on WhatsApp 💬</span>
          </a>

          <button
            type="button"
            onClick={onReplay}
            className="w-full py-3 px-6 rounded-full bg-[#fff1ec] text-[#ac331c] font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 active:bg-[#fee3d8] transition-colors border border-[#fce8dc] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">replay</span>
            <span>Replay the Whole Experience ↺</span>
          </button>
        </div>

        {/* Maker Invitation Callout */}
        <div className="mt-5 pt-4 bg-[#fff1ec] rounded-2xl p-4 text-left flex items-start gap-3 border border-[#fce8dc]">
          <div className="text-2xl mt-0.5">✨</div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-xs text-[#261812]">Loved this feeling?</div>
            <p className="text-[11px] text-[#59413c] mt-0.5 leading-snug">
              Create an unforgettable interactive surprise for someone you cherish on OurMoments.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center px-4 pt-1">
        <p className="text-xs text-[#786155] italic max-w-xs mx-auto mb-2">
          “The best things in life are the people we love, the places we've been, and the memories we've made along the way.”
        </p>
        <div className="flex items-center justify-center gap-1 text-[#59413c] text-[10px] font-bold uppercase tracking-widest">
          <span>Made with love on</span>
          <span className="font-bold text-[#ac331c]">OurMoments</span>
          <span>💛</span>
        </div>
      </footer>
    </div>
  );
};
