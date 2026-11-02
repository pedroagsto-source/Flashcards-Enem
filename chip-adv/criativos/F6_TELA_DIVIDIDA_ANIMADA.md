# F6 · Tela dividida animada: "Sem CHIP ADV × Com CHIP ADV"

**Formato:** vertical 1080×1920, desenho animado 2D (traço limpo, cores chapadas), tela dividida ao meio.
**Duração:** 24 s · **Ângulo:** dor × alívio · **CTA:** Saiba Mais
**Personagem:** o mesmo advogado nas duas metades (terno, gravata afrouxada em cima e arrumada embaixo), para o contraste ficar óbvio.

## Layout fixo

```
┌──────────────────────────┐
│ SEM CHIP ADV  😩          │  ← metade de cima: tons frios/acinzentados, luz de monitor
│ (caos da edição)          │
├────────── faixa ──────────┤  ← faixa do meio com o texto da cena (y 900–1020)
│ COM CHIP ADV  😌          │  ← metade de baixo: tons quentes, luz de fim de tarde
│ (tranquilidade)           │
└──────────────────────────┘
```

- Etiquetas fixas no canto de cada metade: **"SEM CHIP ADV"** (vermelho) e **"COM CHIP ADV"** (verde-limão).
- A faixa do meio carrega o texto principal de cada cena e a legenda da narração.
- Nada importante nos 220 px de cima nem nos 380 px de baixo (interface do Reels).

## Roteiro

| Tempo | Metade de CIMA (sem CHIP ADV) | Metade de BAIXO (com CHIP ADV) | Narração (voz em off) | Texto na faixa |
|---|---|---|---|---|
| **0–3 s** | 23h47 no relógio. Advogado na frente do computador, olheiras, **bate a testa no teclado**: "TUM". O monitor mostra uma linha do tempo cheia de faixas coloridas | O mesmo advogado, camisa arrumada, toma um café e sorri para o celular | "Advogado, qual dos dois é você?" | **QUAL DOS DOIS É VOCÊ?** |
| **3–7 s** | Ele arrasta clipes na linha do tempo; aparece um aviso vermelho **"Renderização falhou (87%)"**. Ele puxa o cabelo | Ele arrasta um arquivo `CHIP_ADV.md` para a conversa com a IA e escreve **"edita pra mim"** | "Um passa a noite cortando pausa, legenda e efeito na mão…" | **3 HORAS × 1 FRASE** |
| **7–11 s** | Abas e janelas se multiplicando: tutorial do YouTube, "como fazer legenda animada", "plugin pago". Ele **bate a cabeça de novo** na mesa: "TUM" (o monitor treme) | Barra de progresso enchendo sozinha enquanto ele responde um cliente no WhatsApp (sem mostrar a conversa) | "…o outro escreve uma frase e vai cuidar do escritório." | **ELA EDITA. VOCÊ ADVOGA.** |
| **11–15 s** | Sol nascendo na janela. Ele, despenteado, assiste ao vídeo pronto: legenda torta, corte seco errado. Suspira | Notificação: **"Seu vídeo está pronto ✓"**. O vídeo aparece no celular: cortado, legendado, com efeito. Ele faz 👍 | "Volta pronto: cortado, legendado, com efeito e trilha." | **PRONTO EM MINUTOS** |
| **15–19 s** | O advogado de cima **olha pra baixo** (quebra a divisória com a cabeça) e vê o outro tranquilo. Cara de "como assim?" | O de baixo olha pra cima, dá de ombros e mostra o arquivo `CHIP_ADV.md` | "E se não gostar? Ele pede o ajuste em português." | **"DEIXA A LEGENDA MAIOR" → FEITO ✓** |
| **19–24 s** | A metade de cima **escurece e desliza pra fora**; a de baixo ocupa a tela inteira | Tela cheia: o advogado posta o vídeo e guarda o celular. Logo **CHIP ADV** + botão **"Saiba mais"** com cursor clicando | "Seja o de baixo. Toca em Saiba Mais." | **SEJA O DE BAIXO.** · botão Saiba mais |

### Ganchos alternativos (rodada 2)
- **Texto:** "POV: você editando o próprio Reels às 23h47" (só a metade de cima nos primeiros 2 s, a de baixo entra com um "corta").
- **Pergunta:** "Quantas noites você já perdeu editando vídeo?"
- **Som:** começa com o "TUM" da cabeça na mesa e a tela tremendo, sem fala no primeiro segundo.

## Som
- **Cima:** trilha tensa e repetitiva (relógio, teclado batendo); **"TUM"** grave a cada cabeçada; buzina de erro na renderização.
- **Baixo:** trilha leve e quente (violão ou lo-fi); "pop" quando o arquivo entra; "ding" de notificação.
- As duas trilhas tocam juntas baixas; a de cima some no segundo 19, quando a metade de cima sai.
- Narração calma, sem pressa: o tom de quem já resolveu o problema.

## Regras
- O advogado é um personagem genérico, sem nome nem OAB, e o anúncio vende uma ferramenta, não serviço jurídico.
- Não mostrar conversa real com cliente nem dados de processo.
- Sem marcas de editores reais na tela (nada de logo de CapCut, Premiere etc.): use uma interface genérica.

## Como produzir

**Caminho A · Remotion (eu faço aqui):** personagem vetorial 2D (SVG) animado quadro a quadro, no mesmo projeto do CHIP ADV, com trilha e efeitos sonoros sincronizados. Tem cara de motion design limpo, não de desenho de TV. Precisa só da narração: grave o texto da coluna "Narração" (≈ 20 s) ou use uma voz gerada.

**Caminho B · IA de vídeo (Kling, Runway, Veo ou similar):** gere as 12 cenas (6 de cima + 6 de baixo) separadas, com o mesmo prompt de personagem, e eu monto a tela dividida, os textos, a narração e o som. Prompt base do personagem:
> 2D flat cartoon, Brazilian male lawyer in his 30s, short dark hair, short beard, white shirt and navy suit, clean vector style, soft shadows, vertical 9:16, [cena]
> Cena de cima (exemplo): "tired at a desk at night, bangs his forehead on the keyboard, messy video-editing timeline on the monitor, cold blue light, comedic"
> Cena de baixo (exemplo): "relaxed at a sunny desk, sipping coffee, smiling at a phone, warm afternoon light"

## Texto do anúncio
- **Texto principal:** "Advogado, editar vídeo não precisa custar a sua noite. Com o CHIP ADV você anexa um arquivo na sua IA, escreve 'edita pra mim' e recebe o vídeo cortado, legendado e com efeitos."
- **Título:** `Ela edita. Você advoga.`
- **Nome do anúncio:** `CHIPADV_F6_teladividida_animado_v1`
