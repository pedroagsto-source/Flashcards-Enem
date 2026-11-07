# Manual completo do CHIP ADV

**Tudo o que você precisa para editar seus vídeos com a sua IA, do zero, sem saber editar.**
Leia na ordem. Cada parte tem uma aula em vídeo com o mesmo número na área de membros.

---

## Parte 0 · Como funciona, em 30 segundos

1. Você grava um vídeo no celular, do jeito que sair.
2. Abre o **Claude** no computador e escreve **"Roda o CHIP ADV."**
3. O Claude assiste, corta as pausas e os erros, escreve a legenda, escolhe os efeitos e te mostra **o roteiro de edição** (storyboard).
4. Você aprova (ou pede mudanças) e ele entrega o vídeo pronto para postar.

O **CHIP ADV** é o "cérebro" que ensina o Claude a editar como um editor profissional. Você não precisa abrir nenhum programa de edição.

---

## Parte 1 · O que você precisa

| Item | Obrigatório? | Custo | Para quê |
|---|---|---|---|
| Computador Mac ou Windows (8 GB de RAM, 10 GB livres) | Sim | — | É nele que a edição acontece |
| Conta no **Claude**, plano **Pro** ou **Max** | Sim | A partir de US$ 20/mês, pago à Anthropic | O plano inclui o **Claude Code**, que é quem edita |
| **CHIP ADV** (este produto) | Sim | Já é seu | O método de edição |
| Celular para gravar | Sim | — | Grava o vídeo |
| Microfone de lapela | Recomendado | ~R$ 50 a 150 | Áudio limpo = vídeo profissional |
| Conta no **fal.ai** | Não (opcional) | Pago por uso | Só para o efeito futuro de "transformação por IA" |

**Você não precisa de nenhum conector ou extensão para editar.** O Claude Code já faz tudo no seu computador. As ferramentas de edição que ele usa (Remotion, ffmpeg, Python) são **gratuitas** e ele mesmo instala.

---

## Parte 2 · Instalando o Claude

### 2.1 Assine o plano
1. Acesse **claude.ai** e crie sua conta (pode entrar com o Google).
2. Clique em **Upgrade** e escolha **Pro**.

### 2.2 Instale o aplicativo
1. Acesse **claude.ai/download**.
2. Baixe a versão do seu computador (Mac ou Windows) e instale como qualquer programa.
3. Abra o app e entre com a sua conta.
4. No topo do app, clique na aba **Code**. **É sempre nessa aba que o CHIP ADV trabalha.**

> **Prefere o terminal?** Mac: abra o app Terminal e cole `curl -fsSL https://claude.ai/install.sh | bash`. Windows: abra o PowerShell e cole `irm https://claude.ai/install.ps1 | iex`. Depois digite `claude`.

---

## Parte 3 · Instalando o CHIP ADV (uma vez só)

### 3.1 Crie a sua pasta de vídeos
1. Na **Área de Trabalho**, crie uma pasta chamada **CHIP ADV**.
2. No Claude (aba **Code**), clique em **escolher pasta** e selecione essa pasta.

### 3.2 Instale a skill (o jeito mais fácil)
A skill faz o Claude "lembrar" do CHIP ADV para sempre. Depois de instalada, você não anexa mais nada: só escreve `/chip-adv` ou "Roda o CHIP ADV".

1. Baixe o arquivo **`skill-chip-adv.zip`** da área de membros e coloque na pasta **CHIP ADV**.
2. No Claude (aba Code), escreva:

> **Instale a skill que está no arquivo skill-chip-adv.zip desta pasta, na pasta de skills do Claude Code (~/.claude/skills). Depois me confirme.**

3. Feche e abra o app do Claude.
4. Teste: digite `/` na conversa. A opção **chip-adv** deve aparecer.

**Instalar à mão (se preferir):** descompacte o zip. A pasta `chip-adv` vai para:
- **Mac:** `~/.claude/skills/` → no Finder, aperte **Cmd + Shift + G**, cole `~/.claude/skills` e arraste a pasta para lá.
- **Windows:** no Explorador de Arquivos, cole `%USERPROFILE%\.claude\skills` na barra de endereço e arraste a pasta para lá.

> **Sem skill também funciona:** em vez de `/chip-adv`, arraste para a conversa o `CHIP_ADV.md` e o mapa de efeitos, junto com o vídeo, e escreva "Roda o CHIP ADV."

### 3.3 Prepare o computador
Na primeira conversa, escreva:

> **Prepare este computador para o CHIP ADV: verifique e instale o que faltar (Node.js LTS, ffmpeg e Python 3). Depois me diga se está tudo pronto.**

O Claude vai pedir **permissão** para rodar alguns comandos. Leia e clique em **Permitir**. Isso acontece só na primeira vez.

| Se preferir instalar à mão | Mac | Windows |
|---|---|---|
| Node.js | nodejs.org → botão **LTS** | nodejs.org → botão **LTS** |
| ffmpeg | Terminal: `brew install ffmpeg` (Homebrew em brew.sh) | PowerShell: `winget install Gyan.FFmpeg` |
| Python 3 | python.org/downloads | python.org/downloads (marque **Add to PATH**) |

---

## Parte 4 · Gravando do jeito certo

- **Celular na vertical**, na altura dos olhos, a um braço de distância.
- **Luz de frente:** janela atrás do celular, nunca atrás de você.
- **Áudio:** microfone de lapela, longe de ar-condicionado e ventilador.
- **Errou? Repita a frase inteira** sem parar a gravação. O CHIP ADV corta o erro e fica com a melhor tomada.
- Fale **um pouco mais rápido** que numa conversa, olhando para a lente.
- **Gancho e corpo separados** funcionam muito bem: grave a primeira frase 3 vezes de jeitos diferentes, depois o resto.
- Duração ideal: **20 a 90 segundos**.
- **Passe o vídeo** para a pasta CHIP ADV por AirDrop, cabo ou Google Drive. **Não use WhatsApp**: ele comprime e piora a qualidade.

---

## Parte 5 · Sua primeira edição

1. Coloque o vídeo dentro da pasta **CHIP ADV**.
2. No Claude (aba Code), escreva:

> **/chip-adv**

ou

> **Roda o CHIP ADV.**

3. Se quiser direcionar, acrescente uma linha:

> `Objetivo: explicar pensão alimentícia · Tom: acolhedor · CTA: me segue para mais`

**O que acontece agora:**

| Etapa | O que o Claude faz | O que você faz |
|---|---|---|
| 1 | Analisa e converte o vídeo | Espera |
| 2 | Transcreve palavra por palavra | Espera |
| 3 | Corta pausas, "é…", "né" e repetições | Espera |
| 4 | Mostra o **roteiro de edição** (tabela com cada trecho, função e efeito) | **Lê e aprova**, ou pede mudanças |
| 5 a 8 | Monta os efeitos, a legenda, a trilha e renderiza | Espera |
| Fim | Entrega o vídeo na pasta `out/` | Assiste e pede ajustes |

**Na primeira vez demora mais** (10 a 20 minutos), porque o Claude instala o editor. Nas próximas, é bem mais rápido.

---

## Parte 6 · Como ler e aprovar o roteiro de edição (storyboard)

O Claude mostra uma tabela assim antes de editar:

| # | Tempo | Fala (resumo) | Função | Efeito | Por quê |
|---|---|---|---|---|---|
| 1 | 0–2 s | "Advogado, você ainda…" | Gancho | 05 Zoom de impacto | Prende nos 2 primeiros segundos |
| 2 | 2–6 s | "Usando um único arquivo…" | Virada | 03 Janela da IA | Mostra o processo |

**Como responder:**
- Gostou? Escreva **"ok, pode renderizar"**.
- Quer mudar? Escreva em uma frase: **"na linha 2, usa a capa de revista"** ou **"tira o efeito da linha 4"**.

---

## Parte 7 · Pedindo ajustes (cola de pedidos)

Depois do vídeo pronto, peça em português normal. Exemplos que funcionam:

| Quero… | Escreva |
|---|---|
| Legenda maior | "Deixa a legenda maior." |
| Trocar um efeito | "Troca o efeito do segundo 12 por capa de revista." |
| Tirar um efeito | "Tira o rabisco do segundo 20." |
| Mudar o clima | "Deixa a cor mais sóbria, mais fria." |
| Versão curta | "Faz uma versão de 15 segundos." |
| Mudar a música | "Põe uma trilha mais calma." |
| Mudar o fim | "Termina com 'me segue para mais'." |
| Usar sua logo | Arraste a logo para a conversa: "Usa essa logo no final." |
| Corrigir legenda | "Corrige a palavra 'peção' para 'pensão' na legenda." |
| Recomeçar um trecho | "Refaz só os primeiros 5 segundos com um gancho mais forte." |

O Claude refaz só o que você pediu.

---

## Parte 8 · O mapa de efeitos

O mapa (PDF) mostra os **17 efeitos** com imagem e o pedido pronto de cada um. Use assim:
1. Abra o mapa e escolha o efeito pela imagem.
2. Copie o pedido e cole na conversa, dizendo onde: **"no momento em que eu falo 'prazo', põe o relógio de horas"**.

**Regra de ouro:** 1 efeito forte a cada 6 a 10 segundos. Efeito demais vira poluição. Se você não pedir nada, o CHIP ADV escolhe sozinho pela sua fala.

---

## Parte 9 · Identidade do escritório (Kit Identidade · CHIP ADV PRO)

1. Abra o arquivo `MARCA.md` e preencha: nome na tela, escritório, OAB, áreas, cores (ou escolha um dos 8 estilos do catálogo).
2. Coloque o `MARCA.md` na pasta CHIP ADV.
3. Pronto: todo vídeo sai com a sua identidade (nome, OAB, cores e fonte).

---

## Parte 10 · Modo anúncio (Módulo Anúncios · CHIP ADV PRO)

1. Coloque o `CHIP_ADV_ANUNCIOS.md` na pasta CHIP ADV.
2. Grave o gancho 3 a 5 vezes de jeitos diferentes e o corpo uma vez.
3. Escreva: **"Roda o CHIP ADV no modo anúncio."**
4. Você recebe versões de **15, 30 e 45 segundos**, **5 ganchos** diferentes, os **textos do anúncio** e uma **planilha** para nomear e testar.

---

## Parte 11 · Problemas comuns

| Problema | Solução |
|---|---|
| `/chip-adv` não aparece | Feche e abra o app. Confira se a pasta `chip-adv` está em `~/.claude/skills` (Parte 3.2). |
| "O vídeo do iPhone não abre" | É o formato HEVC. Peça: "Converte meu vídeo para H.264 antes de editar." |
| Render muito lento | Feche outros programas. Peça: "Renderiza com concorrência 2." |
| "Sem espaço no disco" | Libere 10 GB. Apague vídeos antigos da pasta `out/` que você já baixou. |
| Palavra errada na legenda | "Corrige a palavra X para Y na legenda." |
| O Claude parou no meio | Escreva: "Continua de onde parou." |
| Pediu permissão para um comando | Leia e clique em Permitir. São instalações e o render. |
| Atingiu o limite de uso do plano | Espere o limite renovar (o app avisa o horário) ou use o plano Max. |
| Nada disso resolveu | Copie a mensagem de erro e escreva: "Deu esse erro, resolve pra mim." |

---

## Parte 12 · Perguntas frequentes

**Meus vídeos vão para a internet?** Os arquivos ficam no seu computador. Para decidir os cortes, o Claude lê a transcrição e alguns quadros pela sua conta, como em qualquer conversa.

**Funciona no celular?** Você grava no celular; a edição é no computador.

**Funciona com o ChatGPT?** O CHIP ADV foi feito e testado para o **Claude Code**, que é quem consegue instalar o editor e renderizar no seu computador.

**Posso usar para clientes do escritório?** Sim, o uso é seu. Só não é permitido revender ou compartilhar os arquivos.

**Respeita a OAB?** A edição segue tom informativo e não cria promessas na tela. O conteúdo continua sendo seu e de sua responsabilidade (Provimento 205/2021). Com o `MARCA.md`, seu nome e sua OAB entram em todo vídeo.

---

## Glossário rápido

- **Claude Code:** a parte do Claude que trabalha no seu computador (aba Code).
- **Skill:** um "pacote de conhecimento" instalado no Claude. A do CHIP ADV ensina a editar.
- **Storyboard / roteiro de edição:** a tabela que o Claude mostra antes de editar.
- **Render / renderizar:** gerar o arquivo final do vídeo.
- **Remotion e ffmpeg:** os programas gratuitos que o Claude usa para montar e exportar o vídeo. Você não precisa abrir nenhum dos dois.
