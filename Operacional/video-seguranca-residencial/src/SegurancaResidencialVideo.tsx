import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  Series,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SmartHomeDioramaCanvas } from "./lemo/SmartHomeDioramaCanvas";
import { SCENES_DATA } from "./scenesData";

export type SegurancaVideoProps = {
  readonly brandName: string;
  readonly footerLabel?: string;
  readonly progressColor?: string;
  readonly showSubtitles?: boolean;
};

// Isolated frame-consumer leaf component per remotion-markup & vercel-react-best-practices
const BottomProgressBar: React.FC<{
  readonly brandName: string;
  readonly footerLabel: string;
  readonly progressColor: string;
}> = ({ brandName, footerLabel, progressColor }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const overallProgress = interpolate(
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
        bottom: 52,
        left: 68,
        right: 68,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 17,
          fontWeight: 800,
          fontFamily: "'Segoe UI', Inter, sans-serif",
          color: "#6B5E58",
          letterSpacing: 1.4,
        }}
      >
        <span>{brandName}</span>
        <span>{footerLabel}</span>
      </div>
      <div
        style={{
          width: "100%",
          height: 6,
          backgroundColor: "rgba(46, 37, 34, 0.18)",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${overallProgress}%`,
            height: "100%",
            backgroundColor: progressColor,
            borderRadius: 999,
          }}
        />
      </div>
    </div>
  );
};

export const SegurancaResidencialVideo: React.FC<SegurancaVideoProps> = ({
  brandName,
  footerLabel = "DIORAMA ISOMÉTRICO • 3 CAMADAS ATIVAS",
  progressColor = "#CF5140",
  showSubtitles = true,
}) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#FBF4E6" }}>
      {/* Continuous 3D Isometric Diorama Canvas (lemo-opuscar iso-infographic engine) */}
      <SmartHomeDioramaCanvas showSubtitles={showSubtitles} />

      {/* Synchronized Voiceover + Hardware Sound Effects (does not re-render per frame) */}
      <Series>
        {SCENES_DATA.map((scene) => (
          <Series.Sequence
            key={scene.id}
            durationInFrames={scene.durationInFrames}
            premountFor={fps}
          >
            <Audio src={staticFile(`audio/${scene.id}.mp3`)} volume={1} />
            <Sequence from={scene.sfxDelayFrames} layout="none">
              <Audio src={staticFile(scene.sfxFile)} volume={0.42} />
            </Sequence>
          </Series.Sequence>
        ))}
      </Series>

      <BottomProgressBar
        brandName={brandName}
        footerLabel={footerLabel}
        progressColor={progressColor}
      />
    </AbsoluteFill>
  );
};
