"""Caixa do rosto por quadro, a partir do alfa dos recortes (cutout/{clip}/{frame}.webp) e do EDL.
Saída: src/data/rosto.json = [[x, y, w, h], ...] em pixels 1080x1920, um item por quadro do vídeo final, suavizado.
uso: python3 tools/rosto_track.py projeto"""
import json, sys
import numpy as np
from PIL import Image

P = sys.argv[1]
edl = json.load(open(f'{P}/src/data/edl.json'))
out = []
for c in edl['chunks']:
    for k in range(c['dur']):
        f = c['from'] + min(k, c['dur'] - 1)
        try: a = np.asarray(Image.open(f"{P}/public/cutout/{c['clip']}/{f:05d}.webp").getchannel('A').resize((270, 480))) > 128
        except FileNotFoundError: out.append(out[-1] if out else [300, 560, 480, 312]); continue
        rows = np.where(a.sum(1) > 3)[0]
        if len(rows) == 0: out.append(out[-1] if out else [300, 560, 480, 560]); continue
        y0 = rows[0]; cab = a[y0 + 8:y0 + 70]          # faixa da cabeça (acima dos ombros)
        cols = np.where(cab.sum(0) > 2)[0]
        x0, x1 = (cols[0], cols[-1]) if len(cols) else (75, 195)
        out.append([float(x0 * 4), float(y0 * 4 + 20), float((x1 - x0) * 4), float(105 * 4)])
arr = np.array(out)
k = 7; pad = np.pad(arr, ((k, k), (0, 0)), mode='edge')
suave = np.array([pad[i:i + 2 * k + 1].mean(0) for i in range(len(arr))])
json.dump([[round(v) for v in r] for r in suave], open(f'{P}/src/data/rosto.json', 'w'))
print(len(suave), suave[0], suave[len(suave) // 2])
