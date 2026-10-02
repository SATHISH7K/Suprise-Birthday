/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { SurpriseData } from './types';
import { DEFAULT_SURPRISE } from './defaultData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Step1TheStar } from './components/creator/Step1TheStar';
import { Step2PickCake } from './components/creator/Step2PickCake';
import { Step3Balloons } from './components/creator/Step3Balloons';
import { Step4MemoryLane } from './components/creator/Step4MemoryLane';
import { Step5Letter } from './components/creator/Step5Letter';
import { Step6PreviewSend } from './components/creator/Step6PreviewSend';
import { RecipientExperience } from './components/recipient/RecipientExperience';
import { SoundtrackStudioModal } from './components/modals/SoundtrackStudioModal';
import { VoiceNoteModal } from './components/modals/VoiceNoteModal';
import { toggleBackgroundMusic } from './utils/sound';
import { decompressSurprise } from './utils/compression';

export default function App() {
  // Load initial surprise data from localStorage if available
  const [data, setData] = useState<SurpriseData>(() => {
    try {
      const saved = localStorage.getItem('ourmoments_surprise');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.recipientName && parsed.recipientName !== 'Ananya') {
          return { ...DEFAULT_SURPRISE, ...parsed };
        }
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SURPRISE;
  });

  const [surpriseId, setSurpriseId] = useState<string>(() => {
    try {
      return localStorage.getItem('ourmoments_surprise_id') || '';
    } catch {
      return '';
    }
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isReceiverMode, setIsReceiverMode] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [isSoundtrackModalOpen, setIsSoundtrackModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [voiceModalSlot, setVoiceModalSlot] = useState<'candle' | 'letter'>('candle');
  const [isLoadingSurprise, setIsLoadingSurprise] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return Boolean(params.get('id') || params.get('surprise') || params.get('d'));
    }
    return false;
  });

  // Check URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const remoteId = params.get('id') || params.get('surprise');
    const compressedData = params.get('d');
    const isReceiverParam = params.get('receiver') === 'true';
    const isPreviewParam = params.get('preview') === 'true';

    async function loadSharedSurprise() {
      let surpriseLoaded = false;

      // 1. Immediately attempt decompression if URL payload is available (fastest on mobile)
      if (compressedData) {
        try {
          const decompressed = await decompressSurprise(compressedData);
          if (decompressed) {
            setData((prev) => ({ ...prev, ...decompressed }));
            surpriseLoaded = true;
          }
        } catch (e) {
          console.warn('Decompression notice:', e);
        }
      }

      // 2. Concurrently or additionally fetch full surprise payload from server API
      if (remoteId) {
        setSurpriseId(remoteId);
        try {
          const res = await fetch(`/api/surprises/${remoteId}`);
          if (res.ok) {
            const remoteData = await res.json();
            if (remoteData) {
              setData((prev) => ({ ...prev, ...remoteData }));
              surpriseLoaded = true;
            }
          }
        } catch (err) {
          console.warn('Server surprise lookup notice:', err);
        }
      }

      // 3. Query params fallback for star and sender name
      const star = params.get('star');
      const from = params.get('from');
      if (star || from) {
        setData((prev) => ({
          ...prev,
          recipientName: star || prev.recipientName,
          senderName: from || prev.senderName,
        }));
      }

      // 4. Activate Receiver presentation
      if (remoteId || compressedData || isReceiverParam) {
        setIsReceiverMode(true);
        setIsPreviewMode(true);
      } else if (isPreviewParam) {
        setIsPreviewMode(true);
        setIsReceiverMode(false);
      }

      // Small delay for smooth cinematic unwrap
      setTimeout(() => {
        setIsLoadingSurprise(false);
      }, 400);
    }

    if (remoteId || compressedData || isReceiverParam || isPreviewParam) {
      loadSharedSurprise();
    } else {
      setIsLoadingSurprise(false);
    }
  }, []);

  // Save changes to localStorage and optionally sync to server
  const handleUpdateData = (updates: Partial<SurpriseData>) => {
    setData((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem('ourmoments_surprise', JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  // Persist surprise to server
  const handleSaveSurpriseToServer = useCallback(async (): Promise<string> => {
    try {
      const res = await fetch('/api/surprises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, id: surpriseId || undefined }),
      });
      if (res.ok) {
        const result = await res.json();
        if (result.id) {
          setSurpriseId(result.id);
          try {
            localStorage.setItem('ourmoments_surprise_id', result.id);
          } catch {
            // Ignore
          }
          return result.id;
        }
      }
    } catch (err) {
      console.warn('Failed to save surprise to server:', err);
    }
    return surpriseId || '';
  }, [data, surpriseId]);

  // Sound toggle
  const handleToggleSound = () => {
    const nextState = !isSoundOn;
    setIsSoundOn(nextState);
    toggleBackgroundMusic(nextState, data.soundtrackVolume / 100, data.soundtrack || 'blue', data.customMusicUrl);
  };

  // Navigate steps with smooth scroll to top
  const handleSelectStep = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenVoiceModal = (slot: 'candle' | 'letter' = 'candle') => {
    setVoiceModalSlot(slot);
    setIsVoiceModalOpen(true);
  };

  // Open Preview with chosen presentation
  const handleOpenPreview = (receiverView = false) => {
    setIsReceiverMode(receiverView);
    setIsPreviewMode(true);
    // Auto-save surprise in the background
    handleSaveSurpriseToServer();
  };

  if (isLoadingSurprise) {
    return (
      <div className="fixed inset-0 z-50 bg-[#14080e] flex flex-col items-center justify-center p-6 text-center select-none font-['Outfit',sans-serif]">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#f43f5e] to-[#fb923c] animate-pulse flex items-center justify-center text-3xl shadow-[0_0_35px_rgba(244,63,94,0.6)]">
            🎁
          </div>
          <span className="absolute -top-1 -right-1 text-xl animate-bounce">✨</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
          Unwrapping Birthday Surprise...
        </h2>
        <p className="text-sm text-[#fda4af]/80 max-w-xs animate-pulse">
          Gathering memories, melodies and heartfelt wishes ✨
        </p>
      </div>
    );
  }

  if (isPreviewMode) {
    return (
      <RecipientExperience
        data={data}
        onExitPreview={() => setIsPreviewMode(false)}
        isSoundOn={isSoundOn}
        onToggleSound={handleToggleSound}
        isReceiverMode={isReceiverMode}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fff8f6] text-[#261812] flex flex-col font-['Outfit',sans-serif] selection:bg-[#ffdad3] selection:text-[#8a1b06]">
      {/* Top Header */}
      <Header
        currentStep={currentStep}
        onSelectStep={handleSelectStep}
        isSoundOn={isSoundOn}
        onToggleSound={handleToggleSound}
        onOpenPreview={() => handleOpenPreview(false)}
        onOpenSoundtrackStudio={() => setIsSoundtrackModalOpen(true)}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-20 flex flex-col items-center">
        {currentStep === 1 && (
          <Step1TheStar
            data={data}
            onChange={handleUpdateData}
            onNext={() => handleSelectStep(2)}
          />
        )}

        {currentStep === 2 && (
          <Step2PickCake
            data={data}
            onChange={handleUpdateData}
            onNext={() => handleSelectStep(3)}
            onBack={() => handleSelectStep(1)}
          />
        )}

        {currentStep === 3 && (
          <Step3Balloons
            data={data}
            onChange={handleUpdateData}
            onNext={() => handleSelectStep(4)}
            onBack={() => handleSelectStep(2)}
          />
        )}

        {currentStep === 4 && (
          <Step4MemoryLane
            data={data}
            onChange={handleUpdateData}
            onNext={() => handleSelectStep(5)}
            onBack={() => handleSelectStep(3)}
          />
        )}

        {currentStep === 5 && (
          <Step5Letter
            data={data}
            onChange={handleUpdateData}
            onNext={() => handleSelectStep(6)}
            onBack={() => handleSelectStep(4)}
            onOpenSoundtrackStudio={() => setIsSoundtrackModalOpen(true)}
            onOpenVoiceModal={() => handleOpenVoiceModal('letter')}
          />
        )}

        {currentStep === 6 && (
          <Step6PreviewSend
            data={data}
            onSelectStep={handleSelectStep}
            onOpenPreview={handleOpenPreview}
            surpriseId={surpriseId}
            onSaveSurprise={handleSaveSurpriseToServer}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onOpenPreview={() => handleOpenPreview(false)} />

      {/* Soundtrack Studio Modal */}
      <SoundtrackStudioModal
        isOpen={isSoundtrackModalOpen}
        onClose={() => setIsSoundtrackModalOpen(false)}
        selectedSoundtrack={data.soundtrack}
        volume={data.soundtrackVolume}
        customMusicUrl={data.customMusicUrl}
        customMusicName={data.customMusicName}
        onSelectSoundtrack={(id, volume, customAudio) => {
          if (customAudio) {
            handleUpdateData({
              soundtrack: 'custom',
              soundtrackVolume: volume,
              customMusicUrl: customAudio.url,
              customMusicName: customAudio.name,
            });
            if (isSoundOn) {
              toggleBackgroundMusic(true, volume / 100, 'custom', customAudio.url);
            }
          } else {
            handleUpdateData({ soundtrack: id, soundtrackVolume: volume });
            if (isSoundOn) {
              toggleBackgroundMusic(true, volume / 100, id, id === 'custom' ? data.customMusicUrl : undefined);
            }
          }
        }}
      />

      {/* Dual Voice Note Recording Modal */}
      <VoiceNoteModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        recipientName={data.recipientName}
        activeSlot={voiceModalSlot}
        voiceNoteCandle={data.voiceNoteCandle || (data.voiceNote?.trigger === 'chapter1' ? data.voiceNote : null)}
        voiceNoteLetter={data.voiceNoteLetter || (data.voiceNote?.trigger === 'chapter4' ? data.voiceNote : null)}
        onSaveVoiceNotes={(recordings) => {
          handleUpdateData({
            voiceNoteCandle: recordings.voiceNoteCandle,
            voiceNoteLetter: recordings.voiceNoteLetter,
            // Keep backwards compatibility
            voiceNote: recordings.voiceNoteCandle || recordings.voiceNoteLetter || null,
          });
        }}
      />
    </div>
  );
}
