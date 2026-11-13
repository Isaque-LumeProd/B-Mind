import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export type HighlightedPhrase = {
  readonly prefix: string;
  readonly highlighted: string;
  readonly suffix: string;
  readonly startFrame: number;
  readonly durationFrames: number;
};

export type EditorialArticleProps = {
  readonly publication: string;
  readonly categoryLabel: string;
  readonly reportTitle: string;
  readonly bylineAndDate: string;
  readonly statCallout: string;
  readonly statLabel: string;
  readonly lines: readonly HighlightedPhrase[];
  readonly footnoteSource: string;
  readonly accentColor?: string;
};

/**
 * Irregular physical felt-tip marker SVG path sitting BEHIND text and ABOVE paper.
 * Follows `article-highlights` SKILL.md:
 * - Zero neon, glow, or fluorescent effects
 * - Restrained physical marker color (#F2C230 at 0.56 opacity)
 * - Left-to-right wipe after optical focus settles
 */
const PhysicalMarkerStroke: React.FC<{
  readonly progress: number;
  readonly seedOffset: number;
}> = ({ progress, seedOffset }) => {
  const clamped = Math.max(0, Math.min(1, progress));
  if (clamped <= 0.01) return null;

  const topWave = 2 + (seedOffset % 3);
  const botWave = 96 - ((seedOffset * 2) % 4);

  return (
    <svg
      viewBox="0 0 400 100"
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        left: -8,
        top: "6%",
        height: "88%",
        width: "calc(100% + 16px)",
        clipPath: `inset(0 ${(100 - clamped * 100).toFixed(1)}% 0 0)`,
        zIndex: 1,
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      <path
        d={`M 4,${topWave + 4} Q 110,${topWave} 220,${topWave + 3} T 396,${topWave + 2} L 398,${botWave - 3} Q 260,${botWave} 130,${botWave - 2} T 2,${botWave - 4} Z`}
        fill="#F2C230"
        fillOpacity={0.58}
      />
      <path
        d={`M 8,${topWave + 10} L 392,${topWave + 8} L 390,${botWave - 10} L 6,${botWave - 8} Z`}
        fill="#E5B11E"
        fillOpacity={0.24}
      />
    </svg>
  );
};

export const EditorialArticleHighlight: React.FC<EditorialArticleProps> = ({
  publication,
  categoryLabel,
  reportTitle,
  bylineAndDate,
  statCallout,
  statLabel,
  lines,
  footnoteSource,
  accentColor = "#B8312A",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 1. Brief restrained optical focus pull (frames 0..14) per article-highlights SKILL.md
  const focusBlurPx = interpolate(frame, [0, 14], [4.5, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 2. Slow subtle camera push + restrained perspective rotation
  const cameraScale = interpolate(
    frame,
    [0, durationInFrames * 0.75, durationInFrames],
    [0.95, 1.02, 1.025],
    {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const tiltDeg = interpolate(
    frame,
    [0, durationInFrames * 0.7, durationInFrames],
    [-1.4, -0.35, -0.35],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const cardEntrance = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 120, mass: 0.9 },
  });

  const translateY = interpolate(cardEntrance, [0, 1], [36, 0]);

  return (
    <div
      style={{
        width: "100%",
         display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        filter: focusBlurPx > 0.08 ? `blur(${focusBlurPx.toFixed(2)}px)` : "none",
        transform: `translateY(${translateY.toFixed(1)}px) scale(${cameraScale.toFixed(4)}) rotate(${tiltDeg.toFixed(2)}deg)`,
      }}
    >
      {/* Layer 2: Authentic Editorial Paper Surface (#FBF7EE) with neutral border & shadow */}
      <div
        style={{
          width: 936,
          backgroundColor: "#FBF7EE",
          border: "2.5px solid #191816",
          borderRadius: 6,
          boxShadow: "12px 14px 0px rgba(25, 24, 22, 0.18)",
          padding: "44px 48px 40px 48px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top editorial masthead bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "2px solid #191816",
            paddingBottom: 16,
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span
              style={{
                backgroundColor: accentColor,
                color: "#FBF7EE",
                fontFamily: "'Segoe UI', Inter, sans-serif",
                fontWeight: 800,
                fontSize: 18,
                letterSpacing: 2.2,
                padding: "6px 14px",
                textTransform: "uppercase",
              }}
            >
              {categoryLabel}
            </span>
            <span
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontWeight: 700,
                fontSize: 24,
                color: "#191816",
                letterSpacing: 0.4,
              }}
            >
              {publication}
            </span>
          </div>
          <span
            style={{
              fontFamily: "'Segoe UI', Inter, sans-serif",
              fontWeight: 600,
              fontSize: 18,
              color: "#5C564F",
            }}
          >
            {bylineAndDate}
          </span>
        </div>

        {/* Editorial Headline */}
        <h2
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontWeight: 700,
            fontSize: 44,
            lineHeight: 1.18,
            color: "#191816",
            margin: "0 0 26px 0",
            letterSpacing: -0.5,
          }}
        >
          {reportTitle}
        </h2>

        {/* Key Metric Strip inside the article */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            backgroundColor: "#F1E6D0",
            borderLeft: `6px solid ${accentColor}`,
            padding: "18px 24px",
            marginBottom: 28,
          }}
        >
          <span
            style={{
              fontFamily: "'Segoe UI', Inter, sans-serif",
              fontWeight: 900,
              fontSize: 64,
              lineHeight: 1,
              color: accentColor,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {statCallout}
          </span>
          <span
            style={{
              fontFamily: "'Segoe UI', Inter, sans-serif",
              fontWeight: 700,
              fontSize: 25,
              lineHeight: 1.28,
              color: "#14213D",
            }}
          >
            {statLabel}
          </span>
        </div>

        {/* Layer 3 (Marker) + Layer 4 (DOM Text Above Marker) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginBottom: 26,
          }}
        >
          {lines.map((line, idx) => {
            const strokeProgress = interpolate(
              frame,
              [line.startFrame, line.startFrame + line.durationFrames],
              [0, 1],
              {
                easing: Easing.out(Easing.cubic),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            );

            return (
              <p
                key={idx}
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: 31,
                  lineHeight: 1.48,
                  color: "#262320",
                  margin: 0,
                  position: "relative",
                }}
              >
                <span>{line.prefix}</span>
                <span
                  style={{
                    position: "relative",
                    display: "inline-block",
                    padding: "0 4px",
                    fontWeight: 700,
                    color: "#191816",
                  }}
                >
                  {/* Layer 3: Marker stroke behind text */}
                  <PhysicalMarkerStroke
                    progress={strokeProgress}
                    seedOffset={idx + 1}
                  />
                  {/* Layer 4: Crisp text above marker */}
                  <span style={{ position: "relative", zIndex: 2 }}>
                    {line.highlighted}
                  </span>
                </span>
                <span>{line.suffix}</span>
              </p>
            );
          })}
        </div>

        {/* Verified Source Footer */}
        <div
          style={{
            borderTop: "1.5px dashed #B8AFA3",
            paddingTop: 14,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 24,
            fontFamily: "'Segoe UI', Inter, sans-serif",
            fontSize: 17,
            fontWeight: 600,
            color: "#5C564F",
          }}
        >
          <span>FONTE VERIFICADA: {footnoteSource}</span>
          <span
            style={{
              color: "#14213D",
              fontWeight: 800,
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            DADO AUDITADO • 100% REAL
          </span>
        </div>
      </div>
    </div>
  );
};

