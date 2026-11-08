"""Acha o início de cada frase numa narração, sem transcrever: escolhe, entre as pausas do áudio,
as que melhor dividem a fala na proporção do tamanho de cada frase (programação dinâmica).
uso: python3 tools/sync_frases.py conteudo/aulas_narracao.json projeto/public/aulas projeto/src/data/aulas_tempos.json"""
import json, re, subprocess, sys

narr, pasta, saida = sys.argv[1:4]
d = json.load(open(narr)); out = {}
for aula, frases in d.items():
    f = f'{pasta}/{aula}_voz.mp3'
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout)
    log = subprocess.run(['ffmpeg', '-hide_banner', '-i', f, '-af', 'silencedetect=n=-38dB:d=0.18', '-f', 'null', '-'], capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', log)]; en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', log)]
    gaps = [(s, e) for s, e in zip(st, en) if 0.3 < s < dur - 0.3]
    n = len(frases); w = [max(8, len(x)) for x in frases]; tot = sum(w)
    fala = dur - sum(e - s for s, e in gaps)
    # custo: desvio do tamanho esperado de cada frase; pausas longas ganham bônus como fronteira
    pts = [0.0] + [e for _, e in gaps]; ends = [s for s, _ in gaps] + [dur]; G = len(gaps)
    INF = 1e9; best = [[INF] * (G + 1) for _ in range(n)]; prv = [[-1] * (G + 1) for _ in range(n)]
    def custo(a, b, k):  # frase k vai do ponto a (início) até o fim b
        real = ends[b - 1] - pts[a] if b > a else 0
        esp = fala * w[k] / tot
        bonus = (gaps[b - 1][1] - gaps[b - 1][0]) * 3 if b - 1 < G and b <= G and k < n - 1 else 0
        return ((real - esp) / max(esp, .5)) ** 2 - bonus
    for b in range(1, G + 2):
        if n == 1: break
    # best[k][j]: frase k termina na pausa j-1 (j=G+1 → fim do áudio); início da frase k+1 = pts[j]
    import functools
    @functools.lru_cache(None)
    def F(k, a):  # menor custo das frases k..n-1 começando no ponto a
        if k == n - 1: return (custo(a, G + 1, k), (G + 1,))
        res = (INF, ())
        for b in range(a + 1, G + 1):
            c1 = custo(a, b, k); c2, cam = F(k + 1, b)
            if c1 + c2 < res[0]: res = (c1 + c2, (b,) + cam)
        return res
    _, cam = F(0, 0)
    inicios = [0.0] + [pts[b] - 0.05 for b in cam[:-1]]
    out[aula] = {'frases': [round(x * 30) for x in inicios], 'total': round((dur + 1.5) * 30)}
    print(aula, [round(x, 1) for x in inicios], round(dur, 1))
json.dump(out, open(saida, 'w'))
