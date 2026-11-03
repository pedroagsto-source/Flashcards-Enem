import { AbsoluteFill, random, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { brand, font } from '../brand';
import { lerp } from '../lib';
import { T } from '../timing';
import { useLang, useTx } from '../lang';

const TEAL = brand.teal;
const ITEMS = ['Conteúdo', 'Formato', 'Estilo', 'Situação'], ITEMS_ES = ['Contenido', 'Formato', 'Estilo', 'Situación'];

/** 07 · Checklist — cartão de vidro fosco com itens marcados no ritmo da fala + confete. */
export const E07Checklist = ({ g0 }: { g0: number }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames: D } = useVideoConfig();
  const g = g0 + f;
  const inn = spring({ frame: f, fps, config: { damping: 15, stiffness: 140, mass: 0.8 } });
  const out = lerp(f, [D - 8, D], [0, 1]);
  const done = T.checks.filter((c) => g >= c).length;
  const prog = lerp(g, [T.checks[0], T.checks[3] + 6], [0, 1]);
  const conf = T.checks[3] + 14;
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 110, right: 110, top: 200, height: 380, borderRadius: 40, overflow: 'hidden',
        transform: `translateY(${(1 - inn) * -500 - out * 600}px)`, boxShadow: '0 40px 80px rgba(0,0,0,.35)',
        border: '2px solid rgba(255,255,255,.35)' }}>
        <div style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(28px) saturate(1.4)', background: 'rgba(16,60,60,.42)' }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${TEAL}33, transparent 60%)` }} />
        <div style={{ position: 'relative', padding: '26px 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <span style={{ fontFamily: font.ui, fontWeight: 900, fontSize: 34, color: '#fff' }}>{useLang() === 'es' ? 'Tú eliges' : 'Você escolhe'}</span>
            <span style={{ fontFamily: font.ui, fontWeight: 800, fontSize: 30, color: TEAL }}>{done}/4</span>
          </div>
          {(useLang() === 'es' ? ITEMS_ES : ITEMS).map((t, i) => {
            const at = T.checks[i];
            const k = spring({ frame: g - at, fps, config: { damping: 13, stiffness: 200, mass: 0.5 } });
            const on = g >= at;
            const strike = lerp(g, [at + 3, at + 12], [0, 1]);
            return (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 24, height: 62 }}>
                <div style={{ width: 44, height: 44, borderRadius: 22, border: `4px solid ${on ? TEAL : 'rgba(255,255,255,.5)'}`, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, borderRadius: 22, background: TEAL, transform: `scale(${on ? k : 0})` }} />
                  {on && <svg width={36} height={36} viewBox="0 0 24 24" style={{ position: 'absolute', left: 0, top: 0 }}>
                    <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#06302C" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round"
                      strokeDasharray={26} strokeDashoffset={26 * (1 - lerp(g, [at + 2, at + 9], [0, 1]))} /></svg>}
                </div>
                <span style={{ position: 'relative', fontFamily: font.ui, fontWeight: 800, fontSize: 40, color: on ? 'rgba(255,255,255,.7)' : '#fff' }}>
                  {t}
                  <span style={{ position: 'absolute', left: 0, top: '52%', height: 5, width: `${strike * 100}%`, background: TEAL, borderRadius: 3 }} />
                </span>
              </div>
            );
          })}
          <div style={{ marginTop: 14, height: 14, borderRadius: 7, background: 'rgba(255,255,255,.2)' }}>
            <div style={{ height: 14, borderRadius: 7, width: `${prog * 100}%`, background: TEAL, boxShadow: `0 0 18px ${TEAL}` }} />
          </div>
        </div>
      </div>
      {/* confete */}
      {g >= conf && Array.from({ length: 40 }).map((_, i) => {
        const t = (g - conf) / fps;
        const a = random(`ca${i}`) * Math.PI * 2;
        const v = 900 + random(`cv${i}`) * 900;
        const x = 540 + Math.cos(a) * v * t;
        const y = 560 + Math.sin(a) * 0.6 * v * t + 1600 * t * t;
        const c = [TEAL, brand.accent, '#fff', brand.pink, '#FFD60A'][i % 5];
        return <div key={i} style={{ position: 'absolute', left: x, top: y, width: 18, height: 30, background: c, borderRadius: 4,
          transform: `rotate(${g * (10 + i) % 360}deg)`, opacity: 1 - lerp(t, [0.6, 1.1], [0, 1]) }} />;
      })}
    </AbsoluteFill>
  );
};
