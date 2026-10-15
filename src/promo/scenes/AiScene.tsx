import type React from "react";
import {
  AbsoluteFill,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { CrtOverlay, PixelBackground, PixelBox, Sprite, Tag, Typewriter, body, headline } from "../pixel";
import { C, bodyFont, pixelFont, stepped } from "../theme";

type AiProps = {
  readonly level: string;
  readonly title: string;
  readonly question: string;
  readonly answer: string;
  readonly caption: string;
};

const DOCS = ["SOP Toko", "FAQ Kirim", "Daftar Harga"];

const AiInner: React.FC<AiProps> = ({ level, title, question, answer, caption }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = stepped(frame, fps, 12);

  const questionAt = 0.6 * fps;
  const thinkAt = 1.2 * fps;
  const answerAt = 2.6 * fps;
  const thinking = t >= thinkAt && t < answerAt;
  const bob = Math.floor(frame / 8) % 2 === 0 ? 0 : -12;

  return (
    <>
      <PixelBackground />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 100, gap: 32 }}>
        <Tag bg={C.yellow}>{level}</Tag>
        <h1 style={{ ...headline, textAlign: "center" }}>{title}</h1>
      </AbsoluteFill>

      {/* Knowledge base */}
      <div style={{ position: "absolute", left: 150, top: 420, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <Sprite sprite="book" size={14} palette={{ O: C.orange, W: C.cream, K: C.navyLight }} />
        <div style={{ fontFamily: pixelFont, fontSize: 18, color: C.orangeLight, textAlign: "center", lineHeight: 1.6 }}>
          BASIS
          <br />
          PENGETAHUAN
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {DOCS.map((d, i) => (
            <div
              key={d}
              style={{
                fontFamily: bodyFont,
                fontSize: 34,
                color: C.night,
                backgroundColor: thinking && Math.floor(frame / 6) % DOCS.length === i ? C.yellow : C.sky,
                padding: "2px 14px",
              }}
            >
              {d}
            </div>
          ))}
        </div>
      </div>

      {/* Bits travelling from the documents into the bot while it searches. */}
      {thinking
        ? [0, 1, 2, 3].map((i) => {
            const x = interpolate((frame + i * 6) % 24, [0, 24], [420, 640]);
            return (
              <div
                key={i}
                style={{ position: "absolute", left: Math.round(x / 6) * 6, top: 560 + (i % 2) * 24, width: 18, height: 18, backgroundColor: C.yellow }}
              />
            );
          })
        : null}

      {/* The bot */}
      <div style={{ position: "absolute", left: 680, top: 470 + bob, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <Sprite sprite="robot" size={16} palette={{ Y: C.yellow, W: C.sky, K: thinking ? C.orange : C.night, O: C.navyMid }} />
        <div style={{ fontFamily: pixelFont, fontSize: 20, color: C.yellow }}>{thinking ? "MENCARI..." : "TANYA AI"}</div>
      </div>

      {/* Chat */}
      <PixelBox
        bg={C.cream}
        border={C.navyLight}
        p={8}
        style={{ position: "absolute", left: 1040, top: 360, width: 730, height: 520, padding: 34, display: "flex", flexDirection: "column", gap: 30 }}
      >
        <div
          style={{
            alignSelf: "flex-start",
            padding: "16px 24px",
            backgroundColor: C.white,
            boxShadow: `6px 6px 0 ${C.navyLight}`,
            fontFamily: bodyFont,
            fontSize: 44,
            color: C.bg,
            opacity: t >= questionAt ? 1 : 0,
          }}
        >
          {question}
        </div>
        {t >= answerAt ? (
          <div
            style={{
              alignSelf: "flex-end",
              maxWidth: 560,
              padding: "16px 24px",
              backgroundColor: C.green,
              boxShadow: `6px 6px 0 ${C.greenDark}`,
              fontFamily: bodyFont,
              fontSize: 44,
              color: C.night,
            }}
          >
            <Typewriter text={answer} startFrame={answerAt} charsPerFrame={1} cursorColor={C.night} />
          </div>
        ) : null}
        <div style={{ alignSelf: "flex-end", opacity: t >= answerAt + 1.4 * fps ? 1 : 0 }}>
          <Tag bg={C.navyMid} color={C.white} style={{ fontSize: 16 }}>SUMBER: SOP TOKO</Tag>
        </div>
      </PixelBox>

      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 90 }}>
        <p
          style={{
            ...body,
            textAlign: "center",
            opacity: interpolate(t, [3.4 * fps, 3.8 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          {caption}
        </p>
      </AbsoluteFill>
      <CrtOverlay />
    </>
  );
};

const aiSchema = {
  level: { type: "string", default: "LEVEL 5: TANYA AI", description: "Level label" },
  title: { type: "string", default: "", description: "Title" },
  question: { type: "string", default: "", description: "Customer question" },
  answer: { type: "string", default: "", description: "AI answer" },
  caption: { type: "string", default: "", description: "Caption" },
} as const satisfies InteractivitySchema;

export const AiScene = Interactive.withSchema({
  Component: AiInner,
  componentName: "AiScene",
  schema: aiSchema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
