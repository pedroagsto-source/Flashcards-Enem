# CHIP ADV · Atualização semana 1 · Efeito 18 · Linha do tempo do processo

> **Para o Claude:** este arquivo é um complemento oficial do CHIP ADV. Ele vale **junto** com o prompt mestre (`CHIP_ADV.md`): siga todas as regras do prompt mestre e acrescente o efeito abaixo ao cardápio de efeitos (seção 6), com o número **18**. Ele também pode ser sugerido no roteiro de edição (etapa 4).

## Quando usar

Sempre que o advogado explicar **etapas em sequência**: "primeiro… depois… por último", "o processo funciona assim", fases de um inventário, de um divórcio, de uma ação trabalhista, de um pedido de aposentadoria. Também combina com prazos ("em 30 dias", "depois de 2 anos").

No roteiro de edição, sugira o efeito 18 quando a fala tiver **3 a 6 etapas** ditas em até 20 segundos.

## Receita técnica

| Nº | Efeito | Receita técnica |
|---|---|---|
| 18 | **Linha do tempo do processo** | Linha vertical fina (4 px, `accent` com 60% de opacidade) do lado esquerdo da tela (x ≈ 90 px), do topo até ~70% da altura, desenhando-se de cima para baixo (`scaleY 0 → 1`, 12 frames). Cada etapa é um marcador (círculo 26 px, borda `accent`) + cartão de vidro fosco à direita (`backdrop-filter: blur(20px)`, fundo `rgba(255,255,255,.10)`, cantos 18 px, Inter 800 40–46 px, branco), com número da etapa em `accent` ("1", "2", "3"…). **Cada etapa entra no frame exato da palavra que a anuncia** (vem de `transcript.json`): o círculo enche com spring, o cartão desliza 40 px da esquerda com fade, e um *pop* toca. A etapa falada no momento fica 100% e as anteriores caem para 55% de opacidade. Se houver prazo, ele aparece como etiqueta pequena embaixo do cartão (ex.: "até 30 dias"). Ao fim da última etapa, um ✓ verde sobe no fim da linha e tudo some com fade de 8 frames. |

## Regras de uso

- **Máximo 6 etapas** na tela. Se a fala tiver mais, agrupe ("Etapas 1 a 3: documentação").
- Texto de cada cartão com **até 4 palavras** ("Petição inicial", "Audiência", "Sentença"). Resuma a fala; não transcreva.
- Mantenha a pessoa visível: a linha ocupa no máximo 45% da largura. Se o rosto estiver à esquerda, espelhe o efeito para a direita.
- **Esconda a legenda** enquanto o efeito estiver na tela (o texto dos cartões já cumpre o papel).
- Som: *whoosh* curto quando a linha começa a se desenhar, *pop* em cada etapa e brilho suave no ✓ final.

## Componente

Crie `src/effects/E18LinhaDoTempo.tsx`, recebendo a lista de etapas: `{ texto: string; frame: number; prazo?: string }[]`.

## Pedido para testar

> "Edita esse vídeo e, na parte em que eu explico as etapas do processo, usa o **efeito 18 · Linha do tempo**."
