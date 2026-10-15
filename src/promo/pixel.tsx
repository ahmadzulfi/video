import type React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { C, bodyFont, pixelFont } from "./theme";

// ---------------------------------------------------------------------------
// Sprites: each string is one row, each character one pixel. "." is empty.
// ---------------------------------------------------------------------------

export type Palette = Record<string, string>;

export const SPRITES = {
  phone: [
    "..DDDDDD..",
    ".DDDDDDDD.",
    ".DSSSSSSD.",
    ".DSSSSSSD.",
    ".DSSSSSSD.",
    ".DSSSSSSD.",
    ".DSSSSSSD.",
    ".DSSSSSSD.",
    ".DSSSSSSD.",
    ".DSSSSSSD.",
    ".DDDDDDDD.",
    ".DDDLLDDD.",
    "..DDDDDD..",
  ],
  bubble: [
    "..WWWWWWWW..",
    ".WWWWWWWWWW.",
    "WWWWWWWWWWWW",
    "WWKKWKKWKKWW",
    "WWKKWKKWKKWW",
    "WWWWWWWWWWWW",
    ".WWWWWWWWWW.",
    "..WWWWWWWW..",
    "..WW........",
    ".WW.........",
  ],
  robot: [
    ".....YY.....",
    ".....YY.....",
    "..WWWWWWWW..",
    ".WWWWWWWWWW.",
    ".WWKKWWKKWW.",
    ".WWKKWWKKWW.",
    "WWWWWWWWWWWW",
    "WWWWOOOOWWWW",
    ".WWWWWWWWWW.",
    "..WWWWWWWW..",
  ],
  person: [
    "...HHHH...",
    "..HHHHHH..",
    "..SKSSKS..",
    "..SSSSSS..",
    "...SSSS...",
    "..OOOOOO..",
    ".OOOOOOOO.",
    "OOOOOOOOOO",
    "OOOOOOOOOO",
  ],
  megaphone: [
    "..........OO",
    "........OOOO",
    "..WW..OOOOOO",
    "WWWWOOOOOOOO",
    "WWWWOOOOOOOO",
    "WWWWOOOOOOOO",
    "..WW..OOOOOO",
    "...W....OOOO",
    "...WW.....OO",
  ],
  book: [
    "OOOOO..OOOOO",
    "OWWWWOOWWWWO",
    "OWKKWOOWKKWO",
    "OWWWWOOWWWWO",
    "OWKKWOOWKKWO",
    "OWWWWOOWWWWO",
    "OWKKWOOWKKWO",
    "OWWWWOOWWWWO",
    "OOOOOOOOOOOO",
  ],
  envelope: [
    "WWWWWWWWWW",
    "WKWWWWWWKW",
    "WWKWWWWKWW",
    "WWWKWWKWWW",
    "WWWWKKWWWW",
    "WWWWWWWWWW",
    "WWWWWWWWWW",
  ],
  cursor: [
    "K.......",
    "KK......",
    "KWK.....",
    "KWWK....",
    "KWWWK...",
    "KWWWWK..",
    "KWWWWWK.",
    "KWWKKKKK",
    "KWK.....",
    "KK......",
    "K.......",
  ],
  check: [
    "........GG",
    ".......GGG",
    "......GGG.",
    "GG...GGG..",
    "GGG.GGG...",
    ".GGGGG....",
    "..GGG.....",
  ],
  star: [
    "....Y....",
    "...YYY...",
    "YYYYYYYYY",
    ".YYYYYYY.",
    "..YYYYY..",
    ".YYY.YYY.",
    "YY.....YY",
  ],
  heart: [
    ".RR.RR.",
    "RRRRRRR",
    "RRRRRRR",
    ".RRRRR.",
    "..RRR..",
    "...R...",
  ],
} as const;

export type SpriteName = keyof typeof SPRITES;

export const Sprite: React.FC<{
  readonly sprite: SpriteName;
  readonly palette: Palette;
  readonly size: number;
  readonly style?: React.CSSProperties;
}> = ({ sprite, palette, size, style }) => {
  const rows = SPRITES[sprite];
  const width = rows[0].length;
  const height = rows.length;

  return (
    <svg
      width={width * size}
      height={height * size}
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges"
      style={{ display: "block", ...style }}
    >
      {rows.flatMap((row, y) =>
        row.split("").map((ch, x) =>
          ch === "." || !palette[ch] ? null : (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={palette[ch]} />
          ),
        ),
      )}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Boxes, labels, text
// ---------------------------------------------------------------------------

/** A panel with the classic notched pixel border and a hard drop shadow. */
export const pixelBorder = (border: string, p = 6, shadow: string = C.black) =>
  [
    `0 -${p}px 0 0 ${border}`,
    `0 ${p}px 0 0 ${border}`,
    `-${p}px 0 0 0 ${border}`,
    `${p}px 0 0 0 ${border}`,
    `${p}px ${p * 2}px 0 0 ${shadow}`,
    `${p * 2}px ${p}px 0 0 ${shadow}`,
  ].join(", ");

export const PixelBox: React.FC<{
  readonly children?: React.ReactNode;
  readonly bg?: string;
  readonly border?: string;
  readonly p?: number;
  readonly style?: React.CSSProperties;
}> = ({ children, bg = C.bg2, border = C.navyLight, p = 6, style }) => (
  <div
    style={{
      backgroundColor: bg,
      boxShadow: pixelBorder(border, p),
      ...style,
    }}
  >
    {children}
  </div>
);

export const Tag: React.FC<{
  readonly children: React.ReactNode;
  readonly bg?: string;
  readonly color?: string;
  readonly style?: React.CSSProperties;
}> = ({ children, bg = C.orange, color = C.night, style }) => (
  <div
    style={{
      display: "inline-block",
      fontFamily: pixelFont,
      fontSize: 24,
      padding: "14px 20px 10px",
      backgroundColor: bg,
      color,
      boxShadow: pixelBorder(bg, 4),
      ...style,
    }}
  >
    {children}
  </div>
);

/** Reveals text one character at a time, with a block cursor while typing. */
export const Typewriter: React.FC<{
  readonly text: string;
  readonly startFrame?: number;
  readonly charsPerFrame?: number;
  readonly cursorColor?: string;
}> = ({ text, startFrame = 0, charsPerFrame = 0.7, cursorColor }) => {
  const frame = useCurrentFrame();
  const shown = Math.max(0, Math.floor((frame - startFrame) * charsPerFrame));
  const typing = frame >= startFrame && shown < text.length;
  const blinkOn = Math.floor(frame / 8) % 2 === 0;

  return (
    <>
      {text.slice(0, shown)}
      {typing || blinkOn ? (
        <span
          style={{
            display: "inline-block",
            width: "0.55em",
            height: "0.9em",
            marginLeft: 4,
            verticalAlign: "-0.1em",
            backgroundColor: cursorColor ?? "currentColor",
            opacity: frame < startFrame ? 0 : 1,
          }}
        />
      ) : null}
    </>
  );
};

/** On/off blink at a fixed rate - arcade "PRESS START" style. */
export const useBlink = (framesPerHalf = 12) => {
  const frame = useCurrentFrame();
  return Math.floor(frame / framesPerHalf) % 2 === 0;
};

// ---------------------------------------------------------------------------
// Background layers
// ---------------------------------------------------------------------------

/** Dark sky with a pixel grid floor feel and twinkling square stars. */
export const PixelBackground: React.FC<{ readonly tint?: string }> = ({ tint = C.bg }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const stars = 70;

  return (
    <AbsoluteFill style={{ backgroundColor: tint }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.navy}55 2px, transparent 2px), linear-gradient(90deg, ${C.navy}55 2px, transparent 2px)`,
          backgroundSize: "60px 60px",
        }}
      />
      {new Array(stars).fill(true).map((_, i) => {
        const x = Math.floor((random(`sx-${i}`) * width) / 6) * 6;
        const y = Math.floor((random(`sy-${i}`) * height) / 6) * 6;
        const size = random(`ss-${i}`) > 0.8 ? 12 : 6;
        const phase = Math.floor(random(`sp-${i}`) * 40);
        const on = Math.floor((frame + phase) / 20) % 3 !== 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              backgroundColor: i % 7 === 0 ? C.orangeLight : C.sky,
              opacity: on ? 0.7 : 0.15,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** CRT scanlines and a soft vignette on top of everything. */
export const CrtOverlay: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill
      style={{
        backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 2px, transparent 2px, transparent 5px)",
      }}
    />
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
      }}
    />
  </AbsoluteFill>
);

/**
 * Transition overlay: blocks fill the screen in a random order, then clear
 * again. Placed over a cut so the cut happens while the screen is covered.
 */
export const PixelWipe: React.FC<{ readonly color?: string }> = ({ color = C.night }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const cell = 120;
  const cols = Math.ceil(width / cell);
  const rows = Math.ceil(height / cell);
  const half = durationInFrames / 2;

  return (
    <AbsoluteFill>
      {new Array(cols * rows).fill(true).map((_, i) => {
        const threshold = random(`wipe-${i}`);
        const filling = frame < half;
        const progress = filling ? frame / half : (frame - half) / half;
        const visible = filling ? progress >= threshold : progress < threshold;
        if (!visible) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: (i % cols) * cell,
              top: Math.floor(i / cols) * cell,
              width: cell,
              height: cell,
              backgroundColor: color,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shared text styles
// ---------------------------------------------------------------------------

export const headline: React.CSSProperties = {
  fontFamily: pixelFont,
  fontSize: 64,
  lineHeight: 1.35,
  color: C.white,
  textShadow: `6px 6px 0 ${C.black}`,
  margin: 0,
};

export const body: React.CSSProperties = {
  fontFamily: bodyFont,
  fontSize: 56,
  lineHeight: 1.1,
  color: C.sky,
  margin: 0,
};
