import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { brand, font, springIn } from '../brand';
import { chunks, E, S, Word } from '../lib';
import { z2, Z1 } from '../camera';
import { Lang, useLang } from '../lang';

type Group = { start: number; end: number; words: (Word & { g: number; ge: number })[] };

/* legenda em espanhol: mesma janela de cada trecho, palavras distribuídas pelo peso das vogais (a voz continua a original) */
const ES: [string, string[]][] = [
  ['Abogado,', []], ['¿todavía editas tus videos a mano?', ['mano?']], ['Mira lo que se puede hacer', []],
  ['usando un solo archivo de inteligencia artificial.', ['solo', 'archivo']], ['Este video empezó como una grabación normal de celular.', ['celular.']],
  ['Y después de poner el CHIP,', ['CHIP,']], ['¡mira cómo quedó!', ['quedó!']], ['Funciona así: adjuntas el CHIP en la conversación', ['CHIP']],
  ['con tu IA, abres este mapa', ['mapa']], ['y simplemente eliges el contenido que quieres hacer.', ['contenido']],
  ['Cómo lo quieres hacer, qué estilo quieres,', ['estilo']], ['qué situación quieres.', ['situación']],
  ['¿Entiendes? Y tú solo vas dando las órdenes', ['órdenes']], ['y él va construyendo', ['construyendo']], ['lo mejor', ['mejor']],
  ['y más moderno en edición.', ['moderno']], ['Organicé todo', ['todo']], ['en un solo chip.', ['chip.']],
  ['Haz clic aquí en Más información,', ['Más', 'información,']], ['adjunta este documento', ['documento']], ['y mira la magia suceder.', ['magia']],
];
const peso = (w: string) => Math.max(1, (w.toLowerCase().match(/[aeiouáéíóú]/g) || []).length + 0.25 * w.length);
const chunksEs = chunks.map((c, i) => {
  const ws = ES[i][0].split(' '), a = c.words[0].s, b = c.words[c.words.length - 1].e, tot = ws.reduce((x, w) => x + peso(w), 0);
  let cur = a;
  const words: Word[] = ws.map((w) => { const d = ((b - a) * peso(w)) / tot; const o = { w, s: Math.round(cur), e: Math.round(cur + d), k: ES[i][1].includes(w) }; cur += d; return o; });
  return { ...c, words };
});

/** Agrupa 2–4 palavras, quebrando em pontuação. Tempos em frames globais. */
const mkGroups = (chs: typeof chunks): Group[] => {
  const out: Group[] = [];
  for (const c of chs) {
    let cur: Group | null = null;
    c.words.forEach((w, idx) => {
      const ww = { ...w, g: c.start + w.s, ge: c.start + w.e };
      if (!cur) cur = { start: ww.g, end: ww.ge, words: [] };
      cur.words.push(ww);
      cur.end = ww.ge;
      const punct = /[,.?!:]$/.test(w.w);
      const len = cur.words.reduce((a, x) => a + x.w.length, 0);
      if (cur.words.length >= 3 || (punct && cur.words.length >= 2) || len > 16 || idx === c.words.length - 1) {
        out.push(cur);
        cur = null;
      }
    });
  }
  // cada grupo fica na tela até o próximo começar (sem buracos curtos)
  out.forEach((gp, i) => {
    const nx = out[i + 1];
    gp.end = nx && nx.start - gp.end < 12 ? nx.start : gp.end + 6;
  });
  return out;
};
const GROUPS: Record<Lang, Group[]> = { pt: mkGroups(chunks), es: mkGroups(chunksEs) };

/** Onde a legenda some (efeitos com texto grande) ou muda de altura. */
const hidden = (g: number) =>
  (g >= Z1 && g < Z1 + 26) || (g >= z2() && g < E(1)) || (g >= S(3) && g < E(3)) || g >= S(16);
const posY = (g: number) => (g >= S(7) && g < E(7) ? 1215 : 1150);

export const Captions = () => {
  const g = useCurrentFrame();
  const { fps } = useVideoConfig(); const l = useLang();
  if (hidden(g)) return null;
  const gp = GROUPS[l].find((x) => g >= x.start && g < x.end);
  if (!gp) return null;
  const enter = spring({ frame: g - gp.start, fps, config: springIn });
  return (
    <AbsoluteFill style={{ alignItems: 'center' }}>
      <div
        style={{
          position: 'absolute', top: posY(g), width: 900, display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
          gap: '8px 30px', transform: `scale(${0.82 + 0.18 * enter}) translateY(${(1 - enter) * 24}px)`, opacity: enter,
        }}
      >
        {gp.words.map((w, i) => {
          const active = g >= w.g && g < w.ge + 2;
          const pop = spring({ frame: g - w.g, fps, config: { damping: 12, stiffness: 220, mass: 0.5 } });
          const said = g >= w.g;
          return (
            <span
              key={i}
              style={{
                fontFamily: font.ui, fontWeight: 900, fontSize: 84, lineHeight: 1.08, letterSpacing: -1.5,
                textTransform: 'uppercase',
                color: w.k && said ? brand.bg : active ? brand.accent : brand.ink,
                background: w.k && said ? brand.accent : 'transparent',
                padding: w.k ? '0 16px' : 0, borderRadius: 14,
                textShadow: w.k && said ? 'none' : '0 4px 18px rgba(0,0,0,.6), 0 0 2px rgba(0,0,0,.8)',
                transform: `scale(${active ? 1 + 0.08 * pop : 1})`,
                display: 'inline-block', opacity: said ? 1 : 0.92,
              }}
            >
              {w.w.replace(/[,.:]$/, '')}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
