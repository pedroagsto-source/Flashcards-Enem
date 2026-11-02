import { interpolate, random, staticFile } from 'remotion';
import edl from './data/edl.json';

export type Word = { w: string; s: number; e: number; k: boolean };
export type Chunk = { i: number; clip: string; from: number; to: number; start: number; dur: number; text: string; words: Word[] };
export const chunks = edl.chunks as Chunk[];
export const TOTAL: number = edl.total;

export const S = (i: number) => chunks[i].start;
export const E = (i: number) => chunks[i].start + chunks[i].dur;
export const chunkAt = (g: number) => chunks.find((c) => g >= c.start && g < c.start + c.dur) ?? chunks[chunks.length - 1];
export const wordFrame = (i: number, w: string) => {
  const c = chunks[i];
  const x = c.words.find((z) => z.w.toLowerCase().replace(/[^\p{L}]/gu, '').startsWith(w.toLowerCase()));
  return c.start + (x ? x.s : 0);
};
export const srcFrame = (g: number) => {
  const c = chunkAt(g);
  return { clip: c.clip, f: c.from + Math.max(0, Math.min(g - c.start, c.dur - 1)) };
};
export const cutoutSrc = (g: number) => {
  const { clip, f } = srcFrame(g);
  return staticFile(`cutout/${clip}/${String(f).padStart(5, '0')}.webp`);
};
export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
export const lerp = (f: number, a: number[], b: number[], easing?: (t: number) => number) =>
  interpolate(f, a, b, { ...clamp, easing });
/** tremida de câmera decaindo a partir de `at` */
export const shake = (f: number, at: number, dur = 9, amp = 14, seed = 'a') => {
  const t = f - at;
  if (t < 0 || t >= dur) return { x: 0, y: 0 };
  const k = amp * (1 - t / dur);
  return { x: (random(`${seed}x${t}`) - 0.5) * 2 * k, y: (random(`${seed}y${t}`) - 0.5) * 2 * k };
};
/** flash branco: 1 no frame `at`, some em 3 frames */
export const flash = (f: number, at: number, len = 3) => (f >= at && f < at + len ? 0.7 * (1 - (f - at) / len) : 0);
