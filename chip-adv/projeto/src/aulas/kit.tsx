import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame } from 'remotion';
import { brand, font } from '../brand';

/** Peças comuns das aulas (16:9): fundo, cabeçalho, barra de progresso, narração, títulos e listas. */
export const FPS = 30, A = brand.accent, BG = '#08080A';
export const cl = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
export const pop = (f: number, d = 0) => spring({ frame: f - d, fps: FPS, config: { damping: 14, stiffness: 180, mass: .6 } });
export const seg = (s: number[]) => s.map((x) => Math.round(x * FPS));

export const Ac = ({ children }: { children: React.ReactNode }) => <span style={{ fontFamily: font.serif, fontStyle: 'italic', fontWeight: 400, color: A }}>{children}</span>;

export const Titulo = ({ t, sub, f, d = 0, size = 96 }: { t: React.ReactNode; sub?: string; f: number; d?: number; size?: number }) => { const k = pop(f, d);
  return <div style={{ textAlign: 'center', transform: `translateY(${(1 - k) * 30}px)`, opacity: k }}>
    <div style={{ fontFamily: font.ui, fontWeight: 900, fontSize: size, letterSpacing: -2, lineHeight: 1.05, color: brand.ink }}>{t}</div>
    {sub && <div style={{ fontFamily: font.ui, fontWeight: 600, fontSize: 36, color: brand.muted, marginTop: 18 }}>{sub}</div>}</div>; };

export const Centro = ({ children, row }: { children: React.ReactNode; row?: boolean }) =>
  <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', flexDirection: row ? 'row' : 'column', gap: row ? 100 : 0 }}>{children}</AbsoluteFill>;

/** Lista numerada que acende item por item. at[i] = quadro em que o item i acende. */
export const Itens = ({ f, itens, at, w = 1300 }: { f: number; itens: [string, string?][]; at: number[]; w?: number }) =>
  <div style={{ display: 'flex', flexDirection: 'column', gap: 26, width: w }}>{itens.map(([t, sub], i) => { const on = f >= at[i]; const k = pop(f, at[i]);
    return <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 28, opacity: on ? 1 : .25 }}>
      <span style={{ flex: 'none', width: 72, height: 72, borderRadius: 36, background: on ? A : 'transparent', border: `4px solid ${A}`, color: BG, display: 'grid', placeItems: 'center', fontFamily: font.ui, fontWeight: 900, fontSize: 34, transform: `scale(${on ? .8 + .2 * k : 1})` }}>{on ? '✓' : i + 1}</span>
      <span><span style={{ display: 'block', fontFamily: font.ui, fontWeight: 800, fontSize: 48, color: brand.ink }}>{t}</span>
        {sub && on && <span style={{ display: 'block', fontFamily: font.ui, fontWeight: 600, fontSize: 30, color: brand.muted, marginTop: 4, opacity: k }}>{sub}</span>}</span></div>; })}</div>;

export const Chip = ({ t, f, d, riscado }: { t: string; f: number; d: number; riscado?: boolean }) =>
  <span style={{ fontFamily: font.ui, fontWeight: 800, fontSize: 40, color: riscado ? brand.muted : BG, background: riscado ? 'transparent' : A, borderRadius: 999, padding: '12px 30px', opacity: pop(f, d),
    textDecoration: riscado ? 'line-through' : 'none', textDecorationColor: '#FF4A3D', textDecorationThickness: 5, border: riscado ? `2px solid ${brand.muted}` : 'none' }}>{t}</span>;

export const Proxima = ({ t, f, d }: { t: string; f: number; d: number }) =>
  <div style={{ marginTop: 50, fontFamily: font.ui, fontWeight: 700, fontSize: 34, color: brand.muted, opacity: pop(f, d) }}>Próxima: {t} →</div>;

/** Moldura de toda aula: fundo, "CHIP ADV · AULA n", barra de progresso, narração e trilha baixa. */
export const Moldura = ({ n, total, voz, children }: { n: string; total: number; voz: string; children: React.ReactNode }) => { const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: `radial-gradient(70% 70% at 50% 40%, #15190a, ${BG} 70%)` }}>
    {children}
    <div style={{ position: 'absolute', left: 60, top: 44, fontFamily: font.ui, fontWeight: 800, fontSize: 26, color: brand.muted, letterSpacing: 2 }}>CHIP <span style={{ color: A }}>ADV</span> · AULA {n}</div>
    <div style={{ position: 'absolute', left: 0, bottom: 0, height: 8, width: `${interpolate(f, [0, total], [0, 100], cl)}%`, background: A }} />
    <Audio src={staticFile(voz)} />
    <Audio src={staticFile('music/bed.wav')} volume={(x) => interpolate(x, [0, 15, total - 30, total], [0, .07, .07, 0], cl)} />
  </AbsoluteFill>; };
