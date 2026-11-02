import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { brand, font } from '../brand';
import { E, flash } from '../lib';
import { T } from '../timing';

/** 05 · Zoom digital — palavra gigante a cada zoom seco + flash. (frames globais: começa em 0) */
export const E05Zoom = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words: [number, number, string][] = [
    [T.z1, T.z1 + 26, 'ADVOGADO'],
    [T.z2, E(1), 'MANUALMENTE?'],
  ];
  const fl = Math.max(flash(f, T.z1), flash(f, T.z2));
  return (
    <AbsoluteFill>
      {words.map(([a, b, w]) => {
        if (f < a || f >= b) return null;
        const sp = spring({ frame: f - a, fps, config: { damping: 11, stiffness: 260, mass: 0.5 } });
        const out = f > b - 4 ? (b - f) / 4 : 1;
        return (
          <AbsoluteFill key={w} style={{ alignItems: 'center', justifyContent: 'center' }}>
            <div
              style={{
                fontFamily: font.bebas, fontSize: w.length > 9 ? 190 : 250, color: brand.accent, lineHeight: 0.9,
                letterSpacing: 4, transform: `translateY(260px) scale(${1.5 - 0.5 * sp})`, opacity: out,
                textShadow: '0 10px 40px rgba(0,0,0,.65)',
              }}
            >
              {w}
            </div>
          </AbsoluteFill>
        );
      })}
      <AbsoluteFill style={{ backgroundColor: 'white', opacity: fl }} />
    </AbsoluteFill>
  );
};
