import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { brand, font } from '../brand';
import { lerp } from '../lib';
import { T } from '../timing';
import { useLang, useTx } from '../lang';

const MSGS = ['corta os silêncios', 'coloca legenda animada', 'usa o efeito 07', 'deixa premium ✦'], MSGS_ES = ['corta los silencios', 'pon subtítulo animado', 'usa el efecto 07', 'hazlo premium ✦'];

/** Balões de comando ("dando as ordens") aparecendo no topo, como prompts digitados. */
export const Ordens = () => {
  const f = useCurrentFrame();
  const { fps, durationInFrames: D } = useVideoConfig();
  const g0 = T.ordens[0] - 2;
  const g = g0 + f;
  const out = lerp(f, [D - 8, D], [1, 0]);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      {(useLang() === 'es' ? MSGS_ES : MSGS).map((m, i) => {
        const at = T.ordens[i];
        if (g < at) return null;
        const k = spring({ frame: g - at, fps, config: { damping: 13, stiffness: 210, mass: 0.55 } });
        const chars = Math.floor(lerp(g, [at, at + m.length * 0.9], [0, m.length]));
        const right = i % 2 === 1;
        return (
          <div key={m} style={{ position: 'absolute', top: 205 + i * 82, [right ? 'right' : 'left']: 80, display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 24px', borderRadius: 22, background: 'rgba(12,12,16,.72)', border: `2px solid ${brand.accent}66`,
            backdropFilter: 'blur(10px)', transform: `scale(${k}) translateY(${(1 - k) * 20}px)`, transformOrigin: right ? '100% 50%' : '0% 50%',
            fontFamily: font.ui, fontWeight: 800, fontSize: 34, color: '#fff', boxShadow: '0 12px 30px rgba(0,0,0,.35)' }}>
            <span style={{ color: brand.accent }}>›</span>
            {m.slice(0, chars)}
            {chars < m.length && <span style={{ width: 3, height: 34, background: brand.accent }} />}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
