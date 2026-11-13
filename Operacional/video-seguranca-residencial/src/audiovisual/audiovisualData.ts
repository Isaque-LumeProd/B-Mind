export type VoxShotType =
  | "kinetic-statement"
  | "grid-break"
  | "article-wyzowl"
  | "before-after"
  | "counter-callout"
  | "article-forbes"
  | "paper-cards"
  | "takeaway";

export type AudiovisualShot = {
  readonly id: string;
  readonly index: number;
  readonly shotType: VoxShotType;
  readonly tag: string;
  readonly headline: string;
  readonly embedPeakWord: string;
  readonly emphasisWord: string;
  readonly subtitle: string;
  readonly sourceCitation: string;
  readonly accentColor: string;
  readonly speechDurationMs: number;
  readonly durationInFrames: number;
  readonly sfxFile: string;
  readonly sfxDelayFrames: number;
};

/**
 * Palette strictly from `vox-explainer/SKILL.md`:
 * - Red: #B8312A
 * - Cream: #F1E6D0
 * - Paper: #FBF7EE
 * - Navy: #14213D
 * - Yellow Accent: #F2C230
 * - Ink: #191816
 */
export const VOX_PALETTE = {
  red: "#B8312A",
  cream: "#F1E6D0",
  paper: "#FBF7EE",
  navy: "#14213D",
  yellow: "#F2C230",
  ink: "#191816",
  mutedInk: "#5C564F",
  stone: "#D8CCB8",
} as const;

export const AUDIOVISUAL_SHOTS: readonly AudiovisualShot[] = [
  {
    id: "01-av-hook",
    index: 0,
    shotType: "kinetic-statement",
    tag: "PERGUNTA CENTRAL • DOCUMENTÁRIO",
    headline: "Mesmo produto. Por que só uma vira líder?",
    embedPeakWord: "LÍDER",
    emphasisWord: "mesmo produto, | líder de mercado?",
    subtitle:
      "Por que duas empresas vendem exatamente o mesmo produto, mas só uma delas parece líder de mercado?",
    sourceCitation: "Estudo de Posicionamento & Percepção de Valor",
    accentColor: VOX_PALETTE.red,
    speechDurationMs: 6120,
    durationInFrames: 201,
    sfxFile: "audio/sfx-paper-drop.wav",
    sfxDelayFrames: 10,
  },
  {
    id: "02-av-grid",
    index: 1,
    shotType: "grid-break",
    tag: "O EFEITO PAISAGEM NO FEED",
    headline: "Quando tudo parece igual, ninguém para.",
    embedPeakWord: "1,7 SEG",
    emphasisWord: "card estático | dois segundos.",
    subtitle:
      "Abra qualquer feed agora: quase toda empresa posta o mesmo card estático de template. O olho humano ignora isso em menos de dois segundos.",
    sourceCitation: "Meta & Attention Span Feed Benchmark (1,7s médio)",
    accentColor: VOX_PALETTE.navy,
    speechDurationMs: 8712,
    durationInFrames: 279,
    sfxFile: "audio/sfx-transition.wav",
    sfxDelayFrames: 105,
  },
  {
    id: "03-av-article-wyzowl",
    index: 2,
    shotType: "article-wyzowl",
    tag: "PROVA DOCUMENTAL 01 • WYZOWL",
    headline: "89% compram depois de assistir a um vídeo.",
    embedPeakWord: "89%",
    emphasisWord: "oitenta e nove por cento | convenceu na hora da compra.",
    subtitle:
      "Não é só estética. Segundo o relatório da Wyzowl, oitenta e nove por cento dos consumidores dizem que o vídeo de uma marca foi o que convenceu na hora da compra.",
    sourceCitation: "Wyzowl • State of Video Marketing Report (2024)",
    accentColor: VOX_PALETTE.red,
    speechDurationMs: 9384,
    durationInFrames: 300,
    sfxFile: "audio/sfx-marker-stroke.wav",
    sfxDelayFrames: 42,
  },
  {
    id: "04-av-before-after",
    index: 3,
    shotType: "before-after",
    tag: "BIOLOGIA DA ATENÇÃO • INSIVIA",
    headline: "Texto: 10% lembrado. Vídeo: 95% retido.",
    embedPeakWord: "95% vs 10%",
    emphasisWord: "noventa por cento | noventa e cinco por cento",
    subtitle:
      "O motivo é biológico: segundo a Insivia, você esquece noventa por cento do que lê num texto, mas retém noventa e cinco por cento do que vê e ouve em vídeo.",
    sourceCitation: "Insivia • Video Retention & Cognitive Load Study",
    accentColor: VOX_PALETTE.navy,
    speechDurationMs: 8928,
    durationInFrames: 285,
    sfxFile: "audio/sfx-relay.wav",
    sfxDelayFrames: 112,
  },
  {
    id: "05-av-counter-callout",
    index: 4,
    shotType: "counter-callout",
    tag: "IMPACTO COMERCIAL • ABERDEEN GROUP",
    headline: "Texto tenta explicar. O vídeo prova.",
    embedPeakWord: "+66% LEADS",
    emphasisWord: "o vídeo prova. | sessenta e seis por cento.",
    subtitle:
      "Texto tenta explicar; o vídeo prova. Quando o cliente vê seu produto em ação e ouve uma voz real, a geração de clientes qualificados sobe sessenta e seis por cento.",
    sourceCitation: "Aberdeen Group • ROI of Video Marketing Report",
    accentColor: VOX_PALETTE.red,
    speechDurationMs: 10272,
    durationInFrames: 327,
    sfxFile: "audio/sfx-marker-stroke.wav",
    sfxDelayFrames: 95,
  },
  {
    id: "06-av-article-forbes",
    index: 5,
    shotType: "article-forbes",
    tag: "PROVA DOCUMENTAL 02 • ALCANCE ORGÂNICO",
    headline: "12× mais compartilhamentos no orgânico.",
    embedPeakWord: "1.200%",
    emphasisWord: "doze vezes mais | textos e fotos somados.",
    subtitle:
      "Além disso, o algoritmo trabalha pra você: vídeos geram doze vezes mais compartilhamentos do que textos e fotos somados.",
    sourceCitation: "WordStream & DemandSage • Social Video Benchmark",
    accentColor: VOX_PALETTE.navy,
    speechDurationMs: 7632,
    durationInFrames: 246,
    sfxFile: "audio/sfx-marker-stroke.wav",
    sfxDelayFrames: 36,
  },
  {
    id: "07-av-paper-cards",
    index: 6,
    shotType: "paper-cards",
    tag: "GUIA PRÁTICO • OS 3 PILARES",
    headline: "Os 3 vídeos que toda empresa precisa ter.",
    embedPeakWord: "3 VÍDEOS",
    emphasisWord: "três vídeos: | cliente real.",
    subtitle:
      "E sua empresa não precisa de Hollywood. Você só precisa de três vídeos: o institucional de trinta segundos, o bastidor do seu serviço e o depoimento de um cliente real.",
    sourceCitation: "Framework de Produção Audiovisual Corporativa",
    accentColor: VOX_PALETTE.red,
    speechDurationMs: 10776,
    durationInFrames: 342,
    sfxFile: "audio/sfx-paper-drop.wav",
    sfxDelayFrames: 54,
  },
  {
    id: "08-av-takeaway",
    index: 7,
    shotType: "takeaway",
    tag: "CONCLUSÃO • 5 PALAVRAS",
    headline: "Quem não grava, fica invisível.",
    embedPeakWord: "GRAVE HOJE",
    emphasisWord: "invisível | gravar hoje.",
    subtitle:
      "Quem não aparece em movimento, fica invisível no mercado. Comece a gravar hoje.",
    sourceCitation: "Resumo Documental • WYZOWL + INSIVIA + ABERDEEN",
    accentColor: VOX_PALETTE.red,
    speechDurationMs: 5808,
    durationInFrames: 192,
    sfxFile: "audio/sfx-paper-drop.wav",
    sfxDelayFrames: 18,
  },
] as const;

export const AUDIOVISUAL_TOTAL_FRAMES = AUDIOVISUAL_SHOTS.reduce(
  (acc, s) => acc + s.durationInFrames,
  0
);

/**
 * Stepped-on-twos helper from `vox-explainer/SKILL.md`:
 * Holds each pose for 2 frames to create tactile documentary animation rhythm.
 */
export const stepOnTwos = (frame: number): number => Math.floor(frame / 2) * 2;

