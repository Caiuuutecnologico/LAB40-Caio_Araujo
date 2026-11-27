const test = require("node:test");
const assert = require("node:assert/strict");
const feature = require("../src/features/feature28");

test("calcula a diferença absoluta em dias", () => {
  assert.equal(
    feature.execute({ dataInicial: "2026-11-01", dataFinal: "2026-11-26" })
      .dias,
    25,
  );
});

test("mesmo dia retorna zero e datas invertidas continuam positivas", () => {
  assert.equal(
    feature.execute({ dataInicial: "2026-11-26", dataFinal: "2026-11-26" })
      .dias,
    0,
  );
  assert.equal(
    feature.execute({ dataInicial: "2026-11-26", dataFinal: "2026-11-01" })
      .dias,
    25,
  );
});

test("calcula corretamente atravessando ano bissexto e mês", () => {
  assert.equal(
    feature.execute({ dataInicial: "2024-02-28", dataFinal: "2024-03-01" })
      .dias,
    2,
  );
});

test("rejeita datas inexistentes, formatos inválidos e campos ausentes", () => {
  for (const input of [
    { dataInicial: "2026-02-30", dataFinal: "2026-03-01" },
    { dataInicial: "26/11/2026", dataFinal: "2026-11-26" },
    { dataInicial: "2026-11-01" },
    { dataInicial: 20261101, dataFinal: "2026-11-26" },
    null,
    [],
  ]) {
    assert.throws(() => feature.execute(input), { name: "Error" });
  }
});
