import type { SubtitleCue } from "../paxvida_shared/PaxPrimitives";

export const PAX_V2_FPS = 30;
export const PAX_V2_WIDTH = 1080;
export const PAX_V2_HEIGHT = 1920;
export const PAX_V2_TOTAL_FRAMES = 719;

export interface PaxV2VisualLayerItem {
  id: string;
  src: string;
  tlStart: number;
  frames: number;
  kind: "aroll" | "broll" | "tail";
  label: string;
}

export interface PaxV2GCSlot {
  id:
    | "V2GC01CapelaModerna"
    | "V2GC02Tanatopraxia"
    | "V2GC03Cremacao"
    | "V2GC04Translado"
    | "V2GC05CoroaFlores"
    | "V2GC06WhatsAppCTA";
  tlStart: number;
  frames: number;
}

/**
 * Visible video tracks on Video 2's 30fps master timeline.
 * Presenter segments 7485 (A03_7485_A and A04_7485_B) are visually covered
 * 100% by Capela Velório / Estrutura / Veículo / Coroa B-roll while preserving voice audio.
 */
export const PAX_V2_VISUAL_CLIPS: PaxV2VisualLayerItem[] = [
  {
    id: "A01_7479",
    src: "paxvida_v2/clips/A01_7479.mp4",
    tlStart: 0,
    frames: 114,
    kind: "aroll",
    label: "Abertura Apresentadora — Fachada Capela Pax Vida",
  },
  {
    id: "A02_7482",
    src: "paxvida_v2/clips/A02_7482.mp4",
    tlStart: 114,
    frames: 120,
    kind: "aroll",
    label: "Corredor Capela — Quase 20 anos de acolhimento",
  },
  {
    id: "B01_7490",
    src: "paxvida_v2/clips/B01_7490.mp4",
    tlStart: 234,
    frames: 76,
    kind: "broll",
    label: "Jardim e Entrada Capela Pax Vida",
  },
  {
    id: "B02_7497",
    src: "paxvida_v2/clips/B02_7497.mp4",
    tlStart: 310,
    frames: 75,
    kind: "broll",
    label: "Capela Velório Ampla e Moderna",
  },
  {
    id: "B03_7506",
    src: "paxvida_v2/clips/B03_7506.mp4",
    tlStart: 385,
    frames: 75,
    kind: "broll",
    label: "Equipe Especializada Pax Vida (Tanatopraxia)",
  },
  {
    id: "B04_7499",
    src: "paxvida_v2/clips/B04_7499.mp4",
    tlStart: 460,
    frames: 29,
    kind: "broll",
    label: "Sala de Despedida e Altar (Cremação)",
  },
  {
    id: "B05_7341",
    src: "paxvida_v2/clips/B05_7341.mp4",
    tlStart: 489,
    frames: 30,
    kind: "broll",
    label: "Veículo de Translado Pax Vida",
  },
  {
    id: "B06_7373",
    src: "paxvida_v2/clips/B06_7373.mp4",
    tlStart: 519,
    frames: 29,
    kind: "broll",
    label: "Coroa de Flores",
  },
  {
    id: "A05_7487",
    src: "paxvida_v2/clips/A05_7487.mp4",
    tlStart: 548,
    frames: 147,
    kind: "aroll",
    label: "Fechamento Apresentadora — Conforto e Planos Funerários",
  },
  {
    id: "B07_7501_tail",
    src: "paxvida_v2/clips/B07_7501_tail.mp4",
    tlStart: 695,
    frames: 24,
    kind: "tail",
    label: "Saguão Moderno Capela Pax Vida (Encerramento)",
  },
];

export const PAX_V2_GC_SLOTS: PaxV2GCSlot[] = [
  { id: "V2GC01CapelaModerna", tlStart: 238, frames: 147 },
  { id: "V2GC02Tanatopraxia", tlStart: 388, frames: 72 },
  { id: "V2GC03Cremacao", tlStart: 460, frames: 29 },
  { id: "V2GC04Translado", tlStart: 489, frames: 30 },
  { id: "V2GC05CoroaFlores", tlStart: 519, frames: 29 },
  { id: "V2GC06WhatsAppCTA", tlStart: 635, frames: 84 },
];

export const PAX_V2_SUBTITLES: SubtitleCue[] = [
  {
    startFrame: 4,
    endFrame: 112,
    text: "Só nos momentos mais difíceis que percebemos quem realmente está ao nosso lado.",
  },
  {
    startFrame: 116,
    endFrame: 232,
    text: "Há quase 20 anos a Pax Vida acolhe as famílias no momento do adeus.",
  },
  {
    startFrame: 236,
    endFrame: 384,
    text: "Além de uma capela velório moderna, bem localizada e estruturada, a Pax Vida",
  },
  {
    startFrame: 386,
    endFrame: 460,
    text: "oferece os serviços de tanatopraxia,",
  },
  {
    startFrame: 461,
    endFrame: 547,
    text: "cremação, translado e coroa de flores.",
  },
  {
    startFrame: 550,
    endFrame: 638,
    text: "Tudo isso para oferecer conforto nos momentos mais difíceis.",
  },
  {
    startFrame: 640,
    endFrame: 694,
    text: "Conheça os nossos planos funerários.",
  },
];

