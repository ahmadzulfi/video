import type React from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { CrtOverlay, PixelBackground, Sprite, body, headline, useBlink } from "../pixel";
import { C, pixelFont, stepped } from "../theme";

type IntroProps = {
  readonly title: string;
  readonly tagline: string;
};

const IntroInner: React.FC<IntroProps> = ({ title, tagline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = stepped(frame, fps, 12);
  const blink = useBlink(10);
  const letters = title.split("");

  return (
    <>
      <PixelBackground />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 56 }}>
        <div
          style={{
            translate: interpolate(t, [0, 0.6 * fps, 0.8 * fps, 1 * fps], ["0px -700px", "0px 0px", "0px -40px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <Sprite sprite="bubble" size={22} palette={{ W: C.green, K: C.night }} />
        </div>

        <h1 style={{ ...headline, fontSize: 96, display: "flex" }}>
          {letters.map((ch, i) => {
            const start = 0.9 * fps + i * 2;
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  minWidth: ch === " " ? 48 : undefined,
                  color: i < 2 ? C.green : C.white,
                  opacity: t >= start ? 1 : 0,
                  translate: interpolate(t, [start, start + 4], ["0px -40px", "0px 0px"], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                  }),
                }}
              >
                {ch}
              </span>
            );
          })}
        </h1>

        <p
          style={{
            ...body,
            fontSize: 64,
            opacity: interpolate(t, [2 * fps, 2.4 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {tagline}
        </p>
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 110 }}>
        <div
          style={{
            fontFamily: pixelFont,
            fontSize: 36,
            color: C.orange,
            textShadow: `4px 4px 0 ${C.black}`,
            opacity: frame > 2.6 * fps && blink ? 1 : 0,
          }}
        >
          PRESS START
        </div>
      </AbsoluteFill>
      <CrtOverlay />
    </>
  );
};

const introSchema = {
  title: { type: "string", default: "WA PLATFORM", description: "Title" },
  tagline: { type: "string", default: "", description: "Tagline" },
} as const satisfies InteractivitySchema;

export const IntroScene = Interactive.withSchema({
  Component: IntroInner,
  componentName: "IntroScene",
  schema: introSchema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
