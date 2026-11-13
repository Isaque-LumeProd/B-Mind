import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  GC06WhatsAppCTA,
  PAX_GC_COMPONENT_MAP,
} from "./PaxVidaGCs";
import {
  PAX_FPS,
  PAX_GC_SLOTS,
  PAX_SUBTITLES,
  PAX_TOTAL_FRAMES,
  PAX_VISUAL_CLIPS,
  PAX_WHOOSH_FRAMES,
} from "./paxVidaData";

export interface PaxVidaVideoProps {
  showSubtitles?: boolean;
}

const SubtitlePill: React.FC = () => {
  const frame = useCurrentFrame();
  const active = PAX_SUBTITLES.find(
    (s) => frame >= s.startFrame && frame <= s.endFrame
  );
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
          color: "#FFFFFF",
          padding: "14px 26px",
          borderRadius: 16,
          border: "1.5px solid rgba(255, 255, 255, 0.16)",
          boxShadow: "0 10px 28px rgba(0, 0, 0, 0.35)",
          fontFamily:
            "'Montserrat', 'Inter', 'Segoe UI', system-ui, sans-serif",
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

const BrollVisualItem: React.FC<{
  src: string;
  frames: number;
  kind: "aroll" | "broll" | "tail";
}> = ({ src, frames, kind }) => {
  const frame = useCurrentFrame();
  const zoom =
    kind === "broll"
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

export const PaxVidaVideo: React.FC<PaxVidaVideoProps> = ({
  showSubtitles = false,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0E0F12" }}>
      {/* Visual Layer (A-roll + B-roll covers + Closing Backdrop) */}
      {PAX_VISUAL_CLIPS.map((clip) => (
        <Sequence
          key={clip.id}
          from={clip.tlStart}
          durationInFrames={clip.frames}
        >
          <BrollVisualItem
            src={clip.src}
            frames={clip.frames}
            kind={clip.kind}
          />
        </Sequence>
      ))}

      {/* Subtle Bottom Legibility Scrim so GCs Pop on Bright Concrete/Exterior Shots */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 680,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(10,10,14,0.42) 60%, rgba(10,10,14,0.68) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Audio Layer: Normalized Voice + Trustworthy Commercial BGM + Pop/Whoosh SFX */}
      <Audio
        src={staticFile("paxvida/voz_apresentadora_normalizada.wav")}
        volume={1}
      />
      <Audio
        src={staticFile("paxvida/bgm_comercial_pax.wav")}
        volume={(f) =>
          interpolate(
            f,
            [0, 18, PAX_TOTAL_FRAMES - 24, PAX_TOTAL_FRAMES],
            [0.06, 0.14, 0.14, 0.02],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          )
        }
      />

      {PAX_GC_SLOTS.map((slot) => (
        <Sequence
          key={`pop-${slot.id}`}
          from={slot.tlStart}
          durationInFrames={Math.round(PAX_FPS * 0.4)}
        >
          <Audio src={staticFile("paxvida/sfx_pop_gc.wav")} volume={0.28} />
        </Sequence>
      ))}

      {PAX_WHOOSH_FRAMES.map((wFrame) => (
        <Sequence
          key={`whoosh-${wFrame}`}
          from={wFrame}
          durationInFrames={Math.round(PAX_FPS * 0.4)}
        >
          <Audio src={staticFile("paxvida/sfx_whoosh.wav")} volume={0.18} />
        </Sequence>
      ))}

      {/* Bold Paid-Traffic GCs */}
      {PAX_GC_SLOTS.map((slot) => {
        const Component = PAX_GC_COMPONENT_MAP[slot.id];
        return (
          <Sequence
            key={slot.id}
            from={slot.tlStart}
            durationInFrames={slot.frames}
          >
            {slot.id === "GC06WhatsAppCTA" ? (
              <GC06WhatsAppCTA showEndSlate={true} />
            ) : (
              <Component />
            )}
          </Sequence>
        );
      })}

      {/* Optional Upper-Safe Commercial Subtitles */}
      {showSubtitles ? <SubtitlePill /> : null}
    </AbsoluteFill>
  );
};

