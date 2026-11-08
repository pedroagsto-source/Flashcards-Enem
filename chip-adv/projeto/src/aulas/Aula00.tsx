import { AbsoluteFill, Audio, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame } from 'remotion';
import { brand, font } from '../brand';
import T from '../data/aula00.json';

/** Aula 0 · Boas-vindas: o caminho inteiro. 16:9, narração + telas animadas.
 *  aula00.json = início (em quadros) de cada frase da narração, na ordem do roteiro. */
const FPS = 30;
const A = brand.accent, BG = '#08080A';
const ini = (T as { frases: number[]; total: number }).frases; export const AULA00_FRAMES = (T as { total: number }).total;
const cl = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const pop = (f: number, d = 0) => spring({ frame: f - d, fps: FPS, config: { damping: 14, stiffness: 180, mass: .6 } });
const F = (i: number) => ini[i];

const Titulo = ({ t, sub, f, d = 0, size = 96 }: { t: React.ReactNode; sub?: string; f: number; d?: number; size?: number }) => { const k = pop(f, d);
  return <div style={{ textAlign: 'center', transform: `translateY(${(1 - k) * 30}px)`, opacity: k }}>
    <div style={{ fontFamily: font.ui, fontWeight: 900, fontSize: size, letterSpacing: -2, lineHeight: 1.05, color: brand.ink }}>{t}</div>
    {sub && <div style={{ fontFamily: font.ui, fontWeight: 600, fontSize: 36, color: brand.muted, marginTop: 18 }}>{sub}</div>}</div>; };
const Ac = ({ children }: { children: React.ReactNode }) => <span style={{ fontFamily: font.serif, fontStyle: 'italic', fontWeight: 400, color: A }}>{children}</span>;

const Fone = ({ src, rot, f, d, label, cor }: { src: string; rot: string; f: number; d: number; label: string; cor: string }) => { const k = pop(f, d);
  return <div style={{ transform: `scale(${.85 + .15 * k})`, opacity: k, textAlign: 'center' }}>
    <div style={{ fontFamily: font.ui, fontWeight: 900, fontSize: 30, letterSpacing: 3, color: cor, marginBottom: 14 }}>{label}</div>
    <div style={{ width: 380, height: 676, borderRadius: 44, overflow: 'hidden', boxShadow: `0 0 0 6px ${cor}, 0 40px 80px rgba(0,0,0,.6)`, background: '#000' }}>
      <Sequence from={d} layout="none"><OffthreadVideo src={staticFile(src)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></Sequence></div>
    <div style={{ fontFamily: font.ui, fontWeight: 600, fontSize: 26, color: brand.muted, marginTop: 14 }}>{rot}</div></div>; };

const PASSOS = ['Instala o Claude no computador', 'Instala o CHIP ADV (uma vez só)', 'Grava no celular e escreve "Roda o CHIP ADV"', 'Aprova o roteiro de edição', 'Recebe o vídeo pronto'];
const Passos = ({ f }: { f: number }) => { const at = [F(6), F(7), F(8), F(9), F(9) + 60];
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 22, width: 1100 }}>{PASSOS.map((p, i) => { const on = f >= at[i]; const k = pop(f, at[i]);
    return <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 28, opacity: on ? 1 : .25, transform: `translateX(${on ? 0 : -10}px)` }}>
      <span style={{ width: 70, height: 70, borderRadius: 35, background: on ? A : 'transparent', border: `4px solid ${A}`, color: BG, display: 'grid', placeItems: 'center', fontFamily: font.ui, fontWeight: 900, fontSize: 34, transform: `scale(${on ? .8 + .2 * k : 1})` }}>{i + 1}</span>
      <span style={{ fontFamily: font.ui, fontWeight: 800, fontSize: 46, color: brand.ink }}>{p}</span></div>; })}</div>; };

const Comando = ({ f, d }: { f: number; d: number }) => { const txt = '/chip-adv'; const n = Math.floor(interpolate(f, [d + 30, d + 60], [0, txt.length], cl));
  return <div style={{ position: 'absolute', right: 120, bottom: 120, width: 560, background: '#F5F2EA', borderRadius: 24, padding: 24, fontFamily: font.ui, boxShadow: '0 30px 60px rgba(0,0,0,.5)', opacity: pop(f, d) }}>
    <div style={{ fontWeight: 800, fontSize: 22, color: '#777', marginBottom: 12 }}>✦ Claude · Code</div>
    <div style={{ background: '#fff', border: '2px solid #e3ddd0', borderRadius: 16, padding: '14px 18px', fontWeight: 700, fontSize: 32, color: '#1b1b1f' }}>{txt.slice(0, n)}<span style={{ opacity: f % 16 < 8 ? 1 : 0 }}>|</span></div></div>; };

const AULAS = ['0 · Boas-vindas', '1 · O que você precisa', '2 · Instalando o Claude', '3 · Instalando o CHIP ADV', '4 · Preparando o computador', '5 · Gravando do jeito certo', '6 · Primeira edição, ao vivo', '7 · Roteiro e ajustes', '8 · Mapa de efeitos', '9 · Problemas comuns'];

const Cena = () => { const f = useCurrentFrame();
  const em = (a: number, b: number) => f >= F(a) && f < (b < ini.length ? F(b) : AULA00_FRAMES);
  if (em(0, 2)) return <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
    <div style={{ fontFamily: font.ui, fontWeight: 900, fontSize: 70, letterSpacing: 4, color: brand.ink, opacity: pop(f) }}>CHIP <span style={{ color: A }}>ADV</span></div>
    <div style={{ height: 30 }} /><Titulo t={<>Seja <Ac>bem-vindo</Ac>.</>} f={f} d={8} size={120} />
    {f >= F(1) && <div style={{ marginTop: 40 }}><Titulo t="" sub="Aula 0 · O caminho inteiro" f={f} d={F(1)} /></div>}</AbsoluteFill>;
  if (em(2, 4)) return <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 140 }}>
    <Fone src="aulas/bruto.mp4" label="GRAVADO NO CELULAR" rot="com pausas e erros" cor="#9A9AA5" f={f} d={F(2)} />
    {f >= F(3) && <Fone src="aulas/pronto.mp4" label="EDITADO PELO CHIP ADV" rot="cortes · legenda · efeitos · trilha" cor={A} f={f} d={F(3)} />}</AbsoluteFill>;
  if (em(4, 5)) return <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}><Titulo t={<>Quem editou foi a <Ac>IA</Ac>,<br />com o CHIP ADV.</>} f={f} d={F(4)} size={104} /></AbsoluteFill>;
  if (em(5, 10)) return <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'flex-start', padding: '0 200px' }}>
    <div style={{ fontFamily: font.ui, fontWeight: 900, fontSize: 64, color: brand.ink, marginBottom: 50, opacity: pop(f, F(5)) }}>O caminho é <Ac>simples</Ac>.</div>
    <Passos f={f} />{f >= F(8) && f < F(9) && <Comando f={f} d={F(8)} />}</AbsoluteFill>;
  if (em(10, 11)) return <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
    <Titulo t={<>Sem programa de edição.<br /><Ac>Sem saber editar.</Ac></>} f={f} d={F(10)} size={100} />
    <div style={{ display: 'flex', gap: 40, marginTop: 60, opacity: pop(f, F(10) + 20) }}>{['CapCut', 'Premiere', 'After Effects'].map((t) => <span key={t} style={{ fontFamily: font.ui, fontWeight: 800, fontSize: 40, color: brand.muted, textDecoration: 'line-through', textDecorationColor: '#FF4A3D', textDecorationThickness: 5 }}>{t}</span>)}</div></AbsoluteFill>;
  if (em(11, 12)) return <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 120 }}>
    <div style={{ width: 620 }}><Titulo t={<>Aulas <Ac>curtas</Ac>.</>} sub="Na ordem, fazendo junto." f={f} d={F(11)} size={96} /></div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>{AULAS.map((a, i) => <div key={a} style={{ fontFamily: font.ui, fontWeight: 800, fontSize: 32, color: i === 0 ? BG : brand.ink, background: i === 0 ? A : 'rgba(255,255,255,.06)', borderRadius: 12, padding: '8px 20px', opacity: pop(f, F(11) + i * 3) }}>{a}</div>)}</div></AbsoluteFill>;
  if (em(12, 13)) return <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}><Titulo t={<>Travou? <Ac>Aula 9</Ac>.</>} sub="Os erros mais comuns, resolvidos." f={f} d={F(12)} size={110} /></AbsoluteFill>;
  return <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}><Titulo t={<>Vamos <Ac>começar</Ac>.</>} f={f} d={F(13)} size={130} />
    <div style={{ marginTop: 50, fontFamily: font.ui, fontWeight: 700, fontSize: 34, color: brand.muted, opacity: pop(f, F(13) + 15) }}>Próxima: Aula 1 · O que você precisa →</div></AbsoluteFill>;
};

export const Aula00 = () => { const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: `radial-gradient(70% 70% at 50% 40%, #15190a, ${BG} 70%)` }}>
    <Cena />
    <div style={{ position: 'absolute', left: 60, top: 44, fontFamily: font.ui, fontWeight: 800, fontSize: 26, color: brand.muted, letterSpacing: 2 }}>CHIP <span style={{ color: A }}>ADV</span> · AULA 0</div>
    <div style={{ position: 'absolute', left: 0, bottom: 0, height: 8, width: `${interpolate(f, [0, AULA00_FRAMES], [0, 100], cl)}%`, background: A }} />
    <Audio src={staticFile('aulas/aula00_voz.mp3')} />
    <Audio src={staticFile('music/bed.wav')} volume={(x) => interpolate(x, [0, 15, AULA00_FRAMES - 30, AULA00_FRAMES], [0, .07, .07, 0], cl)} />
  </AbsoluteFill>; };
