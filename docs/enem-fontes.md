# Biblioteca ENEM

O catálogo seleciona a aplicação regular impressa, cor azul. Os PDFs locais foram copiados sem edição; hashes SHA-256, tamanho e verificações ficam em `enem-arquivos.json`.

## Origem das cópias

- 2017–2024: [Coral-math/Provas-e-gabaritos-Enem](https://github.com/Coral-math/Provas-e-gabaritos-Enem), commit `4931a7a5bdc977d263cd81a6e19044385873b54d`, diretórios `ANO/Aplicação regular`.
- 2025: [Twyck/simulado-enem](https://github.com/Twyck/simulado-enem), commit `b8d431e9c41d5e873f0517d0fcc96cfacb915a62`, diretório `provas`.

São cópias dos documentos do INEP em repositórios de terceiros. A conferência local incluiu cabeçalho `%PDF-`, leitura completa com `pdftotext`, correspondência de cor/caderno, ano no texto ou metadados e ausência de JavaScript/criptografia em `pdfinfo`. Isso verifica formato e identidade do material; não equivale à comparação de hash com o servidor do INEP.

O acesso HTTPS direto a `www.gov.br` e `download.inep.gov.br` retornou bloqueio de proxy `403 Forbidden` neste ambiente. Portanto não foi possível conferir o hash das cópias com o servidor oficial nem validar ao vivo os endereços de PDFs no INEP. O acesso anual oficial fica disponível em cada card para conferência independente.

## Fontes oficiais

[Acervo de provas e gabaritos do INEP](https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos). Cada edição tem endereço com `/ANO` ao final. Não confundir aplicação regular, reaplicação/PPL e aplicação digital; a cor do gabarito precisa corresponder à prova.

Os nomes históricos das provas 2017–2019 também estão documentados em `js/data.js` do repositório Twyck. Os nomes históricos dos gabaritos estão preservados no repositório Coral-math. Os atalhos oficiais ainda não foram validados ao vivo nesta máquina.

`node scripts/verify-enem.mjs` verifica respostas HTTP e assinatura PDF dos endereços oficiais quando a política de rede permite. Ele não desativa TLS. Os testes locais verificam os arquivos que acompanham a plataforma.

Em 2016, o primeiro dia cobria Ciências Humanas e Ciências da Natureza (4h30); o segundo cobria Linguagens, Matemática e Redação (5h30). Desde 2017, o primeiro dia tem Linguagens/Humanas/Redação; o segundo tem Natureza/Matemática (4h30 em 2017, 5h a partir de 2018).
