# Auxílio-acidente · Campanha de teste de criativos (V1)

**Conta:** TPC CA02 - Escritório (`act_1000461061689766`, BRL) · **WhatsApp:** 7014 · **Modelo de cobrança do escritório:** honorários só no êxito

## Por que este formato (dados da própria conta)

| Campanha | Objetivo / otimização | Gasto | Conversas no WhatsApp | Custo por conversa | Conversas que mandaram 2ª msg | Custo por conversa engajada |
|---|---|---|---|---|---|---|
| CA 114 · Acidente (17/06) | **Leads → WhatsApp** (LEAD_GENERATION) | R$ 577,95 | **152** | **R$ 3,80** | 14 | R$ 41 |
| CA 115 · Acidente (23/06) | Engajamento → conversas | R$ 380,94 | 27 | R$ 14,11 | 9 | R$ 42 |
| CA 118 · Acidente (24/06) | Engajamento → conversas | R$ 186,33 | 11 | R$ 16,94 | 2 | R$ 93 |
| CA 113 · Acidente em análise (09/06) | Engajamento → conversas | R$ 135,86 | 8 | R$ 16,98 | 3 | R$ 45 |

- **Leads → WhatsApp** trouxe conversa **4x mais barata**. O custo por conversa *engajada* ficou parecido (~R$ 41–45), ou seja: mais volume pelo mesmo dinheiro, com uma fatia menor respondendo.
- No êxito, o que paga a conta é **caso qualificado** (carteira assinada na época + sequela), não mensagem. Como a triagem no WhatsApp já é automática (Pipedream + IA), volume barato é vantagem: a IA filtra, a advogada só vê quem passou.
- **WhatsApp, não formulário instantâneo nem site:** o público (CLT, classe C/D, 30–60 anos) conversa; formulário instantâneo traz muito lead frio e site perde gente no caminho.

## Estrutura (Teste de criativos Andrômeda, 1-1-5)

```
CAMPANHA  CA 121 | ACIDENTE | TESTE CRIATIVOS V1 | WA 7014     Leads · CBO R$ 100/dia · PAUSADA até revisão
└── CONJUNTO  BR | 23-65 | Aberto Adv+                        base: conjunto da CA 114 (página, WhatsApp, otimização)
    ├── AD 1  H2 pino ou placa · premium · história    (premium-h2b)
    ├── AD 2  H1 benefício mulher · premium · história (premium-h1b)
    ├── AD 3  H3 voltou a trabalhar · premium · história (premium-h3b)
    ├── AD 4  H4 caiu de moto · premium · história     (premium-h4b)
    └── AD 5  H2 pino ou placa · NATIVO · história     (nativo-h2b)  ← controle de estilo
```

**Por que esses 5:** o hook é o que mais mexe no resultado, então os 4 hooks vão com o mesmo body e o mesmo estilo (comparação limpa). O 5º repete o hook "pino ou placa" (o mais usado na conta) no estilo Nativo, para medir se a edição premium ajuda ou atrapalha.
**Por que o Body B (história + CTA):** é o mais curto (37–39 s) e **não tem** a frase "até com aposentadoria", que é arriscada (o auxílio-acidente em regra não se acumula com aposentadoria).

## Conjunto
| Item | Valor |
|---|---|
| Local | Brasil (moradores e quem esteve recentemente) |
| Idade | 23–65 |
| Gênero | Todos |
| Público | Aberto, Advantage+ ligado |
| Posicionamentos | Advantage+ (vídeo 9:16 vai para Reels e Stories) |
| Otimização | Leads no WhatsApp (igual à CA 114) |

## Texto dos anúncios (sem promessa de valor ou resultado — Provimento 205/2021 da OAB)
- **Texto principal:**
  > Sofreu um acidente e ficou com alguma sequela? Dor, perda de força ou um movimento que não voltou igual?
  > Se você tinha carteira assinada na época, pode ter direito ao auxílio-acidente do INSS, um benefício mensal pago junto com o seu salário.
  > Toque em Enviar mensagem, responda 4 perguntas rápidas e uma advogada analisa o seu caso.
- **Título:** Auxílio-acidente: veja se o seu caso se encaixa
- **Botão:** Enviar mensagem (WhatsApp)

> A cópia antiga da CA 114 dizia "pode chegar a R$ 90 mil ou mais". Valor estimado em anúncio de advocacia é promessa de resultado; ficou de fora.

## Verba, duração e regras de decisão
- **R$ 100/dia por 5 a 7 dias** (R$ 500–700 no teste). A CBO concentra verba no que performa; se um criativo não receber nem R$ 30 em 3 dias, é sinal fraco, não falta de teste.
- Olhar 1x por dia. A métrica principal vem do **Notion (Funil de casos)**: quantos chegaram em *Triagem* aprovada e *Documentos* por anúncio.

| Momento | Sinal | Ação |
|---|---|---|
| R$ 40 gastos no criativo | 0 conversas | Pausar |
| R$ 80 gastos | custo por conversa > R$ 10 (2,5x a CA 114) | Pausar |
| R$ 150 gastos | 0 lead qualificado no Notion | Pausar |
| Fim do teste | menor **custo por lead qualificado** | Vencedor → escala + variações (Multicâmera/Push-in, outros bodies) |

## Vídeos na biblioteca da conta (Drive: Auxílio-acidente · Criativos / 01 · TESTE V1)
| Anúncio | Arquivo | Meta video id |
|---|---|---|
| AD 1 | premium-h2b.mp4 | 2363837334404251 |
| AD 2 | premium-h1b.mp4 | 1962331264725146 |
| AD 3 | premium-h3b.mp4 | 1134380995875544 |
| AD 4 | premium-h4b.mp4 | 1426393379692469 |
| AD 5 | nativo-h2b.mp4 | 1136020675472124 |

## O que foi criado (06/11) — difere do plano em 2 pontos
- **Campanha:** `CA 121 | ACIDENTE | TESTE CRIATIVOS V1 | WA 2352 | 06/11` (id `120252300962440660`), **PAUSADA**, CBO R$ 100/dia, 1-1-5.
- **Base:** estrutura da CA 120 (página `107500887498474`, WhatsApp (86) 98827-2352), porque a página da CA 114 está com WhatsApp **pessoal** e a Meta recusou (erro 2446885).
- **Diferença 1 — objetivo:** **Engajamento → conversas** (herdado da CA 120), não Leads. Para testar Leads, a página da CA 114 precisa ter o WhatsApp Business reconectado.
- **Diferença 2 — idade:** **21–65** (herdada; o público Advantage+ não aceita mudar a idade depois de copiado).
- Anúncios: AD1 `120252300963560660` · AD2 `120252300964930660` · AD3 `120252300967000660` · AD4 `120252300970300660` · AD5 `120252300971250660`.

## Versão definitiva: conta CA 02 GRINGA - DIRECT RESPONSE (USD) — 06/11
A CA 121 da TPC CA02 ficou **pausada** e foi substituída por esta, a pedido.
- **Base:** `AA | TESTE B2 | CBO | BR-F | WHATSAPP | DUPLICACAO` (Leads, página `127789140237809`, WhatsApp Business ok): US$ 80,04 → **57 conversas a US$ 1,40**, 21 com 2ª mensagem (37%).
- **Campanha:** `AA | TESTE CRIATIVOS V1 | CBO | 1-1-5 | BR-TODOS | WHATSAPP | 06NOV`, **PAUSADA**, CBO **US$ 18/dia** (~R$ 100).
- **Conjunto (criado do zero, mesma página e otimização da base):** Brasil, 18–65, **todos os gêneros**, Advantage+, otimização conversas no WhatsApp.
- **Vídeos nesta conta:** AD1 `1146481524547666` · AD2 `2982444602134147` · AD3 `1934536925043693` · AD4 `1864728534878141` · AD5 `2364715890931202`.
- UTMs iguais às da base (`utm_source={{site_source_name}}&utm_campaign={{campaign.id}}&utm_medium={{adset.id}}&utm_content={{ad.id}}&utm_term={{placement}}`).
- **Estado final (06/11):** o conjunto original foi arquivado e substituído pela cópia `AA | BR | TODOS | 18-65+ | WHATSAPP | 5 criativos — Cópia` (`120251363951700774`), com o WhatsApp (86) 98827-2352. Anúncios ativos: AD1 `120251363951690774` · AD2 `120251363951680774` · AD3 `120251363951710774` · AD4 `120251363951720774` · AD5 `120251363951730774`. As 5 duplicatas que eu tinha adicionado foram apagadas. O botão "Saiba mais" não é aceito pela Meta em Leads → WhatsApp (erro 1487891); ficou "Enviar mensagem".
- Regras de decisão em dólar: pausar com US$ 8 e 0 conversas; com US$ 15 e custo por conversa > US$ 3 (2x a base); com US$ 28 e 0 lead qualificado no Notion.

## Antes de ativar (checklist)
- [ ] Confirmar que a página do conjunto da CA 114 é a do WhatsApp 7014 atual
- [ ] Workflow do Pipedream no ar respondendo o 7014 (senão as conversas ficam sem resposta)
- [ ] Vídeos enviados para a biblioteca da conta (precisam de link público, ex.: pasta do Drive "qualquer pessoa com o link")
- [ ] Revisar anúncios no Gerenciador e só então ativar
