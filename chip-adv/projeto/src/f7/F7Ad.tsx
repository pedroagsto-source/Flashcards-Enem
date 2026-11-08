import { AbsoluteFill, Audio, interpolate, OffthreadVideo, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { brand, font, springIn } from '../brand';
import { Grade } from '../components/Grade';
import { clipe, Lang, LangCtx, porTrecho, useLang, useTx, VOZ_ES } from '../lang';

/** F7 · "Gravado no carro": efeitos bem evidentes, um forte por frase. */
type Raw = [from: number, to: number, text: string, keys: string[]];
const RAW: Raw[] = [
  [34, 58, 'Advogado,', ['Advogado,']],
  [65, 172, 'assim como eu, tu tá cansado de fazer vídeo amador.', ['cansado', 'amador.']],
  [176, 241, 'Passar horas editando um vídeo', ['horas']],
  [250, 349, 'e não sair nem perto daqueles vídeos que você fica se comparando.', ['comparando.']],
  [368, 431, 'Mas agora eu tenho uma forma que tu pode resolver isso', ['agora']],
  [442, 499, 'apenas juntando um arquivo na tua IA.', ['arquivo']],
  [542, 574, 'Junta esse arquivo.', ['Junta']],
  [591, 652, 'e vê a mágica acontecer, meu irmão.', ['mágica']],
  [664, 731, 'Clica em Saiba Mais e saiba mais sobre isso.', ['Saiba', 'Mais']],
];
const peso = (w: string) => Math.max(1, (w.toLowerCase().match(/[aeiouáéíóúâêôãõà]/g) || []).length + 0.25 * w.length);
type W = { w: string; g: number; ge: number; k: boolean };
type C = { i: number; from: number; start: number; dur: number; words: W[] };
const palavras = (text: string, keys: string[], t: number, dur: number): W[] => {
  const ws = text.split(' '), tot = ws.reduce((s, w) => s + peso(w), 0), span = dur - 5;
  let cur = 3;
  return ws.map((w) => { const d = (span * peso(w)) / tot; const o = { w, g: t + Math.round(cur), ge: t + Math.round(cur + d), k: keys.includes(w) }; cur += d; return o; });
};
let t = 0;
const CH: C[] = RAW.map(([a, b, text, keys], i) => {
  const dur = b - a, words = palavras(text, keys, t, dur);
  const c = { i, from: a, start: t, dur, words }; t += dur; return c;
});
const ES_W = porTrecho('f7', CH);
const CH_ES: C[] = CH.map((c) => ({ ...c, words: ES_W[c.i] }));
export const F7_FRAMES = t;
const S = (i: number) => CH[i].start, E = (i: number) => CH[i].start + CH[i].dur;
const wf = (i: number, w: string) => (CH[i].words.find((x) => x.w.toLowerCase().startsWith(w)) || CH[i].words[0]).g;
const cl = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const L = (f: number, a: number[], b: number[]) => interpolate(f, a, b, cl);
const pop = (f: number, fps: number, d = 0, c = { damping: 12, stiffness: 220, mass: 0.6 }) => spring({ frame: f - d, fps, config: c });

const T = {
  z1: 1, cansado: wf(1, 'cansado'), amador: wf(1, 'amador'), horas: wf(2, 'horas'), comparando: wf(3, 'comparando'),
  agora: S(4), arquivo: wf(5, 'arquivo'), junta: wf(6, 'junta'), magica: wf(7, 'mágica'), saiba: wf(8, 'saiba'),
};
const BW = 'grayscale(1) contrast(1.5) brightness(1.08)';
const FRIO = 'saturate(0.55) contrast(0.95) brightness(0.96)';
const VIVO = 'contrast(1.12) saturate(1.28) brightness(1.04)';

/* ---------- câmera: zooms secos, tremidas e cor por fase ---------- */
const tremor = (g: number, at: number, amp: number, dur = 10) => { const k = g >= at && g < at + dur ? (1 - (g - at) / dur) * amp : 0; return [Math.sin(g * 8.7) * k, Math.cos(g * 6.1) * k]; };
const camera = (g: number) => {
  let s = 1, filter = VIVO, blur = 0, oy = 34;
  const sh = [[T.z1, 18], [T.cansado, 26], [T.amador, 20], [T.junta, 22], [T.magica, 14]].map(([a, m]) => tremor(g, a, m));
  if (g < E(0)) { s = g < T.z1 + 1 ? 1 : 1.3; filter = BW; blur = g >= T.z1 && g < T.z1 + 3 ? (3 - (g - T.z1)) * 3 : 0; }
  else if (g < S(4) - 8) {
    filter = FRIO; s = (CH.find((c) => g >= c.start && g < c.start + c.dur)?.i ?? 0) % 2 ? 1.1 : 1.0;
    if (g >= T.cansado && g < E(1)) s = 1.22;
  } else if (g < S(4) + 12) { // corte no zoom
    const a = S(4) - 8, c = S(4);
    s = g < c ? L(g, [a, c], [1, 2.6]) : L(g, [c, c + 12], [2.6, 1]);
    blur = g < c ? L(g, [a, c], [0, 14]) : L(g, [c, c + 10], [14, 0]);
    filter = g < c ? FRIO : VIVO; oy = 40;
  } else {
    const c = CH.find((x) => g >= x.start && g < x.start + x.dur);
    s = c && c.i % 2 ? 1.1 : 1.0;
    if (g >= T.junta && g < T.junta + 10) s = 1.18;
  }
  const x = sh.reduce((a, v) => a + v[0], 0), y = sh.reduce((a, v) => a + v[1], 0);
  return { s, x, y, filter: `${filter} blur(${blur}px)`, oy };
};

const Base = () => {
  const g = useCurrentFrame(); const c = camera(g); const mudo = useLang() === 'es';
  return <AbsoluteFill style={{ overflow: 'hidden' }}>
    <AbsoluteFill style={{ transform: `translate(${c.x}px, ${c.y}px) scale(${c.s})`, transformOrigin: `50% ${c.oy}%`, filter: c.filter }}>
      {CH.map((x) => <Sequence key={x.i} from={x.start} durationInFrames={x.dur} layout="none">
        <AbsoluteFill><OffthreadVideo src={staticFile('f7/carro.mp4')} trimBefore={x.from} muted={mudo} style={{ width: '100%', height: '100%' }} /></AbsoluteFill>
      </Sequence>)}
    </AbsoluteFill>
    {/* tinta vermelha no "cansado" */}
    <AbsoluteFill style={{ background: 'radial-gradient(circle, rgba(255,40,40,0) 40%, rgba(255,30,30,.45))', opacity: L(g, [T.cansado, T.cansado + 4, E(1) - 6, E(1)], [0, 1, 1, 0]) }} />
  </AbsoluteFill>;
};

/* ---------- legendas ---------- */
const mkGroups = (chs: C[]) => {
  const out: { start: number; end: number; words: W[] }[] = [];
  chs.forEach((c) => { let cur: W[] = []; c.words.forEach((w, i) => { cur.push(w); const len = cur.reduce((a, x) => a + x.w.length, 0);
    if (cur.length >= 3 || (/[,.:?!]$/.test(w.w) && cur.length >= 2) || len > 15 || i === c.words.length - 1) { out.push({ start: cur[0].g, end: w.ge, words: cur }); cur = []; } }); });
  out.forEach((gp, i) => { const nx = out[i + 1]; gp.end = nx && nx.start - gp.end < 12 ? nx.start : gp.end + 6; });
  return out;
};
const GROUPS: Record<Lang, ReturnType<typeof mkGroups>> = { pt: mkGroups(CH), es: mkGroups(CH_ES) };
const oculta = (g: number) => g < E(0) || (g >= T.amador && g < E(1)) || (g >= T.magica && g < E(7)) || g >= T.saiba;
const Legendas = () => {
  const g = useCurrentFrame(); const { fps } = useVideoConfig(); const l = useLang();
  if (oculta(g)) return null;
  const gp = GROUPS[l].find((x) => g >= x.start && g < x.end); if (!gp) return null;
  const e = spring({ frame: g - gp.start, fps, config: springIn });
  return <AbsoluteFill style={{ alignItems: 'center' }}>
    <div style={{ position: 'absolute', top: 1200, width: 940, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 24px', transform: `scale(${0.8 + 0.2 * e}) rotate(${(1 - e) * -3}deg)`, opacity: e }}>
      {gp.words.map((w, i) => { const on = g >= w.g && g < w.ge + 2, dito = g >= w.g;
        return <span key={i} style={{ fontFamily: font.ui, fontWeight: 900, fontSize: 88, lineHeight: 1.06, letterSpacing: -1.5, textTransform: 'uppercase', display: 'inline-block',
          color: w.k && dito ? brand.bg : on ? brand.accent : brand.ink, background: w.k && dito ? brand.accent : 'transparent', padding: w.k ? '0 14px' : 0, borderRadius: 14,
          textShadow: w.k && dito ? 'none' : '0 4px 0 #000, 0 6px 22px rgba(0,0,0,.7)', transform: `scale(${on ? 1.12 : 1}) rotate(${w.k && dito ? -2 : 0}deg)` }}>{w.w.replace(/[,.:]$/, '')}</span>; })}
    </div>
  </AbsoluteFill>;
};

/* ---------- efeitos ---------- */
const Gigante = ({ a, b, txt, cor = brand.accent, size = 240, y = 300 }: { a: number; b: number; txt: string; cor?: string; size?: number; y?: number }) => {
  const g = useCurrentFrame(); const { fps } = useVideoConfig(); if (g < a || g >= b) return null;
  const k = pop(g, fps, a, { damping: 10, stiffness: 280, mass: 0.5 });
  return <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ fontFamily: font.bebas, fontSize: size, color: cor, letterSpacing: 4, transform: `translateY(${y}px) scale(${1.6 - 0.6 * k})`, opacity: L(g, [b - 4, b], [1, 0]), textShadow: '0 8px 0 #000, 0 14px 40px rgba(0,0,0,.6)' }}>{txt}</div>
  </AbsoluteFill>;
};

const Carimbo = () => {
  const g = useCurrentFrame(); const { fps } = useVideoConfig(); const a = T.amador; const tx = useTx(); if (g < a || g >= E(1) + 6) return null;
  const k = pop(g, fps, a, { damping: 9, stiffness: 300, mass: 0.7 });
  return <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ transform: `translateY(260px) rotate(-14deg) scale(${2.2 - 1.2 * k})`, opacity: Math.min(1, k * 1.4) * L(g, [E(1), E(1) + 6], [1, 0]),
      border: '14px solid #E5322D', borderRadius: 24, padding: '6px 40px', fontFamily: font.display, fontSize: 190, letterSpacing: 10, color: '#E5322D', background: 'rgba(255,255,255,.12)', boxShadow: 'inset 0 0 0 6px rgba(229,50,45,.35)' }}>{tx('AMADOR', 'AMATEUR')}</div>
  </AbsoluteFill>;
};

const Relogio = () => {
  const g = useCurrentFrame(); const { fps } = useVideoConfig(); const a = S(2), b = E(2); if (g < a || g >= b) return null;
  const k = pop(g, fps, a), p = L(g, [a, b - 4], [0, 1]), min = Math.floor(p * 180);
  const ang = p * 360 * 3;
  return <div style={{ position: 'absolute', left: 0, right: 0, top: 210, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 34, transform: `scale(${k})`, opacity: L(g, [b - 4, b], [1, 0]) }}>
    <svg width={230} height={230} viewBox="0 0 100 100"><circle cx={50} cy={50} r={46} fill="#0B0B0F" stroke={brand.accent} strokeWidth={6} />
      {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={50} y1={10} x2={50} y2={16} stroke="#fff" strokeWidth={3} transform={`rotate(${i * 30} 50 50)`} />)}
      <line x1={50} y1={50} x2={50} y2={28} stroke="#fff" strokeWidth={6} strokeLinecap="round" transform={`rotate(${ang / 12} 50 50)`} />
      <line x1={50} y1={50} x2={50} y2={16} stroke={brand.accent} strokeWidth={4} strokeLinecap="round" transform={`rotate(${ang} 50 50)`} /></svg>
    <div style={{ fontFamily: font.ui, fontWeight: 900, fontSize: 150, color: '#fff', textShadow: '0 6px 0 #000', fontVariantNumeric: 'tabular-nums' }}>{Math.floor(min / 60)}:{String(min % 60).padStart(2, '0')}<span style={{ fontSize: 60, color: brand.accent }}>h</span></div>
  </div>;
};

const Comparacao = () => {
  const g = useCurrentFrame(); const { fps } = useVideoConfig(); const a = S(3) + 6, b = E(3); if (g < a || g >= b) return null;
  const k1 = pop(g, fps, a), k2 = pop(g, fps, a + 8), kv = pop(g, fps, a + 16), o = L(g, [b - 5, b], [1, 0]);
  const card = (k: number, lado: number, rot: number, child: React.ReactNode, rot2: string, cor: string) => <div style={{ width: 340, transform: `translateX(${(1 - k) * lado * 500}px) rotate(${rot}deg)` }}>
    <div style={{ height: 470, borderRadius: 30, overflow: 'hidden', boxShadow: `0 0 0 5px ${cor}, 0 30px 60px rgba(0,0,0,.6)`, background: '#000' }}>{child}</div>
    <div style={{ marginTop: 14, textAlign: 'center', fontFamily: font.ui, fontWeight: 900, fontSize: 38, color: cor === '#888' ? '#fff' : brand.bg, background: cor, borderRadius: 12, padding: '4px 0' }}>{rot2}</div></div>;
  return <div style={{ position: 'absolute', left: 0, right: 0, top: 170, display: 'flex', justifyContent: 'center', gap: 50, opacity: o }}>
    {card(k1, -1, -5, <OffthreadVideo src={staticFile('f7/carro.mp4')} trimBefore={250} muted style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) brightness(.85)' }} />, useTx()('O SEU', 'EL TUYO'), '#888')}
    <div style={{ alignSelf: 'center', marginTop: -60, fontFamily: font.display, fontSize: 120, color: '#E5322D', transform: `scale(${kv})`, textShadow: '0 6px 0 #000' }}>≠</div>
    {card(k2, 1, 5, <Sequence from={a} layout="none"><OffthreadVideo src={staticFile(clipe(useLang(), 'e16'))} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></Sequence>, useTx()('O QUE VOCÊ QUER', 'EL QUE QUIERES'), brand.accent)}
  </div>;
};

const Raios = () => {
  const g = useCurrentFrame(); const c = S(4);
  const o = L(g, [c - 8, c, c + 14], [0, 1, 0]); const f = g >= c && g < c + 4 ? 1 - (g - c) / 4 : 0;
  return <AbsoluteFill style={{ pointerEvents: 'none' }}>
    <AbsoluteFill style={{ opacity: o, mixBlendMode: 'screen', background: 'repeating-conic-gradient(from 0deg at 50% 40%, rgba(216,255,60,0) 0deg, rgba(216,255,60,.6) 2deg, rgba(216,255,60,0) 6deg, transparent 12deg)' }} />
    <AbsoluteFill style={{ background: '#fff', opacity: f }} />
  </AbsoluteFill>;
};

const Arquivo = ({ at, y, cai }: { at: number; y: number; cai?: number }) => {
  const g = useCurrentFrame(); const { fps } = useVideoConfig(); const k = pop(g, fps, at); const tx = useTx();
  const queda = cai !== undefined ? L(g, [cai - 6, cai], [0, 230]) : 0, sq = cai !== undefined && g >= cai && g < cai + 4 ? 0.85 : 1;
  return <div style={{ position: 'absolute', left: '50%', top: y + queda, transform: `translateX(-50%) scale(${k}) scaleY(${sq}) rotate(${(1 - k) * -14}deg)`, display: 'flex', alignItems: 'center', gap: 18, zIndex: 3,
    background: '#F5F2EA', color: '#1b1b1f', borderRadius: 26, padding: '18px 28px', boxShadow: '0 30px 60px rgba(0,0,0,.5)', fontFamily: font.ui }}>
    <span style={{ background: '#E8643C', color: '#fff', borderRadius: 10, padding: '14px 10px', fontWeight: 900, fontSize: 22 }}>.MD</span>
    <b style={{ fontSize: 42, fontWeight: 900 }}>{tx('CHIP_ADV.md', 'CHIP_ABOGADO.md')}</b></div>;
};

const Janela = ({ a, b }: { a: number; b: number }) => {
  const g = useCurrentFrame(); const { fps } = useVideoConfig(); const tx = useTx(); if (g < a || g >= b) return null;
  const k = pop(g, fps, a), o = L(g, [b - 5, b], [1, 0]); const dentro = g >= T.junta;
  return <div style={{ position: 'absolute', left: 70, right: 70, top: 380, height: 300, borderRadius: 34, background: '#F5F2EA', color: '#1b1b1f', fontFamily: font.ui, padding: 24,
    boxShadow: dentro && g < T.junta + 8 ? `0 0 0 8px ${brand.accent}, 0 30px 70px rgba(0,0,0,.5)` : '0 30px 70px rgba(0,0,0,.5)', transform: `scale(${0.9 + 0.1 * k})`, opacity: k * o }}>
    <div style={{ fontWeight: 800, fontSize: 28, color: '#777' }}>{tx('✦ Sua IA', '✦ Tu IA')}</div>
    {dentro && <div style={{ position: 'absolute', right: 24, top: 70, display: 'flex', gap: 12, alignItems: 'center', background: '#1b1b1f', color: '#fff', borderRadius: 20, padding: '12px 18px', transform: `scale(${pop(g, fps, T.junta)})`, transformOrigin: '100% 50%' }}>
      <span style={{ background: '#E8643C', borderRadius: 8, padding: '6px 8px', fontWeight: 900, fontSize: 18 }}>.MD</span><b style={{ fontSize: 30 }}>{tx('CHIP_ADV.md ✓', 'CHIP_ABOGADO.md ✓')}</b></div>}
    <div style={{ position: 'absolute', left: 24, right: 24, bottom: 22, background: '#fff', border: '2px solid #e3ddd0', borderRadius: 22, padding: '14px 20px', fontSize: 30, fontWeight: 600, color: '#aaa', display: 'flex', justifyContent: 'space-between' }}>
      <span>{tx('Solte o arquivo aqui', 'Suelta el archivo aquí')}</span><span style={{ color: brand.accent, background: '#1b1b1f', borderRadius: 24, width: 46, height: 46, display: 'grid', placeItems: 'center' }}>↑</span></div>
  </div>;
};

const Magica = () => {
  const g = useCurrentFrame(); const { fps } = useVideoConfig(); const tx = useTx(); const a = T.magica - 3, b = E(7); if (g < a || g >= b) return null;
  const clips = ['e05', 'e17', 'e16', 'e12'], seg = Math.max(6, Math.floor((b - a) / 4)), i = Math.min(3, Math.floor((g - a) / seg));
  const t0 = (g - a) / fps;
  return <AbsoluteFill>
    <div style={{ position: 'absolute', left: 290, top: 170, width: 500, height: 889, borderRadius: 44, overflow: 'hidden', boxShadow: `0 0 0 6px ${brand.accent}, 0 0 80px ${brand.accent}88`, transform: `rotate(${(i % 2 ? 1 : -1) * 3}deg) scale(${0.9 + 0.1 * pop(g, fps, a + i * seg)})`, opacity: L(g, [b - 4, b], [1, 0]) }}>
      {clips.map((c, j) => <Sequence key={c} from={a + j * seg} durationInFrames={j === 3 ? b - (a + j * seg) : seg} layout="none"><OffthreadVideo src={staticFile(clipe(useLang(), c))} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></Sequence>)}
    </div>
    {Array.from({ length: 36 }).map((_, j) => { const ang = random(`m${j}`) * Math.PI * 2, r = 120 + 900 * t0 * (0.4 + random(`r${j}`));
      return <div key={j} style={{ position: 'absolute', left: 540 + Math.cos(ang) * r, top: 620 + Math.sin(ang) * r, fontSize: 34 + 40 * random(`s${j}`), color: j % 3 ? brand.accent : '#fff', opacity: L(t0, [0.5, 1.4], [1, 0]), transform: `rotate(${g * 9 + j * 20}deg)` }}>✦</div>; })}
    <div style={{ position: 'absolute', left: 0, right: 0, top: 1150, textAlign: 'center', fontFamily: font.bebas, fontSize: 210, color: brand.accent, textShadow: '0 8px 0 #000', transform: `scale(${pop(g, fps, a + 2)})` }}>{tx('✦ MÁGICA ✦', '✦ MAGIA ✦')}</div>
  </AbsoluteFill>;
};

const Cta = () => {
  const g = useCurrentFrame(); const { fps } = useVideoConfig(); const tx = useTx(); if (g < S(8)) return null;
  const click = T.saiba + 8, press = g >= click && g < click + 6 ? 0.92 : 1, pulso = 1 + 0.05 * Math.sin(g / 3);
  const cx = L(g, [T.saiba - 4, click - 1], [920, 640]), cy = L(g, [T.saiba - 4, click - 1], [1720, 1410]);
  return <AbsoluteFill>
    {[0, 1, 2].map((i) => <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: 1060 + i * 70, textAlign: 'center', fontSize: 70, color: brand.accent, opacity: 0.35 + 0.65 * Math.abs(Math.sin((g - i * 4) / 6)), fontWeight: 900 }}>↓</div>)}
    <div style={{ position: 'absolute', left: 0, right: 0, top: 1300, display: 'flex', justifyContent: 'center' }}>
      <div style={{ background: brand.accent, color: brand.bg, fontFamily: font.ui, fontWeight: 900, fontSize: 70, padding: '32px 70px', borderRadius: 999, transform: `scale(${pop(g, fps, S(8)) * press * pulso})`, boxShadow: `0 0 0 8px ${brand.bg}, 0 0 60px ${brand.accent}` }}>{tx('Saiba mais →', 'Más información →')}</div>
    </div>
    {g >= T.saiba - 4 && <svg width={110} height={110} viewBox="0 0 24 24" style={{ position: 'absolute', left: cx, top: cy }}><path d="M4 2l16 9-7 2-3 7z" fill="#fff" stroke="#111" strokeWidth={1.3} strokeLinejoin="round" /></svg>}
  </AbsoluteFill>;
};

const Flash = () => { const g = useCurrentFrame(); const o = [T.z1, T.amador, T.junta].reduce((m, z) => Math.max(m, g >= z && g < z + 3 ? 0.75 * (1 - (g - z) / 3) : 0), 0); return <AbsoluteFill style={{ background: '#fff', opacity: o }} />; };

const SFX: [number, string, number][] = [
  [T.z1, 'impact', 0.6], [T.z1, 'flash', 0.3], [T.cansado, 'impact', 0.45], [T.amador, 'impact', 0.7], [T.amador, 'flash', 0.3],
  [S(2), 'whoosh', 0.3], ...Array.from({ length: 7 }, (_, i): [number, string, number] => [S(2) + i * 9, 'tick', 0.35]),
  [S(3) + 6, 'whoosh', 0.3], [S(3) + 14, 'whoosh', 0.3], [S(3) + 22, 'erro', 0.25],
  [S(4) - 30, 'riser', 0.35], [S(4) - 8, 'whoosh', 0.45], [S(4), 'impact', 0.6], [S(4), 'flash', 0.35],
  [T.arquivo, 'pop', 0.45], [S(6) - 4, 'whoosh', 0.35], [T.junta, 'impact', 0.55], [T.junta + 2, 'pop', 0.45],
  [T.magica - 3, 'shimmer', 0.5], [T.magica - 3, 'riser', 0.2], [T.magica + 6, 'whoosh', 0.25], [T.magica + 14, 'whoosh', 0.25],
  [S(8), 'whoosh', 0.35], [T.saiba + 8, 'click', 0.6],
];

export const F7Ad = ({ lang = 'pt' }: { lang?: Lang }) => (
  <LangCtx.Provider value={lang}><AbsoluteFill style={{ background: '#000' }}>
    <Base />
    <Gigante a={T.z1 + 1} b={E(0)} txt={lang === 'es' ? 'ABOGADO' : 'ADVOGADO'} />
    <Carimbo />
    <Relogio />
    <Comparacao />
    <Raios />
    <Sequence from={T.arquivo - 4} durationInFrames={E(5) - T.arquivo + 4 + 6}><Arquivo at={0} y={250} /></Sequence>
    <Janela a={S(5)} b={E(6) + 4} />
    <Sequence from={S(6) - 6} durationInFrames={T.junta - S(6) + 10}><Arquivo at={0} y={180} cai={T.junta - S(6) + 6} /></Sequence>
    <Magica />
    <Cta />
    <Legendas />
    <Flash />
    <Grade />
    {SFX.map(([f, n, v], i) => <Sequence key={i} from={Math.max(0, Math.round(f))} durationInFrames={50} layout="none"><Audio src={staticFile(`sfx/${n}.wav`)} volume={v} /></Sequence>)}
    {lang === 'es' && <Audio src={staticFile(VOZ_ES.f7)} />}
    <Audio src={staticFile('music/bed.wav')} volume={(f) => L(f, [0, 6, F7_FRAMES - 15, F7_FRAMES], [0, 0.16, 0.16, 0])} />
  </AbsoluteFill></LangCtx.Provider>
);
