# Tarefas para amanhã · 04/11/2026

## 1. Trackeamento no Meta

**Objetivo:** saber qual anúncio gera venda, e fazer o algoritmo otimizar para compra.

- [ ] **Domínio verificado** no Gerenciador de Negócios (Configurações → Segurança da marca → Domínios), por registro TXT no DNS ou meta-tag na landing
- [ ] **Pixel / conjunto de dados** "CHIP ADV" criado no Gerenciador de Eventos
- [ ] ID do pixel colado em `CFG.pixels.meta` na landing (`chip-adv/landing/index.html`): já dispara **PageView** e **InitiateCheckout** no clique de compra
- [ ] **Hubla:** colar o ID do pixel no produto CHIP ADV, para disparar **InitiateCheckout** e **Purchase** (com valor) no checkout
- [ ] **API de Conversões:** gerar o token no Gerenciador de Eventos e colar na integração da Hubla (as compras chegam mesmo com bloqueador de anúncio)
- [ ] Conferir a **deduplicação** entre pixel e API (mesmo evento não pode contar 2×)
- [ ] **Parâmetros de URL** em todos os anúncios:
  `utm_source=FB&utm_campaign={{campaign.name}}&utm_medium={{adset.name}}&utm_content={{ad.name}}&utm_term={{placement}}`
  (a landing já guarda e repassa as UTMs para o checkout)
- [ ] **Teste de ponta a ponta** na aba "Testar eventos": abrir a landing (PageView) → clicar em comprar (InitiateCheckout) → compra-teste (Purchase com R$ 97) → reembolsar
- [ ] Opcional: Microsoft Clarity (`CFG.pixels.clarity`) para ver gravação de sessão da landing
- [ ] Campanha do teste montada **pausada**: `CHIPADV | TESTE CRIATIVOS V1`, público aberto, otimização para **Compra**, anúncios F1, F4, F5 e F6

**Pronto quando:** uma compra-teste aparece no Gerenciador de Eventos com valor e com o nome do anúncio na UTM.

---

## 2. Criação do site (colocar a landing no ar)

**Objetivo:** a landing do CHIP ADV publicada num domínio próprio, com checkout e pixel funcionando.

- [ ] **Domínio** registrado (ex.: `chipadv.com.br` no registro.br)
- [ ] **Hospedagem:** subir a pasta `chip-adv/landing/` (index.html, lp.css, lp.js, assets/) na Vercel ou na Netlify
- [ ] **DNS** apontado para a hospedagem e **HTTPS** ativo
- [ ] Preencher o bloco `CFG` da landing:
  - [ ] `checkoutUrl`: link do checkout da Hubla
  - [ ] preço, parcelas e valor da parcela iguais aos do checkout
  - [ ] `instrutor`: seu nome; `empresa`: razão social e CNPJ
  - [ ] `pixels.meta`: ID do pixel (tarefa 1)
- [ ] Trocar a foto do bloco "Sou eu nos vídeos" (`assets/autor.jpg`), se quiser outra
- [ ] Páginas de **Termos de uso** e **Política de privacidade** (LGPD), com link no rodapé
- [ ] Teste no celular (iPhone e Android): vídeos tocando, botões levando ao checkout com as UTMs
- [ ] Teste de velocidade (PageSpeed Insights), com meta de 80+ no celular
- [ ] **Entregáveis prontos antes de vender:** mapa de efeitos **próprio** (o atual é do Lucas Ferraz), guia do primeiro vídeo e pautas para advogados

**Pronto quando:** o domínio abre a landing com HTTPS, o botão leva ao checkout com as UTMs e o pixel registra a visita.
