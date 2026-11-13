import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { AudiovisualShot, VOX_PALETTE } from "./audiovisualData";

export const VoxTopMasthead: React.FC<{
  readonly shot: AudiovisualShot;
  readonly totalShots: number;
}> = ({ shot, totalShots }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 64,
        left: 64,
        right: 64,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        zIndex: 20,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `3px solid ${VOX_PALETTE.ink}`,
          paddingBottom: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span
            style={{
              backgroundColor: shot.accentColor,
              color: VOX_PALETTE.paper,
              fontFamily: "'Segoe UI', Inter, sans-serif",
              fontWeight: 900,
              fontSize: 19,
              letterSpacing: 2.2,
              padding: "6px 14px",
            }}
          >
            {shot.tag}
          </span>
        </div>

        <span
          style={{
            backgroundColor: VOX_PALETTE.paper,
            border: `2px solid ${VOX_PALETTE.ink}`,
            padding: "5px 14px",
            fontFamily: "'Segoe UI', Inter, sans-serif",
            fontWeight: 900,
            fontSize: 19,
            color: VOX_PALETTE.ink,
            letterSpacing: 1.8,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          ATO 0{shot.index + 1} / 0{totalShots}
        </span>
      </div>

      <div
        style={{
          fontFamily: "'Segoe UI', Inter, sans-serif",
          fontWeight: 900,
          fontSize: 38,
          color: VOX_PALETTE.ink,
          letterSpacing: -0.3,
        }}
      >
        {shot.headline}
      </div>
    </div>
  );
};

/**
 * Implements `captions-overlay` SKILL.md:
 * 1. Scarce `embed` peak word behind the subject (1 per shot beat).
 * 2. Verbatim `rail` overlay subtitle at bottom with inline `emphasis` highlight.
 */
export const VoxCaptionsOverlay: React.FC<{
  readonly shot: AudiovisualShot;
}> = ({ shot }) => {
  const localFrame = useCurrentFrame();
  const speechFrames = Math.round((shot.speechDurationMs / 1000) * 30);

  // Split subtitle into 2 readable verbatim cues on the rail
  const words = shot.subtitle.split(/\s+/);
  const mid = Math.ceil(words.length / 2);
  const cue1 = words.slice(0, mid).join(" ");
  const cue2 = words.slice(mid).join(" ");
  const switchFrame = Math.round(speechFrames * 0.48);

  const isSecondCue = localFrame >= switchFrame;
  const activeCue = isSecondCue ? cue2 : cue1;

  const cueLocalFrame = isSecondCue ? localFrame - switchFrame : localFrame;
  const cueEnter = interpolate(cueLocalFrame, [0, 7], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const railFadeOut = interpolate(
    localFrame,
    [shot.durationInFrames - 10, shot.durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Highlight emphasis phrase inline on the rail (supports multiple candidate phrases separated by "|")
  const candidates = shot.emphasisWord.split("|").map((s) => s.trim());
  const lowerCue = activeCue.toLowerCase();
  let matchedLen = 0;
  let empIndex = -1;
  for (const cand of candidates) {
    const idx = lowerCue.indexOf(cand.toLowerCase());
    if (idx >= 0) {
      empIndex = idx;
      matchedLen = cand.length;
      break;
    }
  }

  return (
    <div
      style={{
        position: "absolute",
        bottom: 118,
        left: 64,
        right: 64,
        display: "flex",
        justifyContent: "center",
        zIndex: 30,
        pointerEvents: "none",
        opacity: railFadeOut,
      }}
    >
      <div
        style={{
          width: "100%",
          backgroundColor: VOX_PALETTE.paper,
          border: `3px solid ${VOX_PALETTE.ink}`,
          boxShadow: "8px 10px 0px rgba(25, 24, 22, 0.24)",
          padding: "20px 28px",
          transform: `translateY(${interpolate(cueEnter, [0, 1], [12, 0]).toFixed(1)}px)`,
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <div
          style={{
            width: 12,
            alignSelf: "stretch",
            backgroundColor: shot.accentColor,
            flexShrink: 0,
          }}
        />
        <div
          style={{
            fontFamily: "'Segoe UI', Inter, sans-serif",
            fontWeight: 700,
            fontSize: 31,
            lineHeight: 1.28,
            color: VOX_PALETTE.ink,
          }}
        >
          {empIndex >= 0 ? (
            <>
              <span>{activeCue.slice(0, empIndex)}</span>
              <span
                style={{
                  backgroundColor: VOX_PALETTE.yellow,
                  color: VOX_PALETTE.ink,
                  fontWeight: 900,
                  padding: "2px 8px",
                  border: `1.5px solid ${VOX_PALETTE.ink}`,
                }}
              >
                {activeCue.slice(empIndex, empIndex + matchedLen)}
              </span>
              <span>
                {activeCue.slice(empIndex + matchedLen)}
              </span>
            </>
          ) : (
            <span>{activeCue}</span>
          )}
        </div>
      </div>
    </div>
  );
};

