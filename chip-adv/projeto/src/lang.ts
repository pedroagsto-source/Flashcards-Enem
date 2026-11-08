import { createContext, useContext } from 'react';
export type Lang = 'pt' | 'es';
export const LangCtx = createContext<Lang>('pt');
export const useLang = () => useContext(LangCtx);
/** escolhe o texto do idioma atual */
export const useTx = () => { const l = useLang(); return (pt: string, es: string) => (l === 'es' ? es : pt); };
/** clipe de efeito no idioma atual (es/clipes tem as legendas e textos em espanhol) */
export const clipe = (l: Lang, c: string) => (l === 'es' ? `es/clipes/${c}.mp4` : `ads/clipes/${c}.mp4`);

/* ---------- voz dublada em espanhol (ElevenLabs, voz clonada) e legenda tirada dela ---------- */
import LEG from './data/legendas_es.json';
export type VozEs = 'f1' | 'f7' | 'demo';
export const VOZ_ES: Record<VozEs, string> = { f1: 'es/voz/f1.wav', f7: 'es/voz/f7.wav', demo: 'es/voz/demo.wav' };
const norm = (w: string) => w.toLowerCase().replace(/[^a-záéíóúñü]/g, '');
const CHAVE = new Set(['abogado', 'archivo', 'ia', 'error', 'pausa', 'pausas', 'edita', 'toma', 'listo', 'más', 'cansado', 'amateur', 'horas', 'magia',
  'manualmente', 'inteligencia', 'celular', 'chip', 'adv', 'mapa', 'contenido', 'estilo', 'órdenes', 'moderno', 'documentito']);
/** palavras da dublagem com tempo global (frames) e destaque nas palavras-chave */
export const palavrasEs = (v: VozEs) => (LEG as Record<VozEs, { w: string; g: number; ge: number }[]>)[v].map((x) => ({ ...x, k: CHAVE.has(norm(x.w)) }));
/** reparte as palavras pelos trechos (pelo início de cada palavra) */
export const porTrecho = <T extends { start: number; dur: number }>(v: VozEs, chs: T[]) => {
  const ws = palavrasEs(v);
  return chs.map((c, j) => ws.filter((w) => (j === 0 || w.g >= c.start) && (j === chs.length - 1 || w.g < c.start + c.dur)));
};
