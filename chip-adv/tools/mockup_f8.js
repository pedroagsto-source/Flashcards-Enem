// Mockup do F8 ("IA editou este vídeo"), estilo HUD com fundo neon verde. uso: node tools/mockup_f8.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const R = path.resolve(__dirname, '..'); const F = R + '/projeto/node_modules/@fontsource'; const CUT = R + '/projeto/public/f1/cutout/corpo';
const OUT = R + '/criativos/F8_mockup';
const ff = (fam, file, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url('file://${F}/${file}')}`;
const fonts = ff('Inter', 'inter/files/inter-latin-600-normal.woff2', 600) + ff('Inter', 'inter/files/inter-latin-800-normal.woff2', 800) + ff('Inter', 'inter/files/inter-latin-900-normal.woff2', 900) ;
const G = '#3DFF7A', G2 = '#B6FF3C', DK = '#04140A';
const css = `${fonts}*{margin:0;box-sizing:border-box}body{width:540px;height:960px;overflow:hidden;font-family:Inter;color:#fff;background:#020805}
.bg{position:absolute;inset:0;background:radial-gradient(60% 45% at 50% 38%,rgba(61,255,122,.22),transparent 70%),linear-gradient(180deg,#03150a,#010603 70%)}
.led{position:absolute;top:0;bottom:0;width:6px;background:${G};box-shadow:0 0 18px ${G},0 0 60px ${G},0 0 120px rgba(61,255,122,.6)}
.sh{position:absolute;height:5px;background:#0c2a16;box-shadow:0 0 12px rgba(61,255,122,.5)}
.bk{position:absolute;border-radius:50%;background:${G};filter:blur(6px);opacity:.35}
.p{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.leg{position:absolute;left:0;right:0;top:600px;text-align:center;font-weight:900;font-size:34px;text-shadow:0 3px 14px rgba(0,0,0,.8)}.leg b{color:${G}}
.big{position:absolute;left:0;right:0;top:70px;text-align:center;font-weight:900;font-size:56px;line-height:1;letter-spacing:-1.5px;text-shadow:0 4px 20px rgba(0,0,0,.7)}
.mono{font-family:'DejaVu Sans Mono',monospace;font-size:11px;letter-spacing:.06em;color:${G}}
.box{position:absolute;border:2px solid ${G};box-shadow:0 0 12px rgba(61,255,122,.6)}
.tag{position:absolute;background:${G};color:${DK};font-family:'DejaVu Sans Mono',monospace;font-weight:700;font-size:10px;padding:2px 5px}
.hud{position:absolute;left:14px;top:14px;right:14px;display:flex;justify-content:space-between}
.card{position:absolute;background:rgba(2,16,8,.85);border:1px solid rgba(61,255,122,.5);border-radius:12px;backdrop-filter:blur(6px)}
.num{position:absolute;right:10px;bottom:8px;font-family:Mono;font-size:12px;color:#9fe8b6;background:rgba(0,0,0,.6);padding:2px 6px;border-radius:4px}`;
const bg = `<div class="bg"></div>${[40, 120, 420, 495].map((x) => `<div class="led" style="left:${x}px;opacity:${x < 200 ? .9 : .7}"></div>`).join('')}
${[[0, 180, 160], [0, 300, 160], [380, 220, 160], [380, 340, 160]].map(([x, y, w]) => `<div class="sh" style="left:${x}px;top:${y}px;width:${w}px"></div>`).join('')}
${[[70, 250, 14], [470, 160, 10], [450, 420, 18], [90, 460, 12], [250, 120, 8]].map(([x, y, s]) => `<div class="bk" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px"></div>`).join('')}`;
const pessoa = (f, extra = '') => `<img class="p" style="${extra}" src="file://${CUT}/${String(f).padStart(5, '0')}.webp">`;
const hud = (a, b) => `<div class="hud"><span class="mono">● ${a}</span><span class="mono">${b}</span></div>`;
const wave = (n, hi = [], red = []) => Array.from({ length: n }, (_, i) => { const h = 6 + Math.abs(Math.sin(i * 1.7) * 30) + (i % 5) * 3; const c = red.includes(i) ? '#FF4A3D' : hi.includes(i) ? G : 'rgba(61,255,122,.35)'; return `<i style="display:inline-block;width:4px;margin-right:2px;height:${h}px;background:${c};vertical-align:middle;border-radius:2px"></i>`; }).join('');
const cenas = [
  ['01', '0–3 s · Gancho', `${bg}${pessoa(40)}<div class="big">ERREI<br>GAGUEJEI<br><span style="color:${G}">E VOCÊ NÃO<br>VIU NADA.</span></div>`],
  ['02', '3–7 s · Visão computacional', `${bg}${pessoa(120)}${hud('VISÃO COMPUTACIONAL · RECONHECENDO', 'OBJETOS 05')}
    <div class="box" style="left:165px;top:300px;width:210px;height:230px"></div><div class="tag" style="left:165px;top:282px">EDITOR: IA ✓</div>
    <div class="tag" style="left:330px;top:318px">ROSTO 0,96</div><div class="tag" style="left:140px;top:380px">OLHOS</div><div class="tag" style="left:330px;top:455px">BOCA</div><div class="tag" style="left:250px;top:560px">OMBRO</div>
    <div class="leg">quem editou <b>não fui eu</b></div>`],
  ['03', '7–13 s · Ela ouviu palavra por palavra', `${bg}<div class="card" style="left:30px;top:90px;width:480px;height:330px;overflow:hidden">${`<div style="position:absolute;inset:0;transform:scale(.9);transform-origin:50% 0">${bg}</div>` + pessoa(200, 'position:absolute;inset:auto;left:0;top:-210px;width:480px;height:853px;object-fit:cover')}</div>
    <div class="card" style="left:30px;top:440px;width:480px;padding:14px"><div class="mono" style="margin-bottom:10px">TRANSCRIÇÃO · PALAVRA 48 / 179</div>
    <div style="font-weight:800;font-size:22px;margin-bottom:12px">ela ouviu <span style="background:${G};color:${DK};padding:2px 8px;border-radius:6px">palavra</span> por palavra</div><div>${wave(70, [30, 31, 32, 33])}</div></div>`],
  ['04', '13–17 s · Achou cada erro e cortou', `${bg}<div class="card" style="left:30px;top:90px;width:480px;height:280px;overflow:hidden">${`<div style="position:absolute;inset:0">${bg}</div>` + pessoa(260, 'position:absolute;left:0;top:-230px;width:480px;height:853px;object-fit:cover')}</div>
    <div class="card" style="left:300px;top:300px;width:190px;padding:12px"><div class="mono">ANÁLISE DO BRUTO</div><div style="font-weight:900;font-size:46px;line-height:1">17 <span style="font-size:18px">cortes</span></div><div class="mono" style="color:#9fe8b6">20 pausas · 1 "entendeu?"</div></div>
    <div class="card" style="left:30px;top:420px;width:480px;padding:14px"><div class="mono" style="margin-bottom:10px">LINHA DO TEMPO · CORTES EM VERMELHO</div><div>${wave(70, [], [5, 6, 14, 15, 16, 27, 28, 40, 41, 52, 60, 61])}</div></div>
    <div class="leg" style="top:620px">cada <b>erro</b>, cada <b>pausa</b></div>`],
  ['05', '17–26 s · Melhor tomada, legenda e zoom', `${bg}${pessoa(330, 'transform:scale(1.18);transform-origin:50% 35%')}${hud('ZOOM AUTOMÁTICO · ÂNCORA: ROSTO', '1,18×')}
    <div class="card" style="left:20px;top:60px;width:240px;padding:8px"><div class="mono">TOMADA 1</div><div style="font-size:12px;font-weight:800">"a mesma frase..." ✕</div></div>
    <div class="card" style="left:280px;top:60px;width:240px;padding:8px;border-color:${G}"><div class="mono">TOMADA 2 · MELHOR ✓</div><div style="font-size:12px;font-weight:800">"a mesma frase..."</div></div>
    <div class="box" style="left:150px;top:180px;width:240px;height:240px;border-style:dashed"></div><div class="tag" style="left:150px;top:162px">AUTOMÁTICO ✓</div>
    <div class="leg">legenda <b>certinha</b> com a boca</div>`],
  ['06', '26–30 s · Recortou e trocou o cenário', `<div style="position:absolute;inset:0;background:#000"></div>
    <div style="position:absolute;left:60px;top:150px;width:300px;height:533px;border:2px solid ${G};transform:perspective(900px) rotateY(25deg);background:#111;opacity:.6"><span class="tag" style="left:6px;top:6px">02 · FUNDO ANTIGO</span></div>
    <div style="position:absolute;left:160px;top:110px;width:330px;height:587px;overflow:hidden;transform:perspective(900px) rotateY(25deg);border:2px solid ${G};box-shadow:0 0 30px rgba(61,255,122,.5)">${bg}</div>
    ${pessoa(380, 'filter:drop-shadow(0 0 10px #3DFF7A)')}<div class="tag" style="left:30px;top:120px">01 · VOCÊ</div><div class="tag" style="left:380px;top:90px">03 · CENÁRIO NOVO</div>
    <div class="leg">recortou e <b>trocou o cenário</b></div>`],
  ['07', '30–35 s · Texto e animação no tempo da fala', `${bg}${pessoa(400)}${hud('RASTREIO DE MOVIMENTO', '21 PONTOS')}
    ${[[110, 520], [140, 560], [180, 545], [320, 530], [360, 570], [395, 548]].map(([x, y]) => `<i style="position:absolute;left:${x}px;top:${y}px;width:8px;height:8px;border-radius:50%;background:${G};box-shadow:0 0 10px ${G}"></i>`).join('')}
    <svg style="position:absolute;inset:0" width="540" height="960"><polyline points="114,524 144,564 184,549" stroke="${G}" stroke-width="2" fill="none"/><polyline points="324,534 364,574 399,552" stroke="${G}" stroke-width="2" fill="none"/></svg>
    <div class="tag" style="left:70px;top:480px;font-size:14px;padding:4px 8px">TEXTO</div><div class="tag" style="left:380px;top:490px;font-size:14px;padding:4px 8px">ANIMAÇÃO</div>
    <div class="leg" style="top:650px">pelo momento da <b>fala</b></div>`],
  ['08', '36–41 s · Horas → minutos', `${bg}${pessoa(150)}<div class="big" style="top:80px"><s style="text-decoration-color:#FF4A3D;text-decoration-thickness:8px;color:rgba(255,255,255,.55)">HORAS</s><div style="font-size:18px;margin-top:6px;color:#cfe">PRA EDITAR NA MÃO</div>
    <div style="font-size:18px;margin-top:22px">ELE ENTREGA EM POUCOS</div><div style="color:${G};font-size:66px">MINUTOS</div></div>`],
  ['09', '41–45 s · Eu só disse o que queria', `${bg}${pessoa(250)}
    <div class="card" style="left:30px;top:90px;width:480px;padding:14px"><div class="mono" style="margin-bottom:8px">CHIP ADV · COMANDO</div>
    <div style="display:flex;gap:8px;margin-bottom:10px"><span style="background:#0e3b1f;border:1px solid ${G};border-radius:6px;padding:3px 8px;font-size:12px">🎬 bruto.mov</span><span style="background:#0e3b1f;border:1px solid ${G};border-radius:6px;padding:3px 8px;font-size:12px">📄 CHIP_ADV.md</span></div>
    <div style="font-weight:800;font-size:20px">Roda o CHIP ADV.<span style="color:${G}">|</span></div></div>
    <div style="position:absolute;left:150px;top:260px;background:${DK};border:2px solid ${G};border-radius:14px;padding:10px 18px;font-weight:900;font-size:26px;color:${G};box-shadow:0 0 30px rgba(61,255,122,.6);transform:rotate(-4deg)">EDIÇÃO CONCLUÍDA ✓</div>`],
  ['10', '45–52 s · Chamada (Saiba mais)', `${bg}${pessoa(560)}<div class="big" style="top:70px;font-size:40px">ADVOGADO,<br><span style="color:${G}">TRAVA NA HORA<br>DE EDITAR?</span></div>
    <div style="position:absolute;left:0;right:0;top:640px;display:flex;justify-content:center"><div style="background:${G};color:${DK};font-weight:900;font-size:30px;padding:16px 34px;border-radius:999px;box-shadow:0 0 40px rgba(61,255,122,.7)">Saiba mais →</div></div>
    <svg width="44" height="44" viewBox="0 0 24 24" style="position:absolute;left:330px;top:675px"><path d="M4 2l16 9-7 2-3 7z" fill="#fff" stroke="#111" stroke-width="1.3"/></svg>`],
];
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 540, height: 960 } });
  const abre = async (html) => { const f = `${OUT}/_tmp.html`; fs.writeFileSync(f, `<!doctype html><meta charset="utf-8">${html}`); await p.goto('file://' + f); };
  for (const [n, , html] of cenas) { await abre(`<style>${css}</style>${html}`); await p.waitForTimeout(250); await p.screenshot({ path: `${OUT}/cena${n}.png` }); }
  // prancha com legendas
  const imgs = cenas.map(([n, t]) => `<figure><img src="file://${OUT}/cena${n}.png"><figcaption><b>${n}</b> ${t}</figcaption></figure>`).join('');
  await p.setViewportSize({ width: 1700, height: 1300 });
  await abre(`<style>${fonts}body{margin:0;padding:24px;background:#0b0b0f;font-family:Inter;color:#eee}h1{font-weight:900;font-size:26px;margin:0 0 4px}p{margin:0 0 16px;color:#9a9aa3}
    .g{display:grid;grid-template-columns:repeat(5,1fr);gap:16px}figure{margin:0}img{width:100%;border-radius:10px;display:block}figcaption{font-size:13px;margin-top:6px;color:#cfcfd6}figcaption b{color:${G}}</style>
    <h1>F8 · "Uma IA editou este vídeo" · mockup v1 (fundo neon verde)</h1><p>Quadros-chave em 9:16. Seu recorte real sobre o cenário verde; HUD, legendas e textos já na identidade do CHIP ADV.</p><div class="g">${imgs}</div>`);
  await p.waitForTimeout(400); await p.screenshot({ path: `${OUT}/MOCKUP_F8.png`, fullPage: true });
  fs.unlinkSync(`${OUT}/_tmp.html`); await b.close();
})();
