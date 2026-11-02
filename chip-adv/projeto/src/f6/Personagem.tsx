/** Advogado em desenho vetorial 2D. viewBox 600×600: cabeça ~(300,220), ombros em y≈330. */
export type Olhos = 'cansado' | 'feliz' | 'surpreso' | 'fechado' | 'normal';
export type Boca = 'triste' | 'sorriso' | 'o' | 'reta';
export type Braco = 'mesa' | 'cabeca' | 'cafe' | 'celular' | 'joinha' | 'nuca' | 'mouse' | 'ombro';

const PELE = '#C58C67', PELE_SOMBRA = '#A9714F', CABELO = '#1E1A17', TERNO = '#22324F', CAMISA = '#F4F1EA';

export const Cabeca = ({ olhos, boca, baguncado, piscar = false }: { olhos: Olhos; boca: Boca; baguncado: boolean; piscar?: boolean }) => {
  const olho = (x: number) => {
    if (piscar || olhos === 'fechado') return <path d={`M${x - 16} 214 q16 8 32 0`} stroke="#1b1b1b" strokeWidth={6} fill="none" strokeLinecap="round" />;
    if (olhos === 'feliz') return <path d={`M${x - 16} 218 q16 -16 32 0`} stroke="#1b1b1b" strokeWidth={6} fill="none" strokeLinecap="round" />;
    const r = olhos === 'surpreso' ? 13 : 10;
    return <g>
      <ellipse cx={x} cy={214} rx={r + 4} ry={r + (olhos === 'surpreso' ? 6 : 2)} fill="#fff" />
      <circle cx={x} cy={216} r={olhos === 'surpreso' ? 7 : 6} fill="#1b1b1b" />
      {olhos === 'cansado' && <><path d={`M${x - 18} 206 L${x + 18} 210`} stroke={PELE_SOMBRA} strokeWidth={9} strokeLinecap="round" />
        <path d={`M${x - 14} 236 q14 8 28 0`} stroke="#6E4F6E" strokeWidth={4} fill="none" opacity={0.7} /></>}
    </g>;
  };
  const b = { triste: 'M272 290 q28 -16 56 0', sorriso: 'M266 280 q34 30 68 0', o: '', reta: 'M276 286 h48' }[boca];
  return <g>
    <ellipse cx={192} cy={226} rx={16} ry={24} fill={PELE_SOMBRA} />
    <ellipse cx={408} cy={226} rx={16} ry={24} fill={PELE_SOMBRA} />
    <ellipse cx={300} cy={222} rx={108} ry={122} fill={PELE} />
    {/* barba */}
    <path d="M198 238 Q206 340 300 348 Q394 340 402 238 Q380 300 300 306 Q220 300 198 238Z" fill={CABELO} />
    {/* cabelo */}
    {baguncado
      ? <path d="M190 200 Q178 96 300 92 Q420 96 410 200 L396 150 L380 186 L362 128 L340 176 L318 116 L298 172 L276 112 L258 172 L236 124 L222 182 L206 140Z" fill={CABELO} />
      : <path d="M192 196 Q186 98 300 94 Q414 98 408 196 Q396 140 330 134 Q250 130 206 170Z" fill={CABELO} />}
    {/* sobrancelhas */}
    {olhos === 'cansado'
      ? <><path d="M240 186 L284 196" stroke={CABELO} strokeWidth={9} strokeLinecap="round" /><path d="M316 196 L360 186" stroke={CABELO} strokeWidth={9} strokeLinecap="round" /></>
      : <><path d={`M238 ${olhos === 'surpreso' ? 172 : 184} q24 -12 46 0`} stroke={CABELO} strokeWidth={9} fill="none" strokeLinecap="round" /><path d={`M316 ${olhos === 'surpreso' ? 172 : 184} q24 -12 46 0`} stroke={CABELO} strokeWidth={9} fill="none" strokeLinecap="round" /></>}
    {olho(262)}{olho(338)}
    <path d="M300 222 q-8 30 4 40" stroke={PELE_SOMBRA} strokeWidth={6} fill="none" strokeLinecap="round" />
    {boca === 'o' ? <ellipse cx={300} cy={288} rx={14} ry={18} fill="#4a1f1f" /> : <path d={b} stroke="#5a2424" strokeWidth={7} fill="none" strokeLinecap="round" />}
  </g>;
};

const MAOS: Record<Braco, [number, number, number, number]> = {
  // [x mão esq, y mão esq, x mão dir, y mão dir]
  mesa: [210, 560, 390, 560], cabeca: [200, 150, 400, 150], cafe: [200, 560, 330, 300], celular: [230, 470, 370, 470],
  joinha: [210, 560, 450, 380], nuca: [180, 170, 420, 170], mouse: [210, 560, 470, 560], ombro: [150, 380, 450, 380],
};

export const Personagem = ({ olhos, boca, baguncado, gravataSolta, braco, headDY = 0, headRot = 0, squash = 1, piscar = false }: {
  olhos: Olhos; boca: Boca; baguncado: boolean; gravataSolta: boolean; braco: Braco; headDY?: number; headRot?: number; squash?: number; piscar?: boolean;
}) => {
  const [lx, ly, rx, ry] = MAOS[braco];
  const ombroE = [220, 360], ombroD = [380, 360];
  const cotovelo = (o: number[], m: number[], lado: number) => [(o[0] + m[0]) / 2 + lado * 40, (o[1] + m[1]) / 2 + 30];
  const ce = cotovelo(ombroE, [lx, ly], -1), cd = cotovelo(ombroD, [rx, ry], 1);
  return <svg viewBox="0 0 600 600" width="100%" height="100%" style={{ overflow: 'visible' }}>
    {/* tronco */}
    <path d="M150 600 Q150 380 220 345 L380 345 Q450 380 450 600Z" fill={TERNO} />
    <path d="M256 345 L300 430 L344 345Z" fill={CAMISA} />
    <path d={gravataSolta ? 'M296 372 L322 380 L318 470 L300 492 L286 466Z' : 'M290 360 L310 360 L316 470 L300 492 L284 470Z'} fill="#9B1C2E" />
    <path d="M256 345 L230 470 L300 430Z M344 345 L370 470 L300 430Z" fill="#1A2740" />
    {/* cabeça */}
    <g transform={`translate(0 ${headDY}) rotate(${headRot} 300 300) translate(300 300) scale(${2 - squash} ${squash}) translate(-300 -300)`}>
      <rect x={270} y={300} width={60} height={60} fill={PELE_SOMBRA} />
      <Cabeca olhos={olhos} boca={boca} baguncado={baguncado} piscar={piscar} />
    </g>
    {/* braços */}
    {[[ombroE, ce, [lx, ly]], [ombroD, cd, [rx, ry]]].map(([o, c, m], i) => <g key={i}>
      <path d={`M${o[0]} ${o[1]} Q${c[0]} ${c[1]} ${m[0]} ${m[1]}`} stroke={TERNO} strokeWidth={54} fill="none" strokeLinecap="round" />
      <circle cx={m[0]} cy={m[1]} r={28} fill={PELE} />
    </g>)}
    {braco === 'joinha' && <path d={`M${rx - 6} ${ry - 26} v-30 q0 -10 10 -10 q10 0 10 10 v30`} fill={PELE} stroke={PELE_SOMBRA} strokeWidth={3} />}
    {braco === 'cafe' && <g><rect x={rx - 34} y={ry - 10} width={50} height={62} rx={8} fill="#F4F1EA" /><path d={`M${rx + 16} ${ry + 6} q22 0 22 18 q0 18 -22 18`} stroke="#F4F1EA" strokeWidth={8} fill="none" /></g>}
    {braco === 'celular' && <rect x={258} y={420} width={84} height={140} rx={14} fill="#111" stroke="#333" strokeWidth={4} />}
  </svg>;
};
