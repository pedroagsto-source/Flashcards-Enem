import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { brand, font } from '../brand';
import { flash, lerp } from '../lib';
import { useLang, useTx } from '../lang';

/** 09 · Corte no zoom — raios azuis saindo do centro, flash no corte, etiqueta DEPOIS. Corte no frame local 10. */
export const E09Corte = () => {
  const f = useCurrentFrame(); const es = useLang() === 'es';
  const { fps, durationInFrames: D } = useVideoConfig();
  const C = 10;
  const rays = lerp(f, [C - 8, C, C + 10], [0, 1, 0]);
  const tag = spring({ frame: f - C - 4, fps, config: { damping: 12, stiffness: 200, mass: 0.6 } });
  const tagOut = lerp(f, [D - 6, D], [1, 0]);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: rays, mixBlendMode: 'screen',
        background: 'repeating-conic-gradient(from 0deg at 50% 62%, rgba(80,160,255,.0) 0deg, rgba(80,160,255,.55) 2deg, rgba(80,160,255,0) 5deg, rgba(0,0,0,0) 11deg)' }} />
      <AbsoluteFill style={{ opacity: rays * 0.6, background: 'radial-gradient(circle at 50% 62%, rgba(140,200,255,.9), rgba(20,60,140,.4) 35%, rgba(0,10,40,.6) 80%)', mixBlendMode: 'screen' }} />
      <AbsoluteFill style={{ backgroundColor: '#fff', opacity: flash(f, C, 4) * 1.3 }} />
      {f >= C + 4 && (
        <div style={{ position: 'absolute', top: 330, left: 110, transform: `scale(${tag}) rotate(${(1 - tag) * -12}deg)`, opacity: tagOut,
          fontFamily: font.display, fontSize: 64, color: brand.bg, background: brand.accent, padding: '4px 26px', borderRadius: 10, letterSpacing: 3,
          boxShadow: `0 0 40px ${brand.accent}88` }}>{es ? 'DESPUÉS ✦' : 'DEPOIS ✦'}</div>
      )}
    </AbsoluteFill>
  );
};
