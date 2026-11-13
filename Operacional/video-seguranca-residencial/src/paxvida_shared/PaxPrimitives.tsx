import React from "react";
import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

export const PAX_BRAND = {
  crimson: "#B91C1C",
  crimsonDeep: "#7F1D1D",
  crimsonSoft: "#FEE2E2",
  whatsapp: "#25D366",
  whatsappDark: "#128C7E",
  white: "#FFFFFF",
  offWhite: "#F8FAFC",
  charcoal: "#14161A",
  slateMuted: "#475569",
} as const;

export const PAX_FONT_STACK =
  "'Montserrat', 'Inter', 'Segoe UI', system-ui, sans-serif";

export interface BlurUpStyleState {
  opacity: number;
  translateY: number;
  scale: number;
  blurPx: number;
}

/**
 * Shared blur-up entrance and blur-out exit curve for Pax Vida lower-thirds.
 * Short (~1s) GCs pass tighter enter/exit frame counts so copy is 100% legible.
 */
export function useGCBlurUp(
  totalFrames: number,
  enterFrames = 10,
  exitFrames = 8
): BlurUpStyleState {
  const frame = useCurrentFrame();
  const safeEnter = Math.min(enterFrames, Math.max(4, Math.floor(totalFrames / 3)));
  const safeExit = Math.min(exitFrames, Math.max(4, Math.floor(totalFrames / 4)));
  const exitEnd = Math.max(safeEnter + 2, totalFrames - 1);
  const exitStart = Math.max(
    safeEnter + 1,
    Math.min(exitEnd - 1, totalFrames - safeExit)
  );

  const enterProgress = interpolate(frame, [0, safeEnter], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const exitProgress = interpolate(frame, [exitStart, exitEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  const opacity = enterProgress * (1 - exitProgress);
  const translateY = 34 * (1 - enterProgress) - 14 * exitProgress;
  const scale = 0.95 + 0.05 * enterProgress - 0.025 * exitProgress;
  const blurPx = 14 * (1 - enterProgress) + 12 * exitProgress;

  return { opacity, translateY, scale, blurPx };
}

export const GCFrameContainer: React.FC<{
  anim: BlurUpStyleState;
  children: React.ReactNode;
}> = ({ anim, children }) => (
  <AbsoluteFill
    style={{
      backgroundColor: "transparent",
      justifyContent: "flex-end",
      alignItems: "center",
      paddingLeft: 52,
      paddingRight: 52,
      paddingBottom: 230,
      fontFamily: PAX_FONT_STACK,
    }}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: `translateY(${anim.translateY}px) scale(${anim.scale})`,
        transformOrigin: "center bottom",
        opacity: anim.opacity,
        filter: `blur(${anim.blurPx.toFixed(2)}px)`,
        willChange: "transform, opacity, filter",
      }}
    >
      {children}
    </div>
  </AbsoluteFill>
);

export const EyebrowPill: React.FC<{ text: string; bg?: string }> = ({
  text,
  bg = PAX_BRAND.crimson,
}) => (
  <div
    style={{
      alignSelf: "center",
      backgroundColor: bg,
      color: PAX_BRAND.white,
      fontSize: 19,
      fontWeight: 800,
      letterSpacing: 1.8,
      textTransform: "uppercase",
      padding: "7px 18px",
      borderRadius: 999,
      marginBottom: 10,
      boxShadow: "0 8px 20px rgba(0,0,0,0.28)",
    }}
  >
    {text}
  </div>
);

export const CardSheen: React.FC<{ delay?: number }> = ({ delay = 6 }) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [delay, delay + 20], [-240, 1080], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        width: 140,
        transform: `translateX(${x}px) skewX(-20deg)`,
        background:
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.24) 50%, transparent 100%)",
        pointerEvents: "none",
      }}
    />
  );
};

export const WhatsAppIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 58,
  color = PAX_BRAND.white,
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

export const CheckBadgeIcon: React.FC<{ size?: number }> = ({ size = 50 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill={PAX_BRAND.crimson} />
    <path
      d="M7.5 12.3l3 3 6-6.2"
      stroke={PAX_BRAND.white}
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const BrollVisualItem: React.FC<{
  src: string;
  frames: number;
  kind: "aroll" | "broll" | "tail";
}> = ({ src, frames, kind }) => {
  const frame = useCurrentFrame();
  const zoom =
    kind === "broll" || kind === "tail"
      ? interpolate(frame, [0, frames], [1.0, 1.045], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1.0;

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0E0F12" }}>
      <OffthreadVideo
        src={staticFile(src)}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoom})`,
        }}
      />
    </AbsoluteFill>
  );
};

export interface SubtitleCue {
  startFrame: number;
  endFrame: number;
  text: string;
}

export const PaxSubtitleOverlay: React.FC<{ cues: SubtitleCue[] }> = ({ cues }) => {
  const frame = useCurrentFrame();
  const active = cues.find((s) => frame >= s.startFrame && frame <= s.endFrame);
  if (!active) return null;

  const localIn = frame - active.startFrame;
  const opacity = interpolate(localIn, [0, 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 165,
        left: 64,
        right: 64,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        opacity,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(18, 19, 23, 0.82)",
          color: PAX_BRAND.white,
          padding: "14px 26px",
          borderRadius: 16,
          border: "1.5px solid rgba(255, 255, 255, 0.16)",
          boxShadow: "0 10px 28px rgba(0, 0, 0, 0.35)",
          fontFamily: PAX_FONT_STACK,
          fontSize: 31,
          fontWeight: 700,
          lineHeight: 1.28,
          textAlign: "center",
          maxWidth: 940,
        }}
      >
        {active.text}
      </div>
    </div>
  );
};

