import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { brand, font, springIn } from '../brand';
import { chunks, E, S, Word } from '../lib';
import { z2, Z1 } from '../camera';

type Group = { start: number; end: number; words: (Word & { g: number; ge: number })[] };

/** Agrupa 2–4 palavras, quebrando em pontuação. Tempos em frames globais. */
const groups: Group[] = (() => {
  const out: Group[] = [];
  for (const c of chunks) {
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
})();

/** Onde a legenda some (efeitos com texto grande) ou muda de altura. */
const hidden = (g: number) =>
  (g >= Z1 && g < Z1 + 26) || (g >= z2() && g < E(1)) || (g >= S(3) && g < E(3)) || g >= S(16);
const posY = (g: number) => (g >= S(7) && g < E(7) ? 1215 : 1150);

export const Captions = () => {
  const g = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (hidden(g)) return null;
  const gp = groups.find((x) => g >= x.start && g < x.end);
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
