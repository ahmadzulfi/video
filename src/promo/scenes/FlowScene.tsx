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

type FlowProps = {
  readonly level: string;
  readonly title: string;
  readonly caption: string;
};

// Node kinds and wording mirror the claudewa flow builder (components/flow).
const NODES = [
  { kind: "TRIGGER", text: 'Pesan masuk: "menu"', color: C.green },
  { kind: "KIRIM TOMBOL", text: "Mau cek pesanan?", buttons: ["Ya", "Tidak"], color: C.orange },
  { kind: "TANYA AI", text: "Jawab dari SOP", color: C.yellow },
  { kind: "SERAHKAN", text: "Ke agen CS", color: C.navyLight },
];

const NODE_W = 360;
const NODE_H = 230;
const GAP = 100;
const LEFT = (1920 - (NODES.length * NODE_W + (NODES.length - 1) * GAP)) / 2;
const TOP = 440;

const FlowInner: React.FC<FlowProps> = ({ level, title, caption }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = stepped(frame, fps, 12);

  const appearAt = (i: number) => 0.6 * fps + i * 1.1 * fps;
  const runAt = appearAt(NODES.length) + 0.3 * fps;
  const runStep = 0.45 * fps;
  const running = t >= runAt ? Math.min(NODES.length - 1, Math.floor((t - runAt) / runStep)) : -1;

  // The cursor carries each node in from below, then rests on the last one.
  const cursorTargets = NODES.map((_, i) => LEFT + i * (NODE_W + GAP) + NODE_W - 60);
  const cursorX = interpolate(
    t,
    NODES.map((_, i) => appearAt(i)),
    cursorTargets,
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <>
      <PixelBackground />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 100, gap: 32 }}>
        <Tag bg={C.yellow}>{level}</Tag>
        <h1 style={{ ...headline, textAlign: "center" }}>{title}</h1>
      </AbsoluteFill>

      {NODES.slice(0, -1).map((_, i) => {
        const x = LEFT + i * (NODE_W + GAP) + NODE_W + 6;
        const drawFrom = appearAt(i + 1);
        const w = interpolate(t, [drawFrom, drawFrom + 6], [0, GAP - 12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={`wire-${i}`} style={{ position: "absolute", left: x, top: TOP + NODE_H / 2 - 6, width: w, height: 12, backgroundColor: running > i ? C.green : C.sky }}>
            <div
              style={{
                position: "absolute",
                right: -12,
                top: -12,
                width: 0,
                height: 0,
                borderTop: "18px solid transparent",
                borderBottom: "18px solid transparent",
                borderLeft: `18px solid ${running > i ? C.green : C.sky}`,
                opacity: w >= GAP - 12 ? 1 : 0,
              }}
            />
          </div>
        );
      })}

      {NODES.map((node, i) => {
        const at = appearAt(i);
        const active = running === i;
        return (
          <PixelBox
            key={node.kind}
            bg={C.cream}
            border={active ? C.green : C.navyLight}
            p={active ? 10 : 6}
            style={{
              position: "absolute",
              left: LEFT + i * (NODE_W + GAP),
              top: TOP,
              width: NODE_W,
              height: NODE_H,
              opacity: t >= at - 0.4 * fps ? 1 : 0,
              translate: interpolate(t, [at - 0.4 * fps, at], ["0px 420px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}
          >
            <div style={{ backgroundColor: node.color, padding: "16px 18px 12px", fontFamily: pixelFont, fontSize: 20, color: C.night }}>{node.kind}</div>
            <div style={{ padding: "16px 18px", fontFamily: bodyFont, fontSize: 40, color: C.bg, lineHeight: 1 }}>
              {node.text}
              {node.buttons ? (
                <div style={{ display: "flex", gap: 14, marginTop: 16 }}>
                  {node.buttons.map((b) => (
                    <div key={b} style={{ padding: "4px 18px", backgroundColor: C.sky, boxShadow: `4px 4px 0 ${C.navyLight}`, fontSize: 34 }}>
                      {b}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </PixelBox>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: Math.round(cursorX / 6) * 6,
          top: interpolate(t, [0, 0.6 * fps], [1000, TOP + NODE_H - 40], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          opacity: t < runAt ? 1 : 0,
        }}
      >
        <Sprite sprite="cursor" size={7} palette={{ K: C.night, W: C.white }} />
      </div>

      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 120 }}>
        <p
          style={{
            ...body,
            textAlign: "center",
            opacity: interpolate(t, [runAt - 0.3 * fps, runAt], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          {caption}
        </p>
      </AbsoluteFill>
      <CrtOverlay />
    </>
  );
};

const flowSchema = {
  level: { type: "string", default: "LEVEL 4: FLOW BUILDER", description: "Level label" },
  title: { type: "string", default: "", description: "Title" },
  caption: { type: "string", default: "", description: "Caption" },
} as const satisfies InteractivitySchema;

export const FlowScene = Interactive.withSchema({
  Component: FlowInner,
  componentName: "FlowScene",
  schema: flowSchema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
