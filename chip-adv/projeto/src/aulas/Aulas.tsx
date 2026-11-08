import { Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { brand, font } from '../brand';
import T from '../data/aulas_tempos.json';
import { A, Ac, BG, Centro, Chip, Itens, Moldura, pop, Proxima, Titulo } from './kit';
import { AppClaude, Botao, Card, Cursor, Digitando, Janela, Msg, Navegador, Pasta, Permissao, Rotulo } from './telas';

type K = keyof typeof T;
const tempos = (k: K) => T[k] as { frases: number[]; total: number };
export const TOTAL = (k: K) => tempos(k).total;
/** em(a,b): está entre o início da frase a e o início da frase b. */
const usa = (k: K) => { const F = tempos(k).frases; const f = useCurrentFrame(); return { f, F, em: (a: number, b?: number) => f >= F[a] && (b === undefined || b >= F.length || f < F[b]) }; };
const Abertura = ({ n, t, f }: { n: string; t: React.ReactNode; f: number }) => <Centro><Titulo t={t} sub={`Aula ${n}`} f={f} size={116} /></Centro>;
const Fim = ({ t, prox, f, d }: { t: React.ReactNode; prox?: string; f: number; d: number }) => <Centro><Titulo t={t} f={f} d={d} size={110} />{prox && <Proxima t={prox} f={f} d={d + 15} />}</Centro>;

/* ---------- Aula 2 · Instalando o Claude ---------- */
const C02 = () => { const { f, F, em } = usa('aula02');
  if (em(0, 1)) return <Abertura n="2" t={<>Instalando o <Ac>Claude</Ac>.</>} f={f} />;
  if (em(1, 2)) return <Centro><Navegador url="claude.ai"><div style={{ padding: 60, fontFamily: font.ui }}>
    <div style={{ fontWeight: 900, fontSize: 56, color: '#1b1b1f' }}>Escolha o seu plano</div>
    <div style={{ display: 'flex', gap: 30, marginTop: 40 }}>{['Free', 'Pro', 'Max'].map((p) => <div key={p} style={{ width: 360, height: 300, borderRadius: 20, background: '#fff', border: p === 'Pro' && f > F[1] + 60 ? `6px solid ${A}` : '2px solid #e3ddd0', padding: 30 }}>
      <div style={{ fontWeight: 900, fontSize: 44, color: '#1b1b1f' }}>{p}</div>{p === 'Pro' && <div style={{ fontWeight: 700, fontSize: 26, color: '#2f7d16', marginTop: 10 }}>inclui o Claude Code ✓</div>}</div>)}</div></div>
    <Cursor f={f} de={[1300, 700]} ate={[700, 380]} a0={F[1] + 30} a1={F[1] + 70} /></Navegador></Centro>;
  if (em(2, 3)) return <Centro><Navegador url="claude.ai/download"><div style={{ padding: 70, fontFamily: font.ui, textAlign: 'center' }}>
    <div style={{ fontWeight: 900, fontSize: 60, color: '#1b1b1f' }}>Baixe o Claude</div>
    <Botao t=" Baixar para Mac" x={300} y={250} f={f} on at={F[2] + 60} /><Botao t="⊞ Baixar para Windows" x={760} y={250} f={f} cor="#2b5797" /></div>
    <Cursor f={f} de={[1200, 650]} ate={[470, 330]} a0={F[2] + 20} a1={F[2] + 60} /></Navegador></Centro>;
  if (em(3, 4)) return <Centro><AppClaude code={false} /><Rotulo t={f < F[3] + 45 ? 'Instale' : f < F[3] + 90 ? 'Abra' : 'Entre com a sua conta'} f={f} at={F[3]} /></Centro>;
  if (em(4, 6)) return <Centro><AppClaude code={f >= F[4] + 70} destaque={f >= F[4] + 40} /><Cursor f={f} de={[1400, 900]} ate={[1010, 300]} a0={F[4] + 20} a1={F[4] + 70} /><Rotulo t="Sempre na aba Code" f={f} at={F[5]} /></Centro>;
  return <Fim t={<>Claude <Ac>instalado</Ac>.</>} prox="Aula 3 · Instalando o CHIP ADV" f={f} d={F[6]} />; };

/* ---------- Aula 3 · Instalando o CHIP ADV ---------- */
const PEDIDO_SKILL = 'Instale a skill que está no arquivo skill-chip-adv.zip desta pasta, na pasta de skills do Claude Code. Depois me confirme.';
const C03 = () => { const { f, F, em } = usa('aula03');
  if (em(0, 1)) return <Abertura n="3" t={<>Instalando o <Ac>CHIP ADV</Ac>.</>} f={f} />;
  if (em(1, 3)) return <Centro><Pasta nome="Área de Trabalho" itens={['CHIP ADV']} f={f} at={F[1]} />
    {f >= F[2] && <div style={{ marginTop: 40 }}><Pasta nome="CHIP ADV" itens={['skill-chip-adv.zip']} f={f} at={F[2]} novo={F[2] + 40} /></div>}</Centro>;
  if (em(3, 7)) return <Centro><AppClaude pasta={f >= F[3] + 40 ? 'CHIP ADV' : undefined}>
    {f >= F[4] && <Msg de="voce" f={f} at={F[4] + 70}>{PEDIDO_SKILL}</Msg>}
    <Msg de="claude" f={f} at={F[5] + 60}>✓ Skill <b>chip-adv</b> instalada. Feche e abra o app.</Msg>
    {f >= F[6] && <div style={{ background: '#fff', border: '2px solid #e3ddd0', borderRadius: 16, padding: 16, width: 420, opacity: pop(f, F[6] + 50) }}>
      <div style={{ fontFamily: 'monospace', fontSize: 26, fontWeight: 700, background: A, color: BG, borderRadius: 8, padding: '8px 12px' }}>/chip-adv</div>
      <div style={{ fontFamily: font.ui, fontSize: 20, color: '#777', marginTop: 8 }}>Editor de vídeo premium para advogados</div></div>}
    {f >= F[4] && f < F[4] + 70 ? <Digitando texto={PEDIDO_SKILL} f={f} at={F[4]} dur={60} /> : f >= F[6] && f < F[6] + 50 ? <Digitando texto="/" f={f} at={F[6] + 20} dur={2} /> : <Digitando texto="" f={f} at={1e9} />}
    <Permissao cmd="unzip skill-chip-adv.zip -d ~/.claude/skills/" f={f} at={F[5]} /></AppClaude></Centro>;
  return <Fim t={<>O Claude agora <Ac>sabe editar</Ac>.</>} prox="Aula 4 · Preparando o computador" f={f} d={F[7]} />; };

/* ---------- Aula 4 · Preparando o computador ---------- */
const PEDIDO_PREP = 'Prepare este computador para o CHIP ADV: verifique e instale o que faltar (Node.js LTS, ffmpeg e Python 3). Depois me diga se está tudo pronto.';
const C04 = () => { const { f, F, em } = usa('aula04');
  if (em(0, 1)) return <Abertura n="4" t={<>Preparando o <Ac>computador</Ac>.</>} f={f} />;
  if (em(1, 2)) return <Centro><Titulo t={<>3 programas <Ac>grátis</Ac>.</>} f={f} d={F[1]} size={96} />
    <div style={{ display: 'flex', gap: 30, marginTop: 50 }}>{['Node', 'ffmpeg', 'Python'].map((t, i) => <Chip key={t} t={t} f={f} d={F[1] + 30 + i * 12} />)}</div></Centro>;
  if (em(2, 5)) return <Centro><AppClaude pasta="CHIP ADV">
    <Msg de="voce" f={f} at={F[2] + 75}>{PEDIDO_PREP}</Msg>
    <Msg de="claude" f={f} at={F[4]}>✓ Node.js · ✓ ffmpeg · ✓ Python<br /><b>Tudo pronto para o CHIP ADV.</b></Msg>
    {f < F[2] + 75 ? <Digitando texto={PEDIDO_PREP} f={f} at={F[2] + 10} dur={60} /> : <Digitando texto="" f={f} at={1e9} />}
    {f < F[4] && <Permissao cmd={f < F[3] + 50 ? 'brew install ffmpeg' : 'brew install node python'} f={f} at={F[3]} />}</AppClaude></Centro>;
  return <Fim t={<>Só na <Ac>primeira vez</Ac>.</>} prox="Aula 5 · Gravando do jeito certo" f={f} d={F[5]} />; };

/* ---------- Aula 5 · Gravando do jeito certo ---------- */
const C05 = () => { const { f, F, em } = usa('aula05');
  if (em(0, 1)) return <Abertura n="5" t={<>Gravando do jeito <Ac>certo</Ac>.</>} f={f} />;
  if (em(1, 7)) return <Centro row><Itens f={f} w={1080} at={[F[1], F[2], F[3], F[4], F[5], F[6]]} itens={[
    ['Vertical, na altura dos olhos', 'a um braço de distância'], ['Luz de frente', 'janela atrás do celular'], ['Microfone de lapela', 'longe do ar-condicionado'],
    ['Errou? Repita a frase inteira', 'o CHIP ADV fica com a melhor tomada'], ['20 a 90 segundos', 'um pouco mais rápido, olhando para a lente'], ['AirDrop, cabo ou Drive', 'nunca pelo WhatsApp']]} />
    <div style={{ width: 360, height: 640, borderRadius: 44, overflow: 'hidden', boxShadow: `0 0 0 6px ${A}`, opacity: pop(f, F[1]) }}><Sequence from={F[1]} layout="none"><OffthreadVideo src={staticFile('aulas/bruto.mp4')} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></Sequence></div></Centro>;
  return <Fim t={<>Agora, a <Ac>primeira edição</Ac>.</>} prox="Aula 6 · Primeira edição" f={f} d={F[7]} />; };

/* ---------- Aula 6 · Primeira edição ---------- */
const SB: [string, string, string, string][] = [['0–2 s', '"Advogado, você ainda…"', 'Gancho', '05 Zoom de impacto'], ['2–6 s', '"Usando um único arquivo…"', 'Virada', '03 Janela da IA'], ['10–13 s', '"Olha como ficou!"', 'Prova', '15 Antes e depois'], ['35–41 s', '"Clica em Saiba Mais…"', 'CTA', '12 Recorte + botão']];
const C06 = () => { const { f, F, em } = usa('aula06');
  if (em(0, 1)) return <Abertura n="6" t={<>A sua <Ac>primeira edição</Ac>.</>} f={f} />;
  if (em(1, 2)) return <Centro><Pasta nome="CHIP ADV" itens={['meu-video.mov']} f={f} at={F[1]} novo={F[1] + 30} /></Centro>;
  if (em(2, 7)) return <Centro><AppClaude pasta="CHIP ADV">
    <Msg de="voce" f={f} at={F[2] + 45}>/chip-adv</Msg>
    <Msg de="claude" f={f} at={F[3]}>{f >= F[3] + 20 ? '✓' : '…'} Analisando o vídeo<br />{f >= F[3] + 50 ? '✓' : '…'} Transcrevendo a fala<br />{f >= F[3] + 80 ? '✓ 20 pausas cortadas · 0:52 → 0:41' : '… Cortando pausas e erros'}</Msg>
    {f >= F[4] && <div style={{ background: '#fff', border: '2px solid #e3ddd0', borderRadius: 16, padding: 14, fontFamily: font.ui, fontSize: 19, opacity: pop(f, F[4]) }}>
      <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 8, color: '#1b1b1f' }}>Roteiro de edição</div>
      {SB.map((r, i) => <div key={i} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 110px 220px', gap: 10, padding: '6px 0', borderTop: '1px solid #eee', color: '#333', opacity: f >= F[4] + i * 12 ? 1 : 0 }}>{r.map((c, j) => <span key={j} style={{ fontWeight: j === 3 ? 800 : 500, color: j === 3 ? '#2f7d16' : '#333' }}>{c}</span>)}</div>)}</div>}
    <Msg de="voce" f={f} at={F[5] + 50}>ok, pode renderizar</Msg>
    {f < F[2] + 45 ? <Digitando texto="/chip-adv" f={f} at={F[2] + 10} dur={20} /> : f >= F[5] && f < F[5] + 50 ? <Digitando texto="ok, pode renderizar" f={f} at={F[5]} dur={30} /> : <Digitando texto="" f={f} at={1e9} />}
    {f >= F[6] && <div style={{ position: 'absolute', right: 30, top: 30, background: BG, color: A, fontFamily: font.ui, fontWeight: 900, fontSize: 30, padding: '14px 24px', borderRadius: 14, opacity: pop(f, F[6]) }}>⏱ 1ª vez: 10 a 20 min</div>}</AppClaude></Centro>;
  if (em(7, 8)) return <Centro row><Pasta nome="CHIP ADV / out" itens={['video-pronto.mp4']} f={f} at={F[7]} />
    <div style={{ width: 360, height: 640, borderRadius: 44, overflow: 'hidden', boxShadow: `0 0 0 6px ${A}` }}><Sequence from={F[7]} layout="none"><OffthreadVideo src={staticFile('aulas/pronto.mp4')} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></Sequence></div></Centro>;
  return <Fim t={<>Primeiro vídeo <Ac>pronto</Ac>.</>} prox="Aula 7 · Pedindo ajustes" f={f} d={F[8]} />; };

/* ---------- Aula 7 · Ajustes ---------- */
const C07 = () => { const { f, F, em } = usa('aula07');
  if (em(0, 1)) return <Abertura n="7" t={<>Roteiro e <Ac>ajustes</Ac>.</>} f={f} />;
  if (em(1, 7)) return <Centro><AppClaude pasta="CHIP ADV">
    <Msg de="voce" f={f} at={F[1] + 40}>na linha 2, usa a capa de revista</Msg><Msg de="claude" f={f} at={F[1] + 70}>Feito ✓ Linha 2: 16 Capa de revista.</Msg>
    <Msg de="voce" f={f} at={F[3]}>deixa a legenda maior</Msg><Msg de="claude" f={f} at={F[3] + 25}>Feito ✓</Msg>
    <Msg de="voce" f={f} at={F[4]}>troca o efeito do segundo 12 por capa de revista</Msg><Msg de="claude" f={f} at={F[4] + 30}>Feito ✓</Msg>
    {f < F[6] && <><Msg de="voce" f={f} at={F[5]}>faz uma versão de 15 segundos</Msg><Msg de="claude" f={f} at={F[5] + 30}>Pronto: out/video-15s.mp4 ✓</Msg></>}
    {f >= F[6] && <><Msg de="voce" f={f} at={F[6] + 20}>acelera o trecho do segundo 20 ao 25</Msg><Msg de="claude" f={f} at={F[6] + 45}>Feito ✓ trecho em 1,25×</Msg>
      <Msg de="voce" f={f} at={F[6] + 80}>deixa o final mais lento</Msg><Msg de="claude" f={f} at={F[6] + 105}>Feito ✓ final em 0,8×</Msg></>}
    {f >= F[2] && f < F[3] && <div style={{ position: 'absolute', left: 30, right: 30, top: '45%', textAlign: 'center', fontFamily: font.ui, fontWeight: 900, fontSize: 40, color: '#1b1b1f', opacity: pop(f, F[2]) }}>Peça em português normal ↓</div>}</AppClaude></Centro>;
  return <Fim t={<>Ele refaz <Ac>só o que você pediu</Ac>.</>} prox="Aula 8 · Mapa de efeitos" f={f} d={F[7]} />; };

/* ---------- Aula 8 · Mapa de efeitos ---------- */
const NOMES = ['Troca de cenário', 'Comparação', 'Janela da IA', 'Carimbo', 'Zoom de impacto', 'Celular', 'Checklist', 'Mágica', 'Corte no zoom', 'Relógio de horas', 'Bastidor', 'Recorte + botão', 'Tela dividida', 'Rabisco vivo', 'Antes e depois', 'Capa de revista', 'Palavra de vidro'];
const C08 = () => { const { f, F, em } = usa('aula08');
  if (em(0, 1)) return <Abertura n="8" t={<>O mapa de <Ac>efeitos</Ac>.</>} f={f} />;
  if (em(1, 4)) { const foco = f >= F[2]; return <Centro>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 170px)', gap: 14 }}>{NOMES.map((n, i) => { const sel = foco && i === 9; return <div key={n} style={{ opacity: pop(f, F[1] + i * 3) * (foco && !sel ? .3 : 1), transform: `scale(${sel ? 1.15 : 1})`, zIndex: sel ? 2 : 1 }}>
      <Img src={staticFile(`aulas/mapa/${String(i + 1).padStart(2, '0')}.jpg`)} style={{ width: 170, height: 300, objectFit: 'cover', borderRadius: 12, boxShadow: sel ? `0 0 0 5px ${A}` : 'none' }} />
      <div style={{ fontFamily: font.ui, fontWeight: 800, fontSize: 17, color: brand.ink, marginTop: 6 }}>{String(i + 1).padStart(2, '0')} {n}</div></div>; })}</div>
    {f >= F[3] && <div style={{ marginTop: 30, background: '#1b1b1f', color: '#fff', fontFamily: font.ui, fontWeight: 700, fontSize: 34, padding: '18px 30px', borderRadius: 20, opacity: pop(f, F[3]) }}>"quando eu falar <b style={{ color: A }}>prazo</b>, põe o relógio de horas"</div>}</Centro>; }
  if (em(4, 5)) return <Centro><Titulo t={<>1 efeito forte a cada <Ac>6 a 10 s</Ac>.</>} sub="Efeito demais vira poluição." f={f} d={F[4]} size={90} /></Centro>;
  return <Fim t={<>Ou ele <Ac>escolhe sozinho</Ac>.</>} prox="Aula 9 · Problemas comuns" f={f} d={F[5]} />; };

/* ---------- Aula 9 · Problemas comuns ---------- */
const PROB: [string, string][] = [['/chip-adv não aparece', 'Feche e abra o app · confira a skill'], ['Vídeo do iPhone não abre', '"converte o meu vídeo para H.264"'], ['Render lento', '"renderiza com concorrência 2"'],
  ['Sem espaço no disco', 'libere 10 GB · apague a pasta out antiga'], ['O Claude parou no meio', '"continua de onde parou"'], ['Qualquer outro erro', '"deu esse erro, resolve pra mim"']];
const C09 = () => { const { f, F, em } = usa('aula09');
  if (em(0, 1)) return <Abertura n="9" t={<>Problemas <Ac>comuns</Ac>.</>} f={f} />;
  if (em(1, 7)) { const i = [1, 2, 3, 4, 5, 6].filter((k) => f >= F[k]).length - 1; return <Centro>
    <div style={{ fontFamily: font.ui, fontWeight: 800, fontSize: 30, color: brand.muted, marginBottom: 24 }}>{i + 1} / 6</div>
    <Card titulo={PROB[i][0]} sub={PROB[i][1]} f={f} at={F[i + 1]} /></Centro>; }
  return <Fim t={<>Agora é com você. <Ac>Bons vídeos.</Ac></>} f={f} d={F[7]} />; };


/* ---------- Aula 10 · Avançado: transformações com IA (fal) ---------- */
const EMAIL = 'Hi! My new fal account was restricted right after my first credit purchase. I use it for video editing with Claude. Could you please review and unlock it? Thank you.';
const C10 = () => { const { f, F, em } = usa('aula10');
  if (em(0, 1)) return <Abertura n="10 · Avançado" t={<>Transformações com <Ac>IA</Ac>.</>} f={f} />;
  if (em(1, 2)) return <Centro><Titulo t={<>Para começar, <Ac>não precisa</Ac>.</>} sub="Só para quem quiser vídeos mais complexos." f={f} d={F[1]} size={100} /></Centro>;
  if (em(2, 3)) return <Centro><Img src={staticFile('aulas/comparacao.jpg')} style={{ height: 800, borderRadius: 18, boxShadow: `0 0 0 4px ${A}`, opacity: pop(f, F[2]) }} /></Centro>;
  if (em(3, 4)) return <Centro><Janela titulo="Claude · Configurações"><div style={{ display: 'flex', height: '100%', fontFamily: font.ui }}>
    <div style={{ width: 300, background: '#EFECE5', padding: 26, fontSize: 24, color: '#555', lineHeight: 2.2 }}>{['Geral', 'Conta', 'Conectores', 'Privacidade'].map((t) => <div key={t} style={{ fontWeight: t === 'Conectores' ? 900 : 600, color: t === 'Conectores' ? '#1b1b1f' : '#777' }}>{t}</div>)}</div>
    <div style={{ flex: 1, padding: 40 }}><div style={{ fontWeight: 900, fontSize: 40, color: '#1b1b1f', marginBottom: 24 }}>Conectores</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', border: `3px solid ${f >= F[3] + 60 ? A : '#e3ddd0'}`, borderRadius: 16, padding: '20px 26px', width: 820 }}>
        <span style={{ fontWeight: 900, fontSize: 34, color: '#1b1b1f' }}>fal <span style={{ fontWeight: 600, fontSize: 22, color: '#777' }}>· imagem e vídeo com IA</span></span>
        <span style={{ background: f >= F[3] + 90 ? '#2f7d16' : '#1b1b1f', color: '#fff', fontWeight: 800, fontSize: 24, padding: '12px 26px', borderRadius: 12 }}>{f >= F[3] + 90 ? 'Conectado ✓' : 'Conectar'}</span></div></div></div></Janela>
    <Cursor f={f} de={[1500, 900]} ate={[1270, 330]} a0={F[3] + 30} a1={F[3] + 80} /></Centro>;
  if (em(4, 5)) return <Centro><div style={{ display: 'flex', gap: 30 }}>{[['US$ 10', 'para começar'], ['≈ US$ 0,04', 'por imagem'], ['pago por uso', 'sem mensalidade']].map(([a, b], i) =>
    <div key={a} style={{ width: 420, background: 'rgba(255,255,255,.05)', border: `2px solid ${A}55`, borderRadius: 24, padding: 34, textAlign: 'center', opacity: pop(f, F[4] + i * 25) }}>
      <div style={{ fontFamily: font.ui, fontWeight: 900, fontSize: 64, color: A }}>{a}</div><div style={{ fontFamily: font.ui, fontWeight: 700, fontSize: 32, color: brand.ink, marginTop: 8 }}>{b}</div></div>)}</div>
    <div style={{ marginTop: 40, fontFamily: font.ui, fontWeight: 700, fontSize: 30, color: brand.muted, opacity: pop(f, F[4] + 80) }}>Créditos em fal.ai → Billing → Credits</div></Centro>;
  if (em(5, 6)) return <Centro><Janela titulo="Novo e-mail" w={1400} h={760}><div style={{ padding: 40, fontFamily: font.ui, fontSize: 28, color: '#333', lineHeight: 1.6 }}>
    <div><b>Para:</b> support@fal.ai</div><div><b>Assunto:</b> Please unlock my account</div><hr style={{ border: 0, borderTop: '1px solid #ddd', margin: '20px 0' }} />
    <div style={{ color: '#1b1b1f' }}>{EMAIL.slice(0, Math.floor(Math.min(1, Math.max(0, (f - F[5] - 30) / 120)) * EMAIL.length))}</div></div></Janela>
    <Rotulo t="Só se aparecer bloqueio na conta" f={f} at={F[5] + 20} /></Centro>;
  if (em(6, 7)) return <Centro><AppClaude pasta="CHIP ADV"><Msg de="voce" f={f} at={F[6] + 10}>troca a minha camisa por uma beca de advogado</Msg>
    <Msg de="claude" f={f} at={F[6] + 60}><div style={{ display: 'flex', gap: 16, alignItems: 'center' }}><Img src={staticFile('aulas/beca.jpg')} style={{ height: 300, borderRadius: 12 }} /><span>Feito ✓ beca aplicada</span></div></Msg>
    <Digitando texto="" f={f} at={1e9} /></AppClaude></Centro>;
  return <Fim t={<>Agora, os <Ac>bônus</Ac>.</>} prox="Bônus 1 · Identidade" f={f} d={F[7]} />; };

/* ---------- PRO 1 · Identidade ---------- */
const CP1 = () => { const { f, F, em } = usa('pro1');
  if (em(0, 1)) return <Abertura n="bônus" t={<>A identidade do seu <Ac>escritório</Ac>.</>} f={f} />;
  if (em(1, 3)) return <Centro><div style={{ width: 1200, background: '#F7F5F0', borderRadius: 20, padding: 40, fontFamily: 'monospace', fontSize: 30, color: '#333', lineHeight: 1.6, opacity: pop(f, F[1]) }}>
    <div style={{ fontFamily: font.ui, fontWeight: 900, fontSize: 34, color: '#1b1b1f', marginBottom: 10 }}>📄 MARCA.md</div>
    {[['nome_na_tela', 'Dra. Ana Souza'], ['escritorio', 'Souza Advocacia'], ['oab', 'OAB/SP 000.000'], ['areas', 'Família · Sucessões'], [f >= F[2] ? 'estilo' : 'cores', f >= F[2] ? 'Sóbrio Clássico (catálogo)' : 'azul-marinho e dourado']].map(([k, v], i) =>
      <div key={k} style={{ opacity: f >= F[1] + 20 + i * 18 ? 1 : 0 }}>{k}: <b style={{ color: '#2f7d16' }}>"{v}"</b></div>)}</div></Centro>;
  if (em(3, 5)) return <Centro><Pasta nome="CHIP ADV" itens={f >= F[4] ? ['skill-chip-adv.zip', 'MARCA.md', 'logo.png'] : ['skill-chip-adv.zip', 'MARCA.md']} f={f} at={F[3]} novo={f >= F[4] ? F[4] + 20 : F[3] + 25} />
    {f >= F[4] && <div style={{ marginTop: 30 }}><Titulo t={<>+ a sua <Ac>logomarca</Ac></>} f={f} d={F[4] + 30} size={64} /></div>}</Centro>;
  return <Centro><div style={{ position: 'relative', width: 380, height: 676, borderRadius: 40, overflow: 'hidden', boxShadow: `0 0 0 6px ${A}` }}>
    <Sequence from={F[5]} layout="none"><OffthreadVideo src={staticFile('aulas/pronto.mp4')} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></Sequence>
    <div style={{ position: 'absolute', right: 18, top: 18, width: 74, height: 74, borderRadius: 37, background: '#0F1E33', border: '3px solid #B8955A', color: '#B8955A', display: 'grid', placeItems: 'center', fontFamily: font.mag, fontWeight: 900, fontSize: 30, opacity: pop(f, F[5] + 10) }}>AS</div>
    <div style={{ position: 'absolute', left: 20, bottom: 40, background: '#0F1E33', color: '#F4EFE6', fontFamily: font.ui, padding: '12px 18px', borderLeft: '6px solid #B8955A', opacity: pop(f, F[5] + 15) }}>
      <div style={{ fontWeight: 900, fontSize: 26 }}>Dra. Ana Souza</div><div style={{ fontWeight: 600, fontSize: 18 }}>OAB/SP 000.000</div></div></div>
    <div style={{ marginTop: 30 }}><Titulo t={<>Nome, OAB, cores e <Ac>logo</Ac>.</>} f={f} d={F[5] + 20} size={60} /></div></Centro>; };

/* ---------- PRO 2 · Modo anúncio ---------- */
const CP2 = () => { const { f, F, em } = usa('pro2');
  if (em(0, 1)) return <Abertura n="bônus" t={<>O modo <Ac>anúncio</Ac>.</>} f={f} />;
  if (em(1, 2)) return <Centro><Titulo t={<>Gancho <Ac>3 a 5 vezes</Ac>.</>} sub="O corpo, uma vez." f={f} d={F[1]} size={100} /></Centro>;
  if (em(2, 3)) return <Centro><AppClaude pasta="CHIP ADV"><Msg de="voce" f={f} at={F[2] + 60}>Roda o CHIP ADV no modo anúncio.</Msg>
    {f < F[2] + 60 ? <Digitando texto="Roda o CHIP ADV no modo anúncio." f={f} at={F[2] + 15} dur={40} /> : <Digitando texto="" f={f} at={1e9} />}</AppClaude></Centro>;
  if (em(3, 4)) return <Centro><div style={{ display: 'flex', gap: 24 }}>{[1, 2, 3, 4, 5].map((h, i) => <div key={h} style={{ textAlign: 'center', opacity: pop(f, F[3] + i * 8) }}>
    <div style={{ width: 230, height: 409, borderRadius: 28, overflow: 'hidden', boxShadow: `0 0 0 4px ${A}` }}><Sequence from={F[3]} layout="none"><OffthreadVideo src={staticFile(`aulas/hooks/hook-h${h}.mp4`)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></Sequence></div>
    <div style={{ fontFamily: font.ui, fontWeight: 800, fontSize: 26, color: brand.ink, marginTop: 10 }}>Gancho {h}</div></div>)}</div>
    <div style={{ display: 'flex', gap: 20, marginTop: 30 }}>{['15 s', '30 s', '45 s', 'textos do anúncio', 'planilha de teste'].map((t, i) => <Chip key={t} t={t} f={f} d={F[3] + 60 + i * 10} />)}</div></Centro>;
  return <Fim t={<>Sobe e deixa o <Ac>teste decidir</Ac>.</>} f={f} d={F[4]} />; };

const mk = (C: React.FC, k: K, n: string) => () => <Moldura n={n} total={TOTAL(k)} voz={`aulas/${k}_voz.mp3`}><C /></Moldura>;
export const AULAS: [string, React.FC, K][] = [['Aula02', mk(C02, 'aula02', '2'), 'aula02'], ['Aula03', mk(C03, 'aula03', '3'), 'aula03'], ['Aula04', mk(C04, 'aula04', '4'), 'aula04'],
  ['Aula05', mk(C05, 'aula05', '5'), 'aula05'], ['Aula06', mk(C06, 'aula06', '6'), 'aula06'], ['Aula07', mk(C07, 'aula07', '7'), 'aula07'], ['Aula08', mk(C08, 'aula08', '8'), 'aula08'],
  ['Aula09', mk(C09, 'aula09', '9'), 'aula09'], ['Aula10', mk(C10, 'aula10', '10'), 'aula10'], ['AulaPro1', mk(CP1, 'pro1', 'BÔNUS 1'), 'pro1'], ['AulaPro2', mk(CP2, 'pro2', 'BÔNUS 2'), 'pro2']];
