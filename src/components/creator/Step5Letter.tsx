import React, { useState } from 'react';
import { SurpriseData, LetterTone, WaxSealColor } from '../../types';

interface Step5Props {
  data: SurpriseData;
  onChange: (updates: Partial<SurpriseData>) => void;
  onNext: () => void;
  onBack: () => void;
  onOpenSoundtrackStudio: () => void;
  onOpenVoiceModal: () => void;
}

export const Step5Letter: React.FC<Step5Props> = ({
  data,
  onChange,
  onNext,
  onBack,
  onOpenSoundtrackStudio,
  onOpenVoiceModal,
}) => {
  const sparkSets = [
    [
      '"Thank you for being my unshakeable safe space in a loud world..."',
      '"To more impromptu road trips, midnight laughter, and 2 AM tea talks..."',
      '"Watching you conquer every mountain this year has been an honour..."',
      '"Happy birthday to the one who makes ordinary days feel cinematic..."',
    ],
    [
      '"I still giggle thinking about that time we couldn\'t stop laughing at dinner..."',
      '"May your year be as bright, radiant, and generous as your golden heart..."',
      '"You deserve every ounce of magic, cake, and joy today offers!"',
      '"Life became 10x more colorful the moment you entered my world..."',
    ],
    [
      '"Never lose that curious spark that makes everyone fall in love with you..."',
      '"Here\'s to celebrating you today, tomorrow, and every day in between!"',
      '"Thank you for listening without judging, and loving unconditionally..."',
      '"Can\'t wait to make a hundred more absurd memories with you this year!"',
    ],
  ];

  const [sparkIndex, setSparkIndex] = useState(0);

  const handleShuffleSparks = () => {
    setSparkIndex((prev) => (prev + 1) % sparkSets.length);
  };

  const handleInsertSpark = (quote: string) => {
    const cleanQuote = quote.replace(/^"|"$/g, '');
    const current = data.letter.trim();
    onChange({ letter: current ? `${current}\n\n${cleanQuote}` : cleanQuote });
  };

  const tones: { id: LetterTone; label: string; icon: string }[] = [
    { id: 'romantic', label: 'Romantic', icon: '💌' },
    { id: 'cheerful', label: 'Cheerful', icon: '🎉' },
    { id: 'nostalgic', label: 'Nostalgic', icon: '🥹' },
    { id: 'sweet', label: 'Sweet', icon: '✨' },
  ];

  const waxSeals: { id: WaxSealColor; label: string; ringColor: string; bgGradient: string; icon: string }[] = [
    {
      id: 'crimson',
      label: 'Crimson',
      ringColor: 'ring-[#ac331c]',
      bgGradient: 'from-[#a93349] via-[#ac331c] to-[#6d0021]',
      icon: 'favorite',
    },
    {
      id: 'gold',
      label: 'Gold',
      ringColor: 'ring-[#d97706]',
      bgGradient: 'from-amber-300 via-yellow-500 to-amber-700',
      icon: 'workspace_premium',
    },
    {
      id: 'blush',
      label: 'Blush',
      ringColor: 'ring-[#f43f5e]',
      bgGradient: 'from-pink-300 via-rose-400 to-rose-600',
      icon: 'celebration',
    },
  ];

  const len = data.letter.length;
  let letterTip = 'A deeply touching note! It reads so genuinely.';
  if (len < 50) {
    letterTip = 'Keep going! Share a favorite memory or silly inside joke.';
  } else if (len < 200) {
    letterTip = 'Beautiful start. Personal details make all the difference!';
  }

  return (
    <div className="flex flex-col w-full items-center justify-center py-8 px-4 relative select-none">
      {/* Ambient glowing backdrops */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-b from-[#ffdad3]/40 via-[#ffe9e1]/30 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-[#ffdf9f]/30 blur-3xl pointer-events-none rounded-full" />

      {/* Centered Stage Canvas */}
      <div className="relative w-full max-w-3xl flex flex-col items-center">
        {/* Step Indicator Bar */}
        <div className="flex items-center gap-2 mb-4 bg-white/90 px-4 py-1.5 rounded-full shadow-[0_4px_16px_rgba(120,97,85,0.06)] border border-[#fce8dc] backdrop-blur-md">
          <span className="text-[11px] uppercase text-[#ac331c] font-bold tracking-wider">Step 5 of 5</span>
          <span className="text-[#e0bfb8] text-[10px]">•</span>
          <span className="text-[11px] text-[#786155] uppercase font-bold tracking-wider">The Letter</span>
          <div className="flex items-center gap-1.5 ml-2">
            <span className="w-2 h-2 rounded-full bg-[#ff6f52]/40" />
            <span className="w-2 h-2 rounded-full bg-[#ff6f52]/40" />
            <span className="w-2 h-2 rounded-full bg-[#ff6f52]/40" />
            <span className="w-2 h-2 rounded-full bg-[#ff6f52]/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ac331c] ring-2 ring-[#ac331c]/20 animate-pulse" />
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center mb-6 max-w-lg">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#fee3d8] shadow-[0_8px_20px_-4px_rgba(255,111,82,0.2)] mb-2 relative">
            <span className="text-2xl select-none">💌</span>
            <span className="absolute -top-1 -right-1 text-sm animate-bounce">✨</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#261812] tracking-tight mb-1">
            Write your birthday letter
          </h1>
          <p className="text-sm sm:text-base text-[#786155]">
            This is the part they'll read twice — and remember forever. 💖
          </p>
        </div>

        {/* Main Tactile Stationery Envelope / Paper Card */}
        <div className="w-full bg-white rounded-3xl shadow-[0_22px_50px_-10px_rgba(120,97,85,0.14),0_6px_18px_-2px_rgba(120,97,85,0.06)] border border-[#fce8dc] relative overflow-hidden transition-all duration-300">
          {/* Top decorative paper stamp / wax accent header */}
          <div className="bg-gradient-to-r from-[#fff1ec] via-[#ffe9e1] to-[#fff1ec] px-6 py-3 flex items-center justify-between border-b border-[#fce8dc]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ac331c] text-[18px]">edit_note</span>
              <span className="text-[11px] uppercase text-[#786155] font-bold tracking-wider">
                Stationery &amp; Wax Studio
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#59413c] bg-white/80 px-2.5 py-0.5 rounded-full shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Autosaved just now</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 flex flex-col gap-6">
            {/* Salutation Header with interactive recipient name */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold text-[#261812]">Dear</span>
                <div className="inline-flex items-center gap-1 bg-[#fee3d8] px-3.5 py-1 rounded-full shadow-inner border border-[#fce8dc]">
                  <input
                    type="text"
                    value={data.recipientName}
                    onChange={(e) => onChange({ recipientName: e.target.value })}
                    className="text-lg sm:text-xl font-bold text-[#ac331c] bg-transparent outline-none w-28 sm:w-36 focus:text-[#ff6f52]"
                  />
                  <span className="material-symbols-outlined text-[#ff6f52] text-[16px]">edit</span>
                </div>
                <span className="text-xl sm:text-2xl font-bold text-[#261812]">,</span>
              </div>

              {/* Tone / Mood Selector Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs uppercase text-[#786155] font-bold mr-1 hidden sm:inline">
                  Tone:
                </span>
                {tones.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onChange({ letterTone: t.id })}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                      data.letterTone === t.id
                        ? 'bg-[#fee3d8] text-[#261812] font-semibold shadow-xs ring-1 ring-[#ff6f52]/30'
                        : 'bg-[#fff1ec] text-[#786155] hover:text-[#261812]'
                    }`}
                  >
                    <span>{t.icon}</span> {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Lined Tactile Letter Textarea Container */}
            <div className="relative rounded-2xl bg-[#FFF9F4] p-4 sm:p-6 shadow-inner border border-[#fce8dc] focus-within:shadow-[0_0_0_2px_#ff6f52,0_8px_20px_rgba(255,111,82,0.12)] transition-all duration-200">
              <textarea
                rows={8}
                maxLength={1000}
                value={data.letter}
                onChange={(e) => onChange({ letter: e.target.value })}
                placeholder="Write from the heart... What you love about them, a favorite memory together, or a wish for the year ahead. They'll open this like a real letter at the end of their surprise."
                className="w-full bg-transparent resize-none outline-none text-base text-[#261812] placeholder:text-[#786155]/70 leading-[32px] sm:leading-[36px] relative z-10 font-normal"
              />

              {/* Bottom Counter & Tip */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-[#fce8dc]/60 relative z-10">
                <div className="flex items-center gap-1.5 text-xs text-[#786155]">
                  <span className="material-symbols-outlined text-[16px] text-[#F59E0B]">
                    tips_and_updates
                  </span>
                  <span>{letterTip}</span>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full bg-white shadow-xs font-medium ${
                      len > 900 ? 'text-[#ba1a1a] font-bold' : 'text-[#59413c]'
                    }`}
                  >
                    {len} / 1000
                  </span>
                </div>
              </div>
            </div>

            {/* Inspiration Sparks Section */}
            <div className="flex flex-col gap-2.5 bg-[#fff1ec]/70 rounded-2xl p-4 border border-[#fce8dc]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#ac331c] text-[18px]">
                    auto_awesome
                  </span>
                  <span className="text-[11px] font-bold uppercase text-[#261812]">
                    Need a spark? Tap to insert
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleShuffleSparks}
                  className="inline-flex items-center gap-1 text-xs text-[#ac331c] hover:text-[#ff6f52] font-semibold transition-colors cursor-pointer"
                >
                  <span>Shuffle</span>
                  <span className="material-symbols-outlined text-[16px]">casino</span>
                </button>
              </div>

              {/* Spark quotes grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {sparkSets[sparkIndex].map((spark, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleInsertSpark(spark)}
                    className="text-left p-3 rounded-xl bg-white hover:bg-[#fee3d8] text-[#261812] text-xs transition-all shadow-xs border border-[#fce8dc] active:scale-[0.99] group flex items-start gap-2 cursor-pointer"
                  >
                    <span className="text-[#ff6f52] group-hover:scale-125 transition-transform text-xs mt-0.5">
                      ✦
                    </span>
                    <span className="text-[#59413c] group-hover:text-[#261812] transition-colors line-clamp-2">
                      {spark}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2-Column Bento: Wax Seal Stamp & Soundtrack */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Wax Seal Card */}
              <div className="flex flex-col gap-2.5 p-4 rounded-2xl bg-white border border-[#fce8dc] shadow-[0_4px_16px_rgba(120,97,85,0.04)]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-[#261812]">Wax Seal Stamp</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ffc329]/30 text-[#795900] font-bold">
                    Physical 3D
                  </span>
                </div>
                <p className="text-xs text-[#786155]">
                  Stamped on their digital envelope. They break it to unveil your letter.
                </p>

                {/* Color Selector Chips */}
                <div className="flex items-center gap-4 mt-1">
                  {waxSeals.map((ws) => {
                    const isSelected = data.waxSeal === ws.id;
                    return (
                      <button
                        key={ws.id}
                        type="button"
                        onClick={() => onChange({ waxSeal: ws.id })}
                        className={`group flex flex-col items-center gap-1 focus:outline-none cursor-pointer transition-all ${
                          isSelected ? 'opacity-100 scale-105' : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full bg-gradient-to-br ${ws.bgGradient} shadow-md flex items-center justify-center transition-transform active:scale-95 ${
                            isSelected ? `ring-2 ${ws.ringColor} ring-offset-2` : ''
                          }`}
                        >
                          <span className="material-symbols-outlined text-white text-[18px]">
                            {ws.icon}
                          </span>
                        </div>
                        <span
                          className={`text-[11px] font-bold ${
                            isSelected ? 'text-[#261812]' : 'text-[#786155]'
                          }`}
                        >
                          {ws.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Soundtrack Card */}
              <div className="flex flex-col gap-2.5 p-4 rounded-2xl bg-white border border-[#fce8dc] shadow-[0_4px_16px_rgba(120,97,85,0.04)]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-[#261812]">Letter Soundtrack</span>
                  <button
                    type="button"
                    onClick={onOpenSoundtrackStudio}
                    className="text-xs text-[#ac331c] font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Browse All</span>
                    <span className="material-symbols-outlined text-[16px]">music_note</span>
                  </button>
                </div>
                <p className="text-xs text-[#786155]">
                  Soft audio gently fades in while they unroll and read your note.
                </p>

                <div className="relative mt-1">
                  <select
                    value={data.soundtrack}
                    onChange={(e) => onChange({ soundtrack: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl bg-[#fff1ec] text-[#261812] text-xs appearance-none outline-none focus:bg-[#fee3d8] transition-colors cursor-pointer border border-[#fce8dc] font-medium"
                  >
                    <option value="blue">🌊 Blue (Yung Kai Aesthetic · Romantic &amp; Dreamy)</option>
                    <option value="acoustic">🎸 Acoustic Warmth (Gentle strings)</option>
                    <option value="piano">🎹 Sparkle Piano (Midnight nostalgic)</option>
                    <option value="lofi">☕ Warm Chai Lofi (Relaxed &amp; Cozy)</option>
                    <option value="cinematic">🎻 Cinematic Wonder (Emotional crescendo)</option>
                  </select>
                  <span className="material-symbols-outlined text-[#ff6f52] text-[20px] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    expand_more
                  </span>
                </div>

                {/* Optional Voice Note Attachment hint */}
                <button
                  type="button"
                  onClick={onOpenVoiceModal}
                  className="mt-1 text-left text-xs text-[#ac331c] hover:underline flex items-center gap-1 font-medium"
                >
                  <span className="material-symbols-outlined text-[16px]">mic</span>
                  <span>{data.voiceNoteLetter?.audioUrl ? '🎙️ Letter Voice Note Attached' : '+ Record voice note to play with letter'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Envelope fold visual footer bar */}
          <div className="bg-[#fff1ec]/70 px-6 py-2.5 flex items-center justify-between text-xs text-[#786155] border-t border-[#fce8dc]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#ac331c] text-[16px]">lock</span>
              <span>Only readable by recipient with their magic invite link</span>
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-[#8c716b]">
              Encrypted with warmth
            </span>
          </div>
        </div>

        {/* Action Navigation Cluster */}
        <div className="w-full flex flex-col items-center mt-6 gap-3">
          <div className="w-full flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-6 py-3.5 rounded-full bg-white hover:bg-[#fee3d8] text-[#786155] hover:text-[#261812] text-sm font-semibold shadow-xs border border-[#fce8dc] transition-all active:scale-[0.98] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              <span>Step 4: Memory Lane</span>
            </button>

            <button
              type="button"
              onClick={onNext}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FB923C] to-[#F43F5E] text-white text-sm sm:text-base font-semibold shadow-[0_12px_28px_-4px_rgba(255,111,82,0.45)] hover:shadow-[0_16px_32px_-2px_rgba(255,111,82,0.55)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Continue to Preview</span>
              <span className="material-symbols-outlined text-[20px]">mark_email_read</span>
            </button>
          </div>

          <p className="text-xs text-[#786155] flex items-center gap-1.5 pt-1 text-center font-medium">
            <span className="text-[#F59E0B]">✨</span>
            <span>You can test-drive the physical wax-breaking animation on the next screen!</span>
          </p>
        </div>
      </div>
    </div>
  );
};
