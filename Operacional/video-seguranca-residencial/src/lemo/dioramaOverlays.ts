import { SCENES_DATA } from "../scenesData";
import {
  cutLine,
  eo,
  haloText,
  hatch,
  hex,
  ICON,
  iconGrid,
  inset,
  Iso,
  lerp,
  mix,
  PAL,
  pin,
  ring,
  seg,
  ss,
  TAU,
  tri,
} from "./engine.js";

export const CANVAS_W = 1080;
export const CANVAS_H = 1920;

export const drawDotLattice = (
  g: CanvasRenderingContext2D,
  iso: Iso,
  nightAmount: number
) => {
  const bgCol = hex(mix(PAL.bg, "#171C26", nightAmount * 0.82));
  g.fillStyle = bgCol;
  g.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Subtle isometric dot lattice from iso-infographic STYLE.md §2
  g.fillStyle =
    nightAmount > 0.5 ? "rgba(251,244,230,0.08)" : "rgba(46,37,34,0.10)";
  const stepX = 64;
  const stepY = 37;
  for (let y = 80; y < CANVAS_H - 80; y += stepY) {
    const rowOffset = Math.floor(y / stepY) % 2 === 0 ? 0 : stepX / 2;
    for (let x = 40 + rowOffset; x < CANVAS_W - 40; x += stepX) {
      g.beginPath();
      g.arc(x, y, 1.6, 0, TAU);
      g.fill();
    }
  }

  // Soft blurred shadow under the floating diorama board
  const [bx, by] = iso.P(0, 0, -1.6);
  const rx = 11.5 * iso.cam.k;
  const ry = 6.6 * iso.cam.k;
  g.save();
  const grad = g.createRadialGradient(bx, by + 34, rx * 0.1, bx, by + 34, rx);
  grad.addColorStop(
    0,
    nightAmount > 0.5 ? "rgba(0,0,0,0.55)" : "rgba(46,37,34,0.22)"
  );
  grad.addColorStop(1, "rgba(46,37,34,0)");
  g.fillStyle = grad;
  g.beginPath();
  g.ellipse(bx, by + 34, rx, ry, 0, 0, TAU);
  g.fill();
  g.restore();
};

export const drawTopStationBanner = (
  g: CanvasRenderingContext2D,
  sceneIndex: number,
  nightAmount: number
) => {
  const scene = SCENES_DATA[sceneIndex];
  if (!scene) return;

  const haloCol =
    nightAmount > 0.5 ? "rgba(23,28,38,0.92)" : "rgba(251,244,230,0.94)";
  const inkCol = nightAmount > 0.5 ? "#FBF4E6" : PAL.ink;

  haloText(g, `${scene.tag}`, 64, 112, {
    font: "700 24px 'Segoe UI', Inter, sans-serif",
    track: 3.2,
    color: scene.accentColor,
    haloColor: haloCol,
    hw: 8,
  });

  haloText(g, `ESTAÇÃO 0${sceneIndex + 1} / 06`, CANVAS_W - 64, 112, {
    font: "600 24px 'Segoe UI', Inter, sans-serif",
    track: 2.5,
    align: "right",
    color: inkCol,
    haloColor: haloCol,
    hw: 8,
  });

  haloText(g, scene.headline.toUpperCase(), 64, 174, {
    font: "800 42px 'Segoe UI', Inter, sans-serif",
    track: 0.6,
    color: inkCol,
    haloColor: haloCol,
    hw: 10,
  });
};

export const drawMapSubtitle = (
  g: CanvasRenderingContext2D,
  sceneIndex: number,
  localSec: number
) => {
  const scene = SCENES_DATA[sceneIndex];
  if (!scene) return;

  const sceneDurSec = scene.durationInFrames / 30;
  const words = scene.subtitle.split(/\s+/);
  const mid = Math.ceil(words.length / 2);
  const cue1 = words.slice(0, mid).join(" ");
  const cue2 = words.slice(mid).join(" ");
  const switchSec = (scene.speechDurationMs / 1000) * 0.48;
  const activeText = localSec < switchSec ? cue1 : cue2;
  const cueProgress =
    localSec < switchSec
      ? seg(localSec, 0, 0.28)
      : seg(localSec, switchSec, switchSec + 0.28);

  const wipe = eo(cueProgress);
  const fadeOut = 1 - ss(seg(localSec, sceneDurSec - 0.25, sceneDurSec));
  if (fadeOut <= 0) return;

  const cardW = 940;
  const cardH = 138;
  const cardX = (CANVAS_W - cardW) / 2;
  const cardY = CANVAS_H - 250;

  g.save();
  g.globalAlpha = fadeOut;

  g.fillStyle = "rgba(46, 37, 34, 0.16)";
  g.beginPath();
  g.roundRect(cardX + 5, cardY + 7, cardW, cardH, 12);
  g.fill();

  g.fillStyle = PAL.paper;
  g.strokeStyle = PAL.ink;
  g.lineWidth = 2.5;
  g.beginPath();
  g.roundRect(cardX, cardY, cardW, cardH, 12);
  g.fill();
  g.stroke();

  const chipCx = cardX + 46;
  const chipCy = cardY + cardH / 2;
  ICON.box(g, chipCx, chipCy, 34, tri(scene.accentColor), 1);

  g.save();
  g.beginPath();
  g.rect(cardX + 80, cardY, (cardW - 104) * wipe, cardH);
  g.clip();

  g.fillStyle = PAL.ink;
  g.font = "600 32px 'Segoe UI', Inter, sans-serif";
  g.textAlign = "left";
  g.textBaseline = "middle";

  const subWords = activeText.split(" ");
  let line1 = "";
  let line2 = "";
  for (const w of subWords) {
    const test = line1 ? `${line1} ${w}` : w;
    if (!line2 && g.measureText(test).width < cardW - 130) {
      line1 = test;
    } else {
      line2 = line2 ? `${line2} ${w}` : w;
    }
  }

  if (line2) {
    g.fillText(line1, cardX + 88, cardY + cardH / 2 - 20);
    g.fillText(line2, cardX + 88, cardY + cardH / 2 + 22);
  } else {
    g.fillText(line1, cardX + 88, cardY + cardH / 2);
  }
  g.restore();
  g.restore();
};

export const drawCutawayAndPins = (
  g: CanvasRenderingContext2D,
  iso: Iso,
  sceneIndex: number,
  localSec: number,
  t: number,
  cutawayProgress: number,
  nearWallH: number,
  floodlightOn: number
) => {
  const hx0 = -5.2;
  const hx1 = 1.8;
  const hy0 = -4.2;
  const hy1 = 4.2;

  if (cutawayProgress > 0.02) {
    const cutLineReveal = seg(localSec, 0.2, 1.1);
    const roofRimPts = [
      iso.P(hx0, hy1, 0.42 + nearWallH),
      iso.P(hx1, hy1, 0.42 + nearWallH),
      iso.P(hx1, hy0, 0.42 + nearWallH),
    ];
    cutLine(g, roofRimPts, cutLineReveal, { color: PAL.red[1], lw: 3 });

    if (cutawayProgress > 0.4) {
      const hatchPts = [
        iso.P(hx0, hy1 - 0.35, 0.42 + nearWallH),
        iso.P(hx1, hy1 - 0.35, 0.42 + nearWallH),
        iso.P(hx1, hy1, 0.42 + nearWallH),
        iso.P(hx0, hy1, 0.42 + nearWallH),
      ];
      hatch(g, hatchPts, { sp: 6 });
    }
  }

  if (sceneIndex === 0) {
    const walkY = lerp(4.6, -0.8, seg(localSec, 0, 4.8));
    const [px, py] = iso.P(5.1, walkY, 0.2);
    ring(g, px, py, 54, eo(seg(localSec, 0.3, 1.0)), t, "02:14 AM", {
      color: PAL.red[0],
    });

    pin(iso, 1.8, -1.2, 3.2, {
      a: seg(localSec, 1.0, 2.2),
      up: 145,
      dir: -1,
      len: 70,
      dot: PAL.red[1],
      title: "CÂMERA PASSIVA",
      num: "0",
      unit: "ALERTAS ENVIADOS",
    });
  }

  if (sceneIndex === 1) {
    pin(iso, 3.85, -2.15, 3.5, {
      a: seg(localSec, 0.8, 2.0),
      up: 140,
      dir: -1,
      len: 70,
      dot: PAL.mustard[1],
      title: "REAÇÃO ATIVA",
      num: "1,2",
      unit: "SEGUNDOS",
      icons: (gg: CanvasRenderingContext2D, tx: number, ty: number) => {
        iconGrid(
          gg,
          tx - 210,
          ty + 8,
          6,
          seg(localSec, 1.8, 4.5) * 6,
          6,
          34,
          (
            g2: CanvasRenderingContext2D,
            x: number,
            y: number,
            s: number,
            on: number
          ) => ICON.box(g2, x, y, s, PAL.mustard, on)
        );
      },
    });
  }

  if (sceneIndex === 2) {
    const [catX, catY] = iso.P(2.9, 3.4, 0.2);
    ring(
      g,
      catX,
      catY,
      44,
      seg(localSec, 0.5, 1.4) * (1 - seg(localSec, 3.8, 4.4)),
      t,
      "PET: IGNORADO",
      { color: PAL.stone[2] }
    );

    pin(iso, 3.85, -2.15, 3.6, {
      a: seg(localSec, 1.2, 2.5),
      up: 150,
      dir: -1,
      len: 65,
      dot: floodlightOn > 0.2 ? PAL.mustard[1] : PAL.blue[1],
      title: floodlightOn > 0.2 ? "REFLETOR 4000K ACESO" : "DETECÇÃO HUMANA IA",
      num: "99",
      unit: "% PRECISÃO",
      icons: (gg: CanvasRenderingContext2D, tx: number, ty: number) => {
        ICON.sun(gg, tx - 36, ty + 28, 46, floodlightOn > 0.2 ? 1 : 0);
      },
    });
  }

  if (sceneIndex === 3) {
    const [doorSx, doorSy] = iso.P(1.8, -0.4, 1.6);
    const insetReveal = seg(localSec, 0.4, 1.6);
    inset(
      iso,
      doorSx,
      doorSy,
      260,
      470,
      155,
      insetReveal,
      (gg: CanvasRenderingContext2D, cx: number, cy: number) => {
        gg.fillStyle = "#2E2522";
        gg.beginPath();
        gg.roundRect(cx - 88, cy - 110, 176, 220, 18);
        gg.fill();

        const digits = ["4", "8", "2", "9"];
        const isLocked = localSec > 5.0;
        digits.forEach((d, idx) => {
          const col = idx % 2;
          const row = Math.floor(idx / 2);
          const bx = cx - 64 + col * 68;
          const by = cy - 78 + row * 68;
          const pressed = localSec > 1.5 + idx * 0.45;
          gg.fillStyle = isLocked
            ? PAL.green[1]
            : pressed
              ? PAL.mustard[0]
              : PAL.paper;
          gg.beginPath();
          gg.roundRect(bx, by, 56, 54, 10);
          gg.fill();

          gg.fillStyle = PAL.ink;
          gg.font = "800 28px 'Segoe UI', Inter, sans-serif";
          gg.textAlign = "center";
          gg.textBaseline = "middle";
          gg.fillText(isLocked ? "✓" : d, bx + 28, by + 28);
        });

        gg.fillStyle = PAL.paper;
        gg.font = "700 18px 'Segoe UI', Inter, sans-serif";
        gg.textAlign = "center";
        gg.fillText(
          isLocked ? "16:00 • AUTO-LOCK" : "VALE 14H ÀS 16H",
          cx,
          cy + 82
        );
      }
    );

    pin(iso, 2.0, -0.4, 2.2, {
      a: seg(localSec, 1.2, 2.4),
      up: 145,
      dir: 1,
      len: 55,
      dot: PAL.green[1],
      title: "SENHA TEMPORÁRIA",
      num: "2",
      unit: "HORAS DE VALIDADE",
    });
  }

  if (sceneIndex === 4) {
    const sensorAlpha =
      seg(localSec, 0.6, 1.6) * (1 - seg(localSec, 3.8, 4.4));
    if (sensorAlpha > 0.01) {
      pin(iso, -2.2, -4.1, 2.5, {
        a: sensorAlpha,
        up: 210,
        dir: -1,
        len: 45,
        dot: PAL.red[1],
        title: "SENSOR DE ABERTURA",
        num: "1",
        unit: "MM DE GATILHO",
      });
    }

    if (localSec > 3.8) {
      pin(iso, -4.1, 2.5, 2.6, {
        a: seg(localSec, 3.8, 4.9),
        up: 145,
        dir: 1,
        len: 45,
        dot: PAL.mustard[1],
        title: "PRESENÇA SIMULADA",
        num: "19:30",
        unit: "LUZES DA SALA",
      });
    }
  }

  if (sceneIndex === 5) {
    pin(iso, 3.85, -2.15, 3.5, {
      a: seg(localSec, 0.4, 1.4),
      up: 120,
      dir: 1,
      len: 26,
      dot: PAL.mustard[1],
      title: "01. CALÇADA",
      num: "4000K",
      unit: "REFLETOR",
    });
    pin(iso, 1.9, -0.6, 2.4, {
      a: seg(localSec, 0.8, 1.8),
      up: 175,
      dir: -1,
      len: 65,
      dot: PAL.green[1],
      title: "02. PORTA",
      num: "14-16H",
      unit: "AUTO-LOCK",
    });
    pin(iso, -2.2, -4.1, 2.6, {
      a: seg(localSec, 1.2, 2.2),
      up: 185,
      dir: 1,
      len: 35,
      dot: PAL.blue[1],
      title: "03. JANELAS",
      num: "1 MM",
      unit: "+ VIAGEM",
    });
  }
};
