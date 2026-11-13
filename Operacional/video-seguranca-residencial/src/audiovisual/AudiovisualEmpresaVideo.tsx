import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  Sequence,
  Series,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  AudiovisualShot,
  AUDIOVISUAL_SHOTS,
  AUDIOVISUAL_TOTAL_FRAMES,
  VOX_PALETTE,
} from "./audiovisualData";
import { VoxCaptionsOverlay, VoxTopMasthead } from "./VoxCaptionsOverlay";
import {
  ArticleWyzowlShot,
  BeforeAfterShot,
  GridBreakShot,
  KineticStatementShot,
} from "./VoxShotsEarly";
import {
  ArticleForbesShot,
  CounterCalloutShot,
  PaperCardsShot,
  TakeawayShot,
} from "./VoxShotsLate";

export type AudiovisualVideoProps = {
  readonly brandName: string;
  readonly footerLabel?: string;
  readonly showSubtitles?: boolean;
};

const renderShotContent = (shot: AudiovisualShot) => {
  switch (shot.shotType) {
    case "kinetic-statement":
      return <KineticStatementShot />;
    case "grid-break":
      return <GridBreakShot />;
    case "article-wyzowl":
      return <ArticleWyzowlShot />;
    case "before-after":
      return <BeforeAfterShot />;
    case "counter-callout":
      return <CounterCalloutShot />;
    case "article-forbes":
      return <ArticleForbesShot />;
    case "paper-cards":
      return <PaperCardsShot />;
    case "takeaway":
      return <TakeawayShot />;
  }
};

/**
 * Wraps each shot with:
 * 1. `motion-doctrine` Vector Law Seam (dominant LEFT current, matched mid-flight velocity)
 * 2. `cinematic-camera` Hold -> Travel -> Hold focal framing
 * 3. `captions-overlay` scarce `embed` peak word behind the subject + verbatim `rail` in front
 */
const VoxShotContainer: React.FC<{
  readonly shot: AudiovisualShot;
  readonly showSubtitles: boolean;
}> = ({ shot, showSubtitles }) => {
  const frame = useCurrentFrame();
  const dur = shot.durationInFrames;

  // Vector Law seam (LEFT current): enters mid-motion from +64px -> 0, exits mid-motion 0 -> -64px
  const enterX =
    shot.index === 0
      ? 0
      : interpolate(frame, [0, 12], [68, 0], {
          easing: Easing.out(Easing.cubic),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  const exitX =
    shot.index === AUDIOVISUAL_SHOTS.length - 1
      ? 0
      : interpolate(frame, [dur - 10, dur], [0, -68], {
          easing: Easing.in(Easing.cubic),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  // Cinematic camera subtle hold -> push -> hold
  const camScale = interpolate(
    frame,
    [0, 24, dur - 28, dur],
    [0.985, 1.0, 1.018, 1.018],
    {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Scarce `embed` peak word behind the subject (`captions-overlay` SKILL.md)
  const embedOpacity = interpolate(
    frame,
    [18, 36, dur - 24, dur - 8],
    [0, 0.085, 0.085, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill>
      <VoxTopMasthead shot={shot} totalShots={AUDIOVISUAL_SHOTS.length} />

      {/* Scarce Embed Layer Behind Subject (`captions-overlay` doctrine) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          zIndex: 1,
          opacity: embedOpacity,
        }}
      >
        <span
          style={{
            fontFamily: "'Segoe UI', Impact, sans-serif",
            fontWeight: 900,
            fontSize: 230,
            color: VOX_PALETTE.navy,
            letterSpacing: -4,
            textTransform: "uppercase",
            userSelect: "none",
          }}
        >
          {shot.embedPeakWord}
        </span>
      </div>

      {/* Main Shot Stage Centered on True Vertical Center (y = H / 2 = 960) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          transform: `translateX(${(enterX + exitX).toFixed(1)}px) scale(${camScale.toFixed(4)})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {renderShotContent(shot)}
      </div>

      {showSubtitles && <VoxCaptionsOverlay shot={shot} />}
    </AbsoluteFill>
  );
};

const DocumentaryFooterBar: React.FC<{
  readonly brandName: string;
  readonly footerLabel: string;
}> = ({ brandName, footerLabel }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progressPct = interpolate(
    frame,
    [0, Math.max(1, durationInFrames - 1)],
    [0, 100],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <div
      style={{
        position: "absolute",
        bottom: 44,
        left: 64,
        right: 64,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        zIndex: 40,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "'Segoe UI', Inter, sans-serif",
          fontWeight: 800,
          fontSize: 17,
          color: VOX_PALETTE.ink,
          letterSpacing: 1.5,
        }}
      >
        <span>{brandName}</span>
        <span>{footerLabel}</span>
      </div>
      <div
        style={{
          width: "100%",
          height: 8,
          backgroundColor: "rgba(25, 24, 22, 0.18)",
          border: `1.5px solid ${VOX_PALETTE.ink}`,
        }}
      >
        <div
          style={{
            width: `${progressPct.toFixed(2)}%`,
            height: "100%",
            backgroundColor: VOX_PALETTE.red,
          }}
        />
      </div>
    </div>
  );
};

export const AudiovisualEmpresaVideo: React.FC<AudiovisualVideoProps> = ({
  brandName = "DOCUMENTÁRIO • IMPACTO DO AUDIOVISUAL",
  footerLabel = "FONTES: WYZOWL • INSIVIA • ABERDEEN • WORDSTREAM",
  showSubtitles = true,
}) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: VOX_PALETTE.cream,
        overflow: "hidden",
      }}
    >
      {/* Layer 0: Vox Documentary Halftone Dots + Warm Paper Grain + Edge Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(25, 24, 22, 0.11) 1.6px, transparent 1.6px)",
          backgroundSize: "28px 28px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: "inset 0 0 140px rgba(25, 24, 22, 0.16)",
          pointerEvents: "none",
          zIndex: 35,
        }}
      />

      {/* Continuous Documentary Background Score (`vox-explainer` rule: voice sits on top) */}
      <Audio
        src={staticFile("audio/bgm-vox-documentary.wav")}
        volume={(f) =>
          interpolate(
            f,
            [AUDIOVISUAL_TOTAL_FRAMES - 30, AUDIOVISUAL_TOTAL_FRAMES],
            [0.22, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          )
        }
      />

      {/* 8 Documentary Shots + Synchronized Voiceover + Tactile SFX */}
      <Series>
        {AUDIOVISUAL_SHOTS.map((shot) => (
          <Series.Sequence
            key={shot.id}
            durationInFrames={shot.durationInFrames}
            premountFor={fps}
          >
            <VoxShotContainer shot={shot} showSubtitles={showSubtitles} />
            <Audio src={staticFile(`audio/${shot.id}.mp3`)} volume={1} />
            <Sequence from={shot.sfxDelayFrames} layout="none">
              <Audio src={staticFile(shot.sfxFile)} volume={0.48} />
            </Sequence>
          </Series.Sequence>
        ))}
      </Series>

      <DocumentaryFooterBar brandName={brandName} footerLabel={footerLabel} />
    </AbsoluteFill>
  );
};

