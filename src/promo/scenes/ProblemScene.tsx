import type React from "react";
import {
  AbsoluteFill,
  Interactive,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { CrtOverlay, PixelBackground, Sprite, Tag, body, headline } from "../pixel";
import { C, pixelFont, stepped } from "../theme";

type ProblemProps = {
  readonly level: string;
  readonly title: string;
  readonly caption: string;
};

const PHONES = 5;

const ProblemInner: React.FC<ProblemProps> = ({ level, title, caption }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = stepped(frame, fps, 10);

  return (
    <>
      <PixelBackground />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 110, gap: 36 }}>
        <Tag bg={C.red} color={C.white}>{level}</Tag>
        <h1 style={{ ...headline, textAlign: "center" }}>{title}</h1>
      </AbsoluteFill>

      <AbsoluteFill style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 90, paddingTop: 80 }}>
        {new Array(PHONES).fill(true).map((_, i) => {
          const appear = 0.3 * fps + i * 5;
          const count = Math.floor(
            interpolate(t, [appear, appear + 3.5 * fps], [0, 30 + Math.floor(random(`c-${i}`) * 90)], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          );
          // The more unread chats, the harder the phone rattles.
          const shake = count > 10 ? (Math.floor(frame / 2) % 2 === 0 ? 6 : -6) * Math.min(count / 60, 1) : 0;
          return (
            <div
              key={i}
              style={{
                position: "relative",
                opacity: t >= appear ? 1 : 0,
                translate: `${Math.round(shake)}px ${i % 2 === 0 ? 0 : 40}px`,
              }}
            >
              <Sprite sprite="phone" size={18} palette={{ D: C.navyLight, S: C.green, L: C.sky }} />
              <div
                style={{
                  position: "absolute",
                  top: -26,
                  right: -40,
                  minWidth: 84,
                  padding: "14px 8px 10px",
                  backgroundColor: C.red,
                  color: C.white,
                  fontFamily: pixelFont,
                  fontSize: 26,
                  textAlign: "center",
                  boxShadow: `4px 4px 0 ${C.black}`,
                  opacity: count > 0 ? 1 : 0,
                }}
              >
                {count > 99 ? "99+" : count}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 120 }}>
        <p
          style={{
            ...body,
            fontSize: 60,
            textAlign: "center",
            opacity: interpolate(t, [2 * fps, 2.4 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          {caption}
        </p>
      </AbsoluteFill>
      <CrtOverlay />
    </>
  );
};

const problemSchema = {
  level: { type: "string", default: "LEVEL 1: CHAOS", description: "Level label" },
  title: { type: "string", default: "", description: "Title" },
  caption: { type: "string", default: "", description: "Caption" },
} as const satisfies InteractivitySchema;

export const ProblemScene = Interactive.withSchema({
  Component: ProblemInner,
  componentName: "ProblemScene",
  schema: problemSchema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
