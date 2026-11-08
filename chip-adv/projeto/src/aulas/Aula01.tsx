import { useCurrentFrame } from 'remotion';
import { brand, font } from '../brand';
import { Ac, Centro, Chip, Itens, Moldura, pop, Proxima, seg, Titulo } from './kit';

/** Aula 1 · O que você precisa. Início de cada frase da narração (s), medido no áudio. */
const F = seg([0, 2.42, 4.06, 13.02, 23.67, 26.82, 33.85, 40.28, 44.96]);
export const AULA01_FRAMES = Math.round(49.4 * 30);
const ITENS: [string, string][] = [
  ['Um computador', 'Mac ou Windows · 8 GB de memória · 10 GB livres'],
  ['Claude no plano Pro', 'a partir de US$ 20/mês, pago à Anthropic · inclui o Claude Code'],
  ['O CHIP ADV', 'já é seu'],
  ['Um celular para gravar', 'microfone de lapela recomendado'],
];

const Cena = () => { const f = useCurrentFrame(); const em = (a: number, b?: number) => f >= F[a] && (b === undefined || f < F[b]);
  if (em(0, 1)) return <Centro><Titulo t={<>O que você <Ac>precisa</Ac>.</>} sub="Aula 1" f={f} size={120} /></Centro>;
  if (em(1, 6)) return <Centro><div style={{ fontFamily: font.ui, fontWeight: 900, fontSize: 64, color: brand.ink, marginBottom: 50, width: 1300, opacity: pop(f, F[1]) }}>São só <Ac>4 coisas</Ac>.</div>
    <Itens f={f} itens={ITENS} at={[F[2], F[3], F[4], F[5]]} /></Centro>;
  if (em(6, 7)) return <Centro><Titulo t={<>Você <Ac>não</Ac> precisa de:</>} f={f} d={F[6]} size={90} />
    <div style={{ display: 'flex', gap: 30, marginTop: 50 }}>{['conector', 'extensão', 'programa pago'].map((t, i) => <Chip key={t} t={t} f={f} d={F[6] + 30 + i * 10} riscado />)}</div></Centro>;
  if (em(7, 8)) return <Centro><Titulo t={<>Ferramentas <Ac>grátis</Ac>.</>} sub="O próprio Claude instala para você." f={f} d={F[7]} size={100} />
    <div style={{ display: 'flex', gap: 30, marginTop: 50 }}>{['Remotion', 'ffmpeg', 'Python'].map((t, i) => <Chip key={t} t={t} f={f} d={F[7] + 20 + i * 8} />)}</div></Centro>;
  return <Centro><Titulo t={<>Agora, <Ac>instalar</Ac>.</>} f={f} d={F[8]} size={120} /><Proxima t="Aula 2 · Instalando o Claude" f={f} d={F[8] + 15} /></Centro>;
};

export const Aula01 = () => <Moldura n="1" total={AULA01_FRAMES} voz="aulas/aula01_voz.mp3"><Cena /></Moldura>;
