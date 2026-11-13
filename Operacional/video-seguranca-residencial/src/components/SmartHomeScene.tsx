import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SceneItem } from "../scenesData";
import { DynamicCaptionBar } from "./DynamicCaptionBar";
import { HudGraphic } from "./HudGraphic";

type SmartHomeSceneProps = {
  readonly scene: SceneItem;
  readonly sceneIndex: number;
  readonly totalScenes: number;
};

const renderHighlightedHeadline = (
  headline: string,
  highlightWord: string,
  accentColor: string
): React.ReactNode => {
  if (!highlightWord || !headline.includes(highlightWord)) {
    return headline;
  }
  const parts = headline.split(highlightWord);
  return (
    <>
      {parts[0]}
      <span
        style={{
          color: accentColor,
          textDecoration: "underline",
          textDecorationThickness: "6px",
          textUnderlineOffset: "10px",
        }}
      >
        {highlightWord}
      </span>
      {parts.slice(1).join(highlightWord)}
    </>
  );
};

export const SmartHomeScene: React.FC<SmartHomeSceneProps> = ({
  scene,
  sceneIndex,
  totalScenes,
}) => {
  const rawFrame = useCurrentFrame();
  const { fps: rawFps, durationInFrames } = useVideoConfig();
  const frame = durationInFrames <= 1 ? 150 : rawFrame;
  const fps = durationInFrames <= 1 ? 30 : rawFps;

  const midBeatFrame = Math.floor(
    (durationInFrames <= 1 ? 240 : durationInFrames) * 0.48
  );
  const isBeatB = frame >= midBeatFrame;

  const entrance = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 220 },
  });

  const beatBProgress = spring({
    frame: Math.max(0, frame - midBeatFrame),
    fps,
    config: { damping: 17, stiffness: 190 },
  });

  // Dynamic Screen-Studio-style camera movement:
  // Starts in a tight angled macro shot (Beat A), then whip-zooms into full view on Beat B
  const cameraScale = interpolate(
    beatBProgress,
    [0, 1],
    [interpolate(entrance, [0, 1], [1.14, 1.05]), 1.0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const cameraRotateX = interpolate(beatBProgress, [0, 1], [5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cameraRotateY = interpolate(beatBProgress, [0, 1], [-4, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isLightSurface =
    scene.surfaceMode === "warm-editorial" ||
    (scene.surfaceMode === "daylight-shift" && isBeatB);

  const bgColor = isLightSurface ? "#F5F4F0" : "#0C0E12";
  const textColor = isLightSurface ? "#141413" : "#F8FAFC";
  const mutedTextColor = isLightSurface ? "#57534E" : "#94A3B8";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        color: textColor,
        fontFamily: "'Segoe UI', Inter, system-ui, sans-serif",
        padding: "76px 56px 144px 56px",
        justifyContent: "space-between",
        perspective: 1400,
      }}
    >
      {/* Top Editorial Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            backgroundColor: isLightSurface ? "#141413" : "#1E293B",
            color: "#FFFFFF",
            borderRadius: 999,
            padding: "12px 26px",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: scene.accentColor,
            }}
          />
          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: 1.2,
            }}
          >
            {scene.tag}
          </span>
        </div>

        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: mutedTextColor,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          0{sceneIndex + 1} / 0{totalScenes}
        </div>
      </div>

      {/* Editorial Headline */}
      <div
        style={{
          marginTop: 12,
          marginBottom: 8,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 72,
            lineHeight: 1.04,
            fontWeight: 900,
            letterSpacing: -2.2,
            color: textColor,
          }}
        >
          {renderHighlightedHeadline(
            scene.headline,
            scene.highlightWord,
            scene.accentColor
          )}
        </h1>
        <div
          style={{
            marginTop: 18,
            fontSize: 24,
            fontWeight: 800,
            color: scene.accentColor,
            letterSpacing: 0.8,
          }}
        >
          {isBeatB ? scene.beatBLabel : scene.beatALabel}
        </div>
      </div>

      {/* 3D Camera Stage — Interactive Product Card */}
      <div
        style={{
          height: 610,
          transform: `scale(${cameraScale}) rotateX(${cameraRotateX}deg) rotateY(${cameraRotateY}deg)`,
          transformOrigin: "center center",
          display: "flex",
        }}
      >
        <HudGraphic
          scene={scene}
          frame={frame}
          fps={fps}
          isBeatB={isBeatB}
          beatBProgress={beatBProgress}
        />
      </div>

      {/* Word-by-Word Synced Karaoke Captions */}
      <DynamicCaptionBar
        subtitle={scene.subtitle}
        speechDurationMs={scene.speechDurationMs}
        frame={frame}
        fps={fps}
        accentColor={scene.accentColor}
        isLightSurface={isLightSurface}
      />
    </AbsoluteFill>
  );
};
