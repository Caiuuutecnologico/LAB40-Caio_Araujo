// Funcionalidade 28: Calculadora de dias entre datas.
// Objetivo: Calcula diferença absoluta em dias entre duas datas.
// Exemplo de entrada: { dataInicial: '2026-11-01', dataFinal: '2026-11-26' }

const implemented = true;

function parseIsoDate(value, fieldName) {
  if (typeof value !== "string") {
    throw new Error(`O campo ${fieldName} deve ser uma data no formato AAAA-MM-DD.`);
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    throw new Error(`O campo ${fieldName} deve estar no formato AAAA-MM-DD.`);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);

  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new Error(`O campo ${fieldName} não contém uma data válida.`);
  }

  return date.getTime();
}

function execute(input) {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("A entrada deve ser um objeto com dataInicial e dataFinal.");
  }

  const inicio = parseIsoDate(input.dataInicial, "dataInicial");
  const fim = parseIsoDate(input.dataFinal, "dataFinal");
  const dias = Math.abs(fim - inicio) / 86400000;

  return { dias };
}

module.exports = {
  id: 28,
  name: "Calculadora de dias entre datas",
  description: "Calcula diferença absoluta em dias entre duas datas.",
  implemented,
  execute
};
