import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createAppServer } from "../server.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, "../public");

function buildSamplePayload(overrides = {}) {
  return {
    client: { name: "Pax Vida", contactName: "Diretoria" },
    project: {
      title: "Campanha Institucional",
      summary: "Captação e edição de vídeos comerciais",
      validityDays: 10,
    },
    branding: {
      accentColor: "#B91C1C",
      producerName: "Lume Produtora",
      producerWhatsapp: "5567992454721",
    },
    deliverables: {
      captureItems: ["1 diária de captação comercial 4K"],
      editItems: ["2 vídeos comerciais 9:16 com GCs"],
    },
    timeline: [
      { step: 1, title: "Roteiro", duration: "Dia 1", description: "Briefing" },
      { step: 2, title: "Captação", duration: "Dia 2", description: "Diária em campo" },
    ],
    investment: {
      finalTotal: 3200,
      pixTotal: 3040,
      pixDiscountPercent: 5,
      maxInstallments: 3,
      installmentValue: 1066.67,
    },
    ...overrides,
  };
}

test("server API saves proposals non-destructively (_v1, _v2), serves HTML pages, and blocks path traversal", async (t) => {
  const tempStorage = await fs.mkdtemp(path.join(os.tmpdir(), "precificador-test-"));
  const server = createAppServer({ storageDir: tempStorage, publicDir: PUBLIC_DIR });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    await fs.rm(tempStorage, { recursive: true, force: true });
  });

  // 1. Serves calculator and client proposal pages
  const homeRes = await fetch(`${baseUrl}/`);
  assert.equal(homeRes.status, 200);
  assert.ok(homeRes.headers.get("content-security-policy")?.includes("script-src 'self'"));
  const homeHtml = await homeRes.text();
  assert.match(homeHtml, /Precificador/i);

  const propPageRes = await fetch(`${baseUrl}/proposta/pax-vida-campanha-institucional-v1`);
  assert.equal(propPageRes.status, 200);
  const propHtml = await propPageRes.text();
  assert.match(propHtml, /Proposta/i);

  // 2. First POST creates -v1.json
  const createV1 = await fetch(`${baseUrl}/api/orcamentos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildSamplePayload()),
  });
  assert.equal(createV1.status, 201);
  const v1Body = await createV1.json();
  assert.equal(v1Body.success, true);
  assert.equal(v1Body.data.id, "pax-vida-campanha-institucional-v1");

  // 3. Second POST with same client+project creates -v2.json WITHOUT overwriting -v1.json
  const createV2 = await fetch(`${baseUrl}/api/orcamentos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildSamplePayload({ investment: { finalTotal: 3900, pixTotal: 3705, maxInstallments: 4, installmentValue: 975 } })),
  });
  assert.equal(createV2.status, 201);
  const v2Body = await createV2.json();
  assert.equal(v2Body.success, true);
  assert.equal(v2Body.data.id, "pax-vida-campanha-institucional-v2");

  // Verify v1 remains untouched
  const fetchV1 = await fetch(`${baseUrl}/api/orcamentos/pax-vida-campanha-institucional-v1`);
  assert.equal(fetchV1.status, 200);
  const fetchV1Json = await fetchV1.json();
  assert.equal(fetchV1Json.data.investment.finalTotal, 3200);

  // List returns both versions
  const listRes = await fetch(`${baseUrl}/api/orcamentos`);
  assert.equal(listRes.status, 200);
  const listJson = await listRes.json();
  assert.equal(listJson.data.length, 2);

  // 4. Rejects invalid payload with 400
  const invalidRes = await fetch(`${baseUrl}/api/orcamentos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client: { name: "" } }),
  });
  assert.equal(invalidRes.status, 400);

  // 5. Blocks path traversal with 400
  const traversalRes = await fetch(`${baseUrl}/api/orcamentos/..%2F..%2Fpackage`);
  assert.equal(traversalRes.status, 400);

  // 6. Serves static CSS/JS assets, static /orcamentos/:id.json, and handles 404/405/malformed JSON
  const cssRes = await fetch(`${baseUrl}/styles/proposta.css`);
  assert.equal(cssRes.status, 200);
  const staticJsonRes = await fetch(`${baseUrl}/orcamentos/pax-vida-campanha-institucional-v1.json`);
  assert.equal(staticJsonRes.status, 200);
  const missingJsonRes = await fetch(`${baseUrl}/api/orcamentos/nao-existe-v99`);
  assert.equal(missingJsonRes.status, 404);
  const badJsonPost = await fetch(`${baseUrl}/api/orcamentos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{not-valid-json",
  });
  assert.equal(badJsonPost.status, 400);
  const wrongContentType = await fetch(`${baseUrl}/api/orcamentos`, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(buildSamplePayload()),
  });
  assert.equal(wrongContentType.status, 415);
  const crossSitePost = await fetch(`${baseUrl}/api/orcamentos`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Sec-Fetch-Site": "cross-site" },
    body: JSON.stringify(buildSamplePayload()),
  });
  assert.equal(crossSitePost.status, 403);
  const adsRes = await fetch(`${baseUrl}/styles/proposta.css::$DATA`);
  assert.equal(adsRes.status, 400);
  const methodNotAllowed = await fetch(`${baseUrl}/api/orcamentos`, { method: "DELETE" });
  assert.equal(methodNotAllowed.status, 405);
});
