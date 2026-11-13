export const PAX_FPS = 30;
export const PAX_WIDTH = 1080;
export const PAX_HEIGHT = 1920;
export const PAX_TOTAL_FRAMES = 924;

export interface PaxVideoLayerItem {
  id: string;
  src: string;
  tlStart: number;
  frames: number;
  kind: "aroll" | "broll" | "tail";
  label: string;
}

export interface PaxGCSlot {
  id:
    | "GC01Mensalidade"
    | "GC02DescontoSaude"
    | "GC03Dependentes"
    | "GC04IsencaoCarencia"
    | "GC05AssistenciaFuneraria"
    | "GC06WhatsAppCTA";
  tlStart: number;
  frames: number;
}

export interface PaxSubtitleItem {
  startFrame: number;
  endFrame: number;
  text: string;
}

/**
 * Visible video cuts on the master 30fps timeline.
 * A03_7466 and A06_7472 presenter shots are intentionally replaced visually
 * by Sede da Empresa and Capela Velório B-roll while keeping 100% of original audio.
 */
export const PAX_VISUAL_CLIPS: PaxVideoLayerItem[] = [
  {
    id: "A01_7457",
    src: "paxvida/clips/A01_7457.mp4",
    tlStart: 0,
    frames: 84,
    kind: "aroll",
    label: "Abertura Apresentadora",
  },
  {
    id: "A02_7461",
    src: "paxvida/clips/A02_7461.mp4",
    tlStart: 84,
    frames: 123,
    kind: "aroll",
    label: "Plano Assistencial Pax Vida",
  },
  {
    id: "B01_7341",
    src: "paxvida/clips/B01_7341.mp4",
    tlStart: 207,
    frames: 63,
    kind: "broll",
    label: "Sede Pax Vida (Fachada e Frota)",
  },
  {
    id: "B02_7344",
    src: "paxvida/clips/B02_7344.mp4",
    tlStart: 270,
    frames: 64,
    kind: "broll",
    label: "Sede Pax Vida (Plantão 24H)",
  },
  {
    id: "B03_7348",
    src: "paxvida/clips/B03_7348.mp4",
    tlStart: 334,
    frames: 39,
    kind: "broll",
    label: "+ de 20 Especialidades Médicas",
  },
  {
    id: "B04_7367",
    src: "paxvida/clips/B04_7367.mp4",
    tlStart: 373,
    frames: 36,
    kind: "broll",
    label: "Atendimento na Recepção",
  },
  {
    id: "A04_7469",
    src: "paxvida/clips/A04_7469.mp4",
    tlStart: 409,
    frames: 153,
    kind: "aroll",
    label: "8 Dependentes + Isenção de Carência",
  },
  {
    id: "A05_7471",
    src: "paxvida/clips/A05_7471.mp4",
    tlStart: 562,
    frames: 108,
    kind: "aroll",
    label: "Cuidados nas Horas Mais Difíceis",
  },
  {
    id: "B05_7493",
    src: "paxvida/clips/B05_7493.mp4",
    tlStart: 670,
    frames: 44,
    kind: "broll",
    label: "Capela Pax Vida (Fachada)",
  },
  {
    id: "B06_7495",
    src: "paxvida/clips/B06_7495.mp4",
    tlStart: 714,
    frames: 64,
    kind: "broll",
    label: "Capela Velório (Interior)",
  },
  {
    id: "B07_7372",
    src: "paxvida/clips/B07_7372.mp4",
    tlStart: 778,
    frames: 54,
    kind: "broll",
    label: "Coroa de Flores e Sala de Homenagem",
  },
  {
    id: "A07_7474",
    src: "paxvida/clips/A07_7474.mp4",
    tlStart: 832,
    frames: 68,
    kind: "aroll",
    label: "Fechamento Apresentadora",
  },
  {
    id: "B08_7346_tail",
    src: "paxvida/clips/B08_7346_tail.mp4",
    tlStart: 900,
    frames: 24,
    kind: "tail",
    label: "Entrada Pax Vida (Fundo CTA)",
  },
];

export const PAX_GC_SLOTS: PaxGCSlot[] = [
  { id: "GC01Mensalidade", tlStart: 210, frames: 124 },
  { id: "GC02DescontoSaude", tlStart: 334, frames: 75 },
  { id: "GC03Dependentes", tlStart: 424, frames: 76 },
  { id: "GC04IsencaoCarencia", tlStart: 500, frames: 62 },
  { id: "GC05AssistenciaFuneraria", tlStart: 673, frames: 159 },
  { id: "GC06WhatsAppCTA", tlStart: 832, frames: 92 },
];

export const PAX_GC_DURATION_MAP: Record<PaxGCSlot["id"], number> = {
  GC01Mensalidade: 124,
  GC02DescontoSaude: 75,
  GC03Dependentes: 76,
  GC04IsencaoCarencia: 62,
  GC05AssistenciaFuneraria: 159,
  GC06WhatsAppCTA: 92,
};

export const PAX_WHOOSH_FRAMES = [206, 333, 408, 669, 831];

export const PAX_SUBTITLES: PaxSubtitleItem[] = [
  { startFrame: 2, endFrame: 82, text: "Cuidar da sua família nunca foi tão fácil e barato." },
  { startFrame: 86, endFrame: 204, text: "Aqui na Pax Vida você encontra plano assistencial pra proteger quem você ama." },
  { startFrame: 209, endFrame: 333, text: "Com a mensalidade de R$ 65,00 por mês," },
  { startFrame: 335, endFrame: 407, text: "você garante descontos nas principais clínicas e serviços de saúde." },
  { startFrame: 411, endFrame: 499, text: "E tem mais: o plano contempla até 8 dependentes" },
  { startFrame: 500, endFrame: 560, text: "e não tem carência de serviços de saúde." },
  { startFrame: 564, endFrame: 668, text: "O plano ainda garante os cuidados necessários nas horas mais difíceis." },
  { startFrame: 672, endFrame: 830, text: "Com assistência funerária, tanatopraxia, capela velório, coroa de flores e cremação." },
  { startFrame: 833, endFrame: 899, text: "Cuide da sua família com a Pax Vida." },
];

