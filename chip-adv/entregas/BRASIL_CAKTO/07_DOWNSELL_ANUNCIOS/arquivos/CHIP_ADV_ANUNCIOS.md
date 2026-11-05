# CHIP ADV · Módulo Anúncios

> **Como usar:** anexe na conversa **CHIP_ADV.md + CHIP_ADV_ANUNCIOS.md + mapa** (+ `MARCA.md`, se tiver) e o seu vídeo. Escreva:
> **"Roda o CHIP ADV no modo anúncio."**
> Opcional, numa linha: `Objetivo: seguidores | mensagens | site · CTA: Saiba Mais | comenta PALAVRA · Palavra: ADV`
>
> **Melhor resultado:** grave o hook **3 a 5 vezes de jeitos diferentes** (um take para cada) e o corpo uma vez. Se mandar só um hook, o módulo cria as variações visuais sozinho.

---

## 0. O QUE ESTE MÓDULO MUDA NO CHIP ADV

O CHIP ADV edita **um** vídeo. No modo anúncio, a mesma gravação vira um **pacote de criativos para teste**:

| Peça | Quantidade | Para quê |
|---|---|---|
| Versões de duração | 3: **15 s, 30 s e 45 s** | Topo de funil (15 s), conversão (30 s), público morno ou remarketing (45 s) |
| Variações de hook | **5** em cima da versão de 30 s | Descobrir qual abertura segura o público |
| Textos do anúncio | 3 textos principais, 3 títulos, 1 descrição | Testar a copy junto com o criativo |
| Planilha de teste | 1 | Nomear, subir e decidir sem achismo |

Todas as regras do CHIP ADV continuam valendo (cortes, legendas, efeitos, som, controle de qualidade). Primeiro edite a **versão completa (45 s)** normalmente; as outras saem dela.

---

## 1. VERSÕES DE DURAÇÃO (cortar da versão completa)

Depois do render completo, monte o mapa de blocos a partir do storyboard:

| Bloco | Função | Entra em |
|---|---|---|
| A | Hook (até a primeira promessa) | 15 · 30 · 45 |
| B | Prova (antes/depois, resultado) | 30 · 45 |
| C | Método (como funciona) | 30 · 45 |
| D | Detalhes (lista, exemplos) | 45 |
| E | CTA | 15 · 30 · 45 |

- **15 s = A + E.** Se passar de 15 s, encurte o A, nunca o CTA.
- **30 s = A + B + C (resumido) + E.**
- **45 s = a versão completa.**

**Regras de corte:**
1. Corte **só entre trechos de fala** e **fora de efeitos** (nunca no meio de uma animação). Se um efeito atravessar o ponto de corte, mova o corte para o fim do efeito.
2. Em cada emenda: fade de áudio de 1 a 2 frames (40 ms) para não estalar.
3. A frase que vem logo depois de um corte precisa fazer sentido sozinha. Se não fizer, troque o bloco.
4. Confira a duração final com `ffprobe` e escreva no nome do arquivo.

**Comando de referência** (cortes em frames a 30 fps):
```bash
ffmpeg -i completo.mp4 -filter_complex \
"[0:v]trim=start=0:end=17.7,setpts=PTS-STARTPTS[v0];[0:a]atrim=start=0:end=17.7,asetpts=PTS-STARTPTS,afade=t=in:d=0.04,afade=t=out:st=17.66:d=0.04[a0];\
 [0:v]trim=start=33.27:end=41.07,setpts=PTS-STARTPTS[v1];[0:a]atrim=start=33.27:end=41.07,asetpts=PTS-STARTPTS,afade=t=in:d=0.04,afade=t=out:st=7.76:d=0.04[a1];\
 [v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]" -map "[v]" -map "[a]" -c:v libx264 -crf 17 -c:a aac -b:a 256k -movflags +faststart 30s.mp4
```

---

## 2. CINCO VARIAÇÕES DE HOOK (sobre a versão de 30 s)

Se o usuário gravou vários hooks, use cada take como uma variação (H1 a H5) e coloque o mesmo corpo depois. Se gravou só um, crie as variações **visuais** abaixo por cima dos primeiros 3 segundos, numa composição Remotion separada que recebe o vídeo de 30 s pronto (`OffthreadVideo`) e desenha só a camada do hook:

| Id | Nome | O que aparece nos primeiros 3 s | Quando funciona |
|---|---|---|---|
| **H1** | Original | O hook editado, sem camada extra | Controle do teste |
| **H2** | Pergunta | Caixa no estilo "Faça uma pergunta" dos stories com a dúvida do público (ex.: "É verdade que a IA já edita vídeo de advogado?") | Público curioso, frio |
| **H3** | Ordem direta | Frase imperativa, palavra por palavra, 2 palavras-chave com fundo de destaque (ex.: "ADVOGADO, / PARA DE EDITAR / VÍDEO NA MÃO.") | Dor clara, público consciente |
| **H4** | Prova | Selo grande de resultado + chip de apoio (ex.: "EDITADO POR IA ↓" + "sem editor · sem CapCut · 1 arquivo") | Público cético |
| **H5** | Cold open | Os 0,8 s mais fortes do **final** abrem o vídeo com a etiqueta "RESULTADO ↓"; depois "COMO FIZ ISSO ↓" e o vídeo do começo | Remarketing, público que já viu |

**Regras das camadas de hook:**
- Sempre na faixa **y 230–560** (abaixo da interface do app, acima do rosto). Nunca cubra a boca.
- Entram em até **3 frames** (o primeiro frame já precisa ter texto) e saem até o frame 90.
- Um efeito sonoro curto na entrada (pop, whoosh ou impacto).
- No máximo **9 palavras**. Leitura em menos de 2 segundos.
- Use as cores e fontes do `MARCA.md`, se existir.

---

## 3. CTA: DUAS VERSÕES

- **Saiba Mais:** "Toca em **Saiba Mais** que eu te mostro…" + botão na tela com o cursor clicando.
- **Comenta palavra:** "Comenta **ADV** que eu te mando no direct." + palavra grande com fundo de destaque. Só use esta se a automação de direct estiver configurada.

---

## 4. TEXTOS DO ANÚNCIO

Entregue num bloco pronto para colar no Gerenciador de Anúncios:

- **3 textos principais** com ângulos diferentes: **dor** (o tempo perdido editando), **prova** (antes/depois, números reais do vídeo) e **mecanismo** (um arquivo + "edita pra mim"). Até 125 caracteres antes do "ver mais"; a primeira linha precisa funcionar sozinha.
- **3 títulos** de até 40 caracteres.
- **1 descrição** de até 30 caracteres.
- Use **apenas números reais** que aparecem no vídeo ou foram informados pelo usuário.

---

## 5. NOMES DOS ARQUIVOS E PLANILHA DE TESTE

**Padrão de nome:** `MARCA_DURACAO_HOOK_CTA_vN.mp4` → ex.: `CHIPADV_30s_h3_saibamais_v1.mp4`

**Planilha** (entregue em CSV):
```
arquivo,duracao,hook,cta,texto,titulo,status,impressoes,retencao_3s,ctr,cpc,resultado,decisao
```

**Plano de teste sugerido:**
1. **Rodada 1 (hooks):** 5 anúncios de 30 s (H1 a H5), mesmo texto, mesmo público, mesmo orçamento por anúncio.
2. Depois de cerca de **2 mil impressões por anúncio**, pause os 2 hooks com menor **retenção nos 3 primeiros segundos**.
3. **Rodada 2 (duração):** com o melhor hook, teste 15 s × 30 s × 45 s.
4. **Rodada 3 (copy):** com o melhor criativo, teste os 3 textos principais.
5. Troque o **corpo** só quando todos os hooks caírem.

---

## 6. CONTROLE DE QUALIDADE DO PACOTE

- [ ] Cada versão começa com texto ou movimento no **frame 0**.
- [ ] Nenhuma emenda corta efeito, sílaba ou trilha de forma audível.
- [ ] 15 s ≤ 15,9 s · 30 s ≤ 30,9 s · 45 s ≤ 45,9 s.
- [ ] As camadas de hook não cobrem o rosto nem a legenda.
- [ ] Nome e OAB visíveis (se `MARCA.md` estiver anexado e o anúncio for de serviço jurídico).
- [ ] Textos sem promessa de resultado e sem números inventados.
- [ ] Nomes de arquivo no padrão e planilha preenchida com os nomes.

---

## 7. ANÚNCIO DE SERVIÇO JURÍDICO (atenção)

Se o anúncio divulga o **trabalho do advogado** (e não um produto), ele precisa ser **informativo** (Provimento 205/2021 da OAB): pode impulsionar conteúdo que explica um direito, mas sem promessa de resultado, sem menção a preço ou desconto de honorários e sem chamada direta para contratação. Nesse caso, use o CTA **"Salva pra lembrar"** ou **"Segue para mais conteúdos"**, e não "Saiba Mais" para um serviço. Na dúvida, o módulo deve alertar o usuário antes de exportar.

---

## 8. ENTREGA (formato da resposta)

1. Tabela com os arquivos gerados (nome, duração, hook, CTA).
2. Bloco de textos do anúncio (3 + 3 + 1).
3. A planilha CSV.
4. Uma recomendação de qual combinação subir primeiro e por quê.
