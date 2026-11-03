import { AbsoluteFill, Audio, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { brand, font } from './brand';
import { clipe, Lang, LangCtx, useLang, useTx } from './lang';

/** F5 · Motion sem rosto: pergunta → "edita pra mim" → montagem de efeitos → números → CTA. 630 frames (21 s). */
export const MOTION_FRAMES = 630;
export const MOTION_FRAMES_ES = 725;
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const pop = (f: number, fps: number, d = 0) => spring({ frame: f - d, fps, config: { damping: 13, stiffness: 210, mass: 0.6 } });

const Pergunta = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const es = useLang() === 'es';
  const w = es ? ['¿cuánto', 'tiempo', 'pierdes', 'editando', 'Reels?'] : ['quanto', 'tempo', 'você', 'perde', 'editando', 'Reels?'];
  return (
    <AbsoluteFill style={{ justifyContent: 'center', padding: '0 90px' }}>
      <div style={{ fontFamily: font.ui, fontWeight: 900, fontSize: 150, color: brand.ink, letterSpacing: -5, transform: `scale(${pop(f, fps)})`, transformOrigin: '0 50%' }}>{es ? 'Abogado,' : 'Advogado,'}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 26px', marginTop: 10 }}>
        {w.map((x, i) => {
          const k = pop(f, fps, 12 + i * 5);
          const hot = x === 'editando';
          return <span key={i} style={{ fontFamily: hot ? font.serif : font.ui, fontStyle: hot ? 'italic' : 'normal', fontWeight: hot ? 400 : 900,
            fontSize: hot ? 140 : 118, lineHeight: 1.1, letterSpacing: hot ? 0 : -4, color: hot ? brand.accent : brand.ink, opacity: k, transform: `translateY(${(1 - k) * 50}px)` }}>{x}</span>;
        })}
      </div>
    </AbsoluteFill>
  );
};

const Chat = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const tx = useTx();
  const txt = tx('edita pra mim', 'edítalo por mí'); const n = Math.floor(interpolate(f, [26, 26 + txt.length * 2.2], [0, txt.length], clamp));
  const enviado = f >= 62; const env = pop(f, fps, 62); const arq = pop(f, fps, 4); const pensa = f >= 78;
  return (
    <AbsoluteFill style={{ background: '#F5F2EA', padding: '300px 80px', fontFamily: font.ui }}>
      <div style={{ fontWeight: 800, fontSize: 40, color: '#777', marginBottom: 40 }}>{tx('✦ Sua IA', '✦ Tu IA')}</div>
      <div style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: 22, background: '#1b1b1f', color: '#fff', borderRadius: 34, padding: '26px 34px', transform: `scale(${arq})`, transformOrigin: '100% 50%' }}>
        <span style={{ background: '#E8643C', borderRadius: 12, padding: '14px 12px', fontWeight: 900, fontSize: 24 }}>.MD</span>
        <span style={{ fontWeight: 800, fontSize: 46 }}>{tx('CHIP_ADV.md', 'CHIP_ABOGADO.md')}</span>
      </div>
      {enviado && <div style={{ alignSelf: 'flex-end', marginTop: 24, background: '#1b1b1f', color: brand.accent, borderRadius: 34, padding: '26px 40px', fontWeight: 900, fontSize: 72, transform: `scale(${env})`, transformOrigin: '100% 50%' }}>{txt}</div>}
      {pensa && <div style={{ marginTop: 30, alignSelf: 'flex-start', background: '#fff', border: '2px solid #e3ddd0', borderRadius: 34, padding: '28px 40px', display: 'flex', gap: 14 }}>
        {[0, 1, 2].map((i) => <i key={i} style={{ width: 22, height: 22, borderRadius: 11, background: '#999', opacity: 0.35 + 0.65 * Math.abs(Math.sin((f + i * 6) / 6)) }} />)}
      </div>}
      <div style={{ position: 'absolute', left: 80, right: 80, bottom: 300, background: '#fff', border: '2px solid #e3ddd0', borderRadius: 40, padding: '30px 36px', fontSize: 48, fontWeight: 600, color: enviado ? '#aaa' : '#1b1b1f', display: 'flex', justifyContent: 'space-between' }}>
        <span>{enviado ? tx('Escreva…', 'Escribe…') : txt.slice(0, n) + (f % 16 < 8 && n < txt.length ? '|' : '')}</span>
        <span style={{ width: 64, height: 64, borderRadius: 32, background: '#1b1b1f', color: brand.accent, display: 'grid', placeItems: 'center', fontWeight: 900 }}>↑</span>
      </div>
    </AbsoluteFill>
  );
};

const CLIPES: [string, string, string][] = [['e05', 'Zoom de impacto', 'Zoom de impacto'], ['e17', 'Palavra de vidro', 'Palabra de vidrio'], ['e07', 'Checklist', 'Checklist'], ['e16', 'Capa de revista', 'Portada de revista'], ['e11', 'Bastidor do editor', 'Detrás de cámaras'], ['e12', 'Recorte + botão', 'Recorte + botón']];
const SEG = 36;
const Montagem = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const es = useLang() === 'es';
  const i = Math.min(CLIPES.length - 1, Math.floor(f / SEG)); const lf = f - i * SEG; const k = pop(lf, fps);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', top: 170, fontFamily: font.ui, fontWeight: 800, fontSize: 40, letterSpacing: 4, color: brand.muted }}>{es ? 'VOLVIÓ ASÍ ↓' : 'VOLTOU ASSIM ↓'}</div>
      {CLIPES.map(([c], j) => (
        <Sequence key={c} from={j * SEG} durationInFrames={SEG}>
          <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 720, height: 1280, borderRadius: 60, overflow: 'hidden', boxShadow: `0 0 0 4px ${brand.accent}, 0 40px 100px rgba(0,0,0,.6)`, transform: `scale(${0.92 + 0.08 * k}) rotate(${(j % 2 ? 1 : -1) * (1 - k) * 4}deg)` }}>
              <OffthreadVideo src={staticFile(clipe(useLang(), c))} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </AbsoluteFill>
          <Audio src={staticFile('sfx/whoosh.wav')} volume={0.25} />
        </Sequence>
      ))}
      <div style={{ position: 'absolute', bottom: 190, fontFamily: font.ui, fontWeight: 900, fontSize: 64, color: brand.bg, background: brand.accent, padding: '10px 30px', borderRadius: 18, transform: `scale(${k})` }}>{CLIPES[i][es ? 2 : 1]}</div>
    </AbsoluteFill>
  );
};

const Numeros = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const tx = useTx();
  const risca = interpolate(f, [24, 36], [0, 100], clamp); const k2 = pop(f, fps, 40); const k3 = pop(f, fps, 62);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', fontFamily: font.ui }}>
      <div style={{ position: 'relative', fontWeight: 900, fontSize: 230, color: brand.muted, letterSpacing: -8, opacity: pop(f, fps) }}>0:52
        <i style={{ position: 'absolute', left: 0, top: '52%', height: 18, width: `${risca}%`, background: brand.accent2, borderRadius: 9 }} /></div>
      <div style={{ fontWeight: 900, fontSize: 330, color: brand.accent, letterSpacing: -12, lineHeight: 1, transform: `scale(${k2})` }}>0:41</div>
      <div style={{ marginTop: 40, fontWeight: 800, fontSize: 48, color: brand.ink, textAlign: 'center', lineHeight: 1.4, opacity: k3 }}>{tx('2 gravações · 20 pausas cortadas', '2 grabaciones · 20 pausas cortadas')}<br />{tx('legenda · 7 efeitos · trilha', 'subtítulos · 7 efectos · música')}</div>
    </AbsoluteFill>
  );
};

const Cta = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const tx = useTx();
  const click = 62; const press = f >= click && f < click + 6 ? 0.93 : 1;
  const cx = interpolate(f, [30, click - 2], [940, 640], clamp), cy = interpolate(f, [30, click - 2], [1650, 1290], clamp);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', fontFamily: font.ui, textAlign: 'center' }}>
      <div style={{ fontWeight: 900, fontSize: 96, letterSpacing: 2, transform: `scale(${pop(f, fps)})` }}>CHIP <span style={{ color: brand.accent }}>{tx('ADV', 'ABOGADO')}</span></div>
      <div style={{ marginTop: 30, fontWeight: 900, fontSize: 104, lineHeight: 1.05, letterSpacing: -3, opacity: pop(f, fps, 8) }}>{tx('Você fala.', 'Tú hablas.')}<br />{tx('O CHIP ADV ', 'El CHIP ')}<span style={{ fontFamily: font.serif, fontStyle: 'italic', fontWeight: 400, color: brand.accent }}>edita.</span></div>
      <div style={{ marginTop: 80, background: brand.accent, color: brand.bg, fontWeight: 900, fontSize: 64, padding: '34px 70px', borderRadius: 999, transform: `scale(${pop(f, fps, 18) * press})`, boxShadow: `0 20px 60px ${brand.accent}55` }}>{tx('Saiba mais →', 'Más información →')}</div>
      <div style={{ marginTop: 30, fontWeight: 600, fontSize: 38, color: brand.muted, opacity: pop(f, fps, 26) }}>{tx('Garantia de 7 dias', 'Garantía de 7 días')}</div>
      {f >= 30 && <svg width={110} height={110} viewBox="0 0 24 24" style={{ position: 'absolute', left: cx, top: cy }}><path d="M4 2l16 9-7 2-3 7z" fill="#fff" stroke="#111" strokeWidth={1.3} strokeLinejoin="round" /></svg>}
      <Sequence from={click} durationInFrames={20}><Audio src={staticFile('sfx/click.wav')} volume={0.6} /></Sequence>
    </AbsoluteFill>
  );
};

/* início de cada cena: pergunta, chat, montagem, números, CTA, fim */
const CENAS: Record<Lang, number[]> = { pt: [0, 78, 186, 402, 516, 630], es: [0, 105, 213, 429, 590, 725] };
export const MotionAd = ({ lang = 'pt' }: { lang?: Lang }) => {
  const c = CENAS[lang], N = c[5], es = lang === 'es';
  return <LangCtx.Provider value={lang}>
  <AbsoluteFill style={{ background: brand.bg, color: brand.ink }}>
    <Sequence durationInFrames={c[1]}><Pergunta /><Audio src={staticFile('sfx/impact.wav')} volume={0.45} /></Sequence>
    <Sequence from={c[1]} durationInFrames={c[2] - c[1]}><Chat /><Sequence from={62}><Audio src={staticFile('sfx/pop.wav')} volume={0.45} /></Sequence></Sequence>
    <Sequence from={c[2]} durationInFrames={c[3] - c[2]}><Montagem /></Sequence>
    <Sequence from={c[3]} durationInFrames={c[4] - c[3]}><Numeros /><Sequence from={40}><Audio src={staticFile('sfx/impact.wav')} volume={0.4} /></Sequence></Sequence>
    <Sequence from={c[4]} durationInFrames={N - c[4]}><Cta /><Audio src={staticFile('sfx/shimmer.wav')} volume={0.3} /></Sequence>
    {es && [0, 1, 2, 3, 4].map((i) => <Sequence key={i} from={c[i] + (i === 0 ? 2 : 3)} layout="none"><Audio src={staticFile(`es/f5_l${i + 1}.wav`)} volume={1} /></Sequence>)}
    <Audio src={staticFile('music/bed.wav')} volume={(f) => interpolate(f, [0, 10, N - 20, N], [0, es ? 0.16 : 0.42, es ? 0.16 : 0.42, 0], clamp)} />
  </AbsoluteFill></LangCtx.Provider>;
};
