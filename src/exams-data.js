// Aplicação regular, impressa, cadernos azuis. Nunca misturar cores ao corrigir.
// Fonte primária: acervo do INEP. Os nomes históricos abaixo são documentados
// também nos repositórios listados em docs/enem-fontes.md.
export const ENEM_SOURCE = "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos";
const base = "https://download.inep.gov.br/";
const historic = {
  2017: [
    ["cad_1_prova_azul_5112017.pdf", "cad_1_gabarito_azul_5112017.pdf"],
    ["cad_7_prova_azul_12112017.pdf", "cad_7_gabarito_azul_12112017.pdf"],
  ],
  2018: [
    ["1DIA_01_AZUL_BAIXA.pdf", "GAB_ENEM_2018_DIA_1_AZUL.pdf"],
    ["2DIA_07_AZUL_BAIXA.pdf", "GAB_ENEM_2018_DIA_2_AZUL.pdf"],
  ],
  2019: [
    ["caderno_de_questoes_1_dia_caderno_1_azul_aplicacao_regular.pdf", "gabarito_1_dia_caderno_1_azul_aplicacao_regular.pdf"],
    ["caderno_de_questoes_2_dia_caderno_7_azul_aplicacao_regular.pdf", "gabarito_2_dia_caderno_7_azul_aplicacao_regular.pdf"],
  ],
};
export const examYears = Array.from({ length: 10 }, (_, i) => 2025 - i);
export const exams = examYears.flatMap((year) => [1, 2].map((day) => {
  const oldFormat = year === 2016;
  const booklet = day === 1 ? 1 : 7;
  const files = historic[year]?.[day - 1];
  const folder = files ? `educacao_basica/enem/provas/${year}/` : "enem/provas_e_gabaritos/";
  return {
    id: `enem-${year}-${day}`, year, day,
    source: `${ENEM_SOURCE}/${year}`,
    booklet: oldFormat ? (day === 1 ? 1 : 5) : booklet,
    questions: 90,
    duration: oldFormat ? (day === 1 ? "4h30" : "5h30") : (day === 1 ? "5h30" : year === 2017 ? "4h30" : "5h"),
    areas: oldFormat
      ? (day === 1 ? "Ciências Humanas e Ciências da Natureza" : "Linguagens, Matemática e Redação")
      : (day === 1 ? "Linguagens, Ciências Humanas e Redação" : "Matemática e Ciências da Natureza"),
    proof: oldFormat ? null : `./provas/enem/${year}_PV_impresso_D${day}_CD${booklet}.pdf`,
    officialProof: oldFormat ? null : base + folder + (files?.[0] || `${year}_PV_impresso_D${day}_CD${booklet}.pdf`),
    answer: oldFormat ? null : `./provas/enem/${year}_GB_impresso_D${day}_CD${booklet}.pdf`,
    officialAnswer: oldFormat ? null : base + folder + (files?.[1] || `${year}_GB_impresso_D${day}_CD${booklet}.pdf`),
    oldFormat,
  };
}));
