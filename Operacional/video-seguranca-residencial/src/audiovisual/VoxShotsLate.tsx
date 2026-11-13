import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { stepOnTwos, VOX_PALETTE } from "./audiovisualData";
import { EditorialArticleHighlight } from "./EditorialArticleHighlight";
import { TornPaperStrip } from "./VoxShotsEarly";

/**
 * SHOT 05: Counter + Label Call-Out (`vox-explainer` Counter + Hand-Drawn Marker Circle)
 */
export const CounterCalloutShot: React.FC = () => {
  const rawFrame = useCurrentFrame();
  const frame = stepOnTwos(rawFrame);
  const { fps } = useVideoConfig();

  const countVal = Math.round(
    interpolate(frame, [16, 118], [0, 66], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // Hand-drawn marker circle progress (frames 110..168)
  const circleDraw = interpolate(frame, [110, 168], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const labelPop = spring({
    frame: Math.max(0, frame - 148),
    fps,
    config: { damping: 15, stiffness: 160 },
  });

  const perimeter = 820;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 68px",
        gap: 30,
      }}
    >
      {/* Top Counter Card */}
      <div
        style={{
          width: 936,
          backgroundColor: VOX_PALETTE.navy,
          border: `3.5px solid ${VOX_PALETTE.ink}`,
          boxShadow: "12px 14px 0px rgba(25, 24, 22, 0.22)",
          padding: "36px 44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ maxWidth: 500 }}>
          <div
            style={{
              backgroundColor: VOX_PALETTE.yellow,
              color: VOX_PALETTE.ink,
              display: "inline-block",
              padding: "5px 14px",
              fontFamily: "'Segoe UI', Inter, sans-serif",
              fontWeight: 900,
              fontSize: 18,
              letterSpacing: 1.8,
              marginBottom: 14,
            }}
          >
            ABERDEEN GROUP • ROI REPORT
          </div>
          <div
            style={{
              fontFamily: "'Segoe UI', Inter, sans-serif",
              fontWeight: 900,
              fontSize: 38,
              lineHeight: 1.15,
              color: VOX_PALETTE.paper,
            }}
          >
            MAIS LEADS QUALIFICADOS POR ANO COM VÍDEO
          </div>
        </div>

        <div
          style={{
            fontFamily: "'Segoe UI', Impact, sans-serif",
            fontWeight: 900,
            fontSize: 132,
            lineHeight: 1,
            color: VOX_PALETTE.yellow,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          +{countVal}%
        </div>
      </div>

      {/* Bottom Diagram with Hand-Drawn Marker Call-Out */}
      <div
        style={{
          width: 936,
          backgroundColor: VOX_PALETTE.paper,
          border: `3px solid ${VOX_PALETTE.ink}`,
          boxShadow: "10px 12px 0px rgba(25, 24, 22, 0.18)",
          padding: "36px 40px",
          position: "relative",
        }}
      >
        <div
          style={{
            fontFamily: "'Segoe UI', Inter, sans-serif",
            fontWeight: 800,
            fontSize: 21,
            color: VOX_PALETTE.mutedInk,
            letterSpacing: 1.5,
            marginBottom: 22,
          }}
        >
          A EQUAÇÃO DA CONFIANÇA AUDIOVISUAL:
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1.25fr",
            gap: 20,
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: VOX_PALETTE.cream,
              border: `2px solid ${VOX_PALETTE.ink}`,
              padding: "22px 18px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontWeight: 900,
                fontSize: 24,
                color: VOX_PALETTE.navy,
                fontFamily: "'Segoe UI', Inter, sans-serif",
              }}
            >
              1. VOZ REAL
            </div>
            <div
              style={{
                fontSize: 19,
                fontWeight: 600,
                color: VOX_PALETTE.mutedInk,
                marginTop: 6,
                fontFamily: "'Segoe UI', Inter, sans-serif",
              }}
            >
              Humaniza a marca
            </div>
          </div>

          <div
            style={{
              backgroundColor: VOX_PALETTE.cream,
              border: `2px solid ${VOX_PALETTE.ink}`,
              padding: "22px 18px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontWeight: 900,
                fontSize: 24,
                color: VOX_PALETTE.navy,
                fontFamily: "'Segoe UI', Inter, sans-serif",
              }}
            >
              2. PROVA VISUAL
            </div>
            <div
              style={{
                fontSize: 19,
                fontWeight: 600,
                color: VOX_PALETTE.mutedInk,
                marginTop: 6,
                fontFamily: "'Segoe UI', Inter, sans-serif",
              }}
            >
              Mostra funcionando
            </div>
          </div>

          {/* Target of the Label Call-Out */}
          <div
            style={{
              backgroundColor: VOX_PALETTE.yellow,
              border: `2.5px solid ${VOX_PALETTE.ink}`,
              padding: "22px 18px",
              textAlign: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                fontWeight: 900,
                fontSize: 25,
                color: VOX_PALETTE.ink,
                fontFamily: "'Segoe UI', Inter, sans-serif",
              }}
            >
              96% ENTENDIMENTO
            </div>
            <div
              style={{
                fontSize: 19,
                fontWeight: 800,
                color: VOX_PALETTE.red,
                marginTop: 6,
                fontFamily: "'Segoe UI', Inter, sans-serif",
              }}
            >
              Zero objeção técnica
            </div>

            {/* Hand-drawn marker circle (`vox-explainer` Label Call-Out) */}
            <svg
              viewBox="0 0 340 150"
              style={{
                position: "absolute",
                left: -18,
                top: -22,
                width: 356,
                height: 164,
                pointerEvents: "none",
                overflow: "visible",
              }}
            >
              <path
                d="M 24,22 C 95,-6 260,-4 316,28 C 346,56 338,118 292,136 C 215,156 68,152 20,122 C -8,94 6,38 38,18"
                fill="none"
                stroke={VOX_PALETTE.red}
                strokeWidth={6.5}
                strokeLinecap="round"
                strokeDasharray={perimeter}
                strokeDashoffset={perimeter * (1 - circleDraw)}
              />
            </svg>
          </div>
        </div>

        {/* Call-out badge */}
        <div
          style={{
            marginTop: 22,
            display: "flex",
            justifyContent: "flex-end",
            opacity: labelPop,
            transform: `translateY(${interpolate(labelPop, [0, 1], [14, 0]).toFixed(1)}px)`,
          }}
        >
          <span
            style={{
              backgroundColor: VOX_PALETTE.red,
              color: VOX_PALETTE.paper,
              fontFamily: "'Segoe UI', Inter, sans-serif",
              fontWeight: 900,
              fontSize: 20,
              padding: "8px 20px",
              letterSpacing: 1.2,
            }}
          >
            ↑ CLIENTE QUE ENTENDE RÁPIDO COMPRA MAIS RÁPIDO
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * SHOT 06: Article Highlight #2 — 1200% Social Shares (WordStream / DemandSage)
 */
export const ArticleForbesShot: React.FC = () => {
  return (
    <EditorialArticleHighlight
      publication="WordStream & DemandSage"
      categoryLabel="BENCHMARK DIGITAL"
      reportTitle="Social Video Engagement: O Efeito Multiplicador do Vídeo no Alcance Orgânico"
      bylineAndDate="Análise de Distribuição Algorítmica"
      statCallout="1.200%"
      statLabel="mais compartilhamentos gerados por vídeos em comparação com texto e imagens juntos."
      footnoteSource="WordStream / DemandSage — Video Engagement Study"
      accentColor={VOX_PALETTE.navy}
      lines={[
        {
          prefix: "Nas redes sociais, conteúdos em vídeo geram ",
          highlighted: "1.200% mais compartilhamentos orgânicos",
          suffix: " do que publicações de texto e imagem somadas.",
          startFrame: 22,
          durationFrames: 36,
        },
        {
          prefix: "Páginas com vídeo têm ",
          highlighted: "53 vezes mais chance de ranquear no topo",
          suffix: " das buscas pela retenção de tempo na página.",
          startFrame: 84,
          durationFrames: 42,
        },
      ]}
    />
  );
};

/**
 * SHOT 07: Three Symmetrical Torn-Edge Paper Cards (`vox-explainer` Paper Cards Shot)
 */
export const PaperCardsShot: React.FC = () => {
  const rawFrame = useCurrentFrame();
  const frame = stepOnTwos(rawFrame);
  const { fps } = useVideoConfig();

  const cards = [
    {
      num: "01",
      badge: "30 A 60 SEGUNDOS",
      title: "VÍDEO INSTITUCIONAL DIRETO",
      desc: "Mostra em 30 segundos qual problema sua empresa resolve, para quem e qual o diferencial.",
      accent: VOX_PALETTE.red,
    },
    {
      num: "02",
      badge: "AUTORIDADE TÉCNICA",
      title: "BASTIDOR & PROCESSO REAL",
      desc: "Prova como sua equipe trabalha, a estrutura física ou digital e o cuidado na entrega.",
      accent: VOX_PALETTE.navy,
    },
    {
      num: "03",
      badge: "CONVERSÃO FINAL",
      title: "PROVA SOCIAL DE CLIENTE",
      desc: "Um cliente real contando em vídeo o antes e o depois de contratar sua empresa.",
      accent: "#166534",
    },
  ] as const;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 68px",
        gap: 24,
      }}
    >
      <div
        style={{
          backgroundColor: VOX_PALETTE.ink,
          color: VOX_PALETTE.yellow,
          padding: "10px 26px",
          fontFamily: "'Segoe UI', Inter, sans-serif",
          fontWeight: 900,
          fontSize: 22,
          letterSpacing: 2,
        }}
      >
        KIT ESSENCIAL • OS 3 VÍDEOS QUE VENDEM PELA SUA EMPRESA 24H
      </div>

      {cards.map((c, idx) => {
        const drop = spring({
          frame: Math.max(0, frame - idx * 32),
          fps,
          config: { damping: 16, stiffness: 155, mass: 0.9 },
        });
        const y = interpolate(drop, [0, 1], [60, 0]);
        const op = interpolate(drop, [0, 0.25, 1], [0, 1, 1]);

        return (
          <div
            key={c.num}
            style={{
              width: 936,
              backgroundColor: VOX_PALETTE.paper,
              border: `3px solid ${VOX_PALETTE.ink}`,
              boxShadow: "10px 12px 0px rgba(25, 24, 22, 0.2)",
              padding: "28px 36px",
              display: "flex",
              alignItems: "center",
              gap: 30,
              opacity: op,
              transform: `translateY(${y.toFixed(1)}px)`,
              clipPath:
                "polygon(0% 2%, 8% 0%, 19% 3%, 33% 0%, 48% 2%, 64% 0%, 79% 3%, 92% 0%, 100% 2%, 100% 98%, 90% 100%, 76% 97%, 61% 100%, 45% 98%, 30% 100%, 14% 97%, 0% 100%)",
            }}
          >
            <div
              style={{
                minWidth: 104,
                height: 104,
                backgroundColor: c.accent,
                color: VOX_PALETTE.paper,
                border: `2.5px solid ${VOX_PALETTE.ink}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Segoe UI', Impact, sans-serif",
                fontWeight: 900,
                fontSize: 52,
              }}
            >
              {c.num}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "inline-block",
                  backgroundColor: VOX_PALETTE.cream,
                  border: `1.5px solid ${VOX_PALETTE.ink}`,
                  padding: "3px 12px",
                  fontFamily: "'Segoe UI', Inter, sans-serif",
                  fontWeight: 800,
                  fontSize: 16,
                  color: c.accent,
                  letterSpacing: 1.4,
                  marginBottom: 8,
                }}
              >
                {c.badge}
              </div>
              <div
                style={{
                  fontFamily: "'Segoe UI', Inter, sans-serif",
                  fontWeight: 900,
                  fontSize: 31,
                  color: VOX_PALETTE.ink,
                  marginBottom: 6,
                }}
              >
                {c.title}
              </div>
              <div
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: 23,
                  lineHeight: 1.32,
                  color: VOX_PALETTE.mutedInk,
                }}
              >
                {c.desc}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * SHOT 08: Five-Word Takeaway (`vox-explainer` Step 2: "The last shot is the takeaway, in five words or fewer")
 */
export const TakeawayShot: React.FC = () => {
  const rawFrame = useCurrentFrame();
  const frame = stepOnTwos(rawFrame);
  const { fps } = useVideoConfig();

  const summaryEnter = spring({
    frame: Math.max(0, frame - 34),
    fps,
    config: { damping: 16, stiffness: 145 },
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 68px",
        gap: 26,
      }}
    >
      {/* 5-Word Takeaway: "QUEM NÃO GRAVA, FICA INVISÍVEL." */}
      <TornPaperStrip
        bg={VOX_PALETTE.navy}
        color={VOX_PALETTE.paper}
        text="QUEM NÃO GRAVA,"
        delayFrames={0}
        rotateDeg={-1.3}
        fontSize={76}
      />
      <TornPaperStrip
        bg={VOX_PALETTE.red}
        color={VOX_PALETTE.yellow}
        text="FICA INVISÍVEL."
        delayFrames={12}
        rotateDeg={1.1}
        fontSize={88}
      />

      {/* Consolidated Verified Evidence Board */}
      <div
        style={{
          marginTop: 24,
          width: 936,
          backgroundColor: VOX_PALETTE.paper,
          border: `3.5px solid ${VOX_PALETTE.ink}`,
          boxShadow: "12px 14px 0px rgba(25, 24, 22, 0.22)",
          padding: "32px 36px",
          opacity: summaryEnter,
          transform: `translateY(${interpolate(summaryEnter, [0, 1], [32, 0]).toFixed(1)}px)`,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
            textAlign: "center",
          }}
        >
          <div style={{ borderRight: "2px dashed #B8AFA3", paddingRight: 12 }}>
            <div
              style={{
                fontFamily: "'Segoe UI', Impact, sans-serif",
                fontWeight: 900,
                fontSize: 64,
                color: VOX_PALETTE.red,
              }}
            >
              89%
            </div>
            <div
              style={{
                fontFamily: "'Segoe UI', Inter, sans-serif",
                fontWeight: 800,
                fontSize: 19,
                color: VOX_PALETTE.ink,
              }}
            >
              DECIDEM A COMPRA PELO VÍDEO
            </div>
          </div>

          <div style={{ borderRight: "2px dashed #B8AFA3", paddingRight: 12 }}>
            <div
              style={{
                fontFamily: "'Segoe UI', Impact, sans-serif",
                fontWeight: 900,
                fontSize: 64,
                color: VOX_PALETTE.navy,
              }}
            >
              95%
            </div>
            <div
              style={{
                fontFamily: "'Segoe UI', Inter, sans-serif",
                fontWeight: 800,
                fontSize: 19,
                color: VOX_PALETTE.ink,
              }}
            >
              DE RETENÇÃO NA MEMÓRIA
            </div>
          </div>

          <div>
            <div
              style={{
                fontFamily: "'Segoe UI', Impact, sans-serif",
                fontWeight: 900,
                fontSize: 64,
                color: "#166534",
              }}
            >
              12×
            </div>
            <div
              style={{
                fontFamily: "'Segoe UI', Inter, sans-serif",
                fontWeight: 800,
                fontSize: 19,
                color: VOX_PALETTE.ink,
              }}
            >
              MAIS ALCANCE ORGÂNICO
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

