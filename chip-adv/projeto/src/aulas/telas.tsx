import { interpolate } from 'remotion';
import { brand, font } from '../brand';
import { A, BG, cl, pop } from './kit';

/** Telas simuladas (genéricas) para as aulas: navegador, app do Claude, pasta, conversa, permissão e cursor. */
const ui = font.ui;
export const Janela = ({ children, w = 1500, h = 840, titulo = '' }: { children: React.ReactNode; w?: number; h?: number; titulo?: string }) =>
  <div style={{ width: w, height: h, borderRadius: 18, overflow: 'hidden', background: '#F7F5F0', boxShadow: '0 40px 100px rgba(0,0,0,.6)', display: 'flex', flexDirection: 'column' }}>
    <div style={{ height: 46, background: '#E7E3DA', display: 'flex', alignItems: 'center', gap: 9, padding: '0 18px', flex: 'none' }}>
      {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <i key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />)}
      <span style={{ marginLeft: 16, fontFamily: ui, fontWeight: 600, fontSize: 20, color: '#555' }}>{titulo}</span></div>
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>{children}</div></div>;

export const Navegador = ({ url, children }: { url: string; children: React.ReactNode }) => <Janela titulo="">
  <div style={{ height: 56, background: '#EFECE5', display: 'flex', alignItems: 'center', padding: '0 24px' }}>
    <div style={{ flex: 1, height: 38, borderRadius: 19, background: '#fff', fontFamily: ui, fontSize: 22, color: '#333', display: 'flex', alignItems: 'center', padding: '0 20px' }}>🔒 {url}</div></div>
  <div style={{ position: 'absolute', inset: '56px 0 0 0' }}>{children}</div></Janela>;

export const Botao = ({ t, on, f, at = 0, x, y, cor = '#1b1b1f' }: { t: string; on?: boolean; f: number; at?: number; x: number; y: number; cor?: string }) => { const press = on && f >= at && f < at + 6;
  return <div style={{ position: 'absolute', left: x, top: y, background: cor, color: '#fff', fontFamily: ui, fontWeight: 800, fontSize: 26, padding: '16px 34px', borderRadius: 14, transform: `scale(${press ? .94 : 1})`,
    boxShadow: on && f >= at - 20 ? `0 0 0 6px ${A}` : 'none' }}>{t}</div>; };

export const Cursor = ({ f, de, ate, a0, a1 }: { f: number; de: [number, number]; ate: [number, number]; a0: number; a1: number }) => {
  const x = interpolate(f, [a0, a1], [de[0], ate[0]], cl), y = interpolate(f, [a0, a1], [de[1], ate[1]], cl); const clique = f >= a1 && f < a1 + 12;
  return <div style={{ position: 'absolute', left: x, top: y, zIndex: 50 }}>
    {clique && <i style={{ position: 'absolute', left: -30, top: -30, width: 60, height: 60, borderRadius: 30, border: `4px solid ${A}`, transform: `scale(${1 + (f - a1) / 8})`, opacity: 1 - (f - a1) / 12 }} />}
    <svg width={44} height={44} viewBox="0 0 24 24"><path d="M4 2l16 9-7 2-3 7z" fill="#fff" stroke="#111" strokeWidth={1.3} /></svg></div>; };

/** App do Claude simulado: abas Chat/Code, pasta de trabalho à esquerda e área de conversa. */
export const AppClaude = ({ code = true, pasta, children, destaque }: { code?: boolean; pasta?: string; children?: React.ReactNode; destaque?: boolean }) => <Janela titulo="Claude">
  <div style={{ height: 70, background: '#F1EEE7', borderBottom: '1px solid #e3ddd0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
    {['Chat', 'Code'].map((t) => { const on = (t === 'Code') === code; return <span key={t} style={{ fontFamily: ui, fontWeight: 800, fontSize: 24, padding: '10px 30px', borderRadius: 12, background: on ? '#1b1b1f' : 'transparent', color: on ? '#fff' : '#777',
      boxShadow: t === 'Code' && destaque ? `0 0 0 6px ${A}` : 'none' }}>{t}</span>; })}</div>
  <div style={{ position: 'absolute', inset: '70px 0 0 0', display: 'flex' }}>
    <div style={{ width: 300, background: '#EFECE5', padding: 24, fontFamily: ui, fontSize: 22, color: '#555' }}>
      <div style={{ fontWeight: 800, marginBottom: 14, color: '#333' }}>Pasta</div>{pasta ? <div style={{ fontWeight: 700, color: '#1b1b1f' }}>📁 {pasta}</div> : <div style={{ color: '#999' }}>escolher pasta…</div>}</div>
    <div style={{ flex: 1, position: 'relative', padding: 30, display: 'flex', flexDirection: 'column', gap: 18 }}>{children}</div></div></Janela>;

export const Msg = ({ de, children, f, at }: { de: 'voce' | 'claude'; children: React.ReactNode; f: number; at: number }) => { if (f < at) return null; const k = pop(f, at);
  const v = de === 'voce';
  return <div style={{ alignSelf: v ? 'flex-end' : 'flex-start', maxWidth: '82%', background: v ? '#1b1b1f' : '#fff', color: v ? '#fff' : '#1b1b1f', border: v ? 'none' : '2px solid #e3ddd0', borderRadius: 20, padding: '16px 22px',
    fontFamily: ui, fontWeight: 600, fontSize: 26, lineHeight: 1.35, transform: `scale(${.95 + .05 * k})`, opacity: k, transformOrigin: v ? '100% 50%' : '0 50%' }}>{children}</div>; };

export const Digitando = ({ texto, f, at, dur = 40 }: { texto: string; f: number; at: number; dur?: number }) => { const n = Math.floor(interpolate(f, [at, at + dur], [0, texto.length], cl));
  return <div style={{ marginTop: 'auto', background: '#fff', border: `2px solid ${f >= at ? A : '#e3ddd0'}`, borderRadius: 18, padding: '16px 22px', fontFamily: ui, fontWeight: 600, fontSize: 26, color: n ? '#1b1b1f' : '#aaa', minHeight: 64 }}>
    {n ? texto.slice(0, n) : 'Escreva para o Claude…'}<span style={{ opacity: f % 16 < 8 ? 1 : 0 }}>|</span></div>; };

export const Permissao = ({ cmd, f, at }: { cmd: string; f: number; at: number }) => { if (f < at) return null; const ok = f >= at + 40;
  return <div style={{ position: 'absolute', left: '50%', top: '42%', transform: `translate(-50%,-50%) scale(${pop(f, at)})`, width: 760, background: '#fff', borderRadius: 22, boxShadow: '0 30px 80px rgba(0,0,0,.35)', padding: 30, fontFamily: ui, zIndex: 40 }}>
    <div style={{ fontWeight: 900, fontSize: 30, color: '#1b1b1f' }}>O Claude quer rodar um comando</div>
    <div style={{ marginTop: 14, background: '#F1EEE7', borderRadius: 12, padding: '12px 16px', fontFamily: 'monospace', fontSize: 22, color: '#333' }}>{cmd}</div>
    <div style={{ display: 'flex', gap: 14, justifyContent: 'flex-end', marginTop: 22 }}>
      <span style={{ padding: '12px 26px', borderRadius: 12, border: '2px solid #ddd', fontWeight: 800, fontSize: 24, color: '#777' }}>Negar</span>
      <span style={{ padding: '12px 26px', borderRadius: 12, background: ok ? '#2f7d16' : '#1b1b1f', color: '#fff', fontWeight: 800, fontSize: 24, boxShadow: `0 0 0 5px ${A}` }}>{ok ? 'Permitido ✓' : 'Permitir'}</span></div></div>; };

export const Pasta = ({ nome, itens, f, at, novo }: { nome: string; itens: string[]; f: number; at: number; novo?: number }) =>
  <div style={{ width: 900, background: '#F7F5F0', borderRadius: 20, padding: 30, boxShadow: '0 30px 80px rgba(0,0,0,.5)', transform: `scale(${pop(f, at)})`, fontFamily: ui }}>
    <div style={{ fontWeight: 900, fontSize: 32, color: '#1b1b1f', marginBottom: 20 }}>📁 {nome}</div>
    <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap', minHeight: 120 }}>{itens.map((t, i) => { const d = novo !== undefined && i === itens.length - 1 ? novo : at; if (f < d) return null;
      return <div key={t} style={{ textAlign: 'center', width: 180, transform: `translateY(${(1 - pop(f, d)) * -60}px)` }}>
        <div style={{ fontSize: 70 }}>{t.endsWith('.zip') ? '🗜' : t.endsWith('.md') ? '📄' : t.endsWith('.pdf') ? '📕' : /\.(mov|mp4)$/.test(t) ? '🎬' : '📁'}</div>
        <div style={{ fontWeight: 700, fontSize: 20, color: '#333', wordBreak: 'break-all' }}>{t}</div></div>; })}</div></div>;

export const Rotulo = ({ t, f, at }: { t: string; f: number; at: number }) => f < at ? null :
  <div style={{ position: 'absolute', bottom: 80, left: 0, right: 0, textAlign: 'center' }}><span style={{ background: A, color: BG, fontFamily: ui, fontWeight: 900, fontSize: 40, padding: '14px 34px', borderRadius: 999, opacity: pop(f, at) }}>{t}</span></div>;

export const Card = ({ titulo, sub, f, at, w = 1300 }: { titulo: string; sub?: string; f: number; at: number; w?: number }) => f < at ? null :
  <div style={{ width: w, background: 'rgba(255,255,255,.05)', border: `2px solid ${A}55`, borderRadius: 24, padding: '26px 34px', opacity: pop(f, at), transform: `translateY(${(1 - pop(f, at)) * 20}px)` }}>
    <div style={{ fontFamily: ui, fontWeight: 900, fontSize: 42, color: brand.ink }}>{titulo}</div>
    {sub && <div style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 30, color: A, marginTop: 10 }}>{sub}</div>}</div>;
