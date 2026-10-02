/**
 * Compression and Decompression utilities for resilient URL sharing and offline-first surprise restoration.
 * Uses native browser CompressionStream/DecompressionStream (with fallback for legacy environments).
 */

import { SurpriseData } from '../types';

// Convert binary uint8array to base64url string
function uint8ArrayToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Convert base64url string to uint8array
function base64UrlToUint8Array(base64url: string): Uint8Array {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Strips excessively large binary assets (e.g. >500kb base64 voice notes) if needed for URL compression,
 * while keeping all core surprise content intact.
 */
function prepareDataForUrl(data: SurpriseData): any {
  const sanitized = { ...data };

  // If photos contain very huge raw dataUrls, keep photos but if a single photo exceeds 400KB,
  // we let the server API handle the full photo payload while URL keeps essential data
  if (sanitized.photos && sanitized.photos.length > 0) {
    sanitized.photos = sanitized.photos.map((p) => ({
      ...p,
      // If photo url is a reasonable data URL or external URL, preserve it
      url: p.url && p.url.length > 300000 ? '' : p.url,
    }));
  }

  // If custom audio is massive base64, don't blow up URL length (server API stores full audio)
  if (sanitized.customMusicUrl && sanitized.customMusicUrl.length > 50000) {
    sanitized.customMusicUrl = undefined;
  }
  if (sanitized.voiceNoteCandle?.audioUrl && sanitized.voiceNoteCandle.audioUrl.length > 50000) {
    sanitized.voiceNoteCandle = { ...sanitized.voiceNoteCandle, audioUrl: undefined };
  }
  if (sanitized.voiceNoteLetter?.audioUrl && sanitized.voiceNoteLetter.audioUrl.length > 50000) {
    sanitized.voiceNoteLetter = { ...sanitized.voiceNoteLetter, audioUrl: undefined };
  }

  return sanitized;
}

/**
 * Compress surprise object into a compact base64url string suitable for URL parameters.
 */
export async function compressSurprise(data: SurpriseData): Promise<string> {
  try {
    const compactData = prepareDataForUrl(data);
    const jsonStr = JSON.stringify(compactData);

    if (typeof CompressionStream !== 'undefined') {
      const stream = new Blob([jsonStr]).stream().pipeThrough(new CompressionStream('gzip'));
      const response = new Response(stream);
      const buffer = await response.arrayBuffer();
      return uint8ArrayToBase64Url(new Uint8Array(buffer));
    } else {
      // Fallback
      return encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
    }
  } catch (err) {
    console.warn('Compression error:', err);
    return '';
  }
}

/**
 * Decompress a base64url string back into SurpriseData.
 */
export async function decompressSurprise(compressed: string): Promise<Partial<SurpriseData> | null> {
  if (!compressed) return null;
  try {
    if (typeof DecompressionStream !== 'undefined') {
      try {
        const bytes = base64UrlToUint8Array(compressed);
        const stream = new Blob([bytes.buffer as ArrayBuffer]).stream().pipeThrough(new DecompressionStream('gzip'));
        const response = new Response(stream);
        const text = await response.text();
        return JSON.parse(text);
      } catch (streamErr) {
        // Try fallback unescape/btoa
        const decoded = decodeURIComponent(escape(atob(decodeURIComponent(compressed))));
        return JSON.parse(decoded);
      }
    } else {
      const decoded = decodeURIComponent(escape(atob(decodeURIComponent(compressed))));
      return JSON.parse(decoded);
    }
  } catch (err) {
    console.warn('Decompression error:', err);
    return null;
  }
}
