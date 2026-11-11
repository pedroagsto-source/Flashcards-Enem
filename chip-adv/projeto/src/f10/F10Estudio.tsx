import { AbsoluteFill, Audio, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { brand, font } from '../brand';

/** F10 · "Você escolhe, a IA edita": gravação de tela do Estúdio CHIP ADV dentro de um celular, com títulos grandes por passo.
 *  Feito para funcionar sem som (texto conduz); trilha + SFX nos cliques. */
const FPS = 30, INTRO = 75, R = 1.2, CORTE = 1.2; // gravação acelerada 1.2× e sem o 1,2 s inicial de carregamento
const MARCAS: Record<string, number> = { formato: 1.45, clica_lista: 3.78, estilo: 4.09, clica_premium: 7.45, fonte: 7.7, clica_anton: 9.55, cores: 9.79, clica_paleta: 11.65,
  efeitos: 11.95, quero_04: 15.2, evitar_14: 18.66, pronto: 20.38, copiar: 23.83, roteiro: 25.37, troca_animacao: 29.07, aprova: 34.13, fim: 35.86 };
const f = (k: string) => Math.round(INTRO + ((MARCAS[k] - CORTE) * FPS) / R);
const REC_FIM = f('fim'), RES = 90, CTA = 105;
export const F10_FRAMES = REC_FIM + RES + CTA;
const CLIQUES = ['clica_lista', 'clica_premium', 'clica_anton', 'clica_paleta', 'quero_04', 'evitar_14', 'pronto', 'copiar', 'troca_animacao', 'aprova'].map(f);
const cl = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const A = brand.accent;

type Seg = { de: number; ate: number; passo?: string; t1: string; t2?: string; sub?: string };
const SEGS: Seg[] = [
  { de: 0, ate: INTRO, t1: 'Antes da IA editar', t2: 'o seu vídeo…' },
  { de: INTRO, ate: f('estilo'), passo: '1/6', t1: 'Você escolhe', t2: 'o formato', sub: 'lista, antes e depois, escritório…' },
  { de: f('estilo'), ate: f('fonte'), passo: '2/6', t1: 'Escolhe', t2: 'o estilo', sub: '8 estilos prontos para advogado' },
  { de: f('fonte'), ate: f('cores'), passo: '3/6', t1: 'A fonte', t2: 'da legenda' },
  { de: f('cores'), ate: f('efeitos'), passo: '4/6', t1: 'As cores do', t2: 'seu escritório' },
  { de: f('efeitos'), ate: f('pronto'), passo: '5/6', t1: 'E as animações', t2: 'que você quer', sub: '✓ as que quer  ·  ✕ as que não quer' },
  { de: f('pronto'), ate: f('roteiro'), passo: '6/6', t1: 'Seu estilo', t2: 'fica salvo', sub: 'vale para todos os vídeos' },
  { de: f('roteiro'), ate: REC_FIM, t1: 'Depois escolhe a animação', t2: 'de cada momento', sub: 'antes de a IA renderizar' },
  { de: REC_FIM, ate: REC_FIM + RES, t1: 'E recebe pronto,', t2: 'com a sua cara.' },
];

const Titulo = ({ s }: { s: Seg }) => {
  const g = useCurrentFrame(); const { fps } = useVideoConfig(); const k = spring({ frame: g - s.de, fps, config: { damping: 13, stiffness: 190, mass: 0.6 } });
  const k2 = spring({ frame: g - s.de - 5, fps, config: { damping: 13, stiffness: 190, mass: 0.6 } });
  const sai = interpolate(g, [s.ate - 5, s.ate], [1, 0], cl);
  if (g < s.de || g >= s.ate) return null;
  return <>
    <div style={{ position: 'absolute', top: 96, left: 60, right: 60, textAlign: 'center', opacity: sai }}>
      {s.passo && <div style={{ display: 'inline-block', fontFamily: font.ui, fontWeight: 900, fontSize: 30, letterSpacing: '.12em', color: '#111', background: A, borderRadius: 999, padding: '8px 22px', marginBottom: 18, transform: `scale(${k})` }}>PASSO {s.passo}</div>}
      <div style={{ fontFamily: font.ui, fontWeight: 900, fontSize: 82, lineHeight: 1.02, color: brand.ink, letterSpacing: '-.02em', transform: `translateY(${(1 - k) * 40}px)`, opacity: k }}>{s.t1}</div>
      {s.t2 && <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 104, lineHeight: 1, color: A, transform: `translateY(${(1 - k2) * 40}px)`, opacity: k2 }}>{s.t2}</div>}
    </div>
    {s.sub && <div style={{ position: 'absolute', bottom: 70, left: 60, right: 60, textAlign: 'center', fontFamily: font.ui, fontWeight: 800, fontSize: 40, color: brand.ink, opacity: k2 * sai,
      textShadow: '0 4px 18px rgba(0,0,0,.6)' }}>{s.sub}</div>}
  </>;
};

const Celular = () => {
  const g = useCurrentFrame(); const { fps } = useVideoConfig();
  const entra = spring({ frame: g - 22, fps, config: { damping: 16, stiffness: 120, mass: 0.9 } });
  const pulso = CLIQUES.reduce((m, c) => Math.max(m, interpolate(g, [c, c + 4, c + 14], [0, 1, 0], cl)), 0);
  const fimCta = interpolate(g, [REC_FIM + RES, REC_FIM + RES + 14], [0, 1], cl);
  const s = (0.92 + 0.08 * entra) * (1 + 0.035 * pulso) * (1 - 0.32 * fimCta);
  const y = interpolate(entra, [0, 1], [900, 0]) - 210 * fimCta;
  const rot = Math.sin(g / 38) * 2.2 * (1 - fimCta);
  const W = 620, H = 1240;
  return <div style={{ position: 'absolute', left: (1080 - W) / 2, top: 470, width: W, height: H, transform: `translateY(${y}px) perspective(1600px) rotateY(${rot}deg) scale(${s})`, transformOrigin: '50% 40%' }}>
    <div style={{ position: 'absolute', inset: -16, borderRadius: 78, background: '#1b1b21', boxShadow: `0 60px 140px rgba(0,0,0,.7), 0 0 0 2px #2c2c34, 0 0 ${60 + 60 * pulso}px rgba(216,255,60,${0.12 + 0.25 * pulso})` }} />
    <div style={{ position: 'absolute', inset: 0, borderRadius: 64, overflow: 'hidden', background: '#0B0B0F' }}>
      <Sequence from={INTRO - 10} durationInFrames={REC_FIM - INTRO + 10} layout="none">
        <OffthreadVideo src={staticFile('f10/estudio_tela.mp4')} trimBefore={Math.round(CORTE * FPS) - 12} playbackRate={R} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </Sequence>
      <Sequence from={REC_FIM} layout="none">
        <OffthreadVideo src={staticFile('f10/pronto.mp4')} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: 40, left: 0, right: 0, textAlign: 'center' }}>
          <span style={{ fontFamily: font.ui, fontWeight: 900, fontSize: 34, background: A, color: '#111', borderRadius: 999, padding: '10px 26px', opacity: interpolate(g, [REC_FIM + 6, REC_FIM + 14], [0, 1], cl) }}>PRONTO ✓</span></div>
      </Sequence>
      {g < INTRO - 10 && <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 30%, #1d2410, #0B0B0F 70%)' }} />}
    </div>
    <div style={{ position: 'absolute', top: 14, left: '50%', width: 150, height: 34, marginLeft: -75, borderRadius: 20, background: '#000' }} />
  </div>;
};

const Cta = () => {
  const g = useCurrentFrame(); const { fps } = useVideoConfig(); const a = REC_FIM + RES; if (g < a) return null;
  const k = spring({ frame: g - a - 6, fps, config: { damping: 12, stiffness: 170, mass: 0.6 } });
  const pul = 1 + 0.04 * Math.sin((g - a) / 4);
  return <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 150 }}>
    <div style={{ textAlign: 'center', transform: `translateY(${(1 - k) * 80}px)`, opacity: k }}>
      <div style={{ fontFamily: font.ui, fontWeight: 900, fontSize: 96, color: brand.ink, letterSpacing: '-.02em' }}>CHIP <span style={{ color: A }}>ADV</span></div>
      <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 64, color: brand.ink, marginTop: 4 }}>Você escolhe. A IA edita.</div>
      <div style={{ display: 'inline-block', marginTop: 34, fontFamily: font.ui, fontWeight: 900, fontSize: 46, background: A, color: '#111', borderRadius: 999, padding: '22px 54px', transform: `scale(${pul})`,
        boxShadow: '0 0 60px rgba(216,255,60,.45)' }}>Toque em Saiba mais →</div>
    </div>
  </AbsoluteFill>;
};

const Fundo = () => {
  const g = useCurrentFrame();
  return <AbsoluteFill style={{ background: `radial-gradient(circle at 50% ${38 + Math.sin(g / 50) * 4}%, rgba(216,255,60,.16), transparent 55%), radial-gradient(circle at 15% 90%, rgba(124,58,237,.18), transparent 50%), #0B0B0F` }} />;
};

export const F10Estudio = () => {
  const SFX: [number, string, number][] = [
    [0, 'whoosh', 0.5], [22, 'whoosh', 0.55], ...SEGS.slice(1).map((s): [number, string, number] => [s.de, 'whoosh', 0.35]),
    ...CLIQUES.map((c): [number, string, number] => [c, 'pop', 0.6]), [REC_FIM - 22, 'riser', 0.45], [REC_FIM, 'shimmer', 0.55], [REC_FIM + RES + 6, 'impact', 0.55], [REC_FIM + RES + 20, 'ding', 0.5],
  ];
  return <AbsoluteFill style={{ background: '#0B0B0F', overflow: 'hidden' }}>
    <Fundo />
    <Celular />
    {SEGS.map((s, i) => <Titulo key={i} s={s} />)}
    <Cta />
    {SFX.map(([fr, n, v], i) => <Sequence key={i} from={Math.max(0, fr)} durationInFrames={60} layout="none"><Audio src={staticFile(`sfx/${n}.wav`)} volume={v} /></Sequence>)}
    <Audio src={staticFile('music/bed.wav')} volume={(fr) => interpolate(fr, [0, 8, F10_FRAMES - 20, F10_FRAMES], [0, 0.32, 0.32, 0], cl)} />
  </AbsoluteFill>;
};
