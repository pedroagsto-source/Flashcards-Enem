"""Gera as capas do curso CHIP ADV (módulos 2:3, aulas 16:9 e banner) como PNG.
uso: python3 tools/capas.py   → entregas/BRASIL_CAKTO/00_AREA_DE_MEMBROS_AULAS/capas/
"""
import json, os, subprocess

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = f'{R}/projeto/public'
OUT = f'{R}/entregas/BRASIL_CAKTO/00_AREA_DE_MEMBROS_AULAS/capas'
FOTOS = f'{R}/fotos-pro'  # fotos profissionais geradas a partir dos vídeos (fal · nano-banana)
P = {'a': '1_estudio_terno.jpg', 'b': '2_escritorio_estante.jpg', 'c': '3_notebook.jpg', 'd': '4_gravando_tripe.jpg',
     'e': '5_close_janela.jpg', 'f': '6_explicando.jpg', 'g': '7_pb_editorial.jpg', 'h': '8_corredor.jpg'}
POS = {'a': '50% 18%', 'b': '50% 30%', 'c': '30% 40%', 'd': '62% 35%', 'e': '50% 25%', 'f': '50% 30%', 'g': '50% 20%', 'h': '62% 45%'}

MODULOS = [
    ('01', 'Comece aqui', 'O caminho inteiro em 2 aulas', 'a'),
    ('02', 'Instalação', 'Uma vez só, sem complicação', 'b'),
    ('03', 'Seu primeiro vídeo', 'Do celular ao vídeo pronto', 'd'),
    ('04', 'Efeitos', 'Os 17 efeitos e como pedir', 'f'),
    ('05', 'Suporte', 'Os problemas mais comuns, resolvidos', 'e'),
    ('06', 'Avançado', 'Transformações com IA (opcional)', 'c'),
    ('07', 'Bônus', 'Pautas, identidade e anúncios', 'g'),
]
AULAS = [
    ('01_M1_Aula0', 'AULA 0', 'Boas-vindas', 'O caminho em 1 minuto', 'Comece aqui', 'a'),
    ('02_M1_Aula1', 'AULA 1', 'O que você precisa', '4 coisas, nenhuma paga a mais', 'Comece aqui', 'e'),
    ('03_M2_Aula2', 'AULA 2', 'Instalando o Claude', 'Plano, app e aba Code', 'Instalação', 'c'),
    ('04_M2_Aula3', 'AULA 3', 'Instalando o CHIP ADV', 'A skill /chip-adv', 'Instalação', 'b'),
    ('05_M2_Aula4', 'AULA 4', 'Preparando o computador', 'Um pedido e pronto', 'Instalação', 'c'),
    ('06_M3_Aula5', 'AULA 5', 'Gravando do jeito certo', 'As 6 regras', 'Seu primeiro vídeo', 'd'),
    ('07_M3_Aula6', 'AULA 6', 'Primeira edição', 'Estúdio, roteiro e vídeo pronto', 'Seu primeiro vídeo', 'c'),
    ('08_M3_Aula7', 'AULA 7', 'Roteiro e ajustes', 'Aprovar, mudar, acelerar', 'Seu primeiro vídeo', 'f'),
    ('09_M4_Aula8', 'AULA 8', 'Mapa de efeitos', '17 efeitos com o pedido de cada um', 'Efeitos', 'f'),
    ('10_M5_Aula9', 'AULA 9', 'Problemas comuns', 'E a solução de cada um', 'Suporte', 'e'),
    ('11_M6_Aula10', 'AULA 10', 'Transformações com IA', 'Roupa, cenário e objetos', 'Avançado', 'h'),
    ('12_M7_Bonus1', 'BÔNUS 1', 'Identidade do escritório', 'Nome, OAB, cores e logo', 'Bônus', 'g'),
    ('13_M7_Bonus2', 'BÔNUS 2', 'Modo anúncio', '5 ganchos e versões de 15/30/45 s', 'Bônus', 'a'),
    ('14_M7_Bonus_Pautas', 'BÔNUS', '64 pautas para advogados', 'Ganchos prontos por área', 'Bônus', 'b'),
]

FONTES = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@600;800;900&family=Instrument+Serif:ital@1&display=swap">'
BASE = """*{margin:0;box-sizing:border-box}body{width:%(w)dpx;height:%(h)dpx;overflow:hidden;background:#0B0B0F;font-family:Inter,sans-serif;color:#F5F3EE;position:relative}
.glow{position:absolute;inset:0;background:radial-gradient(circle at %(gx)s, rgba(216,255,60,.30), transparent 55%%),radial-gradient(circle at 10%% 100%%, rgba(124,58,237,.22), transparent 50%%)}
.grade{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:60px 60px}
.marca{position:absolute;font-weight:900;letter-spacing:.02em}.marca b{color:#D8FF3C}
.pessoa{position:absolute;filter:saturate(1.05) contrast(1.05);-webkit-mask-image:radial-gradient(ellipse 62%% 78%% at 50%% 38%%,#000 62%%,transparent 100%%);mask-image:radial-gradient(ellipse 62%% 78%% at 50%% 38%%,#000 62%%,transparent 100%%)}
.num{position:absolute;font-family:Anton,sans-serif;line-height:.8;color:transparent;-webkit-text-stroke:3px rgba(216,255,60,.85)}
.chip{display:inline-block;background:#D8FF3C;color:#0B0B0F;font-weight:900;letter-spacing:.12em;border-radius:999px}
.tit{font-weight:900;letter-spacing:-.03em;line-height:.98}.sub{color:#C9C9D1;font-weight:600}
.serif{font-family:'Instrument Serif',serif;font-style:italic;font-weight:400;color:#D8FF3C;letter-spacing:0}
.faixa{position:absolute;left:0;right:0;bottom:0;background:#D8FF3C;color:#0B0B0F;font-weight:900;letter-spacing:.1em;text-transform:uppercase}
"""


def italico(t):  # última palavra em serifa itálica, como na landing
    p = t.rsplit(' ', 1)
    return t if len(p) < 2 else f'{p[0]} <span class="serif">{p[1]}</span>'


def modulo(n, tit, sub, pose):
    w, h = 1000, 1500
    return f"""<html><head>{FONTES}<style>{BASE % {'w': w, 'h': h, 'gx': '70% 35%'}}</style></head><body><div class="glow"></div><div class="grade"></div>

<img src="file://{FOTOS}/{P[pose]}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:{POS[pose]}">
<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,11,15,.55) 0%,transparent 22%,transparent 46%,rgba(11,11,15,.9) 70%,#0B0B0F 86%)"></div>
<div style="position:absolute;inset:0;background:radial-gradient(circle at 80% 10%,rgba(216,255,60,.18),transparent 45%)"></div>
<div class="marca" style="left:60px;top:60px;font-size:40px">CHIP <b>ADV</b></div>
<div style="position:absolute;left:60px;right:60px;bottom:110px">
<div style="font-family:Anton,sans-serif;font-size:170px;line-height:.8;color:transparent;-webkit-text-stroke:3px #D8FF3C;margin-bottom:18px">{n}</div>
<div class="chip" style="font-size:26px;padding:10px 22px;margin-bottom:22px">MÓDULO {n}</div>
<div class="tit" style="font-size:{108 if len(tit) < 14 else 88}px">{italico(tit)}</div>
<div class="sub" style="font-size:36px;margin-top:18px">{sub}</div></div>
<div class="faixa" style="height:14px"></div></body></html>"""


def aula(rot, tit, sub, mod, pose):
    w, h = 1280, 720
    return f"""<html><head>{FONTES}<style>{BASE % {'w': w, 'h': h, 'gx': '78% 40%'}}</style></head><body><div class="glow"></div><div class="grade"></div>
<img src="file://{FOTOS}/{P[pose]}" style="position:absolute;right:0;top:0;width:62%;height:100%;object-fit:cover;object-position:{POS[pose]}">
<div style="position:absolute;inset:0;background:linear-gradient(90deg,#0B0B0F 38%,rgba(11,11,15,.82) 50%,rgba(11,11,15,.15) 72%,transparent 90%)"></div>
<div class="marca" style="left:64px;top:52px;font-size:30px">CHIP <b>ADV</b></div>
<div style="position:absolute;left:64px;top:170px;width:760px">
<div class="chip" style="font-size:24px;padding:9px 20px;margin-bottom:22px">{rot}</div>
<div class="tit" style="font-size:{96 if len(tit) < 18 else 80}px">{italico(tit)}</div>
<div class="sub" style="font-size:32px;margin-top:20px">{sub}</div></div>
<div class="faixa" style="height:60px;font-size:22px;padding:18px 64px">{mod}</div></body></html>"""


def banner():
    w, h = 1920, 600
    return f"""<html><head>{FONTES}<style>{BASE % {'w': w, 'h': h, 'gx': '72% 50%'}}</style></head><body><div class="glow"></div><div class="grade"></div>
<img src="file://{FOTOS}/{P['a']}" style="position:absolute;right:0;top:0;width:55%;height:100%;object-fit:cover;object-position:50% 22%">
<div style="position:absolute;inset:0;background:linear-gradient(90deg,#0B0B0F 40%,rgba(11,11,15,.7) 55%,transparent 80%)"></div>
<div style="position:absolute;left:110px;top:120px;width:1100px">
<div class="marca" style="position:static;font-size:30px;margin-bottom:24px">CHIP <b>ADV</b> · ÁREA DE MEMBROS</div>
<div class="tit" style="font-size:104px">Você grava. A IA <span class="serif">edita.</span></div>
<div class="sub" style="font-size:36px;margin-top:22px">Do celular ao vídeo pronto, com o seu estilo.</div></div></body></html>"""


def main():
    tmp = f'{OUT}/_html'; os.makedirs(tmp, exist_ok=True); jobs = []
    for n, t, s, p in MODULOS:
        f = f'{tmp}/modulo_{n}.html'; open(f, 'w').write(modulo(n, t, s, p)); jobs.append([f, f'{OUT}/modulos/MODULO_{n}.png', 1000, 1500])
    for arq, rot, t, s, m, p in AULAS:
        f = f'{tmp}/{arq}.html'; open(f, 'w').write(aula(rot, t, s, m, p)); jobs.append([f, f'{OUT}/aulas/{arq}.png', 1280, 720])
    f = f'{tmp}/banner.html'; open(f, 'w').write(banner()); jobs.append([f, f'{OUT}/BANNER_CURSO.png', 1920, 600])
    for d in ['modulos', 'aulas']: os.makedirs(f'{OUT}/{d}', exist_ok=True)
    js = """const {chromium}=require('playwright');const J=JSON.parse(process.argv[1]);(async()=>{const b=await chromium.launch();
for(const [src,out,w,h] of J){const p=await b.newPage({viewport:{width:w,height:h}});await p.goto('file://'+src,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
await p.screenshot({path:out});await p.close();}await b.close();})();"""
    subprocess.run(['node', '-e', js, json.dumps(jobs)], check=True, cwd='/tmp')
    subprocess.run(['rm', '-rf', tmp])
    print(len(jobs), 'capas em', OUT)


if __name__ == '__main__':
    main()
