import { AbsoluteFill, Img, random, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { brand, ease, font } from '../brand';
import { cutoutSrc, lerp } from '../lib';
import { GRADE } from '../camera';
import { T } from '../timing';
import { useLang, useTx } from '../lang';

/** 12 · Chroma key (CTA) — pessoa no canto de uma página de site; o cursor clica em SAIBA MAIS no ritmo da fala. */
export const E12Cta = ({ g0 }: { g0: number }) => {
  const f = useCurrentFrame(); const es = useLang() === 'es';
  const { fps } = useVideoConfig();
  const g = g0 + f;
  const slide = spring({ frame: f - 2, fps, config: { damping: 16, stiffness: 120, mass: 0.8 } });
  const pageIn = lerp(f, [0, 8], [0, 1]);
  const stage = g < T.doc ? 0 : g < T.magica ? 1 : 2;
  const stageAt = [0, T.doc - g0, T.magica - g0][stage];
  const tIn = spring({ frame: f - stageAt, fps, config: { damping: 14, stiffness: 160, mass: 0.6 } });
  const titles = es ? [['Haz clic en', 'MÁS INFO'], ['Adjunta este', 'DOCUMENTO'], ['Y mira la', 'MAGIA ✦']] : [['Clica em', 'SAIBA MAIS'], ['Junta esse', 'DOCUMENTINHO'], ['E veja a', 'MÁGICA ✦']];
  // cursor: entra e clica no botão
  const cf = T.click - g0;
  const cx = lerp(f, [cf - 22, cf - 2], [980, 330], ease.out);
  const cy = lerp(f, [cf - 22, cf - 2], [1250, 905], ease.out);
  const press = f >= cf && f < cf + 6 ? 0.92 : 1;
  const ripple = lerp(f, [cf, cf + 14], [0, 1]);
  const docK = spring({ frame: g - T.doc, fps, config: { damping: 12, stiffness: 140, mass: 0.7 } });
  return (
    <AbsoluteFill style={{ opacity: pageIn }}>
      <AbsoluteFill style={{ background: 'linear-gradient(160deg, #2A0B5E 0%, #5B21B6 40%, #BE185D 85%, #F472B6 100%)' }} />
      {/* manchas de luz */}
      {[0, 1, 2].map((i) => {
        const x = 540 + 380 * Math.sin(f / 40 + i * 2.1), y = 700 + 500 * Math.cos(f / 55 + i * 1.7);
        return <div key={i} style={{ position: 'absolute', left: x - 300, top: y - 300, width: 600, height: 600, borderRadius: '50%',
          background: ['#A78BFA', '#F472B6', '#60A5FA'][i], opacity: 0.45, filter: 'blur(110px)' }} />;
      })}
      {/* menu */}
      <div style={{ position: 'absolute', top: 210, left: 70, right: 70, display: 'flex', alignItems: 'center', fontFamily: font.ui, color: '#fff' }}>
        <span style={{ fontFamily: font.display, fontSize: 44, letterSpacing: 2 }}>CHIP <span style={{ color: brand.accent }}>{es ? 'ABOGADO' : 'ADV'}</span></span>
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 34, fontWeight: 600, fontSize: 28, opacity: 0.85 }}><span>{es ? 'Método' : 'Método'}</span><span>{es ? 'Efectos' : 'Efeitos'}</span><span>{es ? 'Contacto' : 'Contato'}</span></span>
      </div>
      {/* título que muda com a fala */}
      <div style={{ position: 'absolute', top: 370, left: 70, right: 70, transform: `translateY(${(1 - tIn) * 40}px)`, opacity: tIn }}>
        <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 92, color: '#fff', lineHeight: 1 }}>{titles[stage][0]}</div>
        <div style={{ fontFamily: font.display, fontSize: 150, color: '#fff', lineHeight: 1.02, letterSpacing: 1,
          textShadow: '0 10px 40px rgba(60,0,80,.45)' }}>{titles[stage][1]}</div>
      </div>
      <div style={{ position: 'absolute', top: 740, left: 70, width: 560, fontFamily: font.ui, fontWeight: 600, fontSize: 32, color: 'rgba(255,255,255,.85)', lineHeight: 1.3 }}>
        {es ? 'Edición premium para abogados — con un solo archivo de IA.' : 'Edição premium para advogados — com um único arquivo de IA.'}
      </div>
      {/* botão */}
      <div style={{ position: 'absolute', top: 860, left: 70, transform: `scale(${press})`, transformOrigin: '0 50%' }}>
        <div style={{ position: 'relative', padding: '26px 54px', borderRadius: 60, background: brand.accent, color: brand.bg,
          fontFamily: font.ui, fontWeight: 900, fontSize: 40, letterSpacing: 1, boxShadow: `0 16px 50px ${brand.accent}66` }}>
          {es ? 'MÁS INFORMACIÓN →' : 'SAIBA MAIS →'}
          {f >= cf && <div style={{ position: 'absolute', inset: -20 * ripple, borderRadius: 80, border: `4px solid ${brand.accent}`, opacity: 1 - ripple }} />}
        </div>
      </div>
      {/* documentinho entrando */}
      {g >= T.doc && (
        <div style={{ position: 'absolute', left: 70, top: 1010, width: 330, display: 'flex', alignItems: 'center', gap: 18, padding: '18px 22px',
          borderRadius: 20, background: 'rgba(255,255,255,.95)', boxShadow: '0 20px 40px rgba(0,0,0,.3)',
          transform: `translateY(${(1 - docK) * -260}px) rotate(${(1 - docK) * -14}deg)` }}>
          <div style={{ width: 54, height: 66, borderRadius: 8, background: brand.violet, color: '#fff', fontFamily: font.ui, fontWeight: 900, fontSize: 18,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 8, boxSizing: 'border-box' }}>.MD</div>
          <div style={{ fontFamily: font.ui }}>
            <div style={{ fontWeight: 800, fontSize: 28, color: '#1a1a1a' }}>{es ? 'CHIP_ABOGADO.md' : 'CHIP_ADV.md'}</div>
            <div style={{ fontWeight: 600, fontSize: 22, color: '#666' }}>{es ? 'prompt maestro · 1 archivo' : 'prompt mestre · 1 arquivo'}</div>
          </div>
        </div>
      )}
      {/* faíscas da mágica */}
      {g >= T.magica && Array.from({ length: 22 }).map((_, i) => {
        const t = (g - T.magica) / fps, a = random(`sa${i}`) * Math.PI * 2, r = 80 + 420 * t * (0.5 + random(`sr${i}`));
        return <div key={i} style={{ position: 'absolute', left: 300 + Math.cos(a) * r, top: 520 + Math.sin(a) * r * 0.7, fontSize: 30 + 30 * random(`ss${i}`),
          color: i % 2 ? brand.accent : '#fff', opacity: 1 - lerp(t, [0.4, 1.2], [0, 1]), transform: `rotate(${g * 8 + i * 30}deg)` }}>✦</div>;
      })}
      {/* pessoa recortada entrando da direita */}
      <Img src={cutoutSrc(g)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transformOrigin: '100% 100%',
        transform: `translateX(${(1 - slide) * 700}px) scale(0.64)`, filter: `${GRADE} drop-shadow(0 0 40px rgba(244,114,182,.55))` }} />
      {/* cursor */}
      {f >= cf - 22 && f < cf + 30 && (
        <svg width={64} height={64} viewBox="0 0 24 24" style={{ position: 'absolute', left: cx, top: cy, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.4))' }}>
          <path d="M4 2l16 9-7 2-3 7z" fill="#fff" stroke="#111" strokeWidth={1.4} strokeLinejoin="round" />
        </svg>
      )}
    </AbsoluteFill>
  );
};
