"""Gera ESTILOS.md e o catálogo visual (HTML -> PDF) do Kit Identidade a partir de uma única fonte de dados.
Uso: python estilos.py <pasta_bump2> <pasta_fontsource>
"""
import json, sys

ESTILOS = [
    dict(id="sobrio-classico", nome="Sóbrio Clássico", para="Qualquer área; escritórios tradicionais",
         cores=dict(principal="#0F1E33", destaque="#B8955A", clara="#F4EFE6", texto="#FFFFFF"),
         titulo=("Cormorant Garamond", 700, "cormorant-garamond"), texto=("Inter", 800, "inter"),
         legenda="Branca, caixa normal; palavra-chave em dourado, sem fundo",
         ritmo="Calmo: cortes a cada 3–4 s, punch-in leve (1,04)",
         efeitos=["16", "07", "17", "11"], evitar=["13", "14", "04", "02"],
         trilha="Piano e cordas, andamento lento", frase="Seus direitos, com clareza."),
    dict(id="editorial", nome="Editorial", para="Opinião, análise de decisões, notícias jurídicas",
         cores=dict(principal="#141414", destaque="#C8102E", clara="#F6F3EE", texto="#FFFFFF"),
         titulo=("Playfair Display", 900, "playfair-display"), texto=("Inter", 800, "inter"),
         legenda="Branca; palavra-chave com fundo vermelho",
         ritmo="Médio: cortes a cada 2–3 s",
         efeitos=["16", "08", "17", "09"], evitar=["13", "14"],
         trilha="Batida discreta, estilo telejornal", frase="O que mudou, explicado."),
    dict(id="moderno", nome="Moderno", para="Empresarial, tributário, tecnologia",
         cores=dict(principal="#1C1C22", destaque="#3B82F6", clara="#EEF2F8", texto="#FFFFFF"),
         titulo=("Montserrat", 900, "montserrat"), texto=("Montserrat", 800, "montserrat"),
         legenda="Caixa alta; palavra-chave com fundo azul",
         ritmo="Ágil: cortes a cada 2 s, punch-in 1,08",
         efeitos=["05", "09", "11", "10"], evitar=["13", "14"],
         trilha="Eletrônica leve, 100–110 BPM", frase="Direito para quem empreende."),
    dict(id="minimal", nome="Minimal", para="Quem quer só legenda e cortes limpos",
         cores=dict(principal="#111111", destaque="#111111", clara="#FAFAF7", texto="#FFFFFF"),
         titulo=("Manrope", 800, "manrope"), texto=("Manrope", 800, "manrope"),
         legenda="Caixa normal; palavra-chave sublinhada",
         ritmo="Corte seco, sem zooms",
         efeitos=["07"], evitar=["04", "13", "14", "15", "02", "01"],
         trilha="Sem trilha ou ambiente muito baixo", frase="Direto ao ponto."),
    dict(id="premium-escuro", nome="Premium Escuro", para="Anúncios e conteúdo de alto impacto",
         cores=dict(principal="#0B0B0F", destaque="#D8FF3C", clara="#F5F3EE", texto="#FFFFFF"),
         titulo=("Anton", 400, "anton"), texto=("Inter", 900, "inter"),
         legenda="Caixa alta; palavra falada acende em limão; palavra-chave com fundo",
         ritmo="Intenso: cortes a cada 1,5–2 s, zooms secos",
         efeitos=["05", "17", "09", "11", "16", "12"], evitar=["13"],
         trilha="Batida marcada, 100–120 BPM", frase="Você grava. A IA edita."),
    dict(id="institucional", nome="Institucional", para="Sociedades de advogados, conteúdo de autoridade",
         cores=dict(principal="#0E3B2E", destaque="#B87333", clara="#F3EFE6", texto="#FFFFFF"),
         titulo=("DM Serif Display", 400, "dm-serif-display"), texto=("Inter", 800, "inter"),
         legenda="Branca; palavra-chave em cobre",
         ritmo="Calmo: cortes a cada 3 s",
         efeitos=["07", "10", "16", "11"], evitar=["13", "14", "04"],
         trilha="Orquestral suave", frase="Tradição e orientação jurídica."),
    dict(id="acolhedor", nome="Acolhedor", para="Família, previdenciário, sucessões",
         cores=dict(principal="#3D2C25", destaque="#C9877A", clara="#EFE6DA", texto="#FFFFFF"),
         titulo=("Fraunces", 800, "fraunces"), texto=("Manrope", 800, "manrope"),
         legenda="Caixa normal; palavra-chave em rosa antigo",
         ritmo="Calmo: cortes a cada 3–4 s, sem tremidas",
         efeitos=["07", "14", "13", "17"], evitar=["05", "04", "15", "09"],
         trilha="Violão acústico ou piano suave", frase="Do seu lado, com cuidado."),
    dict(id="dinamico", nome="Dinâmico", para="Consumidor, trabalhista, público jovem",
         cores=dict(principal="#2E1065", destaque="#FACC15", clara="#F5F3FF", texto="#FFFFFF"),
         titulo=("Bebas Neue", 400, "bebas-neue"), texto=("Montserrat", 900, "montserrat"),
         legenda="Caixa alta; palavra-chave com fundo amarelo, pulando",
         ritmo="Rápido: cortes a cada 1,5 s, zooms e tremidas",
         efeitos=["05", "04", "02", "13", "09"], evitar=["16"],
         trilha="Pop/funk instrumental, 110–125 BPM", frase="Seu direito em 30 segundos."),
]

EFEITOS = {"01": "Troca de cenário", "02": "Comparação lado a lado", "03": "Janela da IA", "04": "Carimbo de impacto", "05": "Zoom de impacto",
           "06": "Celular com o resultado", "07": "Checklist", "08": "Mágica", "09": "Corte no zoom", "10": "Relógio de horas",
           "11": "Bastidor do editor", "12": "Recorte + botão", "13": "Tela dividida animada", "14": "Rabisco vivo", "15": "Antes e depois",
           "16": "Capa de revista", "17": "Palavra de vidro"}

def fx(lst): return ", ".join(f"{n} {EFEITOS[n]}" for n in lst)

def gerar_md(dst):
    out = ["# ESTILOS.md · 8 estilos prontos para o CHIP ADV", "",
           "Anexe este arquivo junto com o `MARCA.md`. O campo `estilo` do `MARCA.md` escolhe um dos blocos abaixo; "
           "os ajustes finos do `MARCA.md` têm prioridade sobre o estilo.", "",
           "Como o CHIP ADV usa cada campo: `cores` vira a paleta (`brand.ts`), `titulo`/`texto` viram as fontes, "
           "`legenda` define o visual da legenda, `ritmo` define cortes e zooms, `efeitos` têm prioridade no storyboard "
           "e `evitar` nunca entra.", ""]
    for e in ESTILOS:
        out += [f"## {e['nome']}", f"*Indicado para: {e['para']}*", "", "```yaml",
                f"id: {e['id']}",
                f"cores: {{principal: \"{e['cores']['principal']}\", destaque: \"{e['cores']['destaque']}\", clara: \"{e['cores']['clara']}\", texto: \"{e['cores']['texto']}\"}}",
                f"fonte_titulo: \"{e['titulo'][0]}\"  # peso {e['titulo'][1]}",
                f"fonte_texto: \"{e['texto'][0]}\"  # peso {e['texto'][1]}",
                f"legenda: \"{e['legenda']}\"",
                f"ritmo: \"{e['ritmo']}\"",
                f"efeitos: [{', '.join(e['efeitos'])}]  # {fx(e['efeitos'])}",
                f"evitar: [{', '.join(e['evitar'])}]  # {fx(e['evitar'])}",
                f"trilha: \"{e['trilha']}\"",
                f"frase_final_sugerida: \"{e['frase']}\"",
                "```", ""]
    open(dst, "w").write("\n".join(out))

def gerar_html(dst, fontes, base_img):
    faces = set()
    for e in ESTILOS:
        for fam, w, pkg in (e["titulo"], e["texto"]):
            faces.add((fam, w, pkg))
    css_faces = "\n".join(
        f"@font-face{{font-family:'{fam}';font-weight:{w};src:url(file://{fontes}/{pkg}/files/{pkg}-latin-{w}-normal.woff2)}}"
        for fam, w, pkg in sorted(faces))
    css_faces += f"\n@font-face{{font-family:'Inter';font-weight:600;src:url(file://{fontes}/inter/files/inter-latin-600-normal.woff2)}}"
    css_faces += f"\n@font-face{{font-family:'Anton';font-weight:400;src:url(file://{fontes}/anton/files/anton-latin-400-normal.woff2)}}"
    cards = []
    for i, e in enumerate(ESTILOS):
        c = e["cores"]; tf, tw, _ = e["titulo"]; xf, xw, _ = e["texto"]
        upper = "uppercase" if "alta" in e["legenda"].lower() else "none"
        if "sublinhada" in e["legenda"]:
            key = f"text-decoration:underline;text-decoration-thickness:6px;text-underline-offset:6px;text-decoration-color:{c['destaque'] if c['destaque']!='#111111' else '#fff'}"
        elif "fundo" in e["legenda"] and "sem fundo" not in e["legenda"]:
            key = f"background:{c['destaque']};color:{c['principal'] if e['id']!='editorial' else '#fff'};padding:0 10px;border-radius:8px"
        else:
            key = f"color:{c['destaque']}"
        cards.append(f"""
<section class="estilo">
  <div class="frame">
    <img src="file://{base_img}">
    <div class="tint" style="background:linear-gradient(180deg, transparent 55%, {c['principal']}cc)"></div>
    <div class="titlecard" style="font-family:'{tf}';font-weight:{tw};color:{c['clara']};background:{c['principal']}e6">
      <span style="color:{c['destaque'] if c['destaque']!='#111111' else c['clara']}">Pensão</span> não é 30%</div>
    <div class="cap" style="font-family:'{xf}';font-weight:{xw};text-transform:{upper}">não existe <span style="{key}">percentual</span> fixo</div>
    <div class="lower" style="font-family:'{xf}';border-left:4px solid {c['destaque'] if c['destaque']!='#111111' else '#fff'}">
      <b>Seu Nome</b><br>OAB/UF 000.000</div>
  </div>
  <div class="info">
    <div class="num">{i+1:02d}</div>
    <h2 style="font-family:'{tf}';font-weight:{tw}">{e['nome']}</h2>
    <p class="para">{e['para']}</p>
    <div class="sw">{''.join(f'<div><i style="background:{v}"></i><small>{k}<br>{v}</small></div>' for k, v in c.items())}</div>
    <dl>
      <dt>Fontes</dt><dd>{tf} + {xf}</dd>
      <dt>Legenda</dt><dd>{e['legenda']}</dd>
      <dt>Ritmo</dt><dd>{e['ritmo']}</dd>
      <dt>Efeitos</dt><dd>{fx(e['efeitos'])}</dd>
      <dt>Evitar</dt><dd>{fx(e['evitar'])}</dd>
      <dt>Trilha</dt><dd>{e['trilha']}</dd>
    </dl>
    <code>estilo: "{e['id']}"</code>
  </div>
</section>""")
    html = f"""<html><head><meta charset="utf-8"><style>
{css_faces}
@page{{size:A4;margin:0}}
*{{box-sizing:border-box}} body{{margin:0;font-family:Inter,sans-serif;color:#16161b}}
.capa{{height:297mm;background:#0B0B0F;color:#F5F3EE;padding:28mm 20mm;display:flex;flex-direction:column;justify-content:space-between;page-break-after:always}}
.capa h1{{font-family:Anton;font-weight:400;font-size:64pt;line-height:1.08;margin:0 0 8mm;text-transform:uppercase}}
.capa h1 span{{background:#D8FF3C;color:#0B0B0F;padding:0 8px}}
.capa p{{font-size:13pt;color:#A2A2AD;max-width:120mm}}
.estilo{{height:148.5mm;padding:12mm 14mm;display:grid;grid-template-columns:62mm 1fr;gap:10mm;border-bottom:1px solid #e5e5e5;page-break-inside:avoid}}
.frame{{position:relative;width:62mm;height:110mm;border-radius:5mm;overflow:hidden;box-shadow:0 4mm 10mm rgba(0,0,0,.18)}}
.frame img{{width:100%;height:100%;object-fit:cover}}
.tint{{position:absolute;inset:0}}
.titlecard{{position:absolute;top:9mm;left:4mm;right:4mm;padding:2.5mm 3mm;font-size:17pt;line-height:1.05;border-radius:2mm;text-align:center}}
.cap{{position:absolute;left:3mm;right:3mm;top:78mm;text-align:center;color:#fff;font-size:12.5pt;line-height:1.25;text-shadow:0 1mm 3mm rgba(0,0,0,.6)}}
.lower{{position:absolute;left:4mm;bottom:5mm;color:#fff;font-size:7pt;line-height:1.3;padding-left:2mm;font-weight:600}}
.info .num{{font-family:Anton;font-size:14pt;color:#999}}
.info h2{{font-size:26pt;margin:0 0 1mm;line-height:1}}
.para{{margin:0 0 4mm;color:#666;font-size:9.5pt}}
.sw{{display:flex;gap:3mm;margin-bottom:4mm}} .sw div{{text-align:center}} .sw i{{display:block;width:16mm;height:10mm;border-radius:2mm;border:1px solid #ddd}} .sw small{{font-size:7pt;color:#555}}
dl{{display:grid;grid-template-columns:18mm 1fr;gap:1.6mm 3mm;font-size:8.6pt;margin:0 0 4mm}} dt{{font-weight:800}} dd{{margin:0;color:#333}}
code{{background:#0B0B0F;color:#D8FF3C;padding:1.5mm 3mm;border-radius:2mm;font-size:8.5pt;font-weight:600}}
</style></head><body>
<div class="capa"><div style="font-weight:800;letter-spacing:.2em;font-size:10pt;color:#D8FF3C">CHIP ADV · KIT IDENTIDADE</div>
<div><h1>Catálogo de <span>estilos</span></h1><p>Escolha um estilo, escreva o nome dele no seu MARCA.md e todo vídeo sai com a mesma identidade. As prévias usam a mesma gravação para você comparar só o visual.</p></div>
<p style="font-size:9pt">Nome e OAB aparecem em todos os estilos (Código de Ética e Disciplina da OAB, art. 44).</p></div>
{''.join(cards)}
</body></html>"""
    open(dst, "w").write(html)

if __name__ == "__main__":
    pasta, fontes = sys.argv[1], sys.argv[2]
    gerar_md(f"{pasta}/ESTILOS.md")
    gerar_html(sys.argv[3] if len(sys.argv) > 3 else f"{pasta}/catalogo.html", fontes, f"{pasta}/assets/base.jpg")
    json.dump(ESTILOS, open(f"{pasta}/estilos.json", "w"), ensure_ascii=False, indent=1)
    print("ok")
