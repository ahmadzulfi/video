import type React from "react";
import {
  AbsoluteFill,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { CrtOverlay, PixelBackground, PixelBox, Sprite, Tag, body, headline } from "../pixel";
import { C, bodyFont, pixelFont, stepped } from "../theme";

type ChannelsProps = {
  readonly level: string;
  readonly title: string;
  readonly caption: string;
};

type Pt = readonly [number, number];

const NUMBERS = ["CS Utama", "Sales", "Support", "Cabang"];
const AGENTS = ["Agen A", "Agen B", "Agen C"];

const HUB = { x: 760, y: 500, w: 400, h: 240 };
const hubMidY = HUB.y + HUB.h / 2;

/** Point at `progress` (0-1) along an orthogonal polyline. */
const pointAt = (pts: readonly Pt[], progress: number): Pt => {
  const segs = pts.slice(1).map((p, i) => Math.abs(p[0] - pts[i][0]) + Math.abs(p[1] - pts[i][1]));
  let remaining = segs.reduce((a, b) => a + b, 0) * Math.min(Math.max(progress, 0), 1);
  for (let i = 0; i < segs.length; i++) {
    if (remaining <= segs[i]) {
      const f = segs[i] === 0 ? 0 : remaining / segs[i];
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f];
    }
    remaining -= segs[i];
  }
  return pts[pts.length - 1];
};

const snap = (v: number) => Math.round(v / 6) * 6;

const ChannelsInner: React.FC<ChannelsProps> = ({ level, title, caption }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = stepped(frame, fps, 15);

  const inPaths: Pt[][] = NUMBERS.map((_, i) => {
    const y = 400 + i * 150;
    return [
      [400, y],
      [600, y],
      [600, hubMidY],
      [HUB.x, hubMidY],
    ];
  });
  const outPaths: Pt[][] = AGENTS.map((_, i) => {
    const y = 460 + i * 170;
    return [
      [HUB.x + HUB.w, hubMidY],
      [1340, hubMidY],
      [1340, y],
      [1520, y],
    ];
  });

  const linesOn = t >= 0.8 * fps;

  return (
    <>
      <PixelBackground />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 100, gap: 32 }}>
        <Tag>{level}</Tag>
        <h1 style={{ ...headline, textAlign: "center" }}>{title}</h1>
      </AbsoluteFill>

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }} shapeRendering="crispEdges">
        {[...inPaths, ...outPaths].map((pts, i) => (
          <polyline
            key={i}
            points={pts.map((p) => p.join(",")).join(" ")}
            fill="none"
            stroke={i < inPaths.length ? C.green : C.orange}
            strokeWidth={6}
            strokeDasharray="12 12"
            strokeDashoffset={-Math.floor(frame / 3) * 6}
            opacity={linesOn ? 0.75 : 0}
          />
        ))}
      </svg>

      {/* Data packets: chats flow in from every number, then out to whoever is free. */}
      {linesOn
        ? [...inPaths, ...outPaths].map((pts, i) => {
            const isIn = i < inPaths.length;
            const loop = 1.4 * fps;
            const offset = i * 7 + (isIn ? 0 : 0.7 * fps);
            const progress = (((t - offset) % loop) + loop) % loop / loop;
            const [x, y] = pointAt(pts, progress);
            return (
              <div
                key={`p-${i}`}
                style={{
                  position: "absolute",
                  left: snap(x) - 12,
                  top: snap(y) - 12,
                  width: 24,
                  height: 24,
                  backgroundColor: isIn ? C.green : C.orange,
                  boxShadow: `0 0 0 6px ${C.night}`,
                  opacity: t - offset > 0 ? 1 : 0,
                }}
              />
            );
          })
        : null}

      {NUMBERS.map((name, i) => {
        const y = 400 + i * 150;
        const on = t >= 0.2 * fps + i * 4;
        return (
          <div key={name} style={{ position: "absolute", left: 80, top: y - 52, display: "flex", alignItems: "center", gap: 24, opacity: on ? 1 : 0 }}>
            <div style={{ fontFamily: bodyFont, fontSize: 44, color: C.sky, width: 200, textAlign: "right" }}>{name}</div>
            <Sprite sprite="phone" size={8} palette={{ D: C.navyLight, S: C.green, L: C.sky }} />
          </div>
        );
      })}

      <PixelBox
        bg={C.night}
        border={C.green}
        p={8}
        style={{
          position: "absolute",
          left: HUB.x,
          top: HUB.y,
          width: HUB.w,
          height: HUB.h,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          scale: interpolate(t, [0.4 * fps, 0.8 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <Sprite sprite="bubble" size={8} palette={{ W: C.green, K: C.night }} />
        <div style={{ fontFamily: pixelFont, fontSize: 30, color: C.white }}>WA PLATFORM</div>
      </PixelBox>

      {AGENTS.map((name, i) => {
        const y = 460 + i * 170;
        const on = t >= 1 * fps + i * 4;
        return (
          <div key={name} style={{ position: "absolute", left: 1540, top: y - 46, display: "flex", alignItems: "center", gap: 24, opacity: on ? 1 : 0 }}>
            <Sprite sprite="person" size={9} palette={{ H: C.hair, S: C.skin, K: C.night, O: C.orange }} />
            <div style={{ fontFamily: bodyFont, fontSize: 44, color: C.sky }}>{name}</div>
          </div>
        );
      })}

      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 70 }}>
        <p
          style={{
            ...body,
            textAlign: "center",
            opacity: interpolate(t, [1.6 * fps, 2 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          {caption}
        </p>
      </AbsoluteFill>
      <CrtOverlay />
    </>
  );
};

const channelsSchema = {
  level: { type: "string", default: "LEVEL 2: MULTI NOMOR", description: "Level label" },
  title: { type: "string", default: "", description: "Title" },
  caption: { type: "string", default: "", description: "Caption" },
} as const satisfies InteractivitySchema;

export const ChannelsScene = Interactive.withSchema({
  Component: ChannelsInner,
  componentName: "ChannelsScene",
  schema: channelsSchema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
