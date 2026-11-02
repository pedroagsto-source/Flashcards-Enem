import { E, S, wordFrame } from './lib';
import { Z1, z2 } from './camera';

/** Momentos-chave (frames globais) compartilhados entre efeitos e efeitos sonoros. */
export const T = {
  z1: Z1,
  z2: z2(),
  vidro: S(3),
  rec: S(4),
  corte: E(5),
  tasks: [0, 1, 2, 3, 4].map((k) => S(7) + 22 + k * 12),
  mapa: wordFrame(8, 'mapa'),
  checks: [wordFrame(9, 'conteúdo'), S(10) + 4, wordFrame(10, 'estilo'), wordFrame(11, 'situação')],
  ordens: [wordFrame(12, 'ordens') - 6, S(13) + 4, wordFrame(14, 'melhor'), wordFrame(15, 'moderno')],
  capa: S(16),
  cta: S(18),
  click: wordFrame(18, 'saiba'),
  doc: wordFrame(19, 'documentinho'),
  magica: wordFrame(20, 'mágica'),
};
