import React, { useState, useEffect, useRef } from 'react';
import { VoiceNoteItem } from '../../types';
import { playChime } from '../../utils/sound';

interface DualVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  activeSlot?: 'candle' | 'letter';
  voiceNoteCandle?: VoiceNoteItem | null;
  voiceNoteLetter?: VoiceNoteItem | null;
  onSaveVoiceNotes: (data: {
    voiceNoteCandle?: VoiceNoteItem | null;
    voiceNoteLetter?: VoiceNoteItem | null;
  }) => void;
}

export const VoiceNoteModal: React.FC<DualVoiceModalProps> = ({
  isOpen,
  onClose,
  recipientName,
  activeSlot = 'candle',
  voiceNoteCandle,
  voiceNoteLetter,
  onSaveVoiceNotes,
}) => {
  const [currentSlot, setCurrentSlot] = useState<'candle' | 'letter'>('candle');

  // Track recording states for currentSlot
  const [candleAudio, setCandleAudio] = useState<{ url?: string; duration?: number } | null>(null);
  const [letterAudio, setLetterAudio] = useState<{ url?: string; duration?: number } | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Sync initial state on open
  useEffect(() => {
    if (isOpen) {
      setCurrentSlot(activeSlot || 'candle');
      setCandleAudio(
        voiceNoteCandle?.audioUrl
          ? { url: voiceNoteCandle.audioUrl, duration: voiceNoteCandle.duration || 15 }
          : null
      );
      setLetterAudio(
        voiceNoteLetter?.audioUrl
          ? { url: voiceNoteLetter.audioUrl, duration: voiceNoteLetter.duration || 20 }
          : null
      );
      setIsRecording(false);
      setIsPaused(false);
      setIsPlayingRecorded(false);
      setPlaybackTime(0);
      setPermissionError(null);
    }
  }, [isOpen, activeSlot, voiceNoteCandle, voiceNoteLetter]);

  // Handle active audio for current slot
  const currentSlotAudio = currentSlot === 'candle' ? candleAudio : letterAudio;

  // Recording Timer
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = window.setInterval(() => {
        setElapsed((prev) => {
          if (prev >= 180) {
            handleStopRecording();
            return 180;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused]);

  // Clean up
  useEffect(() => {
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSwitchSlot = (slot: 'candle' | 'letter') => {
    if (isRecording) {
      handleStopRecording();
    }
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setIsPlayingRecorded(false);
    }
    setCurrentSlot(slot);
    setElapsed(0);
    setPlaybackTime(0);
  };

  const handleStartRecording = async () => {
    try {
      setPermissionError(null);
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        setIsPlayingRecorded(false);
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone access is not supported by your browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const mimeTypes = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'];
      let selectedMimeType = '';
      for (const mime of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mime)) {
          selectedMimeType = mime;
          break;
        }
      }

      const recorder = selectedMimeType
        ? new MediaRecorder(stream, { mimeType: selectedMimeType })
        : new MediaRecorder(stream);

      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const mime = selectedMimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mime });

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = reader.result as string;
          if (currentSlot === 'candle') {
            setCandleAudio({ url: base64Data, duration: elapsed > 0 ? elapsed : 10 });
          } else {
            setLetterAudio({ url: base64Data, duration: elapsed > 0 ? elapsed : 15 });
          }
        };
        reader.readAsDataURL(audioBlob);

        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start(250);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setIsPaused(false);
      setElapsed(0);
      setPlaybackTime(0);
    } catch (err: unknown) {
      console.warn('Microphone error:', err);
      setPermissionError('Microphone permission needed to record audio. Please allow microphone access.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setIsPaused(false);
    playChime([523.25, 659.25, 783.99], 0.08, 0.2);
  };

  const handleTogglePause = () => {
    if (!isRecording || !mediaRecorderRef.current) return;
    if (!isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    } else {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const handleResetCurrentSlot = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    setIsRecording(false);
    setIsPaused(false);
    setIsPlayingRecorded(false);
    setElapsed(0);
    setPlaybackTime(0);

    if (currentSlot === 'candle') {
      setCandleAudio(null);
    } else {
      setLetterAudio(null);
    }
  };

  const handleTogglePlayback = () => {
    if (!currentSlotAudio?.url) return;

    if (isPlayingRecorded) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      setIsPlayingRecorded(false);
      return;
    }

    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }

    const audio = new Audio(currentSlotAudio.url);
    audioPlayerRef.current = audio;

    audio.ontimeupdate = () => {
      setPlaybackTime(Math.floor(audio.currentTime));
    };

    audio.onended = () => {
      setIsPlayingRecorded(false);
      setPlaybackTime(0);
    };

    audio.onerror = () => {
      setIsPlayingRecorded(false);
      playChime([440, 554.37, 659.25], 0.1, 0.2);
    };

    audio.play().then(() => {
      setIsPlayingRecorded(true);
    }).catch((e) => {
      console.warn('Playback error:', e);
      setIsPlayingRecorded(false);
    });
  };

  const handleSaveAll = () => {
    if (isRecording) {
      handleStopRecording();
    }
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setIsPlayingRecorded(false);
    }

    onSaveVoiceNotes({
      voiceNoteCandle: candleAudio?.url
        ? { audioUrl: candleAudio.url, duration: candleAudio.duration || 10 }
        : null,
      voiceNoteLetter: letterAudio?.url
        ? { audioUrl: letterAudio.url, duration: letterAudio.duration || 15 }
        : null,
    });

    playChime([523.25, 659.25, 783.99, 1046.5], 0.05, 0.25);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-auto bg-white rounded-3xl border border-[#fce8dc] shadow-[0_28px_72px_-12px_rgba(58,42,35,0.22)] overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Decorative Beam */}
        <div className="h-2 w-full bg-gradient-to-r from-[#FB923C] via-[#ff6f52] to-[#F43F5E]" />

        {/* Modal Header */}
        <div className="p-6 bg-white flex flex-col gap-3 relative border-b border-[#fce8dc]">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#FFF0E6] hover:bg-[#ffe9e1] flex items-center justify-center text-[#786155] hover:text-[#261812] transition-all shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          <div className="flex items-start gap-3 pr-10">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF0E6] flex items-center justify-center shrink-0 shadow-xs text-[#ac331c]">
              <span className="material-symbols-outlined text-[26px]">mic</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-[#ac331c] tracking-wider px-2.5 py-0.5 rounded-full bg-[#ffe9e1]">
                Dual Audio Studio
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-[#261812] tracking-tight mt-1">
                Record Voice Messages for {recipientName} 🎙️
              </h1>
              <p className="text-xs text-[#59413c] mt-0.5 max-w-xl">
                Add two personalized recordings: one right after blowing the cake candles, and another to be opened with the letter.
              </p>
            </div>
          </div>

          {/* Slot Tabs */}
          <div className="grid grid-cols-2 gap-2 mt-2 pt-1">
            <button
              type="button"
              onClick={() => handleSwitchSlot('candle')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                currentSlot === 'candle'
                  ? 'bg-[#FFF0E6] border-[#ac331c] shadow-xs ring-1 ring-[#ac331c]/20'
                  : 'bg-white border-[#fce8dc] hover:bg-[#fff1ec]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-2xl">🎂</span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#261812] flex items-center gap-1.5">
                    <span>Recording 1: Candle Blow</span>
                    {candleAudio?.url && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    )}
                  </div>
                  <div className="text-[11px] text-[#786155] truncate">
                    Plays automatically when candles blow
                  </div>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                candleAudio?.url ? 'bg-emerald-100 text-emerald-800' : 'bg-[#ffe9e1] text-[#ac331c]'
              }`}>
                {candleAudio?.url ? 'Recorded ✓' : 'Ready'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchSlot('letter')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                currentSlot === 'letter'
                  ? 'bg-[#FFF0E6] border-[#ac331c] shadow-xs ring-1 ring-[#ac331c]/20'
                  : 'bg-white border-[#fce8dc] hover:bg-[#fff1ec]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-2xl">💌</span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#261812] flex items-center gap-1.5">
                    <span>Recording 2: The Letter</span>
                    {letterAudio?.url && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    )}
                  </div>
                  <div className="text-[11px] text-[#786155] truncate">
                    Plays on Chapter 4 Letter page
                  </div>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                letterAudio?.url ? 'bg-emerald-100 text-emerald-800' : 'bg-[#ffe9e1] text-[#ac331c]'
              }`}>
                {letterAudio?.url ? 'Recorded ✓' : 'Ready'}
              </span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Active Target Banner */}
          <div className="px-4 py-2 rounded-xl bg-[#fee3d8] border border-[#fce8dc] flex items-center justify-between">
            <span className="text-xs font-bold text-[#ac331c] flex items-center gap-1.5">
              <span>{currentSlot === 'candle' ? '🎂 Recording for Candle Blow (Chapter 1)' : '💌 Recording for Letter Page (Chapter 4)'}</span>
            </span>
            <span className="text-[11px] text-[#786155]">
              {currentSlotAudio?.url ? 'Has recorded audio' : 'No audio recorded yet'}
            </span>
          </div>

          {/* Central Recording Console */}
          <div className="w-full rounded-2xl bg-[#FFF0E6] p-5 sm:p-6 flex flex-col gap-4 border border-[#fce8dc]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]" />
                <span className="text-xs font-semibold text-[#261812]">
                  {isRecording ? 'Recording microphone...' : 'Microphone Ready'}
                </span>
                <span className="text-xs text-[#786155]">• High Fidelity 🟢</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-full text-xs text-[#786155] self-start sm:self-auto font-medium">
                <span className="material-symbols-outlined text-[15px] text-[#ac331c]">timelapse</span>
                <span>{formatTime(180 - elapsed)} left (3:00 max)</span>
              </div>
            </div>

            {/* Permission or Browser Error */}
            {permissionError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{permissionError}</span>
              </div>
            )}

            {/* Waveform Box */}
            <div className="w-full bg-white rounded-xl p-5 shadow-xs flex flex-col items-center justify-center gap-3 border border-[#fce8dc]">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-[#261812] tracking-tight font-mono">
                  {isPlayingRecorded
                    ? formatTime(playbackTime)
                    : isRecording
                    ? formatTime(elapsed)
                    : currentSlotAudio?.duration
                    ? formatTime(currentSlotAudio.duration)
                    : '00:00'}
                </span>
                <span className={`text-xs font-bold tracking-wider uppercase flex items-center gap-1 ${
                  isRecording && !isPaused
                    ? 'text-[#ac331c] animate-pulse'
                    : isPlayingRecorded
                    ? 'text-emerald-600'
                    : 'text-[#786155]'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    isRecording && !isPaused
                      ? 'bg-[#ac331c]'
                      : isPlayingRecorded
                      ? 'bg-emerald-600 animate-pulse'
                      : 'bg-[#786155]'
                  }`} />
                  {isRecording
                    ? (isPaused ? 'PAUSED' : 'REC')
                    : isPlayingRecorded
                    ? 'PLAYING'
                    : currentSlotAudio?.url
                    ? 'SAVED'
                    : 'READY'}
                </span>
              </div>

              {/* Dynamic Sound Bars */}
              <div className="w-full h-16 flex items-center justify-center gap-1 px-2">
                {[8, 12, 18, 24, 36, 44, 28, 52, 60, 34, 48, 56, 38, 26, 42, 58, 30, 20, 14, 8].map((h, i) => (
                  <div
                    key={i}
                    className={`w-2 rounded-full transition-all duration-200 ${
                      (isRecording && !isPaused) || isPlayingRecorded
                        ? 'bg-gradient-to-t from-[#FB923C] to-[#F43F5E] animate-pulse'
                        : currentSlotAudio?.url
                        ? 'bg-[#fb923c]/50'
                        : 'bg-[#ffdad3]'
                    }`}
                    style={{
                      height: `${
                        (isRecording && !isPaused) || isPlayingRecorded
                          ? h
                          : currentSlotAudio?.url
                          ? Math.max(10, h * 0.6)
                          : Math.max(8, h * 0.35)
                      }}px`
                    }}
                  />
                ))}
              </div>

              <div className="w-full max-w-xs flex items-center justify-between text-[11px] text-[#786155]">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-[#ac331c]">
                    {currentSlotAudio?.url ? 'verified' : 'graphic_eq'}
                  </span>
                  <span>
                    {currentSlotAudio?.url
                      ? `${currentSlot === 'candle' ? 'Candle blow' : 'Letter'} voice note ready`
                      : `Press red button to record for ${currentSlot === 'candle' ? 'candles' : 'letter'}`}
                  </span>
                </span>
                <span className="font-mono text-[10px]">
                  {currentSlotAudio?.duration ? `${formatTime(currentSlotAudio.duration)} saved` : '00:00'}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-1">
              {!isRecording ? (
                <>
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className="h-12 px-6 rounded-full bg-gradient-to-r from-[#FB923C] to-[#F43F5E] text-white flex items-center gap-2 font-semibold text-sm shadow-[0_6px_20px_-2px_rgba(255,111,82,0.4)] hover:scale-102 active:scale-98 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">mic</span>
                    <span>{currentSlotAudio?.url ? 'Re-record Voice' : `Record ${currentSlot === 'candle' ? 'Candle Wish' : 'Letter Audio'}`}</span>
                  </button>

                  {currentSlotAudio?.url && (
                    <button
                      type="button"
                      onClick={handleTogglePlayback}
                      className="h-12 px-5 rounded-full bg-white hover:bg-[#ffe9e1] text-[#ac331c] flex items-center gap-2 font-semibold text-xs sm:text-sm border border-[#fce8dc] shadow-xs cursor-pointer active:scale-98 transition-all"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {isPlayingRecorded ? 'stop' : 'play_arrow'}
                      </span>
                      <span>{isPlayingRecorded ? 'Stop Listening' : 'Listen ▶️'}</span>
                    </button>
                  )}

                  {currentSlotAudio?.url && (
                    <button
                      type="button"
                      onClick={handleResetCurrentSlot}
                      className="h-12 px-4 rounded-full bg-white hover:bg-[#ffe9e1] text-[#786155] flex items-center gap-1 font-semibold text-xs border border-[#fce8dc] shadow-xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                      <span>Clear</span>
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleTogglePause}
                    className="h-12 px-4 rounded-full bg-white hover:bg-[#ffe9e1] text-[#261812] flex items-center gap-1.5 font-semibold text-xs border border-[#fce8dc] shadow-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isPaused ? 'play_arrow' : 'pause'}
                    </span>
                    <span>{isPaused ? 'Resume' : 'Pause'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleStopRecording}
                    className="h-12 px-6 rounded-full bg-gradient-to-r from-[#FB923C] to-[#F43F5E] text-white flex items-center gap-2 font-semibold text-xs sm:text-sm shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer"
                  >
                    <span className="w-3.5 h-3.5 rounded-xs bg-white" />
                    <span>Done Recording</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetCurrentSlot}
                    className="h-12 px-4 rounded-full bg-white hover:bg-[#ffe9e1] text-[#786155] flex items-center gap-1.5 font-semibold text-xs border border-[#fce8dc] shadow-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                    <span>Start Over ↺</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-6 bg-[#fff1ec] border-t border-[#fce8dc] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto text-xs font-semibold text-[#786155] hover:text-[#261812] py-2 px-4 rounded-full cursor-pointer"
          >
            Cancel / Close
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleSaveAll}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FB923C] to-[#F43F5E] text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Save Both Recordings to Surprise</span>
              <span>✨</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
