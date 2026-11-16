// Sequência de fundamentos alinhada às áreas cobradas no ENEM.
// Conteúdo autoral: os PDFs oficiais ficam na biblioteca de simulados.
const entries = {
  Biologia: [
    ['bio-ecologia', 'Ecologia e relações ecológicas', 'Cadeias e teias alimentares, fluxo de energia e impactos ambientais.'],
    ['bio-celulas', 'Células e metabolismo', 'Organelas, respiração celular e fotossíntese.'],
    ['bio-genetica', 'Genética e hereditariedade', 'Primeira lei de Mendel, genótipo, fenótipo e heredogramas.'],
  ],
  Matemática: [
    ['mat-proporcao', 'Razão, proporção e porcentagem', 'Regra de três, aumentos, descontos e leitura de escalas.'],
    ['mat-funcoes', 'Funções e leitura de gráficos', 'Funções afim e quadrática em situações do cotidiano.'],
    ['mat-estatistica', 'Estatística e probabilidade', 'Média, mediana, gráficos e probabilidade de eventos simples.'],
  ],
  Português: [
    ['por-interpretacao', 'Interpretação e gêneros textuais', 'Tema, tese, inferências e finalidade comunicativa.'],
    ['por-linguagem', 'Variação e funções da linguagem', 'Registro, contexto, função conativa e função poética.'],
    ['por-literatura', 'Literatura e Modernismo', 'Rupturas modernistas e relações entre texto e contexto.'],
  ],
  Redação: [
    ['red-tese', 'Tema, repertório e tese', 'Delimitação do tema e construção de uma tese defendível.'],
    ['red-argumentacao', 'Argumentação e coesão', 'Desenvolvimento com tópico frasal, evidência e análise.'],
    ['red-intervencao', 'Proposta de intervenção', 'Agente, ação, meio, finalidade e detalhamento.'],
  ],
  Química: [
    ['qui-estequiometria', 'Estequiometria e soluções', 'Mol, proporções de reações e concentração comum.'],
    ['qui-ligacoes', 'Ligações e propriedades', 'Ligações iônicas e covalentes, polaridade e solubilidade.'],
    ['qui-organica', 'Química orgânica e ambiente', 'Funções orgânicas, combustíveis e impactos ambientais.'],
  ],
  Física: [
    ['fis-mecanica', 'Movimento e leis de Newton', 'Velocidade, aceleração, forças e equilíbrio.'],
    ['fis-eletricidade', 'Eletricidade e consumo', 'Lei de Ohm, potência e energia elétrica.'],
    ['fis-ondas', 'Ondas e fenômenos ópticos', 'Frequência, comprimento de onda, reflexão e refração.'],
  ],
  História: [
    ['his-brasil', 'Brasil colonial e escravidão', 'Economia colonial, resistências e consequências sociais.'],
    ['his-republica', 'República e cidadania', 'Era Vargas, direitos trabalhistas e redemocratização.'],
    ['his-mundo', 'Revoluções e mundo contemporâneo', 'Revolução Industrial, imperialismo e relações de trabalho.'],
  ],
  Geografia: [
    ['geo-ambiente', 'Clima, biomas e meio ambiente', 'Climas brasileiros, desmatamento e mudanças climáticas.'],
    ['geo-urbana', 'Urbanização e população', 'Migrações, segregação socioespacial e transição demográfica.'],
    ['geo-economia', 'Globalização e geopolítica', 'Redes produtivas, blocos econômicos e desigualdade.'],
  ],
  Filosofia: [
    ['fil-etica', 'Ética e vida em sociedade', 'Ética, moral e critérios para avaliar ações humanas.'],
    ['fil-politica', 'Política, poder e contrato social', 'Estado, cidadania e as teorias do contrato social.'],
    ['fil-conhecimento', 'Conhecimento e pensamento crítico', 'Razão, experiência, dúvida e justificação do conhecimento.'],
  ],
  Inglês: [
    ['ing-leitura', 'Leitura e inferência em inglês', 'Ideia central, cognatos e informações implícitas.'],
    ['ing-generos', 'Gêneros e intenção comunicativa', 'Anúncios, tirinhas e campanhas de conscientização.'],
    ['ing-conectivos', 'Conectivos e contexto', 'Contraste, causa, consequência e referência pronominal.'],
  ],
};
export const curriculum = Object.fromEntries(Object.entries(entries).map(([subject, rows]) => [subject, rows.map(([id, title, description]) => ({ id, subject, title, description }))]));
export const topics = Object.values(curriculum).flat();
export const topicsFor = (subject) => curriculum[subject] || curriculum.Matemática;
export const topicById = (id) => topics.find((topic) => topic.id === id);
