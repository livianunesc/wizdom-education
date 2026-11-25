export const processes = {
  fuvest: { name: 'FUVEST', portal: 'https://www.fuvest.br/', archive: 'https://www.fuvest.br/vestibulares-anteriores/', format: 'Primeira fase objetiva e segunda fase discursiva, com redação. As disciplinas específicas dependem da carreira e do manual da edição.',
    priorities: ['Resolver questões objetivas em tempo limitado', 'Escrever respostas discursivas justificadas', 'Treinar redação e revisar a argumentação'] },
  comvest: { name: 'Vestibular Unicamp', portal: 'https://www.comvest.unicamp.br/', archive: 'https://www.comvest.unicamp.br/vestibulares-anteriores/', format: 'Primeira fase objetiva. Segunda fase com questões discursivas e redação por gêneros textuais. Consulte as disciplinas específicas do curso no edital.',
    priorities: ['Abrir uma prova da Comvest e classificar os erros', 'Resolver duas questões discursivas mostrando cada etapa do raciocínio', 'Escrever um texto atendendo ao gênero e ao público da proposta'] },
  enem: { name: 'ENEM / SiSU', portal: 'https://acessounico.mec.gov.br/sisu', format: 'Duas aplicações: Linguagens, Humanas e redação no primeiro dia; Natureza e Matemática no segundo. Pesos e notas mínimas podem variar pela oferta.',
    priorities: ['Resolver e corrigir questões de uma prova do INEP', 'Treinar redação dissertativo-argumentativa com proposta de intervenção', 'Revisar os erros por área de conhecimento'] },
  vunesp: { name: 'Vestibular Unesp', portal: 'https://vestibular.unesp.br/', archive: 'https://www.vunesp.com.br/', format: 'Consulte os cadernos e as regras de cada fase na edição escolhida.' },
  pucsp: { name: 'Vestibular PUC-SP', portal: 'https://www.pucsp.br/vestibular/' },
  puccampinas: { name: 'Vestibular PUC-Campinas', portal: 'https://www.puc-campinas.edu.br/vestibular/' },
  ufpr: { name: 'Vestibular UFPR', portal: 'https://servicos.nc.ufpr.br/', archive: 'https://servicos.nc.ufpr.br/' },
  unb: { name: 'Vestibular UnB', portal: 'https://www.unb.br/estude-na-unb/graduacao' },
  ufpa: { name: 'Processo seletivo UFPA', portal: 'https://www.ceps.ufpa.br/' },
};

const institutions = {
  usp: ['USP', 'Universidade de São Paulo', 'Pública', 'Sudeste'],
  unicamp: ['UNICAMP', 'Universidade Estadual de Campinas', 'Pública', 'Sudeste'],
  unesp: ['UNESP', 'Universidade Estadual Paulista', 'Pública', 'Sudeste'],
  ufmg: ['UFMG', 'Universidade Federal de Minas Gerais', 'Pública', 'Sudeste'],
  pucsp: ['PUC-SP', 'Pontifícia Universidade Católica de São Paulo', 'Particular', 'Sudeste'],
  puccampinas: ['PUC-Campinas', 'Pontifícia Universidade Católica de Campinas', 'Particular', 'Sudeste'],
  ufpr: ['UFPR', 'Universidade Federal do Paraná', 'Pública', 'Sul'],
  ufpe: ['UFPE', 'Universidade Federal de Pernambuco', 'Pública', 'Nordeste'],
  unb: ['UnB', 'Universidade de Brasília', 'Pública', 'Centro-Oeste'],
  ufpa: ['UFPA', 'Universidade Federal do Pará', 'Pública', 'Norte'],
};

const campuses = {
  'usp-sp': ['usp', 'São Paulo', 'SP', 'São Paulo'],
  'unicamp-campinas': ['unicamp', 'Campinas', 'SP', 'Barão Geraldo'],
  'unesp-bauru': ['unesp', 'Bauru', 'SP', 'Bauru'],
  'ufmg-bh': ['ufmg', 'Belo Horizonte', 'MG', 'Belo Horizonte'],
  'pucsp-sp': ['pucsp', 'São Paulo', 'SP', 'Monte Alegre'],
  'puccamp-campinas': ['puccampinas', 'Campinas', 'SP', 'Campus I'],
  'ufpr-curitiba': ['ufpr', 'Curitiba', 'PR', 'Curitiba'],
  'ufpe-recife': ['ufpe', 'Recife', 'PE', 'Recife'],
  'unb-brasilia': ['unb', 'Brasília', 'DF', 'Darcy Ribeiro'],
  'ufpa-belem': ['ufpa', 'Belém', 'PA', 'Belém'],
};

const courses = {
  med: 'Medicina', mec: 'Engenharia Mecânica', psi: 'Psicologia', dir: 'Direito',
  cc: 'Ciência da Computação', civil: 'Engenharia Civil', design: 'Design',
};

const offers = [
  ['usp-med', 'usp-sp', 'med', 'fuvest'],
  ['unicamp-med', 'unicamp-campinas', 'med', 'comvest'],
  ['unicamp-mec', 'unicamp-campinas', 'mec', 'comvest'],
  ['unesp-design', 'unesp-bauru', 'design', 'vunesp'],
  ['ufmg-med', 'ufmg-bh', 'med', 'enem'],
  ['puc-psi', 'pucsp-sp', 'psi', 'pucsp'],
  ['puccamp-civil', 'puccamp-campinas', 'civil', 'puccampinas'],
  ['ufpr-direito', 'ufpr-curitiba', 'dir', 'ufpr'],
  ['ufpe-computacao', 'ufpe-recife', 'cc', 'enem'],
  ['unb-eng', 'unb-brasilia', 'civil', 'unb'],
  ['ufpa-med', 'ufpa-belem', 'med', 'ufpa'],
];

export const universities = offers.map(([id, campusId, courseId, processId]) => {
  const [institutionId, city, uf, campus] = campuses[campusId];
  const [acronym, name, type, region] = institutions[institutionId];
  const process = processes[processId];
  return { id, institutionId, campusId, courseId, processId, acronym, name, type, region, uf, campus,
    course: courses[courseId], city: city + ', ' + uf, entry: process.name, link: process.portal,
    tone: 'lavender', edition: null };
});

export const prioritiesFor = id => processes[id]?.priorities || [
  'Leia o edital e monte uma lista dos conteúdos cobrados',
  'Resolva um bloco de questões do processo e anote seus erros',
  'Retome os pontos difíceis e revise as respostas',
];
