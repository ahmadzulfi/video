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
import { C, pixelFont, stepped } from "../theme";

type BroadcastProps = {
  readonly level: string;
  readonly title: string;
  readonly caption: string;
  readonly total: number;
};

const COLS = 8;
const ROWS = 4;
const GRID_X = 800;
const GRID_Y = 390;
const SPACING_X = 125;
const SPACING_Y = 125;
const MOUTH: readonly [number, number] = [420, 520];
const FLIGHT = 10;

const BroadcastInner: React.FC<BroadcastProps> = ({ level, title, caption, total }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = stepped(frame, fps, 15);

  const sendAt = (i: number) => 0.8 * fps + i * 2;
  const lastArrival = sendAt(COLS * ROWS - 1) + FLIGHT;
  const count = Math.floor(
    interpolate(t, [sendAt(0), lastArrival], [0, total], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  const pulse = t >= sendAt(0) && t < lastArrival && Math.floor(frame / 4) % 2 === 0;

  return (
    <>
      <PixelBackground />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 100, gap: 32 }}>
        <Tag bg={C.orange}>{level}</Tag>
        <h1 style={{ ...headline, textAlign: "center" }}>{title}</h1>
      </AbsoluteFill>

      <div style={{ position: "absolute", left: 150, top: 440, scale: pulse ? 1.08 : 1 }}>
        <Sprite sprite="megaphone" size={22} palette={{ W: C.sky, O: C.orange }} />
      </div>

      <PixelBox
        bg={C.night}
        border={C.green}
        style={{ position: "absolute", left: 150, top: 720, width: 300, padding: "20px 0", textAlign: "center" }}
      >
        <div style={{ fontFamily: pixelFont, fontSize: 18, color: C.sky }}>TERKIRIM</div>
        <div style={{ fontFamily: pixelFont, fontSize: 40, color: C.green, marginTop: 14 }}>{count.toLocaleString("id-ID")}</div>
      </PixelBox>

      {new Array(COLS * ROWS).fill(true).map((_, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const x = GRID_X + col * SPACING_X;
        const y = GRID_Y + row * SPACING_Y;
        const start = sendAt(i);
        const arrived = t >= start + FLIGHT;
        const flying = t >= start && !arrived;
        const p = (t - start) / FLIGHT;
        const ex = MOUTH[0] + (x - MOUTH[0]) * p;
        const ey = MOUTH[1] + (y - MOUTH[1]) * p;

        return (
          <div key={i}>
            <div style={{ position: "absolute", left: x, top: y, opacity: t >= 0.2 * fps ? 1 : 0 }}>
              <Sprite
                sprite="person"
                size={6}
                palette={{ H: C.hair, S: C.skin, K: C.night, O: arrived ? C.green : C.navyMid }}
              />
            </div>
            {arrived ? (
              <div style={{ position: "absolute", left: x + 34, top: y - 18 }}>
                <Sprite sprite="check" size={3} palette={{ G: C.green }} />
              </div>
            ) : null}
            {flying ? (
              <div style={{ position: "absolute", left: Math.round(ex / 6) * 6, top: Math.round(ey / 6) * 6 }}>
                <Sprite sprite="envelope" size={4} palette={{ W: C.cream, K: C.orange }} />
              </div>
            ) : null}
          </div>
        );
      })}

      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 90 }}>
        <p
          style={{
            ...body,
            textAlign: "center",
            opacity: interpolate(t, [lastArrival, lastArrival + 0.4 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          {caption}
        </p>
      </AbsoluteFill>
      <CrtOverlay />
    </>
  );
};

const broadcastSchema = {
  level: { type: "string", default: "LEVEL 6: BROADCAST", description: "Level label" },
  title: { type: "string", default: "", description: "Title" },
  caption: { type: "string", default: "", description: "Caption" },
  total: { type: "number", default: 12480, min: 0, step: 10, integer: true, description: "Messages sent", hiddenFromList: false, keyframable: false },
} as const satisfies InteractivitySchema;

export const BroadcastScene = Interactive.withSchema({
  Component: BroadcastInner,
  componentName: "BroadcastScene",
  schema: broadcastSchema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
