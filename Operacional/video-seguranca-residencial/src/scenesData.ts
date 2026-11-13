export type VisualVariant =
  | "hook-alert"
  | "problem-compare"
  | "camera-ai"
  | "smart-lock"
  | "window-sensor"
  | "dashboard-summary";

export type SceneItem = {
  readonly id: string;
  readonly tag: string;
  readonly headline: string;
  readonly highlightWord: string;
  readonly subtitle: string;
  readonly beatALabel: string;
  readonly beatBLabel: string;
  readonly accentColor: string;
  readonly surfaceMode: "dark-night" | "warm-editorial" | "daylight-shift";
  readonly durationInFrames: number;
  readonly speechDurationMs: number;
  readonly sfxFile: string;
  readonly sfxDelayFrames: number;
  readonly variant: VisualVariant;
};

// 30 FPS — Durations matched to pt-BR-AntonioNeural (+12%) MP3s
export const SCENES_DATA: readonly SceneItem[] = [
  {
    id: "01-hook",
    tag: "02:14 DA MADRUGADA",
    headline: "Câmera comum só grava o prejuízo.",
    highlightWord: "prejuízo.",
    subtitle:
      "Ter uma câmera comum em casa só serve pra você assistir ao prejuízo no dia seguinte.",
    beatALabel: "GRAVAÇÃO PASSIVA • SEM ALERTA",
    beatBLabel: "NOTIFICAÇÃO APENAS NO DIA SEGUINTE",
    accentColor: "#EF4444",
    surfaceMode: "dark-night",
    durationInFrames: 168, // 5.6s (speech: 5.07s)
    speechDurationMs: 5072,
    sfxFile: "audio/sfx-notification.wav",
    sfxDelayFrames: 8,
    variant: "hook-alert",
  },
  {
    id: "02-problema",
    tag: "MUDANÇA DE LÓGICA",
    headline: "Gravar não é proteger.",
    highlightWord: "proteger.",
    subtitle:
      "Segurança de verdade não é gravar o que aconteceu. É fazer a casa reagir antes de alguém chegar na porta.",
    beatALabel: "ANTES: SÓ REGISTRA O VÍDEO",
    beatBLabel: "AGORA: A CASA REAGE EM 2 SEGUNDOS",
    accentColor: "#F59E0B",
    surfaceMode: "warm-editorial",
    durationInFrames: 219, // 7.3s (speech: 6.80s)
    speechDurationMs: 6808,
    sfxFile: "audio/sfx-transition.wav",
    sfxDelayFrames: 75,
    variant: "problem-compare",
  },
  {
    id: "03-perimetro",
    tag: "PASSO 1 • NA CALÇADA",
    headline: "Parou no portão? O refletor acende.",
    highlightWord: "refletor acende.",
    subtitle:
      "Começa na calçada: uma câmera inteligente ignora gatos ou galhos, mas se alguém para no portão de madrugada, ela acende o refletor na hora.",
    beatALabel: "VISÃO NOTURNA • FILTRO DE FALSOS ALERTAS",
    beatBLabel: "REFLETOR 4000K ACIONADO AUTOMATICAMENTE",
    accentColor: "#EA580C",
    surfaceMode: "daylight-shift",
    durationInFrames: 258, // 8.6s (speech: 8.07s)
    speechDurationMs: 8075,
    sfxFile: "audio/sfx-relay.wav",
    sfxDelayFrames: 138,
    variant: "camera-ai",
  },
  {
    id: "04-fechadura",
    tag: "PASSO 2 • NA PORTA",
    headline: "Senha com hora pra acabar.",
    highlightWord: "hora pra acabar.",
    subtitle:
      "Na porta, nada de chave copiada. Na fechadura digital, você libera uma senha que vale só das duas às quatro da tarde e tranca sozinha.",
    beatALabel: "ACESSO TEMPORÁRIO • 14:00 ÀS 16:00",
    beatBLabel: "PORTA BATEU → TRAVAMENTO AUTOMÁTICO",
    accentColor: "#059669",
    surfaceMode: "warm-editorial",
    durationInFrames: 276, // 9.2s (speech: 8.70s)
    speechDurationMs: 8705,
    sfxFile: "audio/sfx-keypad.wav",
    sfxDelayFrames: 90,
    variant: "smart-lock",
  },
  {
    id: "05-sensores",
    tag: "PASSO 3 • JANELAS E ROTINA",
    headline: "Casa vazia que parece ocupada.",
    highlightWord: "parece ocupada.",
    subtitle:
      "Nos fundos, sensores nas janelas disparam alerta no primeiro milímetro. E quando você viaja, as luzes da sala ligam à noite simulando gente em casa.",
    beatALabel: "ABERTURA DETECTADA (1mm) → ALERTA IMEDIATO",
    beatBLabel: "MODO VIAGEM: LUZ DA SALA E TV LIGADAS ÀS 19:30",
    accentColor: "#2563EB",
    surfaceMode: "dark-night",
    durationInFrames: 294, // 9.8s (speech: 9.33s)
    speechDurationMs: 9330,
    sfxFile: "audio/sfx-notification.wav",
    sfxDelayFrames: 68,
    variant: "window-sensor",
  },
  {
    id: "06-fechamento",
    tag: "RESUMO PRÁTICO",
    headline: "Três camadas. Zero alvo fácil.",
    highlightWord: "Zero alvo fácil.",
    subtitle:
      "Três camadas simples: câmera que acende a luz, fechadura sem chave e sensor nas janelas. Sua casa deixa de ser um alvo fácil.",
    beatALabel: "PERÍMETRO + ACESSO + SENSORES",
    beatBLabel: "PROTEÇÃO ATIVA FUNCIONANDO 24H",
    accentColor: "#16A34A",
    surfaceMode: "warm-editorial",
    durationInFrames: 273, // 9.1s (speech: 8.57s)
    speechDurationMs: 8571,
    sfxFile: "audio/sfx-relay.wav",
    sfxDelayFrames: 30,
    variant: "dashboard-summary",
  },
] as const;

export const TOTAL_DURATION_FRAMES = SCENES_DATA.reduce(
  (acc, item) => acc + item.durationInFrames,
  0
);
