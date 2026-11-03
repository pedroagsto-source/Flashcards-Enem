# CHIP ABOGADO · Campanha de teste LATAM (V1)

**Objetivo do teste:** descobrir qual criativo vende mais barato na LATAM com a menor verba possível.
**Conta:** CA 01 GRINGA (USD) · **Pixel:** CHIP ADV `1692009002494391` · **Página:** CHIP ABOGADO · **Checkout:** Hotmart (US$ 19)

## Estrutura

```
CAMPANHA  CHIPABOGADO | TESTE CRIATIVOS V1 | ABO
│  Objetivo: Vendas · Evento: Purchase (pixel CHIP ADV)
│  Orçamento por conjunto (ABO): cada criativo recebe a mesma verba
│
├── CONJUNTO 1  MX-CO | F4 ladoalado      US$ 10/dia
├── CONJUNTO 2  MX-CO | F5 motion         US$ 10/dia
├── CONJUNTO 3  MX-CO | F6 teladividida   US$ 10/dia
└── CONJUNTO 4  MX-CO | F1 ou F7 dublado  US$ 10/dia   (entra quando a dublagem estiver pronta)
```

**Por que ABO com 1 anúncio por conjunto:** com pixel novo e pouca verba, uma CBO joga quase todo o dinheiro num criativo só em 1–2 dias. ABO garante que todos gastem igual e que a comparação seja justa.

## Configuração de cada conjunto
| Item | Valor |
|---|---|
| Países | **México + Colômbia** (os dois maiores mercados de advogados; Hotmart aceita pagamento local) |
| Idioma | Espanhol (todos) |
| Idade | 25–60 |
| Público | **Aberto** (sem interesses). Com pixel novo, o algoritmo acha o comprador melhor que interesse manual. |
| Posicionamentos | Advantage+ |
| Evento | Purchase · janela de 7 dias após o clique e 1 dia após a visualização |
| Lance | Maior volume (sem limite de custo) |

## Anúncio
- **Texto principal:**
  > Abogado, ¿cuántas horas pierdes editando Reels? Con el CHIP ABOGADO grabas como te salga, adjuntas un archivo a tu IA y escribes "edítalo por mí". Vuelve cortado, subtitulado, con efectos y música.
- **Título:** `Tu IA se vuelve tu editor de video`
- **Descrição:** `Garantía de 7 días`
- **Botão:** Más información
- **URL:** landing ES + `?utm_source=FB&utm_medium=paid&utm_campaign=CHIPABOGADO-TESTE-V1&utm_content={{ad.name}}`
- **Nomes:** `CHIPABOGADO_F4_ladoalado_v1`, `CHIPABOGADO_F5_motion_v1`, `CHIPABOGADO_F6_teladividida_v1`, `CHIPABOGADO_F7_carro_dub_v1`

## Verba e duração
- **Total:** US$ 30–40/dia por **4 a 5 dias** → US$ 150–200 no teste inteiro.
- Cada criativo gasta de **US$ 40 a 50**, ou seja **2 a 2,5 vezes o preço** do produto, antes de qualquer decisão.

## Regras de decisão (olhar 1x por dia, de manhã)
| Gasto do criativo | Sinal | Ação |
|---|---|---|
| US$ 10 (≈ 0,5x o preço) | CTR no link < 0,6% **ou** CPM muito acima dos outros | Pausar |
| US$ 20 (≈ 1x o preço) | Nenhum InitiateCheckout | Pausar |
| US$ 40 (≈ 2x o preço) | Nenhuma venda | Pausar |
| Qualquer momento | 1ª venda com CPA ≤ US$ 19 | Manter e marcar como candidato |
| 2+ vendas com CPA ≤ US$ 15 | Vencedor | Ir para a fase de escala |

## Fase 2 · Escala (só com vencedor)
1. Nova campanha **CBO** `CHIPABOGADO | ESCALA` com o vencedor + 2 variações de gancho, US$ 30–50/dia.
2. Abrir países: Argentina, Chile, Peru, Equador (um conjunto "LATAM restante").
3. Subir a verba 20–30% a cada 2 dias enquanto o CPA se mantiver.
4. Ligar as regras automáticas na OneClick (pausar acima do CPA alvo, escalar abaixo).

## Antes de subir (checklist)
- [ ] Landing ES no ar em domínio próprio, com o link do checkout Hotmart e o pixel (já configurado no código)
- [ ] Hotmart: produto criado em USD, **pixel `1692009002494391` cadastrado** no produto (Purchase disparado no checkout) e API de Conversões ligada
- [ ] Domínio verificado no Gerenciador de Negócios
- [ ] Página CHIP ABOGADO criada e atribuída ao `claude-api`
- [ ] Compra de teste na Hotmart com o evento Purchase aparecendo no Gerenciador de Eventos
- [ ] Criativos F4, F5 e F6 enviados à conta (F1/F7 dublados depois)
