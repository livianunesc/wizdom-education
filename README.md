# WIZDOM

Seu futuro, no seu ritmo. Plataforma de estudos com interface pastel, cronogramas personalizados, foco, biblioteca ENEM e revisões com flashcards.

## Abrir com dois cliques

1. Extraia **todo o ZIP** para uma pasta no computador.
2. Abra **`index.html` da pasta principal** com Chrome ou Edge. No Windows, também pode usar `ABRIR-WIZDOM.bat`.
3. Mantenha a pasta **`provas/` junto ao `index.html`** para abrir as provas e gabaritos incluídos.

Não precisa instalar Node.js, npm ou iniciar servidor. Código, estilos, fontes, ícones, cronogramas e flashcards estão no HTML. O app e os PDFs locais funcionam sem internet. Os links para INEP e universidades exigem conexão.

Os dados ficam neste navegador. Mover o arquivo ou trocar de navegador pode criar outro armazenamento. Não há sincronização entre dispositivos.

## O que experimentar

- **Login e cadastro locais:** botão Entrar, criação de conta, senha com visibilidade opcional, sair e voltar. Senhas de teste são derivadas com PBKDF2/SHA-256 e salt individual. Não há servidor de autenticação, recuperação de senha nem envio de e-mails; use dados fictícios e uma senha de teste.
- **Duas demonstrações:** Júlia, para Medicina; Leo, para Engenharia. Cada demonstração e cada conta têm progresso separado.
- **Seletores estilizados:** opções no padrão da plataforma, clique, setas, Home/End, digitação e Escape. Sem o menu cinza nativo.
- **Cronograma explicado:** o formulário define dias, tempo disponível, rotina, curso, matéria favorita, dificuldade, frequência, meta e horizonte. A semana apresenta horários sugeridos, tópicos concretos, quantidade de exercícios, tarefas de escrita e pausas de cinco minutos incluídas no orçamento de tempo. Todas as matérias entram na rotação; dificuldade e curso orientam prioridades. Os tópicos avançam com as semanas. Uma janela incompatível com a rotina é limitada e explicada. Horários são sugestões, sem garantia de aprovação; a trilha inicial de 30 assuntos não é um curso completo.
- **Check-in:** cansaço e sobrecarga reduzem o dia a uma revisão de até 25 minutos da matéria favorita. Dias não escolhidos ficam livres.
- **Estudo ligado à revisão:** marcar Já estudei no cronograma, concluir ao menos um minuto de foco ou registrar um assunto em Revisões libera três cartões dele. São **90 questões autorais**, cobrindo 30 assuntos em dez matérias, nos níveis fundamental, intermediário e desafiador. Não são questões oficiais do ENEM.
- **Revisão com correção:** quatro alternativas, explicação, taxa de acerto, acertos e erros persistentes. Erros voltam no dia seguinte; acertos voltam em 3, 6, 12, 24 e até 30 dias. É possível praticar antes; cada cartão concede pontos uma vez por dia. Resposta certa rende 10 XP e erro rende 3 XP de prática.
- **Ofensivas e celebrações:** estudo registrado, revisão ou um minuto completo de foco acendem o dia. Ofensivas usam dias consecutivos do calendário local. Confetes e conquistas ao concluir revisão e foco; movimento reduzido é respeitado.
- **Foco:** Pomodoro 30/5, temporizador e cronômetro. Cada minuto completo efetivamente estudado rende 4 XP e 2 moedas; descanso não rende pontos. Recuperação de sessão ocorre em pausa.
- **Ranking:** pódio, posição, progresso de nível e participação opcional, separados por conta. Os colegas são fictícios; nenhuma informação pessoal é publicada.
- **Vestibulares, calendário e olimpíadas:** filtros, favoritos, links oficiais e eventos internos. Datas e notas de corte dessas oportunidades são ilustrativas, com aviso na interface.

## Biblioteca de provas

A seção Simulados ENEM cataloga 2016–2025. Estão incluídos **36 PDFs locais de 2017–2025**: provas e gabaritos correspondentes dos dois dias. **2016 ainda não tem PDFs locais**; os cards apontam para o acervo anual do INEP. O download direto dessa edição permanece bloqueado pela política de rede da máquina. Cadernos azuis da aplicação regular; a distribuição das áreas antes de 2017 é identificada. Consulte `docs/enem-fontes.md` e `docs/enem-arquivos.json` para procedência e verificações de cada PDF. Confira sempre ano, dia e cor antes de corrigir.

## Desenvolvimento

Requer Node.js 20.19+ ou 22.12+ e npm; validado com Node 24.22.1.

```sh
npm ci
npm run dev
```

Na máquina gerenciada, se o cache padrão não for gravável, use:

```sh
npm ci --cache /workspace/.npm-cache --no-audit --no-fund
```

No PowerShell, use `npm.cmd` se a política local bloquear `npm.ps1`.

Depois de editar `src/`, atualize o arquivo de dois cliques:

```sh
npm run build
```

O build produz `dist/index.html` e atualiza `index.html` na raiz. As fontes e o código ficam incorporados. A biblioteca de PDFs é mantida separadamente em `provas/enem/`; distribua a pasta junto do HTML. O servidor de desenvolvimento e o preview também servem os PDFs dessa pasta. Não edite o HTML gerado manualmente.

## Validação

```sh
npm test
npm run test:e2e
npm run build
npm run test:standalone
```

Os testes de navegador usam `/usr/bin/chromium`; defina `CHROMIUM_PATH` em outra máquina. Os fluxos cobrem cadastro/login, seletores, cronograma, conclusão e revisão, acertos/erros, isolamento de demonstrações, persistência, limite de XP, favoritos, foco, ranking e layouts móveis de até 320px.

O teste standalone usa os bytes exatos do HTML gerado e bloqueia solicitações externas. Primeiro tenta `file://`; quando o navegador gerenciado bloqueia arquivos locais por política administrativa, informa essa limitação e testa o mesmo HTML em uma origem local isolada. Nenhuma política é desativada. Isso valida a independência dos recursos, sem afirmar que a abertura direta foi testada nesse navegador gerenciado.

## Estrutura

- `index.html`: aplicação pronta.
- `provas/enem/`: provas e gabaritos locais.
- `web/`: entrada Vite de desenvolvimento.
- `src/App.jsx`: navegação, contas e estado por estudante.
- `src/lib.js`, `curriculum.js`: regras e tópicos do cronograma.
- `src/learning.js`, `flashcards-data.js`: revisão espaçada, acertos e conteúdo autoral.
- `src/pages/`: telas de estudo, biblioteca, perfil e ranking.
- `src/Select.jsx`: seletor customizado acessível.
- `src/Celebration.jsx`: conquistas e ofensivas.
- `tests/`: regras e testes de navegador.

Esta versão foi importada do ZIP original e ampliada neste repositório.
