import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
} from "remotion";
import {
  BrollVisualItem,
  PaxSubtitleOverlay,
} from "../paxvida_shared/PaxPrimitives";
import { PAX_V2_GC_COMPONENT_MAP } from "./PaxVidaV2GCs";
import {
  PAX_V2_GC_SLOTS,
  PAX_V2_SUBTITLES,
  PAX_V2_TOTAL_FRAMES,
  PAX_V2_VISUAL_CLIPS,
} from "./paxVidaV2Data";

export interface PaxVidaV2Props {
  showSubtitles?: boolean;
}

const SFX_WHOOSH_FRAMES = [234, 385, 548];
const SFX_POP_FRAMES = [238, 388, 460, 489, 519, 635];

export const PaxVidaV2Video: React.FC<PaxVidaV2Props> = ({
  showSubtitles = true,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0E0F12" }}>
      {/* Visual Cut Layer: A-roll + B-roll over 7485 + closing lounge */}
      {PAX_V2_VISUAL_CLIPS.map((clip) => (
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

      {/* Subtle Bottom Scrim for High-Contrast Centered Lower Thirds (top kept clean) */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "linear-gradient(to top, rgba(8, 10, 14, 0.72) 0%, rgba(8, 10, 14, 0.34) 45%, rgba(8, 10, 14, 0.0) 100%)",
          height: 680,
          top: "auto",
          bottom: 0,
        }}
      />

      {/* Audio Track 1: Normalized Voiceover (48kHz stereo, 719 frames exact) */}
      <Audio
        src={staticFile("paxvida_v2/voz_apresentadora_normalizada.wav")}
        volume={1.0}
      />

      {/* Audio Track 2: Emotional Institutional Background Music (-22dB ducked bed) */}
      <Audio
        src={staticFile("paxvida_v2/bgm_comercial_pax.wav")}
        volume={(f) => {
          const baseVolume = interpolate(
            f,
            [0, 20, PAX_V2_TOTAL_FRAMES - 45, PAX_V2_TOTAL_FRAMES - 1],
            [0.05, 0.14, 0.14, 0.24],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );
          const fadeOut = interpolate(
            f,
            [PAX_V2_TOTAL_FRAMES - 12, PAX_V2_TOTAL_FRAMES - 1],
            [1, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );
          return baseVolume * fadeOut;
        }}
      />

      {/* Audio Track 3: B-roll transition whooshes */}
      {SFX_WHOOSH_FRAMES.map((frameAt) => (
        <Sequence key={`whoosh-${frameAt}`} from={frameAt} durationInFrames={18}>
          <Audio src={staticFile("paxvida_v2/sfx_whoosh.wav")} volume={0.34} />
        </Sequence>
      ))}

      {/* Audio Track 4: GC entrance pops */}
      {SFX_POP_FRAMES.map((frameAt) => (
        <Sequence key={`pop-${frameAt}`} from={frameAt} durationInFrames={15}>
          <Audio src={staticFile("paxvida_v2/sfx_pop_gc.wav")} volume={0.44} />
        </Sequence>
      ))}

      {/* Graphic Overlay Track (V3): Centered Blur-Up Lower Thirds */}
      {PAX_V2_GC_SLOTS.map((slot) => {
        const Component = PAX_V2_GC_COMPONENT_MAP[slot.id];
        return (
          <Sequence
            key={slot.id}
            from={slot.tlStart}
            durationInFrames={slot.frames}
          >
            <Component />
          </Sequence>
        );
      })}

      {/* Burned-in Subtitles for Preview Verification */}
      {showSubtitles ? <PaxSubtitleOverlay cues={PAX_V2_SUBTITLES} /> : null}
    </AbsoluteFill>
  );
};
