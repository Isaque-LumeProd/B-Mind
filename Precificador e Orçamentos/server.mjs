import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { buildBaseSlug, validateProposal } from "./public/js/proposal-codec.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_STORAGE_DIR = path.resolve(__dirname, "orcamentos");
const DEFAULT_PUBLIC_DIR = path.resolve(__dirname, "public");
const SAFE_ID_REGEX = /^[a-z0-9-]+$/;
const MAX_BODY_BYTES = 512 * 1024;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "no-store",
  });
  res.end(body);
}

async function readJsonBody(req) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      const err = new Error("Payload excede o limite permitido.");
      err.statusCode = 413;
      throw err;
    }
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf-8");
  try {
    return JSON.parse(raw);
  } catch {
    const err = new Error("JSON malformado no corpo da requisicao.");
    err.statusCode = 400;
    throw err;
  }
}

function decodeIdSafely(rawSegment) {
  let decoded;
  try {
    decoded = decodeURIComponent(rawSegment);
  } catch {
    return null;
  }
  if (!SAFE_ID_REGEX.test(decoded)) {
    return null;
  }
  return decoded;
}

function resolveInsideDir(baseDir, untrustedName) {
  if (!untrustedName || /[\0:]/.test(untrustedName)) {
    return null;
  }
  const resolvedBase = path.resolve(baseDir);
  const resolvedTarget = path.resolve(resolvedBase, untrustedName);
  if (!resolvedTarget.startsWith(resolvedBase + path.sep)) {
    return null;
  }
  return resolvedTarget;
}

async function listProposals(storageDir) {
  await fs.mkdir(storageDir, { recursive: true });
  const entries = await fs.readdir(storageDir, { withFileTypes: true });
  const jsonFiles = entries.filter((e) => e.isFile() && e.name.endsWith(".json"));

  const records = [];
  for (const file of jsonFiles) {
    const filePath = resolveInsideDir(storageDir, file.name);
    if (!filePath) continue;
    try {
      const content = await fs.readFile(filePath, "utf-8");
      const parsed = JSON.parse(content);
      const fileId = file.name.slice(0, -".json".length);
      records.push({ ...parsed, id: fileId });
    } catch {
      // Ignora arquivos JSON corrompidos sem quebrar a listagem
    }
  }

  return records.sort((a, b) => {
    const dateA = new Date(a.createdAt ?? a.issuedAt ?? 0).getTime();
    const dateB = new Date(b.createdAt ?? b.issuedAt ?? 0).getTime();
    return dateB - dateA;
  });
}

async function saveProposalVersioned(storageDir, payload) {
  await fs.mkdir(storageDir, { recursive: true });
  const baseSlug = buildBaseSlug(payload.client?.name, payload.project?.title);

  let versionNumber = 1;
  while (versionNumber <= 999) {
    const candidateId = `${baseSlug}-v${versionNumber}`;
    const targetPath = resolveInsideDir(storageDir, `${candidateId}.json`);
    if (!targetPath) {
      throw new Error("Caminho de destino invalido.");
    }

    const record = {
      ...payload,
      id: candidateId,
      baseSlug,
      versionNumber,
      createdAt: new Date().toISOString(),
    };

    try {
      await fs.writeFile(targetPath, JSON.stringify(record, null, 2), {
        encoding: "utf-8",
        flag: "wx",
      });
      return record;
    } catch (err) {
      if (err?.code === "EEXIST") {
        versionNumber += 1;
        continue;
      }
      throw err;
    }
  }

  throw new Error("Limite de versoes atingido para este projeto.");
}

async function serveStaticFile(res, filePath) {
  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME_TYPES[ext] ?? "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "X-Frame-Options": "DENY",
      "Content-Security-Policy":
        "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none';",
    });
    res.end(data);
  } catch (err) {
    if (err?.code === "ENOENT") {
      sendJson(res, 404, { success: false, data: null, error: "Arquivo nao encontrado." });
      return;
    }
    sendJson(res, 500, { success: false, data: null, error: "Erro ao ler arquivo estatico." });
  }
}

/**
 * Cria o servidor HTTP da aplicacao Precificador e Orcamentos.
 */
export function createAppServer({
  storageDir = DEFAULT_STORAGE_DIR,
  publicDir = DEFAULT_PUBLIC_DIR,
} = {}) {
  return http.createServer(async (req, res) => {
    try {
      const reqUrl = new URL(req.url ?? "/", "http://127.0.0.1");
      const pathname = reqUrl.pathname;
      const method = (req.method ?? "GET").toUpperCase();

      if (pathname.startsWith("/api/") && req.headers["sec-fetch-site"] === "cross-site") {
        sendJson(res, 403, {
          success: false,
          data: null,
          error: "Requisicao cross-site bloqueada.",
        });
        return;
      }

      // API REST: listar todos os orcamentos salvos
      if (method === "GET" && pathname === "/api/orcamentos") {
        const list = await listProposals(storageDir);
        sendJson(res, 200, { success: true, data: list, error: null });
        return;
      }

      // API REST: criar novo orcamento versionado (-v1, -v2...)
      if (method === "POST" && pathname === "/api/orcamentos") {
        const contentType = String(req.headers["content-type"] ?? "").toLowerCase();
        if (!contentType.includes("application/json")) {
          sendJson(res, 415, {
            success: false,
            data: null,
            error: "Content-Type deve ser application/json.",
          });
          return;
        }
        const body = await readJsonBody(req);
        const check = validateProposal(body);
        if (!check.valid) {
          sendJson(res, 400, {
            success: false,
            data: null,
            error: check.errors.join(" "),
          });
          return;
        }
        const saved = await saveProposalVersioned(storageDir, body);
        sendJson(res, 201, { success: true, data: saved, error: null });
        return;
      }

      // API REST: buscar orcamento especifico por ID
      if (method === "GET" && pathname.startsWith("/api/orcamentos/")) {
        const rawSegment = pathname.slice("/api/orcamentos/".length);
        const id = decodeIdSafely(rawSegment);
        if (!id) {
          sendJson(res, 400, {
            success: false,
            data: null,
            error: "Identificador de orcamento invalido.",
          });
          return;
        }
        const targetPath = resolveInsideDir(storageDir, `${id}.json`);
        if (!targetPath) {
          sendJson(res, 400, { success: false, data: null, error: "Caminho invalido." });
          return;
        }
        try {
          const content = await fs.readFile(targetPath, "utf-8");
          const parsed = JSON.parse(content);
          sendJson(res, 200, { success: true, data: { ...parsed, id }, error: null });
        } catch (err) {
          if (err?.code === "ENOENT") {
            sendJson(res, 404, { success: false, data: null, error: "Orcamento nao encontrado." });
            return;
          }
          throw err;
        }
        return;
      }

      // Leitura estatica opcional de /orcamentos/:id.json
      if (method === "GET" && pathname.startsWith("/orcamentos/") && pathname.endsWith(".json")) {
        const rawName = pathname.slice("/orcamentos/".length, -".json".length);
        const id = decodeIdSafely(rawName);
        if (!id) {
          sendJson(res, 400, { success: false, data: null, error: "Caminho invalido." });
          return;
        }
        const filePath = resolveInsideDir(storageDir, `${id}.json`);
        if (!filePath) {
          sendJson(res, 400, { success: false, data: null, error: "Caminho invalido." });
          return;
        }
        await serveStaticFile(res, filePath);
        return;
      }

      // Rotas HTML principais
      if (method === "GET" && (pathname === "/" || pathname === "/index.html")) {
        await serveStaticFile(res, path.join(publicDir, "index.html"));
        return;
      }

      if (
        method === "GET" &&
        (pathname === "/proposta" ||
          pathname === "/proposta.html" ||
          pathname.startsWith("/proposta/"))
      ) {
        await serveStaticFile(res, path.join(publicDir, "proposta.html"));
        return;
      }

      // Demais arquivos estaticos dentro de public/
      if (method === "GET") {
        let decodedRel;
        try {
          decodedRel = decodeURIComponent(pathname).replace(/^\/+/, "");
        } catch {
          sendJson(res, 400, { success: false, data: null, error: "URL invalida." });
          return;
        }
        const targetStatic = resolveInsideDir(publicDir, decodedRel);
        if (!targetStatic) {
          sendJson(res, 400, { success: false, data: null, error: "Acesso bloqueado." });
          return;
        }
        await serveStaticFile(res, targetStatic);
        return;
      }

      sendJson(res, 405, { success: false, data: null, error: "Metodo nao permitido." });
    } catch (err) {
      const status = err?.statusCode ?? 500;
      sendJson(res, status, {
        success: false,
        data: null,
        error: err?.message ?? "Erro interno no servidor.",
      });
    }
  });
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const port = Number(process.env.PORT ?? 3456);
  const server = createAppServer();
  server.listen(port, "127.0.0.1", () => {
    console.log(`Precificador e Orcamentos rodando em: http://127.0.0.1:${port}`);
  });
}
