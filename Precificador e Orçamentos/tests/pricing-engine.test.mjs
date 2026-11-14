import test from "node:test";
import assert from "node:assert/strict";
import {
  CAPTURE_TIERS,
  CAPTURE_ADDONS,
  EDIT_TIERS,
  DEFAULT_TIMELINE,
} from "../public/js/catalog.mjs";
import {
  calculateBudget,
  buildDeliverablesList,
  buildDefaultTimeline,
  createProposalDocument,
} from "../public/js/pricing-engine.mjs";

test("catalog exposes capture and edit tiers from basic to advanced", () => {
  assert.ok(CAPTURE_TIERS.nenhuma);
  assert.ok(CAPTURE_TIERS.basica);
  assert.ok(CAPTURE_TIERS.intermediaria);
  assert.ok(CAPTURE_TIERS.avancada);
  assert.ok(CAPTURE_ADDONS.drone);
  assert.ok(CAPTURE_ADDONS.teleprompter);
  assert.ok(CAPTURE_ADDONS.deslocamento);
  assert.ok(CAPTURE_ADDONS.operador_extra);
  assert.ok(EDIT_TIERS.basica);
  assert.ok(EDIT_TIERS.intermediaria);
  assert.ok(EDIT_TIERS.avancada);
  assert.ok(Array.isArray(DEFAULT_TIMELINE) && DEFAULT_TIMELINE.length >= 4);
});

test("calculateBudget computes capture, addons, edits, margin, tax, pix and installments immutably", () => {
  const input = {
    captureTier: "intermediaria",
    captureDays: 2,
    captureDayRate: 1200,
    addons: {
      drone: { enabled: true, qty: 1, price: 450 },
      teleprompter: { enabled: true, qty: 1, price: 200 },
      deslocamento: { enabled: false, qty: 0, price: 150 },
      operador_extra: { enabled: false, qty: 0, price: 500 },
    },
    edits: {
      basica: { qty: 2, price: 250 },
      intermediaria: { qty: 2, price: 550 },
      avancada: { qty: 0, price: 1200 },
    },
    orientation: "vertical",
    motionPackagePrice: 300,
    operationalCosts: 250,
    marginPercent: 30,
    taxPercent: 10,
    pixDiscountPercent: 5,
    maxInstallments: 4,
    customFinalTotal: null,
  };

  const snapshot = structuredClone(input);
  const result = calculateBudget(input);

  // Immutability check
  assert.deepEqual(input, snapshot);

  // captureBaseCost = 2 * 1200 = 2400; addons = 450 + 200 = 650 => captureSubtotal = 3050
  assert.equal(result.captureBaseCost, 2400);
  assert.equal(result.addonsCost, 650);
  assert.equal(result.captureSubtotal, 3050);

  // edits = (2 * 250) + (2 * 550) = 500 + 1100 = 1600; motion = 300 => editSubtotal = 1900
  assert.equal(result.editSubtotal, 1900);

  // baseCost = 3050 + 1900 + 250 = 5200
  assert.equal(result.baseCost, 5200);

  // margin = 30% of 5200 = 1560 => subtotal before tax = 6760
  // tax = 10% of 6760 = 676 => suggestedTotal = 7436
  assert.equal(result.marginAmount, 1560);
  assert.equal(result.taxAmount, 676);
  assert.equal(result.suggestedTotal, 7436);
  assert.equal(result.finalTotal, 7436);

  // pix = 5% off 7436 = 7064.2
  assert.equal(result.pixDiscountAmount, 371.8);
  assert.equal(result.pixTotal, 7064.2);

  // 4 installments of 7436 = 1859
  assert.equal(result.installmentValue, 1859);
  assert.ok(result.profitNet > 0);
});

test("calculateBudget respects customFinalTotal override and zero-capture edit-only budgets", () => {
  const result = calculateBudget({
    captureTier: "nenhuma",
    captureDays: 3,
    captureDayRate: 900,
    addons: {
      drone: { enabled: true, qty: 1, price: 450 },
    },
    edits: {
      basica: { qty: 0, price: 250 },
      intermediaria: { qty: 0, price: 550 },
      avancada: { qty: 1, price: 1500 },
    },
    motionPackagePrice: 0,
    operationalCosts: 0,
    marginPercent: 20,
    taxPercent: 0,
    pixDiscountPercent: 10,
    maxInstallments: 3,
    customFinalTotal: 2000,
  });

  // When captureTier is 'nenhuma', capture base cost must be 0
  assert.equal(result.captureBaseCost, 0);
  assert.equal(result.finalTotal, 2000);
  assert.equal(result.pixTotal, 1800);
  assert.equal(result.installmentValue, 666.67);
});

test("buildDeliverablesList and createProposalDocument build personalized client structure", () => {
  const config = {
    captureTier: "avancada",
    captureDays: 1,
    captureDayRate: 2200,
    addons: {
      drone: { enabled: true, qty: 1, price: 450 },
    },
    edits: {
      basica: { qty: 0, price: 250 },
      intermediaria: { qty: 3, price: 550 },
      avancada: { qty: 1, price: 1400 },
    },
    orientation: "ambos",
    revisionRounds: 2,
    motionPackagePrice: 400,
  };

  const deliverables = buildDeliverablesList(config);
  assert.ok(deliverables.captureItems.length >= 2);
  assert.ok(deliverables.editItems.some((item) => item.includes("3 vídeos")));
  assert.ok(deliverables.editItems.some((item) => item.includes("1 vídeo")));
  assert.ok(deliverables.editItems.some((item) => item.includes("9:16") && item.includes("16:9")));

  const calc = calculateBudget(config);
  const doc = createProposalDocument(
    {
      clientName: "Pax Vida",
      contactName: "Ricardo Mendes",
      projectTitle: "Campanha Capela & Plano 2026",
      summary: "Produção audiovisual completa com captação e edição de alta conversão.",
      validityDays: 10,
      accentColor: "#B91C1C",
      producerName: "Lume Produtora",
      producerWhatsapp: "5567992454721",
      customDeliverables: deliverables,
      timeline: DEFAULT_TIMELINE,
      paymentNotes: "50% na aprovação e 50% na entrega dos masters.",
    },
    calc,
  );

  assert.equal(doc.client.name, "Pax Vida");
  assert.equal(doc.project.title, "Campanha Capela & Plano 2026");
  assert.equal(doc.branding.accentColor, "#B91C1C");
  assert.equal(doc.investment.finalTotal, calc.finalTotal);
  assert.ok(doc.deliverables.captureItems.length > 0);
  assert.ok(doc.timeline.length >= 4);
  // Internal margin/cost breakdown must not be exposed directly as client-facing investment fields
  assert.equal("baseCost" in doc.investment, false);

  const fullTimeline = buildDefaultTimeline({ captureTier: "basica" });
  const editOnlyTimeline = buildDefaultTimeline({ captureTier: "nenhuma" });
  assert.equal(fullTimeline.length, DEFAULT_TIMELINE.length);
  assert.equal(editOnlyTimeline.length, DEFAULT_TIMELINE.length - 1);
  assert.equal(editOnlyTimeline[1].step, 2);
});
