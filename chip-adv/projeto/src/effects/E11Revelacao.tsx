import { AbsoluteFill, random, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { brand, ease, font } from '../brand';
import { lerp } from '../lib';

const OR = brand.accent2;
const TASKS = ['Transcrever', 'Cortar silêncio', 'Legenda', 'Efeitos', 'Música'];
const CHECK0 = 22, STEP = 12;
const PV = { x: 60, y: 230, w: 540, h: 960 };

const useP = () => {
  const f = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  return { f, p: lerp(f, [0, 16], [0, 1], ease.out) * (1 - lerp(f, [D - 12, D], [0, 1], ease.in)) };
};

/** 11 · Revelação (camada de trás): editor escuro em volta do vídeo. */
export const E11Revelacao = () => {
  const { f, p } = useP();
  const { fps } = useVideoConfig();
  const done = TASKS.filter((_, i) => f >= CHECK0 + i * STEP).length;
  const head = lerp(f, [10, 90], [0, 1]);
  return (
    <AbsoluteFill style={{ background: '#0E0F13', opacity: p }}>
      <AbsoluteFill style={{ background: `radial-gradient(60% 40% at 80% 10%, ${OR}22, transparent)` }} />
      {/* barra de título */}
      <div style={{ position: 'absolute', top: 150, left: 60, right: 60, display: 'flex', alignItems: 'center', gap: 14,
        fontFamily: font.ui, fontWeight: 600, fontSize: 30, color: brand.muted }}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <div key={c} style={{ width: 20, height: 20, borderRadius: 10, background: c }} />)}
        <span style={{ marginLeft: 16 }}>CHIP ADV — editor</span>
        <span style={{ marginLeft: 'auto', color: OR }}>● renderizando</span>
      </div>
      {/* painel de tarefas */}
      <div style={{ position: 'absolute', left: 640, top: PV.y, width: 380, height: PV.h, background: '#16181E', borderRadius: 28,
        border: '1px solid #262A33', padding: 32, boxSizing: 'border-box', transform: `translateX(${(1 - p) * 200}px)` }}>
        <div style={{ fontFamily: font.ui, fontWeight: 800, fontSize: 34, color: brand.ink, marginBottom: 28 }}>Tarefas</div>
        {TASKS.map((t, i) => {
          const at = CHECK0 + i * STEP;
          const k = spring({ frame: f - at, fps, config: { damping: 13, stiffness: 220, mass: 0.5 } });
          const on = f >= at;
          const appear = spring({ frame: f - 6 - i * 3, fps, config: { damping: 16, stiffness: 160 } });
          return (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 18, height: 96, opacity: appear, transform: `translateY(${(1 - appear) * 30}px)` }}>
              <div style={{ width: 44, height: 44, borderRadius: 22, border: `3px solid ${on ? OR : '#3A3F4B'}`, background: on ? OR : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${on ? 0.8 + 0.2 * k : 1})` }}>
                {on && <svg width={26} height={26} viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5" fill="none" stroke="#0E0F13" strokeWidth={3.5}
                  strokeLinecap="round" strokeLinejoin="round" strokeDasharray={30} strokeDashoffset={30 * (1 - k)} /></svg>}
              </div>
              <span style={{ fontFamily: font.ui, fontWeight: 600, fontSize: 32, color: on ? brand.ink : brand.muted }}>{t}</span>
            </div>
          );
        })}
        <div style={{ position: 'absolute', left: 32, right: 32, bottom: 40 }}>
          <div style={{ fontFamily: font.ui, fontWeight: 600, fontSize: 26, color: brand.muted, marginBottom: 12 }}>{Math.round((done / TASKS.length) * 100)}% concluído</div>
          <div style={{ height: 12, borderRadius: 6, background: '#262A33' }}>
            <div style={{ height: 12, borderRadius: 6, width: `${(done / TASKS.length) * 100}%`, background: OR, boxShadow: `0 0 20px ${OR}` }} />
          </div>
        </div>
      </div>
      {/* linha do tempo */}
      <div style={{ position: 'absolute', left: 60, right: 60, top: 1400, height: 136, background: '#16181E', borderRadius: 22,
        border: '1px solid #262A33', overflow: 'hidden', transform: `translateY(${(1 - p) * 200}px)` }}>
        {[['#5B8CFF', 0.02, 0.38, 14], ['#5B8CFF', 0.4, 0.97, 14], [OR, 0.1, 0.3, 50], [OR, 0.55, 0.7, 50], ['#C084FC', 0.02, 0.97, 86]].map(([c, a, b, y], i) => (
          <div key={i} style={{ position: 'absolute', left: `${(a as number) * 100}%`, width: `${((b as number) - (a as number)) * 100}%`, top: y as number, height: 28,
            borderRadius: 7, background: `${c}AA`, border: `1px solid ${c}` }} />
        ))}
        {/* onda de áudio */}
        <div style={{ position: 'absolute', left: '2%', right: '3%', top: 86, height: 28, display: 'flex', alignItems: 'center', gap: 3 }}>
          {Array.from({ length: 120 }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: `${20 + 80 * random(`w${i}`) * (0.5 + 0.5 * Math.sin(i / 5))}%`, background: '#E9D5FF', borderRadius: 2 }} />
          ))}
        </div>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${2 + head * 95}%`, width: 4, background: '#fff', boxShadow: '0 0 12px #fff' }} />
      </div>
    </AbsoluteFill>
  );
};

/** 11 · Revelação (camada da frente): moldura da janela de pré-visualização. */
export const E11Front = () => {
  const { p } = useP();
  return (
    <AbsoluteFill style={{ opacity: p }}>
      <div style={{ position: 'absolute', left: PV.x - 3, top: PV.y - 3, width: PV.w + 6, height: PV.h + 6, borderRadius: 30,
        border: `3px solid ${OR}`, boxShadow: `0 0 50px ${OR}55` }} />
      <div style={{ position: 'absolute', left: PV.x + 22, top: PV.y + 22, fontFamily: font.ui, fontWeight: 800, fontSize: 24, letterSpacing: 2,
        color: '#fff', background: 'rgba(0,0,0,.55)', padding: '8px 16px', borderRadius: 10 }}>PREVIEW · 1080×1920</div>
    </AbsoluteFill>
  );
};
