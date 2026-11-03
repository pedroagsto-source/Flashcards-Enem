const { chromium } = require('playwright'); const fs=require('fs'); const A='/tmp/claude-0/-home-user-Flashcards-Enem/c7361efd-4ca4-56ae-a946-7ff10e96e142/scratchpad/fxes'; const F='/home/user/Flashcards-Enem/chip-adv/projeto/node_modules/@fontsource';
const ff=(fam,file,w,st='normal')=>`@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(data:font/woff2;base64,${fs.readFileSync(F+'/'+file).toString('base64')})}`;
const img=p=>'data:image/jpeg;base64,'+fs.readFileSync(A+'/'+p).toString('base64');
const html=(guia)=>`<style>${ff('Inter','inter/files/inter-latin-600-normal.woff2',600)+ff('Inter','inter/files/inter-latin-800-normal.woff2',800)+ff('Inter','inter/files/inter-latin-900-normal.woff2',900)+ff('IS','instrument-serif/files/instrument-serif-latin-400-italic.woff2',400,'italic')}
*{margin:0;box-sizing:border-box}body{width:1640px;height:624px;overflow:hidden;font-family:Inter;color:#F4F2EC;
background:radial-gradient(700px 420px at 78% 40%,rgba(216,255,60,.16),transparent 70%),radial-gradient(600px 400px at 10% 110%,rgba(120,90,255,.18),transparent 70%),#08080A}
.ac{font-family:IS;font-style:italic;font-weight:400;color:#D8FF3C}
.k{position:absolute;left:300px;top:122px;font-weight:800;font-size:22px;letter-spacing:.2em;color:#D8FF3C}
h1{position:absolute;left:296px;top:168px;font-weight:900;font-size:70px;line-height:1;letter-spacing:-2.5px}
h1 .ac{font-size:84px;letter-spacing:-.5px}
.sub{position:absolute;left:300px;top:347px;font-weight:600;font-size:21px;color:#B4B4BE;line-height:1.4}
.chip{position:absolute;left:300px;top:410px;display:flex;gap:12px}.chip span{border:2px solid #2b2b33;border-radius:999px;padding:8px 18px;font-weight:800;font-size:19px;color:#E9E7E1}
.fone{position:absolute;top:var(--t);left:var(--l);width:150px;height:267px;border-radius:24px;overflow:hidden;transform:rotate(var(--r));box-shadow:0 0 0 4px #1d1d22,0 30px 60px rgba(0,0,0,.6)}
.fone img{width:100%;height:100%;object-fit:cover}.fone.on{z-index:3;box-shadow:0 0 0 4px #D8FF3C,0 0 60px rgba(216,255,60,.35),0 30px 60px rgba(0,0,0,.6)}
.tag{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);background:#D8FF3C;color:#0B0B0F;font-weight:900;font-size:12px;padding:4px 8px;border-radius:7px;white-space:nowrap}
.g{position:absolute;top:0;bottom:0;left:265px;width:1110px;outline:3px dashed red}</style>
<div class="k">EDICIÓN DE VIDEO PARA ABOGADOS</div>
<h1>Tú hablas.<br>El CHIP <span class="ac">edita.</span></h1>
<div class="sub">1 archivo en tu IA. Corte, subtítulos, efectos y música.</div>
<div class="chip"><span>Reels</span><span>TikTok</span><span>Anuncios</span></div>
<div class="fone" style="--l:905px;--t:185px;--r:-7deg"><img src="${img('fx-e05.jpg')}"><b class="tag">Zoom de impacto</b></div>
<div class="fone on" style="--l:1060px;--t:158px;--r:0deg"><img src="${img('fx-e16.jpg')}"><b class="tag">Portada de revista</b></div>
<div class="fone" style="--l:1213px;--t:185px;--r:7deg"><img src="${img('fx-e17.jpg')}"><b class="tag">Palabra de vidrio</b></div>
${guia?'<div class="g"></div>':''}`;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1640,height:624}});
await p.setContent(html(false));await p.waitForTimeout(300);await p.screenshot({path:'/home/user/Flashcards-Enem/chip-adv/social/fanpage/capa_facebook_es_1640x624.png'});
await p.setContent(html(true));await p.waitForTimeout(300);await p.screenshot({path:'/tmp/claude-0/-home-user-Flashcards-Enem/c7361efd-4ca4-56ae-a946-7ff10e96e142/scratchpad/capa_guia_es.png'});await b.close();})();
