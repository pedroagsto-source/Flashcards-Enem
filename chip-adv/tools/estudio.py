"""Gera o Estúdio CHIP ADV (mapa visual que abre no Claude) e o modelo do roteiro visual.

Saídas (dentro da skill, para ir junto no zip):
  skill/chip-adv/estudio/ESTUDIO.html          → escolhas: formato, estilo, fonte, cores, efeitos
  skill/chip-adv/estudio/STORYBOARD_MODELO.html → o Claude preenche os dados e o aluno escolhe a animação de cada momento
uso: python3 tools/estudio.py
"""
import base64, io, json, os, re
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = f'{R}/skill/chip-adv/estudio'


def img64(path, w=270, q=68):
    im = Image.open(path).convert('RGB'); h = round(im.height * w / im.width)
    b = io.BytesIO(); im.resize((w, h), Image.LANCZOS).save(b, 'JPEG', quality=q, optimize=True)
    return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()


def efeitos():
    md = open(f'{R}/mapa/MAPA_EFEITOS.md').read(); out = []
    for m in re.finditer(r'^\| (\d\d) \| \*\*(.+?)\*\* \| (.+?) \| "(.+?)" \| (.+?) \|$', md, re.M):
        i, nome, quando, pedido, dur = m.groups()
        out.append({'id': i, 'nome': nome, 'quando': quando, 'pedido': pedido, 'dur': dur, 'img': img64(f'{R}/mapa/previews/{i}.jpg')})
    return out


def estilos():
    md = open(f'{R}/bump2-identidade/ESTILOS.md').read(); out = []
    for m in re.finditer(r'^## (.+?)\n\*Indicado para: (.+?)\*\n\n```yaml\n(.*?)```', md, re.M | re.S):
        nome, ind, y = m.groups(); g = lambda k: (re.search(rf'^{k}: (.*)$', y, re.M) or [None, ''])[1].split('  #')[0].strip().strip('"')
        cores = dict(re.findall(r'(\w+): "(#[0-9A-Fa-f]{6})"', g('cores')))
        lst = lambda k: re.findall(r'\d\d', g(k))
        out.append({'id': g('id'), 'nome': nome, 'indicado': ind, 'cores': cores, 'titulo': g('fonte_titulo'), 'texto': g('fonte_texto'),
                    'legenda': g('legenda'), 'ritmo': g('ritmo'), 'efeitos': lst('efeitos'), 'evitar': lst('evitar'), 'trilha': g('trilha')})
    return out


FORMATOS = [
    {'id': 'fala', 'nome': 'Fala com efeitos', 'desc': 'Você falando para a câmera, com cortes, legenda viva e 1 efeito forte a cada 6–10 s. O formato mais versátil.', 'img': '05', 'efeitos': ['05', '17', '07', '12']},
    {'id': 'lista', 'nome': 'Lista numerada', 'desc': 'Ex.: "7 coisas que…". Cartão escuro no topo com o nome do item, contador 03/07 e uma tela demonstrando; título gigante embaixo. O último item é o mais forte.', 'img': '07', 'efeitos': ['07', '05', '12']},
    {'id': 'antes-depois', 'nome': 'Antes e depois', 'desc': 'Mostra a gravação crua e vira para a versão editada no momento da virada. Ótimo para prova e anúncio.', 'img': '15', 'efeitos': ['15', '09', '06', '12']},
    {'id': 'escritorio', 'nome': 'Escritório premium', 'desc': 'Você recortado na frente de um escritório desfocado, com capa de revista no gancho. Passa autoridade.', 'img': '01', 'efeitos': ['01', '16', '17', '07']},
    {'id': 'anuncio', 'nome': 'Anúncio direto', 'desc': 'Gancho forte, demonstração do processo e botão Saiba Mais no final. Feito para tráfego pago.', 'img': '03', 'efeitos': ['05', '03', '07', '06', '12']},
    {'id': 'desenho', 'nome': 'Desenho animado', 'desc': 'O vídeo inteiro vira uma tela dividida em desenho: o problema em cima, a solução embaixo, com a sua voz.', 'img': '13', 'efeitos': ['13']},
]

FONTES = [
    {'nome': 'Inter', 'peso': 900, 'caixa': True}, {'nome': 'Anton', 'peso': 400, 'caixa': True}, {'nome': 'Montserrat', 'peso': 900, 'caixa': True},
    {'nome': 'Bebas Neue', 'peso': 400, 'caixa': True}, {'nome': 'Manrope', 'peso': 800, 'caixa': False}, {'nome': 'Playfair Display', 'peso': 900, 'caixa': False},
    {'nome': 'Fraunces', 'peso': 800, 'caixa': False}, {'nome': 'DM Serif Display', 'peso': 400, 'caixa': False},
]

CSS = """
:root{--bg:#0B0B0F;--card:#15151B;--line:#26262E;--tx:#F4F2EC;--mut:#9A9AA6;--ac:#D8FF3C}
*{box-sizing:border-box}html,body{margin:0;background:var(--bg);color:var(--tx);font-family:Inter,system-ui,sans-serif}
.top{position:sticky;top:0;z-index:5;background:rgba(11,11,15,.94);backdrop-filter:blur(10px);border-bottom:1px solid var(--line);padding:14px 16px}
.marca{font-weight:900;letter-spacing:.02em}.marca b{color:var(--ac)}
.passos{display:flex;gap:8px;overflow-x:auto;margin-top:12px;scrollbar-width:none}
.passo{flex:none;border:1px solid var(--line);border-radius:12px;padding:8px 12px;font-size:12px;color:var(--mut);cursor:pointer;background:transparent;text-align:left}
.passo b{display:block;font-size:13px;color:var(--tx)}.passo.on{border-color:var(--ac);box-shadow:0 0 0 1px var(--ac) inset}.passo.ok b:after{content:" ✓";color:var(--ac)}
main{max-width:1100px;margin:0 auto;padding:20px 16px 120px}
h1{font-size:26px;margin:6px 0 4px}h1 i{font-family:'Playfair Display',serif;color:var(--ac)}.sub{color:var(--mut);margin:0 0 18px}
.grade{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px}
.c{background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:hidden;cursor:pointer;transition:.15s;position:relative}
.c:hover{transform:translateY(-2px);border-color:#3a3a46}.c.on{border-color:var(--ac);box-shadow:0 0 0 2px var(--ac)}
.c.on:after{content:"✓";position:absolute;top:10px;right:10px;width:28px;height:28px;border-radius:14px;background:var(--ac);color:#111;font-weight:900;display:grid;place-items:center}
.c.no{opacity:.45}.c.no:after{content:"✕";position:absolute;top:10px;right:10px;width:28px;height:28px;border-radius:14px;background:#E5322D;color:#fff;font-weight:900;display:grid;place-items:center}
.c img{display:block;width:100%;aspect-ratio:9/12;object-fit:cover;object-position:top}
.c .t{padding:12px}.c .t b{display:block;font-size:15px}.c .t span{display:block;color:var(--mut);font-size:12.5px;margin-top:4px;line-height:1.45}
.tag{display:inline-block;font-size:11px;border:1px solid var(--line);border-radius:999px;padding:2px 8px;margin:6px 4px 0 0;color:var(--mut)}
.tel{position:relative;aspect-ratio:9/16;background:#222 center/cover;overflow:hidden}
.tel .tit{position:absolute;left:8%;right:8%;top:10%;font-size:30px;line-height:1;text-align:center}
.tel .leg{position:absolute;left:6%;right:6%;bottom:22%;text-align:center;font-size:21px;line-height:1.15;text-shadow:0 3px 12px rgba(0,0,0,.7)}
.tel .leg em{font-style:normal;padding:0 6px;border-radius:7px}
.pal{display:flex;height:34px}.pal i{flex:1}
.barra{position:fixed;left:0;right:0;bottom:0;z-index:6;background:rgba(11,11,15,.96);border-top:1px solid var(--line);padding:12px 16px;display:flex;gap:10px;align-items:center;justify-content:space-between}
.barra small{color:var(--mut)}.btn{border:0;border-radius:999px;padding:12px 20px;font-weight:800;font-size:14px;cursor:pointer;background:var(--ac);color:#111}
.btn.sec{background:transparent;color:var(--tx);border:1px solid var(--line)}
.dica{background:#1b1f10;border:1px solid #3d4a14;border-radius:14px;padding:12px 14px;color:#d9e8a6;font-size:13.5px;margin:0 0 16px}
pre{white-space:pre-wrap;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px;font-size:13.5px;line-height:1.55}
.ef .modos{display:flex;gap:6px;padding:0 12px 12px}.ef .modos button{flex:1;font-size:12px;padding:7px;border-radius:9px;border:1px solid var(--line);background:transparent;color:var(--mut);cursor:pointer}
.ef .modos button.a{background:var(--ac);color:#111;border-color:var(--ac);font-weight:800}.ef .modos button.x{background:#E5322D;color:#fff;border-color:#E5322D;font-weight:800}
.cor input{width:100%;height:40px;border:0;background:none;cursor:pointer}
@media(max-width:520px){.grade{grid-template-columns:repeat(2,1fr);gap:10px}.c .t b{font-size:13.5px}.tel .tit{font-size:22px}.tel .leg{font-size:16px}h1{font-size:22px}}
"""

ESTUDIO_JS = r"""
const D = JSON.parse(document.getElementById('dados').textContent);
const S = {formato: null, estilo: null, fonte: null, cores: null, fav: new Set(), evitar: new Set()};
const P = [['formato','Passo 1','Formato'],['estilo','Passo 2','Estilo'],['fonte','Passo 3','Fonte da legenda'],['cores','Passo 4','Cores'],['efeitos','Passo 5','Peças de animação'],['resumo','Passo 6','Pronto']];
let atual = 'formato';
const $ = (s) => document.querySelector(s), el = (h) => { const d = document.createElement('div'); d.innerHTML = h.trim(); return d.firstChild; };
const est = () => D.estilos.find((e) => e.id === S.estilo) || D.estilos.find((e) => e.id === 'premium-escuro');
const cores = () => S.cores || est().cores;
const fonte = () => S.fonte || {nome: est().texto, peso: 900, caixa: /alta/i.test(est().legenda)};
function tel(e, f, c, tit) {
  const leg = f.caixa ? 'VOCÊ TEM <em>DIREITO</em> A ISSO' : 'Você tem <em>direito</em> a isso';
  return `<div class="tel" style="background-image:url(${D.base})"><div class="tit" style="font-family:'${e.titulo}';color:${c.texto||'#fff'}">${tit||'Seus direitos'}</div>
    <div class="leg" style="font-family:'${f.nome}';font-weight:${f.peso};color:${c.texto||'#fff'}">${leg.replace('<em>', `<em style="background:${c.destaque};color:${c.principal}">`)}</div></div>`;
}
function passos() {
  $('.passos').innerHTML = P.map(([k, n, t]) => `<button class="passo ${k===atual?'on':''} ${feito(k)?'ok':''}" data-k="${k}">${n}<b>${t}</b></button>`).join('');
  document.querySelectorAll('.passo').forEach((b) => b.onclick = () => ir(b.dataset.k));
}
const feito = (k) => k === 'efeitos' ? S.fav.size > 0 : k === 'resumo' ? false : !!S[k];
function ir(k) { atual = k; passos(); render(); window.scrollTo({top: 0, behavior: 'smooth'}); }
function prox() { const i = P.findIndex((p) => p[0] === atual); ir(P[Math.min(i + 1, P.length - 1)][0]); }
function render() {
  const m = $('main'); const e = est(), c = cores(), f = fonte();
  if (atual === 'formato') {
    m.innerHTML = `<h1>Qual <i>formato</i> de vídeo?</h1><p class="sub">Os formatos que mais funcionam para advogado. Escolha um para este vídeo.</p><div class="grade"></div>`;
    D.formatos.forEach((x) => { const d = el(`<div class="c ${S.formato===x.id?'on':''}"><img src="${D.ef[x.img].img}"><div class="t"><b>${x.nome}</b><span>${x.desc}</span></div></div>`);
      d.onclick = () => { S.formato = x.id; x.efeitos.forEach((i) => S.fav.add(i)); prox(); }; $('.grade').append(d); });
  }
  if (atual === 'estilo') {
    m.innerHTML = `<h1>Escolha o <i>estilo</i></h1><p class="sub">Cores, fontes, ritmo e trilha combinando. Dá para ajustar fonte e cor nos próximos passos.</p><div class="grade"></div>`;
    D.estilos.forEach((x) => { const d = el(`<div class="c ${S.estilo===x.id?'on':''}">${tel(x, {nome: x.texto, peso: 900, caixa: /alta/i.test(x.legenda)}, x.cores, x.nome)}
      <div class="pal">${Object.values(x.cores).map((v) => `<i style="background:${v}"></i>`).join('')}</div><div class="t"><b>${x.nome}</b><span>${x.indicado}</span><span>${x.ritmo}</span></div></div>`);
      d.onclick = () => { S.estilo = x.id; S.cores = null; S.fonte = null; x.efeitos.forEach((i) => S.fav.add(i)); x.evitar.forEach((i) => { S.evitar.add(i); S.fav.delete(i); }); prox(); }; $('.grade').append(d); });
  }
  if (atual === 'fonte') {
    m.innerHTML = `<h1>Fonte da <i>legenda</i></h1><p class="sub">Veja como a legenda fica no seu vídeo.</p><div class="grade"></div>`;
    D.fontes.forEach((x) => { const d = el(`<div class="c ${f.nome===x.nome?'on':''}">${tel(e, x, c, ' ')}<div class="t"><b style="font-family:'${x.nome}';font-weight:${x.peso}">${x.nome}</b><span>${x.caixa?'Caixa alta':'Caixa normal'}</span></div></div>`);
      d.onclick = () => { S.fonte = x; prox(); }; $('.grade').append(d); });
  }
  if (atual === 'cores') {
    m.innerHTML = `<h1>Paleta de <i>cores</i></h1><p class="sub">A cor de destaque acende na palavra falada e nos efeitos. Use as cores do seu escritório, se tiver.</p><div class="grade"></div>
      <h1 style="font-size:19px;margin-top:26px">Ou monte a sua</h1><div class="grade" id="minha"></div>`;
    D.estilos.forEach((x) => { const d = el(`<div class="c ${JSON.stringify(c)===JSON.stringify(x.cores)?'on':''}">${tel(e, f, x.cores, ' ')}<div class="pal">${Object.values(x.cores).map((v) => `<i style="background:${v}"></i>`).join('')}</div><div class="t"><b>${x.nome}</b></div></div>`);
      d.onclick = () => { S.cores = x.cores; prox(); }; $('.grade').append(d); });
    [['principal','Fundo / principal'],['destaque','Destaque (palavra acesa)'],['texto','Texto']].forEach(([k, t]) => {
      const d = el(`<div class="c cor"><div class="t"><b>${t}</b><input type="color" value="${c[k]||'#ffffff'}"></div></div>`);
      d.querySelector('input').oninput = (ev) => { S.cores = {...c, ...(S.cores||{}), [k]: ev.target.value}; }; $('#minha').append(d); });
  }
  if (atual === 'efeitos') {
    m.innerHTML = `<h1>Peças de <i>animação</i></h1><p class="sub">Marque as que você quer ver no seu vídeo (✓) e as que nunca devem entrar (✕). O CHIP ADV escolhe o momento certo de cada uma.</p>
      <p class="dica">Regra de ouro: 1 efeito forte a cada 6–10 segundos. Já marcamos as que combinam com o formato e o estilo escolhidos.</p><div class="grade"></div>`;
    D.efeitos.forEach((x) => { const st = S.fav.has(x.id) ? 'on' : S.evitar.has(x.id) ? 'no' : '';
      const d = el(`<div class="c ef ${st}"><img src="${x.img}"><div class="t"><b>${x.id} · ${x.nome}</b><span>${x.quando} · ${x.dur}</span></div>
        <div class="modos"><button class="${st==='on'?'a':''}" data-m="on">✓ Quero</button><button class="${st==='no'?'x':''}" data-m="no">✕ Evitar</button></div></div>`);
      d.querySelectorAll('button').forEach((b) => b.onclick = (ev) => { ev.stopPropagation(); const mm = b.dataset.m;
        if (mm === 'on') { S.evitar.delete(x.id); S.fav.has(x.id) ? S.fav.delete(x.id) : S.fav.add(x.id); } else { S.fav.delete(x.id); S.evitar.has(x.id) ? S.evitar.delete(x.id) : S.evitar.add(x.id); }
        render(); passos(); });
      $('.grade').append(d); });
  }
  if (atual === 'resumo') {
    const txt = pedido(); m.innerHTML = `<h1>Pronto! Seu <i>estilo</i> está montado.</h1><p class="sub">Copie e cole na conversa com o Claude, junto com o seu vídeo. Ou baixe o arquivo e salve na pasta do CHIP ADV para valer em todos os vídeos.</p>
      <div style="display:grid;grid-template-columns:minmax(180px,260px) 1fr;gap:16px;align-items:start" class="res">${tel(e, f, c, 'Seu vídeo')}<pre>${txt}</pre></div>
      <p style="display:flex;gap:10px;flex-wrap:wrap;margin-top:16px"><button class="btn" id="cp">Copiar escolhas</button><button class="btn sec" id="dl">Baixar MEU_ESTILO.md</button></p>`;
    $('#cp').onclick = () => copiar(txt, $('#cp')); $('#dl').onclick = () => baixar('MEU_ESTILO.md', txt);
    if (innerWidth < 520) $('.res').style.gridTemplateColumns = '1fr';
  }
  $('#prox').style.display = atual === 'resumo' ? 'none' : '';
  $('#info').textContent = `${S.fav.size} efeitos escolhidos · ${S.evitar.size} evitados`;
}
function pedido() {
  const e = est(), c = cores(), f = fonte(), fm = D.formatos.find((x) => x.id === S.formato) || D.formatos[0];
  const nm = (ids) => [...ids].sort().map((i) => `${i} ${D.ef[i].nome}`).join(', ') || '—';
  return `# MEU_ESTILO · escolhas do Estúdio CHIP ADV
formato: ${fm.nome} — ${fm.desc}
estilo: ${e.nome} (${e.id})
fonte_titulo: ${e.titulo}
fonte_legenda: ${f.nome} ${f.peso}, ${f.caixa ? 'caixa alta' : 'caixa normal'}
cores: principal ${c.principal}, destaque ${c.destaque}, texto ${c.texto || '#FFFFFF'}${c.clara ? ', clara ' + c.clara : ''}
legenda: ${e.legenda}
ritmo: ${e.ritmo}
trilha: ${e.trilha}
efeitos_preferidos: ${nm(S.fav)}
evitar: ${nm(S.evitar)}

Pedido: "Edita o meu vídeo com o CHIP ADV usando essas escolhas. Me mostra o roteiro visual para eu escolher as animações de cada momento."`;
}
function copiar(t, b) { navigator.clipboard.writeText(t).then(() => { b.textContent = 'Copiado ✓'; setTimeout(() => b.textContent = 'Copiar escolhas', 1800); }); }
function baixar(n, t) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([t], {type: 'text/markdown'})); a.download = n; a.click(); }
$('#prox').onclick = prox; passos(); render();
"""

ESTUDIO = """<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Estúdio CHIP ADV</title><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Cormorant+Garamond:wght@700&family=DM+Serif+Display&family=Fraunces:wght@800&family=Inter:wght@400;800;900&family=Manrope:wght@800&family=Montserrat:wght@800;900&family=Playfair+Display:ital,wght@0,900;1,700&display=swap">
<style>__CSS__</style></head><body>
<div class="top"><div class="marca">CHIP <b>ADV</b> · Estúdio</div><div class="passos"></div></div><main></main>
<div class="barra"><small id="info"></small><button class="btn" id="prox">Próximo →</button></div>
<script type="application/json" id="dados">__DADOS__</script><script>__JS__</script></body></html>"""

STORY_JS = r"""
const D = Object.assign(JSON.parse(document.getElementById('roteiro').textContent), {efeitos: JSON.parse(document.getElementById('efeitos').textContent)});
const esc = {}; const $ = (s) => document.querySelector(s);
const c = D.cores || {destaque: '#D8FF3C', principal: '#0B0B0F'}; document.documentElement.style.setProperty('--ac', c.destaque);
$('#tit').textContent = D.titulo || 'Roteiro de edição'; $('#sub').textContent = D.resumo || '';
const m = $('#lista');
D.momentos.forEach((mo, k) => {
  esc[k] = mo.opcoes[0] ? mo.opcoes[0].efeito : null;
  const d = document.createElement('section'); d.className = 'mo';
  d.innerHTML = `<div class="hd"><span class="tc">${mo.inicio} – ${mo.fim}</span><b>${mo.frase}</b>${mo.funcao ? `<span class="tag">${mo.funcao}</span>` : ''}</div><div class="ops"></div>`;
  [...mo.opcoes, {efeito: '00', nome: 'Sem efeito', motivo: 'Só legenda e cortes neste trecho.'}].forEach((o) => {
    const ef = D.efeitos[o.efeito]; const b = document.createElement('div'); b.className = 'c' + (esc[k] === o.efeito ? ' on' : '');
    b.innerHTML = `${ef ? `<img src="${ef.img}">` : '<div class="vazio">só legenda</div>'}<div class="t"><b>${o.efeito !== '00' ? o.efeito + ' · ' : ''}${o.nome || (ef && ef.nome)}</b><span>${o.motivo || ''}</span></div>`;
    b.onclick = () => { esc[k] = o.efeito; d.querySelectorAll('.c').forEach((x) => x.classList.remove('on')); b.classList.add('on'); };
    d.querySelector('.ops').append(b);
  });
  m.append(d);
});
function texto() {
  return 'Aprovo o roteiro com estas escolhas:\n' + D.momentos.map((mo, k) => { const e = esc[k]; const ef = D.efeitos[e];
    return `- ${mo.inicio}–${mo.fim} "${mo.frase}": ${e === '00' || !e ? 'sem efeito' : e + ' ' + ef.nome}`; }).join('\n') + '\nPode renderizar.';
}
$('#ok').onclick = () => navigator.clipboard.writeText(texto()).then(() => { $('#ok').textContent = 'Copiado ✓ cole na conversa'; });
"""

STORY = """<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Roteiro CHIP ADV</title>
<style>__CSS__ .mo{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:14px;margin:0 0 14px}.hd{display:flex;gap:10px;align-items:baseline;flex-wrap:wrap;margin-bottom:12px}
.tc{font-family:ui-monospace,monospace;color:var(--ac);font-size:13px}.hd b{font-size:16px}.ops{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
.vazio{aspect-ratio:9/12;display:grid;place-items:center;color:var(--mut);background:#101015;font-size:13px}</style></head><body>
<div class="top"><div class="marca">CHIP <b>ADV</b> · Roteiro visual</div></div>
<main><h1 id="tit"></h1><p class="sub" id="sub"></p><p class="dica">Em cada momento, toque na animação que você prefere. A primeira é a sugestão do CHIP ADV. No final, copie e cole na conversa.</p><div id="lista"></div></main>
<div class="barra"><small>Revise e aprove</small><button class="btn" id="ok">Copiar aprovação</button></div>
<!-- O CHIP ADV troca SÓ o conteúdo do bloco "roteiro" abaixo (JSON). Não mexa no bloco "efeitos". -->
<script type="application/json" id="roteiro">__ROTEIRO__</script>
<script type="application/json" id="efeitos">__EFEITOS__</script><script>__JS__</script></body></html>"""

EXEMPLO = {'titulo': 'Exemplo · Pensão alimentícia', 'resumo': '38 s · estilo Premium Escuro · 4 momentos com animação',
           'momentos': [
               {'inicio': '0:00', 'fim': '0:03', 'frase': 'Você paga pensão e acha que é para sempre?', 'funcao': 'gancho', 'opcoes': [
                   {'efeito': '05', 'motivo': 'Zoom seco com "PENSÃO" gigante prende nos 3 primeiros segundos.'}, {'efeito': '17', 'motivo': 'Frase em vidro atrás de você, mais elegante.'}]},
               {'inicio': '0:08', 'fim': '0:16', 'frase': 'Existem 3 situações em que ela pode acabar', 'funcao': 'lista', 'opcoes': [
                   {'efeito': '07', 'motivo': 'Cada situação vira um item marcado no tempo da sua fala.'}, {'efeito': '14', 'motivo': 'Rabisco à mão em cada número.'}]},
               {'inicio': '0:21', 'fim': '0:24', 'frase': 'Mas atenção: não para sozinha', 'funcao': 'alerta', 'opcoes': [
                   {'efeito': '04', 'motivo': 'Carimbo "ATENÇÃO" marca o alerta.'}, {'efeito': '09', 'motivo': 'Corte no zoom para virar o assunto.'}]},
               {'inicio': '0:33', 'fim': '0:38', 'frase': 'Agende uma consulta pelo link', 'funcao': 'chamada final', 'opcoes': [
                   {'efeito': '12', 'motivo': 'Você recortado com o botão na tela.'}, {'efeito': '16', 'motivo': 'Fecha com cara de capa de revista.'}]}]}


def main():
    os.makedirs(OUT, exist_ok=True)
    ef = efeitos(); efd = {e['id']: e for e in ef}
    base = img64(f'{R}/bump2-identidade/assets/base.jpg', 300, 72) if os.path.exists(f'{R}/bump2-identidade/assets/base.jpg') else ef[0]['img']
    dados = {'formatos': FORMATOS, 'estilos': estilos(), 'fontes': FONTES, 'efeitos': [{k: v for k, v in e.items()} for e in ef], 'ef': efd, 'base': base}
    dados['efeitos'] = ef; dados['ef'] = {e['id']: {'nome': e['nome'], 'img': e['img']} for e in ef}
    open(f'{OUT}/ESTUDIO.html', 'w').write(ESTUDIO.replace('__CSS__', CSS).replace('__JS__', ESTUDIO_JS).replace('__DADOS__', json.dumps(dados, ensure_ascii=False)))
    rot = dict(EXEMPLO, cores={'principal': '#0B0B0F', 'destaque': '#D8FF3C'})
    efs = json.dumps({e['id']: {'nome': e['nome'], 'img': e['img']} for e in ef}, ensure_ascii=False)
    open(f'{OUT}/STORYBOARD_MODELO.html', 'w').write(STORY.replace('__CSS__', CSS).replace('__JS__', STORY_JS)
                                                     .replace('__ROTEIRO__', json.dumps(rot, ensure_ascii=False, indent=1)).replace('__EFEITOS__', efs))
    for n in ['ESTUDIO.html', 'STORYBOARD_MODELO.html']: print(n, os.path.getsize(f'{OUT}/{n}') // 1024, 'KB')
    print(len(ef), 'efeitos ·', len(dados['estilos']), 'estilos')


if __name__ == '__main__':
    main()
