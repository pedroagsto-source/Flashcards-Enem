import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { brand, font } from '../brand';
import { lerp } from '../lib';

/** Cartão do "mapa" (PDF) entrando pela direita quando a fala diz "abre esse mapa". */
export const MapaCard = () => {
  const f = useCurrentFrame();
  const { fps, durationInFrames: D } = useVideoConfig();
  const k = spring({ frame: f, fps, config: { damping: 13, stiffness: 150, mass: 0.7 } });
  const out = lerp(f, [D - 6, D], [0, 1]);
  const cols = ['#D8FF3C', '#FF5A1F', '#7C3AED', '#5EEAD4', '#EC4899', '#FFD60A'];
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 730, top: 230, width: 290, height: 370, borderRadius: 22, background: '#F7F5EF',
        boxShadow: '0 30px 60px rgba(0,0,0,.45)', padding: 24, boxSizing: 'border-box',
        transform: `translateX(${(1 - k) * 420 + out * 420}px) rotate(${6 - 4 * k}deg)` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: font.display, fontSize: 40, color: brand.bg, letterSpacing: 2 }}>MAPA</span>
          <span style={{ fontFamily: font.ui, fontWeight: 800, fontSize: 20, color: '#fff', background: '#E5322D', padding: '4px 10px', borderRadius: 6 }}>PDF</span>
        </div>
        <div style={{ fontFamily: font.ui, fontWeight: 800, fontSize: 26, color: '#333', margin: '8px 0 16px' }}>17 efeitos de vídeo</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {cols.map((c, i) => {
            const s = spring({ frame: f - 6 - i * 2, fps, config: { damping: 12, stiffness: 200 } });
            return <div key={i} style={{ height: 74, borderRadius: 10, background: c, transform: `scale(${s})` }} />;
          })}
        </div>
        <div style={{ marginTop: 16, height: 10, width: '80%', borderRadius: 5, background: '#DDD' }} />
        <div style={{ marginTop: 10, height: 10, width: '55%', borderRadius: 5, background: '#DDD' }} />
      </div>
    </AbsoluteFill>
  );
};
