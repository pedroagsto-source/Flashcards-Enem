import { AbsoluteFill, Audio, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { brand, font } from './brand';

export type HookId = 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
export const BODY_FRAMES = 765; // cut30.mp4 (25,5 s)
export const COLD = 24; // coldopen.mp4 (0,8 s)

const pop = (f: number, fps: number, d = 0) => spring({ frame: f - d, fps, config: { damping: 13, stiffness: 200, mass: 0.6 } });
const outAt = (f: number, a: number, len = 6) => interpolate(f, [a, a + len], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/** H2 · caixa de pergunta no estilo dos stories */
const Pergunta = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const k = pop(f, fps); const o = outAt(f, 78);
  return (
    <AbsoluteFill style={{ alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 250, width: 760, borderRadius: 34, overflow: 'hidden', background: '#fff', opacity: o,
        transform: `scale(${0.6 + 0.4 * k}) rotate(${(1 - k) * -6}deg)`, boxShadow: '0 30px 60px rgba(0,0,0,.35)' }}>
        <div style={{ background: 'linear-gradient(90deg,#7C3AED,#EC4899,#F97316)', color: '#fff', textAlign: 'center', padding: '16px 0',
          fontFamily: font.ui, fontWeight: 800, fontSize: 32 }}>Faça uma pergunta</div>
        <div style={{ padding: '30px 40px 36px', textAlign: 'center', fontFamily: font.ui, fontWeight: 800, fontSize: 52, lineHeight: 1.15, color: '#111' }}>
          É verdade que a IA já edita vídeo de advogado?
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** H3 · ordem direta, palavra por palavra */
const Ordem = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const lines = [['ADVOGADO,'], ['PARA', 'DE', 'EDITAR'], ['VÍDEO', 'NA', 'MÃO.']];
  let n = 0;
  const o = outAt(f, 84);
  return (
    <AbsoluteFill style={{ alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 240, width: 960, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, opacity: o }}>
        {lines.map((ln, li) => <div key={li} style={{ display: 'flex', gap: 18 }}>{ln.map((w) => {
          const i = n++;
          const k = pop(f, fps, i * 3);
          const hot = w.startsWith('MÃO') || w.startsWith('EDITAR');
          return (
            <span key={i} style={{ fontFamily: font.display, fontSize: 104, lineHeight: 1.05, color: hot ? brand.bg : '#fff',
              background: hot ? brand.accent : 'rgba(11,11,15,.82)', padding: '0 18px', borderRadius: 12, opacity: k,
              transform: `translateY(${(1 - k) * 40}px) scale(${0.8 + 0.2 * k})` }}>{w}</span>
          );
        })}</div>)}
      </div>
    </AbsoluteFill>
  );
};

/** H4 · selo de prova */
const Prova = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const k = pop(f, fps); const k2 = pop(f, fps, 8); const o = outAt(f, 90);
  return (
    <AbsoluteFill style={{ alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 250, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: o }}>
        <div style={{ fontFamily: font.display, fontSize: 120, color: brand.bg, background: brand.accent, padding: '4px 34px', borderRadius: 16,
          transform: `rotate(-4deg) scale(${k})`, boxShadow: `0 0 60px ${brand.accent}88` }}>EDITADO POR IA ↓</div>
        <div style={{ fontFamily: font.ui, fontWeight: 800, fontSize: 40, color: '#fff', background: 'rgba(11,11,15,.82)', padding: '12px 28px',
          borderRadius: 40, transform: `scale(${k2})` }}>sem editor · sem CapCut · 1 arquivo</div>
      </div>
    </AbsoluteFill>
  );
};

/** H5 · cold open: resultado primeiro, depois o começo */
const ColdLabel = ({ text }: { text: string }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const k = pop(f, fps);
  return (
    <AbsoluteFill style={{ alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 250, fontFamily: font.display, fontSize: 92, color: brand.bg, background: brand.accent,
        padding: '4px 30px', borderRadius: 14, transform: `scale(${k})` }}>{text}</div>
    </AbsoluteFill>
  );
};

export const AdVariant = ({ hook, body }: { hook: HookId; body: string }) => {
  const pre = hook === 'h5' ? COLD : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {pre > 0 && (
        <Sequence durationInFrames={pre}>
          <OffthreadVideo src={staticFile('ads/coldopen.mp4')} />
          <ColdLabel text="RESULTADO ↓" />
        </Sequence>
      )}
      <Sequence from={pre}>
        <OffthreadVideo src={staticFile(`ads/${body}.mp4`)} />
      </Sequence>
      <Sequence from={pre} durationInFrames={110}>
        {hook === 'h2' && <><Pergunta /><Audio src={staticFile('sfx/pop.wav')} volume={0.4} /></>}
        {hook === 'h3' && <><Ordem /><Audio src={staticFile('sfx/whoosh.wav')} volume={0.3} /></>}
        {hook === 'h4' && <><Prova /><Audio src={staticFile('sfx/impact.wav')} volume={0.35} /></>}
        {hook === 'h5' && <Sequence durationInFrames={45}><ColdLabel text="COMO FIZ ISSO ↓" /></Sequence>}
      </Sequence>
    </AbsoluteFill>
  );
};
