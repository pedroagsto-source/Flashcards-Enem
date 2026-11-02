# Checkout CHIP ADV na Hubla

Baseado nos prints do checkout do EDIT.IA PRO (`pay.hub.la`). A estrutura é a dele; os textos, as imagens e os produtos são nossos.

---

## 1. Como é o checkout dele (de cima pra baixo)

| # | Bloco | O que ele fez | Por que funciona |
|---|---|---|---|
| 1 | **Banner do topo** (imagem larga, fundo escuro) | Slogan + "R$ 97 ou 12x de R$ 10,04" + "Garantia de 7 dias" | Repete a promessa, o preço e a garantia da página: a pessoa sente que está no lugar certo |
| 2 | **Resumo do produto** | Miniatura + "EDIT IA PRO" + **"12x R$ 10,04"** em destaque (não o R$ 97) + cupom + alterar moeda | Mostra a parcela, que parece menor que o preço cheio |
| 3 | **Informações pessoais** | Só e-mail, telefone e nome | Menos campos, menos abandono |
| 4 | **Pagamento** | Cartão (padrão) e Pix lado a lado, bandeiras visíveis | Cartão vem marcado: facilita o parcelado |
| 5 | **4 order bumps**, depois dos dados do cartão | Faixa vermelha com "↓", caixa "Sim, quero … por R$ X", selo verde, descrição curta e cartão com ícone + parcela | Aparecem logo antes do botão, quando a decisão já foi tomada |
| 6 | **Parcelamento** | Já vem em **12x** | O total com bumps vira parcela pequena |
| 7 | **Botão "Pagar"** + "Transação Segura e Criptografada" | Preto, largura total | |
| 8 | **Selo de garantia** abaixo do rodapé | Imagem redonda "7 dias · dinheiro de volta" + "Não instalou ou não gostou? Você recebe tudo de volta." | Último reforço de segurança |

### Os 4 order bumps dele, na ordem

| Ordem | Faixa | Caixa | Selo | Preço | Tipo de bump |
|---|---|---|---|---|---|
| 1 | Quero o Chip Editor atualizado toda semana | Sim, quero as atualizações por R$ 47 | Novidade | R$ 47 (12x R$ 4,87) | **Continuidade:** 12 meses de melhorias semanais |
| 2 | Carrossel que se mexe, feito pela sua IA | Sim, quero o CARROSSEL PRO por R$ 37 | Novidade | R$ 37 (12x R$ 3,83) | **Produto vizinho:** a mesma lógica aplicada a carrossel |
| 3 | Suporte individual no WhatsApp | Sim, quero suporte individual por R$ 37 | Recomendado | R$ 37 | **Serviço:** ajuda pessoal nos primeiros vídeos |
| 4 | Acesso vitalício ao EDIT IA PRO | Sim, quero acesso vitalício por R$ 37 | Preço Especial | R$ 37 | **Extensão:** o principal vale 1 ano; o bump tira o limite |

**O que aprender:**
- Um bump de cada **tipo** (continuidade, produto, serviço, acesso). Cada um responde a uma objeção diferente.
- **O mais caro primeiro** (R$ 47), depois três de R$ 37. Todos abaixo de 50% do principal.
- **Bump de vitalício só existe porque o principal tem prazo** (1 ano). Ele avisa isso na página e no FAQ.
- A caixa sempre repete o preço: "Sim, quero … **por R$ 37**". O cartão mostra a **parcela** (12x R$ 3,83).
- Selo verde em todos, com palavras curtas: Novidade, Recomendado, Preço Especial.
- Os juros do parcelamento ficam com o comprador (R$ 37 vira 12x R$ 3,83 = R$ 45,96).

---

## 2. Nosso checkout: o que configurar

### Produto principal
- **Nome:** CHIP ADV
- **Preço:** R$ 97 · até 12x (juros por conta do comprador, como o dele) · Cartão e Pix
- **Acesso:** 1 ano (necessário para o bump de vitalício). Já atualizei a landing para dizer isso.
- **Garantia:** 7 dias
- **Imagem do produto:** `imagens/produto.png`
- **Banner do topo:** `imagens/banner.png` ("Você fala. O CHIP ADV edita." · R$ 97 ou 12x de R$ 10,04 · Garantia de 7 dias)
- **Selo de garantia:** `imagens/selo-garantia.png` + texto: "Não funcionou no seu computador ou não gostou? Você recebe tudo de volta."
- **Parcelamento padrão:** 12x · **Pagamento padrão:** Cartão
- **Campos:** e-mail, telefone e nome (sem campos extras)

### Os 4 order bumps (mesma estrutura e ordem dele)

**Bump 1 · Continuidade**
- Faixa: `Quero o CHIP ADV atualizado toda semana`
- Caixa: `Sim, quero as atualizações por R$ 47`
- Selo: `Novidade`
- Descrição: `Toda semana, durante 12 meses, o CHIP ADV ganha uma melhoria: um efeito novo, um pedido pronto ou um ajuste no corte, na legenda e nas animações. Você baixa a versão nova na área de membros e anexa na conversa.`
- Produto: `CHIP ADV Sempre Atualizado` · R$ 47 · imagem `imagens/bump-atualizado.png`
- ⚠️ É um compromisso de **52 entregas**. Só ative se tiver o calendário de atualizações pronto (podemos montar).

**Bump 2 · Produto vizinho** (no lugar do Carrossel PRO dele, usando o que já temos pronto)
- Faixa: `40 roteiros prontos pra gravar`
- Caixa: `Sim, quero os roteiros por R$ 37`
- Selo: `Pronto pra usar`
- Descrição: `5 roteiros por área do Direito (Família, Trabalhista, Previdenciário, Consumidor, Imobiliário, Criminal, Tributário e Empresarial), com gancho, texto e o efeito certo do CHIP ADV. Linguagem informativa, dentro do Provimento 205 da OAB.`
- Produto: `Roteiros Prontos para Advogados` · R$ 37 · imagem `imagens/bump-roteiros.png`
- Entregável: `bump1-roteiros/ROTEIROS_PRONTOS_ADVOGADOS.pdf` ✅

**Bump 3 · Serviço**
- Faixa: `Suporte individual no WhatsApp`
- Caixa: `Sim, quero suporte individual por R$ 37`
- Selo: `Recomendado`
- Descrição: `Quer ajuda com os primeiros vídeos? Durante 30 dias, tire suas dúvidas comigo no WhatsApp: instalação, primeiro vídeo e ajustes.`
- Produto: `Suporte Individual no WhatsApp` · R$ 37 · imagem `imagens/bump-suporte.png`
- ⚠️ Definimos **30 dias** de prazo para o serviço ter fim. Precisa de um número de WhatsApp dedicado e de alguém para responder.

**Bump 4 · Extensão de acesso**
- Faixa: `Acesso vitalício ao CHIP ADV`
- Caixa: `Sim, quero acesso vitalício por R$ 37`
- Selo: `Preço especial`
- Descrição: `Seu acesso é de 1 ano. Com o vitalício, o CHIP ADV e a área de membros ficam com você pra sempre, sem renovar.`
- Produto: `Acesso Vitalício CHIP ADV` · R$ 37 · imagem `imagens/bump-vitalicio.png`
- ⚠️ Na Hubla, quem compra o bump precisa ter o acesso estendido (configure o produto do bump para liberar o acesso sem prazo).

**Cor da faixa dos bumps:** ele usa vermelho com texto branco. Nossa cor de destaque (limão) não funciona com texto branco; use **vermelho** como ele ou **preto (#0B0B0F)**, e teste.

---

## 3. Upsell e downsell (atualizado)

Os bumps passaram a seguir os 4 tipos do concorrente. O **Kit Identidade** e o **Módulo Anúncios**, que já estão prontos, vão para a página depois da compra:

| Etapa | Oferta | Preço | Conteúdo |
|---|---|---|---|
| **Upsell** | CHIP ADV PRO | R$ 97 (ou 12x) | Módulo Anúncios (1 vídeo → 15/30/45 s + 5 hooks) + Kit Identidade do Escritório (MARCA.md + 8 estilos) |
| **Downsell** (se recusar) | Módulo Anúncios | R$ 47 | Só o módulo de anúncios |

Isso substitui o plano anterior de upsell ("CHIP ADV Cortes", que ainda não existe). Confirme se o seu plano da Hubla tem **compra com 1 clique** no upsell.

---

## 4. Simulação de ticket médio (hipótese, ajuste com dados reais)

| Item | Adesão (suposta) | Valor | Por venda |
|---|---|---|---|
| Principal | 100% | R$ 97 | R$ 97,00 |
| Bump 1 · Atualizações | 15% | R$ 47 | R$ 7,05 |
| Bump 2 · Roteiros | 25% | R$ 37 | R$ 9,25 |
| Bump 3 · Suporte | 20% | R$ 37 | R$ 7,40 |
| Bump 4 · Vitalício | 25% | R$ 37 | R$ 9,25 |
| Upsell · CHIP ADV PRO | 10% | R$ 97 | R$ 9,70 |
| Downsell · Anúncios | 8% de 90% | R$ 47 | R$ 3,38 |
| **Ticket médio** | | | **≈ R$ 143** |

---

## 5. Checklist antes de ligar

- [ ] Produto CHIP ADV com acesso de 1 ano, 12x, Cartão + Pix, garantia de 7 dias
- [ ] Banner, imagem do produto e selo (pasta `imagens/`)
- [ ] 4 bumps criados na ordem acima, com imagens
- [ ] Entregáveis prontos: CHIP_ADV.md · **mapa de efeitos próprio** (o atual é do Lucas Ferraz e não pode ser vendido) · guia do 1º vídeo · pautas · roteiros ✅
- [ ] Calendário das 52 atualizações (bump 1) e WhatsApp do suporte (bump 3)
- [ ] Upsell e downsell configurados com 1 clique
- [ ] Link do checkout colado no `CFG.checkoutUrl` da landing
- [ ] Pixel da Meta no checkout da Hubla (evento de compra) e na landing (`CFG.pixels.meta`)
