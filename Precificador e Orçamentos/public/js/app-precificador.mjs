import {
  ACCENT_PRESETS,
  CAPTURE_ADDONS,
  CAPTURE_TIERS,
  EDIT_TIERS,
  ORIENTATIONS,
} from "./catalog.mjs";
import {
  buildDefaultTimeline,
  buildDeliverablesList,
  calculateBudget,
  createProposalDocument,
} from "./pricing-engine.mjs";
import { encodeProposalParam } from "./proposal-codec.mjs";

const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatBRL(value) {
  return brlFormatter.format(Number(value) || 0);
}

function sanitizeHexColor(hex, fallback = "#B91C1C") {
  return /^#[0-9a-fA-F]{6}$/.test(String(hex ?? "")) ? hex : fallback;
}

function el(id) {
  return document.getElementById(id);
}

const state = {
  scopeManuallyEdited: false,
  timelineManuallyEdited: false,
  timeline: buildDefaultTimeline({ captureTier: "intermediaria" }),
  lastSavedId: null,
};

function createAddonRow(addonSpec) {
  const row = document.createElement("div");
  row.className = "addon-row";

  const label = document.createElement("label");
  label.className = "addon-check";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = `addon_enabled_${addonSpec.id}`;
  checkbox.checked = addonSpec.id === "drone";

  const title = document.createElement("span");
  title.textContent = addonSpec.label;
  label.append(checkbox, title);

  const qtyInput = document.createElement("input");
  qtyInput.type = "number";
  qtyInput.min = "1";
  qtyInput.step = "1";
  qtyInput.value = "1";
  qtyInput.id = `addon_qty_${addonSpec.id}`;
  qtyInput.title = "Quantidade";

  const priceInput = document.createElement("input");
  priceInput.type = "number";
  priceInput.min = "0";
  priceInput.step = "50";
  priceInput.value = String(addonSpec.defaultPrice);
  priceInput.id = `addon_price_${addonSpec.id}`;
  priceInput.title = "Valor unitario (R$)";

  row.append(label, qtyInput, priceInput);
  return row;
}

function createEditTierRow(editSpec) {
  const row = document.createElement("div");
  row.className = "edit-row";

  const info = document.createElement("div");
  info.className = "edit-row-info";
  const strong = document.createElement("strong");
  strong.textContent = editSpec.label;
  const span = document.createElement("span");
  span.textContent = editSpec.description;
  info.append(strong, span);

  const qtyInput = document.createElement("input");
  qtyInput.type = "number";
  qtyInput.min = "0";
  qtyInput.step = "1";
  qtyInput.value = editSpec.id === "intermediaria" ? "4" : "0";
  qtyInput.id = `edit_qty_${editSpec.id}`;
  qtyInput.title = "Quantidade de videos";

  const priceInput = document.createElement("input");
  priceInput.type = "number";
  priceInput.min = "0";
  priceInput.step = "5";
  priceInput.value = String(editSpec.defaultPrice);
  priceInput.id = `edit_price_${editSpec.id}`;
  priceInput.title = "Valor por video (R$)";

  row.append(info, qtyInput, priceInput);
  return row;
}

function renderTimelineEditor() {
  const container = el("timelineEditor");
  container.replaceChildren();

  state.timeline.forEach((item, idx) => {
    const card = document.createElement("div");
    card.className = "timeline-item-edit";

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.value = item.title;
    titleInput.placeholder = `Etapa ${idx + 1}`;
    titleInput.addEventListener("input", () => {
      state.lastSavedId = null;
      state.timelineManuallyEdited = true;
      state.timeline = state.timeline.map((stepItem, i) =>
        i === idx ? { ...stepItem, title: titleInput.value } : stepItem,
      );
    });

    const durationInput = document.createElement("input");
    durationInput.type = "text";
    durationInput.value = item.duration;
    durationInput.placeholder = "Prazo (ex: Dia 1)";
    durationInput.addEventListener("input", () => {
      state.lastSavedId = null;
      state.timelineManuallyEdited = true;
      state.timeline = state.timeline.map((stepItem, i) =>
        i === idx ? { ...stepItem, duration: durationInput.value } : stepItem,
      );
    });

    const descInput = document.createElement("textarea");
    descInput.value = item.description;
    descInput.placeholder = "O que sera entregue nesta etapa";
    descInput.addEventListener("input", () => {
      state.lastSavedId = null;
      state.timelineManuallyEdited = true;
      state.timeline = state.timeline.map((stepItem, i) =>
        i === idx ? { ...stepItem, description: descInput.value } : stepItem,
      );
    });

    card.append(titleInput, durationInput, descInput);
    container.append(card);
  });
}

function readCalculatorConfig() {
  const addons = {};
  for (const key of Object.keys(CAPTURE_ADDONS)) {
    addons[key] = {
      enabled: Boolean(el(`addon_enabled_${key}`)?.checked),
      qty: Number(el(`addon_qty_${key}`)?.value ?? 1),
      price: Number(el(`addon_price_${key}`)?.value ?? 0),
    };
  }

  const edits = {};
  for (const key of Object.keys(EDIT_TIERS)) {
    edits[key] = {
      qty: Number(el(`edit_qty_${key}`)?.value ?? 0),
      price: Number(el(`edit_price_${key}`)?.value ?? 0),
    };
  }

  const customRaw = el("customFinalTotal").value.trim();
  const customFinalTotal = customRaw === "" ? null : Number(customRaw);

  return {
    captureTier: el("captureTier").value,
    captureDays: Number(el("captureDays").value),
    captureDayRate: Number(el("captureDayRate").value),
    addons,
    edits,
    orientation: el("orientation").value,
    revisionRounds: Number(el("revisionRounds").value),
    motionPackagePrice: Number(el("motionPackagePrice").value),
    operationalCosts: Number(el("operationalCosts").value),
    marginPercent: Number(el("marginPercent").value),
    taxPercent: Number(el("taxPercent").value),
    pixDiscountPercent: Number(el("pixDiscountPercent").value),
    maxInstallments: Number(el("maxInstallments").value),
    customFinalTotal,
  };
}

function splitTextareaLines(id) {
  return el(id)
    .value.split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function buildCurrentProposal() {
  const config = readCalculatorConfig();
  const calc = calculateBudget(config);

  const formState = {
    clientName: el("clientName").value,
    contactName: el("contactName").value,
    clientSegment: el("clientSegment").value,
    projectTitle: el("projectTitle").value,
    summary: el("projectSummary").value,
    validityDays: Number(el("validityDays").value),
    accentColor: sanitizeHexColor(el("accentColor").value),
    producerName: el("producerName").value,
    producerWhatsapp: el("producerWhatsapp").value,
    paymentNotes: el("paymentNotes").value,
    customDeliverables: {
      captureItems: splitTextareaLines("captureScopeText"),
      editItems: splitTextareaLines("editScopeText"),
    },
    timeline: state.timeline,
  };

  return {
    config,
    calc,
    proposal: createProposalDocument(formState, calc),
  };
}

function syncScopeFromConfig(config) {
  const list = buildDeliverablesList(config);
  el("captureScopeText").value = list.captureItems.join("\n");
  el("editScopeText").value = list.editItems.join("\n");
}

function updateSummaryUI() {
  const config = readCalculatorConfig();
  const tierInfo = CAPTURE_TIERS[config.captureTier] ?? CAPTURE_TIERS.nenhuma;
  el("captureTierHint").textContent = tierInfo.summary;

  const isNoCapture = config.captureTier === "nenhuma";
  el("captureDays").disabled = isNoCapture;
  el("captureDayRate").disabled = isNoCapture;

  if (!state.scopeManuallyEdited) {
    syncScopeFromConfig(config);
  }

  const calc = calculateBudget(config);
  el("kpiCaptureSubtotal").textContent = formatBRL(calc.captureSubtotal);
  el("kpiEditSubtotal").textContent = formatBRL(calc.editSubtotal);
  el("kpiBaseCost").textContent = formatBRL(calc.baseCost);
  el("kpiTaxAmount").textContent = formatBRL(calc.taxAmount);
  el("kpiProfitNet").textContent = `${formatBRL(calc.profitNet)} (${calc.effectiveMarginPercent.toFixed(1)}%)`;
  el("kpiFinalTotal").textContent = formatBRL(calc.finalTotal);
  el("kpiPixTotal").textContent = formatBRL(calc.pixTotal);
  el("kpiInstallmentLabel").textContent = `Ate ${calc.maxInstallments}x no Cartao`;
  el("kpiInstallmentValue").textContent = `${calc.maxInstallments}x ${formatBRL(calc.installmentValue)}`;
}

function showStatus(message, isError = false) {
  const banner = el("statusBanner");
  banner.textContent = message;
  banner.className = `status-banner visible ${isError ? "err" : "ok"}`;
}

function showGeneratedLinks(savedId, proposal) {
  const origin = window.location.origin;
  const encoded = encodeProposalParam(proposal);
  const portableUrl = `${origin}/proposta?d=${encoded}`;
  const cleanUrl = savedId ? `${origin}/proposta/${savedId}` : "(Salve rodando node server.mjs para gerar slug)";

  el("cleanLinkCode").textContent = cleanUrl;
  el("portableLinkCode").textContent = portableUrl;
  el("linkOutputBox").classList.add("visible");
  return { cleanUrl, portableUrl };
}

function applyAccentPreview(hex) {
  const safe = sanitizeHexColor(hex);
  document.documentElement.style.setProperty("--accent", safe);
}

async function refreshSavedProposals() {
  const listEl = el("savedList");
  listEl.replaceChildren();

  try {
    const res = await fetch("/api/orcamentos");
    if (!res.ok) throw new Error("API indisponivel");
    const json = await res.json();
    const items = json.data ?? [];

    if (items.length === 0) {
      const empty = document.createElement("p");
      empty.style.color = "#9ca3af";
      empty.style.fontSize = "12px";
      empty.textContent = "Nenhum orcamento salvo ainda.";
      listEl.append(empty);
      return;
    }

    for (const item of items) {
      const card = document.createElement("div");
      card.className = "saved-item";

      const meta = document.createElement("div");
      meta.className = "saved-item-meta";
      const strong = document.createElement("strong");
      strong.textContent = `${item.client?.name ?? "Cliente"} — ${item.project?.title ?? "Projeto"}`;
      const span = document.createElement("span");
      span.textContent = `${item.id} • ${formatBRL(item.investment?.finalTotal ?? 0)}`;
      meta.append(strong, span);

      const actions = document.createElement("div");
      actions.className = "saved-item-actions";

      const loadBtn = document.createElement("button");
      loadBtn.type = "button";
      loadBtn.className = "btn btn-secondary btn-inline";
      loadBtn.textContent = "Editar Nova Versao";
      loadBtn.addEventListener("click", () => {
        el("clientName").value = item.client?.name ?? "";
        el("contactName").value = item.client?.contactName ?? "";
        el("clientSegment").value = item.client?.segment ?? "";
        el("projectTitle").value = item.project?.title ?? "";
        el("projectSummary").value = item.project?.summary ?? "";
        el("validityDays").value = String(item.project?.validityDays ?? 10);
        el("accentColor").value = sanitizeHexColor(item.branding?.accentColor);
        applyAccentPreview(el("accentColor").value);
        el("producerName").value = item.branding?.producerName ?? "Lume Produtora";
        el("producerWhatsapp").value = item.branding?.producerWhatsapp ?? "";
        el("paymentNotes").value = item.investment?.paymentNotes ?? "";
        el("customFinalTotal").value = String(item.investment?.finalTotal ?? "");
        el("captureScopeText").value = (item.deliverables?.captureItems ?? []).join("\n");
        el("editScopeText").value = (item.deliverables?.editItems ?? []).join("\n");
        state.scopeManuallyEdited = true;
        if (Array.isArray(item.timeline) && item.timeline.length > 0) {
          state.timeline = item.timeline.map((step) => ({ ...step }));
          state.timelineManuallyEdited = true;
          renderTimelineEditor();
        }
        updateSummaryUI();
        showStatus(`Carregado ${item.id}. Ao salvar sera criada uma nova versao sem apagar a anterior.`);
      });

      const openLink = document.createElement("a");
      openLink.className = "btn btn-primary btn-inline";
      openLink.href = `/proposta/${encodeURIComponent(item.id)}`;
      openLink.target = "_blank";
      openLink.rel = "noopener";
      openLink.textContent = "Abrir";

      actions.append(loadBtn, openLink);
      card.append(meta, actions);
      listEl.append(card);
    }
  } catch {
    const note = document.createElement("p");
    note.style.color = "#9ca3af";
    note.style.fontSize = "12px";
    note.textContent = "Listagem automatica disponivel quando aberto via servidor local (node server.mjs).";
    listEl.append(note);
  }
}

function initUI() {
  // Select de nivel de captacao
  const captureSelect = el("captureTier");
  for (const tier of Object.values(CAPTURE_TIERS)) {
    const opt = document.createElement("option");
    opt.value = tier.id;
    opt.textContent = tier.label;
    if (tier.id === "intermediaria") opt.selected = true;
    captureSelect.append(opt);
  }

  captureSelect.addEventListener("change", () => {
    const tier = CAPTURE_TIERS[captureSelect.value];
    if (tier) {
      el("captureDayRate").value = String(tier.defaultDayRate);
    }
    if (!state.timelineManuallyEdited) {
      state.timeline = buildDefaultTimeline({ captureTier: captureSelect.value });
      renderTimelineEditor();
    }
    updateSummaryUI();
  });

  // Select de orientacao
  const orientationSelect = el("orientation");
  for (const orient of Object.values(ORIENTATIONS)) {
    const opt = document.createElement("option");
    opt.value = orient.id;
    opt.textContent = orient.label;
    orientationSelect.append(opt);
  }

  // Adicionais de captacao
  const addonsContainer = el("addonsContainer");
  for (const addon of Object.values(CAPTURE_ADDONS)) {
    addonsContainer.append(createAddonRow(addon));
  }

  // Niveis de edicao
  const editContainer = el("editTiersContainer");
  for (const editSpec of Object.values(EDIT_TIERS)) {
    editContainer.append(createEditTierRow(editSpec));
  }

  // Swatches de cor
  const swatchesEl = el("accentPresets");
  for (const preset of ACCENT_PRESETS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "swatch-btn";
    btn.title = preset.label;
    btn.style.backgroundColor = preset.hex;
    btn.addEventListener("click", () => {
      el("accentColor").value = preset.hex;
      applyAccentPreview(preset.hex);
    });
    swatchesEl.append(btn);
  }

  el("accentColor").addEventListener("input", (event) => {
    applyAccentPreview(event.target.value);
  });
  applyAccentPreview(el("accentColor").value);

  // Marca edicao manual no escopo
  el("captureScopeText").addEventListener("input", () => {
    state.lastSavedId = null;
    state.scopeManuallyEdited = true;
  });
  el("editScopeText").addEventListener("input", () => {
    state.lastSavedId = null;
    state.scopeManuallyEdited = true;
  });

  el("syncScopeBtn").addEventListener("click", () => {
    state.lastSavedId = null;
    state.scopeManuallyEdited = false;
    syncScopeFromConfig(readCalculatorConfig());
  });

  el("resetTimelineBtn").addEventListener("click", () => {
    state.lastSavedId = null;
    state.timelineManuallyEdited = false;
    state.timeline = buildDefaultTimeline(readCalculatorConfig());
    renderTimelineEditor();
  });

  // Recalculo em tempo real para qualquer campo numerico ou selecao
  document.addEventListener("input", (event) => {
    state.lastSavedId = null;
    if (event.target.id === "captureScopeText" || event.target.id === "editScopeText") return;
    updateSummaryUI();
  });
  document.addEventListener("change", () => {
    state.lastSavedId = null;
    updateSummaryUI();
  });

  el("saveProposalBtn").addEventListener("click", async () => {
    const { proposal } = buildCurrentProposal();
    try {
      const res = await fetch("/api/orcamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(proposal),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        showStatus(json.error || "Verifique os campos obrigatorios antes de salvar.", true);
        return;
      }
      state.lastSavedId = json.data.id;
      showGeneratedLinks(json.data.id, proposal);
      showStatus(`Orcamento salvo como "${json.data.id}.json". Links prontos abaixo!`);
      await refreshSavedProposals();
    } catch {
      showGeneratedLinks(null, proposal);
      showStatus("Servidor local offline — Link Instantaneo Portatil gerado abaixo para envio direto!");
    }
  });

  el("previewProposalBtn").addEventListener("click", () => {
    const { proposal } = buildCurrentProposal();
    const { portableUrl } = showGeneratedLinks(state.lastSavedId, proposal);
    window.open(portableUrl, "_blank", "noopener");
  });

  el("copyWhatsappBtn").addEventListener("click", async () => {
    const { proposal } = buildCurrentProposal();
    const { cleanUrl, portableUrl } = showGeneratedLinks(state.lastSavedId, proposal);
    const chosenLink = state.lastSavedId ? cleanUrl : portableUrl;
    const message = [
      `Ola ${proposal.client.contactName || proposal.client.name}!`,
      `Preparamos a pagina personalizada da proposta "${proposal.project.title}" para a ${proposal.client.name}:`,
      chosenLink,
      "",
      `Validade: ${proposal.project.validityDays} dias.`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(message);
      showStatus("Mensagem personalizada + link copiados! Cole direto no WhatsApp do cliente.");
    } catch {
      showStatus("Nao foi possivel copiar automaticamente; copie o link exibido abaixo.");
    }
  });

  el("refreshSavedBtn").addEventListener("click", refreshSavedProposals);

  renderTimelineEditor();
  updateSummaryUI();
  refreshSavedProposals();
}

initUI();
