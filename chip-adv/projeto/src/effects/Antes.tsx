import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { brand, font } from '../brand';
import { lerp } from '../lib';

/** "ANTES": interface de câmera de celular sobre a gravação crua. */
export const Antes = () => {
  const f = useCurrentFrame();
  const { fps, durationInFrames: D } = useVideoConfig();
  const inn = spring({ frame: f, fps, config: { damping: 15, stiffness: 180 } });
  const op = lerp(f, [D - 12, D - 4], [1, 0]);
  const secs = Math.floor(f / 30);
  const blink = Math.floor(f / 15) % 2 === 0;
  const corner = (s: React.CSSProperties) => (
    <div style={{ position: 'absolute', width: 70, height: 70, borderColor: 'rgba(255,255,255,.85)', borderStyle: 'solid', borderWidth: 0, ...s }} />
  );
  return (
    <AbsoluteFill style={{ opacity: op }}>
      {/* grade de terços */}
      <AbsoluteFill style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.18) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.18) 2px, transparent 2px)', backgroundSize: '360px 640px', backgroundPosition: '-1px -1px' }} />
      {/* cantos do enquadramento */}
      {corner({ left: 90, top: 300, borderTopWidth: 5, borderLeftWidth: 5 })}
      {corner({ right: 90, top: 300, borderTopWidth: 5, borderRightWidth: 5 })}
      {corner({ left: 90, bottom: 420, borderBottomWidth: 5, borderLeftWidth: 5 })}
      {corner({ right: 90, bottom: 420, borderBottomWidth: 5, borderRightWidth: 5 })}
      {/* REC + tempo */}
      <div style={{ position: 'absolute', top: 230, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(0,0,0,.45)', padding: '12px 26px', borderRadius: 40,
          fontFamily: font.ui, fontWeight: 600, fontSize: 40, color: '#fff', letterSpacing: 2 }}>
          <div style={{ width: 22, height: 22, borderRadius: 11, background: '#FF3B30', opacity: blink ? 1 : 0.25 }} />
          00:00:{String(secs).padStart(2, '0')}
        </div>
      </div>
      {/* etiqueta ANTES */}
      <div style={{ position: 'absolute', top: 330, left: 110, transform: `translateX(${(1 - inn) * -300}px)`, fontFamily: font.display,
        fontSize: 64, color: brand.bg, background: '#fff', padding: '4px 26px', borderRadius: 10, letterSpacing: 3 }}>ANTES</div>
      {/* rodapé da câmera */}
      <div style={{ position: 'absolute', bottom: 400, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 40,
        fontFamily: font.ui, fontWeight: 600, fontSize: 34, color: 'rgba(255,255,255,.75)', letterSpacing: 3 }}>
        <span>FOTO</span><span style={{ color: '#FFD60A' }}>VÍDEO</span><span>CINEMA</span>
      </div>
    </AbsoluteFill>
  );
};
