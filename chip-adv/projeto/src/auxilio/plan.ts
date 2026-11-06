import segs from './segs.json';

/** Teste criativo do auxílio-acidente: 4 hooks × 3 bodies, montados a partir das falas (segs.json, em segundos do clipe). */
type RawSeg = { s: number; e: number; text: string; words: { w: string; s: number; e: number }[] };
const SEGS = segs as Record<string, RawSeg[]>;

export type HookId = 'h1' | 'h2' | 'h3' | 'h4';
export type BodyId = 'a' | 'b' | 'c' | 'd';
export type Estilo = 'premium' | 'nativo' | 'manchete';

export const HOOK_IDS: HookId[] = ['h1', 'h2', 'h3', 'h4'];
export const BODY_IDS: BodyId[] = ['a', 'b', 'c'];
export const ESTILOS: Estilo[] = ['premium', 'nativo', 'manchete'];
/** ângulos de câmera virtuais: padrao = alterna 2 enquadramentos; multicam = aberto/fechado/médio como 3 câmeras; pushin = aproxima/afasta devagar em cada fala */
export type Angulo = 'padrao' | 'multicam' | 'pushin';
export const ANGULOS: Angulo[] = ['padrao', 'multicam', 'pushin'];

export const HOOKS: Record<HookId, { clip: string; name: string; manchete: [string, string] }> = {
  h1: { clip: '8559', name: 'Benefício que quase nenhuma mulher pede', manchete: ['O benefício do INSS que', 'quase nenhuma mulher pede'] },
  h2: { clip: '8560', name: 'Pino ou placa', manchete: ['Colocou pino ou placa', 'depois de uma queda?'] },
  h3: { clip: '8561', name: 'Voltou a trabalhar', manchete: ['Voltou a trabalhar', 'depois do acidente?'] },
  h4: { clip: '8562', name: 'Caiu de moto', manchete: ['Caiu de moto e ficou', 'com alguma limitação?'] },
};

const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
export const BODIES: Record<BodyId, { name: string; parts: [string, number[]][] }> = {
  a: { name: 'Explicação', parts: [['8565', range(0, 10)]] },
  b: { name: 'História + CTA', parts: [['8566', range(0, 7)], ['8565', [9, 10]]] },
  c: { name: 'História + explicação', parts: [['8566', range(0, 7)], ['8565', range(1, 10)]] },
  // d: explicação sem a frase "até com aposentadoria" (seg 8) — usada no formato tela dividida
  d: { name: 'Explicação (sem aposentadoria)', parts: [['8565', [0, 1, 2, 3, 4, 5, 6, 7, 9, 10]]] },
};

export type W = { w: string; g: number; ge: number; key: string; k: boolean };
export type Piece = { clip: string; key: string; hook: boolean; inF: number; outF: number; start: number; dur: number; words: W[]; zooms: [number, number][] };
export type Timeline = { pieces: Piece[]; words: W[]; total: number };

const FPS = 30, PRE = 0.1, POST = 0.12;
const KEYS = ['inss', 'salário', 'mulher', 'pino', 'placa', 'queda', 'erro', 'moto', 'limitação', 'conta', 'auxílio-acidente', 'sequela', 'força', 'peso',
  'igual', 'carteira', 'doméstica', 'rural', 'ninguém', 'mês', 'aposentadoria', 'encaixa', 'botão', 'quatro', 'minuto', 'advogada', 'punho', 'afastada',
  'dobro', 'sacola', 'pote', 'direito', 'atenção', 'comum', 'acidente'];
export const norm = (w: string) => w.toLowerCase().replace(/[^\p{L}-]/gu, '');

const cache = new Map<string, Timeline>();
export const build = (hook: HookId, body: BodyId): Timeline => {
  const id = hook + body;
  if (cache.has(id)) return cache.get(id)!;
  const list: [string, number, boolean][] = [];
  SEGS[HOOKS[hook].clip].forEach((_, i) => list.push([HOOKS[hook].clip, i, true]));
  for (const [clip, idx] of BODIES[body].parts) idx.forEach((i) => list.push([clip, i, false]));

  // janelas em frames do clipe, sem sobrepor falas vizinhas do mesmo clipe
  const win = list.map(([clip, i]) => {
    const s = SEGS[clip][i];
    return [Math.max(0, Math.floor((s.s - PRE) * FPS)), Math.ceil((s.e + POST) * FPS)];
  });
  list.forEach(([clip, i], n) => {
    const nx = list[n + 1];
    if (nx && nx[0] === clip && nx[1] === i + 1 && win[n + 1][0] < win[n][1]) {
      const mid = Math.round((win[n][1] + win[n + 1][0]) / 2);
      win[n][1] = mid; win[n + 1][0] = mid;
    }
  });

  let t = 0, zi = 0;
  const pieces: Piece[] = list.map(([clip, i, hk], n) => {
    const [inF, outF0] = win[n];
    const outF = n === list.length - 1 ? outF0 + 10 : outF0; // respiro no fim, sem cortar o CTA
    const s = SEGS[clip][i];
    const key = `${clip}:${i}`;
    const words: W[] = s.words.map((w) => ({ w: w.w, g: t + Math.round(w.s * FPS) - inF, ge: t + Math.round(w.e * FPS) - inF, key, k: false }));
    // enquadramento alterna a cada fala; falas longas trocam de novo numa pausa perto do meio (esconde o jump cut)
    const zooms: [number, number][] = [[t, zi++]];
    const dur = outF - inF;
    if (dur > 100) {
      const cands = words.filter((w, j) => j > 0 && /[,.?!]$/.test(words[j - 1].w));
      const mid = t + dur / 2;
      const best = cands.sort((a, b) => Math.abs(a.g - mid) - Math.abs(b.g - mid))[0];
      if (best && best.g - t > 40 && t + dur - best.g > 40) zooms.push([best.g - 2, zi++]);
    }
    const p = { clip, key, hook: hk, inF, outF, start: t, dur, words, zooms };
    t += dur;
    return p;
  });
  const words = pieces.flatMap((p) => p.words);
  const tl = { pieces, words, total: t };
  cache.set(id, tl);
  return tl;
};

/** frame global da palavra (prefixo) dentro da fala clip:i, ou null se essa fala não está nesta montagem */
export const at = (tl: Timeline, key: string, word?: string) => {
  const p = tl.pieces.find((x) => x.key === key);
  if (!p) return null;
  if (!word) return p.start;
  const w = p.words.find((x) => norm(x.w).startsWith(word));
  return w ? w.g : p.start;
};
export const endOf = (tl: Timeline, key: string) => {
  const p = tl.pieces.find((x) => x.key === key);
  return p ? p.start + p.dur : null;
};

export type Group = { start: number; end: number; words: W[] };
/** legenda: 2–4 palavras por vez, quebrando na pontuação; no máximo 1 palavra-chave por grupo */
export const groups = (tl: Timeline, max = 3): Group[] => {
  const out: Group[] = [];
  for (const p of tl.pieces) {
    let cur: Group | null = null;
    p.words.forEach((w, j) => {
      if (!cur) cur = { start: w.g, end: w.ge, words: [] };
      cur.words.push({ ...w });
      cur.end = w.ge;
      const len = cur.words.reduce((a, x) => a + x.w.length, 0);
      if (cur.words.length >= max || (/[,.?!]$/.test(w.w) && cur.words.length >= 1) || len > 15 || j === p.words.length - 1) {
        const kw = cur.words.find((x) => KEYS.some((k) => norm(x.w).startsWith(k)));
        if (kw) kw.k = true;
        out.push(cur);
        cur = null;
      }
    });
  }
  out.forEach((g, i) => {
    const nx = out[i + 1];
    g.end = nx && nx.start - g.end < 14 ? nx.start : g.end + 6;
  });
  return out;
};
