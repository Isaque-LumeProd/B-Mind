import React, { useLayoutEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  CANVAS_H,
  CANVAS_W,
  drawCutawayAndPins,
  drawDotLattice,
  drawMapSubtitle,
  drawTopStationBanner,
} from "./dioramaOverlays";
import {
  computeCameraAndAtmosphere,
  drawDioramaHouse,
  drawDioramaPerimeterAndActors,
  drawDioramaPlinth,
} from "./dioramaWorld";
import { Iso } from "./engine.js";

export type DioramaCanvasProps = {
  readonly showSubtitles?: boolean;
};

export const renderDioramaFrame = (
  g: CanvasRenderingContext2D,
  globalFrame: number,
  fps: number,
  showSubtitles = true
) => {
  const t = globalFrame / fps;
  const state = computeCameraAndAtmosphere(globalFrame, fps);

  const iso = new Iso(g, CANVAS_W, CANVAS_H);
  iso.cam = {
    x: state.camX,
    y: state.camY,
    z: state.camZ,
    k: state.camK,
  };
  iso.desat = state.desatAmount;

  drawDotLattice(g, iso, state.nightAmount);
  drawDioramaPlinth(iso, state.floodlightOn);
  const nearWallH = drawDioramaHouse(iso, state);
  drawDioramaPerimeterAndActors(iso, state, t);

  iso.flush();

  drawCutawayAndPins(
    g,
    iso,
    state.sceneIndex,
    state.localSec,
    t,
    state.cutawayProgress,
    nearWallH,
    state.floodlightOn
  );
  drawTopStationBanner(g, state.sceneIndex, state.nightAmount);
  if (showSubtitles) {
    drawMapSubtitle(g, state.sceneIndex, state.localSec);
  }
};

export const SmartHomeDioramaCanvas: React.FC<DioramaCanvasProps> = ({
  showSubtitles = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const effectiveFrame = durationInFrames <= 1 ? 540 : frame;
  const effectiveFps = durationInFrames <= 1 ? 30 : fps;

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    renderDioramaFrame(ctx, effectiveFrame, effectiveFps, showSubtitles);
  }, [effectiveFrame, effectiveFps, showSubtitles]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_W}
      height={CANVAS_H}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
};
