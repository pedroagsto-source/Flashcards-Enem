import { AbsoluteFill, Img, random, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { font } from '../brand';
import { cutoutSrc, lerp } from '../lib';
import { GRADE } from '../camera';
import { ease } from '../brand';

const W = 1080, H = 820;
const Lines = () => (
  <>
    <text x={W / 2} y={250} textAnchor="middle" fontFamily="Anton" fontSize={250} letterSpacing={6}>1 ARQUIVO</text>
    <text x={W / 2} y={620} textAnchor="middle" fontFamily="Anton" fontSize={380} letterSpacing={10}>DE IA</text>
  </>
);

/** 17 · Letra de vidro — palavra gigante de vidro atrás da pessoa, subindo de deitada pra em pé. */
export const E17Vidro = ({ g0 }: { g0: number }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames: D } = useVideoConfig();
  const g = g0 + f;
  const up = spring({ frame: f, fps, config: { damping: 16, stiffness: 90, mass: 0.9 } });
  const shine = lerp(f, [16, 52], [-0.4, 1.4], ease.inOut);
  const fadeIn = lerp(f, [0, 5], [0, 1]);
  const out = lerp(f, [D - 5, D], [1, 0]);
  return (
    <AbsoluteFill style={{ opacity: fadeIn * out + (1 - fadeIn) * 0 }}>
      {/* fundo gelo */}
      <AbsoluteFill style={{ background: 'radial-gradient(120% 80% at 50% 20%, #F2F8FC 0%, #CFE2EE 45%, #8FB1C8 100%)' }} />
      <AbsoluteFill style={{ background: 'radial-gradient(40% 25% at 25% 30%, rgba(120,190,255,.55), transparent), radial-gradient(35% 22% at 80% 18%, rgba(255,180,220,.45), transparent)', filter: 'blur(30px)' }} />
      {/* bolhas */}
      {Array.from({ length: 16 }).map((_, i) => {
        const x = random(`bx${i}`) * 1080, r = 18 + random(`br${i}`) * 60, sp = 4 + random(`bs${i}`) * 7;
        const y = 1960 - ((f * sp + random(`by${i}`) * 2000) % 2100);
        return (
          <div key={i} style={{ position: 'absolute', left: x, top: y, width: r, height: r, borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,.9), rgba(255,255,255,.15) 40%, rgba(160,200,230,.25) 70%, rgba(255,255,255,.5))',
            boxShadow: 'inset 0 0 8px rgba(255,255,255,.7)', filter: `blur(${r > 55 ? 3 : 0}px)` }} />
        );
      })}
      {/* palavra de vidro */}
      <div style={{ position: 'absolute', left: 0, top: 170, width: W, height: H, perspective: 1300 }}>
        <div style={{ width: W, height: H, transformOrigin: '50% 100%',
          transform: `translateY(${(1 - up) * 260}px) rotateX(${(1 - up) * 80}deg)`, filter: `blur(${(1 - up) * 18}px) drop-shadow(0 18px 30px rgba(20,50,90,.35))` }}>
          <svg width={0} height={0} style={{ position: 'absolute' }}>
            <defs><clipPath id="vidro" clipPathUnits="userSpaceOnUse"><Lines /></clipPath></defs>
          </svg>
          {/* refração: fundo desfocado e deslocado por dentro das letras */}
          <div style={{ position: 'absolute', inset: 0, clipPath: 'url(#vidro)', backdropFilter: 'blur(16px) brightness(1.1) saturate(1.4)',
            background: 'linear-gradient(160deg, rgba(255,255,255,.75), rgba(60,120,180,.45) 45%, rgba(20,60,110,.55) 75%, rgba(255,255,255,.6))' }} />
          {/* brilho passando */}
          <div style={{ position: 'absolute', inset: 0, clipPath: 'url(#vidro)',
            background: `linear-gradient(115deg, transparent ${shine * 100 - 12}%, rgba(255,255,255,.95) ${shine * 100}%, transparent ${shine * 100 + 12}%)` }} />
          {/* contorno + reflexo */}
          <svg width={W} height={H} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
            <defs>
              <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#fff" stopOpacity="1" /><stop offset=".5" stopColor="#fff" stopOpacity=".35" /><stop offset="1" stopColor="#fff" stopOpacity=".9" />
              </linearGradient>
            </defs>
            <g fill="none" stroke="url(#rim)" strokeWidth={5}><Lines /></g>
          </svg>
        </div>
      </div>
      {/* pessoa recortada na frente */}
      <Img src={cutoutSrc(g)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', filter: `${GRADE} drop-shadow(0 30px 40px rgba(30,60,90,.35))` }} />
    </AbsoluteFill>
  );
};
