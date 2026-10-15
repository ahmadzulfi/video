import type React from "react";
import {
  AbsoluteFill,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { CrtOverlay, PixelBackground, Sprite, Tag, body, headline, useBlink } from "../pixel";
import { C, pixelFont, stepped } from "../theme";

type OutroProps = {
  readonly title: string;
  readonly tagline: string;
  readonly cta: string;
};

const FEATURES = [
  { label: "INBOX", bg: C.green },
  { label: "FLOW", bg: C.yellow },
  { label: "TANYA AI", bg: C.orangeLight },
  { label: "BROADCAST", bg: C.orange },
  { label: "PUBLIC API", bg: C.navyLight },
];

const OutroInner: React.FC<OutroProps> = ({ title, tagline, cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = stepped(frame, fps, 12);
  const blink = useBlink(10);
  const twinkle = Math.floor(frame / 10) % 2 === 0;

  return (
    <>
      <PixelBackground tint={C.night} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 48 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
          <Sprite sprite="star" size={10} palette={{ Y: C.yellow }} style={{ opacity: twinkle ? 1 : 0.4 }} />
          <div
            style={{
              scale: interpolate(t, [0, 0.4 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}
          >
            <Sprite sprite="bubble" size={18} palette={{ W: C.green, K: C.night }} />
          </div>
          <Sprite sprite="star" size={10} palette={{ Y: C.yellow }} style={{ opacity: twinkle ? 0.4 : 1 }} />
        </div>

        <h1 style={{ ...headline, fontSize: 92, opacity: t >= 0.4 * fps ? 1 : 0 }}>
          <span style={{ color: C.green }}>{title.slice(0, 2)}</span>
          {title.slice(2)}
        </h1>

        <div style={{ display: "flex", gap: 28 }}>
          {FEATURES.map((f, i) => (
            <Tag key={f.label} bg={f.bg} style={{ opacity: t >= 0.8 * fps + i * 3 ? 1 : 0 }}>
              {f.label}
            </Tag>
          ))}
        </div>

        <p style={{ ...body, fontSize: 64, opacity: t >= 1.6 * fps ? 1 : 0 }}>{tagline}</p>
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 110 }}>
        <div
          style={{
            fontFamily: pixelFont,
            fontSize: 36,
            color: C.orange,
            textShadow: `4px 4px 0 ${C.black}`,
            opacity: t >= 2.2 * fps && blink ? 1 : 0,
          }}
        >
          {cta}
        </div>
      </AbsoluteFill>
      <CrtOverlay />
    </>
  );
};

const outroSchema = {
  title: { type: "string", default: "WA PLATFORM", description: "Title" },
  tagline: { type: "string", default: "", description: "Tagline" },
  cta: { type: "string", default: "PRESS START", description: "Call to action" },
} as const satisfies InteractivitySchema;

export const OutroScene = Interactive.withSchema({
  Component: OutroInner,
  componentName: "OutroScene",
  schema: outroSchema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
