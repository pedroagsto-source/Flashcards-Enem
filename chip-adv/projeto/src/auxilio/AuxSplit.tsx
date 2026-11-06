import React from 'react';
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { font } from '../brand';
import { lerp } from '../lib';
import { at, build, groups, Piece, Timeline } from './plan';
import { Bandage, Car, Coin, HardHat, House, Magnifier, Pawn, Phone, Scales, Stack, WorkCard, Weight } from './clay';

/* Formato "tela dividida explicativa": painel creme no alto com ilustrações de massinha que mudam a cada ideia,
   e a advogada num cartão arredondado embaixo. Hook H1 + explicação sem a frase da aposentadoria (body d). */

const HOOK = 'h1' as const, BODY = 'd' as const;
const CREAM = '#F3EEE6';
const CARD = { left: 30, top: 650, width: 1020, height: 1240, r: 46 };
const PANEL = { top: 195, height: 440 };

const pop = (g: number, f: number, fps: number, d = 0) =>
  spring({ frame: g - f - d, fps, config: { damping: 12, stiffness: 190, mass: 0.6 } });

/* ───────── vídeo no cartão ───────── */
const Clip = ({ p }: { p: Piece }) => {
  const f = useCurrentFrame();
  const g = p.start + f;
  const z = [...p.zooms].reverse().find(([s]) => g >= s)!;
  const s = z[1] % 2 ? 1.07 : 1;
  const D = p.outF - p.inF;
  return (
    <OffthreadVideo src={staticFile(`auxilio/raw${p.clip}.mp4`)} startFrom={p.inF} endAt={p.outF}
      volume={(x) => Math.max(0, Math.min(1, (x + 1) / 3, (D - x) / 3))}
      style={{ position: 'absolute', left: 0, top: -250, width: CARD.width, height: (CARD.width * 1920) / 1080,
        transform: `scale(${s})`, transformOrigin: '50% 38%', filter: 'contrast(1.04) saturate(1.06)' }} />
  );
};

/* ───────── legenda simples, uma linha ───────── */
const Caption = ({ tl }: { tl: Timeline }) => {
  const g = useCurrentFrame();
  const gs = React.useMemo(() => groups(tl, 4), [tl]);
  const gp = gs.find((x) => g >= x.start && g < x.end);
  if (!gp) return null;
  return (
    <div style={{ position: 'absolute', left: CARD.left, width: CARD.width, top: 1450, textAlign: 'center', fontFamily: font.ui, fontWeight: 800,
      fontSize: 58, color: '#fff', letterSpacing: -0.5, textShadow: '0 3px 10px rgba(0,0,0,.75), 0 0 2px rgba(0,0,0,.9)' }}>
      {gp.words.map((w) => w.w).join(' ')}
    </div>
  );
};

/* ───────── cartão-documento (o "ESCRITURA" do formato) ───────── */
const ROWS = ['Sofreu um acidente', 'Ficou com sequela', 'Carteira assinada na época'];
const Doc = ({ g, checks, stamp }: { g: number; checks: number[]; stamp?: number }) => {
  const { fps } = useVideoConfig();
  const last = checks.filter((c) => g >= c).length - 1;
  const ks = stamp != null ? spring({ frame: g - stamp, fps, config: { damping: 10, stiffness: 240, mass: 0.7 } }) : 0;
  return (
    <div style={{ position: 'relative', width: 700, background: 'linear-gradient(160deg,#FFFDF8,#F1E8D8)', borderRadius: 14,
      border: '2px solid #DCCDB4', boxShadow: '0 22px 40px rgba(80,55,30,.22)', padding: '22px 34px 26px', transform: 'rotate(-2deg)' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{ fontFamily: font.mag, fontWeight: 900, fontSize: 40, letterSpacing: 4, color: '#3A2E22' }}>AUXÍLIO-ACIDENTE</span>
      </div>
      <div style={{ position: 'absolute', right: -18, top: -22, width: 84, height: 84, borderRadius: 42,
        background: 'radial-gradient(circle at 35% 30%, #F2D27A, #B8860B)', boxShadow: '0 8px 14px rgba(80,55,30,.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.ui, fontWeight: 900, fontSize: 20, color: '#6B4B05' }}>INSS</div>
      {ROWS.map((t, i) => {
        const on = g >= checks[i];
        const k = on ? pop(g, checks[i], fps) : 0;
        const hl = i === last && g - checks[i] < 45;
        return (
          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 16, height: 70, padding: '0 12px', borderRadius: 10,
            background: hl ? 'rgba(255,214,90,.45)' : 'transparent', borderTop: i ? '1px dashed #D8C8AE' : 'none' }}>
            <span style={{ fontFamily: font.ui, fontWeight: 700, fontSize: 26, color: '#8C7A62', width: 22 }}>{i + 1}</span>
            <div style={{ width: 38, height: 38, borderRadius: 8, border: '3px solid #5B4A36', position: 'relative', background: '#fff' }}>
              {on && <svg width={34} height={34} viewBox="0 0 24 24" style={{ position: 'absolute', left: 0, top: 0, transform: `scale(${k})` }}>
                <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#1F8F5F" strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </div>
            <span style={{ fontFamily: font.ui, fontWeight: 800, fontSize: 38, color: '#2E2620', opacity: on ? 1 : 0,
              transform: `translateX(${(1 - k) * 24}px)` }}>{t}</span>
          </div>
        );
      })}
      {stamp != null && g >= stamp && (
        <div style={{ position: 'absolute', right: -40, bottom: -46, transform: `rotate(-10deg) scale(${2 - ks})`, opacity: Math.min(1, ks * 1.4),
          border: '6px solid #D2342B', color: '#D2342B', borderRadius: 12, padding: '6px 18px', fontFamily: font.display, fontSize: 52,
          background: 'rgba(255,255,255,.75)' }}>E O SEU CASO?</div>
      )}
    </div>
  );
};

/* ───────── cenas ───────── */
/* quanto cada cena é ampliada para preencher o painel (as peças são desenhadas em tamanho base) */
const ZOOM_KIND: Record<string, number> = { coin: 1.45, stacks1: 1.4, pawns: 1.4, doc: 1.2, docAll: 1.2, types: 1.35, sequela: 1.12,
  carteira: 1.4, lupa: 1.25, stacks2: 1.35, phone: 1.12 };
type Kind = 'coin' | 'stacks1' | 'pawns' | 'doc' | 'types' | 'sequela' | 'carteira' | 'lupa' | 'stacks2' | 'docAll' | 'phone';
type T = Record<string, number>;

const Chip = ({ text, k, bg = '#2E2620', color = '#fff' }: { text: string; k: number; bg?: string; color?: string }) => (
  <div style={{ fontFamily: font.ui, fontWeight: 800, fontSize: 32, color, background: bg, padding: '8px 22px', borderRadius: 30,
    transform: `scale(${k})`, opacity: Math.min(1, k * 1.5), whiteSpace: 'nowrap' }}>{text}</div>
);

const Scene = ({ kind, from, g, t }: { kind: Kind; from: number; g: number; t: T }) => {
  const { fps } = useVideoConfig();
  const enter = spring({ frame: g - from, fps, config: { damping: 14, stiffness: 160, mass: 0.6 } });
  const a = (f: number, d = 0) => (g >= f + d ? pop(g, f, fps, d) : 0);
  const bob = Math.sin((g - from) / 9) * 8;
  const row = (children: React.ReactNode, gap = 40) => (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap }}>{children}</div>
  );
  const sc = (k: number, el: React.ReactNode) => <div style={{ transform: `scale(${k})`, opacity: Math.min(1, k * 1.6), transformOrigin: '50% 100%' }}>{el}</div>;
  const checks = [t.c1, t.c2, t.c3];

  let body: React.ReactNode = null;
  switch (kind) {
    case 'coin':
      body = row(<>{sc(a(from), <Pawn tone="light" size={260} />)}<div style={{ transform: `translateY(${-60 + bob}px) rotate(${bob}deg)` }}>{sc(a(from, 6), <Coin size={210} label="INSS" />)}</div></>, 60);
      break;
    case 'stacks1': {
      const nB = Math.min(6, Math.floor(Math.max(0, g - from) / 4));
      const nS = g >= t.salario1 ? Math.min(6, Math.floor((g - t.salario1) / 4) + 1) : 0;
      body = row(<>{sc(a(from), <Pawn tone="light" size={250} />)}<Stack n={nS} max={6} label="SALÁRIO" /><Stack n={nB} max={6} label="BENEFÍCIO" color="#B07E0A" /></>, 50);
      break;
    }
    case 'pawns':
      body = row(<>{[0, 1, 2, 3, 4, 5].map((i) => i === 3
        ? <div key={i} style={{ transform: `translateY(${-24 * a(t.pede)}px)` }}>{sc(Math.max(a(from, i * 2), 0.001), <Pawn tone={g >= t.pede ? 'light' : 'gray'} hand={g >= t.pede} size={230} />)}</div>
        : <div key={i}>{sc(a(from, i * 2), <Pawn tone="gray" size={200} />)}</div>)}</>, 18);
      break;
    case 'doc':
      body = <Doc g={g} checks={checks} />;
      break;
    case 'docAll':
      body = <Doc g={g} checks={checks} stamp={from + 10} />;
      break;
    case 'types':
      body = row(<>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>{sc(a(t.trabalho), <HardHat size={200} />)}<Chip text="Trabalho" k={a(t.trabalho, 3)} /></div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>{sc(a(t.transito), <Car size={240} />)}<Chip text="Trânsito" k={a(t.transito, 3)} /></div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>{sc(a(t.casa), <House size={200} />)}<Chip text="Casa" k={a(t.casa, 3)} /></div>
      </>, 50);
      break;
    case 'sequela':
      body = row(<>
        <div style={{ position: 'relative' }}>{sc(a(from), <Pawn tone="wood" size={280} />)}
          <div style={{ position: 'absolute', left: -6, top: 150, transform: `rotate(-24deg) scale(${a(from, 6)})` }}><Bandage size={150} /></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>{sc(a(t.peso), <Weight size={150} />)}<Chip text="Dor pra carregar peso" k={a(t.peso, 3)} /></div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <svg width={150} height={150} viewBox="0 0 100 100" style={{ transform: `scale(${a(t.movimento)})` }}>
            <path d="M20 70 C20 30 70 20 80 50" stroke="#D2342B" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray="6 10" />
            <path d="M70 70 L90 90 M90 70 L70 90" stroke="#D2342B" strokeWidth="9" strokeLinecap="round" />
          </svg>
          <Chip text="Movimento limitado" k={a(t.movimento, 3)} />
        </div>
      </>, 40);
      break;
    case 'carteira':
      body = row(<>{sc(a(from), <WorkCard size={220} />)}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start', paddingBottom: 60 }}>
          <Chip text="ou doméstica" k={a(t.domestica)} bg="#1F8F5F" />
          <Chip text="ou rural" k={a(t.rural)} bg="#1F8F5F" />
        </div></>, 50);
      break;
    case 'lupa':
      body = <div style={{ position: 'relative' }}>
        <div style={{ transform: 'scale(.72)', opacity: 0.9 }}><Doc g={g} checks={checks} /></div>
        <div style={{ position: 'absolute', left: 300 + Math.sin((g - from) / 7) * 150, top: 40, transform: `scale(${a(from, 4)})` }}><Magnifier size={260} /></div>
      </div>;
      break;
    case 'stacks2': {
      const nS = g >= t.salario2 ? Math.min(6, Math.floor((g - t.salario2) / 4) + 1) : 0;
      const nA = g >= t.auxilio2 ? Math.min(6, Math.floor((g - t.auxilio2) / 4) + 1) : 0;
      body = row(<>{sc(a(from), <Pawn tone="wood" size={250} />)}<Stack n={nS} max={6} label="SALÁRIO" /><div style={{ fontFamily: font.display, fontSize: 90, color: '#2E2620', paddingBottom: 90, opacity: nA ? 1 : 0 }}>+</div><Stack n={nA} max={6} label="AUXÍLIO" color="#B07E0A" /></>, 30);
      break;
    }
    case 'phone': {
      const lines = Math.min(5, 1 + Math.floor(Math.max(0, g - from) / 18));
      const arrow = Math.abs(Math.sin((g - t.botao) / 6)) * 20;
      body = row(<>
        <div style={{ position: 'relative' }}>{sc(a(from), <Phone size={380} lines={lines} />)}</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, paddingBottom: 30 }}>
          <Chip text="4 perguntas · 1 minuto" k={a(t.quatro)} bg="#1F8F5F" />
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>{sc(a(t.advogada), <Pawn tone="light" size={200} />)}{sc(a(t.advogada, 5), <Scales size={110} />)}</div>
        </div>
        {g >= t.botao && <svg width={90} height={90} viewBox="0 0 24 24" style={{ position: 'absolute', left: 495, top: 330 + arrow }}>
          <path d="M12 4v15M5 12l7 7 7-7" fill="none" stroke="#1F8F5F" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </>, 60);
      break;
    }
  }
  const zoom = ZOOM_KIND[kind];
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: PANEL.top, height: PANEL.height, display: 'flex', alignItems: 'center', justifyContent: 'center',
      transform: `translateY(${(1 - enter) * 30}px) scale(${(0.9 + 0.1 * enter) * zoom})`, opacity: Math.min(1, enter * 1.4) }}>
      {body}
    </div>
  );
};

/* ───────── composição ───────── */
const plan = (tl: Timeline) => {
  const A = (k: string, w?: string) => at(tl, k, w) ?? 0;
  const t: T = {
    salario1: A('8559:1', 'salário'), pede: A('8559:2', 'pede'),
    c1: A('8565:1', 'acidente'), c2: A('8565:1', 'sequela'), c3: A('8565:4', 'carteira'),
    trabalho: A('8565:1', 'trabalho'), transito: A('8565:1', 'trânsito'), casa: A('8565:1', 'casa'),
    peso: A('8565:2', 'dor'), movimento: A('8565:3', 'movimento'),
    domestica: A('8565:5', 'doméstica'), rural: A('8565:5', 'rural'),
    salario2: A('8565:7', 'salário'), auxilio2: A('8565:7', 'auxílio'),
    botao: A('8565:10', 'botão'), quatro: A('8565:10', 'quatro'), advogada: A('8565:10', 'advogada'),
  };
  const scenes: [number, Kind][] = [
    [0, 'coin'], [A('8559:1'), 'stacks1'], [A('8559:2'), 'pawns'],
    [A('8565:0'), 'doc'], [t.trabalho - 4, 'types'], [t.c2 - 6, 'doc'], [A('8565:2'), 'sequela'],
    [A('8565:4'), 'doc'], [A('8565:5'), 'carteira'], [A('8565:6'), 'lupa'], [A('8565:7'), 'stacks2'],
    [A('8565:9'), 'docAll'], [A('8565:10'), 'phone'],
  ];
  const sfx: [number, string, number][] = [
    ...scenes.slice(1).map(([f]): [number, string, number] => [f, 'whoosh', 0.22]),
    [t.c1, 'ding', 0.22], [t.c2, 'ding', 0.22], [t.c3, 'ding', 0.22],
    [t.trabalho, 'pop', 0.3], [t.transito, 'pop', 0.3], [t.casa, 'pop', 0.3], [t.pede, 'pop', 0.3],
    [t.peso, 'pop', 0.3], [t.movimento, 'pop', 0.3], [t.domestica, 'pop', 0.3], [t.rural, 'pop', 0.3],
    [t.salario2, 'pop', 0.28], [t.auxilio2, 'pop', 0.3], [A('8565:9') + 10, 'impact', 0.35], [t.botao, 'click', 0.5], [t.advogada, 'pop', 0.3],
  ];
  return { t, scenes, sfx };
};

export const splitFrames = () => build(HOOK, BODY).total;

export const AuxSplit = () => {
  const g = useCurrentFrame();
  const tl = build(HOOK, BODY);
  const { t, scenes, sfx } = React.useMemo(() => plan(tl), [tl]);
  const idx = scenes.reduce((acc, [f], i) => (g >= f ? i : acc), 0);
  const [from, kind] = scenes[idx];
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 60% at 50% 20%, #FBF8F2, ${CREAM} 60%, #E6DDCF)` }}>
      <Scene kind={kind} from={from} g={g} t={t} />
      <div style={{ position: 'absolute', left: CARD.left, top: CARD.top, width: CARD.width, height: CARD.height, borderRadius: CARD.r, overflow: 'hidden',
        boxShadow: '0 18px 50px rgba(60,40,20,.25)', background: '#000' }}>
        {tl.pieces.map((p) => (
          <Sequence key={p.key} from={p.start} durationInFrames={p.dur} layout="none"><Clip p={p} /></Sequence>
        ))}
      </div>
      <Caption tl={tl} />
      {sfx.filter(([f]) => f > 0).map(([f, n, v], i) => (
        <Sequence key={i} from={f} durationInFrames={60} layout="none"><Audio src={staticFile(`sfx/${n}.wav`)} volume={v} /></Sequence>
      ))}
      {/* fade de entrada de 4 frames para não abrir seco */}
      <AbsoluteFill style={{ backgroundColor: CREAM, opacity: lerp(g, [0, 4], [1, 0]), pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};
