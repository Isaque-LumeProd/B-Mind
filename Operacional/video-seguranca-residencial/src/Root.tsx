import React from "react";
import { Composition, Freeze, Still } from "remotion";
import { AUDIOVISUAL_TOTAL_FRAMES } from "./audiovisual/audiovisualData";
import { AudiovisualEmpresaVideo } from "./audiovisual/AudiovisualEmpresaVideo";
import { SmartHomeDioramaCanvas } from "./lemo/SmartHomeDioramaCanvas";
import {
  PAX_FPS,
  PAX_GC_SLOTS,
  PAX_HEIGHT,
  PAX_TOTAL_FRAMES,
  PAX_WIDTH,
} from "./paxvida/paxVidaData";
import { PAX_GC_COMPONENT_MAP } from "./paxvida/PaxVidaGCs";
import { PaxVidaVideo } from "./paxvida/PaxVidaVideo";
import {
  PAX_V2_FPS,
  PAX_V2_GC_SLOTS,
  PAX_V2_HEIGHT,
  PAX_V2_TOTAL_FRAMES,
  PAX_V2_WIDTH,
} from "./paxvida_v2/paxVidaV2Data";
import { PAX_V2_GC_COMPONENT_MAP } from "./paxvida_v2/PaxVidaV2GCs";
import { PaxVidaV2Video } from "./paxvida_v2/PaxVidaV2Video";
import { TOTAL_DURATION_FRAMES } from "./scenesData";
import { SegurancaResidencialVideo } from "./SegurancaResidencialVideo";

const CoverStill: React.FC = () => {
  return <SmartHomeDioramaCanvas showSubtitles={true} />;
};

const AudiovisualCoverStill: React.FC = () => {
  return (
    <Freeze frame={90}>
      <AudiovisualEmpresaVideo
        brandName="DOCUMENTÁRIO • IMPACTO DO AUDIOVISUAL"
        footerLabel="FONTES: WYZOWL • INSIVIA • ABERDEEN • WORDSTREAM"
        showSubtitles={true}
      />
    </Freeze>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PaxVidaVideo1"
        component={PaxVidaVideo}
        durationInFrames={PAX_TOTAL_FRAMES}
        fps={PAX_FPS}
        width={PAX_WIDTH}
        height={PAX_HEIGHT}
        defaultProps={{
          showSubtitles: false,
        }}
      />
      {PAX_GC_SLOTS.map((slot) => (
        <Composition
          key={slot.id}
          id={slot.id}
          component={PAX_GC_COMPONENT_MAP[slot.id]}
          durationInFrames={slot.frames}
          fps={PAX_FPS}
          width={PAX_WIDTH}
          height={PAX_HEIGHT}
        />
      ))}
      <Composition
        id="PaxVidaVideo2"
        component={PaxVidaV2Video}
        durationInFrames={PAX_V2_TOTAL_FRAMES}
        fps={PAX_V2_FPS}
        width={PAX_V2_WIDTH}
        height={PAX_V2_HEIGHT}
        defaultProps={{
          showSubtitles: false,
        }}
      />
      {PAX_V2_GC_SLOTS.map((slot) => (
        <Composition
          key={slot.id}
          id={slot.id}
          component={PAX_V2_GC_COMPONENT_MAP[slot.id]}
          durationInFrames={slot.frames}
          fps={PAX_V2_FPS}
          width={PAX_V2_WIDTH}
          height={PAX_V2_HEIGHT}
        />
      ))}
      <Composition
        id="AudiovisualEmpresa9x16"
        component={AudiovisualEmpresaVideo}
        durationInFrames={AUDIOVISUAL_TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          brandName: "DOCUMENTÁRIO • IMPACTO DO AUDIOVISUAL",
          footerLabel: "FONTES: WYZOWL • INSIVIA • ABERDEEN • WORDSTREAM",
          showSubtitles: true,
        }}
      />
      <Composition
        id="SegurancaResidencial9x16"
        component={SegurancaResidencialVideo}
        durationInFrames={TOTAL_DURATION_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          brandName: "SEGURANÇA RESIDENCIAL",
          footerLabel: "DIORAMA ISOMÉTRICO • 3 CAMADAS ATIVAS",
          progressColor: "#CF5140",
          showSubtitles: true,
        }}
      />
      <Still
        id="CapaAudiovisual9x16"
        component={AudiovisualCoverStill}
        width={1080}
        height={1920}
      />
      <Still
        id="CapaReels9x16"
        component={CoverStill}
        width={1080}
        height={1920}
      />
    </>
  );
};
