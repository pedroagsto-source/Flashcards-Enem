/* CHIP ADV · landing — interações. Sem dependências. */
(function () {
  'use strict';
  var C = window.CFG || {}, TL = window.TL || [];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var brl = function (v) { return (C.moeda || 'US$') + ' ' + Number(v).toFixed(2).replace('.00', ''); };
  var mmss = function (s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  var local = location.protocol === 'file:' || /^(localhost|127\.|192\.168\.|10\.)/.test(location.hostname);
  var reduz = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var store = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
                set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };

  /* ---------- 1. Oferta (config num lugar só) ---------- */
  var parc = C.parcelas ? C.parcelas + ' cuotas de ' + brl(C.valorParcela) : '';
  var vals = {
    precoCurto: C.parcelas ? brl(C.preco) + ' o ' + parc : 'Pago único de ' + brl(C.preco), garantiaDias: C.garantiaDias, assinaturaIA: C.assinaturaIA,
    instrutor: C.instrutor, instrutorRole: C.instrutorRole, empresa: C.empresa, provaSocial: C.provaSocial || '',
    parcLabel: 'En ' + (C.parcelas || '') + ' cuotas', precoDeTx: C.precoDe ? brl(C.precoDe) : ''
  };
  $$('[data-cfg]').forEach(function (el) { var k = el.getAttribute('data-cfg'); if (vals[k] != null) el.textContent = vals[k]; });
  $$('[data-cfg-show]').forEach(function (el) { el.hidden = !C[el.getAttribute('data-cfg-show')]; });
  var ofDe = $('[data-of-de]'); if (ofDe) ofDe.hidden = !C.precoDe;
  function precoModo(m) {
    var v = $('[data-of-valor]'), ou = $('[data-of-ou]'); if (!v) return;
    if (m === 'parc' && C.parcelas) { v.innerHTML = '<small>' + C.parcelas + 'x</small>' + brl(C.valorParcela).replace((C.moeda || 'US$') + ' ', '<small>' + (C.moeda || 'US$') + '</small>'); ou.textContent = 'o ' + brl(C.preco) + ' en un pago'; }
    else { v.innerHTML = '<small>' + (C.moeda || 'US$') + '</small>' + String(C.preco); ou.textContent = C.parcelas ? 'o ' + parc : 'Pago único · acceso inmediato'; }
    var sg = $('.of-seg'); if (sg) sg.hidden = !C.parcelas;
  }
  precoModo('vista');
  $$('input[name="of-modo"]').forEach(function (r) { r.addEventListener('change', function () { precoModo(r.value); }); });

  /* UTMs: guarda a primeira origem e repassa pro checkout */
  (function () {
    var q = location.search.replace(/^\?/, ''); if (/utm_|fbclid|gclid|ttclid/.test(q)) store.set('chipabogado_utm', q);
  })();
  function urlCheckout() {
    if (!C.checkoutUrl) return null;
    var q = store.get('chipabogado_utm') || location.search.replace(/^\?/, '');
    return q ? C.checkoutUrl + (C.checkoutUrl.indexOf('?') < 0 ? '?' : '&') + q : C.checkoutUrl;
  }
  $$('[data-checkout]').forEach(function (a) {
    var u = urlCheckout(); if (u) a.href = u;
    a.addEventListener('click', function () { if (window.fbq) fbq('track', 'InitiateCheckout', { value: C.preco, currency: 'USD' }); if (window.gtag) gtag('event', 'begin_checkout', { value: C.preco, currency: 'USD' }); if (window.ttq) ttq.track('InitiateCheckout'); });
  });

  /* ---------- 2. Promoção com prazo real ---------- */
  var P = C.promo || {}, fim = P.fim ? Date.parse(P.fim) : NaN;
  if (P.ligada && fim > Date.now()) {
    document.documentElement.classList.add('promo-on');
    $$('[data-promo="nome"]').forEach(function (el) { el.textContent = P.nome || 'Oferta'; });
    var f = $('[data-fita]'); if (f) { var s = ''; for (var i = 0; i < 12; i++) s += '<span>' + (P.nome || 'Oferta') + '</span><span>CHIP ABOGADO</span>'; f.innerHTML = s + s; }
    var tick = function () {
      var d = Math.max(0, fim - Date.now()), t = Math.floor(d / 1000);
      var tx = (t >= 86400 ? Math.floor(t / 86400) + 'd ' : '') + [Math.floor(t / 3600) % 24, Math.floor(t / 60) % 60, t % 60].map(function (n) { return String(n).padStart(2, '0'); }).join(':');
      $$('[data-timer]').forEach(function (el) { el.textContent = tx; });
      if (d <= 0) document.documentElement.classList.remove('promo-on');
    };
    tick(); setInterval(tick, 1000);
  }

  /* ---------- 3. Vídeos sob demanda ---------- */
  function carrega(v) { if (v.dataset.src && !v.getAttribute('src')) { v.src = v.dataset.src; v.preload = 'auto'; } }
  function toca(v) { carrega(v); var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  var ioCarrega = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { carrega(e.target); ioCarrega.unobserve(e.target); } });
  }, { rootMargin: '300px 0px' }) : null;
  var ioAuto = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting && !reduz) toca(e.target); else e.target.pause(); });
  }, { threshold: .35 }) : null;
  $$('video[data-src]').forEach(function (v) { if (ioCarrega) ioCarrega.observe(v); else carrega(v); });
  $$('video[data-auto]').forEach(function (v) { if (ioAuto) ioAuto.observe(v); });
  var quandoVisivel = function (el, fn, th) {
    if (!el) return; if (!('IntersectionObserver' in window)) return fn();
    var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); fn(); } }, { threshold: th || .3 }); io.observe(el);
  };

  /* ---------- 4. Hero: nome do efeito no tempo do vídeo ---------- */
  (function () {
    var v = $('[data-hero] video'), leg = $('[data-hero-leg]'), barra = $('[data-hero-barra]'), som = $('[data-hero-som]'); if (!v) return;
    var cortes = [[0, 'Zoom de impacto'], [4.47, 'Palabra de vidrio'], [7.27, 'Antes y después'], [11.9, 'Corte con zoom'], [12.7, 'Detrás de cámaras'],
      [15.77, 'Mapa en pantalla'], [17.7, 'Checklist'], [25.53, 'Subtítulo vivo'], [27.9, 'Comandos en pantalla'], [33.27, 'Portada de revista'], [36.03, 'Recorte + botón']];
    v.addEventListener('timeupdate', function () {
      var t = v.currentTime, n = cortes[0][1]; cortes.forEach(function (c) { if (t >= c[0]) n = c[1]; });
      if (leg.textContent !== n) leg.textContent = n;
      if (v.duration) barra.style.width = (t / v.duration * 100) + '%';
    });
    som.addEventListener('click', function () {
      if (v.muted) { v.muted = false; v.currentTime = 0; toca(v); som.innerHTML = '<span>🔇</span> Quitar el sonido'; }
      else { v.muted = true; som.innerHTML = '<span>🔊</span> Reproducir con sonido'; }
    });
  })();

  /* ---------- 5. Linha do tempo: a IA editando ---------- */
  (function () {
    var box = $('[data-tl]'); if (!box || !TL.length) return;
    var vb = $('[data-tl-bruto]'), vp = $('[data-tl-pronto]'), agulha = $('[data-tl-agulha]'), agora = $('[data-tl-agora]');
    var passo = $('[data-tl-passo]'), frase = $('[data-tl-frase]'), dp = $('[data-tl-dp]'), btn = $('[data-tl-toca]');
    var DB = 52.42, DP = TL[TL.length - 1].p1, modo = 'bruto', timers = [];
    function trilho(el, cls) {
      var h = '', t = 0;
      TL.forEach(function (c) {
        if (c.b0 > t + .01) h += '<span class="tl-seg tl-x" style="--d:' + (c.b0 - t).toFixed(2) + '"></span>';
        h += '<span class="tl-seg ' + cls + '" style="--d:' + (c.b1 - c.b0).toFixed(2) + '" title="' + c.t.replace(/"/g, '') + '"></span>'; t = c.b1;
      });
      if (DB > t) h += '<span class="tl-seg tl-x" style="--d:' + (DB - t).toFixed(2) + '"></span>';
      el.innerHTML = h;
    }
    trilho($('[data-tl-v]'), 'tl-k'); trilho($('[data-tl-f]'), 'tl-k'); trilho($('[data-tl-l]'), 'tl-leg');
    var b2p = function (t) { for (var i = 0; i < TL.length; i++) { var c = TL[i]; if (t < c.b0) return c.p0; if (t <= c.b1) return c.p0 + (t - c.b0); } return DP; };
    var p2b = function (t) { for (var i = 0; i < TL.length; i++) { var c = TL[i]; if (t <= c.p1) return c.b0 + Math.max(0, t - c.p0); } return DB; };
    var ativo = function () { return modo === 'bruto' ? vb : vp; };
    function pos() {
      var v = ativo(), t = v.currentTime || 0, cortado = box.classList.contains('cortado');
      var frac = modo === 'bruto' ? (cortado ? b2p(t) / DP : t / DB) : (cortado ? t / DP : p2b(t) / DB);
      var tr = $('[data-tl-v]'), base = tr.offsetLeft;
      agulha.style.left = (base + Math.min(1, frac) * tr.offsetWidth) + 'px';
      agora.textContent = mmss(t);
      btn.classList.toggle('on', !v.paused);
      requestAnimationFrame(pos);
    }
    function troca(m, sinc) {
      var de = ativo(), t = de.currentTime || 0; modo = m;
      vb.hidden = m !== 'bruto'; vp.hidden = m !== 'pronto';
      $$('input[name="tl-fonte"]').forEach(function (r) { r.checked = r.value === m; });
      var para = ativo(); carrega(para);
      if (sinc !== false) { try { para.currentTime = m === 'pronto' ? b2p(t) : p2b(t); } catch (e) {} }
      de.pause(); toca(para);
    }
    var falas = [
      ['Paso 1 de 5', 'Escuchando tu grabación.'],
      ['Paso 2 de 5', 'Encontré 20 pausas y una muletilla de más.'],
      ['Paso 3 de 5', 'Quité lo que sobraba. 52 s se volvieron 41 s.'],
      ['Paso 4 de 5', 'Escribí el subtítulo al ritmo de tu voz.'],
      ['Paso 5 de 5', 'Puse 7 efectos y la música. Listo para publicar.']
    ];
    function etapa(i) {
      box.dataset.passo = i + 1; passo.textContent = falas[i][0]; frase.textContent = falas[i][1];
      if (i >= 2) { box.classList.add('cortado'); dp.textContent = '0:41'; }
      if (i >= 3) box.classList.add('legendado');
      if (i === 4) troca('pronto', false);
    }
    function roda() {
      timers.forEach(clearTimeout); timers = [];
      box.classList.remove('cortado', 'legendado'); dp.textContent = '0:52';
      troca('bruto', false); try { vb.currentTime = 0; } catch (e) {}
      etapa(0);
      [2600, 5400, 8200, 11000].forEach(function (ms, k) { timers.push(setTimeout(function () { etapa(k + 1); }, reduz ? 0 : ms)); });
    }
    $$('input[name="tl-fonte"]').forEach(function (r) { r.addEventListener('change', function () { troca(r.value); }); });
    btn.addEventListener('click', function () { var v = ativo(); if (v.paused) toca(v); else v.pause(); });
    $('[data-tl-denovo]').addEventListener('click', roda);
    var linha = $('.tl-linha', box);
    linha.addEventListener('click', function (e) {
      var tr = $('[data-tl-v]'), r = tr.getBoundingClientRect(), fr = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      var cortado = box.classList.contains('cortado'), v = ativo();
      var t = modo === 'bruto' ? (cortado ? p2b(fr * DP) : fr * DB) : (cortado ? fr * DP : b2p(fr * DB));
      try { v.currentTime = t; } catch (err) {} toca(v);
    });
    quandoVisivel(box, function () { roda(); requestAnimationFrame(pos); }, .35);
  })();

  /* ---------- 6. Conversa roteirizada ---------- */
  (function () {
    var box = $('[data-cv]'); if (!box) return;
    var fio = $('[data-cv-fio]'), inp = $('[data-cv-input]'), ped = $('[data-cv-pedidos]'), chips = $('[data-cv-chips]'), timers = [];
    var passos = $$('[data-cv-p]');
    var marca = function (n) { passos.forEach(function (li) { li.classList.toggle('on', li.dataset.cvP == n); }); };
    var add = function (cls, html) { var d = document.createElement('div'); d.className = 'm ' + cls; d.innerHTML = html; fio.appendChild(d); fio.scrollTop = fio.scrollHeight; return d; };
    var arq = function (ext, nome, sub) { return '<span class="m-arq"><i class="' + (ext === 'PDF' ? 'pdf' : '') + '">' + ext + '</i><span><b>' + nome + '</b><small>' + sub + '</small></span></span>'; };
    var depois = function (ms, fn) { timers.push(setTimeout(fn, reduz ? 0 : ms)); };
    function digita(txt, fim) {
      inp.classList.add('cheio'); inp.textContent = ''; var i = 0;
      (function passo() { inp.textContent = txt.slice(0, ++i); if (i < txt.length) depois(28, passo); else depois(350, function () { inp.textContent = 'Escreva ou solte um arquivo'; inp.classList.remove('cheio'); fim(); }); })();
    }
    function iaResponde(html, ms, fim) {
      var p = add('m-ia', '<span class="m-pensa"><i></i><i></i><i></i></span>');
      depois(ms, function () { p.innerHTML = html; fio.scrollTop = fio.scrollHeight; if (fim) fim(); });
    }
    var pedidos = [
      ['Haz el subtítulo más grande', 'Listo. Agrandé el subtítulo y mantuve el destaque en las palabras clave.', 'legenda'],
      ['Pon la frase fuerte detrás de mí', 'Listo. La frase entra en vidrio, detrás de ti.', 'e17'],
      ['Haz un checklist de lo que diga', 'Listo. Cada ítem se marca cuando lo dices.', 'e07'],
      ['Hazlo parecer portada de revista', 'Listo. Portada de revista en el tramo final.', 'e16'],
      ['Abre con un gancho fuerte', 'Listo. Zoom seco y la palabra clave gigante en el primer segundo.', 'e05'],
      ['Haz una versión de 15 segundos', 'Listo. Gancho + llamado final: 12 segundos.', 'hook-h1']
    ];
    chips.innerHTML = pedidos.map(function (p, i) { return '<button type="button" data-i="' + i + '">' + p[0] + '</button>'; }).join('');
    chips.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return; var p = pedidos[b.dataset.i];
      ped.hidden = true;
      digita(p[0], function () { add('m-eu', p[0]); iaResponde(p[1] + '<img class="m-img" src="../chip-adv/assets/clipes/' + p[2] + '.jpg" alt="" loading="lazy">', 1300, function () { ped.hidden = false; }); });
    });
    function roda() {
      timers.forEach(clearTimeout); timers = []; fio.innerHTML = ''; ped.hidden = true; marca(1);
      depois(300, function () { add('m-eu', arq('.MD', 'CHIP_ABOGADO.md', 'prompt maestro')); });
      depois(900, function () { add('m-eu', arq('PDF', 'mapa-efectos.pdf', '17 efectos')); });
      depois(1500, function () { iaResponde('Recibí el CHIP y el mapa con 17 efectos. Ya puedes enviar las grabaciones.', 1100, function () {
        marca(2);
        depois(700, function () { digita('Corre el CHIP ABOGADO.', function () {
          add('m-eu', arq('MOV', 'gancho.mov · cuerpo.mov', '2 videos · 0:52') + '<div style="margin-top:6px">Corre el CHIP ABOGADO.</div>');
          iaResponde('Junté los dos videos, quité 20 pausas y puse subtítulos, 7 efectos y música. <b>0:52 pasó a 0:41.</b>' +
            '<video class="m-img" src="../chip-adv/assets/clipes/e16.mp4" poster="../chip-adv/assets/clipes/e16.jpg" muted autoplay loop playsinline></video>', 1800, function () {
            marca(3); depois(900, function () { ped.hidden = false; });
          });
        }); });
      }); });
    }
    $('[data-cv-denovo]').addEventListener('click', roda);
    quandoVisivel(box, roda, .4);
  })();

  /* ---------- 7. Carrossel de efeitos ---------- */
  (function () {
    var fila = $('[data-es-fila]'); if (!fila) return;
    var E = [
      ['e05', 'Gancho', 'Zoom de impacto', 'Abre con un gancho fuerte'],
      ['e17', 'Frase de impacto', 'Palabra de vidrio', 'Pon la frase fuerte en vidrio detrás de mí'],
      ['antes', 'Antes y después', 'Grabación cruda, luego el giro', 'Muestra el antes y el después'],
      ['e11', 'Detrás de cámaras', 'El video se vuelve un editor', 'Muestra la edición sucediendo'],
      ['e07', 'Lista', 'Checklist al ritmo de la voz', 'Haz un checklist de lo que diga'],
      ['legenda', 'Subtítulo vivo', 'La palabra se enciende al decirla', 'Subtítulo palabra por palabra'],
      ['ordens', 'Comandos', 'Pedidos escritos en pantalla', 'Muestra los comandos en pantalla'],
      ['e16', 'Revista', 'Portada con el nombre detrás de ti', 'Hazlo parecer portada de revista'],
      ['e12', 'Recorte', 'Tú en una página con botón', 'Recórtame y pon un botón de CTA']
    ];
    fila.innerHTML = E.map(function (e, i) { return '<div class="es-card" data-i="' + i + '"><div class="fone fone-p"><video class="fone-v" data-src="../chip-adv/assets/clipes/' + e[0] + '.mp4" poster="../chip-adv/assets/clipes/' + e[0] + '.jpg" muted playsinline loop preload="none" aria-label="' + e[2] + '"></video></div></div>'; }).join('');
    var cards = $$('.es-card', fila), leg = $('[data-es-leg]'), cont = $('[data-es-cont]'), at = -1, visivel = false;
    function ativa(i) {
      if (i === at) return; at = i;
      cards.forEach(function (c, k) { var v = $('video', c); c.classList.toggle('on', k === i); if (k === i && visivel && !reduz) toca(v); else v.pause(); if (Math.abs(k - i) <= 1) carrega(v); });
      var e = E[i]; leg.innerHTML = '<p class="es-cat">' + e[1] + '</p><h3 class="es-tit">' + e[2] + '</h3><p class="es-ped">Pedido: <q>' + e[3] + '</q></p>';
      cont.textContent = (i + 1) + ' de ' + E.length;
    }
    function centro() {
      var m = fila.scrollLeft + fila.clientWidth / 2, best = 0, d = 1e9;
      cards.forEach(function (c, k) { var x = c.offsetLeft + c.offsetWidth / 2, dd = Math.abs(x - m); if (dd < d) { d = dd; best = k; } });
      ativa(best);
    }
    var raf; fila.addEventListener('scroll', function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(centro); }, { passive: true });
    var vai = function (i) { i = (i + E.length) % E.length; var c = cards[i]; fila.scrollTo({ left: c.offsetLeft - (fila.clientWidth - c.offsetWidth) / 2, behavior: reduz ? 'auto' : 'smooth' }); };
    $('[data-es-ant]').addEventListener('click', function () { vai(at - 1); });
    $('[data-es-prox]').addEventListener('click', function () { vai(at + 1); });
    fila.addEventListener('click', function (e) { var c = e.target.closest('.es-card'); if (c) vai(+c.dataset.i); });
    fila.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { e.preventDefault(); vai(at + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); vai(at - 1); } });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visivel = es[0].isIntersecting; var v = at >= 0 && $('video', cards[at]); if (v) { if (visivel && !reduz) toca(v); else v.pause(); } }, { threshold: .3 }).observe(fila);
    ativa(0);
  })();

  /* ---------- 8. Régua do antes e depois ---------- */
  (function () {
    var area = $('[data-pv-area]'); if (!area) return;
    var fill = $('[data-pv-fill]'), pega = $('[data-pv-pega]'), n = $('[data-pv-n]'), rot = $('[data-pv-rot]'), menos = $('[data-pv-menos]');
    var MIN = 41.07, MAX = 52.42, val = MIN;
    function set(v) {
      val = Math.min(MAX, Math.max(MIN, v)); var pct = val / MAX * 100;
      fill.style.width = pct + '%'; pega.style.left = pct + '%'; n.textContent = mmss(val);
      rot.textContent = val > MIN + .3 ? 'antes del corte' : 'de video listo'; menos.textContent = Math.round(MAX - val);
      pega.setAttribute('aria-valuenow', Math.round(val));
    }
    var arrasta = false;
    var mov = function (e) { if (!arrasta) return; var r = area.getBoundingClientRect(); set((e.clientX - r.left) / r.width * MAX); };
    pega.addEventListener('pointerdown', function (e) { arrasta = true; pega.setPointerCapture(e.pointerId); });
    pega.addEventListener('pointermove', mov);
    pega.addEventListener('pointerup', function () { arrasta = false; });
    pega.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') set(val + 1); if (e.key === 'ArrowLeft') set(val - 1); });
    set(MIN);
  })();

  /* ---------- 9. Funções em stories ---------- */
  (function () {
    var box = $('[data-fn]'); if (!box) return;
    var F = [
      ['antes', 'Corte de pausas y errores', 'La pausa larga y la muletilla se van. Queda el mensaje limpio.'],
      ['legenda', 'Subtítulo palabra por palabra', 'La palabra se enciende al decirla, con destaque en las palabras clave.'],
      ['e05', 'Gancho fuerte', 'El primer segundo ya tiene movimiento y texto en pantalla.'],
      ['e17', 'Palabra de impacto', 'La frase fuerte entra grande, detrás de ti.'],
      ['e16', 'Recorte sin pantalla verde', 'Quita el fondo y cambia el escenario.'],
      ['e07', 'Checklist al ritmo de la voz', 'El ítem se marca cuando lo dices.'],
      ['e11', 'Motion explicativo', 'El video se vuelve un editor y muestra el proceso.'],
      ['e12', 'Llamado final con botón', 'Tú en una página con el botón de tu CTA. Música y sonidos sincronizados.']
    ];
    var v = $('[data-fn-v]'), lista = $('[data-fn-lista]'), bars = $('[data-fn-bars]'), at = 0, vis = false;
    lista.innerHTML = F.map(function (f, i) { return '<li><button type="button" data-i="' + i + '"><span class="n num">' + String(i + 1).padStart(2, '0') + '</span><span><b>' + f[1] + '</b><span class="l">' + f[2] + '</span></span></button></li>'; }).join('');
    bars.innerHTML = F.map(function () { return '<i><b></b></i>'; }).join('');
    var bs = $$('i', bars), btns = $$('button', lista);
    function vai(i) {
      at = (i + F.length) % F.length;
      v.src = '../chip-adv/assets/clipes/' + F[at][0] + '.mp4'; v.poster = '../chip-adv/assets/clipes/' + F[at][0] + '.jpg';
      if (vis && !reduz) toca(v);
      bs.forEach(function (b, k) { b.classList.toggle('feito', k < at); $('b', b).style.width = k < at ? '100%' : '0'; });
      btns.forEach(function (b, k) { b.classList.toggle('on', k === at); b.setAttribute('aria-pressed', k === at); });
    }
    v.addEventListener('timeupdate', function () { if (v.duration) $('b', bs[at]).style.width = (v.currentTime / v.duration * 100) + '%'; });
    v.addEventListener('ended', function () { vai(at + 1); });
    $('[data-fn-ant]').addEventListener('click', function () { vai(at - 1); });
    $('[data-fn-prox]').addEventListener('click', function () { vai(at + 1); });
    lista.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) vai(+b.dataset.i); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; if (vis && !reduz) toca(v); else v.pause(); }, { threshold: .35 }).observe(box);
    vai(0);
  })();

  /* ---------- 10. Pra quem: acender uma frase ---------- */
  (function () {
    var ul = $('[data-pb]'); if (!ul) return;
    ul.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return; var on = b.getAttribute('aria-pressed') !== 'true';
      $$('button', ul).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      b.setAttribute('aria-pressed', String(on)); ul.classList.toggle('foco', on);
    });
  })();

  /* ---------- 11. Autor: pilha de quadros ---------- */
  (function () {
    var box = $('[data-au]'); if (!box) return;
    var cs = $$('.au-c', box), leg = $('[data-au-leg]'), pts = $('[data-au-pts]'), at = 0;
    var nomes = [null, 'Zoom de impacto', 'Palabra de vidrio', 'Portada de revista'];
    pts.innerHTML = cs.map(function () { return '<i></i>'; }).join(''); var ps = $$('i', pts);
    function vai(i) {
      at = (i + cs.length) % cs.length;
      cs.forEach(function (c, k) { c.classList.toggle('on', k === at); c.classList.toggle('prox', k === (at + 1) % cs.length); var v = $('video', c); if (v) { if (k === at && !reduz) toca(v); else v.pause(); } });
      ps.forEach(function (p, k) { p.classList.toggle('on', k === at); });
      leg.innerHTML = at === 0 ? '<b>' + C.instrutor + '</b><span>' + C.instrutorRole + '</span>' : '<b>' + nomes[at] + '</b><span>Grabación mía, editada por el CHIP</span>';
    }
    $('[data-au-ant]').addEventListener('click', function () { vai(at - 1); });
    $('[data-au-prox]').addEventListener('click', function () { vai(at + 1); });
    vai(0);
  })();

  /* ---------- 12. Depoimentos (só com prints reais) ---------- */
  (function () {
    var d = C.depoimentos || [], sec = $('[data-dp]'); if (!sec || !d.length) return;
    $('[data-dp-grade]').innerHTML = d.map(function (x) { return '<figure><img src="' + x.img + '" alt="' + (x.alt || '') + '" loading="lazy" decoding="async"><figcaption><b>' + x.autor + '</b> · ' + x.onde + '</figcaption></figure>'; }).join('');
    sec.hidden = false;
  })();

  /* ---------- 13. Título final: bruto × pronto ---------- */
  $$('input[name="fm"]').forEach(function (r) { r.addEventListener('change', function () { $('[data-fm]').dataset.estado = r.value; }); });

  /* ---------- 14. Barra de compra fixa ---------- */
  (function () {
    var b = $('[data-bfix]'), of = $('#oferta'); if (!b) return; var ofVis = false;
    if (of && 'IntersectionObserver' in window) new IntersectionObserver(function (es) { ofVis = es[0].isIntersecting; upd(); }).observe(of);
    /* ViewContent: 1× por visita, quando a oferta aparece na tela */
    var vc = false;
    if (of && 'IntersectionObserver' in window) new IntersectionObserver(function (es) {
      if (vc || !es[0].isIntersecting) return; vc = true;
      if (window.fbq) fbq('track', 'ViewContent', { value: C.preco, currency: 'USD', content_name: 'CHIP ABOGADO' });
      if (window.gtag) gtag('event', 'view_item', { value: C.preco, currency: 'USD' });
      if (window.ttq) ttq.track('ViewContent');
    }, { threshold: .3 }).observe(of);
    function upd() { var on = scrollY > (C.barraDepoisDe || 600) && !ofVis; b.classList.toggle('on', on); b.setAttribute('aria-hidden', String(!on)); $('a', b).tabIndex = on ? 0 : -1; }
    addEventListener('scroll', upd, { passive: true }); upd();
  })();

  /* ---------- 15. Pixels (só no domínio, só se configurados) ---------- */
  (function () {
    var X = C.pixels || {}; if (local) return;
    var js = function (src) { var s = document.createElement('script'); s.async = true; s.src = src; document.head.appendChild(s); };
    if (X.meta) { !function (f, n) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; }(window);
      js('https://connect.facebook.net/en_US/fbevents.js'); fbq('init', String(X.meta)); fbq('track', 'PageView'); }
    if (X.ga4) { js('https://www.googletagmanager.com/gtag/js?id=' + X.ga4); window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); }; gtag('js', new Date()); gtag('config', X.ga4); }
    if (X.clarity) { (function (c, l, a, r, i) { c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); }; var t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i; l.head.appendChild(t); })(window, document, 'clarity', 'script', X.clarity); }
    if (X.tiktok) { !function (w, d, t) { w.TiktokAnalyticsObject = t; var tq = w[t] = w[t] || []; tq.methods = ['page', 'track', 'identify']; tq.setAndDefer = function (o, e) { o[e] = function () { o.push([e].concat([].slice.call(arguments, 0))); }; };
      for (var i = 0; i < tq.methods.length; i++) tq.setAndDefer(tq, tq.methods[i]); tq.load = function (e) { js('https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=' + e + '&lib=' + t); }; tq.load(X.tiktok); tq.page(); }(window, document, 'ttq'); }
  })();
})();
