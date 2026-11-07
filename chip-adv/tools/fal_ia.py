"""Efeito 18 · Transformação por IA (fal.ai).

Edita um quadro do vídeo com o Nano Banana (fal-ai/nano-banana/edit): troca de roupa, de cenário, objeto na mão.
A chave FAL_KEY fica em chip-adv/.env (ignorado pelo git) e nunca é impressa.

uso:
  python3 tools/fal_ia.py quadro.png "troque a camisa por uma beca preta de advogado" saida.png
  python3 tools/fal_ia.py --extrair video.mp4 3.2 quadro.png      # tira o quadro do segundo 3,2

Custo verificado: US$ 0,0398 por imagem (fal.ai, nov/2026). Cada execução é cobrada: não repita um envio sem conferir o resultado.
"""
import os, subprocess, sys, urllib.request

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELO = 'fal-ai/nano-banana/edit'


def carrega_chave():
    if os.environ.get('FAL_KEY'): return
    env = os.path.join(R, '.env')
    if os.path.exists(env):
        for l in open(env):
            l = l.strip()
            if l.startswith('FAL_KEY='):
                os.environ['FAL_KEY'] = l.split('=', 1)[1].strip().strip("'\"")
    if not os.environ.get('FAL_KEY'):
        sys.exit('FAL_KEY ausente: conecte a conta do fal (chip-adv/.env).')


def extrair(video, seg, saida):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(seg), '-i', video, '-frames:v', '1', saida], check=True)
    return saida


def editar(quadro, pedido, saida):
    carrega_chave()
    import fal_client
    url = fal_client.upload_file(quadro)
    req = fal_client.submit(MODELO, arguments={'prompt': pedido, 'image_urls': [url], 'num_images': 1, 'aspect_ratio': 'auto', 'output_format': 'png'})
    print('request_id:', req.request_id, flush=True)   # guarde: um novo envio é uma nova cobrança
    res = req.get()
    img = res['images'][0]['url']
    if not img.startswith('https://'): sys.exit('URL de resultado inesperada')
    urllib.request.urlretrieve(img, saida)
    print('ok:', saida)
    return saida


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == '--extrair': extrair(a[1], float(a[2]), a[3])
    elif len(a) == 3: editar(*a)
    else: sys.exit(__doc__)
