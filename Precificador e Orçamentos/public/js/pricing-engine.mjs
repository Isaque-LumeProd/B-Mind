import { CAPTURE_TIERS, CAPTURE_ADDONS, EDIT_TIERS, ORIENTATIONS, DEFAULT_TIMELINE } from "./catalog.mjs";

function toNonNegativeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function roundCurrency(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Calcula de forma imutavel todos os custos, impostos, margens e condicoes de pagamento.
 */
export function calculateBudget(rawConfig = {}) {
  const captureTier = rawConfig.captureTier ?? "nenhuma";
  const captureDays = toNonNegativeNumber(rawConfig.captureDays, 0);
  const tierInfo = CAPTURE_TIERS[captureTier] ?? CAPTURE_TIERS.nenhuma;
  const captureDayRate = toNonNegativeNumber(rawConfig.captureDayRate, tierInfo.defaultDayRate);

  const captureBaseCost =
    captureTier === "nenhuma" ? 0 : roundCurrency(captureDays * captureDayRate);

  const addonsInput = rawConfig.addons ?? {};
  let addonsCost = 0;
  for (const [key, addonSpec] of Object.entries(CAPTURE_ADDONS)) {
    const entry = addonsInput[key];
    if (entry?.enabled) {
      const qty = toNonNegativeNumber(entry.qty, 1);
      const price = toNonNegativeNumber(entry.price, addonSpec.defaultPrice);
      addonsCost += qty * price;
    }
  }
  addonsCost = roundCurrency(addonsCost);
  const captureSubtotal = roundCurrency(captureBaseCost + addonsCost);

  const editsInput = rawConfig.edits ?? {};
  let editsCost = 0;
  for (const [tierKey, editSpec] of Object.entries(EDIT_TIERS)) {
    const entry = editsInput[tierKey];
    const qty = toNonNegativeNumber(entry?.qty, 0);
    const price = toNonNegativeNumber(entry?.price, editSpec.defaultPrice);
    editsCost += qty * price;
  }
  const motionPackagePrice = toNonNegativeNumber(rawConfig.motionPackagePrice, 0);
  const editSubtotal = roundCurrency(editsCost + motionPackagePrice);

  const operationalCosts = toNonNegativeNumber(rawConfig.operationalCosts, 0);
  const baseCost = roundCurrency(captureSubtotal + editSubtotal + operationalCosts);

  const marginPercent = toNonNegativeNumber(rawConfig.marginPercent, 0);
  const taxPercent = toNonNegativeNumber(rawConfig.taxPercent, 0);

  const marginAmount = roundCurrency(baseCost * (marginPercent / 100));
  const subtotalBeforeTax = roundCurrency(baseCost + marginAmount);
  const taxAmount = roundCurrency(subtotalBeforeTax * (taxPercent / 100));
  const suggestedTotal = roundCurrency(subtotalBeforeTax + taxAmount);

  const rawCustom = rawConfig.customFinalTotal;
  const hasCustomTotal = rawCustom !== null && rawCustom !== undefined && Number(rawCustom) > 0;
  const finalTotal = hasCustomTotal ? roundCurrency(Number(rawCustom)) : suggestedTotal;

  const pixDiscountPercent = Math.min(100, toNonNegativeNumber(rawConfig.pixDiscountPercent, 0));
  const pixDiscountAmount = roundCurrency(finalTotal * (pixDiscountPercent / 100));
  const pixTotal = roundCurrency(finalTotal - pixDiscountAmount);

  const maxInstallments = Math.max(1, Math.round(toNonNegativeNumber(rawConfig.maxInstallments, 1)));
  const installmentValue = roundCurrency(finalTotal / maxInstallments);

  const effectiveTax = hasCustomTotal
    ? roundCurrency(finalTotal * (taxPercent / (100 + taxPercent)))
    : taxAmount;
  const profitNet = roundCurrency(finalTotal - baseCost - effectiveTax);
  const effectiveMarginPercent =
    finalTotal > 0 ? roundCurrency((profitNet / finalTotal) * 100) : 0;

  return {
    captureBaseCost,
    addonsCost,
    captureSubtotal,
    editsCost: roundCurrency(editsCost),
    motionPackagePrice: roundCurrency(motionPackagePrice),
    editSubtotal,
    operationalCosts: roundCurrency(operationalCosts),
    baseCost,
    marginPercent,
    marginAmount,
    taxPercent,
    taxAmount,
    suggestedTotal,
    finalTotal,
    pixDiscountPercent,
    pixDiscountAmount,
    pixTotal,
    maxInstallments,
    installmentValue,
    profitNet,
    effectiveMarginPercent,
    usedCustomTotal: hasCustomTotal,
  };
}

/**
 * Gera a lista estruturada de entregaveis para exibicao clara na pagina do cliente.
 */
export function buildDeliverablesList(rawConfig = {}) {
  const captureTier = rawConfig.captureTier ?? "nenhuma";
  const captureDays = toNonNegativeNumber(rawConfig.captureDays, 0);
  const tierInfo = CAPTURE_TIERS[captureTier] ?? CAPTURE_TIERS.nenhuma;

  const captureItems = [];
  if (captureTier !== "nenhuma" && captureDays > 0) {
    const dayLabel = captureDays === 1 ? "1 diaria" : `${captureDays} diarias`;
    captureItems.push(`${tierInfo.shortLabel} — ${dayLabel}`);
    for (const line of tierInfo.deliverables) {
      captureItems.push(line);
    }
  }

  const addonsInput = rawConfig.addons ?? {};
  for (const [key, addonSpec] of Object.entries(CAPTURE_ADDONS)) {
    const entry = addonsInput[key];
    if (entry?.enabled) {
      const qty = Math.max(1, Math.round(toNonNegativeNumber(entry.qty, 1)));
      const suffix = qty > 1 ? ` (${qty}x)` : "";
      captureItems.push(`${addonSpec.deliverableText}${suffix}`);
    }
  }

  const editItems = [];
  const orientationSpec = ORIENTATIONS[rawConfig.orientation ?? "vertical"] ?? ORIENTATIONS.vertical;
  const editsInput = rawConfig.edits ?? {};

  for (const [tierKey, editSpec] of Object.entries(EDIT_TIERS)) {
    const qty = Math.round(toNonNegativeNumber(editsInput[tierKey]?.qty, 0));
    if (qty > 0) {
      const unitLabel = qty === 1 ? "1 vídeo" : `${qty} vídeos`;
      editItems.push(`${unitLabel} — ${editSpec.shortLabel}: ${editSpec.description}`);
    }
  }

  if (toNonNegativeNumber(rawConfig.motionPackagePrice, 0) > 0) {
    editItems.push("Pacote personalizado de GCs e Motion Graphics na identidade visual da empresa");
  }

  if (editItems.length > 0) {
    editItems.push(`Entrega finalizada em ${orientationSpec.specText}`);
    const revisions = Math.max(1, Math.round(toNonNegativeNumber(rawConfig.revisionRounds, 2)));
    editItems.push(`Inclusas ate ${revisions} rodadas consolidadas de revisao e ajustes finos`);
  }

  return { captureItems, editItems };
}

/**
 * Sugere um cronograma base coerente com o escopo (com ou sem captacao em locacao).
 */
export function buildDefaultTimeline(rawConfig = {}) {
  const hasCapture = (rawConfig.captureTier ?? "nenhuma") !== "nenhuma";
  if (hasCapture) {
    return DEFAULT_TIMELINE.map((item) => ({ ...item }));
  }

  return DEFAULT_TIMELINE.filter((item) => item.step !== 2).map((item, idx) => ({
    ...item,
    step: idx + 1,
    duration: idx === 0 ? "Dia 1" : idx === 1 ? "Dias 2 a 5" : idx === 2 ? "Dias 6 a 7" : "Dia 8",
  }));
}

/**
 * Monta o documento publico da proposta sem vazar custos internos ou margem da produtora.
 */
export function createProposalDocument(formState = {}, calculation = {}) {
  const nowIso = formState.issuedAt ?? new Date().toISOString();
  const validityDays = Math.max(1, Math.round(toNonNegativeNumber(formState.validityDays, 10)));
  const expiresDate = new Date(new Date(nowIso).getTime() + validityDays * 86_400_000);

  const deliverables = formState.customDeliverables ?? { captureItems: [], editItems: [] };
  const timeline = Array.isArray(formState.timeline) ? formState.timeline : [];

  return {
    version: 1,
    issuedAt: nowIso,
    expiresAt: expiresDate.toISOString(),
    client: {
      name: String(formState.clientName ?? "").trim(),
      contactName: String(formState.contactName ?? "").trim(),
      segment: String(formState.clientSegment ?? "").trim(),
    },
    project: {
      title: String(formState.projectTitle ?? "").trim(),
      summary: String(formState.summary ?? "").trim(),
      validityDays,
    },
    branding: {
      accentColor: String(formState.accentColor ?? "#D97706").trim() || "#D97706",
      producerName: String(formState.producerName ?? "Lume Produtora").trim(),
      producerWhatsapp: String(formState.producerWhatsapp ?? "").replace(/\D/g, ""),
      producerInstagram: String(formState.producerInstagram ?? "").trim(),
    },
    deliverables: {
      captureItems: [...(deliverables.captureItems ?? [])],
      editItems: [...(deliverables.editItems ?? [])],
    },
    timeline: timeline.map((item, index) => ({
      step: Number(item.step ?? index + 1),
      title: String(item.title ?? "").trim(),
      duration: String(item.duration ?? "").trim(),
      description: String(item.description ?? "").trim(),
    })),
    investment: {
      finalTotal: Number(calculation.finalTotal ?? 0),
      pixTotal: Number(calculation.pixTotal ?? 0),
      pixDiscountPercent: Number(calculation.pixDiscountPercent ?? 0),
      pixDiscountAmount: Number(calculation.pixDiscountAmount ?? 0),
      maxInstallments: Number(calculation.maxInstallments ?? 1),
      installmentValue: Number(calculation.installmentValue ?? 0),
      paymentNotes: String(
        formState.paymentNotes ?? "50% na aprovacao da proposta e 50% na entrega dos arquivos finais.",
      ).trim(),
    },
  };
}
