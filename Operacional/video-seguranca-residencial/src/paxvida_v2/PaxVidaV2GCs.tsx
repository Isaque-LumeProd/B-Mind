import React from "react";
import {
  CardSheen,
  CheckBadgeIcon,
  EyebrowPill,
  GCFrameContainer,
  PAX_BRAND,
  WhatsAppIcon,
  useGCBlurUp,
} from "../paxvida_shared/PaxPrimitives";
import { PAX_V2_GC_SLOTS, type PaxV2GCSlot } from "./paxVidaV2Data";

const PAX_V2_GC_DURATION_MAP: Record<PaxV2GCSlot["id"], number> =
  Object.fromEntries(
    PAX_V2_GC_SLOTS.map((slot) => [slot.id, slot.frames])
  ) as Record<PaxV2GCSlot["id"], number>;

const ChapelIcon: React.FC<{ size?: number }> = ({ size = 60 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <path
      d="M14 3.5L4.5 11.2V24h19V11.2L14 3.5z"
      stroke={PAX_BRAND.white}
      strokeWidth="2.1"
      strokeLinejoin="round"
      fill="rgba(255,255,255,0.12)"
    />
    <path
      d="M14 7.5v5M11.8 9.7h4.4M11.2 24v-6.2a2.8 2.8 0 015.6 0V24"
      stroke={PAX_BRAND.white}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const FlameIcon: React.FC<{ size?: number }> = ({ size = 46 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill={PAX_BRAND.crimson} />
    <path
      d="M12.4 6.2c.3 2.1-1.9 3.1-1.9 5.3a2.7 2.7 0 005.4 0c0-2-1.4-3.7-3.5-5.3zm-1.1 7.1c-.2 1.2.6 2.2 1.7 2.2.8 0 1.4-.6 1.4-1.4 0-1.1-1-1.8-1.5-2.6-.9.6-1.4 1.1-1.6 1.8z"
      fill={PAX_BRAND.white}
    />
  </svg>
);

const RouteCarIcon: React.FC<{ size?: number }> = ({ size = 46 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill={PAX_BRAND.crimson} />
    <path
      d="M6.5 13.5l1.3-3.4c.25-.65.85-1.1 1.55-1.1h5.3c.7 0 1.3.45 1.55 1.1l1.3 3.4v3h-1.3v-1.1H7.8v1.1H6.5v-3z"
      fill={PAX_BRAND.white}
    />
    <circle cx="8.6" cy="15.8" r="1.1" fill={PAX_BRAND.crimsonDeep} />
    <circle cx="15.4" cy="15.8" r="1.1" fill={PAX_BRAND.crimsonDeep} />
  </svg>
);

const WreathIcon: React.FC<{ size?: number }> = ({ size = 46 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill={PAX_BRAND.crimson} />
    <circle
      cx="12"
      cy="12"
      r="4.8"
      stroke={PAX_BRAND.white}
      strokeWidth="2.3"
      strokeDasharray="2 2.2"
    />
    <circle cx="12" cy="7.2" r="1.5" fill="#FECACA" />
  </svg>
);

interface ServiceCardSpec {
  slotId: PaxV2GCSlot["id"];
  eyebrow: string;
  headline: string;
  subtitle?: string;
  icon: React.ReactNode;
  enterFrames?: number;
  exitFrames?: number;
}

const ServiceHighlightCard: React.FC<ServiceCardSpec> = ({
  slotId,
  eyebrow,
  headline,
  subtitle,
  icon,
  enterFrames = 8,
  exitFrames = 6,
}) => {
  const anim = useGCBlurUp(
    PAX_V2_GC_DURATION_MAP[slotId],
    enterFrames,
    exitFrames
  );

  return (
    <GCFrameContainer anim={anim}>
      <EyebrowPill text={eyebrow} bg={PAX_BRAND.charcoal} />
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          backgroundColor: PAX_BRAND.white,
          borderRadius: 24,
          padding: "22px 34px",
          borderLeft: `12px solid ${PAX_BRAND.crimson}`,
          boxShadow: "0 20px 52px rgba(0, 0, 0, 0.48)",
          display: "flex",
          alignItems: "center",
          gap: 20,
          minWidth: 540,
        }}
      >
        <div style={{ flexShrink: 0 }}>{icon}</div>
        <div>
          <div
            style={{
              fontSize: 44,
              fontWeight: 900,
              color: PAX_BRAND.charcoal,
              lineHeight: 1.05,
              letterSpacing: -0.6,
            }}
          >
            {headline}
          </div>
          {subtitle ? (
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: PAX_BRAND.slateMuted,
                marginTop: 4,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>
        <CardSheen delay={4} />
      </div>
    </GCFrameContainer>
  );
};

/**
 * GC 1: Capela Velório / ampla e moderna (147f = 4.90s)
 */
export const V2GC01CapelaModerna: React.FC = () => {
  const anim = useGCBlurUp(PAX_V2_GC_DURATION_MAP.V2GC01CapelaModerna, 10, 8);
  return (
    <GCFrameContainer anim={anim}>
      <EyebrowPill text="ESTRUTURA PAX VIDA" bg={PAX_BRAND.charcoal} />
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "stretch",
          borderRadius: 24,
          backgroundColor: PAX_BRAND.white,
          boxShadow: "0 22px 54px rgba(0, 0, 0, 0.48)",
          border: "3px solid rgba(255,255,255,0.92)",
        }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, ${PAX_BRAND.crimson} 0%, ${PAX_BRAND.crimsonDeep} 100%)`,
            padding: "22px 26px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ChapelIcon size={62} />
        </div>
        <div
          style={{
            padding: "22px 34px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: PAX_BRAND.white,
          }}
        >
          <div
            style={{
              fontSize: 42,
              fontWeight: 900,
              color: PAX_BRAND.charcoal,
              letterSpacing: -0.7,
              lineHeight: 1.04,
            }}
          >
            Capela Velório
          </div>
          <div
            style={{
              fontSize: 33,
              fontWeight: 800,
              color: PAX_BRAND.crimson,
              letterSpacing: -0.4,
              lineHeight: 1.12,
              marginTop: 6,
            }}
          >
            ampla e moderna
          </div>
        </div>
        <CardSheen delay={8} />
      </div>
    </GCFrameContainer>
  );
};

/**
 * GC 2: Tanatopraxia (72f = 2.40s)
 */
export const V2GC02Tanatopraxia: React.FC = () => (
  <ServiceHighlightCard
    slotId="V2GC02Tanatopraxia"
    eyebrow="CUIDADO E DIGNIDADE"
    headline="Tanatopraxia"
    subtitle="Preparo especializado com respeito"
    icon={<CheckBadgeIcon size={50} />}
    enterFrames={8}
    exitFrames={6}
  />
);

/**
 * GC 3: Cremação (29f = 0.97s — agile 6f enter / 4f exit)
 */
export const V2GC03Cremacao: React.FC = () => (
  <ServiceHighlightCard
    slotId="V2GC03Cremacao"
    eyebrow="SERVIÇO PAX VIDA"
    headline="Cremação"
    icon={<FlameIcon size={48} />}
    enterFrames={6}
    exitFrames={4}
  />
);

/**
 * GC 4: Translado (30f = 1.00s — agile 6f enter / 4f exit)
 */
export const V2GC04Translado: React.FC = () => (
  <ServiceHighlightCard
    slotId="V2GC04Translado"
    eyebrow="TRANSPORTE ESPECIALIZADO"
    headline="Translado"
    icon={<RouteCarIcon size={48} />}
    enterFrames={6}
    exitFrames={4}
  />
);

/**
 * GC 5: Coroa de flores (29f = 0.97s — agile 6f enter / 4f exit)
 */
export const V2GC05CoroaFlores: React.FC = () => (
  <ServiceHighlightCard
    slotId="V2GC05CoroaFlores"
    eyebrow="HOMENAGEM COMPLETA"
    headline="Coroa de flores"
    icon={<WreathIcon size={48} />}
    enterFrames={6}
    exitFrames={4}
  />
);

/**
 * GC 6: (ícone WhatsApp) (67) 9 9245-4721 (84f = 2.80s)
 */
export const V2GC06WhatsAppCTA: React.FC = () => {
  const anim = useGCBlurUp(PAX_V2_GC_DURATION_MAP.V2GC06WhatsAppCTA, 9, 7);

  return (
    <GCFrameContainer anim={anim}>
      <EyebrowPill text="ATENDIMENTO 24H • PAX VIDA" bg={PAX_BRAND.crimson} />
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${PAX_BRAND.whatsapp} 0%, ${PAX_BRAND.whatsappDark} 100%)`,
          borderRadius: 26,
          padding: "24px 36px",
          border: "3px solid rgba(255,255,255,0.92)",
          boxShadow: "0 22px 58px rgba(0, 0, 0, 0.55)",
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            width: 74,
            height: 74,
            borderRadius: 20,
            backgroundColor: "rgba(255,255,255,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <WhatsAppIcon size={54} color={PAX_BRAND.white} />
        </div>
        <div>
          <div
            style={{
              fontSize: 44,
              fontWeight: 900,
              color: PAX_BRAND.white,
              letterSpacing: -0.6,
              lineHeight: 1.05,
              textShadow: "0 2px 10px rgba(0,0,0,0.22)",
            }}
          >
            (67) 9 9245-4721
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "rgba(255,255,255,0.94)",
              marginTop: 6,
            }}
          >
            Conheça os nossos planos funerários
          </div>
        </div>
        <CardSheen delay={6} />
      </div>
    </GCFrameContainer>
  );
};

export const PAX_V2_GC_COMPONENT_MAP: Record<PaxV2GCSlot["id"], React.FC> = {
  V2GC01CapelaModerna,
  V2GC02Tanatopraxia,
  V2GC03Cremacao,
  V2GC04Translado,
  V2GC05CoroaFlores,
  V2GC06WhatsAppCTA,
};

