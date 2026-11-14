import test from "node:test";
import assert from "node:assert/strict";
import {
  slugify,
  buildBaseSlug,
  validateProposal,
  encodeProposalParam,
  decodeProposalParam,
} from "../public/js/proposal-codec.mjs";

test("slugify and buildBaseSlug normalize accents, spaces and unsafe characters", () => {
  assert.equal(slugify("Campanha São Paulo — Vídeo #01!"), "campanha-sao-paulo-video-01");
  assert.equal(
    buildBaseSlug("PAX VIDA Assistência", "Campanha Capela Velório"),
    "pax-vida-assistencia-campanha-capela-velorio",
  );
  assert.equal(slugify("../../../etc/passwd"), "etc-passwd");
});

test("validateProposal rejects missing required fields or invalid investment values", () => {
  const invalid = validateProposal({
    client: { name: "" },
    project: { title: "   " },
    investment: { finalTotal: -50 },
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.length >= 3);

  const valid = validateProposal({
    client: { name: "Pax Vida", contactName: "Ana" },
    project: { title: "Campanha Institucional", validityDays: 10 },
    branding: { accentColor: "#B91C1C", producerName: "Lume" },
    deliverables: { captureItems: ["Diária 8h"], editItems: ["2 Reels 9:16"] },
    timeline: [{ step: 1, title: "Captação", duration: "Dia 1", description: "Gravação em locação" }],
    investment: { finalTotal: 3500, pixTotal: 3325, maxInstallments: 3, installmentValue: 1166.67 },
  });
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, []);
});

test("encodeProposalParam and decodeProposalParam preserve UTF-8 accents and nested structure", () => {
  const proposal = {
    id: "pax-vida-capela-v1",
    client: { name: "Pax Vida Funerária", contactName: "João Paulo" },
    project: {
      title: "Vídeo Capela Velório & Cremação",
      summary: "Captação cinematográfica + edição com GCs em Montserrat.",
      validityDays: 15,
    },
    branding: {
      accentColor: "#B91C1C",
      producerName: "Lume Produtora",
      producerWhatsapp: "5567992454721",
    },
    deliverables: {
      captureItems: ["1 diária completa 4K Log", "Captação aérea com Drone"],
      editItems: ["4 vídeos comerciais 9:16", "GCs animados blur-up"],
    },
    timeline: [
      { step: 1, title: "Alinhamento", duration: "Dia 1", description: "Roteiro e pauta" },
      { step: 2, title: "Gravação", duration: "Dia 2", description: "Captação na unidade" },
    ],
    investment: {
      finalTotal: 4800,
      pixTotal: 4560,
      pixDiscountPercent: 5,
      maxInstallments: 4,
      installmentValue: 1200,
    },
  };

  const encoded = encodeProposalParam(proposal);
  assert.match(encoded, /^[A-Za-z0-9_-]+$/);

  const decoded = decodeProposalParam(encoded);
  assert.deepEqual(decoded, proposal);

  assert.throws(() => decodeProposalParam("%%%invalid%%%"), /inválido|invalid/i);
});
