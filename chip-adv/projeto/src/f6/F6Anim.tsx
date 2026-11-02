import { AbsoluteFill, Audio, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { brand, font } from '../brand';
import { Braco, Cabeca, Olhos, Personagem } from './Personagem';

/** F6 · Tela dividida animada: sem CHIP ADV (cima) × com CHIP ADV (baixo). 24 s. */
export const F6_FRAMES = 720;
const cl = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const L = (f: number, a: number[], b: number[]) => interpolate(f, a, b, cl);
const pop = (f: number, fps: number, d: number) => spring({ frame: f - d, fps, config: { damping: 13, stiffness: 200, mass: 0.6 } });
const TOPO_H = 900, FAIXA_Y = 900, FAIXA_H = 180, BAIXO_Y = 1080, BAIXO_H = 840;
const BATIDAS = [30, 290];
const TROCA = 570; // a metade de cima sai

/* cabeçada: desce, bate, volta */
const batida = (g: number) => {
  for (const b of BATIDAS) {
    const t = g - b;
    if (t >= -8 && t < 18) return { dy: t < 0 ? L(t, [-8, 0], [0, 230]) : L(t, [0, 4, 18], [230, 230, 0]), sq: t >= 0 && t < 4 ? 0.86 : 1, bateu: t >= 0 && t < 10 };
  }
  return { dy: 0, sq: 1, bateu: false };
};
const tremor = (g: number, ats: number[], amp = 16) => {
  let x = 0, y = 0;
  ats.forEach((a) => { const t = g - a; if (t >= 0 && t < 10) { const k = (1 - t / 10) * amp; x += Math.sin(t * 9.1) * k; y += Math.cos(t * 7.3) * k; } });
  return `translate(${x}px, ${y}px)`;
};

/* ---------------- metade de cima: sem CHIP ADV ---------------- */
const Monitor = ({ g }: { g: number }) => {
  const erro = g >= 140 && g < 210, abas = g >= 210 && g < 330, video = g >= 330;
  const nAbas = Math.floor(L(g, [212, 280], [0, 7]));
  return <div style={{ position: 'absolute', left: 640, top: 430, width: 400, height: 260, background: '#0E1320', border: '14px solid #2A2F3A', borderRadius: 16, overflow: 'hidden' }}>
    {!video && [0, 1, 2, 3, 4].map((i) => <div key={i} style={{ position: 'absolute', left: 10 + ((g * (i + 2)) % 60), top: 30 + i * 36, height: 24, width: 140 + ((i * 53) % 120), borderRadius: 5,
      background: ['#5B8CFF', '#FF5A1F', '#C084FC', '#5EEAD4', '#FACC15'][i], opacity: 0.85 }} />)}
    {!video && <div style={{ position: 'absolute', top: 0, bottom: 0, left: 40 + ((g * 3) % 300), width: 3, background: '#fff' }} />}
    {erro && <div style={{ position: 'absolute', inset: '40px 26px', background: '#F4F1EA', borderRadius: 10, border: '4px solid #E5322D', padding: 14, fontFamily: font.ui, color: '#1b1b1f',
      transform: `scale(${L(g, [140, 146], [0.5, 1])})` }}><b style={{ color: '#E5322D', fontSize: 26 }}>⚠ Erro</b><div style={{ fontSize: 22, fontWeight: 700, marginTop: 6 }}>Renderização falhou (87%)</div></div>}
    {abas && Array.from({ length: nAbas }).map((_, i) => <div key={i} style={{ position: 'absolute', left: 16 + i * 26, top: 16 + i * 22, width: 230, height: 130, background: '#F4F1EA', borderRadius: 8, border: '2px solid #888',
      fontFamily: font.ui, fontSize: 15, fontWeight: 700, color: '#333', padding: 8, boxShadow: '0 6px 14px rgba(0,0,0,.4)' }}>{['Tutorial: legenda animada', 'Como cortar pausas', 'Plugin pago ✕', 'Atalhos de edição', 'Exportar sem travar', 'Fonte bonita grátis', 'Por que travou?'][i]}</div>)}
    {video && <div style={{ position: 'absolute', inset: 0, background: '#555', display: 'grid', placeItems: 'center' }}>
      <span style={{ fontFamily: font.ui, fontWeight: 900, fontSize: 30, color: '#fff', background: '#000', padding: '2px 8px', transform: 'rotate(-7deg) translate(30px, 60px)' }}>legenda tort a</span></div>}
  </div>;
};

const Topo = () => {
  const g = useCurrentFrame(); const { fps } = useVideoConfig();
  const bt = batida(g), manha = L(g, [330, 380], [0, 1]);
  const braco: Braco = g < 90 ? 'mesa' : g < 150 ? 'mouse' : g < 210 ? 'cabeca' : 'mesa';
  const olhos: Olhos = bt.bateu ? 'fechado' : g >= 450 ? 'surpreso' : 'cansado';
  const sai = L(g, [TROCA, TROCA + 30], [0, 1]);
  return <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: TOPO_H, overflow: 'hidden', transform: `translateY(${-sai * TOPO_H}px)` }}>
    <div style={{ position: 'absolute', inset: 0, transform: tremor(g, [...BATIDAS, 140]) }}>
      <div style={{ position: 'absolute', inset: -30, background: `linear-gradient(180deg, ${manha > .5 ? '#3a3046' : '#141B2B'}, #1E2638)` }} />
      {/* janela: noite → amanhecer */}
      <div style={{ position: 'absolute', left: 760, top: 110, width: 250, height: 280, borderRadius: 8, border: '14px solid #2A2F3A', overflow: 'hidden',
        background: `linear-gradient(180deg, rgb(${L(manha, [0, 1], [10, 255])},${L(manha, [0, 1], [20, 150])},${L(manha, [0, 1], [50, 90])}), rgb(${L(manha, [0, 1], [25, 255])},${L(manha, [0, 1], [35, 210])},${L(manha, [0, 1], [70, 150])}))` }}>
        <div style={{ position: 'absolute', left: 150, top: L(manha, [0, 1], [40, 150]), width: 60, height: 60, borderRadius: 30, background: manha > .5 ? '#FFD27A' : '#E9EEF7' }} />
      </div>
      {/* relógio digital */}
      <div style={{ position: 'absolute', left: 30, top: 618, zIndex: 3, fontFamily: font.ui, fontWeight: 900, fontSize: 52, color: '#FF4A3D', background: '#0A0A0A', padding: '6px 18px', borderRadius: 12, letterSpacing: 2, boxShadow: '0 0 30px rgba(255,74,61,.35)' }}>{g < 330 ? '23:47' : '06:12'}</div>
      {/* luz do monitor */}
      <div style={{ position: 'absolute', left: 300, top: 300, width: 700, height: 600, background: 'radial-gradient(closest-side, rgba(110,150,255,.22), transparent)' }} />
      <div style={{ position: 'absolute', left: 60, top: 230, width: 600, height: 600 }}>
        <Personagem olhos={olhos} boca={g >= 450 ? 'o' : 'triste'} baguncado={g >= 150} gravataSolta braco={braco} headDY={bt.dy} squash={bt.sq} headRot={g >= 330 && g < 450 ? -6 : 0} piscar={g % 70 < 3} />
      </div>
      {/* mesa + teclado */}
      <div style={{ position: 'absolute', left: 0, top: 700, width: 1080, height: 200, background: 'linear-gradient(#5B3A26, #3B2618)' }} />
      <div style={{ position: 'absolute', left: 230, top: 712, width: 280, height: 30, background: '#2A2F3A', borderRadius: 6 }} />
      <Monitor g={g} />
      <div style={{ position: 'absolute', left: 820, top: 690, width: 40, height: 20, background: '#2A2F3A' }} />
      {/* TUM */}
      {BATIDAS.map((b) => g >= b && g < b + 16 && <div key={b} style={{ position: 'absolute', left: 120, top: 520, fontFamily: font.display, fontSize: 130, color: '#FFD60A', WebkitTextStroke: '6px #111',
        transform: `scale(${pop(g, fps, b) * 1.1}) rotate(-10deg)`, opacity: L(g, [b + 10, b + 16], [1, 0]) }}>TUM!</div>)}
    </div>
    <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: sai * 0.6 }} />
    <Etiqueta texto="SEM CHIP ADV" cor="#FF4A3D" emoji="😩" y={230} />
  </div>;
};

/* ---------------- metade de baixo: com CHIP ADV ---------------- */
const Fone = ({ g }: { g: number }) => {
  const { fps } = useVideoConfig();
  const txt = 'edita pra mim', n = Math.floor(L(g, [140, 172], [0, txt.length]));
  const prog = L(g, [220, 320], [0, 100]);
  const bolha = (cor: string, fg: string, lado: 'e' | 'd', at: number, children: React.ReactNode) => g >= at &&
    <div style={{ alignSelf: lado === 'd' ? 'flex-end' : 'flex-start', background: cor, color: fg, borderRadius: 22, padding: '12px 18px', fontWeight: 800, fontSize: 28, maxWidth: '86%', transform: `scale(${pop(g, fps, at)})`, transformOrigin: lado === 'd' ? '100% 50%' : '0 50%' }}>{children}</div>;
  return <div style={{ position: 'absolute', left: 620, top: 60, width: 410, height: 700, borderRadius: 50, background: '#111', padding: 14, boxShadow: '0 30px 60px rgba(80,40,0,.35)' }}>
    <div style={{ width: '100%', height: '100%', borderRadius: 38, background: '#F5F2EA', padding: '28px 18px 18px', display: 'flex', flexDirection: 'column', gap: 12, fontFamily: font.ui, color: '#1b1b1f', overflow: 'hidden' }}>
      <div style={{ fontWeight: 800, fontSize: 22, color: '#777' }}>✦ Sua IA</div>
      {bolha('#1b1b1f', '#fff', 'd', 110, <span><span style={{ background: '#E8643C', borderRadius: 6, padding: '2px 6px', fontSize: 16, marginRight: 8 }}>.MD</span>CHIP_ADV.md</span>)}
      {bolha('#1b1b1f', brand.accent, 'd', 180, 'edita pra mim')}
      {g >= 215 && g < 340 && <div style={{ background: '#fff', border: '2px solid #e3ddd0', borderRadius: 18, padding: 14, fontWeight: 800, fontSize: 24 }}>Editando… {Math.round(prog)}%
        <div style={{ marginTop: 8, height: 12, borderRadius: 6, background: '#e8e2d4' }}><div style={{ height: 12, borderRadius: 6, width: `${prog}%`, background: '#2f7d16' }} /></div></div>}
      {g >= 340 && <div style={{ background: '#fff', border: '2px solid #e3ddd0', borderRadius: 18, padding: 10, transform: `scale(${pop(g, fps, 340)})` }}>
        <b style={{ fontSize: 24, color: '#2f7d16' }}>Seu vídeo está pronto ✓</b>
        <div style={{ marginTop: 8, height: 250, borderRadius: 14, overflow: 'hidden', background: '#000' }}>
          <Sequence from={340} layout="none"><OffthreadVideo src={staticFile('ads/clipes/e05.mp4')} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></Sequence>
        </div></div>}
      {bolha('#1b1b1f', '#fff', 'd', 488, 'deixa a legenda maior')}
      {bolha('#fff', '#2f7d16', 'e', 520, 'Feito ✓')}
      <div style={{ marginTop: 'auto', background: '#fff', border: '2px solid #e3ddd0', borderRadius: 18, padding: '10px 14px', fontSize: 22, fontWeight: 600, color: n > 0 && g < 180 ? '#1b1b1f' : '#aaa' }}>{n > 0 && g < 180 ? txt.slice(0, n) : 'Escreva…'}</div>
    </div>
  </div>;
};

const Baixo = () => {
  const g = useCurrentFrame();
  const braco: Braco = g < 90 ? 'cafe' : g < 210 ? 'celular' : g < 330 ? 'nuca' : g < 380 ? 'celular' : g < 450 ? 'joinha' : g < 470 ? 'celular' : g < 530 ? 'ombro' : 'celular';
  const olhos: Olhos = g >= 210 && g < 330 ? 'fechado' : braco === 'cafe' || braco === 'joinha' ? 'feliz' : 'normal';
  const sobe = L(g, [TROCA, TROCA + 30], [0, 1]);
  const gole = braco === 'cafe' ? Math.sin(g / 10) * 8 : 0;
  return <div style={{ position: 'absolute', left: 0, top: BAIXO_Y - sobe * 720, width: 1080, height: BAIXO_H, overflow: 'hidden' }}>
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #F6E3C4, #EBCB9C)' }} />
    <div style={{ position: 'absolute', left: 40, top: 60, width: 200, height: 230, borderRadius: 8, border: '14px solid #C9A47A', background: 'linear-gradient(#9fd3ff, #d8efff)' }}>
      <div style={{ position: 'absolute', left: 110, top: 30, width: 60, height: 60, borderRadius: 30, background: '#FFD27A', boxShadow: '0 0 40px #FFD27A' }} />
    </div>
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 840, background: 'radial-gradient(60% 50% at 20% 20%, rgba(255,220,150,.45), transparent)' }} />
    {/* planta */}
    {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{ position: 'absolute', left: 520 + Math.cos(i) * 40, top: 460 + Math.sin(i * 2) * 50, width: 120, height: 44, borderRadius: '50%', background: '#4E7A3A', transform: `rotate(${i * 60 + Math.sin(g / 20 + i) * 4}deg)` }} />)}
    <div style={{ position: 'absolute', left: 0, top: 160, width: 600, height: 600, transform: `translateY(${gole}px)` }}>
      <Personagem olhos={olhos} boca="sorriso" baguncado={false} gravataSolta={false} braco={braco} headRot={braco === 'ombro' ? 6 : braco === 'nuca' ? -4 : 0} piscar={g % 80 < 3} />
    </div>
    <div style={{ position: 'absolute', left: 0, top: 690, width: 1080, height: 160, background: 'linear-gradient(#B98A5E, #9C7048)' }} />
    <Fone g={g} />
    <Etiqueta texto="COM CHIP ADV" cor={brand.accent} emoji="😌" y={24} escuro />
  </div>;
};

const Etiqueta = ({ texto, cor, emoji, y, escuro = false }: { texto: string; cor: string; emoji: string; y: number; escuro?: boolean }) =>
  <div style={{ position: 'absolute', left: 30, top: y, background: escuro ? '#0B0B0F' : 'rgba(0,0,0,.55)', color: cor, fontFamily: font.ui, fontWeight: 900, fontSize: 38, letterSpacing: 2, padding: '10px 20px', borderRadius: 14 }}>{texto} {emoji}</div>;

/* ---------------- faixa do meio + espiada + CTA ---------------- */
const CENAS: [number, number, string, string][] = [
  [0, 90, 'QUAL DOS DOIS É VOCÊ?', 'Advogado, qual dos dois é você?'],
  [90, 210, '3 HORAS × 1 FRASE', 'Um passa a noite cortando pausa, legenda e efeito na mão…'],
  [210, 330, 'ELA EDITA. VOCÊ ADVOGA.', '…o outro escreve uma frase e vai cuidar do escritório.'],
  [330, 450, 'PRONTO EM MINUTOS', 'Volta pronto: cortado, legendado, com efeito e trilha.'],
  [450, 570, '"DEIXA A LEGENDA MAIOR" → FEITO ✓', 'E se não gostar? Pede o ajuste em português.'],
];
const Faixa = () => {
  const g = useCurrentFrame(); const { fps } = useVideoConfig();
  const c = CENAS.find(([a, b]) => g >= a && g < b); if (!c) return null;
  const k = pop(g, fps, c[0]);
  return <div style={{ position: 'absolute', left: 0, top: FAIXA_Y, width: 1080, height: FAIXA_H, background: '#0B0B0F', borderBlock: `4px solid ${brand.accent}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8, padding: '0 40px 0 200px', textAlign: 'center', fontFamily: font.ui }}>
    <div style={{ fontWeight: 900, fontSize: c[2].length > 24 ? 48 : 60, color: brand.accent, letterSpacing: -1, transform: `scale(${0.8 + 0.2 * k})`, opacity: k }}>{c[2]}</div>
    <div style={{ fontWeight: 600, fontSize: 28, color: '#E9E7E1', opacity: L(g, [c[0] + 6, c[0] + 14], [0, 1]) }}>{c[3]}</div>
  </div>;
};

const Espiada = () => {
  const g = useCurrentFrame();
  if (g < 455 || g >= TROCA) return null;
  const y = L(g, [455, 480, 545, TROCA], [700, 860, 860, 700]);
  return <div style={{ position: 'absolute', left: 10, top: y, width: 210, height: 210, zIndex: 5 }}>
    <svg viewBox="180 80 240 280" width="100%" height="100%"><Cabeca olhos="surpreso" boca="o" baguncado /></svg>
    <div style={{ position: 'absolute', left: 170, top: 10, fontFamily: font.display, fontSize: 70, color: '#FFD60A', WebkitTextStroke: '4px #111' }}>?!</div>
  </div>;
};

const Cta = () => {
  const g = useCurrentFrame(); const { fps } = useVideoConfig();
  if (g < TROCA + 20) return null;
  const a = TROCA + 20, click = 660, press = g >= click && g < click + 6 ? 0.93 : 1;
  const cx = L(g, [630, click - 1], [960, 640]), cy = L(g, [630, click - 1], [1700, 1440]);
  return <AbsoluteFill style={{ fontFamily: font.ui, textAlign: 'center' }}>
    <div style={{ position: 'absolute', top: 150, left: 0, right: 0, opacity: pop(g, fps, a) }}>
      <div style={{ fontWeight: 900, fontSize: 64, color: brand.ink }}>CHIP <span style={{ color: brand.accent }}>ADV</span></div>
      <div style={{ fontWeight: 900, fontSize: 92, color: brand.ink, letterSpacing: -3, marginTop: 6 }}>Seja o de <span style={{ fontFamily: font.serif, fontStyle: 'italic', fontWeight: 400, color: brand.accent }}>baixo</span>.</div>
    </div>
    <div style={{ position: 'absolute', top: 1300, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
      <div style={{ background: brand.accent, color: brand.bg, fontWeight: 900, fontSize: 64, padding: '30px 66px', borderRadius: 999, transform: `scale(${pop(g, fps, a + 10) * press})`, boxShadow: `0 20px 60px ${brand.accent}66` }}>Saiba mais →</div>
      <div style={{ fontWeight: 600, fontSize: 34, color: '#9C9CA6', opacity: pop(g, fps, a + 18) }}>Ela edita. Você advoga.</div>
    </div>
    {g >= 630 && <svg width={100} height={100} viewBox="0 0 24 24" style={{ position: 'absolute', left: cx, top: cy }}><path d="M4 2l16 9-7 2-3 7z" fill="#fff" stroke="#111" strokeWidth={1.3} strokeLinejoin="round" /></svg>}
  </AbsoluteFill>;
};

const SFX: [number, string, number][] = [
  [30, 'impact', 0.7], [290, 'impact', 0.7], [140, 'erro', 0.35], [110, 'pop', 0.4], [180, 'pop', 0.4],
  ...Array.from({ length: 12 }, (_, i): [number, string, number] => [140 + i * 3, 'type', 0.2]),
  ...Array.from({ length: 7 }, (_, i): [number, string, number] => [212 + i * 10, 'click', 0.25]),
  [340, 'ding', 0.45], [488, 'pop', 0.35], [520, 'ding', 0.35], [460, 'whoosh', 0.3], [TROCA, 'whoosh', 0.45], [TROCA + 30, 'shimmer', 0.3], [660, 'click', 0.6],
  ...[0, 90, 210, 330, 450].map((f): [number, string, number] => [f + 2, 'pop', 0.2]),
];

export const F6Anim = () => {
  const g = useCurrentFrame();
  return <AbsoluteFill style={{ background: '#0B0B0F' }}>
    <Topo />
    <Baixo />
    <Faixa />
    <Espiada />
    <Cta />
    {SFX.map(([f, n, v], i) => <Sequence key={i} from={f} durationInFrames={60} layout="none"><Audio src={staticFile(`sfx/${n}.wav`)} volume={v} /></Sequence>)}
    {Array.from({ length: 19 }, (_, i) => <Sequence key={'t' + i} from={i * 30} durationInFrames={10} layout="none"><Audio src={staticFile('sfx/tick.wav')} volume={0.12} /></Sequence>)}
    <Audio src={staticFile('music/bed.wav')} volume={(f) => L(f, [0, 10, F6_FRAMES - 20, F6_FRAMES], [0, 0.2, 0.2, 0])} />
    {g < 0 && null}
  </AbsoluteFill>;
};
