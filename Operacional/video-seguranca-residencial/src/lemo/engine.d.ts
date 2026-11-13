export type Triplet = readonly [string, string, string];
export type Pt2 = readonly [number, number];
export type Pt3 = readonly [number, number, number];

export const TAU: number;
export function clamp(v: number, a?: number, b?: number): number;
export function lerp(a: number, b: number, t: number): number;
export function seg(t: number, a: number, b: number): number;
export function ss(t: number): number;
export function eio(t: number): number;
export function eo(t: number): number;
export function back(t: number, s?: number): number;
export function hex(rgb: readonly [number, number, number]): string;
export function mix(
  a: string,
  b: string,
  t: number
): readonly [number, number, number];
export function tri(topHex: string, sL?: number, sR?: number): Triplet;

export const PAL: {
  readonly bg: string;
  readonly paper: string;
  readonly ink: string;
  readonly stone: Triplet;
  readonly cream: Triplet;
  readonly soil: Triplet;
  readonly green: Triplet;
  readonly red: Triplet;
  readonly blue: Triplet;
  readonly mustard: Triplet;
};

export const FONT: string;

export class Iso {
  g: CanvasRenderingContext2D;
  W: number;
  H: number;
  items: unknown[];
  cam: { x: number; y: number; z: number; k: number };
  alpha: number;
  desat: number;
  keep: boolean;
  constructor(g: CanvasRenderingContext2D, w?: number, h?: number);
  w(x: number, y: number, z: number): Pt3;
  P(x: number, y: number, z?: number): [number, number];
  col(c: string): string;
  poly(
    pts3: readonly Pt3[],
    fill: string,
    opts?: {
      stroke?: string;
      lw?: number;
      a?: number;
      layer?: number;
      zBias?: number;
    }
  ): void;
  flat(
    pts2: readonly Pt2[],
    z: number,
    fill: string,
    opts?: {
      stroke?: string;
      lw?: number;
      a?: number;
      layer?: number;
      zBias?: number;
    }
  ): void;
  box(
    x: number,
    y: number,
    z: number,
    dx: number,
    dy: number,
    dz: number,
    t3: Triplet,
    opts?: {
      a?: number;
      layer?: number;
      stroke?: string;
      cull?: boolean;
      openTop?: boolean;
    }
  ): void;
  roof(
    x: number,
    y: number,
    z: number,
    dx: number,
    dy: number,
    dz: number,
    t3: Triplet,
    opts?: { ridge?: "x" | "y"; over?: number; layer?: number }
  ): void;
  cyl(
    cx: number,
    cy: number,
    z: number,
    r: number,
    h: number,
    t3: Triplet,
    opts?: { n?: number; layer?: number; a?: number }
  ): void;
  cone(
    cx: number,
    cy: number,
    z: number,
    r: number,
    h: number,
    t3: Triplet,
    opts?: { n?: number; layer?: number }
  ): void;
  sphere(
    cx: number,
    cy: number,
    cz: number,
    r: number,
    t3: Triplet,
    opts?: { layer?: number; hi?: boolean }
  ): void;
  line3(
    pts3: readonly Pt3[],
    color: string,
    lw?: number,
    opts?: { dash?: number[]; off?: number; a?: number; layer?: number }
  ): void;
  text3(
    text: string,
    x: number,
    y: number,
    z: number,
    opts?: {
      size?: number;
      weight?: number;
      font?: string;
      plane?: "xy" | "xz" | "yz";
      extrude?: number;
      tri?: Triplet;
      face?: string;
      align?: CanvasTextAlign;
      track?: number;
      layer?: number;
      a?: number;
    }
  ): void;
  bill(
    x: number,
    y: number,
    z: number,
    drawFn: (g: CanvasRenderingContext2D, iso: Iso, k: number) => void,
    opts?: { layer?: number; a?: number; cull?: boolean }
  ): void;
  flush(): void;
}

export function haloText(
  g: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  opts?: {
    font?: string;
    color?: string;
    haloColor?: string;
    hw?: number;
    align?: CanvasTextAlign;
    base?: CanvasTextBaseline;
    track?: number;
    a?: number;
  }
): void;

export function pin(
  iso: Iso,
  wx: number,
  wy: number,
  wz: number,
  opts?: {
    a?: number;
    up?: number;
    dir?: 1 | -1;
    len?: number;
    dot?: string;
    title?: string;
    num?: string;
    unit?: string;
    sub?: string;
    icons?: (g: CanvasRenderingContext2D, tx: number, ty: number) => void;
  }
): void;

export function ring(
  g: CanvasRenderingContext2D,
  sx: number,
  sy: number,
  r: number,
  a: number,
  t: number,
  label?: string,
  opts?: { color?: string }
): void;

export function inset(
  iso: Iso,
  ax: number,
  ay: number,
  cx: number,
  cy: number,
  r: number,
  a: number,
  drawInside: (
    g: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    r: number,
    c?: number
  ) => void,
  opts?: { bg?: string }
): void;

export function cutLine(
  g: CanvasRenderingContext2D,
  pts2: readonly Pt2[],
  a: number,
  opts?: { color?: string; lw?: number }
): void;

export function hatch(
  g: CanvasRenderingContext2D,
  poly2: readonly Pt2[],
  opts?: { sp?: number; color?: string; lw?: number; a?: number }
): void;

export function person(
  g: CanvasRenderingContext2D,
  opts?: {
    h?: number;
    skin?: string;
    body?: string;
    legs?: string;
    hat?: "hard" | "cap" | null;
    hatColor?: string;
    arm?: number;
    bob?: number;
    face?: 1 | -1;
  }
): void;

export const ICON: {
  person(
    g: CanvasRenderingContext2D,
    x: number,
    y: number,
    s: number,
    color: string,
    on?: number
  ): void;
  drop(
    g: CanvasRenderingContext2D,
    x: number,
    y: number,
    s: number,
    color?: string,
    on?: number
  ): void;
  sun(
    g: CanvasRenderingContext2D,
    x: number,
    y: number,
    s: number,
    on?: number
  ): void;
  box(
    g: CanvasRenderingContext2D,
    x: number,
    y: number,
    s: number,
    t3?: Triplet,
    on?: number
  ): void;
};

export function iconGrid(
  g: CanvasRenderingContext2D,
  x: number,
  y: number,
  total: number,
  active: number,
  cols: number,
  cell: number,
  drawOne: (
    g: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    s: number,
    on: number,
    i: number
  ) => void
): void;

