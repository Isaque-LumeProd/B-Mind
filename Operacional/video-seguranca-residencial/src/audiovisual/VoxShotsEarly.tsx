import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { stepOnTwos, VOX_PALETTE } from "./audiovisualData";
import { EditorialArticleHighlight } from "./EditorialArticleHighlight";

export const TornPaperStrip: React.FC<{
  readonly bg: string;
  readonly color: string;
  readonly text: string;
  readonly delayFrames: number;
  readonly rotateDeg?: number;
  readonly fontSize?: number;
}> = ({ bg, color, text, delayFrames, rotateDeg = -1.2, fontSize = 56 }) => {
  const rawFrame = useCurrentFrame();
  const frame = stepOnTwos(rawFrame);
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 16, stiffness: 180, mass: 0.8 },
  });

  const translateX = interpolate(enter, [0, 1], [-120, 0]);
  const opacity = interpolate(enter, [0, 0.25, 1], [0, 1, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${translateX.toFixed(1)}px) rotate(${rotateDeg}deg)`,
        backgroundColor: bg,
        color,
        padding: "18px 34px",
        border: `3px solid ${VOX_PALETTE.ink}`,
        boxShadow: "10px 12px 0px rgba(25, 24, 22, 0.22)",
         clipPath:
          "polygon(0% 4%, 6% 0%, 14% 5%, 23% 1%, 34% 4%, 46% 0%, 58% 4%, 70% 1%, 82% 5%, 92% 0%, 100% 4%, 99% 96%, 91% 100%, 80% 95%, 68% 100%, 55% 96%, 42% 100%, 29% 95%, 16% 100%, 7% 96%, 0% 99%)",
        display: "inline-block",
        maxWidth: 940,
      }}
    >
      <span
        style={{
          fontFamily: "'Segoe UI', Impact, 'Arial Narrow', sans-serif",
          fontWeight: 900,
          fontSize,
          lineHeight: 1.08,
          letterSpacing: 1.2,
          textTransform: "uppercase",
          display: "block",
        }}
      >
        {text}
      </span>
    </div>
  );
};

/**
 * SHOT 01: Kinetic Statement + Central Question (`vox-explainer` Shot 1)
 */
export const KineticStatementShot: React.FC = () => {
  const rawFrame = useCurrentFrame();
  const frame = stepOnTwos(rawFrame);
  const { fps } = useVideoConfig();

  const compareReveal = spring({
    frame: Math.max(0, frame - 42),
    fps,
    config: { damping: 17, stiffness: 140 },
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "0 72px",
        gap: 22,
      }}
    >
      <TornPaperStrip
        bg={VOX_PALETTE.navy}
        color={VOX_PALETTE.paper}
        text="DUAS EMPRESAS VENDEM"
        delayFrames={0}
        rotateDeg={-1.4}
        fontSize={58}
      />
      <TornPaperStrip
        bg={VOX_PALETTE.paper}
        color={VOX_PALETTE.ink}
        text="EXATAMENTE O MESMO PRODUTO."
        delayFrames={10}
        rotateDeg={0.8}
        fontSize={54}
      />
      <TornPaperStrip
        bg={VOX_PALETTE.red}
        color={VOX_PALETTE.yellow}
        text="POR QUE SÓ UMA VIRA LÍDER?"
        delayFrames={22}
        rotateDeg={-0.9}
        fontSize={60}
      />

      {/* Documentary visual comparison cards */}
      <div
        style={{
          marginTop: 26,
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 28,
          opacity: compareReveal,
          transform: `translateY(${interpolate(compareReveal, [0, 1], [36, 0]).toFixed(1)}px)`,
        }}
      >
        {/* Card A: Invisible Company */}
        <div
          style={{
            backgroundColor: "#E5DAC3",
            border: `2.5px solid ${VOX_PALETTE.ink}`,
            padding: "28px 26px",
            boxShadow: "8px 10px 0px rgba(25,24,22,0.16)",
          }}
        >
          <div
            style={{
              fontFamily: "'Segoe UI', Inter, sans-serif",
              fontWeight: 800,
              fontSize: 20,
              color: VOX_PALETTE.mutedInk,
              letterSpacing: 1.6,
              marginBottom: 12,
            }}
          >
            EMPRESA A • SÓ TEXTO E FOTO
          </div>
          <div
            style={{
              height: 110,
              border: "2px dashed #8C8275",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Segoe UI', Inter, sans-serif",
              fontWeight: 700,
              fontSize: 24,
              color: "#6E665C",
            }}
          >
            [ ARTE ESTÁTICA GENÉRICA ]
          </div>
          <div
            style={{
              marginTop: 14,
              fontFamily: "'Segoe UI', Inter, sans-serif",
              fontWeight: 800,
              fontSize: 24,
              color: VOX_PALETTE.ink,
            }}
          >
            Disputa por preço
          </div>
        </div>

        {/* Card B: Market Leader with Audiovisual */}
        <div
          style={{
            backgroundColor: VOX_PALETTE.paper,
            border: `3px solid ${VOX_PALETTE.ink}`,
            padding: "28px 26px",
            boxShadow: "10px 12px 0px rgba(184,49,42,0.28)",
            position: "relative",
          }}
        >
          <div
            style={{
              fontFamily: "'Segoe UI', Inter, sans-serif",
              fontWeight: 900,
              fontSize: 20,
              color: VOX_PALETTE.red,
              letterSpacing: 1.6,
              marginBottom: 12,
            }}
          >
            EMPRESA B • AUDIOVISUAL ATIVO
          </div>
          <div
            style={{
              height: 110,
              backgroundColor: VOX_PALETTE.navy,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              padding: "0 20px",
            }}
          >
            {/* Play triangle + stepped soundbars */}
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                backgroundColor: VOX_PALETTE.red,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: VOX_PALETTE.paper,
                fontSize: 26,
                fontWeight: 900,
              }}
            >
              ▶
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, height: 64 }}>
              {[0.4, 0.85, 0.6, 1.0, 0.5, 0.9, 0.7, 0.45].map((h, i) => {
                const wave =
                  0.35 +
                  0.65 *
                    Math.abs(Math.sin((frame * 0.18 + i * 0.9) * (0.8 + h * 0.3)));
                return (
                  <div
                    key={i}
                    style={{
                      width: 10,
                      height: Math.round(58 * wave),
                      backgroundColor:
                        i % 2 === 0 ? VOX_PALETTE.yellow : VOX_PALETTE.paper,
                    }}
                  />
                );
              })}
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              fontFamily: "'Segoe UI', Inter, sans-serif",
              fontWeight: 900,
              fontSize: 24,
              color: VOX_PALETTE.navy,
            }}
          >
            Domina a percepção de valor
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * SHOT 02: Symmetrical 3x3 Grid ("They all look the same, then one breaks the pattern")
 */
export const GridBreakShot: React.FC = () => {
  const rawFrame = useCurrentFrame();
  const frame = stepOnTwos(rawFrame);
  const { fps } = useVideoConfig();

  const breakStartFrame = 86;
  const breakProgress = spring({
    frame: Math.max(0, frame - breakStartFrame),
    fps,
    config: { damping: 14, stiffness: 160 },
  });

  const tiles = Array.from({ length: 9 }, (_, i) => i);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 64px",
        gap: 28,
      }}
    >
      {/* Header label */}
      <div
        style={{
          backgroundColor: VOX_PALETTE.navy,
          color: VOX_PALETTE.paper,
          padding: "12px 28px",
          border: `2.5px solid ${VOX_PALETTE.ink}`,
          fontFamily: "'Segoe UI', Inter, sans-serif",
          fontWeight: 800,
          fontSize: 25,
          letterSpacing: 1.5,
        }}
      >
        O FEED DO SEU CLIENTE HOJE • TEMPO MÉDIO DE ATENÇÃO: 1,7 SEGUNDO
      </div>

      {/* Symmetrical 3x3 grid with equal sizes and equal 24px gaps */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 296px)",
          gridTemplateRows: "repeat(3, 250px)",
          gap: 24,
        }}
      >
        {tiles.map((idx) => {
          const isHero = idx === 4;
          const tileEnter = spring({
            frame: Math.max(0, frame - idx * 3),
            fps,
            config: { damping: 18, stiffness: 170 },
          });

          if (isHero && breakProgress > 0.01) {
            const heroScale = interpolate(breakProgress, [0, 1], [1, 1.12]);
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: VOX_PALETTE.red,
                  border: `4px solid ${VOX_PALETTE.ink}`,
                  boxShadow: "14px 16px 0px rgba(20, 33, 61, 0.34)",
                  transform: `scale(${heroScale.toFixed(3)}) rotate(-1.5deg)`,
                  zIndex: 10,
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: VOX_PALETTE.yellow,
                      color: VOX_PALETTE.ink,
                      fontWeight: 900,
                      fontSize: 16,
                      padding: "4px 10px",
                      fontFamily: "'Segoe UI', Inter, sans-serif",
                    }}
                  >
                    ● REC • VÍDEO REAL
                  </span>
                  <span
                    style={{
                      color: VOX_PALETTE.paper,
                      fontWeight: 800,
                      fontSize: 16,
                      fontFamily: "'Segoe UI', Inter, sans-serif",
                    }}
                  >
                    +RETENÇÃO
                  </span>
                </div>

                <div
                  style={{
                    fontFamily: "'Segoe UI', Impact, sans-serif",
                    fontWeight: 900,
                    fontSize: 34,
                    lineHeight: 1.08,
                    color: VOX_PALETTE.paper,
                    textTransform: "uppercase",
                  }}
                >
                  MOVIMENTO QUEBRA O AUTOMÁTICO
                </div>

                <div
                  style={{
                    height: 12,
                    backgroundColor: VOX_PALETTE.navy,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(100, Math.round(breakProgress * 100))}%`,
                      height: "100%",
                      backgroundColor: VOX_PALETTE.yellow,
                    }}
                  />
                </div>
              </div>
            );
          }

          return (
            <div
              key={idx}
              style={{
                backgroundColor: "#E2D7C3",
                border: "2px solid #8E8477",
                padding: 20,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                opacity: interpolate(
                  breakProgress,
                  [0, 1],
                  [tileEnter, 0.48]
                ),
                transform: `scale(${interpolate(tileEnter, [0, 1], [0.88, 1]).toFixed(3)})`,
              }}
            >
              <div
                style={{
                  width: "55%",
                  height: 14,
                  backgroundColor: "#B5AA99",
                }}
              />
              <div
                style={{
                  height: 96,
                  backgroundColor: "#CFC3AE",
                  border: "1.5px dashed #968B7C",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Segoe UI', Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  color: "#6B6257",
                  textAlign: "center",
                }}
              >
                TEMPLATE ESTÁTICO #{idx + 1}
              </div>
              <div
                style={{
                  fontFamily: "'Segoe UI', Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "#7A7064",
                }}
              >
                Ignorado em 1,7s
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * SHOT 03: Article Highlight #1 — Wyzowl Video Marketing Report
 */
export const ArticleWyzowlShot: React.FC = () => {
  return (
    <EditorialArticleHighlight
      publication="Wyzowl Research"
      categoryLabel="ESTUDO ANUAL"
      reportTitle="The State of Video Marketing: O Impacto Direto do Audiovisual na Decisão de Compra"
      bylineAndDate="Relatório Global • 10ª Edição"
      statCallout="89%"
      statLabel="dos consumidores dizem que assistir ao vídeo de uma empresa os convenceu a comprar."
      footnoteSource="Wyzowl — State of Video Marketing Survey (2024)"
      accentColor={VOX_PALETTE.red}
      lines={[
        {
          prefix: "Os dados mostram que ",
          highlighted: "91% das empresas já utilizam vídeo",
          suffix: " como sua principal ferramenta de comunicação e vendas.",
          startFrame: 26,
          durationFrames: 36,
        },
        {
          prefix: "Entre os clientes entrevistados, ",
          highlighted: "89% afirmam que o vídeo de uma marca foi decisivo",
          suffix: " para escolher o produto ou contratar o serviço.",
          startFrame: 92,
          durationFrames: 44,
        },
      ]}
    />
  );
};

/**
 * SHOT 04: Before / After Shot — Insivia 10% Text vs 95% Video Retention
 */
export const BeforeAfterShot: React.FC = () => {
  const rawFrame = useCurrentFrame();
  const frame = stepOnTwos(rawFrame);
  const { fps } = useVideoConfig();

  const flipFrame = 96;
  const afterProgress = spring({
    frame: Math.max(0, frame - flipFrame),
    fps,
    config: { damping: 15, stiffness: 150 },
  });

  const videoPct = Math.round(
    interpolate(frame, [flipFrame, flipFrame + 54], [10, 95], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

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
        gap: 28,
      }}
    >
      {/* Flipping Mode Chip (`vox-explainer` Before/After date/mode chip flip) */}
      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor:
              afterProgress < 0.5 ? VOX_PALETTE.ink : "#D8CCB8",
            color: afterProgress < 0.5 ? VOX_PALETTE.paper : VOX_PALETTE.mutedInk,
            padding: "12px 26px",
            border: `2.5px solid ${VOX_PALETTE.ink}`,
            fontFamily: "'Segoe UI', Inter, sans-serif",
            fontWeight: 900,
            fontSize: 22,
            letterSpacing: 1.5,
          }}
        >
          ANTES: SÓ TEXTO (10%)
        </div>
        <div
          style={{
            backgroundColor:
              afterProgress >= 0.5 ? VOX_PALETTE.red : "#D8CCB8",
            color:
              afterProgress >= 0.5 ? VOX_PALETTE.yellow : VOX_PALETTE.mutedInk,
            padding: "12px 26px",
            border: `2.5px solid ${VOX_PALETTE.ink}`,
            fontFamily: "'Segoe UI', Inter, sans-serif",
            fontWeight: 900,
            fontSize: 22,
            letterSpacing: 1.5,
            transform: `scale(${interpolate(afterProgress, [0, 1], [0.95, 1.06]).toFixed(3)})`,
          }}
        >
          DEPOIS: AUDIOVISUAL (95%)
        </div>
      </div>

      {/* Main Comparison Card */}
      <div
        style={{
          width: 936,
          backgroundColor: VOX_PALETTE.paper,
          border: `3px solid ${VOX_PALETTE.ink}`,
          boxShadow: "12px 14px 0px rgba(25, 24, 22, 0.2)",
          padding: "42px 46px",
          display: "flex",
          flexDirection: "column",
          gap: 34,
        }}
      >
        {/* Row 1: Static Text Retention (10%) */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontFamily: "'Segoe UI', Inter, sans-serif",
                fontWeight: 800,
                fontSize: 26,
                color: VOX_PALETTE.mutedInk,
              }}
            >
              QUANDO O CLIENTE SÓ LÊ UM TEXTO:
            </span>
            <span
              style={{
                fontFamily: "'Segoe UI', Inter, sans-serif",
                fontWeight: 900,
                fontSize: 54,
                color: VOX_PALETTE.mutedInk,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              10% RETIDO
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(20, 1fr)",
              gap: 8,
              height: 44,
            }}
          >
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: i < 2 ? VOX_PALETTE.ink : "#E2D7C3",
                  border: `1.5px solid ${VOX_PALETTE.ink}`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Row 2: Audiovisual Retention (95%) */}
        <div
          style={{
            opacity: interpolate(afterProgress, [0, 0.2, 1], [0.25, 1, 1]),
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontFamily: "'Segoe UI', Inter, sans-serif",
                fontWeight: 900,
                fontSize: 28,
                color: VOX_PALETTE.navy,
              }}
            >
              QUANDO ELE VÊ E OUVE EM VÍDEO:
            </span>
            <span
              style={{
                fontFamily: "'Segoe UI', Inter, sans-serif",
                fontWeight: 900,
                fontSize: 58,
                color: VOX_PALETTE.red,
                fontVariantNumeric: "tabular-nums",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {videoPct}% RETIDO
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(20, 1fr)",
              gap: 8,
              height: 58,
            }}
          >
            {Array.from({ length: 20 }, (_, i) => {
              const activeBlocks = Math.round((videoPct / 100) * 20);
              const isLit = i < activeBlocks;
              return (
                <div
                  key={i}
                  style={{
                    backgroundColor: isLit
                      ? i === activeBlocks - 1
                        ? VOX_PALETTE.yellow
                        : VOX_PALETTE.red
                      : "#E2D7C3",
                    border: `2px solid ${VOX_PALETTE.ink}`,
                  }}
                />
              );
            })}
          </div>
        </div>

        <div
          style={{
            borderTop: "2px dashed #B8AFA3",
            paddingTop: 16,
            fontFamily: "'Segoe UI', Inter, sans-serif",
            fontWeight: 700,
            fontSize: 20,
            color: VOX_PALETTE.mutedInk,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>FONTE: INSIVIA • MESSAGE RETENTION STUDY</span>
          <span style={{ color: VOX_PALETTE.navy, fontWeight: 900 }}>
            9,5× MAIS MEMÓRIA DE MARCA
          </span>
        </div>
      </div>
    </div>
  );
};

