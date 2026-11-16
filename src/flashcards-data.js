// Questões autorais de revisão. Não são transcrições das provas oficiais do ENEM.
// Cada assunto estudado libera uma progressão de reconhecimento, aplicação e análise.
const levels = ['fundamental', 'intermediário', 'desafiador'];
const bank = {
  'bio-ecologia': [
    ['Em uma cadeia alimentar, qual grupo transforma energia luminosa em energia química?', ['Produtores fotossintetizantes', 'Consumidores primários', 'Consumidores secundários', 'Todos os decompositores'], 0, 'Plantas e algas fotossintetizantes produzem matéria orgânica a partir de energia luminosa.'],
    ['Na cadeia capim → gafanhoto → sapo → cobra, a redução dos sapos tende inicialmente a causar o quê, mantendo os demais fatores constantes?', ['Redução dos gafanhotos', 'Aumento dos gafanhotos', 'Aumento da energia disponível nas cobras', 'Desaparecimento imediato do capim'], 1, 'Com menos predadores, a população de gafanhotos tende inicialmente a aumentar; outros efeitos dependem da teia e do ambiente.'],
    ['Um agrotóxico persistente e lipossolúvel entra em uma cadeia aquática. Em qual grupo se espera maior concentração por biomagnificação?', ['Fitoplâncton produtor', 'Zooplâncton herbívoro', 'Peixes pequenos herbívoros', 'Aves que comem peixes predadores'], 3, 'Substâncias persistentes podem se acumular nos organismos e se concentrar nos níveis tróficos superiores.'],
  ],
  'bio-celulas': [
    ['Qual organela participa da maior parte da produção de ATP na respiração aeróbia de células animais?', ['Lisossomo', 'Mitocôndria', 'Complexo golgiense', 'Ribossomo'], 1, 'A cadeia respiratória e a fosforilação oxidativa ocorrem na membrana interna das mitocôndrias.'],
    ['Uma célula vegetal é colocada em solução muito concentrada de sal. Qual é a tendência inicial?', ['Entrar água por osmose', 'Produzir água no núcleo', 'Perder água por osmose', 'Romper a parede celular imediatamente'], 2, 'O meio externo hipertônico favorece a saída de água; pode ocorrer plasmólise.'],
    ['Uma substância bloqueia a cadeia transportadora de elétrons da respiração celular. Qual efeito direto é esperado?', ['Aumento obrigatório da produção de ATP mitocondrial', 'Interrupção imediata de toda produção celular de ATP', 'Conversão de mitocôndrias em cloroplastos', 'Redução do gradiente de prótons e da síntese de ATP por fosforilação oxidativa'], 3, 'Sem o transporte de elétrons, diminui o bombeamento de prótons que move a ATP sintase. A glicólise ainda pode produzir ATP.'],
  ],
  'bio-genetica': [
    ['Para um gene com dois alelos, como é chamado o indivíduo de genótipo Aa?', ['Homozigoto dominante', 'Homozigoto recessivo', 'Heterozigoto', 'Haploide'], 2, 'Um heterozigoto possui alelos diferentes para o mesmo locus.'],
    ['No cruzamento Aa × Aa, com dominância completa, qual é a probabilidade de um descendente apresentar o fenótipo recessivo?', ['25%', '50%', '75%', '100%'], 0, 'Os genótipos esperados são AA, Aa, Aa e aa; somente aa apresenta o fenótipo recessivo.'],
    ['Dois pais sem uma condição autossômica recessiva têm uma criança afetada. Ambos são Aa. Sabendo que outro filho NÃO é afetado, qual a probabilidade de ele ser portador?', ['1/4', '1/2', '3/4', '2/3'], 3, 'Entre os genótipos não afetados possíveis (AA, Aa, Aa), dois dos três são heterozigotos.'],
  ],
  'mat-proporcao': [
    ['Um produto de R$ 200 recebe desconto de 15%. Qual é o preço final?', ['R$ 185', 'R$ 170', 'R$ 160', 'R$ 150'], 1, '15% de 200 é 30; portanto, 200 − 30 = R$ 170.'],
    ['Em um mapa de escala 1:50.000, uma distância mede 3 cm. Qual é a distância real?', ['150 m', '15 km', '1,5 km', '150 km'], 2, '3 × 50.000 = 150.000 cm, equivalentes a 1.500 m ou 1,5 km.'],
    ['Um preço aumenta 20% e depois recebe desconto de 20%. Em relação ao preço inicial, o resultado é:', ['4% menor', 'Igual', '4% maior', '20% menor'], 0, 'Os fatores se multiplicam: 1,20 × 0,80 = 0,96. O preço final é 96% do inicial.'],
  ],
  'mat-funcoes': [
    ['Se f(x) = 3x + 2, qual é f(4)?', ['9', '12', '14', '20'], 2, 'Substituindo x por 4: f(4) = 3 × 4 + 2 = 14.'],
    ['Um táxi cobra R$ 6 de bandeirada e R$ 3 por quilômetro. Qual função representa o preço P de uma corrida de x km?', ['P(x) = 6x + 3', 'P(x) = 9x', 'P(x) = 3x − 6', 'P(x) = 6 + 3x'], 3, 'A bandeirada é fixa e o custo variável é 3x; logo, P(x) = 6 + 3x.'],
    ['A altura de uma bola é h(t) = −5t² + 20t, em metros. Qual é a altura máxima nesse modelo?', ['10 m', '20 m', '25 m', '40 m'], 1, 'O vértice ocorre em t = −20/(2 × −5) = 2 s; h(2) = −20 + 40 = 20 m.'],
  ],
  'mat-estatistica': [
    ['Qual é a mediana dos valores 2, 4, 7, 9 e 13?', ['4', '7', '9', '35'], 1, 'Com cinco valores ordenados, a mediana é o terceiro: 7.'],
    ['Uma urna tem 3 bolas azuis e 2 vermelhas, idênticas ao toque. Ao retirar uma bola ao acaso, qual é a probabilidade de ser vermelha?', ['2/3', '3/5', '2/5', '1/5'], 2, 'Há 2 resultados favoráveis entre 5 bolas: 2/5.'],
    ['Uma turma tem 10 alunos com média 6 e outra tem 30 com média 8 na mesma prova. Qual é a média conjunta?', ['7,5', '7', '8', '6,5'], 0, 'A média deve ser ponderada: (10 × 6 + 30 × 8)/40 = 300/40 = 7,5.'],
  ],
  'por-interpretacao': [
    ['Qual é a finalidade predominante de uma notícia jornalística?', ['Ensinar uma receita', 'Defender sempre uma tese pessoal', 'Narrar exclusivamente fatos fictícios', 'Informar sobre acontecimentos de interesse público'], 3, 'A notícia tem finalidade predominantemente informativa, embora escolhas editoriais influenciem sua construção.'],
    ['Leia: “Embora chovesse, a equipe continuou o jogo.” Qual relação a palavra “embora” estabelece?', ['Causa', 'Concessão', 'Conclusão', 'Finalidade'], 1, 'A chuva cria uma expectativa de interrupção, mas o jogo continua; essa quebra de expectativa expressa concessão.'],
    ['Um anúncio diz: “A cidade não dorme. Seus trabalhadores também não.” Ao aproximar as duas frases, o texto sugere principalmente:', ['Uma descrição neutra do céu noturno', 'Que cidades são organismos biologicamente vivos', 'Uma crítica ao trabalho contínuo, por meio da personificação da cidade', 'Uma regra de que todos devem trabalhar à noite'], 2, 'A cidade é personificada. A segunda frase desloca a imagem para as pessoas e permite uma leitura crítica das condições de trabalho.'],
  ],
  'por-linguagem': [
    ['Em “Participe da campanha. Doe um livro!”, qual função da linguagem predomina?', ['Conativa, voltada a influenciar o destinatário', 'Metalinguística, voltada ao código', 'Referencial, sem apelo ao leitor', 'Fática, voltada apenas ao contato'], 0, 'Os verbos no imperativo convocam o destinatário a agir, característica da função conativa.'],
    ['Uma pessoa usa “a gente vai” numa conversa e “nós iremos” num documento. Qual conceito explica essa escolha?', ['Erro inevitável de concordância', 'Ausência de domínio linguístico', 'Adequação do registro ao contexto', 'Superioridade linguística de uma região'], 2, 'Falantes ajustam o registro à situação comunicativa. Variação linguística não se confunde com incapacidade.'],
    ['Em um poema que explora rimas, ritmo e a disposição das palavras, qual fator sustenta a predominância da função poética?', ['A presença obrigatória de opinião política', 'A atenção à forma da própria mensagem', 'A eliminação de toda ambiguidade', 'O uso exclusivo de palavras antigas'], 1, 'A função poética destaca a elaboração da mensagem: sons, combinações, ritmo e organização visual.'],
  ],
  'por-literatura': [
    ['Qual evento é um marco do Modernismo brasileiro?', ['Semana de Arte Moderna de 1922', 'Independência do Brasil em 1822', 'Fundação da Academia Brasileira de Letras em 1897', 'Publicação de Os Lusíadas em 1572'], 0, 'A Semana de 1922 tornou-se um marco simbólico do movimento modernista no Brasil.'],
    ['Qual procedimento se associa à primeira fase modernista brasileira?', ['Imitação obrigatória dos modelos clássicos', 'Proibição da linguagem cotidiana', 'Eliminação dos temas nacionais', 'Experimentação formal e valorização crítica da linguagem brasileira'], 3, 'Modernistas experimentaram formas e linguagem coloquial e repensaram criticamente a identidade nacional.'],
    ['Uma narrativa regionalista de 1930 aborda seca, desigualdade e relações de poder no campo. Qual leitura é mais adequada?', ['O espaço rural aparece apenas como paisagem decorativa', 'O contexto social participa da construção dos conflitos humanos', 'A obra só permite interpretação como documento estatístico', 'O regionalismo exclui conflitos de dimensão universal'], 1, 'O romance de 1930 frequentemente relaciona conflitos das personagens a estruturas sociais, sem reduzir a literatura a um relatório.'],
  ],
  'red-tese': [
    ['Em uma redação dissertativo-argumentativa, a tese é:', ['Uma citação obrigatória', 'A repetição integral do tema', 'O posicionamento central que será defendido', 'Somente a proposta de intervenção'], 2, 'A tese expressa o ponto de vista que os argumentos do texto irão sustentar.'],
    ['Tema: “Desafios para combater a evasão escolar no Brasil”. Qual tese delimita melhor uma discussão?', ['A escola existe há muito tempo.', 'A pobreza e a falta de acolhimento escolar dificultam a permanência dos alunos.', 'Os estudantes usam materiais escolares.', 'O Brasil possui várias cidades.'], 1, 'A frase apresenta dois fatores relacionados ao problema e permite organizar dois eixos argumentativos.'],
    ['Ao usar uma referência histórica na redação, qual estratégia torna o repertório produtivo?', ['Citar uma obra famosa sem explicar a relação', 'Inserir uma frase decorada em qualquer tema', 'Usar muitos nomes para substituir a análise', 'Explicar como a referência sustenta o argumento sobre o tema'], 3, 'O repertório precisa estar relacionado ao tema e integrado ao raciocínio; a simples menção não desenvolve o argumento.'],
  ],
  'red-argumentacao': [
    ['Para que serve o tópico frasal de um parágrafo argumentativo?', ['Apresentar a ideia principal que será desenvolvida', 'Substituir todas as evidências', 'Encerrar obrigatoriamente a redação', 'Inserir uma fala sem relação com a tese'], 0, 'O tópico frasal orienta o parágrafo e precisa ser desenvolvido por explicações, exemplos ou evidências.'],
    ['Qual conectivo completa com coerência? “A internet amplia o acesso à informação; ___, parte da população não tem conexão.”', ['portanto', 'porque', 'no entanto', 'logo'], 2, 'A segunda oração limita a vantagem apresentada; “no entanto” estabelece oposição.'],
    ['Um texto afirma que “a evasão caiu após uma campanha, logo a campanha foi a única causa da queda”. Qual fragilidade existe?', ['Há excesso de coesão entre as frases', 'A sequência temporal, sozinha, não comprova causalidade exclusiva', 'Toda campanha é incapaz de produzir efeitos', 'Dados não podem ser usados em redações'], 1, 'É preciso avaliar outros fatores e evidências. A ocorrência posterior não prova que exista uma causa única.'],
  ],
  'red-intervencao': [
    ['Qual elemento da proposta de intervenção indica quem executará a ação?', ['Finalidade', 'Meio', 'Agente', 'Consequência'], 2, 'O agente é a pessoa, instituição ou grupo responsável por executar a ação proposta.'],
    ['Em “A prefeitura deve ampliar o transporte escolar, por meio da aquisição de ônibus, para reduzir a evasão”, qual é o meio?', ['A prefeitura', 'Ampliar o transporte', 'Reduzir a evasão', 'A aquisição de ônibus'], 3, 'O meio explica como a ação será executada: neste caso, pela aquisição de ônibus.'],
    ['Qual proposta combina detalhamento e respeito aos direitos humanos?', ['Excluir da escola quem faltar para elevar os indicadores', 'A secretaria de educação deve criar busca ativa, com equipes escolares e visitas consentidas, para identificar barreiras à permanência', 'Punir famílias sem investigar por que o aluno falta', 'A sociedade deve resolver tudo, de algum modo'], 1, 'A proposta apresenta agente, ação, meio e finalidade, além de especificar equipes e respeitar as pessoas envolvidas.'],
  ],
  'qui-estequiometria': [
    ['Uma solução contém 10 g de sal em volume final de 2 L. Qual é sua concentração comum?', ['5 g/L', '10 g/L', '20 g/L', '0,2 g/L'], 0, 'A concentração comum é massa/volume: 10 g ÷ 2 L = 5 g/L.'],
    ['Na reação 2 H₂ + O₂ → 2 H₂O, quantos mol de água podem ser formados a partir de 3 mol de O₂ e H₂ em excesso?', ['2 mol', '3 mol', '6 mol', '9 mol'], 2, 'A proporção é 1 mol de O₂ para 2 mol de H₂O; assim, 3 mol produzem 6 mol.'],
    ['Misturam-se 4 mol de H₂ com 1 mol de O₂ segundo 2 H₂ + O₂ → 2 H₂O. Qual é o reagente limitante e a quantidade de água formada?', ['H₂; 4 mol de água', 'O₂; 2 mol de água', 'O₂; 4 mol de água', 'H₂; 1 mol de água'], 1, '1 mol de O₂ consome apenas 2 mol de H₂ e forma 2 mol de água. Sobram 2 mol de H₂.'],
  ],
  'qui-ligacoes': [
    ['Qual tipo de ligação predomina em um cristal de cloreto de sódio (NaCl)?', ['Metálica', 'Covalente apolar', 'Ponte de hidrogênio', 'Iônica'], 3, 'O cristal é formado por íons Na⁺ e Cl⁻ unidos pela atração eletrostática.'],
    ['Por que água e óleo de cozinha formam fases separadas?', ['Porque todo líquido é insolúvel em outro', 'Porque o óleo é iônico e a água é metálica', 'Porque a água é polar e os principais componentes do óleo são predominantemente apolares', 'Porque a água não faz interações intermoleculares'], 2, 'A diferença de polaridade e de interações intermoleculares reduz a miscibilidade entre água e óleo.'],
    ['A molécula de CO₂ tem ligações C=O polares. Por que a molécula é apolar?', ['Sua geometria linear permite o cancelamento dos dipolos das duas ligações', 'O carbono não possui elétrons', 'Toda molécula com oxigênio é apolar', 'Ligações duplas nunca apresentam polaridade'], 0, 'Os dipolos iguais estão em sentidos opostos na geometria linear; a soma vetorial é zero.'],
  ],
  'qui-organica': [
    ['A presença do grupo −COOH caracteriza qual função orgânica?', ['Álcool', 'Ácido carboxílico', 'Cetona', 'Éter'], 1, 'O grupo carboxila (−COOH) é característico dos ácidos carboxílicos.'],
    ['Na combustão completa do etanol, quais produtos são formados?', ['CO e H₂ apenas', 'C sólido e O₂', 'CO₂ e H₂O', 'CH₄ e NaCl'], 2, 'Na combustão completa, o carbono do etanol forma CO₂ e o hidrogênio forma H₂O.'],
    ['Por que o uso de etanol de cana não deve ser descrito simplesmente como “emissão zero”?', ['Porque o etanol não pode ser queimado', 'Porque sua combustão não produz CO₂', 'Porque toda biomassa é um combustível fóssil', 'Porque cultivo, processamento, transporte e uso da terra também influenciam as emissões do ciclo de vida'], 3, 'A cana absorve CO₂ ao crescer, mas a avaliação climática precisa considerar todo o ciclo de produção e as mudanças no uso da terra.'],
  ],
  'fis-mecanica': [
    ['Um carro percorre uma distância total de 120 km em 2 h. Qual é sua velocidade escalar média?', ['60 km/h', '120 km/h', '240 km/h', '30 km/h'], 0, 'A velocidade escalar média é a distância total dividida pelo tempo: 120 ÷ 2 = 60 km/h.'],
    ['Uma força resultante constante de 12 N atua em um corpo de massa 3 kg. Qual é a aceleração?', ['36 m/s²', '9 m/s²', '0,25 m/s²', '4 m/s²'], 3, 'Pela segunda lei de Newton: a = F/m = 12/3 = 4 m/s².'],
    ['Um passageiro é projetado para a frente quando um ônibus freia. Qual explicação usa corretamente a inércia?', ['Uma força misteriosa o empurra necessariamente para a frente', 'Seu corpo tende a conservar o estado de movimento anterior à frenagem', 'Sua massa deixa de existir por alguns instantes', 'A gravidade passa a atuar horizontalmente'], 1, 'A velocidade do corpo tende a se manter até que uma força resultante, como a exercida pelo cinto, a modifique.'],
  ],
  'fis-eletricidade': [
    ['Um resistor de 10 Ω é ligado a uma tensão de 20 V. Qual corrente o atravessa?', ['0,5 A', '10 A', '2 A', '200 A'], 2, 'Pela lei de Ohm: I = V/R = 20/10 = 2 A.'],
    ['Um aparelho de 1.000 W funciona por 2 horas. Qual é a energia consumida?', ['2 kWh', '0,5 kWh', '2.000 kWh', '1 kWh'], 0, '1.000 W = 1 kW. Energia = potência × tempo = 1 × 2 = 2 kWh.'],
    ['Dois resistores de 6 Ω são ligados em paralelo a 12 V. Qual é a corrente total da fonte?', ['1 A', '2 A', '12 A', '4 A'], 3, 'Cada ramo conduz 12/6 = 2 A. A corrente total é 2 + 2 = 4 A; a resistência equivalente é 3 Ω.'],
  ],
  'fis-ondas': [
    ['Qual grandeza de uma onda indica o número de oscilações por segundo?', ['Amplitude', 'Frequência', 'Comprimento de onda', 'Intensidade'], 1, 'Frequência é o número de ciclos por segundo, medido em hertz (Hz).'],
    ['Uma onda se propaga a 340 m/s e tem frequência de 170 Hz. Qual é seu comprimento de onda?', ['0,5 m', '170 m', '2 m', '510 m'], 2, 'Usando v = λf, temos λ = 340/170 = 2 m.'],
    ['Ao passar do ar para o vidro, a luz diminui de velocidade. O que ocorre com frequência e comprimento de onda?', ['A frequência se mantém e o comprimento de onda diminui', 'A frequência aumenta e o comprimento se mantém', 'Ambos aumentam', 'A frequência se anula'], 0, 'A frequência é determinada pela fonte e se mantém na refração; como v = λf, o comprimento diminui com a velocidade.'],
  ],
  'his-brasil': [
    ['Qual atividade teve papel central na economia de exportação do Nordeste colonial nos séculos XVI e XVII?', ['Produção industrial de automóveis', 'Extração de petróleo', 'Cafeicultura mecanizada', 'Produção de açúcar em engenhos'], 3, 'A produção açucareira foi central, articulada ao latifúndio, à exportação e ao trabalho escravizado.'],
    ['A formação de quilombos durante a escravidão no Brasil evidencia principalmente:', ['Aceitação uniforme do cativeiro', 'Resistência e construção de comunidades autônomas', 'Ausência de violência no sistema escravista', 'Fim da escravidão ainda no período colonial'], 1, 'Quilombos expressaram formas diversas de resistência e organização social de pessoas que escapavam da escravidão.'],
    ['Por que a abolição de 1888 não eliminou as desigualdades raciais no Brasil?', ['Porque a lei garantiu automaticamente terra a todas as pessoas libertas', 'Porque desigualdade racial depende apenas de escolhas individuais', 'Porque o fim legal da escravidão não foi acompanhado de inclusão ampla, reparação e acesso igual a direitos', 'Porque a abolição proibiu a contratação de trabalhadores livres'], 2, 'A permanência de estruturas econômicas, políticas e racistas limitou a inclusão da população negra após a abolição.'],
  ],
  'his-republica': [
    ['Qual documento promulgado em 1988 consolidou direitos no processo brasileiro de redemocratização?', ['Constituição Federal', 'Ato Institucional nº 5', 'Lei Áurea', 'Tratado de Tordesilhas'], 0, 'A Constituição de 1988 ampliou direitos e instituições democráticas após a ditadura militar.'],
    ['Durante a Era Vargas, a criação da CLT em 1943 se relacionou a:', ['Extinção de toda legislação trabalhista', 'Garantia imediata de voto universal sem restrições', 'Consolidação de normas trabalhistas com regulação estatal das relações de trabalho', 'Independência do Brasil em relação a Portugal'], 2, 'A CLT reuniu normas trabalhistas; a política de Vargas também envolveu controle estatal sobre sindicatos.'],
    ['O Estado Novo (1937–1945) combinou legislação social e repressão política. Isso mostra que:', ['Direitos sociais impedem qualquer forma de autoritarismo', 'Todos os grupos tinham plena liberdade política', 'A censura não existiu nesse período', 'Avanços em direitos sociais podem coexistir com restrições a direitos civis e políticos'], 3, 'O período teve políticas trabalhistas, mas também censura, repressão e ausência de eleições presidenciais diretas.'],
  ],
  'his-mundo': [
    ['Qual transformação caracteriza a Revolução Industrial iniciada na Inglaterra?', ['Retorno geral à produção artesanal doméstica', 'Expansão da produção mecanizada em fábricas', 'Fim imediato do trabalho assalariado', 'Substituição de cidades por aldeias agrícolas'], 1, 'A mecanização e a concentração fabril alteraram a produção, o trabalho e a urbanização.'],
    ['No século XIX, o imperialismo europeu na África se relacionou a:', ['Busca de mercados, matérias-primas e domínio político-territorial', 'Renúncia europeia a interesses econômicos', 'Independência imediata de todas as sociedades africanas', 'Ausência de justificativas racistas no colonialismo'], 0, 'A expansão colonial articulou interesses econômicos e estratégicos e foi legitimada por ideologias racistas.'],
    ['A divisão internacional do trabalho no contexto imperialista reforçou qual relação?', ['Distribuição igualitária do lucro entre colônias e metrópoles', 'Autossuficiência industrial de todas as colônias', 'Especialização de territórios colonizados na exportação de produtos primários e dependência de centros industriais', 'Eliminação das trocas comerciais entre continentes'], 2, 'A especialização primário-exportadora e o controle externo dos mercados contribuíram para relações de dependência.'],
  ],
  'geo-ambiente': [
    ['Qual bioma brasileiro é associado ao clima semiárido e a plantas adaptadas à escassez de água?', ['Pampa', 'Floresta Amazônica', 'Mata de Araucárias', 'Caatinga'], 3, 'A Caatinga reúne espécies com adaptações à irregularidade das chuvas e aos períodos de seca.'],
    ['O desmatamento da Amazônia pode afetar o regime de chuvas porque:', ['Elimina toda a água dos oceanos', 'Diminui a evapotranspiração e o transporte de umidade para outras regiões', 'Impede qualquer formação de nuvens no planeta', 'Transforma imediatamente toda floresta em deserto'], 1, 'A floresta recicla água pela evapotranspiração, contribuindo para os fluxos atmosféricos de umidade.'],
    ['Qual afirmação distingue corretamente efeito estufa natural e aquecimento global atual?', ['O efeito estufa natural torna a Terra inabitável', 'O aquecimento atual é explicado somente por variações diárias do tempo', 'O efeito estufa natural mantém temperaturas habitáveis, mas o aumento antrópico de gases intensifica a retenção de calor', 'O CO₂ só afeta a temperatura quando há desmatamento'], 2, 'O efeito estufa é natural; emissões humanas, principalmente de gases de efeito estufa, intensificam esse processo.'],
  ],
  'geo-urbana': [
    ['O deslocamento de pessoas do campo para as cidades é chamado de:', ['Êxodo rural', 'Transumância glacial', 'Migração pendular internacional obrigatória', 'Isolamento demográfico'], 0, 'Êxodo rural é a migração do meio rural para o urbano, frequentemente relacionada a mudanças no trabalho e no acesso a serviços.'],
    ['A segregação socioespacial urbana pode ser observada quando:', ['Todos os bairros têm igual acesso a serviços', 'O crescimento urbano não altera o uso do solo', 'Grupos sociais têm acesso desigual à moradia, infraestrutura e transporte', 'A localização da moradia não afeta a vida cotidiana'], 2, 'A separação territorial de grupos sociais e a distribuição desigual de infraestrutura expressam segregação socioespacial.'],
    ['Um país tem queda da natalidade após uma redução anterior da mortalidade. Mantida essa tendência, qual desafio tende a ganhar importância?', ['Aumento obrigatório e permanente da proporção de crianças', 'Envelhecimento populacional e adaptação dos sistemas de saúde e previdência', 'Fim de toda migração', 'Desaparecimento imediato da população economicamente ativa'], 1, 'A transição demográfica pode reduzir o crescimento e elevar a participação de idosos, exigindo adaptação das políticas públicas.'],
  ],
  'geo-economia': [
    ['Na globalização, cadeias produtivas globais são:', ['Atividades sem qualquer transporte ou comunicação', 'Empresas que só atuam dentro de um bairro', 'Sistemas em que cada país produz sozinho tudo o que consome', 'Etapas de produção distribuídas entre diferentes territórios e conectadas por redes'], 3, 'As cadeias globais articulam produção, serviços e logística em vários países.'],
    ['Uma empresa pesquisa num país, fabrica componentes em outro e monta o produto em um terceiro. Qual fator facilita essa organização?', ['Redes de transporte, comunicação e coordenação logística', 'Proibição de comércio internacional', 'Ausência de diferenças nos custos de produção', 'Fim da divisão territorial do trabalho'], 0, 'Transporte e comunicação permitem coordenar etapas distantes, explorando especializações e diferenças territoriais.'],
    ['Uma interrupção de semicondutores em poucos países afeta fábricas no mundo inteiro. O episódio evidencia:', ['Independência total entre economias nacionais', 'Impossibilidade de produção industrial fora da Europa', 'Interdependência e vulnerabilidade decorrentes da concentração de elos de uma cadeia global', 'Fim de todas as redes comerciais'], 2, 'A concentração geográfica de componentes estratégicos pode transmitir choques por toda a cadeia produtiva.'],
  ],
  'fil-etica': [
    ['Na filosofia, a ética investiga principalmente:', ['A composição química do cérebro', 'Os fundamentos e critérios das ações humanas e dos valores', 'Somente regras de etiqueta à mesa', 'As leis do movimento dos planetas'], 1, 'A ética reflete criticamente sobre valores, condutas e critérios para avaliar como agir.'],
    ['Para o utilitarismo clássico, o critério central de avaliação de uma ação é:', ['Obedecer a qualquer ordem, independentemente do dano', 'Preservar somente a vantagem de quem age', 'Avaliar suas consequências para o bem-estar do conjunto dos afetados', 'Repetir costumes sem examiná-los'], 2, 'O utilitarismo clássico considera consequências e busca a maior felicidade ou bem-estar agregado, sem privilegiar apenas o agente.'],
    ['Uma pessoa recusa mentir por entender que a regra de sua ação não poderia valer para todos sem contradição. Essa justificativa se aproxima de:', ['Ética kantiana e universalização da máxima', 'Determinismo geográfico', 'Busca exclusiva do prazer imediato', 'Relativismo que dispensa qualquer justificação'], 0, 'Na ética de Kant, o dever se relaciona à possibilidade de universalizar racionalmente a máxima da ação.'],
  ],
  'fil-politica': [
    ['Nas teorias contratualistas, o contrato social é uma ideia usada para explicar:', ['A origem biológica das espécies', 'O funcionamento das órbitas planetárias', 'A formação de toda regra gramatical', 'A legitimidade da organização política e da autoridade'], 3, 'O contrato social é um modelo filosófico para discutir a constituição e a legitimidade da ordem política; não pressupõe um documento histórico assinado.'],
    ['Para Hobbes, qual problema leva os indivíduos a instituir um poder soberano?', ['A insegurança e o conflito no estado de natureza', 'A garantia natural de paz permanente', 'A inexistência de interesses individuais', 'A necessidade de eliminar toda organização coletiva'], 0, 'Em Hobbes, o soberano deve assegurar a paz e a segurança diante da condição de conflito do estado de natureza.'],
    ['Qual afirmação diferencia corretamente Locke e Hobbes?', ['Locke defende poder político absoluto, sem limites', 'Locke admite resistência a governos que violam direitos, enquanto Hobbes enfatiza um soberano forte para assegurar a paz', 'Hobbes defende eleições anuais como única forma legítima de poder', 'Ambos afirmam que a propriedade privada nunca existiu'], 1, 'Locke limita o governo pela proteção dos direitos naturais e admite resistência; Hobbes destaca o poder soberano como garantia de segurança.'],
  ],
  'fil-conhecimento': [
    ['Qual atitude caracteriza o pensamento crítico?', ['Aceitar uma afirmação apenas porque é popular', 'Recusar qualquer possibilidade de aprender', 'Examinar razões, evidências e pressupostos de uma afirmação', 'Considerar toda opinião automaticamente comprovada'], 2, 'Pensar criticamente envolve avaliar justificativas, fontes e pressupostos, com disposição para revisar conclusões.'],
    ['No debate sobre a origem do conhecimento, o empirismo enfatiza:', ['A experiência sensível como fonte de conhecimento', 'A impossibilidade de qualquer observação', 'A existência exclusiva de ideias inatas', 'A autoridade política como único critério de verdade'], 0, 'O empirismo valoriza o papel da experiência na formação do conhecimento, embora seus autores apresentem diferenças.'],
    ['Uma pesquisa entrevista apenas clientes satisfeitos e conclui que todos aprovam um serviço. Qual problema compromete a inferência?', ['A amostra contém dados demais', 'Toda entrevista é necessariamente falsa', 'Uma conclusão só pode usar informações numéricas', 'Viés de seleção: o grupo entrevistado exclui possíveis experiências negativas'], 3, 'Selecionar somente satisfeitos torna a amostra inadequada para representar todos os usuários. A conclusão extrapola as evidências disponíveis.'],
  ],
  'ing-leitura': [
    ['No aviso “Please keep the door closed”, o que se pede?', ['Que a porta seja pintada', 'Que a porta permaneça fechada', 'Que a porta seja retirada', 'Que a janela seja aberta'], 1, '“Keep ... closed” significa manter algo fechado; “please” torna o pedido mais polido.'],
    ['Leia: “The library is free, but you need a card to borrow books.” Qual afirmação está correta?', ['A biblioteca cobra por todos os livros', 'É proibido levar livros emprestados', 'O cartão é necessário somente para comprar livros', 'Usar a biblioteca é gratuito, mas o empréstimo exige um cartão'], 3, '“Free” significa gratuito nesse contexto; “borrow” significa tomar emprestado.'],
    ['Leia: “Mia packed an umbrella after checking the forecast.” Qual inferência é mais bem sustentada?', ['Mia considerou a possibilidade de chuva', 'Mia já estava necessariamente molhada', 'O texto afirma que choveu o dia inteiro', 'A previsão foi obrigatoriamente incorreta'], 0, 'A escolha do guarda-chuva após consultar a previsão sugere expectativa de chuva; o texto não confirma que ela ocorreu.'],
  ],
  'ing-generos': [
    ['Uma campanha traz “Save water. Every drop counts.” Qual é a intenção principal?', ['Vender um guarda-chuva', 'Narrar uma viagem', 'Incentivar o uso consciente da água', 'Descrever uma regra de gramática'], 2, 'O imperativo “Save” e a valorização de cada gota convidam a economizar água.'],
    ['Um anúncio diz “Buy one, get one free. This weekend only.” Qual recurso incentiva uma decisão rápida?', ['A limitação temporal da promoção', 'A ausência de qualquer oferta', 'A explicação detalhada da fabricação', 'A proibição de comprar no fim de semana'], 0, '“This weekend only” restringe a oferta ao fim de semana, criando senso de urgência.'],
    ['Em uma tirinha, alguém diz “I love being offline” enquanto publica a frase numa rede social. O humor se baseia em:', ['Uma tradução literal de “love” como “ódio”', 'A contradição entre a fala e a ação da personagem', 'Uma prova de que a personagem está sem internet', 'A ausência de qualquer contexto visual'], 1, 'Declarar gostar de ficar desconectado enquanto publica online cria uma contradição irônica.'],
  ],
  'ing-conectivos': [
    ['Qual conectivo em inglês expressa contraste?', ['Because', 'Therefore', 'And', 'However'], 3, '“However” corresponde a “porém” ou “no entanto”, estabelecendo contraste.'],
    ['Complete: “The bus was late, ___ I walked to school.”', ['although', 'so', 'because', 'unless'], 1, '“So” introduz consequência: o ônibus atrasou, então a pessoa foi a pé.'],
    ['Leia: “Solar panels are costly at first. Nevertheless, they can reduce electricity bills.” A que “they” se refere e qual relação “nevertheless” estabelece?', ['Electricity bills; causa', 'Costly; adição', 'Solar panels; concessão ou contraste', 'At first; conclusão'], 2, '“They” retoma “solar panels”; “nevertheless” introduz uma vantagem apesar do custo inicial.'],
  ],
};

export const flashcards = Object.entries(bank).flatMap(([topicId, rows]) =>
  rows.map(([question, options, answer, explanation], index) => ({
    id: `${topicId}-${index + 1}`,
    topicId,
    level: levels[index],
    question,
    options,
    answer,
    explanation,
  })),
);
export const cardsForTopic = (topicId) => flashcards.filter((card) => card.topicId === topicId);
