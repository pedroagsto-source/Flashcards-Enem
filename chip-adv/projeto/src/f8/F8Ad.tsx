import { AbsoluteFill, Audio, Img, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { font } from '../brand';
import QUADROS from './quadros_previa.json';

/** F8 · "Uma IA editou este vídeo": você fala e a tela mostra a IA fazendo cada coisa. Estilo HUD, cenário neon verde.
 *  Prévia: usa o recorte da gravação do F1 em loop. Com a gravação nova, troque CUT/LOOP pelo recorte novo e CENAS/FALAS pelos tempos reais. */
const FPS = 30;
const G = '#3DFF7A', DK = '#04140A', RED = '#FF4A3D';
const CUT = 'f1/cutout/corpo';
type Cena = [id: string, ini: number, fim: number];
export const CENAS: Cena[] = [['gancho', 0, 3], ['visao', 3, 7], ['ouviu', 7, 13], ['cortes', 13, 17], ['tomada', 17, 26], ['fundo', 26, 30],
  ['maos', 30, 35], ['horas', 35, 41], ['comando', 41, 45], ['cta', 45, 52]];
export const F8_FRAMES = 52 * FPS;
const FALAS: Record<string, string> = {
  gancho: 'Errei, gaguejei, repeti frase e você não percebeu nada disso.',
  visao: 'Porque quem editou esse vídeo não fui eu. Foi uma IA rodando aqui no meu computador.',
  ouviu: 'Primeiro, ela ouviu tudo o que eu disse, palavra por palavra.',
  cortes: 'Encontrou cada erro, cada pausa, cada é, e cortou.',
  tomada: 'Quando eu repeti a frase, ela ficou com a melhor. Colocou essa legenda sincronizada com a minha boca. E esse zoom? Também foi ela.',
  fundo: 'O fundo atrás de mim? Ela recortou e trocou o cenário.',
  maos: 'Cada texto e cada animação aparecem no momento exato da minha fala.',
  horas: 'O que eu levaria horas pra editar na mão, ela entregou em minutos.',
  comando: 'Não abri nenhum programa de edição. Só mandei o vídeo, escrevi o que queria e ela fez.',
  cta: 'Advogado, se você trava na hora de editar, toca em Saiba Mais e vê como funciona.',
};
const CHAVES = ['nada', 'IA', 'palavra', 'erro,', 'pausa,', 'melhor.', 'legenda', 'zoom?', 'recortou', 'cenário.', 'texto', 'animação', 'horas', 'minutos.', 'programa', 'Advogado,', 'Saiba', 'Mais'];
const cl = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const L = (f: number, a: number[], b: number[]) => interpolate(f, a, b, cl);
const pop = (f: number, d = 0, c = { damping: 12, stiffness: 220, mass: 0.6 }) => spring({ frame: f - d, fps: FPS, config: c });
const S = (id: string) => CENAS.find((c) => c[0] === id)![1] * FPS;
const E = (id: string) => CENAS.find((c) => c[0] === id)![2] * FPS;

/* palavras com tempo distribuído pelo peso das vogais dentro de cada cena */
const peso = (w: string) => Math.max(1, (w.toLowerCase().match(/[aeiouáéíóúâêôãõ]/g) || []).length + 0.25 * w.length);
const PALAVRAS = CENAS.flatMap(([id, a, b]) => {
  const ws = FALAS[id].split(' '), tot = ws.reduce((s, w) => s + peso(w), 0), ini = a * FPS + 4, span = (b - a) * FPS - 10;
  let cur = ini;
  return ws.map((w) => { const d = (span * peso(w)) / tot, o = { w, g: Math.round(cur), ge: Math.round(cur + d), id }; cur += d; return o; });
});
const wf = (id: string, w: string) => (PALAVRAS.find((p) => p.id === id && p.w.toLowerCase().startsWith(w.toLowerCase())) || { g: S(id) }).g;

/* ---------------- cenário neon verde ---------------- */
export const NeonVerde = ({ k = 1 }: { k?: number }) => {
  const f = useCurrentFrame(); const pulso = 0.85 + 0.15 * Math.sin(f / 9);
  return <AbsoluteFill>
    <AbsoluteFill style={{ background: 'radial-gradient(60% 45% at 50% 38%, rgba(61,255,122,.22), transparent 70%), linear-gradient(180deg,#03150a,#010603 70%)' }} />
    {[80, 240, 840, 990].map((x, i) => <div key={x} style={{ position: 'absolute', top: 0, bottom: 0, left: x * k, width: 12, background: G, opacity: (i < 2 ? .9 : .7) * (i === 2 ? pulso : 1),
      boxShadow: `0 0 36px ${G}, 0 0 120px ${G}, 0 0 240px rgba(61,255,122,.6)` }} />)}
    {[[0, 360, 320], [0, 600, 320], [760, 440, 320], [760, 680, 320]].map(([x, y, w], i) => <div key={i} style={{ position: 'absolute', left: x, top: y, width: w, height: 10, background: '#0c2a16', boxShadow: '0 0 24px rgba(61,255,122,.5)' }} />)}
    {Array.from({ length: 9 }, (_, i) => { const x = random(`bx${i}`) * 1080, y = random(`by${i}`) * 1100, s = 14 + random(`bs${i}`) * 26;
      return <div key={i} style={{ position: 'absolute', left: x, top: y + Math.sin((f + i * 20) / 40) * 8, width: s, height: s, borderRadius: '50%', background: G, filter: 'blur(10px)', opacity: .3 }} />; })}
  </AbsoluteFill>;
};

/* pessoa recortada (prévia: recorte do F1 em loop) */
const Pessoa = ({ style = {} }: { style?: React.CSSProperties }) => {
  const f = useCurrentFrame(); const n = QUADROS[f % QUADROS.length];
  return <Img src={staticFile(`${CUT}/${String(n).padStart(5, '0')}.webp`)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...style }} />;
};

/* ---------------- peças de HUD ---------------- */
const mono: React.CSSProperties = { fontFamily: '"DejaVu Sans Mono", monospace', fontSize: 22, letterSpacing: 1.2, color: G };
const Tag = ({ x, y, t, d = 0, g }: { x: number; y: number; t: string; d?: number; g: number }) => {
  const k = pop(g, d); return <div style={{ position: 'absolute', left: x, top: y, background: G, ...mono, color: DK, fontWeight: 700, fontSize: 20, padding: '4px 10px', transform: `scale(${k})`, transformOrigin: '0 50%' }}>{t}</div>;
};
const Hud = ({ a, b }: { a: string; b: string }) => <div style={{ position: 'absolute', left: 28, right: 28, top: 28, display: 'flex', justifyContent: 'space-between', ...mono }}><span>● {a}</span><span>{b}</span></div>;
const Card = ({ x, y, w, h, children, borda = 'rgba(61,255,122,.5)' }: { x: number; y: number; w: number; h?: number; children: React.ReactNode; borda?: string }) =>
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, background: 'rgba(2,16,8,.86)', border: `2px solid ${borda}`, borderRadius: 24, overflow: 'hidden', padding: 26 }}>{children}</div>;
const Onda = ({ n, g, cortes = [], ativa = -1 }: { n: number; g: number; cortes?: number[]; ativa?: number }) => <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 90 }}>
  {Array.from({ length: n }, (_, i) => { const h = 12 + Math.abs(Math.sin(i * 1.7 + g / 12) * 60) + (i % 5) * 6; const c = cortes.includes(i) ? RED : i === ativa || i === ativa + 1 ? G : 'rgba(61,255,122,.35)';
    return <i key={i} style={{ width: 8, height: h, background: c, borderRadius: 4 }} />; })}</div>;

/* ---------------- cenas ---------------- */
const Gancho = () => { const g = useCurrentFrame(); const ls: [string, number, string][] = [['ERREI', 0, '#fff'], ['GAGUEJEI', 14, '#fff'], ['E VOCÊ NÃO', 40, G], ['VIU NADA.', 52, G]];
  return <>{<NeonVerde />}<Pessoa /><div style={{ position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center' }}>
    {ls.map(([t, d, c]) => { const k = pop(g, d, { damping: 10, stiffness: 260, mass: .5 }); return <div key={t} style={{ fontFamily: font.ui, fontWeight: 900, fontSize: 118, lineHeight: 1, letterSpacing: -3, color: c, opacity: g >= d ? 1 : 0, transform: `scale(${1.4 - .4 * k})`, textShadow: '0 8px 40px rgba(0,0,0,.7)' }}>{t}</div>; })}
  </div></>; };

const Visao = () => { const g = useCurrentFrame(); const troca = wf('visao', 'IA') - S('visao');
  return <><NeonVerde /><Pessoa /><Hud a="VISÃO COMPUTACIONAL · RECONHECENDO" b={`OBJETOS 0${Math.min(5, 1 + Math.floor(g / 8))}`} />
    <div style={{ position: 'absolute', left: 200, top: 560, width: 460, height: 540, border: `4px solid ${G}`, boxShadow: `0 0 24px ${G}`, transform: `scale(${pop(g)})` }} />
    <Tag x={200} y={522} t={g < troca ? 'EDITOR: VOCÊ' : 'EDITOR: IA ✓'} g={g} />
    <Tag x={600} y={600} t="ROSTO 0,96" d={6} g={g} /><Tag x={130} y={780} t="OLHOS" d={10} g={g} /><Tag x={600} y={1000} t="BOCA" d={14} g={g} /><Tag x={420} y={1150} t="OMBRO" d={18} g={g} /></>; };

const Janela = ({ g, y = 180, h = 660 }: { g: number; y?: number; h?: number }) => <div style={{ position: 'absolute', left: 60, top: y, width: 960, height: h, borderRadius: 24, overflow: 'hidden', border: '2px solid rgba(61,255,122,.5)', transform: `scale(${.9 + .1 * pop(g)})` }}>
  <div style={{ position: 'absolute', inset: 0, transform: 'scale(.9)', transformOrigin: '50% 0' }}><NeonVerde /></div><Pessoa style={{ inset: 'auto', left: 0, top: -420, width: 960, height: 1707 }} /></div>;

const Ouviu = () => { const g = useCurrentFrame(); const ps = PALAVRAS.filter((p) => p.id === 'ouviu'); const at = ps.findIndex((p) => S('ouviu') + g >= p.g && S('ouviu') + g < p.ge + 2);
  return <><NeonVerde /><Janela g={g} /><Card x={60} y={880} w={960}><div style={{ ...mono, marginBottom: 18 }}>TRANSCRIÇÃO · PALAVRA {48 + Math.max(0, at)} / 179</div>
    <div style={{ fontFamily: font.ui, fontWeight: 800, fontSize: 40, marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: '6px 12px' }}>{ps.map((p, i) => <span key={i} style={{ color: i === at ? DK : i < at ? '#fff' : 'rgba(255,255,255,.4)', background: i === at ? G : 'transparent', padding: '0 10px', borderRadius: 10 }}>{p.w.replace(/[,.]$/, '')}</span>)}</div>
    <Onda n={90} g={g} ativa={Math.floor(L(g, [0, E('ouviu') - S('ouviu')], [0, 88]))} /></Card></>; };

const Cortes = () => { const g = useCurrentFrame(); const n = Math.round(L(g, [10, 90], [2, 17])); const cortes = [5, 6, 14, 15, 16, 27, 28, 40, 41, 52, 60, 61, 70, 71, 80, 84, 85].slice(0, n);
  return <><NeonVerde /><Janela g={g} h={560} /><Card x={600} y={600} w={400}><div style={mono}>ANÁLISE DO BRUTO</div><div style={{ fontFamily: font.ui, fontWeight: 900, fontSize: 104, lineHeight: 1, color: '#fff' }}>{n} <span style={{ fontSize: 36 }}>cortes</span></div><div style={{ ...mono, color: '#9fe8b6' }}>pausas · "é" · repetição</div></Card>
    <Card x={60} y={880} w={960}><div style={{ ...mono, marginBottom: 18 }}>LINHA DO TEMPO · CORTES EM VERMELHO</div><Onda n={90} g={0} cortes={cortes} /></Card></>; };

const Tomada = () => { const g = useCurrentFrame(); const zoom = L(g, [150, 170], [1, 1.18]); const k2 = pop(g, 40);
  return <><NeonVerde /><Pessoa style={{ transform: `scale(${zoom})`, transformOrigin: '50% 35%' }} />
    {g < 120 && <><Card x={40} y={120} w={480}><div style={mono}>TOMADA 1</div><div style={{ fontFamily: font.ui, fontWeight: 800, fontSize: 26, color: '#fff', opacity: g > 40 ? .4 : 1, textDecoration: g > 40 ? 'line-through' : 'none' }}>"quando eu repeti a frase…" {g > 40 ? '✕' : ''}</div></Card>
      <Card x={560} y={120} w={480} borda={g > 40 ? G : 'rgba(61,255,122,.5)'}><div style={mono}>TOMADA 2 {g > 40 ? '· MELHOR ✓' : ''}</div><div style={{ fontFamily: font.ui, fontWeight: 800, fontSize: 26, color: '#fff', transform: `scale(${.95 + .05 * k2})` }}>"quando eu repeti a frase…"</div></Card></>}
    {g >= 120 && g < 150 && <><div style={{ position: 'absolute', left: 430, top: 880, width: 220, height: 110, border: `4px solid ${G}`, borderRadius: 60, boxShadow: `0 0 20px ${G}` }} /><Tag x={430} y={846} t="BOCA · SINCRONIA" g={g - 120} /></>}
    {g >= 150 && <><Hud a="ZOOM AUTOMÁTICO · ÂNCORA: ROSTO" b={`${zoom.toFixed(2).replace('.', ',')}×`} /><div style={{ position: 'absolute', left: 300, top: 380, width: 480, height: 480, border: `4px dashed ${G}` }} /><Tag x={300} y={344} t="AUTOMÁTICO ✓" g={g - 150} /></>}</>; };

const Fundo = () => { const g = useCurrentFrame(); const a = L(g, [0, 30], [0, 1]);
  return <><AbsoluteFill style={{ background: '#000' }} />
    <div style={{ position: 'absolute', left: 120 - 60 * a, top: 300, width: 600, height: 1066, border: `3px solid ${G}`, transform: `perspective(1800px) rotateY(${25 * a}deg)`, background: '#16161a', opacity: .7 }}><div style={{ position: 'absolute', left: 12, top: 12, background: G, ...mono, color: DK, fontWeight: 700, fontSize: 20, padding: '4px 10px' }}>02 · FUNDO ANTIGO</div></div>
    <div style={{ position: 'absolute', left: 320, top: 220, width: 660, height: 1173, overflow: 'hidden', border: `3px solid ${G}`, boxShadow: `0 0 60px rgba(61,255,122,.5)`, transform: `perspective(1800px) rotateY(${25 * a}deg)`, opacity: a }}><NeonVerde /></div>
    <Pessoa style={{ filter: `drop-shadow(0 0 20px ${G})` }} /><Tag x={60} y={240} t="01 · VOCÊ" g={g} /><Tag x={740} y={180} t="03 · CENÁRIO NOVO" d={20} g={g} /></>; };

const Maos = () => { const g = useCurrentFrame(); const pts = [[220, 1040], [280, 1120], [360, 1090], [640, 1060], [720, 1140], [790, 1096]].map(([x, y], i) => [x + Math.sin((g + i * 7) / 8) * 14, y + Math.cos((g + i * 5) / 9) * 12]);
  return <><NeonVerde /><Pessoa /><Hud a="RASTREIO DE MOVIMENTO" b={`${Math.min(21, 6 + Math.floor(g / 6))} PONTOS`} />
    <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}><polyline points={pts.slice(0, 3).map((p) => p.join(',')).join(' ')} stroke={G} strokeWidth={4} fill="none" /><polyline points={pts.slice(3).map((p) => p.join(',')).join(' ')} stroke={G} strokeWidth={4} fill="none" />
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={9} fill={G} style={{ filter: `drop-shadow(0 0 8px ${G})` }} />)}</svg>
    <Tag x={pts[0][0] - 100} y={pts[0][1] - 90} t="TEXTO" d={wf('maos', 'texto') - S('maos')} g={g} /><Tag x={pts[5][0] - 60} y={pts[5][1] - 110} t="ANIMAÇÃO" d={wf('maos', 'anima') - S('maos')} g={g} /></>; };

const Horas = () => { const g = useCurrentFrame(); const m = wf('horas', 'minutos') - S('horas'); const risca = L(g, [m - 30, m - 18], [0, 100]); const km = pop(g, m - 6, { damping: 10, stiffness: 260, mass: .5 });
  return <><NeonVerde /><Pessoa /><div style={{ position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center', fontFamily: font.ui, fontWeight: 900 }}>
    <div style={{ position: 'relative', display: 'inline-block', fontSize: 130, letterSpacing: -3, color: risca > 0 ? 'rgba(255,255,255,.55)' : '#fff', transform: `scale(${pop(g)})` }}>HORAS<i style={{ position: 'absolute', left: 0, top: '52%', height: 16, width: `${risca}%`, background: RED, borderRadius: 8 }} /></div>
    <div style={{ fontSize: 36, color: '#cfe' }}>PRA EDITAR NA MÃO</div>
    {g >= m - 6 && <><div style={{ fontSize: 36, marginTop: 40, color: '#fff' }}>ELE ENTREGA EM POUCOS</div><div style={{ fontSize: 150, letterSpacing: -4, color: G, transform: `scale(${1.4 - .4 * km})`, textShadow: `0 0 40px rgba(61,255,122,.6)` }}>MINUTOS</div></>}</div></>; };

const Comando = () => { const g = useCurrentFrame(); const txt = 'Roda o CHIP ADV.'; const n = Math.floor(L(g, [10, 40], [0, txt.length])); const fim = 80;
  return <><NeonVerde /><Pessoa /><Card x={60} y={170} w={960}><div style={{ ...mono, marginBottom: 16 }}>CHIP ADV · COMANDO</div>
    <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>{['🎬 bruto.mov', '📄 CHIP_ADV.md'].map((t, i) => <span key={t} style={{ background: '#0e3b1f', border: `2px solid ${G}`, borderRadius: 12, padding: '6px 16px', fontFamily: font.ui, fontWeight: 800, fontSize: 24, color: '#fff', transform: `scale(${pop(g, i * 5)})` }}>{t}</span>)}</div>
    <div style={{ fontFamily: font.ui, fontWeight: 800, fontSize: 40, color: '#fff' }}>{txt.slice(0, n)}<span style={{ color: G, opacity: g % 16 < 8 ? 1 : 0 }}>|</span></div></Card>
    {g >= fim && <div style={{ position: 'absolute', left: 280, top: 520, background: DK, border: `4px solid ${G}`, borderRadius: 28, padding: '20px 36px', fontFamily: font.ui, fontWeight: 900, fontSize: 52, color: G, boxShadow: '0 0 60px rgba(61,255,122,.6)', transform: `rotate(-4deg) scale(${pop(g, fim, { damping: 9, stiffness: 300, mass: .6 })})` }}>EDIÇÃO CONCLUÍDA ✓</div>}</>; };

const Cta = () => { const g = useCurrentFrame(); const s = wf('cta', 'saiba') - S('cta'); const click = s + 10, press = g >= click && g < click + 6 ? .92 : 1;
  const cx = L(g, [s - 10, click - 1], [900, 640]), cy = L(g, [s - 10, click - 1], [1560, 1330]);
  return <><NeonVerde /><Pessoa /><div style={{ position: 'absolute', top: 140, left: 0, right: 0, textAlign: 'center', color: '#fff', fontFamily: font.ui, fontWeight: 900, fontSize: 84, lineHeight: 1.02, letterSpacing: -2, transform: `scale(${pop(g)})` }}>ADVOGADO,<br /><span style={{ color: G }}>TRAVA NA HORA<br />DE EDITAR?</span></div>
    {g >= s - 6 && <div style={{ position: 'absolute', left: 0, right: 0, top: 1260, display: 'flex', justifyContent: 'center' }}><div style={{ background: G, color: DK, fontFamily: font.ui, fontWeight: 900, fontSize: 64, padding: '30px 70px', borderRadius: 999, boxShadow: '0 0 60px rgba(61,255,122,.7)', transform: `scale(${pop(g, s - 6) * press})` }}>Saiba mais →</div></div>}
    {g >= s - 10 && <svg width={100} height={100} viewBox="0 0 24 24" style={{ position: 'absolute', left: cx, top: cy }}><path d="M4 2l16 9-7 2-3 7z" fill="#fff" stroke="#111" strokeWidth={1.3} /></svg>}</>; };

const MAPA: Record<string, React.FC> = { gancho: Gancho, visao: Visao, ouviu: Ouviu, cortes: Cortes, tomada: Tomada, fundo: Fundo, maos: Maos, horas: Horas, comando: Comando, cta: Cta };

/* legenda palavra por palavra (some no gancho, na transcrição e no horas) */
const Legenda = () => { const g = useCurrentFrame(); const at = PALAVRAS.find((p) => g >= p.g && g < p.ge + 2);
  if (!at || ['gancho', 'ouviu', 'horas', 'cta'].includes(at.id)) return null;
  const ps = PALAVRAS.filter((p) => p.id === at.id); const i = ps.indexOf(at); const ini = Math.floor(i / 3) * 3; const grupo = ps.slice(ini, ini + 3);
  return <div style={{ position: 'absolute', left: 60, right: 60, top: at.id === 'cortes' ? 1500 : 1240, textAlign: 'center', fontFamily: font.ui, fontWeight: 900, fontSize: 72, lineHeight: 1.1, textShadow: '0 4px 20px rgba(0,0,0,.85)' }}>
    {grupo.map((p, j) => <span key={j} style={{ color: p === at || CHAVES.includes(p.w) && g >= p.g ? G : '#fff', marginRight: 18 }}>{p.w.replace(/[,.?]$/, '')}</span>)}</div>; };

const SFX: [number, string, number][] = [[0, 'impact', .55], [14, 'impact', .45], [40, 'whoosh', .4], [S('visao'), 'whoosh', .35], [S('visao') + 2, 'ding', .3], [S('ouviu'), 'whoosh', .35],
  ...Array.from({ length: 8 }, (_, i): [number, string, number] => [S('cortes') + 10 + i * 10, 'tick', .35]), [S('tomada') + 40, 'pop', .4], [S('tomada') + 150, 'whoosh', .35], [S('fundo'), 'riser', .3], [S('fundo') + 25, 'shimmer', .35],
  [S('maos'), 'whoosh', .3], [wf('horas', 'minutos') - 18, 'erro', .3], [wf('horas', 'minutos') - 6, 'impact', .55], ...Array.from({ length: 16 }, (_, i): [number, string, number] => [S('comando') + 10 + i * 2, 'type', .2]),
  [S('comando') + 80, 'ding', .45], [S('cta'), 'whoosh', .35], [wf('cta', 'saiba') + 10, 'click', .6]];

export const F8Ad = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    {CENAS.map(([id, a, b]) => { const C = MAPA[id]; return <Sequence key={id} from={a * FPS} durationInFrames={(b - a) * FPS}><C /></Sequence>; })}
    <Legenda />
    {SFX.map(([f, n, v], i) => <Sequence key={i} from={Math.round(f)} durationInFrames={50} layout="none"><Audio src={staticFile(`sfx/${n}.wav`)} volume={v} /></Sequence>)}
    <Audio src={staticFile('music/bed.wav')} volume={(f) => L(f, [0, 10, F8_FRAMES - 20, F8_FRAMES], [0, .35, .35, 0])} />
  </AbsoluteFill>
);
