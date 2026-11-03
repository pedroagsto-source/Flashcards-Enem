import { AbsoluteFill, Audio, Img, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { brand, font, springIn } from '../brand';
import { Grade } from '../components/Grade';
import { clipe, Lang, LangCtx, useLang, useTx } from '../lang';

/* ---------- EDL do F1 (gancho + corpo), em frames de 30 fps da origem ---------- */
type Raw = [clip: 'gancho' | 'corpo', from: number, to: number, text: string, keys: string[]];
const RAW: Raw[] = [
  ['gancho', 42, 69, 'Advogado,', ['Advogado,']],
  ['gancho', 75, 139, 'o seu editor de vídeo agora cabe num arquivo.', ['arquivo.']],
  ['corpo', 15, 94, 'Você abre a sua IA e anexa esse arquivo aqui.', ['anexa']],
  ['corpo', 118, 221, 'Depois manda o vídeo do jeito que você gravou, com erro, com pausa.', ['erro,', 'pausa.']],
  ['corpo', 241, 311, 'E escreve só isso: edita pra mim.', ['edita', 'pra', 'mim.']],
  ['corpo', 325, 403, 'Ela corta as pausas, fica com a melhor tomada,', ['pausas,', 'tomada,']],
  ['corpo', 438, 499, 'e devolve pronto pra postar.', ['pronto']],
  ['corpo', 530, 604, 'Toca em Saiba Mais que eu te mostro os efeitos funcionando.', ['Saiba', 'Mais']],
];
/* legenda em espanhol: mesma janela de tempo de cada trecho (a voz continua a original) */
const ES: [string, string[]][] = [
  ['Abogado,', ['Abogado,']],
  ['tu editor de video ahora cabe en un archivo.', ['archivo.']],
  ['Abres tu IA y adjuntas este archivo aquí.', ['adjuntas']],
  ['Luego envías el video tal como lo grabaste, con errores, con pausas.', ['errores,', 'pausas.']],
  ['Y escribes solo esto: edítalo por mí.', ['edítalo', 'por', 'mí.']],
  ['Corta las pausas, se queda con la mejor toma,', ['pausas,', 'toma,']],
  ['y te lo devuelve listo para publicar.', ['listo']],
  ['Toca en Más información y te muestro los efectos funcionando.', ['Más', 'información']],
];
const peso = (w: string) => Math.max(1, (w.toLowerCase().match(/[aeiouáéíóúâêôãõà]/g) || []).length + 0.25 * w.length);
type W = { w: string; g: number; ge: number; k: boolean };
type C = { i: number; clip: string; from: number; start: number; dur: number; words: W[] };
const palavras = (text: string, keys: string[], t: number, dur: number): W[] => {
  const ws = text.split(' '), tot = ws.reduce((s, w) => s + peso(w), 0), span = dur - 5;
  let cur = 3;
  return ws.map((w) => { const d = (span * peso(w)) / tot; const o = { w, g: t + Math.round(cur), ge: t + Math.round(cur + d), k: keys.includes(w) }; cur += d; return o; });
};
let t = 0;
const CH: C[] = RAW.map(([clip, a, b, text, keys], i) => {
  const dur = b - a, words = palavras(text, keys, t, dur);
  const c = { i, clip, from: a, start: t, dur, words }; t += dur; return c;
});
const CH_ES: C[] = CH.map((c) => ({ ...c, words: palavras(ES[c.i][0], ES[c.i][1], c.start, c.dur) }));
export const F1_FRAMES = t;
export type Fundo = 'original' | 'escritorio';
const S = (i: number) => CH[i].start, E = (i: number) => CH[i].start + CH[i].dur;
const wf = (i: number, w: string) => (CH[i].words.find((x) => x.w.toLowerCase().startsWith(w)) || CH[i].words[0]).g;
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const pop = (f: number, fps: number, d = 0, cfg = { damping: 13, stiffness: 210, mass: 0.6 }) => spring({ frame: f - d, fps, config: cfg });
const GRADE = 'contrast(1.08) saturate(1.08) brightness(1.03)';
const BW = 'grayscale(1) contrast(1.5) brightness(1.08)';

/* momentos-chave */
const Z1 = 2, Z2 = wf(1, 'arquivo') - 1;
const T = { anexa: wf(2, 'anexa'), erro: wf(3, 'erro'), pausa: wf(3, 'pausa'), edita: wf(4, 'edita'), pausas: wf(5, 'pausas'), tomada: wf(5, 'tomada'), pronto: wf(6, 'pronto'), saiba: wf(7, 'saiba') };

/* ---------- câmera ---------- */
const camera = (g: number) => {
  if (g < E(1)) {
    const s = g < Z1 ? 1 : g < Z2 ? 1.25 : 1.45;
    const k = (at: number) => (g >= at && g < at + 8 ? (1 - (g - at) / 8) * 14 : 0);
    const sx = Math.sin(g * 7.3) * (k(Z1) + k(Z2)), sy = Math.cos(g * 5.1) * (k(Z1) + k(Z2));
    const blur = (g >= Z1 && g < Z1 + 3 ? 3 - (g - Z1) : 0) + (g >= Z2 && g < Z2 + 3 ? 3 - (g - Z2) : 0);
    return { s, x: sx, y: sy, filter: `${BW} blur(${blur * 2.5}px)`, oy: 30 };
  }
  const c = CH.find((x) => g >= x.start && g < x.start + x.dur) || CH[CH.length - 1];
  return { s: c.i % 2 ? 1.07 : 1, x: 0, y: 0, filter: GRADE, oy: 35 };
};

/** Recorte da pessoa no frame da origem correspondente (troca de cenário). */
const Recorte = ({ c }: { c: C }) => {
  const lf = useCurrentFrame(); const f = c.from + Math.min(lf, c.dur - 1);
  return <Img src={staticFile(`f1/cutout/${c.clip}/${String(f).padStart(5, '0')}.webp`)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
    filter: 'sepia(.06) saturate(1.04) drop-shadow(0 0 26px rgba(0,0,0,.35))' }} />;
};

const Base = ({ fundo }: { fundo: Fundo }) => {
  const g = useCurrentFrame(); const c = camera(g);
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `translate(${c.x}px, ${c.y}px) scale(${c.s})`, transformOrigin: `50% ${c.oy}%`, filter: c.filter }}>
        {fundo === 'escritorio' && <Img src={staticFile('f1/escritorio.jpg')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          transform: `scale(1.1) translateX(${interpolate(g, [0, F1_FRAMES], [-12, 12])}px)` }} />}
        {CH.map((x) => (
          <Sequence key={x.i} from={x.start} durationInFrames={x.dur} layout="none">
            {fundo === 'escritorio'
              ? <><AbsoluteFill><Recorte c={x} /></AbsoluteFill><Audio src={staticFile(`f1/${x.clip}.mp4`)} trimBefore={x.from} /></>
              : <AbsoluteFill><OffthreadVideo src={staticFile(`f1/${x.clip}.mp4`)} trimBefore={x.from} style={{ width: '100%', height: '100%' }} /></AbsoluteFill>}
          </Sequence>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- legendas ---------- */
const mkGroups = (chs: C[]) => {
  const out: { start: number; end: number; words: W[] }[] = [];
  chs.forEach((c) => {
    let cur: W[] = [];
    c.words.forEach((w, i) => {
      cur.push(w);
      const len = cur.reduce((a, x) => a + x.w.length, 0);
      if (cur.length >= 3 || (/[,.:?!]$/.test(w.w) && cur.length >= 2) || len > 15 || i === c.words.length - 1) { out.push({ start: cur[0].g, end: w.ge, words: cur }); cur = []; }
    });
  });
  out.forEach((gp, i) => { const nx = out[i + 1]; gp.end = nx && nx.start - gp.end < 12 ? nx.start : gp.end + 6; });
  return out;
};
const GROUPS: Record<Lang, ReturnType<typeof mkGroups>> = { pt: mkGroups(CH), es: mkGroups(CH_ES) };
const legendaOculta = (g: number) => (g >= Z1 && g < S(1)) || (g >= Z2 && g < E(1)) || g >= T.saiba;
const Legendas = () => {
  const g = useCurrentFrame(); const { fps } = useVideoConfig();
  const l = useLang();
  if (legendaOculta(g)) return null;
  const gp = GROUPS[l].find((x) => g >= x.start && g < x.end); if (!gp) return null;
  const e = spring({ frame: g - gp.start, fps, config: springIn });
  return (
    <AbsoluteFill style={{ alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 1180, width: 920, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 26px', transform: `scale(${0.84 + 0.16 * e})`, opacity: e }}>
        {gp.words.map((w, i) => {
          const on = g >= w.g && g < w.ge + 2, dito = g >= w.g;
          return <span key={i} style={{ fontFamily: font.ui, fontWeight: 900, fontSize: 82, lineHeight: 1.08, letterSpacing: -1.5, textTransform: 'uppercase',
            color: w.k && dito ? brand.bg : on ? brand.accent : brand.ink, background: w.k && dito ? brand.accent : 'transparent', padding: w.k ? '0 14px' : 0, borderRadius: 14,
            textShadow: w.k && dito ? 'none' : '0 4px 18px rgba(0,0,0,.65)', display: 'inline-block', transform: `scale(${on ? 1.07 : 1})` }}>{w.w.replace(/[,.:]$/, '')}</span>;
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- efeitos ---------- */
const PalavraGigante = ({ a, b, txt, size = 230 }: { a: number; b: number; txt: string; size?: number }) => {
  const g = useCurrentFrame(); const { fps } = useVideoConfig();
  if (g < a || g >= b) return null;
  const k = pop(g, fps, a, { damping: 11, stiffness: 260, mass: 0.5 }), o = interpolate(g, [b - 4, b], [1, 0], clamp);
  return <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ fontFamily: font.bebas, fontSize: size, color: brand.accent, letterSpacing: 4, transform: `translateY(330px) scale(${1.5 - 0.5 * k})`, opacity: o, textShadow: '0 10px 40px rgba(0,0,0,.7)' }}>{txt}</div>
  </AbsoluteFill>;
};

const Arquivo = ({ y = 250, at, scale = 1 }: { y?: number; at: number; scale?: number }) => {
  const g = useCurrentFrame(); const { fps } = useVideoConfig(); const k = pop(g, fps, at); const tx = useTx();
  return <div style={{ position: 'absolute', left: '50%', top: y, transform: `translateX(-50%) scale(${k * scale}) rotate(${(1 - k) * -10}deg)`, display: 'flex', alignItems: 'center', gap: 20,
    background: '#F5F2EA', color: '#1b1b1f', borderRadius: 28, padding: '20px 30px', boxShadow: '0 30px 60px rgba(0,0,0,.45)', fontFamily: font.ui }}>
    <span style={{ background: '#E8643C', color: '#fff', borderRadius: 12, padding: '16px 12px', fontWeight: 900, fontSize: 24 }}>.MD</span>
    <span><b style={{ display: 'block', fontSize: 44, fontWeight: 900 }}>{tx('CHIP_ADV.md', 'CHIP_ABOGADO.md')}</b><span style={{ fontSize: 26, color: '#777', fontWeight: 600 }}>{tx('prompt mestre', 'prompt maestro')}</span></span>
  </div>;
};

/** Janela da IA acima da cabeça. modo 'anexa' (arquivo entrando) ou 'pede' (digitando "edita pra mim"). */
const JanelaIA = ({ a, b, modo }: { a: number; b: number; modo: 'anexa' | 'pede' }) => {
  const g = useCurrentFrame(); const { fps } = useVideoConfig();
  if (g < a || g >= b) return null;
  const k = pop(g, fps, a), o = interpolate(g, [b - 5, b], [1, 0], clamp);
  const tx = useTx();
  const txt = tx('edita pra mim', 'edítalo por mí'), n = Math.floor(interpolate(g, [T.edita - 6, T.edita + 6], [0, txt.length], clamp)), enviado = g >= T.edita + 10;
  const arqOn = modo === 'anexa' && g >= T.anexa; const ka = pop(g, fps, T.anexa);
  return <div style={{ position: 'absolute', left: 70, right: 70, top: 200, height: 340, borderRadius: 34, background: '#F5F2EA', color: '#1b1b1f', fontFamily: font.ui, padding: 26,
    boxShadow: '0 30px 70px rgba(0,0,0,.5)', transform: `translateY(${(1 - k) * -60}px) scale(${0.9 + 0.1 * k})`, opacity: k * o }}>
    <div style={{ fontWeight: 800, fontSize: 28, color: '#777' }}>{tx('✦ Sua IA', '✦ Tu IA')}</div>
    {arqOn && <div style={{ position: 'absolute', right: 26, top: 70, display: 'flex', gap: 14, alignItems: 'center', background: '#1b1b1f', color: '#fff', borderRadius: 22, padding: '14px 20px', transform: `scale(${ka})`, transformOrigin: '100% 50%' }}>
      <span style={{ background: '#E8643C', borderRadius: 8, padding: '8px 8px', fontWeight: 900, fontSize: 18 }}>.MD</span><b style={{ fontSize: 32 }}>{tx('CHIP_ADV.md', 'CHIP_ABOGADO.md')}</b></div>}
    {modo === 'pede' && enviado && <div style={{ position: 'absolute', right: 26, top: 70, background: '#1b1b1f', color: brand.accent, borderRadius: 22, padding: '16px 26px', fontWeight: 900, fontSize: 44, transform: `scale(${pop(g, fps, T.edita + 10)})`, transformOrigin: '100% 50%' }}>{txt}</div>}
    <div style={{ position: 'absolute', left: 26, right: 26, bottom: 24, background: '#fff', border: '2px solid #e3ddd0', borderRadius: 24, padding: '16px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 34, fontWeight: 600 }}>
      <span style={{ color: modo === 'pede' && !enviado && n > 0 ? '#1b1b1f' : '#aaa' }}>{modo === 'pede' && !enviado && n > 0 ? txt.slice(0, n) : tx('Escreva ou solte um arquivo', 'Escribe o suelta un archivo')}</span>
      <span style={{ width: 52, height: 52, borderRadius: 26, background: '#1b1b1f', color: brand.accent, display: 'grid', placeItems: 'center', fontWeight: 900 }}>↑</span>
    </div>
  </div>;
};

const Rabisco = ({ at, txt, x, y, rot }: { at: number; txt: string; x: number; y: number; rot: number }) => {
  const g = useCurrentFrame();
  if (g < at || g >= E(3)) return null;
  const p = interpolate(g, [at, at + 10], [0, 1], clamp), j = Math.floor(g / 3) % 2 ? 1.5 : -1.5;
  return <div style={{ position: 'absolute', left: x, top: y, transform: `rotate(${rot + j}deg)` }}>
    <svg width={480} height={240} viewBox="0 0 480 240" style={{ position: 'absolute', left: -50, top: -40 }}>
      <ellipse cx={240} cy={120} rx={220} ry={100} fill="none" stroke="#FF4A3D" strokeWidth={12} strokeLinecap="round" strokeDasharray={1050} strokeDashoffset={1050 * (1 - p)} />
    </svg>
    <div style={{ fontFamily: font.hand, fontWeight: 700, fontSize: 150, lineHeight: 1, color: '#FF4A3D', textShadow: '0 4px 14px rgba(0,0,0,.4)', opacity: p }}>{txt}</div>
  </div>;
};

const ITENS: Record<Lang, string[]> = { pt: ['Corta as pausas', 'Melhor tomada', 'Legenda', 'Efeitos', 'Trilha'], es: ['Corta las pausas', 'Mejor toma', 'Subtítulos', 'Efectos', 'Música'] };
const Checklist = () => {
  const g = useCurrentFrame(); const { fps } = useVideoConfig();
  const l = useLang();
  const a = S(5), b = T.pronto + 4; if (g < a || g >= b) return null;
  const at = [T.pausas, T.tomada, E(5) - 18, E(5) - 10, E(5) - 2];
  const k = pop(g, fps, a), o = interpolate(g, [b - 6, b], [1, 0], clamp);
  return <div style={{ position: 'absolute', left: 110, right: 110, top: 190, borderRadius: 34, overflow: 'hidden', border: '2px solid rgba(255,255,255,.35)', boxShadow: '0 30px 60px rgba(0,0,0,.4)',
    transform: `translateY(${(1 - k) * -400}px)`, opacity: o }}>
    <div style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(26px)', background: 'rgba(12,40,40,.5)' }} />
    <div style={{ position: 'relative', padding: '22px 34px', fontFamily: font.ui }}>
      {ITENS[l].map((it, i) => {
        const on = g >= at[i], kk = pop(g, fps, at[i]);
        return <div key={it} style={{ display: 'flex', alignItems: 'center', gap: 20, height: 62 }}>
          <span style={{ width: 40, height: 40, borderRadius: 20, border: `4px solid ${on ? brand.teal : 'rgba(255,255,255,.5)'}`, background: on ? brand.teal : 'transparent', display: 'grid', placeItems: 'center', transform: `scale(${on ? 0.8 + 0.2 * kk : 1})`, color: '#06302C', fontWeight: 900, fontSize: 24 }}>{on ? '✓' : ''}</span>
          <span style={{ fontWeight: 800, fontSize: 40, color: on ? 'rgba(255,255,255,.75)' : '#fff', textDecoration: on ? 'line-through' : 'none', textDecorationColor: brand.teal, textDecorationThickness: 4 }}>{it}</span>
        </div>;
      })}
    </div>
  </div>;
};

const Pronto = () => {
  const g = useCurrentFrame(); const { fps } = useVideoConfig();
  const tx = useTx();
  const a = T.pronto - 2, b = E(6); if (g < a || g >= b) return null;
  const k = pop(g, fps, a), o = interpolate(g, [b - 5, b], [1, 0], clamp);
  return <div style={{ position: 'absolute', right: 50, top: 230, width: 330, transform: `translateX(${(1 - k) * 420}px) rotate(${4 - 4 * k}deg)`, opacity: o }}>
    <div style={{ width: 330, height: 587, borderRadius: 36, overflow: 'hidden', boxShadow: `0 0 0 4px ${brand.accent}, 0 30px 60px rgba(0,0,0,.6)` }}>
      <Sequence from={a} layout="none"><OffthreadVideo src={staticFile(clipe(useLang(), 'e16'))} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></Sequence>
    </div>
    <div style={{ marginTop: 16, textAlign: 'center', fontFamily: font.ui, fontWeight: 900, fontSize: 40, color: brand.bg, background: brand.accent, borderRadius: 14, padding: '6px 0' }}>{tx('PRONTO ✓', 'LISTO ✓')}</div>
  </div>;
};

const Cta = () => {
  const g = useCurrentFrame(); const { fps } = useVideoConfig();
  const tx = useTx();
  const a = S(7); if (g < a) return null;
  const clips = ['e17', 'e07', 'e12'];
  const click = T.saiba + 6, press = g >= click && g < click + 6 ? 0.93 : 1;
  const kb = pop(g, fps, T.saiba - 4), cx = interpolate(g, [T.saiba - 6, click - 1], [900, 620], clamp), cy = interpolate(g, [T.saiba - 6, click - 1], [1700, 1420], clamp);
  return <AbsoluteFill>
    <div style={{ position: 'absolute', top: 200, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 24 }}>
      {clips.map((c, i) => { const k = pop(g, fps, a + i * 5); return (
        <div key={c} style={{ width: 230, height: 409, borderRadius: 28, overflow: 'hidden', boxShadow: `0 0 0 3px ${brand.accent}, 0 20px 40px rgba(0,0,0,.5)`, transform: `translateY(${(1 - k) * -300}px) rotate(${(i - 1) * 4}deg)` }}>
          <Sequence from={a} layout="none"><OffthreadVideo src={staticFile(clipe(useLang(), c))} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></Sequence>
        </div>); })}
    </div>
    {g >= T.saiba - 4 && <div style={{ position: 'absolute', left: 0, right: 0, top: 1330, display: 'flex', justifyContent: 'center' }}>
      <div style={{ background: brand.accent, color: brand.bg, fontFamily: font.ui, fontWeight: 900, fontSize: 64, padding: '30px 66px', borderRadius: 999, transform: `scale(${kb * press})`, boxShadow: `0 20px 60px ${brand.accent}66` }}>{tx('Saiba mais →', 'Más información →')}</div>
    </div>}
    {g >= T.saiba - 6 && <svg width={100} height={100} viewBox="0 0 24 24" style={{ position: 'absolute', left: cx, top: cy }}><path d="M4 2l16 9-7 2-3 7z" fill="#fff" stroke="#111" strokeWidth={1.3} strokeLinejoin="round" /></svg>}
  </AbsoluteFill>;
};

const Flash = () => { const g = useCurrentFrame(); const o = [Z1, Z2].reduce((m, z) => Math.max(m, g >= z && g < z + 3 ? 0.7 * (1 - (g - z) / 3) : 0), 0); return <AbsoluteFill style={{ background: '#fff', opacity: o }} />; };

const SFX: [number, string, number][] = [
  [Z1, 'impact', 0.55], [Z1, 'flash', 0.3], [Z2, 'impact', 0.55], [Z2, 'flash', 0.3], [Z2 + 4, 'pop', 0.35],
  [S(2), 'whoosh', 0.3], [T.anexa, 'pop', 0.4], [T.erro, 'pop', 0.3], [T.pausa, 'pop', 0.3], [S(4), 'whoosh', 0.25],
  ...Array.from({ length: 13 }, (_, i): [number, string, number] => [T.edita - 6 + i, 'type', 0.25]), [T.edita + 10, 'pop', 0.4],
  [S(5), 'whoosh', 0.3], [T.pausas, 'pop', 0.35], [T.tomada, 'pop', 0.35], [E(5) - 18, 'pop', 0.3], [E(5) - 10, 'pop', 0.3], [E(5) - 2, 'pop', 0.3],
  [T.pronto - 2, 'whoosh', 0.35], [T.pronto + 4, 'shimmer', 0.25], [S(7), 'whoosh', 0.3], [T.saiba + 6, 'click', 0.6],
];

export const F1Ad = ({ fundo = 'original', lang = 'pt' }: { fundo?: Fundo; lang?: Lang }) => (
  <LangCtx.Provider value={lang}><AbsoluteFill style={{ background: '#000' }}>
    <Base fundo={fundo} />
    <PalavraGigante a={Z1} b={S(1)} txt={lang === 'es' ? 'ABOGADO' : 'ADVOGADO'} />
    <PalavraGigante a={Z2} b={E(1)} txt={lang === 'es' ? '1 ARCHIVO' : '1 ARQUIVO'} size={210} />
    <Sequence from={Z2} durationInFrames={E(1) - Z2}><Arquivo at={4} y={260} /></Sequence>
    <JanelaIA a={S(2)} b={E(2)} modo="anexa" />
    <Rabisco at={T.erro} txt={lang === 'es' ? 'error' : 'erro'} x={90} y={250} rot={-8} />
    <Rabisco at={T.pausa} txt="pausa" x={600} y={360} rot={6} />
    <JanelaIA a={S(4)} b={E(4)} modo="pede" />
    <Checklist />
    <Pronto />
    <Cta />
    <Legendas />
    <Flash />
    <Grade />
    {SFX.map(([f, n, v], i) => <Sequence key={i} from={Math.round(f)} durationInFrames={50} layout="none"><Audio src={staticFile(`sfx/${n}.wav`)} volume={v} /></Sequence>)}
    <Audio src={staticFile('music/bed.wav')} volume={(f) => interpolate(f, [0, 6, F1_FRAMES - 15, F1_FRAMES], [0, 0.16, 0.16, 0], clamp)} />
  </AbsoluteFill></LangCtx.Provider>
);
