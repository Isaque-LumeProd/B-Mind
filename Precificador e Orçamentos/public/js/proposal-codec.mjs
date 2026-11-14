/**
 * Validacao, geracao de slugs seguros e serializacao UTF-8 URL-safe das propostas.
 * Compativel com Node.js e navegadores modernos sem dependencias externas.
 */

export function slugify(text) {
  return String(text ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

export function buildBaseSlug(clientName, projectTitle) {
  const clientPart = slugify(clientName) || "cliente";
  const projectPart = slugify(projectTitle) || "proposta";
  return `${clientPart}-${projectPart}`.slice(0, 96).replace(/-+$/g, "");
}

export function validateProposal(data) {
  const errors = [];

  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Payload da proposta invalido."] };
  }

  const clientName = String(data.client?.name ?? "").trim();
  const projectTitle = String(data.project?.title ?? "").trim();
  const finalTotal = Number(data.investment?.finalTotal ?? NaN);
  const captureCount = Array.isArray(data.deliverables?.captureItems)
    ? data.deliverables.captureItems.length
    : 0;
  const editCount = Array.isArray(data.deliverables?.editItems)
    ? data.deliverables.editItems.length
    : 0;

  if (clientName.length < 2) {
    errors.push("Informe o nome do cliente ou empresa (minimo 2 caracteres).");
  }
  if (projectTitle.length < 2) {
    errors.push("Informe o titulo do projeto.");
  }
  if (!Number.isFinite(finalTotal) || finalTotal <= 0) {
    errors.push("O valor final do investimento deve ser maior que zero.");
  }
  if (captureCount + editCount === 0) {
    errors.push("Inclua pelo menos um item no escopo de entregaveis (captacao ou edicao).");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function encodeProposalParam(proposal) {
  const json = JSON.stringify(proposal);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function decodeProposalParam(param) {
  const normalized = String(param ?? "").trim();
  if (!normalized || !/^[A-Za-z0-9_-]+$/.test(normalized)) {
    throw new Error("Parametro de proposta invalido.");
  }

  const padded = normalized.replace(/-/g, "+").replace(/_/g, "/") +
    "===".slice((normalized.length + 3) % 4);

  let parsed;
  try {
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    const json = new TextDecoder().decode(bytes);
    parsed = JSON.parse(json);
  } catch {
    throw new Error("Link da proposta corrompido ou formato invalido.");
  }

  const check = validateProposal(parsed);
  if (!check.valid) {
    throw new Error(`Proposta invalida na URL: ${check.errors.join(" ")}`);
  }
  return parsed;
}
