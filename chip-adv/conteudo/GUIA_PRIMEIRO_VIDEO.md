# Guia do primeiro vídeo

**Do computador preparado ao primeiro vídeo editado pelo CHIP ADV.**
Tempo total: cerca de 40 minutos na primeira vez. Depois, cada vídeo leva o tempo de você gravar e mandar.

---

## O que você precisa

| Item | Detalhe |
|---|---|
| Computador | Mac (Apple Silicon ou Intel) ou Windows 10/11, com 8 GB de RAM ou mais e 10 GB livres |
| Internet | Para instalar as ferramentas na primeira vez |
| Claude com plano pago | Pro ou Max, que incluem o **Claude Code**. A assinatura é paga direto para a Anthropic, em claude.ai |
| Os arquivos do CHIP ADV | `CHIP_ADV.md` e `MAPA_EFEITOS_CHIP_ADV.pdf`, que você recebeu no e-mail |
| Um vídeo gravado no celular | Vertical, de 20 a 90 segundos, com você falando |

---

## Passo 1 · Assine o Claude

1. Acesse **claude.ai** e crie sua conta (ou entre com a que já tem).
2. Clique em **Upgrade** e escolha o plano **Pro**. Ele já inclui o Claude Code.

---

## Passo 2 · Instale o Claude no computador

O jeito mais simples é o aplicativo:

1. Acesse **claude.ai/download** e baixe o app para Mac ou Windows.
2. Instale, abra e entre com a sua conta.
3. No app, abra a aba **Code**. É ali que o CHIP ADV trabalha.

> **Prefere o terminal?** No Mac, abra o Terminal e cole `curl -fsSL https://claude.ai/install.sh | bash`. No Windows, abra o PowerShell e cole `irm https://claude.ai/install.ps1 | iex`. Depois digite `claude` para começar.

---

## Passo 3 · Crie a pasta do CHIP ADV

1. Na sua área de trabalho, crie uma pasta chamada **CHIP ADV**.
2. Coloque dentro dela os arquivos `CHIP_ADV.md` e `MAPA_EFEITOS_CHIP_ADV.pdf`.
3. No Claude (aba Code), escolha essa pasta como a pasta de trabalho.

---

## Passo 4 · Deixe o Claude preparar o computador

Cole esta mensagem e envie:

> **Prepare este computador para o CHIP ADV. Verifique e instale o que faltar: Node.js (versão LTS), ffmpeg e Python 3. Depois me diga se está tudo pronto.**

O Claude vai pedir permissão para rodar alguns comandos. Leia e clique em **Permitir**. Isso acontece só na primeira vez.

**Se preferir instalar à mão:**

| | Mac | Windows |
|---|---|---|
| Node.js | nodejs.org → botão **LTS** | nodejs.org → botão **LTS** |
| ffmpeg | No Terminal: `brew install ffmpeg` (se não tiver o Homebrew, instale em brew.sh) | No PowerShell: `winget install Gyan.FFmpeg` |
| Python 3 | python.org/downloads | python.org/downloads (marque **Add to PATH**) |

---

## Passo 5 · Grave o vídeo

- **Celular na vertical**, na altura dos olhos, a um braço de distância.
- **Luz de frente**: janela atrás do celular, nunca atrás de você.
- **Áudio limpo**: microfone de lapela, ou fone com microfone perto da boca. Sem ar-condicionado ou ventilador barulhento.
- **Errou? Repita a frase inteira** sem parar a gravação. O CHIP ADV corta a pausa e fica com a melhor tomada.
- Fale **um pouco mais rápido** que numa conversa e olhe para a lente.
- Pode gravar o **gancho** e o **corpo** em arquivos separados. O CHIP ADV junta.

---

## Passo 6 · Passe o vídeo para o computador

Use **AirDrop** (iPhone → Mac), **cabo USB** ou **Google Drive**. Não mande pelo WhatsApp: ele comprime e o vídeo perde qualidade.

Coloque o vídeo dentro da pasta **CHIP ADV**.

---

## Passo 7 · Rode o CHIP ADV

No Claude (aba Code), arraste para a conversa o `CHIP_ADV.md`, o mapa e o seu vídeo. Escreva:

> **Roda o CHIP ADV.**

Se quiser direcionar, acrescente uma linha:

> `Objetivo: atrair clientes de Direito de Família · Tom: autoridade · CTA: link na bio`

O que acontece agora:

1. O Claude analisa o vídeo, transcreve a sua fala e corta pausas e erros.
2. Ele mostra uma **tabela com o roteiro de edição**: cada trecho, a função e o efeito escolhido.
3. Ele monta o projeto e renderiza. **Na primeira vez demora mais** (de 10 a 20 minutos), porque instala o editor. Nas próximas, é bem mais rápido.
4. O vídeo pronto aparece na pasta `out/`, dentro da pasta CHIP ADV.

---

## Passo 8 · Peça ajustes

Assista ao vídeo e peça o que quiser, em uma frase:

- "Deixa a legenda maior."
- "Troca o efeito do segundo 12 por capa de revista."
- "Põe a frase forte atrás de mim."
- "Faz uma versão de 15 segundos."
- "Usa a minha logo no final." (arraste a logo para a conversa)

O Claude refaz só o que você pediu.

---

## Problemas comuns

| Problema | O que fazer |
|---|---|
| "O vídeo do iPhone não abre" | É o formato HEVC. O CHIP ADV já converte; se travar, peça: "Converta meu vídeo para H.264 antes de editar." |
| Render muito lento | Feche outros programas. Em computador com 8 GB de RAM, peça: "Renderize com concorrência 2." |
| "Sem espaço no disco" | Libere pelo menos 10 GB. Apague a pasta `out/` de vídeos antigos que você já baixou. |
| A legenda saiu com palavra errada | Peça: "Corrija a palavra X para Y na legenda." |
| O Claude parou no meio | Escreva: "Continue de onde parou." |
| Pediu permissão para um comando | Leia o comando e clique em Permitir. São instalações e o próprio render. |

---

## Checklist do primeiro vídeo

- [ ] Plano Pro do Claude ativo
- [ ] App do Claude instalado, aba Code aberta
- [ ] Pasta CHIP ADV com `CHIP_ADV.md` e o mapa
- [ ] Node.js, ffmpeg e Python instalados
- [ ] Vídeo gravado na vertical e copiado para a pasta
- [ ] "Roda o CHIP ADV." enviado
- [ ] Vídeo pronto na pasta `out/`

---

**Lembrete ético:** o CHIP ADV edita o que você fala e não cria promessa na tela. O conteúdo continua sendo seu e de sua responsabilidade, de acordo com o Provimento 205/2021 da OAB.
