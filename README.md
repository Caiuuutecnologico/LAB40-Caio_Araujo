# LAB40 – Laboratório de Funcionalidades Web

Projeto-base para avaliação prática de Integração e Entrega Contínua (CI/CD).

## Requisitos

- Node.js 20 ou superior.
- npm.
- Docker para build e execução local do container.

## Executar localmente

```bash
npm ci
npm start
```

Acesse http://localhost:3000. Para desenvolvimento com reinicialização automática: `npm run dev`.

## Endpoints

- `GET /health`: verificação de disponibilidade.
- `GET /api/features`: lista as 40 funcionalidades e seus estados.
- `POST /api/features/:id`: executa uma funcionalidade, recebendo JSON no corpo.

Exemplo:

```bash
curl -X POST http://localhost:3000/api/features/28 -H "Content-Type: application/json" -d '{"dataInicial":"2026-11-01","dataFinal":"2026-11-26"}'
```

## Qualidade e testes

Execute as verificações na raiz do repositório, após instalar as dependências:

```bash
npm ci
npm test
npm run lint
npm run format:check
npm run test:smoke
npm audit --audit-level=high
```

`npm test` executa os testes automatizados com o runner nativo `node:test`; `npm run lint` verifica a feature 28, os testes e os scripts; `npm run format:check` verifica a formatação; `npm run test:smoke` consulta a API local. A auditoria registrada em 27/11/2026 terminou com código 0 e resultado `found 0 vulnerabilities` para `npm audit --audit-level=high`.

### Roteiro de teste manual (PowerShell)

Execute os passos na ordem. Mantenha o servidor aberto no passo 3 e use outro terminal para os passos seguintes.

1. Na raiz do projeto, instale as dependências: `npm ci`.
2. Confira a suíte automatizada: `npm test`.
3. Inicie a aplicação: `npm start`.
4. Em outro terminal, confirme que o servidor está ativo: `Invoke-RestMethod http://localhost:3000/health`. O campo `status` deve ser `ok`.
5. Consulte o catálogo: `(Invoke-RestMethod http://localhost:3000/api/features).items | Where-Object id -eq 28`. A feature deve aparecer com `implemented` igual a `True`.
6. Envie uma entrada válida: `Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/features/28 -ContentType 'application/json' -Body '{"dataInicial":"2026-11-01","dataFinal":"2026-11-26"}'`. O campo `result.dias` deve ser `25`.
7. Envie uma data inválida e confirme HTTP 400: `try { Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/features/28 -ContentType 'application/json' -Body '{"dataInicial":"2026-02-30","dataFinal":"2026-03-01"}' } catch { $_.Exception.Response.StatusCode }`. A resposta deve indicar `BadRequest`.

## Docker

```bash
docker build --pull -t lab40:local .
docker run --rm -p 3000:3000 lab40:local
```

A imagem instala apenas dependências de produção e não inclui testes, documentação ou arquivos `.env`.

## CI e CD simulado

O workflow `CI` é executado em `push` e `pull_request`. Ele instala dependências com `npm ci`, verifica formatação, lint, testes, auditoria e smoke test, depois constrói e testa o container e publica a imagem como artefato do workflow.

O workflow `CD simulado` roda após `push` na branch `main` e publica o artefato `lab40-delivery-record`, contendo a imagem `.tar` e `deployment-record.txt` com repositório, referência, SHA e tag. Ele registra a entrega; não implanta em um ambiente externo.

## Estrutura

```text
lab40/
├── .github/workflows/
├── public/
├── scripts/
├── src/
│   ├── app.js
│   ├── server.js
│   └── features/
├── test/
├── Dockerfile
├── package.json
└── package-lock.json
```

## Contrato de cada módulo

Cada arquivo `src/features/featureNN.js` exporta `id`, `name`, `description`, `implemented` e `execute(input)`.

1. Implemente `execute(input)`.
2. Valide os dados recebidos.
3. Retorne um objeto serializável em JSON.
4. Trate entradas inválidas lançando `Error` com mensagem clara.
5. Depois de implementar e validar, altere `implemented` para `true`.
6. Não altere o contrato dos outros módulos nem a API central sem autorização.

Enquanto `implemented` for `false`, a API retorna HTTP 501 para aquele módulo.

## Importante

Este repositório é entregue intencionalmente sem configuração geral de deploy. O CD incluído é uma simulação para gerar e registrar o artefato da imagem, sem publicar em registry ou implantar em infraestrutura externa.

O servidor escuta `process.env.PORT` e `0.0.0.0`, e a aplicação não persiste dados em disco.
