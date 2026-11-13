import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { PAX_GC_DURATION_MAP, type PaxGCSlot } from "./paxVidaData";

const FONT_STACK =
  "'Montserrat', 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif";

const BRAND = {
  crimson: "#C62828",
  crimsonDeep: "#8E1616",
  charcoal: "#15161A",
  white: "#FFFFFF",
  offWhite: "#F8FAFC",
  gold: "#E0B35A",
  whatsapp: "#25D366",
  whatsappDark: "#128C43",
};

interface GCAnimState {
  translateY: number;
  scale: number;
  opacity: number;
  blurPx: number;
  sheenX: number;
}

/**
 * Blur-up entrance and soft blur-out exit driven deterministically by frame index.
 */
const useGCAnimation = (totalFrames: number, exitFrames = 8): GCAnimState => {
  const frame = useCurrentFrame();

  const enterBlur = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const enterOpacity = interpolate(frame, [0, 9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const exitStart = Math.max(12, totalFrames - exitFrames);
  const exitProgress = interpolate(
    frame,
    [exitStart, Math.max(exitStart + 1, totalFrames - 1)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.cubic),
    }
  );

  const opacity = enterOpacity * (1 - exitProgress);
  const translateY =
    interpolate(enterBlur, [0, 1], [44, 0]) +
    interpolate(exitProgress, [0, 1], [0, -18]);
  const scale =
    interpolate(enterBlur, [0, 1], [0.95, 1]) *
    interpolate(exitProgress, [0, 1], [1, 0.98]);
  const blurPx =
    interpolate(enterBlur, [0, 1], [16, 0]) +
    interpolate(exitProgress, [0, 1], [0, 12]);
  const sheenX = interpolate(frame, [6, 26], [-320, 980], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return { translateY, scale, opacity, blurPx, sheenX };
};

const GCFrameContainer: React.FC<{
  anim: GCAnimState;
  bottomPx?: number;
  scaleMultiplier?: number;
  opacityMultiplier?: number;
  children: React.ReactNode;
}> = ({
  anim,
  bottomPx = 355,
  scaleMultiplier = 1,
  opacityMultiplier = 1,
  children,
}) => (
  <AbsoluteFill style={{ pointerEvents: "none", fontFamily: FONT_STACK }}>
    <div
      style={{
        position: "absolute",
        left: 48,
        right: 48,
        bottom: bottomPx,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: anim.opacity * opacityMultiplier,
        transform: `translateY(${anim.translateY}px) scale(${anim.scale * scaleMultiplier})`,
        transformOrigin: "center bottom",
        filter: anim.blurPx > 0.05 ? `blur(${anim.blurPx.toFixed(2)}px)` : undefined,
      }}
    >
      {children}
    </div>
  </AbsoluteFill>
);

const EyebrowPill: React.FC<{
  text: string;
  bg?: string;
  color?: string;
}> = ({ text, bg = BRAND.charcoal, color = BRAND.white }) => (
  <div
    style={{
      backgroundColor: bg,
      color,
      padding: "10px 24px",
      borderRadius: "14px 14px 4px 4px",
      fontSize: 23,
      fontWeight: 800,
      letterSpacing: 1.6,
      textTransform: "uppercase",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.35)",
      marginBottom: -4,
      zIndex: 2,
    }}
  >
    {text}
  </div>
);

const CardSheen: React.FC<{ sheenX: number }> = ({ sheenX }) => (
  <div
    style={{
      position: "absolute",
      top: 0,
      bottom: 0,
      left: sheenX,
      width: 150,
      background:
        "linear-gradient(105deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0) 100%)",
      pointerEvents: "none",
    }}
  />
);

const HeartShieldIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 54,
  color = BRAND.white,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill={color}
    />
    <path
      d="M11 8h2v3h3v2h-3v3h-2v-3H8v-2h3V8z"
      fill={BRAND.crimson}
    />
  </svg>
);

const MedicalCrossIcon: React.FC<{ size?: number }> = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="2" width="20" height="20" rx="6" fill={BRAND.crimson} />
    <path d="M10.5 6.5h3v4h4v3h-4v4h-3v-4h-4v-3h4v-4z" fill={BRAND.white} />
  </svg>
);

const CheckBadgeIcon: React.FC<{ size?: number }> = ({ size = 54 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill={BRAND.crimson} />
    <path
      d="M7.5 12.3l3 3 6-6.2"
      stroke={BRAND.white}
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const WhatsAppIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 58,
  color = BRAND.white,
}) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path
      d="M16 3C8.82 3 3 8.7 3 15.72c0 2.52.75 4.97 2.18 7.06L3.65 29l6.43-1.66A13.15 13.15 0 0016 28.44c7.18 0 13-5.7 13-12.72C29 8.7 23.18 3 16 3z"
      stroke={color}
      strokeWidth="2.5"
      fill="rgba(255,255,255,0.12)"
    />
    <path
      d="M21.48 18.63c-.3-.15-1.76-.86-2.03-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.01-1.04 2.47s1.07 2.86 1.22 3.06c.15.2 2.1 3.24 5.13 4.44.72.3 1.28.48 1.72.62.72.22 1.38.19 1.9.12.58-.09 1.76-.71 2.01-1.4.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z"
      fill={color}
    />
  </svg>
);

/**
 * GC 1: Mensalidade R$ 65,00 (Bold Commercial Price Anchor)
 */
export const GC01Mensalidade: React.FC = () => {
  const anim = useGCAnimation(PAX_GC_DURATION_MAP.GC01Mensalidade);
  return (
    <GCFrameContainer anim={anim}>
      <EyebrowPill text="PLANO ASSISTENCIAL • PAX VIDA" bg={BRAND.charcoal} />
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "stretch",
          borderRadius: 24,
          backgroundColor: BRAND.white,
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.45)",
          border: "3px solid rgba(255,255,255,0.92)",
        }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, ${BRAND.crimson} 0%, ${BRAND.crimsonDeep} 100%)`,
            padding: "24px 30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              color: BRAND.white,
              letterSpacing: -0.5,
              lineHeight: 1.05,
            }}
          >
            Mensalidade
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "rgba(255,255,255,0.85)",
              marginTop: 6,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            A partir de
          </div>
        </div>
        <div
          style={{
            padding: "20px 34px",
            display: "flex",
            alignItems: "baseline",
            gap: 8,
            backgroundColor: BRAND.white,
          }}
        >
          <span
            style={{
              fontSize: 78,
              fontWeight: 900,
              color: BRAND.crimson,
              letterSpacing: -2.2,
              lineHeight: 0.98,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            R$ 65,00
          </span>
          <span
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: BRAND.charcoal,
              opacity: 0.72,
            }}
          >
            /mês
          </span>
        </div>
        <CardSheen sheenX={anim.sheenX} />
      </div>
    </GCFrameContainer>
  );
};

/**
 * GC 2: Desconto em serviços de saúde
 */
export const GC02DescontoSaude: React.FC = () => {
  const anim = useGCAnimation(PAX_GC_DURATION_MAP.GC02DescontoSaude);
  return (
    <GCFrameContainer anim={anim}>
      <EyebrowPill text="BENEFÍCIOS EM VIDA" bg={BRAND.crimson} />
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          gap: 24,
          borderRadius: 24,
          backgroundColor: BRAND.white,
          padding: "26px 34px",
          borderLeft: `14px solid ${BRAND.crimson}`,
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.45)",
        }}
      >
        <MedicalCrossIcon size={68} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: BRAND.crimson,
              lineHeight: 1.0,
              letterSpacing: -1.5,
            }}
          >
            Desconto
          </div>
          <div
            style={{
              fontSize: 42,
              fontWeight: 800,
              color: BRAND.charcoal,
              lineHeight: 1.12,
              letterSpacing: -0.6,
            }}
          >
            em serviços de saúde
          </div>
        </div>
        <CardSheen sheenX={anim.sheenX} />
      </div>
    </GCFrameContainer>
  );
};

/**
 * GC 3: 8 dependentes
 */
export const GC03Dependentes: React.FC = () => {
  const anim = useGCAnimation(PAX_GC_DURATION_MAP.GC03Dependentes);
  return (
    <GCFrameContainer anim={anim}>
      <EyebrowPill text="COBERTURA FAMILIAR" bg={BRAND.charcoal} />
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          gap: 26,
          borderRadius: 24,
          background: `linear-gradient(135deg, ${BRAND.crimson} 0%, ${BRAND.crimsonDeep} 100%)`,
          padding: "22px 38px",
          boxShadow: "0 20px 48px rgba(0, 0, 0, 0.46)",
          border: "3px solid rgba(255,255,255,0.22)",
        }}
      >
        <div
          style={{
            backgroundColor: BRAND.white,
            color: BRAND.crimson,
            width: 102,
            height: 102,
            borderRadius: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 74,
            fontWeight: 900,
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.25)",
          }}
        >
          8
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 62,
              fontWeight: 900,
              color: BRAND.white,
              lineHeight: 1.0,
              letterSpacing: -1.2,
            }}
          >
            dependentes
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "rgba(255,255,255,0.88)",
              marginTop: 6,
              letterSpacing: 0.6,
            }}
          >
            PARA PROTEGER TODA A FAMÍLIA
          </div>
        </div>
        <CardSheen sheenX={anim.sheenX} />
      </div>
    </GCFrameContainer>
  );
};

/**
 * GC 4: Isenção de carência
 */
export const GC04IsencaoCarencia: React.FC = () => {
  const anim = useGCAnimation(PAX_GC_DURATION_MAP.GC04IsencaoCarencia);
  return (
    <GCFrameContainer anim={anim}>
      <EyebrowPill text="USO IMEDIATO" bg={BRAND.crimson} />
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          gap: 22,
          borderRadius: 24,
          backgroundColor: BRAND.white,
          padding: "24px 36px",
          borderLeft: `14px solid ${BRAND.crimson}`,
          boxShadow: "0 20px 48px rgba(0, 0, 0, 0.46)",
        }}
      >
        <CheckBadgeIcon size={66} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 56,
              fontWeight: 900,
              color: BRAND.charcoal,
              lineHeight: 1.04,
              letterSpacing: -1.2,
            }}
          >
            Isenção de carência
          </div>
          <div
            style={{
              fontSize: 25,
              fontWeight: 800,
              color: BRAND.crimson,
              marginTop: 4,
              letterSpacing: 0.8,
              textTransform: "uppercase",
            }}
          >
            EM SERVIÇOS DE SAÚDE
          </div>
        </div>
        <CardSheen sheenX={anim.sheenX} />
      </div>
    </GCFrameContainer>
  );
};

/**
 * GC 5: Assistência funerária completa (Refined & Respectful)
 */
export const GC05AssistenciaFuneraria: React.FC = () => {
  const anim = useGCAnimation(PAX_GC_DURATION_MAP.GC05AssistenciaFuneraria);
  return (
    <GCFrameContainer anim={anim} bottomPx={345}>
      <EyebrowPill text="TRANQUILIDADE E RESPEITO 24H" bg={BRAND.gold} color={BRAND.charcoal} />
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          borderRadius: 24,
          backgroundColor: "rgba(21, 22, 26, 0.93)",
          padding: "26px 36px",
          borderLeft: `14px solid ${BRAND.gold}`,
          borderTop: "2px solid rgba(224, 179, 90, 0.35)",
          borderRight: "2px solid rgba(255, 255, 255, 0.14)",
          borderBottom: "2px solid rgba(255, 255, 255, 0.14)",
          boxShadow: "0 22px 54px rgba(0, 0, 0, 0.52)",
          minWidth: 820,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <HeartShieldIcon size={54} color={BRAND.gold} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 52,
                fontWeight: 900,
                color: BRAND.white,
                lineHeight: 1.04,
                letterSpacing: -1,
              }}
            >
              Assistência funerária
            </div>
            <div
              style={{
                fontSize: 50,
                fontWeight: 900,
                color: BRAND.gold,
                lineHeight: 1.05,
                letterSpacing: -1,
              }}
            >
              completa
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: 14,
            paddingTop: 12,
            borderTop: "1px solid rgba(255,255,255,0.16)",
            fontSize: 21,
            fontWeight: 700,
            color: "rgba(255,255,255,0.86)",
            letterSpacing: 1.1,
            textTransform: "uppercase",
          }}
        >
          TANATOPRAXIA • CAPELA VELÓRIO • COROA DE FLORES • CREMAÇÃO
        </div>
        <CardSheen sheenX={anim.sheenX} />
      </div>
    </GCFrameContainer>
  );
};

export interface GC06Props {
  showEndSlate?: boolean;
}

/**
 * GC 6: WhatsApp CTA ((ícone WhatsApp) (67) 9 9245-4721)
 * By default (showEndSlate=false) stays 100% transparent outside the banner so
 * ProRes 4444 overlays cleanly in Premiere Pro. In full Remotion preview,
 * showEndSlate=true adds the optional crimson closing slate tail.
 */
export const GC06WhatsAppCTA: React.FC<GC06Props> = ({
  showEndSlate = false,
}) => {
  const frame = useCurrentFrame();
  const gcDur = PAX_GC_DURATION_MAP.GC06WhatsAppCTA;
  const anim = useGCAnimation(gcDur, 5);
  const pulse = 1 + 0.025 * Math.sin((frame / 30) * Math.PI * 3.5);
  const slateOpacity = interpolate(frame, [66, 75], [0, 0.88], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const endFadeOut = interpolate(frame, [gcDur - 5, gcDur - 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none", fontFamily: FONT_STACK }}>
      {showEndSlate ? (
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(circle at 50% 45%, rgba(142, 22, 22, 0.92) 0%, rgba(17, 17, 22, 0.96) 100%)",
            opacity: slateOpacity * endFadeOut,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 140,
          }}
        >
          <div
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: "rgba(255,255,255,0.85)",
              letterSpacing: 4,
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            PAX VIDA • ATENDIMENTO 24H
          </div>
          <div
            style={{
              fontSize: 66,
              fontWeight: 900,
              color: BRAND.white,
              letterSpacing: -1.2,
              textAlign: "center",
            }}
          >
            Fale com nossa equipe
          </div>
        </AbsoluteFill>
      ) : null}

      <GCFrameContainer
        anim={anim}
        bottomPx={345}
        scaleMultiplier={pulse}
        opacityMultiplier={endFadeOut}
      >
        <EyebrowPill text="FALE AGORA NO WHATSAPP" bg={BRAND.charcoal} />
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            borderRadius: 26,
            background: `linear-gradient(135deg, ${BRAND.whatsapp} 0%, ${BRAND.whatsappDark} 100%)`,
            padding: "24px 44px",
            boxShadow: "0 22px 54px rgba(0, 0, 0, 0.5)",
            border: "3px solid rgba(255,255,255,0.88)",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.18)",
              borderRadius: 20,
              padding: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <WhatsAppIcon size={64} />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 62,
                fontWeight: 900,
                color: BRAND.white,
                letterSpacing: -1.0,
                lineHeight: 1.0,
                fontVariantNumeric: "tabular-nums",
                textShadow: "0 2px 10px rgba(0,0,0,0.25)",
              }}
            >
              (67) 9 9245-4721
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "rgba(255,255,255,0.94)",
                marginTop: 6,
                letterSpacing: 1.2,
                textTransform: "uppercase",
              }}
            >
              PLANTÃO E CONTRATAÇÃO RÁPIDA
            </div>
          </div>
          <CardSheen sheenX={anim.sheenX} />
        </div>
      </GCFrameContainer>
    </AbsoluteFill>
  );
};

export const PAX_GC_COMPONENT_MAP: Record<PaxGCSlot["id"], React.FC> = {
  GC01Mensalidade,
  GC02DescontoSaude,
  GC03Dependentes,
  GC04IsencaoCarencia,
  GC05AssistenciaFuneraria,
  GC06WhatsAppCTA,
};

