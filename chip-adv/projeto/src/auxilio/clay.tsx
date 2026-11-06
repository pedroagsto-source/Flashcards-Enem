import React from 'react';

/* Kit de ilustrações "massinha" (clay) em SVG: gradiente radial com brilho no alto à esquerda + sombra suave.
   Cada peça tem tamanho próprio em px; o componente pai posiciona. */

const shadow = 'drop-shadow(0 16px 12px rgba(80,55,30,.28))';
type P = { size?: number; style?: React.CSSProperties };

const TONES = {
  wood: ['#B57A4B', '#6E3F22'],
  light: ['#F1D2A8', '#C28E5C'],
  gray: ['#D9D4CC', '#A39C92'],
  gold: ['#FFE39A', '#C99417'],
  navy: ['#3E5C8A', '#1B2E4F'],
} as const;
export type Tone = keyof typeof TONES;

const Grad = ({ id, tone }: { id: string; tone: Tone }) => (
  <radialGradient id={id} cx="35%" cy="28%" r="80%">
    <stop offset="0%" stopColor={TONES[tone][0]} />
    <stop offset="100%" stopColor={TONES[tone][1]} />
  </radialGradient>
);

/** peão (pessoa) */
export const Pawn = ({ tone = 'wood', size = 200, style, hand = false }: P & { tone?: Tone; hand?: boolean }) => (
  <svg width={size * 0.5} height={size} viewBox="0 0 100 200" style={{ filter: shadow, overflow: 'visible', ...style }}>
    <defs><Grad id={`pw-${tone}`} tone={tone} /></defs>
    <ellipse cx="50" cy="194" rx="34" ry="6" fill="rgba(80,55,30,.18)" />
    <path d="M24 192 C26 150 38 112 42 96 L58 96 C62 112 74 150 76 192 Z" fill={`url(#pw-${tone})`} />
    <ellipse cx="50" cy="96" rx="15" ry="6" fill={`url(#pw-${tone})`} />
    <circle cx="50" cy="66" r="24" fill={`url(#pw-${tone})`} />
    <ellipse cx="42" cy="56" rx="7" ry="5" fill="rgba(255,255,255,.35)" />
    {hand && <path d="M66 110 C80 96 84 78 86 62" stroke={`url(#pw-${tone})`} strokeWidth="12" strokeLinecap="round" fill="none" />}
  </svg>
);

/** moeda dourada (com R$ ou texto) */
export const Coin = ({ size = 140, label = 'R$', style }: P & { label?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: shadow, ...style }}>
    <defs><Grad id="coin-g" tone="gold" /></defs>
    <circle cx="50" cy="50" r="46" fill="url(#coin-g)" />
    <circle cx="50" cy="50" r="37" fill="none" stroke="rgba(150,100,10,.45)" strokeWidth="3" />
    <text x="50" y="60" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={900} fontSize={label.length > 3 ? 18 : 28} fill="#8A5E08">{label}</text>
    <ellipse cx="36" cy="30" rx="12" ry="7" fill="rgba(255,255,255,.45)" />
  </svg>
);

/** pilha de moedas com n moedas visíveis (0..max) */
export const Stack = ({ n, max = 7, size = 150, label, color = '#2D2A26' }: { n: number; max?: number; size?: number; label: string; color?: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
    <svg width={size} height={size * 1.25} viewBox="0 0 100 125" style={{ filter: shadow, overflow: 'visible' }}>
      <defs><linearGradient id="stk" x1="0" x2="1"><stop offset="0" stopColor="#E9B93A" /><stop offset=".5" stopColor="#FFE08A" /><stop offset="1" stopColor="#C2900F" /></linearGradient></defs>
      {Array.from({ length: max }).map((_, i) => i < n && (
        <g key={i} transform={`translate(0 ${110 - i * 13})`}>
          <rect x="12" y="0" width="76" height="12" rx="3" fill="url(#stk)" />
          <ellipse cx="50" cy="0" rx="38" ry="7" fill="#FFE7A3" stroke="#C99417" strokeWidth="1.2" />
        </g>
      ))}
    </svg>
    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 30, color, letterSpacing: 1, opacity: n > 0 ? 1 : 0 }}>{label}</div>
  </div>
);

/** casa */
export const House = ({ size = 220, style }: P) => (
  <svg width={size} height={size * 0.9} viewBox="0 0 120 108" style={{ filter: shadow, ...style }}>
    <defs>
      <linearGradient id="hw" x1="0" x2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#E3DED5" /></linearGradient>
      <linearGradient id="hr" x1="0" x2="1"><stop offset="0" stopColor="#3D5C8C" /><stop offset="1" stopColor="#1C2F52" /></linearGradient>
    </defs>
    <rect x="18" y="48" width="84" height="56" rx="4" fill="url(#hw)" />
    <path d="M8 54 L60 10 L112 54 L102 58 L60 22 L18 58 Z" fill="url(#hr)" />
    <rect x="30" y="72" width="18" height="32" rx="2" fill="#8A5A36" />
    <rect x="66" y="66" width="22" height="20" rx="2" fill="#1C2F52" />
  </svg>
);

/** capacete de obra (trabalho) */
export const HardHat = ({ size = 200, style }: P) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 120 90" style={{ filter: shadow, ...style }}>
    <defs><radialGradient id="hh" cx="35%" cy="25%" r="80%"><stop offset="0" stopColor="#FFE07A" /><stop offset="1" stopColor="#E0A400" /></radialGradient></defs>
    <path d="M18 66 C18 30 40 12 60 12 C80 12 102 30 102 66 Z" fill="url(#hh)" />
    <rect x="8" y="62" width="104" height="12" rx="6" fill="url(#hh)" />
    <rect x="54" y="12" width="12" height="52" rx="5" fill="rgba(255,255,255,.35)" />
  </svg>
);

/** carro (trânsito) */
export const Car = ({ size = 230, style }: P) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 140 84" style={{ filter: shadow, ...style }}>
    <defs><radialGradient id="car" cx="35%" cy="20%" r="85%"><stop offset="0" stopColor="#FF7B6B" /><stop offset="1" stopColor="#C42E22" /></radialGradient></defs>
    <path d="M10 56 C10 44 18 40 30 38 L44 18 C47 14 52 12 58 12 L88 12 C94 12 99 15 102 20 L114 38 C126 40 132 46 132 56 L132 62 L10 62 Z" fill="url(#car)" />
    <path d="M50 22 L60 22 L60 38 L40 38 Z M66 22 L86 22 C90 22 92 24 94 27 L102 38 L66 38 Z" fill="#CFE3F2" />
    <circle cx="36" cy="64" r="13" fill="#2B2B2B" /><circle cx="36" cy="64" r="5" fill="#9A9A9A" />
    <circle cx="106" cy="64" r="13" fill="#2B2B2B" /><circle cx="106" cy="64" r="5" fill="#9A9A9A" />
  </svg>
);

/** curativo/tala (sequela) */
export const Bandage = ({ size = 120, style }: P) => (
  <svg width={size} height={size * 0.45} viewBox="0 0 120 54" style={{ filter: shadow, ...style }}>
    <rect x="4" y="8" width="112" height="38" rx="19" fill="#F3E3CF" stroke="#D8BFA1" strokeWidth="2" />
    <rect x="42" y="8" width="36" height="38" fill="#E8D2B6" />
    {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <circle key={`${r}${c}`} cx={50 + c * 10} cy={18 + r * 9} r="2" fill="#C9AE8C" />))}
  </svg>
);

/** peso (kettlebell) */
export const Weight = ({ size = 140, style }: P) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: shadow, ...style }}>
    <defs><radialGradient id="kb" cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#6B6F78" /><stop offset="1" stopColor="#24262B" /></radialGradient></defs>
    <path d="M32 40 C32 14 68 14 68 40" stroke="url(#kb)" strokeWidth="11" fill="none" />
    <circle cx="50" cy="64" r="32" fill="url(#kb)" />
    <text x="50" y="72" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={900} fontSize="20" fill="#C8CCD4">KG</text>
  </svg>
);

/** carteira de trabalho */
export const WorkCard = ({ size = 190, style }: P) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 100 130" style={{ filter: shadow, ...style }}>
    <defs><linearGradient id="wc" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#2F5E9E" /><stop offset="1" stopColor="#173B6E" /></linearGradient></defs>
    <rect x="6" y="4" width="88" height="122" rx="8" fill="url(#wc)" />
    <rect x="6" y="4" width="10" height="122" rx="4" fill="rgba(0,0,0,.18)" />
    <circle cx="55" cy="48" r="17" fill="none" stroke="#E8C96A" strokeWidth="3" />
    <path d="M47 48 L53 54 L64 41" stroke="#E8C96A" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    <text x="55" y="88" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={800} fontSize="9.5" fill="#E8C96A">CARTEIRA DE</text>
    <text x="55" y="100" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={800} fontSize="9.5" fill="#E8C96A">TRABALHO</text>
  </svg>
);

/** lupa */
export const Magnifier = ({ size = 200, style }: P) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: shadow, ...style }}>
    <defs><radialGradient id="gl" cx="35%" cy="30%" r="75%"><stop offset="0" stopColor="rgba(255,255,255,.9)" /><stop offset="1" stopColor="rgba(190,215,235,.55)" /></radialGradient></defs>
    <path d="M62 62 L88 88" stroke="#5A3A22" strokeWidth="12" strokeLinecap="round" />
    <circle cx="42" cy="42" r="30" fill="url(#gl)" stroke="#C99417" strokeWidth="7" />
  </svg>
);

/** celular com conversa de WhatsApp */
export const Phone = ({ size = 330, lines = 3, style }: P & { lines?: number }) => (
  <svg width={size * 0.55} height={size} viewBox="0 0 110 200" style={{ filter: shadow, ...style }}>
    <rect x="4" y="2" width="102" height="196" rx="16" fill="#1E1E22" />
    <rect x="10" y="10" width="90" height="180" rx="11" fill="#EDE6DC" />
    <rect x="10" y="10" width="90" height="26" rx="11" fill="#1F8F5F" />
    <rect x="10" y="26" width="90" height="10" fill="#1F8F5F" />
    <circle cx="24" cy="23" r="7" fill="#CDEBDD" />
    <rect x="35" y="19" width="40" height="7" rx="3" fill="#CDEBDD" />
    {Array.from({ length: lines }).map((_, i) => (
      <rect key={i} x={i % 2 ? 40 : 16} y={48 + i * 26} width={i % 2 ? 54 : 58} height="18" rx="7" fill={i % 2 ? '#D3F3C6' : '#FFFFFF'} />
    ))}
  </svg>
);

/** balança da justiça (advogada) */
export const Scales = ({ size = 130, style }: P) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: shadow, ...style }}>
    <defs><linearGradient id="sc" x1="0" x2="1"><stop offset="0" stopColor="#E9B93A" /><stop offset="1" stopColor="#B07E0A" /></linearGradient></defs>
    <rect x="47" y="14" width="6" height="70" rx="3" fill="url(#sc)" />
    <rect x="30" y="82" width="40" height="8" rx="4" fill="url(#sc)" />
    <rect x="14" y="22" width="72" height="5" rx="2.5" fill="url(#sc)" />
    <path d="M18 27 L8 52 L28 52 Z M82 27 L72 52 L92 52 Z" fill="none" stroke="url(#sc)" strokeWidth="2" />
    <path d="M6 52 C6 62 30 62 30 52 Z M70 52 C70 62 94 62 94 52 Z" fill="url(#sc)" />
  </svg>
);
