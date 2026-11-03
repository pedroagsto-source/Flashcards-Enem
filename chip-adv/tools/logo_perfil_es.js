const { chromium } = require('playwright'); const fs=require('fs'); const F='/home/user/Flashcards-Enem/chip-adv/projeto/node_modules/@fontsource';
const ff=(fam,file,w,st='normal')=>`@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(data:font/woff2;base64,${fs.readFileSync(F+'/'+file).toString('base64')})}`;
const pins=(side)=>Array.from({length:4},(_,i)=>{const p=330+i*140-34;return side==='t'?`<rect x="${p}" y="150" width="68" height="110" rx="20"/>`:side==='b'?`<rect x="${p}" y="820" width="68" height="110" rx="20"/>`:side==='l'?`<rect x="150" y="${p}" width="110" height="68" rx="20"/>`:`<rect x="820" y="${p}" width="110" height="68" rx="20"/>`}).join('');
const logo=`<svg width="1080" height="1080" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
<defs><radialGradient id="g" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#16170f"/><stop offset="1" stop-color="#08080A"/></radialGradient></defs>
<rect width="1080" height="1080" fill="url(#g)"/>
<g fill="#D8FF3C">${pins('t')+pins('b')+pins('l')+pins('r')}</g>
<rect x="230" y="230" width="620" height="620" rx="120" fill="#D8FF3C"/>
<rect x="268" y="268" width="544" height="544" rx="92" fill="none" stroke="#0B0B0F" stroke-opacity=".14" stroke-width="6"/>
<text x="540" y="470" text-anchor="middle" font-family="IS" font-style="italic" font-size="150" fill="#0B0B0F">chip</text>
<text x="540" y="650" text-anchor="middle" font-family="Inter" font-weight="900" font-size="106" letter-spacing="-4" fill="#0B0B0F">ABOGADO</text>
</svg>`;
const css=ff('Inter','inter/files/inter-latin-900-normal.woff2',900)+ff('IS','instrument-serif/files/instrument-serif-latin-400-italic.woff2',400,'italic');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1080}});
await p.setContent(`<style>${css}*{margin:0}body{width:1080px;height:1080px}</style>${logo}`);await p.waitForTimeout(300);await p.screenshot({path:'/home/user/Flashcards-Enem/chip-adv/social/fanpage/logo_perfil_es_1080.png'});
fs.writeFileSync('/home/user/Flashcards-Enem/chip-adv/social/fanpage/logo_chipabogado.svg',logo);
await p.setViewportSize({width:900,height:300});
const src='data:image/png;base64,'+fs.readFileSync('/home/user/Flashcards-Enem/chip-adv/social/fanpage/logo_perfil_es_1080.png').toString('base64');
await p.setContent(`<body style="margin:0;background:#fff;display:flex;gap:40px;align-items:center;padding:30px;font-family:sans-serif">${[240,120,60,40].map(s=>`<img src="${src}" style="width:${s}px;height:${s}px;border-radius:50%">`).join('')}<div style="background:#18191a;padding:20px;border-radius:12px;display:flex;gap:20px">${[120,40].map(s=>`<img src="${src}" style="width:${s}px;height:${s}px;border-radius:50%">`).join('')}</div></body>`);
await p.waitForTimeout(200);await p.screenshot({path:'/tmp/claude-0/-home-user-Flashcards-Enem/c7361efd-4ca4-56ae-a946-7ff10e96e142/scratchpad/logo_preview_es.png'});await b.close();})();
