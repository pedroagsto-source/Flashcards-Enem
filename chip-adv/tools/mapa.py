"""Mapa de efeitos do CHIP ADV (fonte única) → MAPA_EFEITOS.md + HTML para PDF, em pt e es.
Uso: python mapa.py <pasta_mapa> <pasta_fontsource> <saida_html_pt> <saida_html_es>
"""
import json, sys

# id, nome pt, nome es, função pt, função es, pedido pt, pedido es, o que acontece pt, o que acontece es, duração
EF = [
 ("01", "Troca de cenário", "Cambio de escenario",
  "Elevar a imagem", "Elevar la imagen",
  "Me recorta e põe um escritório desfocado atrás", "Recórtame y pon una oficina desenfocada detrás",
  "Você é recortado do fundo em todos os quadros e vai para um escritório desfocado, com a luz combinando.",
  "Te recorta del fondo en todos los cuadros y te pone en una oficina desenfocada, con la luz combinando.", "vídeo inteiro"),
 ("02", "Comparação lado a lado", "Comparación lado a lado",
  "Contraste / dor", "Contraste / dolor",
  "Mostra o meu vídeo e o vídeo que eu quero, lado a lado", "Muestra mi video y el video que quiero, lado a lado",
  "Dois cartões entram de lados opostos com um ≠ no meio: o vídeo comum em cinza e o vídeo editado em cor.",
  "Dos tarjetas entran desde lados opuestos con un ≠ en medio: el video común en gris y el editado en color.", "2–3 s"),
 ("03", "Janela da IA", "Ventana de la IA",
  "Mostrar o processo", "Mostrar el proceso",
  "Mostra a conversa com a IA acima da minha cabeça", "Muestra la conversación con la IA sobre mi cabeza",
  "Uma janela de conversa aparece no alto da tela: o arquivo é anexado e o pedido é digitado no tempo da fala.",
  "Una ventana de chat aparece arriba: el archivo se adjunta y el pedido se escribe al ritmo de la voz.", "2–4 s"),
 ("04", "Carimbo de impacto", "Sello de impacto",
  "Rotular um problema", "Etiquetar un problema",
  "Bate um carimbo vermelho escrito AMADOR quando eu falar", "Pon un sello rojo que diga AMATEUR cuando lo diga",
  "Um carimbo gigante bate na tela com flash, tremida e som grave, na palavra exata.",
  "Un sello gigante golpea la pantalla con flash, sacudida y sonido grave, en la palabra exacta.", "1–2 s"),
 ("05", "Zoom de impacto", "Zoom de impacto",
  "Gancho", "Gancho",
  "Abre com um gancho forte: zoom seco e a palavra gigante", "Abre con un gancho fuerte: zoom seco y la palabra gigante",
  "Preto e branco, zoom seco no rosto, flash e a palavra principal gigante no primeiro segundo.",
  "Blanco y negro, zoom seco en la cara, flash y la palabra principal gigante en el primer segundo.", "1–3 s"),
 ("06", "Celular com o resultado", "Celular con el resultado",
  "Prova", "Prueba",
  "Mostra o vídeo pronto num celular do lado", "Muestra el video listo en un celular al lado",
  "Um celular entra pela lateral com o vídeo editado tocando e o selo PRONTO ✓.",
  "Un celular entra por el costado con el video editado y el sello LISTO ✓.", "2–3 s"),
 ("07", "Checklist no tempo da fala", "Checklist al ritmo de la voz",
  "Lista / método", "Lista / método",
  "Faz um checklist do que eu falar", "Haz un checklist de lo que diga",
  "Um cartão de vidro com os itens; cada um é marcado e riscado quando você fala, e a barra enche.",
  "Una tarjeta de vidrio con los ítems; cada uno se marca y se tacha cuando lo dices, y la barra se llena.", "3–8 s"),
 ("08", "Mágica", "Magia",
  "Clímax", "Clímax",
  "Faz uma explosão de brilhos e mostra os efeitos rápidos", "Haz una explosión de brillos y muestra los efectos rápido",
  "Brilhos explodindo do centro, montagem rápida de trechos editados e a palavra gigante.",
  "Brillos que explotan desde el centro, montaje rápido de partes editadas y la palabra gigante.", "1–2 s"),
 ("09", "Corte no zoom", "Corte con zoom",
  "Virada / transição", "Giro / transición",
  "Faz uma transição de zoom com raios na virada", "Haz una transición de zoom con rayos en el giro",
  "O vídeo acelera num zoom com desfoque, raios de luz e flash, e sai do outro lado já com cor viva.",
  "El video acelera en un zoom con desenfoque, rayos de luz y flash, y sale del otro lado con color vivo.", "0,5–1 s"),
 ("10", "Relógio de horas", "Reloj de horas",
  "Tempo / prazo", "Tiempo / plazo",
  "Põe um relógio girando com as horas passando", "Pon un reloj girando con las horas pasando",
  "Relógio com ponteiros girando rápido e um contador de horas subindo, com tique-taque.",
  "Reloj con agujas girando rápido y un contador de horas subiendo, con tictac.", "2 s"),
 ("11", "Bastidor do editor", "Detrás de cámaras del editor",
  "Mostrar o processo", "Mostrar el proceso",
  "Mostra a edição acontecendo, com o vídeo dentro do editor", "Muestra la edición sucediendo, con el video dentro del editor",
  "A câmera recua e o vídeo vira a pré-visualização de um editor, com as tarefas sendo marcadas.",
  "La cámara retrocede y el video se vuelve la vista previa de un editor, con las tareas marcándose.", "3 s"),
 ("12", "Recorte + botão", "Recorte + botón",
  "Chamada final (CTA)", "Llamado final (CTA)",
  "Me recorta e põe numa página com o botão Saiba Mais", "Recórtame y ponme en una página con el botón Saber más",
  "Você recortado no canto de uma página colorida, com título que muda com a fala e o cursor clicando no botão.",
  "Tú recortado en la esquina de una página de color, con un título que cambia con la voz y el cursor haciendo clic.", "3–5 s"),
 ("13", "Tela dividida animada", "Pantalla dividida animada",
  "Antes × depois em desenho", "Antes × después en dibujo",
  "Faz uma tela dividida animada: sem e com o CHIP ADV", "Haz una pantalla dividida animada: sin y con el CHIP",
  "Desenho 2D: em cima, o advogado sofrendo com a edição; embaixo, o mesmo advogado tranquilo.",
  "Dibujo 2D: arriba, el abogado sufriendo con la edición; abajo, el mismo abogado tranquilo.", "vídeo inteiro"),
 ("14", "Rabisco vivo", "Garabato vivo",
  "Apontar erro / detalhe", "Señalar error / detalle",
  "Escreve à mão 'erro' e 'pausa' com um círculo vermelho", "Escribe a mano 'error' y 'pausa' con un círculo rojo",
  "Palavras escritas à mão em vermelho, com círculo se desenhando e tremendo, ao lado do rosto.",
  "Palabras escritas a mano en rojo, con un círculo que se dibuja y tiembla, junto a la cara.", "1–3 s"),
 ("15", "Antes e depois", "Antes y después",
  "Prova", "Prueba",
  "Mostra a gravação crua de celular e depois a versão editada", "Muestra la grabación cruda del celular y luego la editada",
  "Interface de câmera de celular com a etiqueta ANTES e cor lavada; depois vira a versão editada.",
  "Interfaz de cámara de celular con la etiqueta ANTES y color lavado; luego pasa a la versión editada.", "3–5 s"),
 ("16", "Capa de revista", "Portada de revista",
  "Autoridade", "Autoridad",
  "Deixa com cara de capa de revista", "Hazlo parecer portada de revista",
  "Fundo de estúdio, nome gigante atrás da cabeça, chamadas laterais e brilho de papel.",
  "Fondo de estudio, nombre gigante detrás de la cabeza, titulares laterales y brillo de papel.", "2–3 s"),
 ("17", "Palavra de vidro", "Palabra de vidrio",
  "Frase de impacto", "Frase de impacto",
  "Põe a frase forte em vidro atrás de mim", "Pon la frase fuerte en vidrio detrás de mí",
  "A frase sobe em letras de vidro atrás de você, com reflexo e brilho passando.",
  "La frase sube en letras de vidrio detrás de ti, con reflejo y un brillo que pasa.", "2–3 s"),
]

TXT = {
 "pt": dict(kicker="CHIP ADV · MAPA DE EFEITOS", titulo="17 efeitos.<br>Um pedido cada.", sub="Escolha o efeito, copie o pedido e cole na conversa com a sua IA junto com o CHIP ADV. Todas as imagens são de vídeos editados pelo próprio CHIP ADV.",
   sempre="Sempre ligado em todo vídeo", sempre_tx="Legenda viva (a palavra acende quando é dita), cortes de pausa, cor, trilha e efeitos sonoros.",
   regra="Regra de ouro: 1 efeito forte a cada 6–10 segundos. Efeito demais vira poluição.", funcao="Quando usar", pedido="Pedido", dur="Duração",
   rodape="CHIP ADV · Mapa de efeitos", md_titulo="Mapa de efeitos do CHIP ADV"),
 "es": dict(kicker="CHIP ABOGADO · MAPA DE EFECTOS", titulo="17 efectos.<br>Un pedido cada uno.", sub="Elige el efecto, copia el pedido y pégalo en la conversación con tu IA junto con el CHIP. Todas las imágenes son de videos editados por el propio CHIP.",
   sempre="Siempre activo en todo video", sempre_tx="Subtítulo vivo (la palabra se enciende al decirla), cortes de pausas, color, música y efectos de sonido.",
   regra="Regla de oro: 1 efecto fuerte cada 6–10 segundos. Demasiados efectos ensucian el video.", funcao="Cuándo usar", pedido="Pedido", dur="Duración",
   rodape="CHIP ABOGADO · Mapa de efectos", md_titulo="Mapa de efectos del CHIP ABOGADO"),
}

def campos(e, lang):
    i = 0 if lang == "pt" else 1
    return dict(id=e[0], nome=e[1 + i], funcao=e[3 + i], pedido=e[5 + i], oque=e[7 + i], dur=e[9])

def md(lang):
    t = TXT[lang]
    linhas = [f"# {t['md_titulo']}", "", t["sub"], "", f"**{t['sempre']}:** {t['sempre_tx']}", "", t["regra"], "",
              f"| # | {'Efeito' if lang == 'pt' else 'Efecto'} | {t['funcao']} | {t['pedido']} | {t['dur']} |", "|---|---|---|---|---|"]
    for e in EF:
        c = campos(e, lang)
        linhas.append(f"| {c['id']} | **{c['nome']}** | {c['funcao']} | \"{c['pedido']}\" | {c['dur']} |")
    return "\n".join(linhas) + "\n"

def html(lang, pasta, fontes):
    t = TXT[lang]
    face = lambda fam, f, w, st="normal": f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{fontes}/{f})}}"
    css = (face("Inter", "inter/files/inter-latin-600-normal.woff2", 600) + face("Inter", "inter/files/inter-latin-800-normal.woff2", 800) +
           face("Inter", "inter/files/inter-latin-900-normal.woff2", 900) + face("IS", "instrument-serif/files/instrument-serif-latin-400-italic.woff2", 400, "italic"))
    cards = []
    for e in EF:
        c = campos(e, lang)
        cards.append(f"""<div class="card"><div class="img"><img src="file://{pasta}/previews/{c['id']}.jpg"><span class="n">{c['id']}</span></div>
<div class="tx"><h3>{c['nome']}</h3><p class="f"><b>{t['funcao']}:</b> {c['funcao']} · <b>{t['dur']}:</b> {c['dur']}</p><p class="o">{c['oque']}</p>
<div class="ped"><small>{t['pedido']}</small>"{c['pedido']}"</div></div></div>""")
    paginas = [cards[i:i + 6] for i in range(0, len(cards), 6)]
    corpo = "".join(f'<section class="pg">{"".join(p)}<div class="rod">{t["rodape"]}</div></section>' for p in paginas)
    return f"""<html><head><meta charset="utf-8"><style>{css}
@page{{size:A4;margin:0}} *{{box-sizing:border-box}} body{{margin:0;font-family:Inter,sans-serif;color:#16161b}}
.capa{{height:297mm;background:#0B0B0F;color:#F4F2EC;padding:26mm 20mm;display:flex;flex-direction:column;justify-content:space-between;page-break-after:always}}
.capa .k{{font-weight:800;letter-spacing:.2em;font-size:10pt;color:#D8FF3C}}
.capa h1{{font-weight:900;font-size:52pt;line-height:1.02;letter-spacing:-2px;margin:0 0 6mm}} .capa h1 i{{font-family:IS;font-weight:400;color:#D8FF3C}}
.capa p{{font-size:12.5pt;color:#B4B4BE;max-width:140mm;margin:0 0 4mm}}
.mini{{display:grid;grid-template-columns:repeat(6,1fr);gap:3mm;margin-top:8mm}} .mini img{{width:100%;aspect-ratio:9/16;object-fit:cover;border-radius:3mm}}
.box{{border:1px solid #333;border-radius:4mm;padding:5mm;margin-top:6mm}} .box b{{color:#D8FF3C}}
.pg{{height:297mm;padding:12mm 12mm 16mm;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:repeat(3,1fr);gap:6mm;position:relative;page-break-after:always}}
.card{{display:grid;grid-template-columns:38mm 1fr;gap:5mm;border:1px solid #e3e1da;border-radius:5mm;padding:5mm;background:#FBFAF6}}
.img{{position:relative}} .img img{{width:38mm;height:67.5mm;object-fit:cover;border-radius:3mm;display:block}}
.n{{position:absolute;left:2mm;top:2mm;background:#D8FF3C;color:#0B0B0F;font-weight:900;font-size:11pt;padding:1mm 2.5mm;border-radius:2mm}}
.tx h3{{margin:0 0 2mm;font-weight:900;font-size:15pt;line-height:1.05;letter-spacing:-.3px}}
.f{{margin:0 0 2.5mm;font-size:8.2pt;color:#555}} .o{{margin:0 0 3mm;font-size:9pt;line-height:1.35}}
.ped{{background:#0B0B0F;color:#D8FF3C;border-radius:3mm;padding:2.5mm 3mm;font-weight:800;font-size:9pt;line-height:1.3}}
.ped small{{display:block;color:#9C9CA6;font-size:7pt;letter-spacing:.12em;text-transform:uppercase;margin-bottom:1mm}}
.rod{{position:absolute;left:12mm;bottom:6mm;font-size:8pt;color:#999;font-weight:600}}
</style></head><body>
<section class="capa"><div class="k">{t['kicker']}</div>
<div><h1>{t['titulo'].replace('Um pedido', '<i>Um pedido</i>').replace('Un pedido', '<i>Un pedido</i>')}</h1><p>{t['sub']}</p>
<div class="box"><b>{t['sempre']}:</b> {t['sempre_tx']}</div><div class="box">{t['regra']}</div>
<div class="mini">{''.join(f'<img src="file://{pasta}/previews/{e[0]}.jpg">' for e in EF[:12])}</div></div>
<div style="font-size:9pt;color:#777">© 2026 CHIP ADV</div></section>{corpo}</body></html>"""

if __name__ == "__main__":
    pasta, fontes, out_pt, out_es = sys.argv[1:5]
    open(f"{pasta}/MAPA_EFEITOS.md", "w").write(md("pt"))
    open(f"{pasta}/MAPA_EFECTOS_ES.md", "w").write(md("es"))
    open(out_pt, "w").write(html("pt", pasta, fontes)); open(out_es, "w").write(html("es", pasta, fontes))
    json.dump([{"id": e[0], "pt": e[1], "es": e[2]} for e in EF], open(f"{pasta}/efeitos.json", "w"), ensure_ascii=False, indent=1)
    print("ok")
