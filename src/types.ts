export interface BalloonItem {
  id: string;
  name: string;
  color: string;
  textColor: string;
  tagColor: string;
  tagBg: string;
  text: string;
  popNumber: number;
  popped?: boolean;
}

export interface MemoryPhoto {
  id: string;
  url: string;
  caption: string;
  location?: string;
  date?: string;
}

export type LetterTone = 'romantic' | 'cheerful' | 'nostalgic' | 'sweet';
export type WaxSealColor = 'crimson' | 'gold' | 'blush';
export type CakeType = 'midnight-chocolate' | 'strawberry-blush' | 'vanilla-gold';

export interface VoiceNoteItem {
  audioUrl?: string;
  duration?: number;
}

export interface SurpriseData {
  recipientName: string;
  senderName: string;
  age: string;
  birthDay: string;
  birthMonth: string;
  cake: CakeType;
  virtualCandles: boolean;
  balloons: BalloonItem[];
  photos: MemoryPhoto[];
  fairyLightsActive: boolean;
  letter: string;
  letterTone: LetterTone;
  waxSeal: WaxSealColor;
  soundtrack: string;
  soundtrackVolume: number;
  customMusicUrl?: string; // Uploaded custom audio (data URL or audio link)
  customMusicName?: string; // File name or display title for custom track
  customMusicDuration?: number; // Duration in seconds
  // Two dedicated recordings:
  voiceNoteCandle?: VoiceNoteItem | null; // Plays when candles are blown
  voiceNoteLetter?: VoiceNoteItem | null; // Plays on the letter page
  // Backwards compatibility:
  voiceNote?: {
    audioUrl?: string;
    duration?: number;
    trigger?: 'chapter1' | 'chapter4' | 'intro';
  } | null;
}
