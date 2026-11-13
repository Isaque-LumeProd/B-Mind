import React from "react";
import { interpolate, spring } from "remotion";
import { SceneItem } from "../scenesData";

type HudGraphicProps = {
  readonly scene: SceneItem;
  readonly frame: number;
  readonly fps: number;
  readonly isBeatB: boolean;
  readonly beatBProgress: number;
};

const cardShellStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  position: "relative",
};

export const HudGraphic: React.FC<HudGraphicProps> = ({
  scene,
  frame,
  fps,
  isBeatB,
  beatBProgress,
}) => {
  if (scene.variant === "hook-alert") {
    const notifSlide = spring({
      frame: Math.max(0, frame - 42),
      fps,
      config: { damping: 16, stiffness: 220 },
    });

    return (
      <div style={cardShellStyle}>
        {/* DVR Passive Timeline Mockup */}
        <div
          style={{
            backgroundColor: "#18181B",
            borderRadius: 24,
            padding: "28px 32px",
            border: "1px solid rgba(255,255,255,0.08)",
            opacity: interpolate(notifSlide, [0, 1], [1, 0.45]),
            transform: `scale(${interpolate(notifSlide, [0, 1], [1, 0.95])})`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <span
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#A1A1AA",
                letterSpacing: 0.5,
              }}
            >
              GRAVADOR COMUM • CÂMERA 01
            </span>
            <span
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#EF4444",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              08:15 DA MANHÃ (TARDE DEMAIS)
            </span>
          </div>
          <div
            style={{
              height: 16,
              backgroundColor: "#27272A",
              borderRadius: 999,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "32%",
                width: "24%",
                height: "100%",
                backgroundColor: "#EF4444",
              }}
            />
          </div>
          <p
            style={{
              margin: "16px 0 0 0",
              fontSize: 26,
              fontWeight: 600,
              color: "#D4D4D8",
            }}
          >
            O evento aconteceu às 02:14, mas ninguém foi avisado.
          </p>
        </div>

        {/* Real-time Smart Home Push Notification Banner */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            color: "#111827",
            borderRadius: 28,
            padding: "30px 34px",
            boxShadow: "0 28px 60px rgba(0,0,0,0.45)",
            transform: `translateY(${interpolate(notifSlide, [0, 1], [60, 0])}px) scale(${interpolate(notifSlide, [0, 1], [0.9, 1])})`,
            opacity: notifSlide,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 6,
                  backgroundColor: "#EF4444",
                }}
              />
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#111827",
                  letterSpacing: 0.4,
                }}
              >
                CASA INTELIGENTE • AGORA
              </span>
            </div>
            <span
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#6B7280",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              02:14:03
            </span>
          </div>

          <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.2 }}>
            Pessoa parada no portão externo
          </div>

          <div style={{ display: "flex", gap: 14 }}>
            <div
              style={{
                flex: 1,
                backgroundColor: "#111827",
                color: "#FFFFFF",
                padding: "14px 20px",
                borderRadius: 14,
                fontSize: 22,
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              Refletor Ligado Automaticamente
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (scene.variant === "problem-compare") {
    return (
      <div style={{ ...cardShellStyle, gap: 22 }}>
        <div
          style={{
            flex: 1,
            backgroundColor: "#F4F4F0",
            borderRadius: 24,
            padding: "28px 32px",
            border: "2px solid #E4E4E0",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            opacity: isBeatB ? 0.52 : 1,
            transform: `scale(${isBeatB ? 0.96 : 1})`,
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#71717A",
              letterSpacing: 1.2,
            }}
          >
            SISTEMA PASSIVO (COMUM)
          </span>
          <div
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "#18181B",
              marginTop: 8,
            }}
          >
            Só grava o vídeo em silêncio
          </div>
          <span style={{ fontSize: 24, color: "#52525B", marginTop: 6 }}>
            Nenhuma luz acende • Nenhuma trava reage
          </span>
        </div>

        <div
          style={{
            flex: 1.15,
            backgroundColor: "#18181B",
            borderRadius: 24,
            padding: "28px 32px",
            border: `3px solid ${scene.accentColor}`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            transform: `scale(${interpolate(beatBProgress, [0, 1], [0.94, 1.02])})`,
            boxShadow: isBeatB
              ? "0 24px 48px rgba(24, 24, 27, 0.22)"
              : "none",
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: scene.accentColor,
              letterSpacing: 1.2,
            }}
          >
            DEFESA ATIVA (CASA INTELIGENTE)
          </span>
          <div
            style={{
              fontSize: 38,
              fontWeight: 800,
              color: "#FFFFFF",
              marginTop: 8,
            }}
          >
            A casa reage em 1,2 segundo
          </div>
          <span style={{ fontSize: 24, color: "#D4D4D8", marginTop: 6 }}>
            Acende refletor + Tranca portas + Toca alerta no celular
          </span>
        </div>
      </div>
    );
  }

  if (scene.variant === "camera-ai") {
    const lightOverlay = interpolate(beatBProgress, [0, 1], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    return (
      <div
        style={{
          ...cardShellStyle,
          backgroundColor: isBeatB ? "#FFFBEB" : "#0F172A",
          borderRadius: 26,
          padding: 32,
          border: `3px solid ${isBeatB ? "#F59E0B" : "#334155"}`,
          overflow: "hidden",
        }}
      >
        {/* Warm floodlight cone when Beat B triggers */}
        <div
          style={{
            position: "absolute",
            top: -120,
            left: "15%",
            width: "70%",
            height: 420,
            background:
              "radial-gradient(circle, rgba(251,191,36,0.45) 0%, transparent 72%)",
            opacity: lightOverlay,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: isBeatB ? "#92400E" : "#94A3B8",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            PORTÃO EXTERNO • 02:14 AM
          </span>
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              padding: "8px 18px",
              borderRadius: 999,
              backgroundColor: isBeatB ? "#D97706" : "#1E293B",
              color: "#FFFFFF",
            }}
          >
            {isBeatB ? "REFLETOR LED: 100% ACESO" : "FILTRANDO PETS E GALHOS"}
          </span>
        </div>

        <div
          style={{
            position: "relative",
            margin: "auto 0",
            display: "flex",
            gap: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Ignored branch/pet box */}
          <div
            style={{
              flex: 1,
              padding: "24px",
              borderRadius: 20,
              border: "2px dashed #64748B",
              backgroundColor: isBeatB
                ? "rgba(255,255,255,0.65)"
                : "rgba(30,41,59,0.55)",
              opacity: isBeatB ? 0.55 : 1,
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: isBeatB ? "#57534E" : "#94A3B8",
              }}
            >
              GATO / ÁRVORE
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: isBeatB ? "#1C1917" : "#E2E8F0",
                marginTop: 6,
              }}
            >
              Ignorado
            </div>
          </div>

          {/* Human Detection Box */}
          <div
            style={{
              flex: 1.35,
              padding: "26px",
              borderRadius: 20,
              border: `3px solid ${isBeatB ? "#D97706" : "#38BDF8"}`,
              backgroundColor: isBeatB ? "#FFFFFF" : "#1E293B",
              transform: `scale(${interpolate(beatBProgress, [0, 1], [0.95, 1.04])})`,
              boxShadow: isBeatB
                ? "0 20px 40px rgba(217, 119, 6, 0.20)"
                : "none",
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: isBeatB ? "#D97706" : "#38BDF8",
              }}
            >
              HUMANO NA CALÇADA (5s)
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: isBeatB ? "#111827" : "#FFFFFF",
                marginTop: 6,
              }}
            >
              {isBeatB ? "Luz Forte Acionada" : "Analisando presença..."}
            </div>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            fontSize: 24,
            fontWeight: 700,
            color: isBeatB ? "#78350F" : "#CBD5E1",
            textAlign: "center",
          }}
        >
          {isBeatB
            ? "Quem procura casa escura desiste na calçada."
            : "Sem falsos alarmes durante a madrugada."}
        </div>
      </div>
    );
  }

  if (scene.variant === "smart-lock") {
    const digits = ["4", "8", "2", "9"];
    return (
      <div
        style={{
          ...cardShellStyle,
          backgroundColor: "#FFFFFF",
          borderRadius: 26,
          padding: 34,
          border: "2px solid #E4E4E0",
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
              fontSize: 22,
              fontWeight: 800,
              color: "#52525B",
              letterSpacing: 0.6,
            }}
          >
            FECHADURA PORTA PRINCIPAL
          </span>
          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              padding: "8px 18px",
              borderRadius: 999,
              backgroundColor: isBeatB ? "#DCFCE7" : "#FEF3C7",
              color: isBeatB ? "#166534" : "#92400E",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {isBeatB ? "16:01 • TRANCADA" : "VALE DAS 14:00 ÀS 16:00"}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {digits.map((d, idx) => {
            const pop = spring({
              frame: Math.max(0, frame - (35 + idx * 8)),
              fps,
              config: { damping: 15, stiffness: 240 },
            });
            return (
              <div
                key={d}
                style={{
                  width: 112,
                  height: 128,
                  borderRadius: 20,
                  backgroundColor: isBeatB ? "#18181B" : "#F4F4F5",
                  border: `3px solid ${isBeatB ? "#059669" : "#D4D4D8"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 56,
                  fontWeight: 900,
                  color: isBeatB ? "#FFFFFF" : "#18181B",
                  fontVariantNumeric: "tabular-nums",
                  transform: `scale(${interpolate(pop, [0, 1], [0.85, 1])})`,
                }}
              >
                {isBeatB ? "•" : d}
              </div>
            );
          })}
        </div>

        <div
          style={{
            backgroundColor: isBeatB ? "#059669" : "#18181B",
            color: "#FFFFFF",
            padding: "20px 28px",
            borderRadius: 18,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 26, fontWeight: 800 }}>
            {isBeatB
              ? "Porta encostou → Pino travado sozinho"
              : "Senha única para entrega ou serviço"}
          </span>
          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              opacity: 0.9,
            }}
          >
            {isBeatB ? "ATIVO" : "SEM CHAVE"}
          </span>
        </div>
      </div>
    );
  }

  if (scene.variant === "window-sensor") {
    return (
      <div
        style={{
          ...cardShellStyle,
          backgroundColor: "#18181B",
          borderRadius: 26,
          padding: 34,
          border: "1px solid rgba(255,255,255,0.12)",
          gap: 20,
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
              fontSize: 22,
              fontWeight: 800,
              color: "#A1A1AA",
            }}
          >
            {isBeatB ? "ROTINA NOTURNA DE VIAGEM" : "SENSOR DE ABERTURA • FUNDOS"}
          </span>
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              padding: "8px 18px",
              borderRadius: 999,
              backgroundColor: isBeatB ? "#F59E0B" : "#2563EB",
              color: "#FFFFFF",
            }}
          >
            {isBeatB ? "PRESENÇA SIMULADA" : "PRECISÃO DE 1 MILÍMETRO"}
          </span>
        </div>

        <div style={{ display: "flex", gap: 18, flex: 1 }}>
          <div
            style={{
              flex: 1,
              borderRadius: 20,
              padding: 24,
              backgroundColor: !isBeatB ? "#1E3A8A" : "#27272A",
              border: !isBeatB ? "2px solid #60A5FA" : "1px solid #3F3F46",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 20, fontWeight: 700, color: "#93C5FD" }}>
              JANELA & PORTA DOS FUNDOS
            </span>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#FFFFFF" }}>
              Abriu 1mm → Sirene + Push
            </div>
          </div>

          <div
            style={{
              flex: 1,
              borderRadius: 20,
              padding: 24,
              backgroundColor: isBeatB ? "#78350F" : "#27272A",
              border: isBeatB ? "2px solid #FBBF24" : "1px solid #3F3F46",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transform: `scale(${interpolate(beatBProgress, [0, 1], [0.95, 1.03])})`,
            }}
          >
            <span style={{ fontSize: 20, fontWeight: 700, color: "#FDE68A" }}>
              SALA & VARANDA (19:30)
            </span>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#FFFFFF" }}>
              Luzes acendem sozinhas na viagem
            </div>
          </div>
        </div>
      </div>
    );
  }

  // dashboard-summary
  const rows = [
    {
      num: "01",
      title: "Calçada & Portão",
      detail: "Câmera inteligente acende o refletor na hora",
    },
    {
      num: "02",
      title: "Porta de Entrada",
      detail: "Fechadura digital com senha temporária e auto-trava",
    },
    {
      num: "03",
      title: "Janelas & Viagem",
      detail: "Sensores de abertura + luzes simulando presença",
    },
  ];

  return (
    <div style={{ ...cardShellStyle, gap: 16 }}>
      {rows.map((row, idx) => {
        const itemPop = spring({
          frame: Math.max(0, frame - idx * 14),
          fps,
          config: { damping: 18, stiffness: 200 },
        });
        return (
          <div
            key={row.num}
            style={{
              flex: 1,
              backgroundColor: "#FFFFFF",
              borderRadius: 22,
              padding: "20px 28px",
              border: "2px solid #E4E4E0",
              display: "flex",
              alignItems: "center",
              gap: 22,
              transform: `translateX(${interpolate(itemPop, [0, 1], [-40, 0])}px)`,
              opacity: itemPop,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                backgroundColor: "#16A34A",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 900,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {row.num}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#18181B" }}>
                {row.title}
              </div>
              <div style={{ fontSize: 22, fontWeight: 600, color: "#52525B" }}>
                {row.detail}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
