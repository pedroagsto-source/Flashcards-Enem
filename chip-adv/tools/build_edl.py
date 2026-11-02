"""Gera src/data/edl.json: lista de trechos mantidos, com texto corrigido e palavras com tempo
(estimado proporcionalmente às vogais, dentro de cada trecho curto delimitado por pausa real)."""
import json, re
FPS = 30
# (clipe, entrada, saída, texto corrigido, palavras-chave destacadas)
CHUNKS = [
 ("hook", 1.36, 2.36, "Advogado,", ["Advogado"]),
 ("hook", 2.56, 4.78, "você ainda tá editando seus vídeos manualmente?", ["manualmente?"]),
 ("hook", 5.47, 6.74, "Olha o que dá pra fazer", []),
 ("hook", 6.86, 9.66, "usando um único arquivo de inteligência artificial.", ["único", "arquivo"]),
 ("body", 0.60, 3.60, "Esse vídeo aqui começou com a gravação normal de celular.", ["celular."]),
 ("body", 3.92, 5.58, "E depois que eu coloquei o CHIP ADV,", ["CHIP", "ADV,"]),
 ("body", 6.08, 6.88, "olha como ficou!", ["ficou!"]),
 ("body", 8.95, 12.00, "Funciona assim: você anexa o CHIP ADV na conversa", ["CHIP", "ADV"]),
 ("body", 12.05, 14.00, "com a sua IA, abre esse mapa", ["mapa"]),
 ("body", 14.30, 17.75, "e você simplesmente escolhe o conteúdo que você quer fazer.", ["conteúdo"]),
 ("body", 18.20, 21.00, "Como você quer fazer, qual estilo você quer fazer,", ["estilo"]),
 ("body", 21.10, 22.70, "qual situação você quer fazer.", ["situação"]),
 ("body", 22.98, 26.05, "Entendeu? E você vai apenas dando as ordens", ["ordens"]),
 ("body", 26.15, 27.55, "e ele vai construindo", ["construindo"]),
 ("body", 27.60, 29.20, "o que há de melhor", ["melhor"]),
 ("body", 29.25, 30.90, "e mais moderno na edição.", ["moderno"]),
 ("body", 32.20, 33.82, "Eu organizei tudo", ["tudo"]),
 ("body", 34.12, 35.25, "num único chip.", ["chip."]),
 ("body", 36.24, 37.76, "Clica aqui em Saiba Mais,", ["Saiba", "Mais,"]),
 ("body", 37.86, 39.28, "junta esse documentinho", ["documentinho"]),
 ("body", 39.36, 41.45, "e vê a mágica acontecer.", ["mágica"]),
]
def weight(w):
    return max(1.0, len(re.findall(r"[aeiouáéíóúâêôãõà]", w.lower())) + 0.25 * len(w))
out, t = [], 0
for i, (clip, a, b, text, keys) in enumerate(CHUNKS):
    fa, fb = round(a * FPS), round(b * FPS)
    dur = fb - fa
    words = text.split(); tot = sum(map(weight, words))
    pad = 3  # frames de respiro antes da 1ª palavra
    span = dur - pad - 2
    cur, ws = pad, []
    for w in words:
        d = span * weight(w) / tot
        ws.append({"w": w, "s": round(cur), "e": round(cur + d), "k": w in keys}); cur += d
    out.append({"i": i, "clip": clip, "from": fa, "to": fb, "start": t, "dur": dur, "text": text, "words": ws})
    t += dur
json.dump({"fps": FPS, "total": t, "chunks": out}, open("src/data/edl.json", "w"), ensure_ascii=False, indent=1)
for c in out: print(f"{c['i']:2d} {c['start']/FPS:6.2f}s  {c['dur']:3d}f  {c['clip']} {c['text']}")
print("total", t, "frames =", t / FPS, "s")
