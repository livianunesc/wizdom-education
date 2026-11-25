# WIZDOM

Plataforma de estudos para vestibulares com trilhas por disciplina, cronograma, sessões de foco, acervo ENEM e prática com questões e flashcards.

## Abrir com dois cliques

1. Extraia **todo o ZIP** para uma pasta no computador.
2. Abra **`index.html` da pasta principal** com Chrome ou Edge. No Windows, também pode usar `ABRIR-WIZDOM.bat`.
3. Mantenha a pasta **`provas/` junto ao `index.html`** para abrir as provas e gabaritos incluídos.

Não precisa instalar Node.js, npm ou iniciar servidor. Código, estilos, fontes, ícones, cronogramas e flashcards estão no HTML. O app e os PDFs locais funcionam sem internet. Os links para INEP e universidades exigem conexão.

Os dados ficam neste navegador. Mover o arquivo ou trocar de navegador pode criar outro armazenamento. Perfis e saldo ficam separados por navegador. A versão hospedada oferece uma sala temporária compartilhada para foco em dupla.

## O que experimentar

- **Início e navegação:** acesse os conteúdos pelo topo e use o menu para abrir cronograma, calendário, área de foco, olimpíadas, ranking, perfil e loja.
- **Ciclos e Disciplinas:** pratique as questões existentes por matéria, assunto ou dificuldade. As respostas contabilizam o avanço nas duas telas.
- **Questões e Materiais:** escolha entre prática por tema, fila de revisão e flashcards. Busque provas e gabaritos do ENEM por ano ou encontre questões por disciplina.
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
- **Vestibulares, calendário e olimpíadas:** filtros, favoritos, links oficiais e eventos internos. Datas e notas de corte entram somente com fonte por edição. As fichas atuais direcionam aos portais oficiais. FUVEST, Comvest, Unesp, PUCs e federais aparecem como consultas oficiais quando faltam arquivos catalogados.

## Biblioteca de provas

A seção Provas anteriores cataloga 2016–2025. Estão incluídos **36 PDFs locais de 2017–2025**: provas e gabaritos correspondentes dos dois dias. **2016 ainda não tem PDFs locais**; os cards apontam para o acervo anual do INEP. O download direto dessa edição permanece bloqueado pela política de rede da máquina. Cadernos azuis da aplicação regular; a distribuição das áreas antes de 2017 é identificada. Consulte `docs/enem-fontes.md` e `docs/enem-arquivos.json` para procedência e verificações de cada PDF. Confira sempre ano, dia e cor antes de corrigir.

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

## Experimentar o foco em dupla

1. Na raiz, execute `npm ci` e `npm run dev`. Os dois dispositivos precisam abrir a **mesma origem**, com `/api/duo` no mesmo servidor. Para testar em dispositivos físicos, coloque um proxy HTTPS na frente dessa origem. Web Crypto do cadastro local exige HTTPS, exceto em localhost.
2. Abra em dois dispositivos ou em dois perfis de navegador separados. Em cada um, crie uma conta **local de teste**, conclua o onboarding e abra **Ferramentas → Área de foco → Estudar com um amigo**.
3. Em um, escolha **1 minuto** e crie a sala. Copie o link de convite ou passe o código ao outro dispositivo. O segundo entra e os dois confirmam prontidão.
4. Experimente pausar e confirmar de novo nos dois dispositivos. Para testar a reconexão, deixe um deles offline por mais de oito segundos, volte à mesma origem, recarregue e confirme em ambos.
5. Depois que ambos atingirem o fim da sessão, resgate **4 XP + 1 XP de bônus** por minuto, mais 2 moedas por minuto. O primeiro resgate na semana também completa a missão semanal. Recarregar e reenviar o resgate preserva o saldo.

Para testar a compilação hospedada, use `npm run build` e `npm run preview -- --host "${WIZDOM_HOST:-127.0.0.1}" --port "${WIZDOM_PORT:-4173}"`. Veja `.env.example` para as opções desse comando. Vite hospeda a aplicação e o serviço juntos para desenvolvimento. Não há fornecedor externo, conta real ou segredo de configuração.

O serviço de demonstração guarda as salas em memória, em um único processo, e usa tokens aleatórios por participante. O convite expira em 15 minutos e a sala após 24 horas. Reiniciar o servidor elimina as salas. O servidor envia somente os nomes de exibição e o estado da sessão aos participantes da sala. Os recibos são deduplicados por conta no navegador. Para operar um serviço público persistente, ainda são necessários autenticação de servidor, armazenamento durável e proteção operacional. A abertura por `ABRIR-WIZDOM.bat` continua oferecendo os recursos individuais do HTML local.

## Cobertura do catálogo

O catálogo inicial revisado tem **11 ofertas, 10 instituições, 7 cursos distintos e 5 regiões**. Os links de nove processos apontam às organizadoras e a biblioteca do INEP preserva 36 PDFs locais de 2017–2025. As outras bancas ainda precisam de verificação independente de edição, fase, caderno e gabarito. O proxy da máquina de desenvolvimento recusou a consulta direta aos portais durante a implementação. O calendário só exibe datas cadastradas com fonte e o catálogo ainda não contém inscrições confirmadas.

As oito olimpíadas têm roteiro inicial e portal da organizadora. A confirmação de níveis específicos, datas e arquivos por edição segue pendente.

## Capturas

- [Início no desktop](docs/studio/inicio-desktop.jpg) e [no celular](docs/studio/inicio-celular.jpg)
- [Ciclos](docs/studio/ciclos.jpg), [Disciplinas](docs/studio/disciplinas.jpg) e [Questões](docs/studio/questoes.jpg)
- [Materiais](docs/studio/materiais.jpg), [Provas](docs/studio/provas.jpg) e [Ferramentas](docs/studio/ferramentas.jpg)
- [Perfil](docs/studio/perfil.jpg)
