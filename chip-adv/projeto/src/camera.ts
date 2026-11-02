import { chunkAt, E, lerp, S, shake, wordFrame } from './lib';
import { ease } from './brand';

export type Cam = { s: number; tx: number; ty: number; ox: number; oy: number; filter: string; radius: number };

export const GRADE = 'contrast(1.08) saturate(1.1) brightness(1.02)';
export const BW = 'grayscale(1) contrast(1.55) brightness(1.06)';
export const RAW = 'saturate(0.55) contrast(0.92) brightness(0.97)';

export const Z1 = 2; // 1º zoom do hook
export const z2 = () => wordFrame(1, 'manualmente') - 2; // 2º zoom, na palavra "manualmente"

/** Câmera virtual sobre o vídeo base, frame a frame (global). */
export const camera = (g: number): Cam => {
  const c = chunkAt(g);
  const base: Cam = { s: c.i % 2 ? 1.08 : 1, tx: 0, ty: 0, ox: 50, oy: 36, filter: GRADE, radius: 0 };

  // 05 · Zoom digital (hook): P&B, zooms secos 1.0 → 1.3 → 1.65 com tremida e borrão
  if (g < E(1)) {
    const Z2 = z2();
    const s = g < Z1 ? 1 : g < Z2 ? 1.3 + 0.03 * ((g - Z1) / (Z2 - Z1)) : 1.65;
    const sh1 = shake(g, Z1, 9, 16, 'z1');
    const sh2 = shake(g, Z2, 9, 20, 'z2');
    const blur = Math.max(g - Z1 >= 0 && g - Z1 < 3 ? (3 - (g - Z1)) * 3 : 0, g - Z2 >= 0 && g - Z2 < 3 ? (3 - (g - Z2)) * 3 : 0);
    return { ...base, s, tx: sh1.x + sh2.x, ty: sh1.y + sh2.y, oy: 33, filter: `${BW} blur(${blur}px)` };
  }

  // Antes: gravação crua de celular
  const T = E(5); // corte antes → depois
  if (g >= S(4) && g < T - 10) return { ...base, filter: RAW };

  // 09 · Corte no zoom: acelera até a camisa, corta, sai do zoom desacelerando
  if (g >= T - 10 && g < T + 12) {
    const inn = g < T;
    const s = inn ? lerp(g, [T - 10, T], [1, 2.9], ease.in) : lerp(g, [T, T + 12], [2.9, 1], ease.out);
    const blur = inn ? lerp(g, [T - 10, T], [0, 14], ease.in) : lerp(g, [T, T + 10], [14, 0], ease.out);
    const tint = inn ? RAW : GRADE;
    return { ...base, s, ox: 50, oy: 64, filter: `${tint} blur(${blur}px) brightness(${1 + blur / 40})` };
  }

  // 11 · Revelação: o vídeo vira a pré-visualização de um editor
  if (g >= S(7) && g < E(7)) {
    const p = lerp(g, [S(7), S(7) + 16], [0, 1], ease.out) * (1 - lerp(g, [E(7) - 12, E(7)], [0, 1], ease.in));
    const s = 1 - 0.5 * p;
    return { ...base, s, tx: 60 * p, ty: 230 * p, ox: 0, oy: 0, radius: (28 / s) * p };
  }

  // efeitos com fundo próprio: câmera neutra
  if (g >= S(9) && g < E(11)) return { ...base, s: 1 };
  return base;
};
