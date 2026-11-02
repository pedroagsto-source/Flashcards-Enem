# ESTILOS.md · 8 estilos prontos para o CHIP ADV

Anexe este arquivo junto com o `MARCA.md`. O campo `estilo` do `MARCA.md` escolhe um dos blocos abaixo; os ajustes finos do `MARCA.md` têm prioridade sobre o estilo.

Como o CHIP ADV usa cada campo: `cores` vira a paleta (`brand.ts`), `titulo`/`texto` viram as fontes, `legenda` define o visual da legenda, `ritmo` define cortes e zooms, `efeitos` têm prioridade no storyboard e `evitar` nunca entra.

## Sóbrio Clássico
*Indicado para: Qualquer área; escritórios tradicionais*

```yaml
id: sobrio-classico
cores: {principal: "#0F1E33", destaque: "#B8955A", clara: "#F4EFE6", texto: "#FFFFFF"}
fonte_titulo: "Cormorant Garamond"  # peso 700
fonte_texto: "Inter"  # peso 800
legenda: "Branca, caixa normal; palavra-chave em dourado, sem fundo"
ritmo: "Calmo: cortes a cada 3–4 s, punch-in leve (1,04)"
efeitos: [16, 07, 17, 11]  # 16 Capa de revista, 07 Checklist, 17 Letra de vidro, 11 Revelação
evitar: [13, 14, 04, 02]  # 13 Recorte de papel, 14 Rabisco vivo, 04 Saindo da tela, 02 Parede de posts
trilha: "Piano e cordas, andamento lento"
frase_final_sugerida: "Seus direitos, com clareza."
```

## Editorial
*Indicado para: Opinião, análise de decisões, notícias jurídicas*

```yaml
id: editorial
cores: {principal: "#141414", destaque: "#C8102E", clara: "#F6F3EE", texto: "#FFFFFF"}
fonte_titulo: "Playfair Display"  # peso 900
fonte_texto: "Inter"  # peso 800
legenda: "Branca; palavra-chave com fundo vermelho"
ritmo: "Médio: cortes a cada 2–3 s"
efeitos: [16, 08, 17, 09]  # 16 Capa de revista, 08 Mural de manchete, 17 Letra de vidro, 09 Corte no zoom
evitar: [13, 14]  # 13 Recorte de papel, 14 Rabisco vivo
trilha: "Batida discreta, estilo telejornal"
frase_final_sugerida: "O que mudou, explicado."
```

## Moderno
*Indicado para: Empresarial, tributário, tecnologia*

```yaml
id: moderno
cores: {principal: "#1C1C22", destaque: "#3B82F6", clara: "#EEF2F8", texto: "#FFFFFF"}
fonte_titulo: "Montserrat"  # peso 900
fonte_texto: "Montserrat"  # peso 800
legenda: "Caixa alta; palavra-chave com fundo azul"
ritmo: "Ágil: cortes a cada 2 s, punch-in 1,08"
efeitos: [05, 09, 11, 10]  # 05 Zoom digital, 09 Corte no zoom, 11 Revelação, 10 Gráfico subindo
evitar: [13, 14]  # 13 Recorte de papel, 14 Rabisco vivo
trilha: "Eletrônica leve, 100–110 BPM"
frase_final_sugerida: "Direito para quem empreende."
```

## Minimal
*Indicado para: Quem quer só legenda e cortes limpos*

```yaml
id: minimal
cores: {principal: "#111111", destaque: "#111111", clara: "#FAFAF7", texto: "#FFFFFF"}
fonte_titulo: "Manrope"  # peso 800
fonte_texto: "Manrope"  # peso 800
legenda: "Caixa normal; palavra-chave sublinhada"
ritmo: "Corte seco, sem zooms"
efeitos: [07]  # 07 Checklist
evitar: [04, 13, 14, 15, 02, 01]  # 04 Saindo da tela, 13 Recorte de papel, 14 Rabisco vivo, 15 Vertigem, 02 Parede de posts, 01 Órbita
trilha: "Sem trilha ou ambiente muito baixo"
frase_final_sugerida: "Direto ao ponto."
```

## Premium Escuro
*Indicado para: Anúncios e conteúdo de alto impacto*

```yaml
id: premium-escuro
cores: {principal: "#0B0B0F", destaque: "#D8FF3C", clara: "#F5F3EE", texto: "#FFFFFF"}
fonte_titulo: "Anton"  # peso 400
fonte_texto: "Inter"  # peso 900
legenda: "Caixa alta; palavra falada acende em limão; palavra-chave com fundo"
ritmo: "Intenso: cortes a cada 1,5–2 s, zooms secos"
efeitos: [05, 17, 09, 11, 16, 12]  # 05 Zoom digital, 17 Letra de vidro, 09 Corte no zoom, 11 Revelação, 16 Capa de revista, 12 Chroma key
evitar: [13]  # 13 Recorte de papel
trilha: "Batida marcada, 100–120 BPM"
frase_final_sugerida: "Você grava. A IA edita."
```

## Institucional
*Indicado para: Sociedades de advogados, conteúdo de autoridade*

```yaml
id: institucional
cores: {principal: "#0E3B2E", destaque: "#B87333", clara: "#F3EFE6", texto: "#FFFFFF"}
fonte_titulo: "DM Serif Display"  # peso 400
fonte_texto: "Inter"  # peso 800
legenda: "Branca; palavra-chave em cobre"
ritmo: "Calmo: cortes a cada 3 s"
efeitos: [07, 10, 16, 11]  # 07 Checklist, 10 Gráfico subindo, 16 Capa de revista, 11 Revelação
evitar: [13, 14, 04]  # 13 Recorte de papel, 14 Rabisco vivo, 04 Saindo da tela
trilha: "Orquestral suave"
frase_final_sugerida: "Tradição e orientação jurídica."
```

## Acolhedor
*Indicado para: Família, previdenciário, sucessões*

```yaml
id: acolhedor
cores: {principal: "#3D2C25", destaque: "#C9877A", clara: "#EFE6DA", texto: "#FFFFFF"}
fonte_titulo: "Fraunces"  # peso 800
fonte_texto: "Manrope"  # peso 800
legenda: "Caixa normal; palavra-chave em rosa antigo"
ritmo: "Calmo: cortes a cada 3–4 s, sem tremidas"
efeitos: [07, 14, 13, 17]  # 07 Checklist, 14 Rabisco vivo, 13 Recorte de papel, 17 Letra de vidro
evitar: [05, 04, 15, 09]  # 05 Zoom digital, 04 Saindo da tela, 15 Vertigem, 09 Corte no zoom
trilha: "Violão acústico ou piano suave"
frase_final_sugerida: "Do seu lado, com cuidado."
```

## Dinâmico
*Indicado para: Consumidor, trabalhista, público jovem*

```yaml
id: dinamico
cores: {principal: "#2E1065", destaque: "#FACC15", clara: "#F5F3FF", texto: "#FFFFFF"}
fonte_titulo: "Bebas Neue"  # peso 400
fonte_texto: "Montserrat"  # peso 900
legenda: "Caixa alta; palavra-chave com fundo amarelo, pulando"
ritmo: "Rápido: cortes a cada 1,5 s, zooms e tremidas"
efeitos: [05, 04, 02, 13, 09]  # 05 Zoom digital, 04 Saindo da tela, 02 Parede de posts, 13 Recorte de papel, 09 Corte no zoom
evitar: [16]  # 16 Capa de revista
trilha: "Pop/funk instrumental, 110–125 BPM"
frase_final_sugerida: "Seu direito em 30 segundos."
```
