import { createContext, useContext } from 'react';
export type Lang = 'pt' | 'es';
export const LangCtx = createContext<Lang>('pt');
export const useLang = () => useContext(LangCtx);
/** escolhe o texto do idioma atual */
export const useTx = () => { const l = useLang(); return (pt: string, es: string) => (l === 'es' ? es : pt); };
/** clipe de efeito no idioma atual (es/clipes tem as legendas e textos em espanhol) */
export const clipe = (l: Lang, c: string) => (l === 'es' ? `es/clipes/${c}.mp4` : `ads/clipes/${c}.mp4`);
