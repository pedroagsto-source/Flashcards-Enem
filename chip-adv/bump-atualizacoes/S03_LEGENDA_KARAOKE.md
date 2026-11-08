# CHIP ADV · Atualização semana 3 · Legenda karaokê em 3 cores

> **Para o Claude:** este arquivo é um complemento oficial do CHIP ADV e vale junto com o prompt mestre (`CHIP_ADV.md`). Ele acrescenta um **estilo alternativo de legenda** à seção 4. O estilo padrão continua sendo o do prompt mestre; use este só quando o usuário pedir "legenda karaokê" (ou o nome de uma das 3 cores).

## Como fica

A frase inteira (até 6 palavras) aparece de uma vez, em branco com 45% de opacidade, e **cada palavra "acende" na cor escolhida no exato momento em que é falada**, como no karaokê. Passa sensação de ritmo e prende a atenção de quem assiste sem som.

## As 3 cores

| Nome no pedido | Cor da palavra falada | Combina com |
|---|---|---|
| **karaokê verde** | `#D8FF3C` (a cor do CHIP ADV) | vídeos dinâmicos, anúncios |
| **karaokê dourado** | `#E8C26A` | escritório sóbrio, temas patrimoniais |
| **karaokê azul** | `#5BC8FF` | temas trabalhistas e previdenciários |

## Receita técnica

- Grupos de **4 a 6 palavras**, quebrando em pausa natural (vírgula, ponto, respiração ≥ 0,25 s).
- Fonte Inter 800, 70–80 px, caixa alta, contorno preto de 6 px + sombra `0 4px 18px rgba(0,0,0,.6)`.
- Palavra ainda não falada: branco 45%. Palavra falada: cor escolhida, 100%, escala 1.06 com spring rápido (damping 14). Palavra já falada: branco 100%.
- A troca de cor acontece no **frame de início da palavra** em `transcript.json` (adiante 1 frame para compensar a percepção).
- A palavra-chave da frase (número, verbo forte) ganha **sublinhado grosso** na cor escolhida, desenhando da esquerda para a direita em 6 frames.
- Posição e regras de ocultação: iguais às da seção 4 do prompt mestre.

## Pedido para testar

> "Edita esse vídeo com **legenda karaokê dourado**."
