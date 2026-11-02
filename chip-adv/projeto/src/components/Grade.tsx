import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';

/** Acabamento global: vinheta suave + grão de filme que muda a cada 2 frames. */
export const Grade = () => {
  const g = useCurrentFrame();
  const n = Math.floor(g / 2) % 4;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 75% 60% at 50% 45%, transparent 55%, rgba(0,0,0,0.38) 100%)' }} />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(255,170,90,0.04), rgba(0,0,0,0) 40%, rgba(20,30,60,0.05))', mixBlendMode: 'soft-light' }} />
      <Img src={staticFile(`grain${n}.png`)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05, mixBlendMode: 'overlay' }} />
    </AbsoluteFill>
  );
};
