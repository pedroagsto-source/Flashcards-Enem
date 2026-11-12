"""Monta uma campanha de teste do CHIP ADV (1-1-x, bid cap) numa conta de anúncios, TUDO PAUSADO.
uso: python3 tools/meta_campanha.py act_XXXX "CA 01"
Token: o proxy do ambiente injeta o Bearer em graph.facebook.com (nunca colocar token aqui).
Saída: trafego/campanhas.json (ids criados por conta).
"""
import json, os, sys, time, urllib.request, urllib.parse, subprocess

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = 'https://graph.facebook.com/v21.0'
PIXEL, PAGINA, INSTA = '1692009002494391', '1345671161972936', '17841447904816840'
CAMBIO = float(os.environ.get('CAMBIO', '5.50'))  # R$ por US$ (contas em dólar)
BID_BRL, ORC_BRL = 100.0, 100.0
LINK = 'https://chipadv.vercel.app/'
DATA = time.strftime('%d%b').upper()
CR = 'projeto/out/criativos'
CRIATIVOS = [
    ('CR01_F1_demo', 'CHIPADV_F1_demo_ganchoA_v1_upload.mp4'),
    ('CR02_F1_escritorio', 'CHIPADV_F1_demo_ganchoA_escritorio_v1_upload.mp4'),
    ('CR03_F4_ladoalado', 'CHIPADV_F4_ladoalado_v1.mp4'),
    ('CR04_F5_motion', 'CHIPADV_F5_motion_v1.mp4'),
    ('CR05_F6_animado', 'CHIPADV_F6_teladividida_animado_v1.mp4'),
    ('CR06_F6_animado_voz', 'CHIPADV_F6_teladividida_animado_v2_voz.mp4'),
    ('CR07_F7_carro', 'CHIPADV_F7_carro_efeitos_v1_upload.mp4'),
    ('CR08_F8_ia_editou', 'CHIPADV_F8_ia_editou_v1_upload.mp4'),
    ('CR09_F10_estudio', 'CHIPADV_F10_estudio_v1_upload.mp4'),
]
TEXTO = ('Advogado: você grava do jeito que sair e a IA edita o seu vídeo. 🎬\n\n'
         'Ela corta as pausas, coloca legenda, efeitos e trilha. Antes, você escolhe o seu estilo no Estúdio e aprova o roteiro de cada momento.\n\n'
         'Sem editor. Sem programa difícil.\n'
         '👉 R$ 97 ou 12x de R$ 10,02 · Garantia de 7 dias.')
TITULO, DESCR = 'CHIP ADV: a IA edita os seus vídeos', 'Feito para advogados'
UTM = 'utm_source=meta&utm_medium=paid&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}'


def api(path, data=None, method=None):
    url = f'{G}/{path}'
    body = urllib.parse.urlencode({k: (json.dumps(v) if isinstance(v, (dict, list)) else v) for k, v in data.items()}).encode() if data else None
    req = urllib.request.Request(url, data=body, method=method or ('POST' if data else 'GET'))
    try:
        return json.load(urllib.request.urlopen(req, timeout=120))
    except urllib.error.HTTPError as e:
        raise SystemExit(f'ERRO {path}: {e.read().decode()[:600]}')


def subir_video(conta, nome, arq):
    out = subprocess.run(['curl', '-gsS', '-X', 'POST', f'{G}/{conta}/advideos', '-F', f'name={nome}', '-F', f'source=@{R}/{CR}/{arq}', '--max-time', '600'],
                         capture_output=True, text=True).stdout
    d = json.loads(out)
    if 'id' not in d: raise SystemExit(f'ERRO upload {nome}: {out[:400]}')
    return d['id']


def esperar_thumb(vid):
    for _ in range(60):
        v = api(f'{vid}?fields=status')
        if v.get('status', {}).get('video_status') == 'ready':
            t = api(f'{vid}/thumbnails?fields=uri,is_preferred').get('data', [])
            if t: return next((x['uri'] for x in t if x.get('is_preferred')), t[0]['uri'])
        time.sleep(10)
    raise SystemExit(f'vídeo {vid} não ficou pronto')


def main():
    conta, rotulo = sys.argv[1], sys.argv[2]
    usd = lambda brl: int(round(brl / CAMBIO * 100))  # centavos de dólar
    # reaproveita campanha/conjunto/vídeos de uma tentativa anterior (o script pode ser rodado de novo sem duplicar)
    ex = [c for c in api(f'{conta}/campaigns?fields=id,name,adsets{{id}}&limit=50')['data'] if c['name'].startswith('CHIPADV | TESTE V2')]
    vids = {v['title']: v['id'] for v in api(f'{conta}/advideos?fields=id,title&limit=100').get('data', [])}
    feitos = {a['name'] for a in api(f'{conta}/ads?fields=name&limit=100').get('data', [])} if ex else set()
    if ex and ex[0].get('adsets'):
        camp, adset = ex[0]['id'], ex[0]['adsets']['data'][0]['id']; print(rotulo, 'reaproveitando', camp)
    else:
        camp, adset = None, None
    if not camp:
      camp = api(f'{conta}/campaigns', {'name': f'CHIPADV | TESTE V2 | 1-1-{len(CRIATIVOS)} | BIDCAP R$100 | BR ABERTO | PURCHASE | {DATA}',
                                      'objective': 'OUTCOME_SALES', 'special_ad_categories': [], 'buying_type': 'AUCTION',
                                      'is_adset_budget_sharing_enabled': 'false', 'status': 'PAUSED'})['id']
      adset = api(f'{conta}/adsets', {'name': 'BR | 25-65 | ABERTO | BID R$100', 'campaign_id': camp, 'daily_budget': usd(ORC_BRL),
                                    'billing_event': 'IMPRESSIONS', 'optimization_goal': 'OFFSITE_CONVERSIONS',
                                    'bid_strategy': 'LOWEST_COST_WITH_BID_CAP', 'bid_amount': usd(BID_BRL),
                                    'promoted_object': {'pixel_id': PIXEL, 'custom_event_type': 'PURCHASE'},
                                    'targeting': {'geo_locations': {'countries': ['BR']}, 'age_min': 25, 'age_max': 65,
                                                  'targeting_automation': {'advantage_audience': 0}},
                                    'status': 'PAUSED'})['id']
    ads = []
    for nome, arq in CRIATIVOS:
        if nome in feitos: print(rotulo, nome, 'já existe'); continue
        vid = vids.get(nome) or subir_video(conta, nome, arq); thumb = esperar_thumb(vid)
        cr = api(f'{conta}/adcreatives', {'name': nome, 'url_tags': UTM, 'object_story_spec': {
            'page_id': PAGINA, 'instagram_user_id': INSTA,
            'video_data': {'video_id': vid, 'image_url': thumb, 'message': TEXTO, 'title': TITULO, 'link_description': DESCR,
                           'call_to_action': {'type': 'LEARN_MORE', 'value': {'link': LINK}}}}})['id']
        ad = api(f'{conta}/ads', {'name': nome, 'adset_id': adset, 'creative': {'creative_id': cr}, 'status': 'PAUSED'})['id']
        ads.append({'nome': nome, 'video': vid, 'criativo': cr, 'anuncio': ad}); print(rotulo, nome, 'ok', flush=True)
    os.makedirs(f'{R}/trafego', exist_ok=True); p = f'{R}/trafego/campanhas.json'
    reg = json.load(open(p)) if os.path.exists(p) else {}
    reg[rotulo] = {'conta': conta, 'campanha': camp, 'conjunto': adset, 'anuncios': ads, 'cambio': CAMBIO,
                   'bid_usd_centavos': usd(BID_BRL), 'orcamento_usd_centavos': usd(ORC_BRL), 'status': 'PAUSED'}
    json.dump(reg, open(p, 'w'), indent=1, ensure_ascii=False); print(rotulo, 'PRONTO', camp)


if __name__ == '__main__':
    main()
