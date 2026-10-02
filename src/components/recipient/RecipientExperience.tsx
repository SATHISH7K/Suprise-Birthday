import React, { useState } from 'react';
import { SurpriseData } from '../../types';
import { CupidHeartScene } from './CupidHeartScene';
import { MakeAWishScene } from './MakeAWishScene';
import { BloomingTreeScene } from './BloomingTreeScene';
import { MidnightCakeScene } from './MidnightCakeScene';
import { StarryBalloonsScene } from './StarryBalloonsScene';
import { StarryMemoryLaneScene } from './StarryMemoryLaneScene';
import { GoldenEnvelopeLetterScene } from './GoldenEnvelopeLetterScene';
import { BirthdayFinaleScene } from './BirthdayFinaleScene';

interface RecipientExperienceProps {
  data: SurpriseData;
  onExitPreview?: () => void;
  isSoundOn: boolean;
  onToggleSound: () => void;
  isReceiverMode?: boolean;
}

export const RecipientExperience: React.FC<RecipientExperienceProps> = ({
  data,
  onExitPreview,
  isSoundOn,
  onToggleSound,
  isReceiverMode = false,
}) => {
  // Starts directly at Cupid Bow & Heart (00:02 in screen recording)
  // 0: Cupid Arrow & Heart ("a little something, for you")
  // 1: Make a Wish (Pink Splash)
  // 2: Blooming Heart Tree
  // 3: Midnight Cake & Blow Candle (Recording 1 - with Music Pause)
  // 4: Pop the Balloons
  // 5: Memory Lane (if photos exist)
  // 6: Golden Envelope & Letter (Recording 2 - Simultaneous with Music Pause)
  // 7: Grand Birthday Finale
  const [scene, setScene] = useState<number>(0);
  const [inspectorMode, setInspectorMode] = useState(false);

  const hasPhotos = Boolean(data.photos && data.photos.length > 0);

  const handleCupidDone = () => {
    setScene(1);
  };

  const handleMakeAWishDone = () => {
    setScene(2);
  };

  const handleTreeDone = () => {
    setScene(3);
  };

  const handleCakeDone = () => {
    setScene(4);
  };

  const handleBalloonsDone = () => {
    if (hasPhotos) {
      setScene(5);
    } else {
      setScene(6);
    }
  };

  const handleMemoryLaneDone = () => {
    setScene(6);
  };

  const handleLetterDone = () => {
    setScene(7);
  };

  const handleReplay = () => {
    setScene(0);
  };

  const sceneTitles = [
    { id: 0, label: 'Cupid Bow', emoji: '💘' },
    { id: 1, label: 'Make a Wish', emoji: '✨' },
    { id: 2, label: 'Heart Tree', emoji: '🌸' },
    { id: 3, label: 'Cake & Wish', emoji: '🕯️' },
    { id: 4, label: 'Balloons', emoji: '🎈' },
    ...(hasPhotos ? [{ id: 5, label: 'Memories', emoji: '📸' }] : []),
    { id: 6, label: 'Letter & Seal', emoji: '💌' },
    { id: 7, label: 'Finale', emoji: '🎉' },
  ];

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-[#180a2b] font-['Outfit',sans-serif]">
      {/* FLOATING TOP CONTROLS */}
      {isReceiverMode ? (
        /* Receiver floating sound pill */
        <header className="fixed top-4 right-4 z-50 flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleSound}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-semibold cursor-pointer shadow-lg transition-all active:scale-95"
            title={isSoundOn ? 'Mute Music' : 'Play Blue Instrumental Music'}
          >
            <span className="material-symbols-outlined text-[16px] text-pink-400">
              {isSoundOn ? 'volume_up' : 'volume_off'}
            </span>
            <span className="text-[11px] font-bold max-w-[130px] truncate">
              {isSoundOn
                ? (data.customMusicName ? `${data.customMusicName.replace(/\.[^/.]+$/, '')} 🎵` : (data.soundtrack === 'blue' ? 'Blue 🎵' : 'Music On'))
                : 'Music Muted'}
            </span>
            {isSoundOn && (
              <span className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 h-2 bg-pink-400 rounded-full animate-pulse" />
                <span className="w-0.5 h-3 bg-pink-400 rounded-full animate-pulse" />
                <span className="w-0.5 h-1.5 bg-pink-400 rounded-full animate-pulse" />
              </span>
            )}
          </button>
        </header>
      ) : (
        /* Creator Preview Studio bar */
        <header className="fixed top-3 left-1/2 -translate-x-1/2 z-50 px-3 sm:px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 shadow-xl flex items-center gap-2 sm:gap-3 max-w-xl text-white">
          {onExitPreview && (
            <button
              type="button"
              onClick={onExitPreview}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 text-pink-200 text-xs font-bold transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">arrow_back</span>
              <span>Creator Studio</span>
            </button>
          )}

          {/* Quick Inspector toggle */}
          <button
            type="button"
            onClick={() => setInspectorMode(!inspectorMode)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${inspectorMode ? 'bg-[#e11d48] text-white shadow-xs' : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
          >
            <span className="material-symbols-outlined text-[15px]">tune</span>
            <span>Jump Scene</span>
          </button>

          {/* Sound toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium text-white/90 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px] text-pink-400">
              {isSoundOn ? 'volume_up' : 'volume_off'}
            </span>
            <span className="text-[11px] max-w-[100px] truncate">
              {isSoundOn
                ? (data.customMusicName ? `${data.customMusicName.replace(/\.[^/.]+$/, '')} 🎵` : (data.soundtrack === 'blue' ? 'Blue 🎵' : 'Music On'))
                : 'Muted'}
            </span>
          </button>

          {/* Scene selector drawer when inspector mode active */}
          {inspectorMode && (
            <div className="absolute top-12 left-0 right-0 p-2 rounded-2xl bg-[#24103d]/95 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center gap-1 overflow-x-auto no-scrollbar">
              {sceneTitles.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => {
                    setScene(st.id);
                    setInspectorMode(false);
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap flex items-center gap-1 cursor-pointer transition-all ${scene === st.id ? 'bg-[#e11d48] text-white shadow-xs' : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                >
                  <span>{st.emoji}</span>
                  <span>{st.label}</span>
                </button>
              ))}
            </div>
          )}
        </header>
      )}

      {/* ACTIVE SCENE VIEW - STARTS DIRECTLY AT CUPID'S BOW & HEART */}
      {scene === 0 && (
        <CupidHeartScene
          onNext={handleCupidDone}
          onStartSoundtrack={() => {
            if (!isSoundOn) {
              onToggleSound();
            }
          }}
        />
      )}

      {scene === 1 && (
        <MakeAWishScene
          recipientName={data.recipientName}
          onNext={handleMakeAWishDone}
        />
      )}

      {scene === 2 && (
        <BloomingTreeScene
          recipientName={data.recipientName}
          onNext={handleTreeDone}
        />
      )}

      {scene === 3 && (
        <MidnightCakeScene
          data={data}
          onNext={handleCakeDone}
        />
      )}

      {scene === 4 && (
        <StarryBalloonsScene
          balloons={data.balloons}
          onNext={handleBalloonsDone}
        />
      )}

      {scene === 5 && hasPhotos && (
        <StarryMemoryLaneScene
          photos={data.photos}
          onNext={handleMemoryLaneDone}
        />
      )}

      {scene === 6 && (
        <GoldenEnvelopeLetterScene
          data={data}
          onNext={handleLetterDone}
        />
      )}

      {scene === 7 && (
        <BirthdayFinaleScene
          data={data}
          onReplay={handleReplay}
        />
      )}
    </div>
  );
};
