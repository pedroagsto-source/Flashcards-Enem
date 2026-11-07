# Roteiro das aulas · CHIP ADV (para você gravar)

**Formato:** gravação de tela do computador + sua câmera no canto (ou só tela com a sua voz). Use o **OBS Studio** (grátis) ou o gravador nativo (Mac: Cmd+Shift+5 · Windows: Win+Alt+R no Xbox Game Bar).
**Tom:** simples, como se estivesse ensinando um colega de escritório. Sem jargão. Mostre **cada clique**.
**Regra:** cada aula termina com o aluno tendo feito algo concreto. Aula curta = aula assistida.

| Aula | Título | Duração | No final o aluno… |
|---|---|---|---|
| 0 | Boas-vindas: o que você vai conseguir | 2 min | Sabe o caminho inteiro |
| 1 | O que você precisa | 3 min | Tem a lista do que providenciar |
| 2 | Instalando o Claude | 5 min | Está com o app aberto na aba Code |
| 3 | Instalando o CHIP ADV (skill) | 5 min | Vê o `/chip-adv` aparecer |
| 4 | Preparando o computador | 4 min | Tem Node, ffmpeg e Python instalados |
| 5 | Gravando do jeito certo | 5 min | Sabe gravar para a IA editar bem |
| 6 | Primeira edição, ao vivo | 12 min | Tem o primeiro vídeo pronto |
| 7 | Aprovando o roteiro e pedindo ajustes | 6 min | Sabe mudar qualquer coisa |
| 8 | Usando o mapa de efeitos | 5 min | Escolhe efeitos pelo pedido |
| 9 | Problemas comuns | 4 min | Resolve sozinho os erros mais comuns |
| PRO 1 | Identidade do escritório (MARCA.md) | 5 min | Vídeos com nome, OAB e cores |
| PRO 2 | Modo anúncio | 8 min | Tem um pacote de criativos para testar |

---

## Aula 0 · Boas-vindas (2 min)
**Na tela:** você na câmera, depois um antes × depois de um vídeo seu (bruto → editado).
**Fala sugerida:**
> "Seja bem-vindo ao CHIP ADV. Daqui a pouco, você vai gravar um vídeo no celular, escrever uma frase no computador e receber esse vídeo editado assim (mostra o editado). Sem abrir programa de edição. São poucas aulas curtas: assista na ordem e faça junto. Se travar em qualquer passo, a aula 9 resolve os erros mais comuns."

## Aula 1 · O que você precisa (3 min)
**Na tela:** a tabela da Parte 1 do manual.
**Pontos obrigatórios:**
- Computador Mac ou Windows. "O celular grava, o computador edita."
- Claude **Pro** (US$ 20/mês, pago à Anthropic). "É o plano que tem o Claude Code, que é quem edita."
- **Não precisa de conector, extensão nem programa pago.** O Claude instala sozinho as ferramentas gratuitas.
- Microfone de lapela: recomendado.

## Aula 2 · Instalando o Claude (5 min)
**Na tela (grave fazendo de verdade):**
1. claude.ai → criar conta → **Upgrade** → **Pro**.
2. claude.ai/download → baixar → instalar → abrir → entrar.
3. Mostrar a aba **Code**. "Guarde isso: é sempre nessa aba."
**Dica:** grave no Mac e mostre rapidamente o mesmo no Windows (ou diga "no Windows é igual, só muda o instalador").

## Aula 3 · Instalando o CHIP ADV (5 min)
**Na tela:**
1. Criar a pasta **CHIP ADV** na Área de Trabalho.
2. Baixar `skill-chip-adv.zip` da área de membros e soltar na pasta.
3. No Claude (Code), escolher a pasta e colar o pedido:
   > "Instale a skill que está no arquivo skill-chip-adv.zip desta pasta, na pasta de skills do Claude Code (~/.claude/skills). Depois me confirme."
4. Clicar em **Permitir** quando ele pedir.
5. Fechar e abrir o app, digitar `/` e mostrar **chip-adv** aparecendo.
**Fala:** "Pronto. A partir de agora o Claude sabe editar do jeito do CHIP ADV. Você não precisa anexar mais nada."

## Aula 4 · Preparando o computador (4 min)
**Na tela:** colar o pedido "Prepare este computador para o CHIP ADV…" e clicar em **Permitir** nas instalações.
**Fala:** "Ele vai instalar três programas gratuitos que ele usa por trás: você não vai precisar abrir nenhum deles. Isso é só na primeira vez."
**Mostre:** a resposta final do Claude dizendo que está tudo pronto.

## Aula 5 · Gravando do jeito certo (5 min)
**Na tela:** você gravando com o celular (mostre o tripé, a luz, a lapela).
**Pontos:** vertical, altura dos olhos, luz de frente, lapela, "errou? repete a frase inteira", gancho gravado 3 vezes, 20 a 90 segundos, passar por AirDrop/cabo/Drive (nunca WhatsApp).
**Mostre um erro de propósito** e diga: "Errei? Repito. A IA corta."

## Aula 6 · Primeira edição, ao vivo (12 min) ← a aula mais importante
**Na tela (sem cortes longos, mas pode acelerar a espera):**
1. Vídeo na pasta CHIP ADV.
2. Digitar `/chip-adv` (ou "Roda o CHIP ADV.").
3. Mostrar o Claude transcrevendo e cortando (acelere 4x).
4. **Parar no storyboard** e ler a tabela em voz alta: "Olha, ele explica cada trecho, qual efeito e por quê."
5. Responder "ok, pode renderizar".
6. Abrir o vídeo pronto na pasta `out/` e assistir inteiro.
**Fala de fechamento:** "Esse foi o primeiro. A partir do segundo, é bem mais rápido."

## Aula 7 · Aprovando o roteiro e pedindo ajustes (6 min)
**Na tela:** pedir 3 ajustes ao vivo: "Deixa a legenda maior", "Troca o efeito do segundo X por capa de revista", "Faz uma versão de 15 segundos".
**Mostre** o antes e o depois de cada ajuste e aponte a cola de pedidos (PDF).

## Aula 8 · Usando o mapa de efeitos (5 min)
**Na tela:** abrir o PDF do mapa, escolher 2 efeitos pela imagem, copiar o pedido e dizer onde usar ("quando eu falo 'prazo', põe o relógio de horas").
**Regra de ouro:** 1 efeito forte a cada 6 a 10 segundos.

## Aula 9 · Problemas comuns (4 min)
**Na tela:** a tabela da Parte 11 do manual. Mostre na prática pelo menos: vídeo HEVC do iPhone, pedido de permissão e "Continua de onde parou".
**Fala:** "Se der qualquer erro, copie a mensagem e escreva: 'deu esse erro, resolve pra mim'. Na maioria das vezes ele resolve sozinho."

## Aula PRO 1 · Identidade do escritório (5 min)
Preencher o `MARCA.md` ao vivo (nome, OAB, áreas, cores ou estilo do catálogo), colocar na pasta e rodar um vídeo mostrando o nome e a OAB entrando.

## Aula PRO 2 · Modo anúncio (8 min)
Gravar 3 ganchos + 1 corpo, colocar o `CHIP_ADV_ANUNCIOS.md` na pasta, escrever "Roda o CHIP ADV no modo anúncio", mostrar as versões de 15/30/45 s, os 5 ganchos, os textos e a planilha.

---

## Checklist de gravação das aulas
- [ ] Computador "limpo" (área de trabalho organizada, notificações desligadas)
- [ ] Fonte do sistema grande (aumente o zoom da tela para quem assiste no celular)
- [ ] Um vídeo bruto seu já gravado para usar nas aulas 6 a 8
- [ ] Conta do Claude Pro ativa e a skill **ainda não instalada** (para mostrar a instalação de verdade na aula 3)
- [ ] Gravar as esperas inteiras e acelerar na edição (ou cortar)
