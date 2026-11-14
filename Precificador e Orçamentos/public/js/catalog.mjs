/**
 * Catalogo oficial de servicos de captacao, edicao e cronograma audiovisual.
 */

export const CAPTURE_TIERS = Object.freeze({
  nenhuma: {
    id: "nenhuma",
    label: "Somente Edicao (Sem Captacao)",
    shortLabel: "Sem captacao",
    defaultDayRate: 0,
    summary: "Cliente fornece os arquivos brutos gravados para decupagem e edicao.",
    deliverables: [],
  },
  basica: {
    id: "basica",
    label: "Basico — Captacao Agil (Meia Diaria / Ate 4h)",
    shortLabel: "Captacao Basica (Ate 4h)",
    defaultDayRate: 350,
    summary: "Ideal para Reels rapidos, depoimentos simples e cobertura objetiva em locacao unica.",
    deliverables: [
      "1 operador de camera em locacao (meia diaria de ate 4h)",
      "Camera 4K estabilizada + 1 microfone de lapela sem fio",
      "Iluminacao LED portatil de apoio para cena limpa",
    ],
  },
  intermediaria: {
    id: "intermediaria",
    label: "Intermediario — Captacao Comercial (Diaria / Ate 8h)",
    shortLabel: "Captacao Comercial (Ate 8h)",
    defaultDayRate: 750,
    summary: "Producao comercial para anuncios, posicionamento de marca e captação estruturada.",
    deliverables: [
      "Diaria comercial completa (ate 8h) com direcao de enquadramento",
      "Camera Cinema/Mirrorless 4K 10-bit Log + lentes claras + Gimbal",
      "Kit de iluminacao continua 3 pontos + captacao dupla de audio (lapela + boom)",
    ],
  },
  avancada: {
    id: "avancada",
    label: "Avancado — Producao Cinematografica / Institucional",
    shortLabel: "Producao Cinematografica",
    defaultDayRate: 1350,
    summary: "Estrutura completa para campanhas institucionais, multipontos e alta exigencia estetica.",
    deliverables: [
      "Diaria completa com diretor de cena e assistente de set/tecnico",
      "Setup multicamera 4K Log (plano principal + angulo de cobertura/B-roll)",
      "Iluminacao cinematografica + microfonacao redundante de estudio",
    ],
  },
});

export const CAPTURE_ADDONS = Object.freeze({
  drone: {
    id: "drone",
    label: "Imagens Aereas com Drone 4K",
    defaultPrice: 250,
    deliverableText: "Captacao aerea com Drone 4K para planos externos e fachada",
  },
  teleprompter: {
    id: "teleprompter",
    label: "Teleprompter no Set",
    defaultPrice: 100,
    deliverableText: "Operacao com teleprompter para apresentacao fluida do roteiro",
  },
  deslocamento: {
    id: "deslocamento",
    label: "Deslocamento / Logistica Externa",
    defaultPrice: 100,
    deliverableText: "Logistica e deslocamento da equipe ate a locacao",
  },
  operador_extra: {
    id: "operador_extra",
    label: "Segundo Cinegrafista / Assistente Extra",
    defaultPrice: 350,
    deliverableText: "Segundo operador dedicado para cobertura simultanea e agilidade de set",
  },
});

export const EDIT_TIERS = Object.freeze({
  basica: {
    id: "basica",
    label: "Edicao Basica — Dinamica Reels / Shorts",
    shortLabel: "Basica (Reels / Corte & Legenda)",
    defaultPrice: 55,
    description: "Corte ritmico, limpeza de pausas, legendas dinamicas, cor base e trilha licenciada.",
  },
  intermediaria: {
    id: "intermediaria",
    label: "Edicao Intermediaria — Comercial & Trafego Pago",
    shortLabel: "Intermediaria (Comercial / GCs + B-roll)",
    defaultPrice: 150,
    description: "Decupagem limpa, B-rolls estrategicos, GCs animados em Montserrat na identidade da marca e sound design.",
  },
  avancada: {
    id: "avancada",
    label: "Edicao Avancada — Institucional / Motion Premium",
    shortLabel: "Avancada (Institucional / Motion & Grading)",
    defaultPrice: 450,
    description: "Narrativa completa, pacote de Motion Graphics/GCs ProRes 4444, Color Grading avancado e mixagem master.",
  },
});

export const ORIENTATIONS = Object.freeze({
  vertical: {
    id: "vertical",
    label: "Vertical 9:16 (Reels, TikTok, Shorts)",
    specText: "Formato Vertical 9:16 (1080x1920)",
  },
  horizontal: {
    id: "horizontal",
    label: "Horizontal 16:9 (YouTube, TV, Site)",
    specText: "Formato Horizontal 16:9 (1920x1080 / 4K)",
  },
  ambos: {
    id: "ambos",
    label: "Multi-formato (Vertical 9:16 + Horizontal 16:9)",
    specText: "Versoes Vertical 9:16 e Horizontal 16:9",
  },
});

export const ACCENT_PRESETS = Object.freeze([
  { label: "Ambar Editorial", hex: "#D97706" },
  { label: "Vermelho Pax Vida", hex: "#B91C1C" },
  { label: "Azul Corporativo", hex: "#2563EB" },
  { label: "Esmeralda", hex: "#059669" },
  { label: "Grafite Elegante", hex: "#334155" },
]);

export const DEFAULT_TIMELINE = Object.freeze([
  {
    step: 1,
    title: "Alinhamento Criativo & Roteirizacao",
    duration: "Dia 1 a 2",
    description: "Reuniao de alinhamento, definicao dos ganchos comerciais e aprovacao do roteiro de gravacao.",
  },
  {
    step: 2,
    title: "Captacao Audiovisual em Locacao",
    duration: "Dia 3",
    description: "Execucao da diaria de gravacao com direcao de cena, iluminacao controlada e captacao de audio.",
  },
  {
    step: 3,
    title: "Decupagem, Edicao & Identidade Visual (GCs)",
    duration: "Dias 4 a 7",
    description: "Montagem narrativa, insercao de B-rolls, tratamento de cor/audio e aplicacao dos grafismos da marca.",
  },
  {
    step: 4,
    title: "Apresentacao da 1a Versao & Ajustes",
    duration: "Dias 8 a 9",
    description: "Envio do link de revisao para validacao do cliente e aplicacao das rodadas de ajuste previstas.",
  },
  {
    step: 5,
    title: "Entrega Final dos Arquivos Master",
    duration: "Dia 10",
    description: "Liberacao dos videos finalizados em alta definicao prontos para publicacao e trafego pago.",
  },
]);
