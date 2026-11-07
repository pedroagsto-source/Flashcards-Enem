import { AbsoluteFill, Audio, Img, interpolate, random, Sequence, spring, staticFile, useCurrentFrame } from 'remotion';
import { font } from '../brand';
import { chunks, cutoutSrc, E, S, TOTAL, wordFrame } from '../lib';
import ROSTO from '../data/rosto.json';

/** F8 · "Uma IA editou este vídeo" com a fala original (gancho + corpo, EDL já cortado).
 *  Você é recortado e colocado num cenário neon verde; cada frase ganha um HUD mostrando a IA trabalhando. */
const FPS = 30;
const G = '#3DFF7A', DK = '#04140A', RED = '#FF4A3D';
export const F8_FRAMES = TOTAL;
const cl = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const L = (f: number, a: number[], b: number[]) => interpolate(f, a, b, cl);
const pop = (f: number, d = 0, c = { damping: 12, stiffness: 220, mass: 0.6 }) => spring({ frame: f - d, fps: FPS, config: c });
const W = (i: number, w: string) => wordFrame(i, w);
/* caixa do rosto no quadro a (x, y, w, h), com folga */
const R = (a: number) => { const [x, y, w, h] = (ROSTO as number[][])[Math.min(a, ROSTO.length - 1)]; return { x: x - 30, y: y - 40, w: w + 60, h: h + 120 }; };

type P = { g: number; a: number };
type Cena = [id: string, ini: number, fim: number, C: React.FC<P>];

/* ---------------- cenário neon verde ---------------- */
const NeonVerde = ({ a }: { a: number }) => {
  const pulso = 0.85 + 0.15 * Math.sin(a / 9);
  return <AbsoluteFill>
    <AbsoluteFill style={{ background: 'radial-gradient(60% 45% at 50% 38%, rgba(61,255,122,.22), transparent 70%), linear-gradient(180deg,#03150a,#010603 70%)' }} />
    {[80, 240, 840, 990].map((x, i) => <div key={x} style={{ position: 'absolute', top: 0, bottom: 0, left: x, width: 12, background: G, opacity: (i < 2 ? .9 : .7) * (i === 2 ? pulso : 1),
      boxShadow: `0 0 36px ${G}, 0 0 120px ${G}, 0 0 240px rgba(61,255,122,.6)` }} />)}
    {[[0, 360], [0, 600], [760, 440], [760, 680]].map(([x, y], i) => <div key={i} style={{ position: 'absolute', left: x, top: y, width: 320, height: 10, background: '#0c2a16', boxShadow: '0 0 24px rgba(61,255,122,.5)' }} />)}
    {Array.from({ length: 9 }, (_, i) => { const x = random(`bx${i}`) * 1080, y = random(`by${i}`) * 1100, s = 14 + random(`bs${i}`) * 26;
      return <div key={i} style={{ position: 'absolute', left: x, top: y + Math.sin((a + i * 20) / 40) * 8, width: s, height: s, borderRadius: '50%', background: G, filter: 'blur(10px)', opacity: .3 }} />; })}
  </AbsoluteFill>;
};
const Pessoa = ({ a, style = {} }: { a: number; style?: React.CSSProperties }) =>
  <Img src={cutoutSrc(a)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...style }} />;
const Palco = ({ a, z = 1 }: { a: number; z?: number }) => <><NeonVerde a={a} /><Pessoa a={a} style={{ transform: `scale(${z})`, transformOrigin: '50% 38%' }} /></>;

/* ---------------- peças de HUD ---------------- */
const mono: React.CSSProperties = { fontFamily: '"DejaVu Sans Mono", monospace', fontSize: 22, letterSpacing: 1.2, color: G };
const Tag = ({ x, y, t, d = 0, g, big }: { x: number; y: number; t: string; d?: number; g: number; big?: boolean }) => {
  if (g < d) return null; const k = pop(g, d);
  return <div style={{ position: 'absolute', left: x, top: y, background: G, ...mono, color: DK, fontWeight: 700, fontSize: big ? 30 : 20, padding: big ? '6px 14px' : '4px 10px', transform: `scale(${k})`, transformOrigin: '0 50%', whiteSpace: 'nowrap' }}>{t}</div>;
};
const Hud = ({ a, b }: { a: string; b: string }) => <div style={{ position: 'absolute', left: 28, right: 28, top: 28, display: 'flex', justifyContent: 'space-between', ...mono }}><span>● {a}</span><span>{b}</span></div>;
const Card = ({ x, y, w, h, children, borda = 'rgba(61,255,122,.5)', k = 1 }: { x: number; y: number; w: number; h?: number; children: React.ReactNode; borda?: string; k?: number }) =>
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, background: 'rgba(2,16,8,.86)', border: `2px solid ${borda}`, borderRadius: 24, overflow: 'hidden', padding: 26, transform: `scale(${.92 + .08 * k})`, opacity: k }}>{children}</div>;
const Onda = ({ n, a, cortes = [], ativa = -1 }: { n: number; a: number; cortes?: number[]; ativa?: number }) => <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 90 }}>
  {Array.from({ length: n }, (_, i) => { const h = 12 + Math.abs(Math.sin(i * 1.7 + a / 12) * 60) + (i % 5) * 6; const c = cortes.includes(i) ? RED : i === ativa || i === ativa + 1 ? G : 'rgba(61,255,122,.35)';
    return <i key={i} style={{ width: 8, height: h, background: c, borderRadius: 4 }} />; })}</div>;
const Janela = ({ g, a, y = 180, h = 660 }: { g: number; a: number; y?: number; h?: number }) => <div style={{ position: 'absolute', left: 60, top: y, width: 960, height: h, borderRadius: 24, overflow: 'hidden', border: '2px solid rgba(61,255,122,.5)', transform: `scale(${.9 + .1 * pop(g)})` }}>
  <div style={{ position: 'absolute', inset: 0 }}><NeonVerde a={a} /></div><Pessoa a={a} style={{ inset: 'auto', left: 0, top: -380, width: 960, height: 1707 }} /></div>;
const Arquivo = ({ x, y, t, sub, k }: { x: number; y: number; t: string; sub: string; k: number }) => <div style={{ position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'center', gap: 18, background: '#F5F2EA', color: '#1b1b1f', borderRadius: 24, padding: '18px 26px',
  boxShadow: `0 0 0 4px ${G}, 0 30px 60px rgba(0,0,0,.5)`, transform: `scale(${k}) rotate(${(1 - k) * -10}deg)`, fontFamily: font.ui }}>
  <span style={{ background: '#E8643C', color: '#fff', borderRadius: 10, padding: '14px 10px', fontWeight: 900, fontSize: 22 }}>.MD</span><span><b style={{ display: 'block', fontSize: 40, fontWeight: 900 }}>{t}</b><span style={{ fontSize: 24, color: '#777', fontWeight: 600 }}>{sub}</span></span></div>;
const Grande = ({ t, cor = '#fff', g, d, y, size = 118 }: { t: string; cor?: string; g: number; d: number; y: number; size?: number }) => {
  if (g < d) return null; const k = pop(g, d, { damping: 10, stiffness: 260, mass: .5 });
  return <div style={{ position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', fontFamily: font.ui, fontWeight: 900, fontSize: size, lineHeight: 1, letterSpacing: -3, color: cor, transform: `scale(${1.4 - .4 * k})`, textShadow: '0 8px 40px rgba(0,0,0,.75)' }}>{t}</div>;
};

/* ---------------- cenas (uma por trecho da fala) ---------------- */
const Gancho: React.FC<P> = ({ g, a }) => { const m = W(1, 'manualmente'); const r = R(a);
  return <><Palco a={a} z={a < m ? 1 : 1.12} /><Hud a="VISÃO COMPUTACIONAL · ANALISANDO" b="EDITOR: VOCÊ" />
    <Grande t="ADVOGADO," g={g} d={0} y={170} /><Grande t="AINDA EDITA" g={a} d={W(1, 'editando')} y={300} size={84} /><Grande t="NA MÃO?" cor={G} g={a} d={m} y={400} size={130} />
    <div style={{ position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, border: `4px solid ${RED}`, boxShadow: `0 0 24px ${RED}`, opacity: a >= m ? 1 : 0 }} /><Tag x={r.x} y={r.y - 38} t="EDITOR: VOCÊ ✕" g={a} d={m} /></>; };

const Visao: React.FC<P> = ({ g, a }) => { const ia = W(3, 'intelig'), arq = W(3, 'arquivo'); const r = R(a);
  return <><Palco a={a} /><Hud a="VISÃO COMPUTACIONAL · RECONHECENDO" b={`OBJETOS 0${Math.min(5, 1 + Math.floor(g / 8))}`} />
    <div style={{ position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, border: `4px solid ${G}`, boxShadow: `0 0 24px ${G}`, transform: `scale(${pop(g)})` }} />
    <Tag x={r.x} y={r.y - (a >= ia ? 52 : 38)} t={a < ia ? 'EDITOR: …' : 'EDITOR: IA ✓'} g={g} big={a >= ia} /><Tag x={r.x + r.w - 40} y={r.y + 30} t="ROSTO 0,96" d={6} g={g} /><Tag x={Math.max(10, r.x - 80)} y={r.y + r.h * .38} t="OLHOS" d={10} g={g} /><Tag x={r.x + r.w - 40} y={r.y + r.h * .78} t="BOCA" d={14} g={g} />
    {a >= arq && <Arquivo x={250} y={200} t="CHIP_ADV.md" sub="1 arquivo de IA" k={pop(a, arq)} />}</>; };

const Bruto: React.FC<P> = ({ g, a }) => { const n = Math.round(L(g, [8, 80], [2, 20])); const cortes = [3, 4, 9, 14, 15, 22, 27, 28, 35, 40, 41, 48, 52, 57, 61, 66, 70, 75, 80, 84].slice(0, n);
  return <><NeonVerde a={a} /><Janela g={g} a={a} h={560} />
    <Card x={600} y={600} w={400} k={pop(g, 6)}><div style={mono}>ANÁLISE DO BRUTO</div><div style={{ fontFamily: font.ui, fontWeight: 900, fontSize: 104, lineHeight: 1, color: '#fff' }}>{n} <span style={{ fontSize: 34 }}>pausas</span></div><div style={{ ...mono, color: '#9fe8b6' }}>gravação de celular</div></Card>
    <Card x={60} y={880} w={960} k={pop(g, 4)}><div style={{ ...mono, marginBottom: 18 }}>LINHA DO TEMPO · CORTES EM VERMELHO</div><Onda n={90} a={0} cortes={cortes} /><div style={{ ...mono, marginTop: 14, color: '#9fe8b6' }}>0:52 → 0:41</div></Card></>; };

const Fundo: React.FC<P> = ({ g, a }) => { const t = L(g, [0, 26], [0, 1]); const uau = W(6, 'ficou');
  return <><AbsoluteFill style={{ background: '#000' }} />
    <div style={{ position: 'absolute', left: 120 - 60 * t, top: 300, width: 600, height: 1066, border: `3px solid ${G}`, transform: `perspective(1800px) rotateY(${25 * t}deg)`, background: '#16161a', opacity: .7 }}>
      <div style={{ position: 'absolute', left: 12, top: 12, background: G, ...mono, color: DK, fontWeight: 700, fontSize: 20, padding: '4px 10px' }}>02 · FUNDO ANTIGO</div></div>
    <div style={{ position: 'absolute', left: 320, top: 220, width: 660, height: 1173, overflow: 'hidden', border: `3px solid ${G}`, boxShadow: '0 0 60px rgba(61,255,122,.5)', transform: `perspective(1800px) rotateY(${25 * t}deg)`, opacity: t }}><NeonVerde a={a} /></div>
    {a >= uau && <AbsoluteFill style={{ opacity: L(a, [uau, uau + 8], [0, 1]) }}><NeonVerde a={a} /></AbsoluteFill>}
    <Pessoa a={a} style={{ filter: `drop-shadow(0 0 20px ${G})` }} /><Tag x={60} y={240} t="01 · VOCÊ" g={g} /><Tag x={740} y={180} t="03 · CENÁRIO NOVO" d={16} g={g} />
    {a >= uau && <Grande t="OLHA COMO FICOU" cor={G} g={a} d={uau} y={200} size={86} />}</>; };

const Comando: React.FC<P> = ({ g, a }) => { const anexa = W(7, 'anexa'), mapa = W(8, 'mapa'); const txt = 'Roda o CHIP ADV.'; const n = Math.floor(L(a, [mapa + 8, mapa + 34], [0, txt.length]));
  return <><Palco a={a} /><Card x={60} y={170} w={960} k={pop(g)}><div style={{ ...mono, marginBottom: 16 }}>✦ SUA IA · CONVERSA</div>
    <div style={{ display: 'flex', gap: 14, marginBottom: 20, minHeight: 50 }}>
      {a >= anexa && <span style={{ background: '#0e3b1f', border: `2px solid ${G}`, borderRadius: 12, padding: '6px 16px', fontFamily: font.ui, fontWeight: 800, fontSize: 26, color: '#fff', transform: `scale(${pop(a, anexa)})` }}>📄 CHIP_ADV.md</span>}
      {a >= mapa && <span style={{ background: '#0e3b1f', border: `2px solid ${G}`, borderRadius: 12, padding: '6px 16px', fontFamily: font.ui, fontWeight: 800, fontSize: 26, color: '#fff', transform: `scale(${pop(a, mapa)})` }}>🗺 mapa-17-efeitos.pdf</span>}</div>
    <div style={{ fontFamily: font.ui, fontWeight: 800, fontSize: 40, color: n > 0 ? '#fff' : '#777' }}>{n > 0 ? txt.slice(0, n) : 'Escreva ou solte um arquivo'}<span style={{ color: G, opacity: a % 16 < 8 ? 1 : 0 }}>|</span></div></Card></>; };

const Escolhe: React.FC<P> = ({ g, a }) => { const pts = [[220, 1180], [280, 1260], [360, 1230], [640, 1200], [720, 1280], [790, 1236]].map(([x, y], i) => [x + Math.sin((a + i * 7) / 8) * 14, y + Math.cos((a + i * 5) / 9) * 12]);
  const tags: [string, number, number, number][] = [['CONTEÚDO', W(9, 'conte'), 140, 900], ['ESTILO', W(10, 'estilo'), 620, 960], ['SITUAÇÃO', W(11, 'situa'), 330, 1060]];
  return <><Palco a={a} /><Hud a="RASTREIO DE MOVIMENTO" b={`${Math.min(21, 6 + Math.floor(g / 6))} PONTOS`} />
    <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}><polyline points={pts.slice(0, 3).map((p) => p.join(',')).join(' ')} stroke={G} strokeWidth={4} fill="none" /><polyline points={pts.slice(3).map((p) => p.join(',')).join(' ')} stroke={G} strokeWidth={4} fill="none" />
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={9} fill={G} />)}</svg>
    {tags.map(([t, d, x, y]) => <Tag key={t} x={x} y={y} t={`${t} ✓`} d={d} g={a} big />)}</>; };

const Ordens: React.FC<P> = ({ g, a }) => { const ps = [12, 13].flatMap((i) => chunks[i].words.map((w) => ({ ...w, g: chunks[i].start + w.s, ge: chunks[i].start + w.e })));
  const at = ps.findIndex((p) => a >= p.g && a < p.ge + 2);
  return <><NeonVerde a={a} /><Janela g={g} a={a} /><Card x={60} y={880} w={960} k={pop(g, 4)}><div style={{ ...mono, marginBottom: 18 }}>TRANSCRIÇÃO · PALAVRA POR PALAVRA</div>
    <div style={{ fontFamily: font.ui, fontWeight: 800, fontSize: 42, marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: '6px 12px' }}>{ps.map((p, i) => <span key={i} style={{ color: i === at ? DK : i < at ? '#fff' : 'rgba(255,255,255,.4)', background: i === at ? G : 'transparent', padding: '0 10px', borderRadius: 10 }}>{p.w.replace(/[,.?]$/, '')}</span>)}</div>
    <Onda n={90} a={a} ativa={Math.floor(L(g, [0, E(13) - S(12)], [0, 88]))} /></Card></>; };

const Moderno: React.FC<P> = ({ g, a }) => { const z = L(g, [0, 16], [1, 1.16]); const r = R(a); const cx = 540, cy = 1920 * .38;
  const bx = cx + (r.x - cx) * z, by = cy + (r.y - cy) * z;
  return <><Palco a={a} z={z} /><Hud a="ZOOM AUTOMÁTICO · ÂNCORA: ROSTO" b={`${z.toFixed(2).replace('.', ',')}×`} />
    <div style={{ position: 'absolute', left: bx, top: by, width: r.w * z, height: r.h * z, border: `4px dashed ${G}` }} /><Tag x={bx} y={by - 38} t="AUTOMÁTICO ✓" g={g} />
    <Tag x={60} y={200} t="LEGENDA ✓" d={W(14, 'melhor') - S(14)} g={g} big /><Tag x={680} y={260} t="EFEITOS ✓" d={W(15, 'moderno') - S(14)} g={g} big /><Tag x={420} y={320} t="TRILHA ✓" d={W(15, 'edi') - S(14)} g={g} big /></>; };

const Chip: React.FC<P> = ({ g, a }) => { const itens = ['Cortes', 'Legenda', 'Zoom', 'Cenário', 'Efeitos', 'Trilha']; const fim = W(17, 'chip');
  return <><Palco a={a} /><Card x={150} y={180} w={780} k={pop(g)}><div style={{ ...mono, marginBottom: 14 }}>CHIP ADV · EDIÇÃO</div>
    {itens.map((t, i) => { const on = g >= 6 + i * 6; return <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 20, height: 62, fontFamily: font.ui, fontWeight: 800, fontSize: 40, color: on ? '#fff' : 'rgba(255,255,255,.35)' }}>
      <span style={{ width: 42, height: 42, borderRadius: 21, border: `4px solid ${G}`, background: on ? G : 'transparent', color: DK, display: 'grid', placeItems: 'center', fontSize: 26 }}>{on ? '✓' : ''}</span>{t}</div>; })}</Card>
    {a >= fim && <div style={{ position: 'absolute', left: 230, top: 760, background: DK, border: `4px solid ${G}`, borderRadius: 28, padding: '20px 36px', fontFamily: font.ui, fontWeight: 900, fontSize: 52, color: G, boxShadow: '0 0 60px rgba(61,255,122,.6)', transform: `rotate(-4deg) scale(${pop(a, fim, { damping: 9, stiffness: 300, mass: .6 })})` }}>1 ÚNICO CHIP ✓</div>}</>; };

const Cta: React.FC<P> = ({ a }) => { const s = W(18, 'saiba'), doc = W(19, 'documentinho'), mag = W(20, 'mágica'); const click = s + 8, press = a >= click && a < click + 6 ? .92 : 1;
  const cx = L(a, [s - 10, click - 1], [900, 640]), cy = L(a, [s - 10, click - 1], [1560, 1330]); const t0 = (a - mag) / FPS;
  return <><Palco a={a} />
    {a >= s - 4 && <div style={{ position: 'absolute', left: 0, right: 0, top: 1260, display: 'flex', justifyContent: 'center' }}><div style={{ background: G, color: DK, fontFamily: font.ui, fontWeight: 900, fontSize: 64, padding: '30px 70px', borderRadius: 999, boxShadow: '0 0 60px rgba(61,255,122,.7)', transform: `scale(${pop(a, s - 4) * press * (1 + .04 * Math.sin(a / 3))})` }}>Saiba mais →</div></div>}
    {a >= s - 10 && a < click + 20 && <svg width={100} height={100} viewBox="0 0 24 24" style={{ position: 'absolute', left: cx, top: cy }}><path d="M4 2l16 9-7 2-3 7z" fill="#fff" stroke="#111" strokeWidth={1.3} /></svg>}
    {a >= doc && <Arquivo x={250} y={220} t="CHIP_ADV.md" sub="prompt mestre · 17 efeitos" k={pop(a, doc)} />}
    {a >= mag && <>{Array.from({ length: 30 }).map((_, j) => { const ang = random(`m${j}`) * Math.PI * 2, r = 80 + 700 * t0 * (.4 + random(`r${j}`));
      return <div key={j} style={{ position: 'absolute', left: 540 + Math.cos(ang) * r, top: 360 + Math.sin(ang) * r, fontSize: 30 + 36 * random(`s${j}`), color: j % 3 ? G : '#fff', opacity: L(t0, [.4, 1.6], [1, 0]) }}>✦</div>; })}
      <Grande t="✦ MÁGICA ✦" cor={G} g={a} d={mag} y={480} size={110} /></>}</>; };

const CENAS: Cena[] = [['gancho', 0, S(2), Gancho], ['visao', S(2), S(4), Visao], ['bruto', S(4), S(5), Bruto], ['fundo', S(5), S(7), Fundo], ['comando', S(7), S(9), Comando],
  ['escolhe', S(9), S(12), Escolhe], ['ordens', S(12), S(14), Ordens], ['moderno', S(14), S(16), Moderno], ['chip', S(16), S(18), Chip], ['cta', S(18), TOTAL, Cta]];

/* legenda palavra por palavra (palavras do EDL), escondida onde a tela já mostra o texto */
type Pw = { w: string; g: number; ge: number; k: boolean; i: number };
const PALAVRAS: Pw[] = chunks.flatMap((c) => c.words.map((w) => ({ w: w.w, g: c.start + w.s, ge: c.start + w.e, k: w.k, i: c.i })));
const Legenda = () => { const a = useCurrentFrame(); if (a < S(2) || (a >= S(12) && a < S(14))) return null;
  const at = PALAVRAS.find((p) => a >= p.g && a < p.ge + 2); if (!at) return null;
  const ps = PALAVRAS.filter((p) => p.i === at.i); const i = ps.indexOf(at); const ini = Math.floor(i / 3) * 3; const grupo = ps.slice(ini, ini + 3);
  const y = a >= S(18) ? 1100 : a >= S(4) && a < S(5) ? 1500 : 1420;
  return <div style={{ position: 'absolute', left: 60, right: 60, top: y, textAlign: 'center', fontFamily: font.ui, fontWeight: 900, fontSize: 72, lineHeight: 1.1, textTransform: 'uppercase', textShadow: '0 4px 20px rgba(0,0,0,.85)' }}>
    {grupo.map((p, j) => <span key={j} style={{ color: p === at || (p.k && a >= p.g) ? G : '#fff', marginRight: 18 }}>{p.w.replace(/[,.?!]$/, '')}</span>)}</div>; };

const SFX: [number, string, number][] = [[0, 'impact', .55], [W(1, 'manualmente'), 'erro', .35], [S(2), 'whoosh', .35], [W(3, 'intelig'), 'ding', .35], [W(3, 'arquivo'), 'pop', .45],
  [S(4), 'whoosh', .35], ...Array.from({ length: 8 }, (_, i): [number, string, number] => [S(4) + 8 + i * 9, 'tick', .3]), [S(5), 'riser', .3], [W(6, 'ficou'), 'impact', .5], [W(6, 'ficou'), 'shimmer', .4],
  [W(7, 'anexa'), 'pop', .45], [W(8, 'mapa'), 'pop', .45], ...Array.from({ length: 16 }, (_, i): [number, string, number] => [W(8, 'mapa') + 8 + i * 2, 'type', .2]),
  [W(9, 'conte'), 'pop', .4], [W(10, 'estilo'), 'pop', .4], [W(11, 'situa'), 'pop', .4], [S(12), 'whoosh', .3], [S(14), 'whoosh', .35],
  ...Array.from({ length: 6 }, (_, i): [number, string, number] => [S(16) + 6 + i * 6, 'tick', .35]), [W(17, 'chip'), 'impact', .5], [S(18), 'whoosh', .35], [W(18, 'saiba') + 8, 'click', .6], [W(19, 'documentinho'), 'pop', .45], [W(20, 'mágica') - 3, 'shimmer', .5]];

export const F8Ad = () => {
  const a = useCurrentFrame(); const c = CENAS.find(([, i, f]) => a >= i && a < f) || CENAS[CENAS.length - 1]; const C = c[3];
  return <AbsoluteFill style={{ background: '#000' }}>
    <C g={a - c[1]} a={a} />
    <Legenda />
    {chunks.map((k) => <Sequence key={k.i} from={k.start} durationInFrames={k.dur} layout="none"><Audio src={staticFile(`${k.clip}.mp4`)} trimBefore={k.from} /></Sequence>)}
    {SFX.map(([f, n, v], i) => <Sequence key={i} from={Math.max(0, Math.round(f))} durationInFrames={50} layout="none"><Audio src={staticFile(`sfx/${n}.wav`)} volume={v} /></Sequence>)}
    <Audio src={staticFile('music/bed.wav')} volume={(f) => L(f, [0, 10, F8_FRAMES - 20, F8_FRAMES], [0, .14, .14, 0])} />
  </AbsoluteFill>;
};
