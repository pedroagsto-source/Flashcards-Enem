# CHIP ADV · Atualização semana 4 · Modo Stories

> **Para o Claude:** este arquivo é um complemento oficial do CHIP ADV e vale junto com o prompt mestre (`CHIP_ADV.md`). Ele acrescenta um **formato de saída**. Quando o usuário pedir "modo Stories", depois do render final normal (etapa 8), gere também as partes para Stories descritas abaixo.

## O que faz

Pega o vídeo editado e entrega **partes de até 15 segundos**, prontas para postar em sequência nos Stories, cada uma com barra de progresso e indicação "1/4, 2/4…". Quem está assistindo não perde o fio, e você reaproveita o mesmo vídeo em dois lugares.

## Regras de corte

1. Corte **somente em fim de frase** (pausa ≥ 0,3 s em `transcript.json`), o mais perto possível de 15 s, nunca acima de 15 s.
2. Se uma frase sozinha passar de 15 s, corte na maior pausa interna dela.
3. **Nunca corte no meio de um efeito.** Se um efeito atravessar o limite, a parte termina antes dele começar.
4. Cada parte começa com 6 frames de fade-in do áudio e termina com 6 frames de fade-out.

## Elementos visuais em cada parte

- **Barra de progresso** no topo (y = 120 px, para não ficar atrás da interface do Instagram): 4 px de altura, fundo branco 30%, preenchimento `accent` crescendo do início ao fim da parte.
- **Contador** "1/4" no canto superior direito, Inter 800 34 px, branco com sombra.
- Na **última parte**, mantenha o CTA do vídeo; nas outras, nos 20 frames finais, mostre a etiqueta "continua ▸" (cápsula `accent`, texto escuro).
- Área segura: nada importante nos 250 px de cima nem nos 340 px de baixo.

## Entrega

Arquivos `out/stories/parte-1.mp4`, `parte-2.mp4`… na mesma resolução do vídeo final (1080×1920), mais uma linha no resumo de entrega listando as partes e a duração de cada uma.

## Pedido para testar

> "Edita esse vídeo e depois gera também o **modo Stories**."
