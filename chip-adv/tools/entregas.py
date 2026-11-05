"""Monta a pasta entregas/: um diretório por produto (ficha + arquivos + imagens) e um .zip de cada.
Também gera os PDFs do guia e das pautas (PT e ES) e as páginas legais das landings.
uso: python3 tools/entregas.py
"""
import html, os, re, shutil, subprocess, zipfile

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
C = f'{R}/conteudo'
OUT = f'{R}/entregas'
FONT = f'{R}/projeto/node_modules/@fontsource'


# ---------------- markdown mínimo → HTML ----------------
def inline(t):
    t = html.escape(t, quote=False)
    t = re.sub(r'`([^`]+)`', r'<code>\1</code>', t)
    t = re.sub(r'\*\*([^*]+)\*\*', r'<b>\1</b>', t)
    t = re.sub(r'(?<![\w*])\*([^*]+)\*(?![\w*])', r'<i>\1</i>', t)
    return t


IDS = {'Política de Privacidade': 'privacidade', 'Termos de Uso': 'termos', 'Política de Privacidad': 'privacidad', 'Términos de Uso': 'terminos'}


def md2html(md):
    out, lines, i = [], md.split('\n'), 0
    while i < len(lines):
        ln = lines[i]
        if not ln.strip(): i += 1; continue
        m = re.match(r'^(#{1,3}) (.*)', ln)
        if m:
            n, txt = len(m.group(1)), m.group(2); idt = IDS.get(txt)
            out.append(f'<h{n}{f" id={chr(34)}{idt}{chr(34)}" if idt else ""}>{inline(txt)}</h{n}>'); i += 1; continue
        if ln.strip() == '---': out.append('<hr>'); i += 1; continue
        if ln.startswith('>'):
            buf = []
            while i < len(lines) and lines[i].startswith('>'): buf.append(lines[i][1:].strip()); i += 1
            out.append('<blockquote>' + '<br>'.join(inline(x) for x in buf if x) + '</blockquote>'); continue
        if ln.startswith('|'):
            rows = []
            while i < len(lines) and lines[i].startswith('|'): rows.append(lines[i]); i += 1
            cel = lambda r: [c.strip() for c in r.strip().strip('|').split('|')]
            h = cel(rows[0]); body = [cel(r) for r in rows[2:]]
            out.append('<table><thead><tr>' + ''.join(f'<th>{inline(c)}</th>' for c in h) + '</tr></thead><tbody>' +
                       ''.join('<tr>' + ''.join(f'<td>{inline(c)}</td>' for c in r) + '</tr>' for r in body) + '</tbody></table>'); continue
        if re.match(r'^- ', ln):
            items = []
            while i < len(lines) and re.match(r'^- ', lines[i]): items.append(lines[i][2:]); i += 1
            cls = ' class="ck"' if all(x.startswith('[ ] ') for x in items) else ''
            out.append(f'<ul{cls}>' + ''.join(f'<li>{inline(x[4:] if x.startswith("[ ] ") else x)}</li>' for x in items) + '</ul>'); continue
        if re.match(r'^\d+\. ', ln):
            items = []
            while i < len(lines) and re.match(r'^\d+\. ', lines[i]): items.append(re.sub(r'^\d+\. ', '', lines[i])); i += 1
            out.append('<ol>' + ''.join(f'<li>{inline(x)}</li>' for x in items) + '</ol>'); continue
        buf = []
        while i < len(lines) and lines[i].strip() and not re.match(r'^(#|>|\||- |\d+\. |---)', lines[i]): buf.append(lines[i]); i += 1
        out.append('<p>' + inline(' '.join(buf)) + '</p>')
    return '\n'.join(out)


def fontes():
    f = lambda fam, arq, w, st='normal': f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url('file://{FONT}/{arq}')}}"
    return (f('Inter', 'inter/files/inter-latin-400-normal.woff2', 400) + f('Inter', 'inter/files/inter-latin-600-normal.woff2', 600) +
            f('Inter', 'inter/files/inter-latin-800-normal.woff2', 800) + f('Inter', 'inter/files/inter-latin-900-normal.woff2', 900) +
            f('IS', 'instrument-serif/files/instrument-serif-latin-400-italic.woff2', 400, 'italic'))


CSS_PDF = """*{box-sizing:border-box}body{font-family:Inter,sans-serif;color:#1b1b1f;font-size:10.5pt;line-height:1.5;margin:0}
.capa{background:#08080A;color:#F4F2EC;border-radius:14px;padding:26px 28px;margin-bottom:18px}
.capa .m{font-weight:900;font-size:12pt;letter-spacing:.04em}.capa .m b{color:#D8FF3C}
h1{font-weight:900;font-size:24pt;letter-spacing:-.5px;line-height:1.1;margin:10px 0 6px}
.capa p{color:#C9C9D1;margin:0}
h2{font-weight:900;font-size:14pt;margin:20px 0 8px;padding-top:4px;border-top:3px solid #D8FF3C;display:inline-block}
h3{font-weight:800;font-size:11.5pt;margin:14px 0 6px}
p{margin:6px 0}ul,ol{margin:6px 0 6px 18px;padding:0}li{margin:3px 0}
ul.ck{list-style:none;margin-left:0}ul.ck li:before{content:'☐  ';font-weight:800}
code{font-family:Menlo,Consolas,monospace;font-size:9pt;background:#F1F0EA;padding:1px 5px;border-radius:4px}
blockquote{margin:10px 0;padding:10px 14px;background:#F6F8E6;border-left:4px solid #B8D400;border-radius:6px}
table{width:100%;border-collapse:collapse;margin:8px 0 12px;font-size:9.4pt;page-break-inside:auto}tr{page-break-inside:avoid}
th{background:#08080A;color:#fff;text-align:left;font-weight:800;padding:6px 8px}td{border-bottom:1px solid #E4E2DA;padding:6px 8px;vertical-align:top}
tbody tr:nth-child(even) td{background:#FAFAF7}hr{border:0;height:0;margin:12px 0}"""


def pdf(md_path, pdf_path, marca):
    md = open(md_path).read()
    m = re.match(r'# ([^\n]*)\n+(.*?)\n\n', md + '\n\n', re.S)
    titulo, sub = m.group(1), m.group(2)
    corpo = md[m.end():]
    capa = f'<div class="capa"><div class="m">{marca}</div><h1>{inline(titulo)}</h1><p>{inline(sub).replace(chr(10), "<br>")}</p></div>'
    doc = f'<!doctype html><html><head><meta charset="utf-8"><style>{fontes()}{CSS_PDF}</style></head><body>{capa}{md2html(corpo)}</body></html>'
    tmp = pdf_path.replace('.pdf', '.html'); open(tmp, 'w').write(doc)
    subprocess.run(['node', f'{R}/tools/pdf.js', tmp, pdf_path], check=True); os.remove(tmp)


CSS_WEB = """*{box-sizing:border-box}body{margin:0;background:#08080A;color:#E9E7E1;font-family:Inter,system-ui,sans-serif;line-height:1.6}
main{max-width:760px;margin:0 auto;padding:48px 16px 80px}a{color:#D8FF3C}
.top{font-weight:900;letter-spacing:.04em;text-decoration:none;color:#F4F2EC}.top b{color:#D8FF3C}
h1{font-size:30px;line-height:1.15;margin:40px 0 4px}h2{font-size:19px;margin:26px 0 6px}hr{border:0;border-top:1px solid #26262E;margin:40px 0}
p,li{color:#C9C9D1}"""


def legal(md_path, out_path, marca, lang):
    corpo = md2html(open(md_path).read())
    doc = (f'<!doctype html><html lang="{lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
           f'<title>{marca}</title><meta name="robots" content="noindex"><style>{CSS_WEB}</style></head><body><main>'
           f'<a class="top" href="index.html">{marca}</a>{corpo}</main></body></html>')
    open(out_path, 'w').write(doc)


# ---------------- produtos ----------------
BR = f'{OUT}/BRASIL_CAKTO'
LA = f'{OUT}/LATAM_HOTMART'
IMG = f'{R}/checkout/imagens'

ENTREGA_PT = """**E-mail / mensagem de entrega (cole na Cakto):**
> Seu CHIP ADV chegou! 🎬
> 1. Baixe os arquivos na área de membros.
> 2. Abra primeiro o **Guia do primeiro vídeo**: em 40 minutos o seu computador fica pronto.
> 3. Depois é só anexar o CHIP_ADV.md, o mapa e o seu vídeo no Claude e escrever "Roda o CHIP ADV."
> Dúvidas: [E-MAIL DE SUPORTE]. Garantia de 7 dias."""

PRODUTOS = [
    # pasta, título, ficha (markdown), arquivos [(origem, destino)], imagens
    (f'{BR}/01_PRINCIPAL_CHIP_ADV', 'Produto principal · CHIP ADV', f"""| Campo | Valor |
|---|---|
| Nome | **CHIP ADV** |
| Tipo | Produto digital · área de membros |
| Preço | **R$ 97** · até 12x (juros por conta do comprador) |
| Pagamento | Cartão (padrão) e Pix |
| Acesso | **1 ano** (o bump 4 libera o vitalício) |
| Garantia | 7 dias |
| Pixel Meta | `1692009002494391` (evento de compra no checkout) |
| Imagem do produto | `imagens/produto.png` |
| Banner do checkout | `imagens/banner.png` |
| Selo de garantia | `imagens/selo-garantia.png` + "Não funcionou no seu computador ou não gostou? Você recebe tudo de volta." |
| Campos do checkout | e-mail, telefone e nome |

**Descrição curta (checkout):** O prompt mestre que faz a sua IA editar seus vídeos de advogado: corta as pausas, legenda, põe efeitos e trilha. Inclui o mapa com 17 efeitos, o guia do primeiro vídeo e 64 pautas por área do Direito.

**Área de membros (módulos, nesta ordem):**
1. Comece aqui · `GUIA_PRIMEIRO_VIDEO.pdf`
2. O CHIP ADV · `CHIP_ADV.md`
3. Mapa de efeitos · `MAPA_EFEITOS_CHIP_ADV.pdf`
4. Bônus · `BONUS_64_PAUTAS_ADVOGADOS.pdf`

{ENTREGA_PT}""",
     [(f'{R}/CHIP_ADV.md', 'CHIP_ADV.md'), (f'{R}/mapa/MAPA_EFEITOS_CHIP_ADV.pdf', 'MAPA_EFEITOS_CHIP_ADV.pdf'),
      ('@guia_pt', 'GUIA_PRIMEIRO_VIDEO.pdf'), ('@pautas_pt', 'BONUS_64_PAUTAS_ADVOGADOS.pdf')],
     ['produto.png', 'banner.png', 'selo-garantia.png']),

    (f'{BR}/02_BUMP1_ATUALIZACOES', 'Order bump 1 · CHIP ADV Sempre Atualizado', """| Campo | Valor |
|---|---|
| Nome | **CHIP ADV Sempre Atualizado** |
| Preço | **R$ 47** (12x R$ 4,87) |
| Faixa | `Quero o CHIP ADV atualizado toda semana` |
| Caixa | `Sim, quero as atualizações por R$ 47` |
| Selo | `Novidade` |
| Imagem | `imagens/bump-atualizado.png` |

**Descrição:** Toda semana, durante 12 meses, o CHIP ADV ganha uma melhoria: um efeito novo, um pedido pronto ou um ajuste no corte, na legenda e nas animações. Você baixa a versão nova na área de membros e anexa na conversa.

**Entrega:** um módulo "Atualizações" na área de membros, com uma aula nova por semana. O calendário das 12 primeiras está em `PLANO_ATUALIZACOES.md`.

> ⚠️ São 52 entregas. **Só ative se for cumprir o calendário.** Dá para lançar sem este bump e ativar depois.""",
     [(f'{C}/ATUALIZACOES_PLANO.md', 'PLANO_ATUALIZACOES.md')], ['bump-atualizado.png']),

    (f'{BR}/03_BUMP2_ROTEIROS', 'Order bump 2 · Roteiros Prontos para Advogados', """| Campo | Valor |
|---|---|
| Nome | **Roteiros Prontos para Advogados** |
| Preço | **R$ 37** (12x R$ 3,83) |
| Faixa | `40 roteiros prontos pra gravar` |
| Caixa | `Sim, quero os roteiros por R$ 37` |
| Selo | `Pronto pra usar` |
| Imagem | `imagens/bump-roteiros.png` |

**Descrição:** 5 roteiros por área do Direito (Família, Trabalhista, Previdenciário, Consumidor, Imobiliário, Criminal, Tributário e Empresarial), com gancho, texto e o efeito certo do CHIP ADV. Linguagem informativa, dentro do Provimento 205 da OAB.

**Entrega:** `ROTEIROS_PRONTOS_ADVOGADOS.pdf` num módulo próprio da área de membros.""",
     [(f'{R}/bump1-roteiros/ROTEIROS_PRONTOS_ADVOGADOS.pdf', 'ROTEIROS_PRONTOS_ADVOGADOS.pdf')], ['bump-roteiros.png']),

    (f'{BR}/04_BUMP3_SUPORTE', 'Order bump 3 · Suporte Individual no WhatsApp', """| Campo | Valor |
|---|---|
| Nome | **Suporte Individual no WhatsApp** |
| Preço | **R$ 37** |
| Faixa | `Suporte individual no WhatsApp` |
| Caixa | `Sim, quero suporte individual por R$ 37` |
| Selo | `Recomendado` |
| Imagem | `imagens/bump-suporte.png` |

**Descrição:** Quer ajuda com os primeiros vídeos? Durante 30 dias, tire suas dúvidas comigo no WhatsApp: instalação, primeiro vídeo e ajustes.

**Entrega (mensagem automática após a compra):**
> Seu suporte individual está ativo por 30 dias. 💬
> Chame no WhatsApp: [LINK wa.me/55DDDNUMERO]
> Horário: [seg a sex, 9h às 18h]. Mande o print ou o erro que aparecer que eu te ajudo.

> ⚠️ Precisa de um número de WhatsApp dedicado e de alguém para responder.""",
     [], ['bump-suporte.png']),

    (f'{BR}/05_BUMP4_VITALICIO', 'Order bump 4 · Acesso Vitalício', """| Campo | Valor |
|---|---|
| Nome | **Acesso Vitalício CHIP ADV** |
| Preço | **R$ 37** |
| Faixa | `Acesso vitalício ao CHIP ADV` |
| Caixa | `Sim, quero acesso vitalício por R$ 37` |
| Selo | `Preço especial` |
| Imagem | `imagens/bump-vitalicio.png` |

**Descrição:** Seu acesso é de 1 ano. Com o vitalício, o CHIP ADV e a área de membros ficam com você pra sempre, sem renovar.

**Entrega:** não tem arquivo. Na Cakto, configure este bump para **liberar o acesso sem prazo** à área de membros do produto principal.""",
     [], ['bump-vitalicio.png']),

    (f'{BR}/06_UPSELL_CHIP_ADV_PRO', 'Upsell · CHIP ADV PRO', """| Campo | Valor |
|---|---|
| Nome | **CHIP ADV PRO** |
| Preço | **R$ 97** (ou 12x) · compra com 1 clique |
| Quando aparece | Página logo depois da compra |

**Descrição:** Transforme cada gravação em anúncio e deixe todos os vídeos com a cara do seu escritório. Inclui o **Módulo Anúncios** (1 vídeo → versões de 15, 30 e 45 s + 5 ganchos + textos do anúncio) e o **Kit Identidade do Escritório** (MARCA.md + 8 estilos prontos).

**Área de membros:**
1. Módulo Anúncios · `CHIP_ADV_ANUNCIOS.md` + `EXEMPLO_PACOTE.md` + `planilha_teste.csv`
2. Kit Identidade · `MARCA.md` + `ESTILOS.md` + `CATALOGO_ESTILOS.pdf` + `estilos.json`

Se recusar, mostre o **downsell** (pasta 07).""",
     [(f'{R}/bump3-anuncios/CHIP_ADV_ANUNCIOS.md', 'modulo-anuncios/CHIP_ADV_ANUNCIOS.md'), (f'{R}/bump3-anuncios/EXEMPLO_PACOTE.md', 'modulo-anuncios/EXEMPLO_PACOTE.md'),
      (f'{R}/bump3-anuncios/planilha_teste.csv', 'modulo-anuncios/planilha_teste.csv'),
      (f'{R}/bump2-identidade/MARCA.md', 'kit-identidade/MARCA.md'), (f'{R}/bump2-identidade/ESTILOS.md', 'kit-identidade/ESTILOS.md'),
      (f'{R}/bump2-identidade/CATALOGO_ESTILOS.pdf', 'kit-identidade/CATALOGO_ESTILOS.pdf'), (f'{R}/bump2-identidade/estilos.json', 'kit-identidade/estilos.json')], []),

    (f'{BR}/07_DOWNSELL_ANUNCIOS', 'Downsell · Módulo Anúncios', """| Campo | Valor |
|---|---|
| Nome | **CHIP ADV · Módulo Anúncios** |
| Preço | **R$ 47** · compra com 1 clique |
| Quando aparece | Só para quem recusou o upsell |

**Descrição:** A mesma gravação vira um pacote de anúncios para testar: versões de 15, 30 e 45 segundos, 5 ganchos diferentes e os textos do anúncio.

**Área de membros:** `CHIP_ADV_ANUNCIOS.md` + `EXEMPLO_PACOTE.md` + `planilha_teste.csv`""",
     [(f'{R}/bump3-anuncios/CHIP_ADV_ANUNCIOS.md', 'CHIP_ADV_ANUNCIOS.md'), (f'{R}/bump3-anuncios/EXEMPLO_PACOTE.md', 'EXEMPLO_PACOTE.md'),
      (f'{R}/bump3-anuncios/planilha_teste.csv', 'planilha_teste.csv')], []),

    (f'{LA}/01_PRINCIPAL_CHIP_ABOGADO', 'Producto principal · CHIP ABOGADO (Hotmart)', """| Campo | Valor |
|---|---|
| Nombre | **CHIP ABOGADO** |
| Tipo | Producto digital · área de miembros (Hotmart Club) |
| Precio | **US$ 19** · pago único (Hotmart convierte a la moneda local) |
| Acceso | 1 año |
| Garantía | 7 días |
| Idioma | Español |
| Píxel Meta | `1692009002494391` + API de Conversiones activada |
| Imagen del producto | `imagenes/producto.png` |
| Banner del checkout | `imagenes/banner.png` |
| Sello de garantía | `imagenes/sello-garantia.png` |

**Descripción corta (checkout):** El prompt maestro que hace que tu IA edite tus videos de abogado: corta pausas, subtitula, pone efectos y música. Incluye el mapa con 17 efectos, la guía del primer video y 64 ideas por área del Derecho.

**Área de miembros (módulos, en este orden):**
1. Empieza aquí · `GUIA_PRIMER_VIDEO.pdf`
2. El CHIP ABOGADO · `CHIP_ABOGADO.md`
3. Mapa de efectos · `MAPA_EFECTOS_CHIP_ABOGADO.pdf`
4. Bono · `BONO_64_IDEAS_ABOGADOS.pdf`

**Mensaje de entrega:**
> ¡Tu CHIP ABOGADO llegó! 🎬
> 1. Descarga los archivos en el área de miembros.
> 2. Abre primero la **Guía del primer video**: en 40 minutos tu computadora queda lista.
> 3. Después adjunta el CHIP_ABOGADO.md, el mapa y tu video en Claude y escribe "Corre el CHIP ABOGADO."
> Dudas: [CORREO DE SOPORTE]. Garantía de 7 días.

> **V1 sin order bumps.** Para el primer test en LATAM, solo el producto principal. Los bumps entran cuando la oferta esté validada.""",
     [(f'{R}/latam/CHIP_ABOGADO.md', 'CHIP_ABOGADO.md'), (f'{R}/mapa/MAPA_EFECTOS_CHIP_ABOGADO.pdf', 'MAPA_EFECTOS_CHIP_ABOGADO.pdf'),
      ('@guia_es', 'GUIA_PRIMER_VIDEO.pdf'), ('@pautas_es', 'BONO_64_IDEAS_ABOGADOS.pdf')],
     ['es/producto.png', 'es/banner.png', 'es/sello-garantia.png']),
]

LEIAME = """# Entregáveis CHIP ADV · como montar

Cada pasta é **um produto**. Dentro de cada uma:
- `FICHA.md` → tudo que você digita na plataforma (nome, preço, textos do checkout, mensagem de entrega).
- `arquivos/` → o que o comprador recebe (suba na área de membros).
- `imagens/` → imagens do checkout.
- O `.zip` de cada pasta, se a plataforma pedir um arquivo único.

## Ordem de montagem

### Brasil · Cakto
1. `01_PRINCIPAL_CHIP_ADV` → crie o produto, a área de membros e o checkout. Cole o pixel.
2. `02` a `05` → os 4 order bumps, **nesta ordem**, no checkout do principal.
3. `06_UPSELL_CHIP_ADV_PRO` → página de upsell com 1 clique.
4. `07_DOWNSELL_ANUNCIOS` → downsell para quem recusou o upsell.
5. Copie o link do checkout e me mande (eu coloco na landing).
6. Faça uma compra de teste e me avise (eu confiro o pixel).

### LATAM · Hotmart
1. `01_PRINCIPAL_CHIP_ABOGADO` → crie o produto em USD, o Hotmart Club e o checkout. Cole o pixel e ative a API de Conversiones.
2. Copie o link do checkout e me mande.
3. Compra de teste.

### Políticas (as duas landings)
Já estão nas landings: `landing/legal.html` e `latam/landing-es/legal.html`. **Troque os campos entre [colchetes]** (nome ou razão social, CNPJ e e-mail) antes de publicar.
"""


def main():
    os.makedirs(OUT, exist_ok=True)
    gerados = {'@guia_pt': (f'{C}/GUIA_PRIMEIRO_VIDEO.md', 'CHIP <b>ADV</b>'), '@pautas_pt': (f'{C}/PAUTAS_ADVOGADOS.md', 'CHIP <b>ADV</b>'),
               '@guia_es': (f'{C}/GUIA_PRIMER_VIDEO_ES.md', 'CHIP <b>ABOGADO</b>'), '@pautas_es': (f'{C}/IDEAS_ABOGADOS_ES.md', 'CHIP <b>ABOGADO</b>')}
    pdfs = {}
    for k, (md, marca) in gerados.items():
        p = f'{C}/{os.path.basename(md).replace(".md", ".pdf")}'; pdf(md, p, marca); pdfs[k] = p
    legal(f'{C}/LEGAL_PT.md', f'{R}/landing/legal.html', 'CHIP ADV', 'pt-BR')
    legal(f'{C}/LEGAL_ES.md', f'{R}/latam/landing-es/legal.html', 'CHIP ABOGADO', 'es')
    shutil.rmtree(OUT, ignore_errors=True); os.makedirs(OUT)
    open(f'{OUT}/LEIA-ME.md', 'w').write(LEIAME)
    for pasta, titulo, ficha, arqs, imgs in PRODUTOS:
        os.makedirs(pasta)
        open(f'{pasta}/FICHA.md', 'w').write(f'# {titulo}\n\n{ficha}\n')
        for src, dst in arqs:
            src = pdfs.get(src, src); d = f'{pasta}/arquivos/{dst}'; os.makedirs(os.path.dirname(d), exist_ok=True); shutil.copy(src, d)
        img_dir = 'imagenes' if '/LATAM_' in pasta else 'imagens'
        for im in imgs:
            os.makedirs(f'{pasta}/{img_dir}', exist_ok=True); shutil.copy(f'{IMG}/{im}', f'{pasta}/{img_dir}/{os.path.basename(im)}')
        with zipfile.ZipFile(f'{pasta}.zip', 'w', zipfile.ZIP_DEFLATED) as z:
            for root, _, files in os.walk(pasta):
                for f in files: z.write(f'{root}/{f}', os.path.relpath(f'{root}/{f}', os.path.dirname(pasta)))
    print('ok')


if __name__ == '__main__':
    main()
