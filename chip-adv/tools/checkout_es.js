// Imagens do checkout da Hotmart (LATAM). uso: node tools/checkout_es.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const R = path.resolve(__dirname, '..'); const F = R + '/projeto/node_modules/@fontsource'; const OUT = R + '/checkout/imagens/es';
fs.mkdirSync(OUT, { recursive: true });
const ff = (fam, file, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(data:font/woff2;base64,${fs.readFileSync(F + '/' + file).toString('base64')})}`;
const fonts = ff('Inter', 'inter/files/inter-latin-600-normal.woff2', 600) + ff('Inter', 'inter/files/inter-latin-800-normal.woff2', 800) + ff('Inter', 'inter/files/inter-latin-900-normal.woff2', 900) + ff('IS', 'instrument-serif/files/instrument-serif-latin-400-italic.woff2', 400, 'italic');
const base = `<style>${fonts}*{box-sizing:border-box;margin:0}body{font-family:Inter;color:#F4F2EC;background:#08080A}.ac{font-family:IS;font-style:italic;font-weight:400;color:#D8FF3C}</style>`;
const pecas = {
  banner: [1560, 400, `<div style="width:1560px;height:400px;display:flex;align-items:center;justify-content:space-around;background:radial-gradient(60% 120% at 20% 50%,#1b2208,#08080A 70%);padding:0 60px">
    <div style="font-weight:900;font-size:84px;line-height:1;letter-spacing:-3px">Tú hablas.<br>El CHIP <span class="ac" style="font-size:96px">edita.</span></div>
    <div style="width:2px;height:220px;background:#26262E"></div>
    <div><div style="font-weight:900;font-size:150px;line-height:.9;letter-spacing:-6px"><span style="font-size:56px;vertical-align:58px;letter-spacing:0">US$</span>19</div><div style="font-weight:600;font-size:34px;color:#9C9CA6;margin-top:10px">pago único · acceso inmediato</div></div>
    <div style="width:2px;height:220px;background:#26262E"></div>
    <div style="text-align:center"><div style="font-size:70px;color:#D8FF3C">⛨</div><div style="font-weight:800;font-size:40px;line-height:1.1">Garantía<br>de <span style="color:#D8FF3C">7 días</span></div></div></div>`],
  producto: [600, 400, `<div style="width:600px;height:400px;display:grid;place-items:center;background:radial-gradient(80% 90% at 50% 40%,#1b2208,#08080A 75%)"><div style="text-align:center">
    <div style="font-weight:900;font-size:76px;letter-spacing:-2px">CHIP <span style="color:#D8FF3C">ABOGADO</span></div>
    <div style="font-weight:600;font-size:28px;color:#B4B4BE;margin-top:14px">Prompt maestro de edición de video</div></div></div>`],
  'sello-garantia': [600, 600, `<div style="width:600px;height:600px;display:grid;place-items:center;background:transparent"><div style="width:540px;height:540px;border-radius:50%;background:#08080A;border:16px solid #D8FF3C;display:grid;place-items:center;text-align:center">
    <div><div style="font-weight:900;font-size:150px;line-height:1;color:#D8FF3C">7</div><div style="font-weight:900;font-size:56px">DÍAS</div><div style="font-weight:600;font-size:30px;color:#B4B4BE;margin-top:10px">de garantía<br>o te devolvemos todo</div></div></div></div>`],
};
(async () => {
  const b = await chromium.launch();
  for (const [n, [w, h, html]] of Object.entries(pecas)) {
    const p = await b.newPage({ viewport: { width: w, height: h } }); await p.setContent(base + html); await p.waitForTimeout(200);
    await p.screenshot({ path: OUT + '/' + n + '.png', omitBackground: n === 'sello-garantia' }); await p.close();
  }
  await b.close();
})();
