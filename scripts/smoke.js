const { createServer } = require("node:http");
const app = require("../src/app");

const externallyManagedUrl = process.env.SMOKE_BASE_URL;
let server;

async function startLocalServer() {
  server = createServer(app);
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  return `http://127.0.0.1:${server.address().port}`;
}

async function requestWithRetry(url) {
  let lastError;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      return await fetch(url);
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
  throw lastError;
}

async function main() {
  const baseUrl = externallyManagedUrl || (await startLocalServer());
  const health = await requestWithRetry(`${baseUrl}/health`);
  if (!health.ok || (await health.json()).status !== "ok") {
    throw new Error("O endpoint /health não respondeu com status ok.");
  }

  const catalogResponse = await fetch(`${baseUrl}/api/features`);
  const catalog = await catalogResponse.json();
  const feature = catalog.items?.find((item) => item.id === 28);
  if (!catalogResponse.ok || !feature?.implemented) {
    throw new Error("A feature 28 não aparece implementada no catálogo.");
  }

  const resultResponse = await fetch(`${baseUrl}/api/features/28`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      dataInicial: "2026-11-01",
      dataFinal: "2026-11-26",
    }),
  });
  const result = await resultResponse.json();
  if (!resultResponse.ok || result.result?.dias !== 25) {
    throw new Error(
      "A chamada de smoke test da feature 28 retornou resultado inesperado.",
    );
  }

  const invalidResponse = await fetch(`${baseUrl}/api/features/28`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      dataInicial: "2026-02-30",
      dataFinal: "2026-03-01",
    }),
  });
  if (invalidResponse.status !== 400) {
    throw new Error("A API não rejeitou a data inválida com HTTP 400.");
  }

  console.log(
    "Smoke test aprovado: health, catálogo, feature 28 e validação de erro.",
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (server?.listening) {
      await new Promise((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
    }
  });
