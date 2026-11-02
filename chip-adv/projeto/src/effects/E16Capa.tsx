import { AbsoluteFill, Img, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ease, font } from '../brand';
import { cutoutSrc, flash, lerp } from '../lib';
import { GRADE } from '../camera';

const RED = '#D7262E';

/** 16 · Capa de revista — fundo creme, nome da revista atrás da cabeça, chamadas, faixa, código de barras e brilho. */
export const E16Capa = ({ g0 }: { g0: number }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames: D } = useVideoConfig();
  const g = g0 + f;
  const mast = spring({ frame: f - 2, fps, config: { damping: 15, stiffness: 120, mass: 0.8 } });
  const side = (d: number) => spring({ frame: f - d, fps, config: { damping: 14, stiffness: 170 } });
  const gloss = lerp(f, [26, 62], [-0.3, 1.3], ease.inOut);
  const out = lerp(f, [D - 4, D], [1, 0]);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <AbsoluteFill style={{ background: 'radial-gradient(90% 70% at 50% 40%, #FBF6EA 0%, #EDE3CF 60%, #D9CCB2 100%)' }} />
      {/* nome da revista (atrás da cabeça) */}
      <div style={{ position: 'absolute', top: 250, left: 0, right: 0, textAlign: 'center', fontFamily: font.mag, fontWeight: 900,
        fontSize: 238, lineHeight: 1, letterSpacing: -6, color: RED, transform: `translateY(${(1 - mast) * -120}px)`, opacity: mast }}>
        CHIP<span style={{ fontStyle: 'italic', color: '#151515' }}>adv</span>
      </div>
      <div style={{ position: 'absolute', top: 225, left: 70, fontFamily: font.ui, fontWeight: 800, fontSize: 22, letterSpacing: 4, color: '#151515' }}>
        EDIÇÃO Nº 01 · NOV 2026
      </div>
      {/* pessoa na frente */}
      <Img src={cutoutSrc(g)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', filter: `${GRADE} drop-shadow(0 24px 30px rgba(60,40,20,.35))` }} />
      {/* chamadas laterais */}
      <div style={{ position: 'absolute', right: 50, top: 600, width: 250, textAlign: 'right', transform: `translateX(${(1 - side(8)) * 380}px)` }}>
        <div style={{ fontFamily: font.mag, fontWeight: 900, fontSize: 58, lineHeight: 0.95, color: '#151515' }}>Tudo num único chip</div>
        <div style={{ fontFamily: font.ui, fontWeight: 600, fontSize: 24, color: '#333', marginTop: 10 }}>o método que edita seus vídeos por você</div>
      </div>
      <div style={{ position: 'absolute', right: 50, top: 900, width: 250, textAlign: 'right', transform: `translateX(${(1 - side(14)) * 380}px)` }}>
        <div style={{ fontFamily: font.mag, fontWeight: 900, fontStyle: 'italic', fontSize: 56, lineHeight: 0.95, color: RED }}>17 efeitos premium</div>
        <div style={{ fontFamily: font.ui, fontWeight: 600, fontSize: 24, color: '#333', marginTop: 8 }}>sem saber editar</div>
      </div>
      {/* faixa ESPECIAL */}
      <div style={{ position: 'absolute', left: -60, top: 1290, width: 620, padding: '14px 0', background: RED, color: '#fff', textAlign: 'center',
        fontFamily: font.display, fontSize: 52, letterSpacing: 6, transform: `rotate(-8deg) translateX(${(1 - side(20)) * -700}px)`,
        boxShadow: '0 12px 30px rgba(0,0,0,.3)' }}>ESPECIAL ADVOGADOS</div>
      {/* código de barras */}
      <div style={{ position: 'absolute', right: 70, top: 1370, background: '#fff', padding: '12px 14px 6px', opacity: side(24) }}>
        <div style={{ display: 'flex', gap: 3, height: 90 }}>
          {Array.from({ length: 34 }).map((_, i) => <div key={i} style={{ width: [2, 4, 3, 2, 5][i % 5], background: '#111' }} />)}
        </div>
        <div style={{ fontFamily: font.ui, fontSize: 16, letterSpacing: 3, textAlign: 'center', marginTop: 4 }}>7 891 0 2026 01</div>
      </div>
      {/* brilho de papel */}
      <AbsoluteFill style={{ background: `linear-gradient(120deg, transparent ${gloss * 100 - 10}%, rgba(255,255,255,.55) ${gloss * 100}%, transparent ${gloss * 100 + 10}%)`, mixBlendMode: 'soft-light' }} />
      <AbsoluteFill style={{ backgroundColor: '#fff', opacity: flash(f, 0, 4) }} />
    </AbsoluteFill>
  );
};
