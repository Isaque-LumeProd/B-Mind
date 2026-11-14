import { decodeProposalParam } from "./proposal-codec.mjs";

const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatBRL(value) {
  return brlFormatter.format(Number(value) || 0);
}

function formatDatePtBR(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function sanitizeHexColor(hex) {
  return /^#[0-9a-fA-F]{6}$/.test(String(hex ?? "")) ? hex : "#B91C1C";
}

function el(id) {
  return document.getElementById(id);
}

function renderScopeCard(title, items) {
  const card = document.createElement("article");
  card.className = "scope-card";

  const heading = document.createElement("h3");
  const dot = document.createElement("span");
  dot.className = "scope-dot";
  const textNode = document.createTextNode(title);
  heading.append(dot, textNode);

  const list = document.createElement("ul");
  list.className = "scope-list";
  for (const item of items) {
    const li = document.createElement("li");
    li.textContent = item;
    list.append(li);
  }

  card.append(heading, list);
  return card;
}

function renderTimeline(timelineItems) {
  const container = el("timelineListEl");
  container.replaceChildren();

  timelineItems.forEach((stepItem, index) => {
    const card = document.createElement("article");
    card.className = "timeline-card";

    const badge = document.createElement("div");
    badge.className = "timeline-step-badge";
    badge.textContent = String(stepItem.step ?? index + 1).padStart(2, "0");

    const body = document.createElement("div");
    body.className = "timeline-body";
    const h3 = document.createElement("h3");
    h3.textContent = stepItem.title || `Etapa ${index + 1}`;
    const p = document.createElement("p");
    p.textContent = stepItem.description || "";
    body.append(h3, p);

    const duration = document.createElement("span");
    duration.className = "timeline-duration";
    duration.textContent = stepItem.duration || "Sob cronograma";

    card.append(badge, body, duration);
    container.append(card);
  });
}

function renderProposal(proposal) {
  const accent = sanitizeHexColor(proposal.branding?.accentColor);
  document.documentElement.style.setProperty("--prop-accent", accent);
  document.title = `${proposal.project?.title || "Proposta"} — ${proposal.client?.name || "Cliente"}`;

  const producerName = proposal.branding?.producerName || "Produtora Audiovisual";
  el("producerNameEl").textContent = producerName;
  el("validityPillEl").textContent = `Valida ate ${formatDatePtBR(proposal.expiresAt)}`;

  const segmentSuffix = proposal.client?.segment ? ` • ${proposal.client.segment}` : "";
  el("clientKickerEl").textContent = `Preparada para ${proposal.client?.name || "Cliente"}${segmentSuffix}`;
  el("projectTitleEl").textContent = proposal.project?.title || "Proposta Comercial";
  el("projectSummaryEl").textContent = proposal.project?.summary || "";

  el("metaClientEl").textContent = proposal.client?.name || "-";
  el("metaContactEl").textContent = proposal.client?.contactName || "-";
  el("metaIssuedEl").textContent = formatDatePtBR(proposal.issuedAt);
  el("metaExpiresEl").textContent = `${proposal.project?.validityDays ?? 10} dias`;

  // Escopo de entregaveis
  const grid = el("deliverablesGridEl");
  grid.replaceChildren();
  const captureItems = proposal.deliverables?.captureItems ?? [];
  const editItems = proposal.deliverables?.editItems ?? [];

  if (captureItems.length > 0) {
    grid.append(renderScopeCard("Captacao Audiovisual", captureItems));
  }
  if (editItems.length > 0) {
    grid.append(renderScopeCard("Edicao, Motion & Entregaveis", editItems));
  }

  // Cronograma
  renderTimeline(proposal.timeline ?? []);

  // Investimento e condicoes
  const inv = proposal.investment ?? {};
  el("finalTotalEl").textContent = formatBRL(inv.finalTotal);
  el("paymentNotesEl").textContent = inv.paymentNotes || "";
  el("pixLabelEl").textContent =
    Number(inv.pixDiscountPercent) > 0
      ? `A vista via PIX (${inv.pixDiscountPercent}% de desconto)`
      : "A vista via PIX";
  el("pixTotalEl").textContent = formatBRL(inv.pixTotal || inv.finalTotal);

  const maxInst = Math.max(1, Number(inv.maxInstallments ?? 1));
  el("installmentLabelEl").textContent = `Parcelamento em ate ${maxInst}x`;
  el("installmentValueEl").textContent = `${maxInst}x de ${formatBRL(inv.installmentValue || inv.finalTotal)}`;

  // Botoes de WhatsApp seguros
  const phone = String(proposal.branding?.producerWhatsapp ?? "").replace(/\D/g, "");
  const approveBtn = el("approveBtnEl");
  const adjustBtn = el("adjustBtnEl");

  if (phone.length >= 10) {
    const approveText = encodeURIComponent(
      `Ola! Aqui e da ${proposal.client?.name}. Aprovamos a proposta "${proposal.project?.title}" no valor de ${formatBRL(inv.finalTotal)}. Podemos agendar as proximas etapas?`,
    );
    const adjustText = encodeURIComponent(
      `Ola! Recebemos a proposta "${proposal.project?.title}" para a ${proposal.client?.name} e gostariamos de alinhar um pequeno ajuste no escopo.`,
    );
    approveBtn.href = `https://wa.me/${phone}?text=${approveText}`;
    adjustBtn.href = `https://wa.me/${phone}?text=${adjustText}`;
  } else {
    approveBtn.removeAttribute("href");
    adjustBtn.removeAttribute("href");
    el("ctaSubtitleEl").textContent = "Responda ao contato comercial que enviou este link para confirmar a aprovacao.";
  }

  el("footerBrandEl").textContent = `${producerName} — Proposta exclusiva para ${proposal.client?.name || "o cliente"}`;
  if (proposal.id) {
    el("footerIdEl").textContent = `Ref.: ${proposal.id}`;
  }
}

function showLoadError(message) {
  el("proposalRoot").hidden = true;
  const errBox = el("errorBoxEl");
  errBox.hidden = false;
  errBox.textContent = message;
  el("validityPillEl").textContent = "Proposta indisponivel";
}

async function resolveProposalFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("d");

  if (encoded) {
    return decodeProposalParam(encoded);
  }

  const pathname = window.location.pathname.replace(/\/+$/, "");
  let slug = "";
  if (pathname.startsWith("/proposta/")) {
    slug = decodeURIComponent(pathname.slice("/proposta/".length));
  } else if (params.get("id")) {
    slug = params.get("id");
  }

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    throw new Error("Nenhum orcamento especificado na URL. Gere o link pelo Painel do Precificador.");
  }

  // 1. Tenta API do servidor Node local
  try {
    const apiRes = await fetch(`/api/orcamentos/${encodeURIComponent(slug)}`);
    if (apiRes.ok) {
      const apiJson = await apiRes.json();
      if (apiJson?.data) return apiJson.data;
    }
  } catch {
    // Segue para leitura estatica JSON
  }

  // 2. Fallback para arquivo JSON estatico (ex.: Vercel)
  const staticRes = await fetch(`/orcamentos/${encodeURIComponent(slug)}.json`);
  if (!staticRes.ok) {
    throw new Error(`Orcamento "${slug}" nao encontrado. Solicite um novo link atualizado.`);
  }
  return staticRes.json();
}

async function bootstrap() {
  try {
    const proposal = await resolveProposalFromUrl();
    renderProposal(proposal);
  } catch (err) {
    showLoadError(err?.message || "Nao foi possivel carregar esta proposta.");
  }
}

bootstrap();
