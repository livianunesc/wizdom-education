# Validação desta entrega

- Node.js 24.22.1; dependências instaladas com `npm ci` e integridade do lockfile preservada.
- `npm test`: 17 testes aprovados. Planejamento, datas, orçamento de pausas, assuntos, conteúdo dos cartões, revisão espaçada, XP, ofensivas e integridade SHA-256 dos 36 PDFs.
- `npm run test:e2e`: cinco conjuntos completos aprovados em Chromium. Cadastro/login/onboarding, persistência, seletores customizados, favoritos/calendário, ranking, foco com relógio virtual, revisões com respostas certas e erradas, isolamento entre demonstrações e navegação de volta. Layouts até 320px sem rolagem horizontal nos fluxos verificados.
- `npm run build`: HTML único com código, estilos, fontes e ícones incorporados; `index.html` da raiz atualizado.
- `npm run test:standalone`: aprovados os fluxos sobre os bytes do HTML gerado sem recursos externos. A abertura direta `file://` foi bloqueada por política administrativa do navegador gerenciado; o teste informou essa etapa como não validada e usou origem local isolada para o mesmo HTML. Nenhuma política foi desativada.
- Biblioteca PDF em desenvolvimento: resposta `200 application/pdf` com assinatura `%PDF-`; arquivos ausentes e caminhos indevidos retornam 404.

## Limite conhecido

Foram incluídas nove edições com PDFs locais (2017–2025, 36 arquivos). Os quatro PDFs de 2016 ainda estão pendentes: os domínios oficiais do INEP foram bloqueados pelo proxy do ambiente. O catálogo oferece o acervo anual oficial dessa edição e identifica a distribuição antiga das áreas. Não há promessa de 40 PDFs locais.

As cópias locais dos documentos do INEP vieram de mirrors GitHub, com ano, cor, caderno e conteúdo conferidos. Não foi possível comparar os hashes com o servidor original por causa do bloqueio. Veja `enem-fontes.md` e `enem-arquivos.json`.

Contas e progresso são locais. Esta entrega não cria backend de autenticação nem sincronização entre computadores.
