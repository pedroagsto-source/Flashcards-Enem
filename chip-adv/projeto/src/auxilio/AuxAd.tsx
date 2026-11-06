import React from 'react';
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { ease, font } from '../brand';
import { flash, lerp, shake } from '../lib';
import { Angulo, at, BodyId, build, endOf, Estilo, groups, HookId, HOOKS, Piece, Timeline } from './plan';

/* Paleta do teste: amarelo quente de destaque, vermelho de alerta, verde de "conta", azul-marinho institucional */
const C = { y: '#FFD23F', ink: '#111318', red: '#E5322D', green: '#22C55E', navy: '#0F2742', white: '#FFFFFF' };
const SPR = { damping: 14, stiffness: 170, mass: 0.6 };

/* ───────────────────────── vídeo ───────────────────────── */
const ZOOM: Record<Estilo, [number, number]> = { premium: [1, 1.12], nativo: [1, 1.07], manchete: [1, 1.06] };

/* multicam: aberto → fechado → médio, como três câmeras; o fechado desloca um pouco pro lado */
const CAMS = [{ s: 1, o: '50% 40%', x: 0 }, { s: 1.58, o: '50% 46%', x: -28 }, { s: 1.3, o: '50% 38%', x: 18 }];

const Clip = ({ p, estilo, angulo }: { p: Piece; estilo: Estilo; angulo: Angulo }) => {
  const f = useCurrentFrame();
  const g = p.start + f;
  const zi = p.zooms.findIndex(([s], i) => g >= s && (i === p.zooms.length - 1 || g < p.zooms[i + 1][0]));
  const [z0, n] = p.zooms[Math.max(0, zi)];
  const z1 = zi < p.zooms.length - 1 ? p.zooms[zi + 1][0] : p.start + p.dur;
  let s = ZOOM[estilo][n % 2];
  let origin = '50% 40%';
  let blur = 0, tx = 0, ty = 0;
  if (angulo === 'multicam') {
    const c = CAMS[n % 3];
    s = c.s; origin = c.o; tx = c.x;
  } else if (angulo === 'pushin') {
    const t = lerp(g, [z0, z1], [0, 1], ease.inOut);
    s = n % 2 ? 1.2 - 0.14 * t : 1 + 0.15 * t;
  }
  if (estilo === 'premium' && p.start === 0) {
    // abertura: entra fechado (1.32) e abre num tranco, com tremida e borrão
    s = lerp(f, [0, 9], [1.32, s], ease.out);
    blur = lerp(f, [0, 4], [6, 0]);
    const sh = shake(f, 0, 10, 16, 'open');
    tx += sh.x; ty = sh.y;
  }
  const grade = estilo === 'premium' ? 'contrast(1.07) saturate(1.1) brightness(1.02)' : 'contrast(1.03) saturate(1.04)';
  const D = p.outF - p.inF;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#000' }}>
      <OffthreadVideo
        src={staticFile(`auxilio/raw${p.clip}.mp4`)}
        startFrom={p.inF}
        endAt={p.outF}
        volume={(x) => Math.max(0, Math.min(1, (x + 1) / 3, (D - x) / 3))}
        style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `translate(${tx}px, ${ty}px) scale(${s})`, transformOrigin: origin,
          filter: `${grade}${blur ? ` blur(${blur}px)` : ''}` }}
      />
    </AbsoluteFill>
  );
};

/* ───────────────────────── legendas ───────────────────────── */
const CapPremium = ({ tl, hideAt }: { tl: Timeline; hideAt: (g: number) => boolean }) => {
  const g = useCurrentFrame(); const { fps } = useVideoConfig();
  const gs = React.useMemo(() => groups(tl, 3), [tl]);
  if (hideAt(g)) return null;
  const gp = gs.find((x) => g >= x.start && g < x.end);
  if (!gp) return null;
  const enter = spring({ frame: g - gp.start, fps, config: SPR });
  return (
    <AbsoluteFill style={{ alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 1170, width: 920, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px 34px',
        transform: `scale(${0.85 + 0.15 * enter}) translateY(${(1 - enter) * 20}px)`, opacity: enter }}>
        {gp.words.map((w, i) => {
          const said = g >= w.g, active = said && g < w.ge + 2;
          const pop = spring({ frame: g - w.g, fps, config: { damping: 12, stiffness: 220, mass: 0.5 } });
          return (
            <span key={i} style={{ fontFamily: font.ui, fontWeight: 900, fontSize: 82, lineHeight: 1.1, letterSpacing: -1.5, textTransform: 'uppercase',
              color: w.k && said ? C.ink : active ? C.y : C.white, background: w.k && said ? C.y : 'transparent', padding: w.k ? '0 14px' : 0, borderRadius: 14,
              textShadow: w.k && said ? 'none' : '0 4px 18px rgba(0,0,0,.65), 0 0 3px rgba(0,0,0,.9)',
              transform: `scale(${active ? 1 + 0.05 * pop : 1}) rotate(${w.k && said ? -2 : 0}deg)`, display: 'inline-block' }}>
              {w.w.replace(/[,.:]$/, '')}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** legenda "nativa": frase curta, branca com contorno preto, sem animação — cara de vídeo orgânico */
const CapNativa = ({ tl, top }: { tl: Timeline; top: number }) => {
  const g = useCurrentFrame();
  const gs = React.useMemo(() => groups(tl, 4), [tl]);
  const gp = gs.find((x) => g >= x.start && g < x.end);
  if (!gp) return null;
  return (
    <AbsoluteFill style={{ alignItems: 'center' }}>
      <div style={{ position: 'absolute', top, width: 900, textAlign: 'center', fontFamily: font.ui, fontWeight: 800, fontSize: 68, lineHeight: 1.15,
        color: C.white, WebkitTextStroke: '12px #000', paintOrder: 'stroke fill', letterSpacing: -0.5 }}>
        {gp.words.map((w) => w.w).join(' ')}
      </div>
    </AbsoluteFill>
  );
};

/* ───────────────────────── efeitos (premium) ───────────────────────── */
type Ov = { from: number; to: number; node: React.ReactNode; sfx: [number, string, number][] };

const useIn = (from: number, to: number) => {
  const g = useCurrentFrame(); const { fps } = useVideoConfig();
  const k = spring({ frame: g - from, fps, config: SPR });
  const o = lerp(g, [to - 7, to], [1, 0], ease.in);
  return { g, fps, k, o };
};

/** carimbo: palavra em caixa alta dentro de borda grossa, entra batendo */
const Stamp = ({ from, to, text, color, sub }: { from: number; to: number; text: string; color: string; sub?: string }) => {
  const { g, fps, o } = useIn(from, to);
  const k = spring({ frame: g - from, fps, config: { damping: 11, stiffness: 260, mass: 0.7 } });
  const sh = shake(g, from + 3, 10, 14, text);
  return (
    <AbsoluteFill style={{ alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 250, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: o,
        transform: `translate(${sh.x}px, ${sh.y}px) scale(${2.1 - 1.1 * k}) rotate(-6deg)` }}>
        <div style={{ fontFamily: font.display, fontSize: text.length > 10 ? 80 : 104, lineHeight: 1, color, whiteSpace: 'nowrap', border: `9px solid ${color}`, borderRadius: 18, padding: '10px 30px 6px',
          background: 'rgba(255,255,255,.9)', boxShadow: '0 20px 50px rgba(0,0,0,.25)', letterSpacing: 1 }}>{text}</div>
        {sub && <div style={{ fontFamily: font.ui, fontWeight: 800, fontSize: 36, color: C.white, background: C.ink, padding: '8px 22px', borderRadius: 30 }}>{sub}</div>}
      </div>
      <AbsoluteFill style={{ backgroundColor: '#fff', opacity: flash(g, from + 2, 3) }} />
    </AbsoluteFill>
  );
};

/** cartão de vidro no alto (acima da cabeça) com itens que entram no tempo da fala */
const ListCard = ({ from, to, title, items, mark, color }: { from: number; to: number; title: string; items: { label: string; f: number }[];
  mark: 'check' | 'x' | 'step'; color: string }) => {
  const { g, fps, k, o } = useIn(from, to);
  const done = items.filter((x) => g >= x.f).length;
  const row = mark === 'step';
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 60, right: 60, top: 215, borderRadius: 34, overflow: 'hidden', opacity: o,
        transform: `translateY(${(1 - k) * -380}px) scale(${0.94 + 0.06 * k})`, boxShadow: '0 30px 70px rgba(0,0,0,.30)', border: '2px solid rgba(255,255,255,.55)' }}>
        <div style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(26px) saturate(1.3)', background: 'rgba(15,39,66,.72)' }} />
        <div style={{ position: 'relative', padding: '22px 34px 26px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <span style={{ fontFamily: font.ui, fontWeight: 900, fontSize: 42, color: C.white, letterSpacing: 0.5 }}>{title}</span>
            {!row && <span style={{ fontFamily: font.ui, fontWeight: 800, fontSize: 38, color }}>{done}/{items.length}</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: row ? 'row' : 'column', flexWrap: 'wrap', gap: row ? '12px 12px' : 6 }}>
            {items.map((it, i) => {
              const on = g >= it.f;
              const p = spring({ frame: g - it.f, fps, config: { damping: 12, stiffness: 220, mass: 0.5 } });
              if (row) return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: on ? 1 : 0.28, transform: `scale(${on ? 0.8 + 0.2 * p : 0.9})`,
                  background: on ? color : 'rgba(255,255,255,.12)', color: on ? C.ink : C.white, borderRadius: 40, padding: '12px 24px',
                  fontFamily: font.ui, fontWeight: 800, fontSize: 44 }}>
                  {i > 0 && <span style={{ opacity: 0.6 }}>→</span>}{it.label}
                </div>
              );
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 22, height: 74 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 22, border: `4px solid ${on ? color : 'rgba(255,255,255,.45)'}`, position: 'relative', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', inset: -1, borderRadius: 22, background: color, transform: `scale(${on ? p : 0})` }} />
                    {on && <svg width={36} height={36} viewBox="0 0 24 24" style={{ position: 'absolute', left: 0, top: 0 }}>
                      <path d={mark === 'check' ? 'M5 12.5l4.5 4.5L19 7.5' : 'M7 7l10 10M17 7L7 17'} fill="none" stroke={C.ink} strokeWidth={3.4} strokeLinecap="round"
                        strokeLinejoin="round" strokeDasharray={30} strokeDashoffset={30 * (1 - lerp(g, [it.f + 2, it.f + 9], [0, 1]))} /></svg>}
                  </div>
                  <span style={{ fontFamily: font.ui, fontWeight: 800, fontSize: 50, color: C.white, opacity: on ? 1 : 0.4,
                    transform: `translateX(${on ? (1 - p) * 30 : 0}px)` }}>{it.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** salário + auxílio, juntos todo mês */
const Soma = ({ from, to, f1, f2 }: { from: number; to: number; f1: number; f2: number }) => {
  const { g, fps, o } = useIn(from, to);
  const pill = (txt: string, f: number, bg: string) => {
    const k = spring({ frame: g - f, fps, config: { damping: 11, stiffness: 230, mass: 0.6 } });
    return (
      <div style={{ fontFamily: font.display, fontSize: 84, lineHeight: 1, color: C.ink, background: bg, padding: '14px 30px 8px', borderRadius: 18,
        transform: `scale(${g >= f ? k : 0}) rotate(${(1 - k) * 8}deg)`, boxShadow: '0 18px 40px rgba(0,0,0,.28)' }}>{txt} ✓</div>
    );
  };
  return (
    <AbsoluteFill style={{ alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, opacity: o }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {pill('SALÁRIO', f1, C.white)}
          <span style={{ fontFamily: font.display, fontSize: 90, color: C.white, opacity: g >= f2 ? 1 : 0, textShadow: '0 4px 18px rgba(0,0,0,.5)' }}>+</span>
          {pill('AUXÍLIO', f2, C.y)}
        </div>
        <div style={{ fontFamily: font.ui, fontWeight: 900, fontSize: 38, color: C.white, background: C.navy, padding: '10px 26px', borderRadius: 30,
          opacity: lerp(g, [f2 + 8, f2 + 14], [0, 1]) }}>OS DOIS, TODO MÊS</div>
      </div>
    </AbsoluteFill>
  );
};

/** CTA: seta pulando apontando pro botão do anúncio + selo "4 perguntas · 1 minuto" */
const Cta = ({ from, to, fq, fadv }: { from: number; to: number; fq: number; fadv: number }) => {
  const { g, fps, k } = useIn(from, to + 999);
  const kq = spring({ frame: g - fq, fps, config: SPR });
  const ka = spring({ frame: g - fadv, fps, config: SPR });
  const bob = Math.abs(Math.sin((g - from) / 6)) * 26;
  return (
    <AbsoluteFill style={{ alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 250, opacity: ka, transform: `translateY(${(1 - ka) * -200}px)`, display: 'flex', alignItems: 'center', gap: 18,
        background: C.white, borderRadius: 26, padding: '18px 30px', boxShadow: '0 24px 60px rgba(0,0,0,.28)' }}>
        <span style={{ fontSize: 70 }}>⚖️</span>
        <span style={{ fontFamily: font.ui, fontWeight: 900, fontSize: 52, color: C.ink, lineHeight: 1.15 }}>Uma advogada analisa<br />o seu caso</span>
      </div>
      <div style={{ position: 'absolute', top: 1385, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{ fontFamily: font.ui, fontWeight: 900, fontSize: 52, color: C.ink, background: C.y, padding: '14px 34px', borderRadius: 40,
          transform: `scale(${kq})`, boxShadow: '0 14px 30px rgba(0,0,0,.3)' }}>4 perguntas · 1 minuto</div>
        <svg width={110} height={110} viewBox="0 0 24 24" style={{ transform: `translateY(${bob}px) scale(${k})`, filter: 'drop-shadow(0 6px 12px rgba(0,0,0,.45))' }}>
          <path d="M12 4v15M5 12l7 7 7-7" fill="none" stroke={C.y} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

const overlays = (tl: Timeline, hook: HookId, body: BodyId): Ov[] => {
  const out: Ov[] = [];
  const A = (k: string, w?: string) => at(tl, k, w);
  const push = (from: number | null, to: number | null, node: (a: number, b: number) => React.ReactNode, sfx: (a: number) => [number, string, number][]) => {
    if (from == null || to == null) return;
    out.push({ from, to, node: node(from, to), sfx: sfx(from) });
  };
  const list = (title: string, k0: string, k1: string, w0: string | undefined, defs: [string, string, string][], mark: 'check' | 'x' | 'step', color: string) => {
    const items = defs.map(([label, k, w]) => ({ label, f: A(k, w)! })).filter((x) => x.f != null);
    push(A(k0, w0), endOf(tl, k1), (a, b) => <ListCard from={a} to={b + 8} title={title} items={items} mark={mark} color={color} />,
      (a) => [[a - 3, 'whoosh', 0.3], ...items.map((x): [number, string, number] => [x.f, 'pop', 0.32])]);
  };
  const stamp = (k: string, w: string, kEnd: string, text: string, color: string, sub?: string, extra = 10) => {
    const f = A(k, w), e = endOf(tl, kEnd);
    push(f, e == null ? null : Math.max(e + extra, (f ?? 0) + 40), (a, b) => <Stamp from={a} to={b} text={text} color={color} sub={sub} />,
      (a) => [[a, 'impact', 0.45], [a + 2, 'flash', 0.2]]);
  };

  // hooks
  if (hook === 'h1') stamp('8559:0', 'inss', '8559:0', 'INSS', C.navy, 'benefício pago todo mês');
  if (hook === 'h2') stamp('8560:1', 'presta', '8560:1', 'ATENÇÃO', C.red, undefined, 6);
  if (hook === 'h3') stamp('8561:1', 'erro', '8561:1', 'ERRO COMUM', C.red, undefined, 8);
  if (hook === 'h4') stamp('8562:1', 'conta', '8562:1', 'TAMBÉM CONTA', C.green, undefined, 8);

  // história (8566)
  list('O QUE ACONTECEU', '8566:1', '8566:2', undefined,
    [['Escorregou', '8566:1', 'escorrega'], ['Quebrou o punho', '8566:1', 'punho'], ['Afastada', '8566:1', 'afastada'], ['Voltou', '8566:2', 'volta']], 'step', C.y);
  list('O QUE FICOU', '8566:4', '8566:5', undefined,
    [['Dói pra carregar sacola', '8566:4', 'sacola'], ['Falta força pra abrir pote', '8566:4', 'pote'], ['Esforço em dobro', '8566:5', 'dobro']], 'x', C.red);
  stamp('8566:7', 'auxílio', '8566:7', 'AUXÍLIO-ACIDENTE', C.navy, 'pode ser o seu caso', 14);

  // explicação (8565)
  if (body === 'a') stamp('8565:0', 'auxílio', '8565:0', 'AUXÍLIO-ACIDENTE', C.navy);
  list('QUALQUER ACIDENTE', '8565:1', '8565:1', 'acidente',
    [['No trabalho', '8565:1', 'trabalho'], ['No trânsito', '8565:1', 'trânsito'], ['Em casa', '8565:1', 'casa']], 'step', C.y);
  list('SEQUELAS QUE CONTAM', '8565:2', '8565:3', undefined,
    [['Perda de força', '8565:2', 'força'], ['Dor pra carregar peso', '8565:2', 'peso'], ['Movimento que não voltou', '8565:3', 'movimento']], 'check', C.green);
  list('QUEM PODE PEDIR', '8565:4', '8565:5', 'é',
    [['Carteira assinada na época', '8565:4', 'carteira'], ['Trabalhadora doméstica', '8565:5', 'doméstica'], ['Trabalhadora rural', '8565:5', 'rural']], 'check', C.y);
  {
    const f1 = A('8565:7', 'salário'), f2 = A('8565:7', 'auxílio');
    push(f1 == null ? null : f1 - 4, endOf(tl, '8565:7'), (a, b) => <Soma from={a} to={b + 6} f1={f1!} f2={f2!} />,
      () => [[f1!, 'pop', 0.4], [f2!, 'pop', 0.4], [f2! + 10, 'shimmer', 0.25]]);
  }
  {
    const f = A('8565:10'), fq = A('8565:10', 'quatro'), fa = A('8565:10', 'advogada');
    push(f, tl.total, (a, b) => <Cta from={a} to={b} fq={fq!} fadv={fa!} />, (a) => [[a, 'whoosh', 0.3], [A('8565:10', 'botão')!, 'click', 0.55], [fq!, 'pop', 0.35], [fa!, 'ding', 0.25]]);
  }
  return out;
};

/* ───────────────────────── manchete ───────────────────────── */
const Faixa = ({ tl, hook }: { tl: Timeline; hook: HookId }) => {
  const g = useCurrentFrame(); const { fps } = useVideoConfig();
  const fcta = at(tl, '8565:9') ?? tl.total;
  const cta = g >= fcta;
  const [l1, l2] = cta ? ['Veja se o seu caso', 'se encaixa ↓'] : HOOKS[hook].manchete;
  const k = spring({ frame: g - (cta ? fcta : 0), fps, config: SPR });
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 470, background: `linear-gradient(180deg, ${C.navy} 0%, #16385E 100%)`,
        boxShadow: '0 10px 40px rgba(0,0,0,.35)', borderBottom: `8px solid ${C.y}` }}>
        <div style={{ position: 'absolute', left: 70, right: 70, top: 222, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontFamily: font.ui, fontWeight: 800, fontSize: 30, letterSpacing: 3, color: C.y }}>AUXÍLIO-ACIDENTE · INSS</span>
          <div style={{ fontFamily: font.ui, fontWeight: 900, fontSize: 62, lineHeight: 1.08, color: C.white, letterSpacing: -1.5, whiteSpace: 'nowrap',
            opacity: k, transform: `translateY(${(1 - k) * 18}px)` }}>
            {l1}<br /><span style={{ color: C.y }}>{l2}</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ───────────────────────── composição ───────────────────────── */
const NUNCA = () => false;
export const auxFrames = (hook: HookId, body: BodyId) => build(hook, body).total;

export const AuxAd = ({ hook, body, estilo, angulo = 'padrao' }: { hook: HookId; body: BodyId; estilo: Estilo; angulo?: Angulo }) => {
  const g = useCurrentFrame();
  const tl = build(hook, body);
  const ovs = React.useMemo(() => (estilo === 'premium' ? overlays(tl, hook, body) : []), [tl, hook, body, estilo]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {tl.pieces.map((p) => (
        <Sequence key={p.key} from={p.start} durationInFrames={p.dur} layout="none">
          <Clip p={p} estilo={estilo} angulo={angulo} />
        </Sequence>
      ))}
      {estilo === 'premium' && (
        <>
          <AbsoluteFill style={{ background: 'radial-gradient(ellipse 80% 62% at 50% 42%, transparent 58%, rgba(0,0,0,0.30) 100%)' }} />
          <Img src={staticFile(`grain${0}.png`)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.035, mixBlendMode: 'overlay' }} />
          {ovs.map((o, i) => (g >= o.from && g < o.to ? <React.Fragment key={i}>{o.node}</React.Fragment> : null))}
          <CapPremium tl={tl} hideAt={NUNCA} />
          <Sequence durationInFrames={60} layout="none"><Audio src={staticFile('sfx/impact.wav')} volume={0.5} /></Sequence>
          <Sequence durationInFrames={60} layout="none"><Audio src={staticFile('sfx/whoosh.wav')} volume={0.3} /></Sequence>
          {ovs.flatMap((o) => o.sfx).filter(([f]) => f != null && !Number.isNaN(f)).map(([f, n, v], i) => (
            <Sequence key={`s${i}`} from={Math.max(0, f)} durationInFrames={60} layout="none"><Audio src={staticFile(`sfx/${n}.wav`)} volume={v} /></Sequence>
          ))}
          <AbsoluteFill style={{ backgroundColor: '#fff', opacity: flash(g, 0, 3) }} />
        </>
      )}
      {estilo === 'nativo' && <CapNativa tl={tl} top={1190} />}
      {estilo === 'manchete' && (<><Faixa tl={tl} hook={hook} /><CapNativa tl={tl} top={1240} /></>)}
    </AbsoluteFill>
  );
};
