import { SCENES_DATA } from "../scenesData";
import { eio, eo, Iso, lerp, PAL, person, seg, ss, tri } from "./engine.js";

export type CameraAndAtmosphere = {
  readonly sceneIndex: number;
  readonly localSec: number;
  readonly camX: number;
  readonly camY: number;
  readonly camZ: number;
  readonly camK: number;
  readonly nightAmount: number;
  readonly desatAmount: number;
  readonly floodlightOn: number;
  readonly cutawayProgress: number;
  readonly livingRoomLit: number;
};

export const resolveSceneTiming = (
  globalFrame: number,
  fps: number
): { readonly sceneIndex: number; readonly localSec: number } => {
  let accFrames = 0;
  for (let i = 0; i < SCENES_DATA.length; i++) {
    const dur = SCENES_DATA[i].durationInFrames;
    if (globalFrame < accFrames + dur || i === SCENES_DATA.length - 1) {
      return {
        sceneIndex: i,
        localSec: (globalFrame - accFrames) / fps,
      };
    }
    accFrames += dur;
  }
  return { sceneIndex: 0, localSec: 0 };
};

export const computeCameraAndAtmosphere = (
  globalFrame: number,
  fps: number
): CameraAndAtmosphere => {
  const { sceneIndex, localSec } = resolveSceneTiming(globalFrame, fps);

  if (sceneIndex === 0) {
    const p = eio(seg(localSec, 0, 5.2));
    return {
      sceneIndex,
      localSec,
      camX: lerp(3.2, 4.4, p),
      camY: lerp(1.2, -0.4, p),
      camZ: 0.6,
      camK: Math.exp(lerp(Math.log(38), Math.log(46), p)),
      nightAmount: 0.85,
      desatAmount: 0,
      floodlightOn: 0,
      cutawayProgress: 0,
      livingRoomLit: 0,
    };
  }

  if (sceneIndex === 1) {
    const p = eio(seg(localSec, 0, 1.4));
    return {
      sceneIndex,
      localSec,
      camX: lerp(4.4, 0.6, p),
      camY: lerp(-0.4, 0.2, p),
      camZ: 0.8,
      camK: Math.exp(lerp(Math.log(46), Math.log(36), p)),
      nightAmount: lerp(0.85, 0.1, ss(seg(localSec, 0, 2.0))),
      desatAmount:
        ss(seg(localSec, 0.4, 1.5)) * (1 - ss(seg(localSec, 3.8, 5.2))) * 0.78,
      floodlightOn: 0,
      cutawayProgress: 0,
      livingRoomLit: 0,
    };
  }

  if (sceneIndex === 2) {
    const p = eio(seg(localSec, 0, 1.5));
    const floodlightOn = ss(seg(localSec, 4.1, 4.7));
    return {
      sceneIndex,
      localSec,
      camX: lerp(0.6, 3.6, p),
      camY: lerp(0.2, -0.5, p),
      camZ: 0.9,
      camK: Math.exp(lerp(Math.log(36), Math.log(46), p)),
      nightAmount: lerp(0.78, 0.18, floodlightOn),
      desatAmount: 0,
      floodlightOn,
      cutawayProgress: 0,
      livingRoomLit: 0,
    };
  }

  if (sceneIndex === 3) {
    const p = eio(seg(localSec, 0, 1.5));
    return {
      sceneIndex,
      localSec,
      camX: lerp(3.6, 1.8, p),
      camY: lerp(-0.5, -0.8, p),
      camZ: 1.2,
      camK: Math.exp(lerp(Math.log(46), Math.log(48), p)),
      nightAmount: 0,
      desatAmount: 0,
      floodlightOn: 0,
      cutawayProgress: 0,
      livingRoomLit: 0,
    };
  }

  if (sceneIndex === 4) {
    const p = eio(seg(localSec, 0, 1.6));
    return {
      sceneIndex,
      localSec,
      camX: lerp(1.8, -1.6, p),
      camY: lerp(-0.8, -0.6, p),
      camZ: 1.5,
      camK: Math.exp(lerp(Math.log(48), Math.log(43), p)),
      nightAmount: lerp(0.15, 0.72, ss(seg(localSec, 3.8, 5.0))),
      desatAmount: 0,
      floodlightOn: 0,
      cutawayProgress: eo(seg(localSec, 0.8, 2.2)),
      livingRoomLit: ss(seg(localSec, 4.6, 5.5)),
    };
  }

  const p = eio(seg(localSec, 0, 2.0));
  return {
    sceneIndex,
    localSec,
    camX: lerp(-1.6, 0.4, p),
    camY: lerp(-0.6, 0.2, p),
    camZ: lerp(1.5, 0.6, p),
    camK: Math.exp(lerp(Math.log(43), Math.log(35), p)),
    nightAmount: 0.08,
    desatAmount: 0,
    floodlightOn: 1,
    cutawayProgress: 1 - ss(seg(localSec, 0.2, 1.4)),
    livingRoomLit: 1,
  };
};

export const drawDioramaPlinth = (iso: Iso, floodlightOn: number) => {
  const bx0 = -7.5;
  const bx1 = 8.5;
  const by0 = -7.0;
  const by1 = 7.0;

  iso.box(bx0, by0, -1.5, bx1 - bx0, by1 - by0, 0.6, tri("#6A432A"), {
    layer: -3,
    cull: false,
  });
  iso.box(bx0, by0, -0.9, bx1 - bx0, by1 - by0, 0.55, PAL.soil, {
    layer: -2,
    cull: false,
  });
  iso.box(bx0, by0, -0.35, 11.5, by1 - by0, 0.35, PAL.green, {
    layer: -1,
    cull: false,
  });
  iso.box(4.0, by0, -0.35, 4.5, by1 - by0, 0.35, PAL.stone, {
    layer: -1,
    cull: false,
  });
  iso.box(6.6, by0, -0.33, 1.9, by1 - by0, 0.35, tri("#5A5751"), {
    layer: -1,
    cull: false,
  });

  // Stone walkway + stepping stones from gate to front door
  iso.flat(
    [
      [1.8, -1.5],
      [4.2, -1.5],
      [4.2, 0.3],
      [1.8, 0.3],
    ],
    0.02,
    PAL.cream[1],
    { layer: -1, zBias: 0.6 }
  );

  if (floodlightOn > 0.01) {
    iso.keep = true;
    iso.flat(
      [
        [2.2, -3.6],
        [6.5, -4.4],
        [6.5, 2.2],
        [2.2, 1.2],
      ],
      0.03,
      "#F4CB6A",
      { a: 0.48 * floodlightOn, layer: -1, zBias: 0.8 }
    );
    iso.keep = false;
  }
};

export const drawDioramaHouse = (
  iso: Iso,
  state: CameraAndAtmosphere
): number => {
  const { sceneIndex, localSec, cutawayProgress, livingRoomLit } = state;
  const hx0 = -5.2;
  const hx1 = 1.8;
  const hy0 = -4.2;
  const hy1 = 4.2;
  const wallH = 3.4;

  iso.box(hx0, hy0, 0, hx1 - hx0, hy1 - hy0, 0.32, PAL.stone, { layer: -0.5 });
  const floorHue = livingRoomLit > 0.1 ? "#F4CB6A" : "#D8C29D";
  iso.box(
    hx0 + 0.25,
    hy0 + 0.25,
    0.32,
    hx1 - hx0 - 0.5,
    hy1 - hy0 - 0.5,
    0.1,
    tri(floorHue),
    { layer: -0.5 }
  );

  // Far walls + back window opening
  iso.box(hx0, hy0, 0.42, 0.35, hy1 - hy0, wallH, PAL.cream);
  iso.box(hx0, hy0, 0.42, hx1 - hx0, 0.35, 1.2, PAL.cream);
  iso.box(hx0, hy0, 1.62, 1.6, 0.35, 1.5, PAL.cream);
  iso.box(hx0 + 4.4, hy0, 1.62, 2.6, 0.35, 1.5, PAL.cream);
  iso.box(hx0, hy0, 3.12, hx1 - hx0, 0.35, 0.7, PAL.cream);

  // Back Window + Magnetic Reed Sensor
  iso.keep = sceneIndex === 4 || sceneIndex === 5;
  const windowAlert =
    sceneIndex === 4 && localSec > 1.2 && localSec < 4.5 ? 1 : 0;
  const winSlide = windowAlert * 0.28;
  iso.box(
    hx0 + 1.6 + winSlide,
    hy0 + 0.06,
    1.62,
    2.8 - winSlide,
    0.18,
    1.5,
    tri(windowAlert ? "#CF5140" : "#7BA7C9")
  );
  iso.box(
    hx0 + 1.55,
    hy0 - 0.05,
    2.3,
    0.28,
    0.28,
    0.45,
    windowAlert ? PAL.red : PAL.blue
  );
  iso.keep = false;

  drawLivingRoomInterior(iso, livingRoomLit);

  // Near Walls (cutaway in Shot 5)
  const nearWallH = lerp(wallH, 1.05, cutawayProgress);
  iso.box(hx0, hy1 - 0.35, 0.42, hx1 - hx0, 0.35, nearWallH, PAL.cream);
  iso.box(hx1 - 0.35, hy0, 0.42, 0.35, 2.8, nearWallH, PAL.cream);
  iso.box(hx1 - 0.35, 0.0, 0.42, 0.35, 4.2, nearWallH, PAL.cream);

  // Front Door + Smart Digital Lock
  const doorH = Math.min(2.5, nearWallH);
  iso.box(hx1 - 0.3, -1.4, 0.42, 0.28, 1.4, doorH, PAL.soil);
  iso.keep = sceneIndex === 3 || sceneIndex === 5;
  iso.box(
    hx1 - 0.02,
    -0.38,
    1.35,
    0.16,
    0.26,
    0.52,
    sceneIndex === 3 ? PAL.green : PAL.blue
  );
  iso.keep = false;

  if (cutawayProgress < 0.96) {
    const roofLiftZ = cutawayProgress * 3.8;
    iso.alpha = 1 - cutawayProgress;
    iso.roof(
      hx0 - 0.3,
      hy0 - 0.3,
      0.42 + wallH + roofLiftZ,
      hx1 - hx0 + 0.6,
      hy1 - hy0 + 0.6,
      2.1,
      tri("#B85D43"),
      { ridge: "y", over: 0.25 }
    );
    iso.alpha = 1;
  }

  return nearWallH;
};

const drawLivingRoomInterior = (iso: Iso, livingRoomLit: number) => {
  if (livingRoomLit > 0.1) {
    iso.keep = true;
    iso.flat(
      [
        [-4.8, -3.6],
        [1.2, -3.6],
        [1.2, 3.6],
        [-4.8, 3.6],
      ],
      0.43,
      "#F4CB6A",
      { a: 0.45 * livingRoomLit, layer: -0.5, zBias: 0.3 }
    );
    iso.keep = false;
  }

  // Sofa + Coffee Table + Bookshelf + Floor Lamp
  iso.box(-3.6, -1.8, 0.42, 1.5, 3.2, 0.55, PAL.blue);
  iso.box(-3.6, -1.8, 0.97, 0.42, 3.2, 0.65, PAL.blue);
  iso.box(-1.4, -1.1, 0.42, 1.1, 1.8, 0.42, PAL.soil);
  iso.box(-4.7, -3.6, 0.42, 0.55, 1.4, 1.6, PAL.soil);

  iso.keep = livingRoomLit > 0.1;
  iso.cyl(-4.1, 2.5, 0.42, 0.12, 1.8, PAL.stone);
  iso.cone(
    -4.1,
    2.5,
    2.1,
    0.55,
    0.65,
    livingRoomLit > 0.1 ? PAL.mustard : PAL.cream
  );
  iso.keep = false;
};

export const drawDioramaPerimeterAndActors = (
  iso: Iso,
  state: CameraAndAtmosphere,
  t: number
) => {
  const { sceneIndex, localSec, floodlightOn } = state;

  // Fence walls & Gate pillars
  iso.box(3.7, -6.4, 0, 0.3, 4.6, 1.25, PAL.stone);
  iso.box(3.7, 0.6, 0, 0.3, 5.8, 1.25, PAL.stone);
  iso.box(3.6, -1.8, 0, 0.5, 0.5, 1.65, PAL.cream);
  iso.box(3.6, 0.2, 0, 0.5, 0.5, 1.65, PAL.cream);

  // Floodlight & AI Camera Pole
  iso.keep = sceneIndex === 1 || sceneIndex === 2 || sceneIndex === 5;
  iso.cyl(3.85, -2.15, 0, 0.12, 3.5, tri("#3A3E3B"));
  iso.box(
    3.7,
    -2.35,
    3.4,
    0.55,
    0.45,
    0.3,
    floodlightOn > 0.2 ? PAL.mustard : PAL.blue
  );
  iso.keep = false;

  // Garden Tree, Hedges & Pet
  iso.cyl(1.4, 4.8, 0, 0.22, 1.5, PAL.soil);
  iso.sphere(1.4, 4.8, 2.2, 1.15, PAL.green, { hi: false });
  iso.sphere(0.9, 5.2, 1.8, 0.85, PAL.green, { hi: false });
  iso.sphere(-5.8, 4.8, 0.6, 0.65, PAL.green, { hi: false });
  iso.box(2.8, 3.4, 0, 0.45, 0.28, 0.32, PAL.mustard);
  iso.box(3.15, 3.4, 0.2, 0.22, 0.24, 0.25, PAL.mustard);

  if (sceneIndex >= 1) {
    iso.keep = true;
    iso.line3(
      [
        [3.85, -2.15, 0.15],
        [1.9, -0.7, 0.45],
        [-2.2, -4.0, 1.8],
      ],
      PAL.mustard[1],
      3.5,
      { dash: [10, 8], off: -t * 28 }
    );
    iso.keep = false;
  }

  drawPeopleAndLabels(iso, sceneIndex, localSec, t);
};

const drawPeopleAndLabels = (
  iso: Iso,
  sceneIndex: number,
  localSec: number,
  t: number
) => {
  const t12 = Math.floor(t * 12) / 12;

  if (sceneIndex === 0 || sceneIndex === 2) {
    const walkY =
      sceneIndex === 0
        ? lerp(4.6, -0.8, seg(localSec, 0, 4.8))
        : localSec < 4.2
          ? lerp(3.4, -0.6, eo(seg(localSec, 0, 3.5)))
          : lerp(-0.6, -3.2, ss(seg(localSec, 4.4, 7.5)));
    const isMoving =
      sceneIndex === 0 || localSec < 3.5 || (localSec > 4.4 && localSec < 7.5);
    const bob = isMoving ? Math.abs(Math.sin(t12 * 10)) * 0.12 : 0;

    iso.keep = true;
    iso.bill(5.1, walkY, 0, (gg: CanvasRenderingContext2D) => {
      person(gg, {
        h: 2.1,
        body: "#3A4454",
        legs: "#232524",
        hat: "cap",
        hatColor: "#CF5140",
        bob,
        arm: isMoving ? Math.sin(t12 * 10) * 0.45 : 0.15,
      });
    });
    iso.keep = false;
  }

  if (sceneIndex === 3) {
    const arrive = eo(seg(localSec, 0.2, 2.8));
    const leave = ss(seg(localSec, 5.2, 8.2));
    const courierX =
      localSec < 5.0 ? lerp(5.2, 2.45, arrive) : lerp(2.45, 5.4, leave);
    const isWalking = localSec < 2.8 || (localSec > 5.2 && localSec < 8.2);
    const bob = isWalking ? Math.abs(Math.sin(t12 * 11)) * 0.12 : 0;

    iso.keep = true;
    iso.bill(courierX, -0.7, 0.05, (gg: CanvasRenderingContext2D) => {
      person(gg, {
        h: 2.1,
        body: "#3C7FB1",
        hat: "cap",
        hatColor: "#E9BE5C",
        bob,
        face: localSec > 5.0 ? -1 : 1,
        arm: isWalking ? Math.sin(t12 * 11) * 0.4 : 0.5,
      });
    });

    if (localSec >= 2.8) {
      const dropBounce = eo(seg(localSec, 2.8, 3.2));
      iso.box(
        2.05,
        -0.4,
        0.35 + (1 - dropBounce) * 0.8,
        0.48,
        0.48,
        0.42,
        tri("#C9A060")
      );
    }
    iso.keep = false;
  }

  iso.keep = true;
  iso.text3("CALÇADA", 5.6, 4.8, 0.05, {
    size: 0.72,
    plane: "xy",
    extrude: 0.08,
    tri: PAL.stone,
    face: PAL.ink,
  });
  iso.keep = false;
};

