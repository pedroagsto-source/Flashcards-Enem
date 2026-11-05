// Converte um HTML local em PDF A4 com margens e número de página.
// uso: node tools/pdf.js entrada.html saida.pdf
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + require('path').resolve(process.argv[2]), { waitUntil: 'load' }); await p.waitForTimeout(500);
  await p.pdf({ path: process.argv[3], format: 'A4', printBackground: true, displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: '<div style="width:100%;font:9px Helvetica,Arial;color:#9a9aa3;text-align:center"><span class="pageNumber"></span></div>',
    margin: { top: '16mm', bottom: '16mm', left: '15mm', right: '15mm' } });
  await b.close();
})();
