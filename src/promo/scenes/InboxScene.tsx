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

type InboxProps = {
  readonly level: string;
  readonly title: string;
  readonly customerMessage: string;
  readonly agentReply: string;
  readonly caption: string;
};

const CONVERSATIONS = [
  { name: "Budi S.", snippet: "Kak, pesanan #1042...", channel: "CS Utama", color: C.green },
  { name: "Rina", snippet: "Ada promo bulan ini?", channel: "Sales", color: C.orange },
  { name: "Toko Maju", snippet: "Mau order 50 pcs", channel: "Sales", color: C.yellow },
  { name: "Dewi", snippet: "Refund sudah masuk?", channel: "Support", color: C.navyLight },
  { name: "Andi", snippet: "Alamat cabang di mana?", channel: "Cabang", color: C.red },
];

const InboxInner: React.FC<InboxProps> = ({ level, title, customerMessage, agentReply, caption }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = stepped(frame, fps, 12);

  const customerAt = 1.1 * fps;
  const typingAt = 2 * fps;
  const replyAt = 3 * fps;
  const readAt = 5 * fps;

  return (
    <>
      <PixelBackground />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 90, gap: 28 }}>
        <Tag bg={C.green}>{level}</Tag>
        <h1 style={{ ...headline, fontSize: 56, textAlign: "center" }}>{title}</h1>
      </AbsoluteFill>

      <PixelBox
        bg={C.cream}
        border={C.navyLight}
        p={8}
        style={{
          position: "absolute",
          left: 210,
          top: 320,
          width: 1500,
          height: 590,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          translate: interpolate(t, [0, 0.5 * fps], ["0px 900px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <div style={{ height: 60, backgroundColor: C.navy, display: "flex", alignItems: "center", gap: 14, padding: "0 24px" }}>
          <div style={{ width: 18, height: 18, backgroundColor: C.red }} />
          <div style={{ width: 18, height: 18, backgroundColor: C.yellow }} />
          <div style={{ width: 18, height: 18, backgroundColor: C.green }} />
          <div style={{ fontFamily: pixelFont, fontSize: 22, color: C.white, marginLeft: 20 }}>INBOX</div>
        </div>

        <div style={{ flex: 1, display: "flex" }}>
          <div style={{ width: 500, backgroundColor: C.sky, borderRight: `6px solid ${C.navyLight}` }}>
            {CONVERSATIONS.map((c, i) => {
              const on = t >= 0.5 * fps + i * 3;
              const active = i === 0;
              return (
                <div
                  key={c.name}
                  style={{
                    height: 104,
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    padding: "0 20px",
                    backgroundColor: active ? C.white : "transparent",
                    borderBottom: `4px solid ${C.navyLight}55`,
                    opacity: on ? 1 : 0,
                  }}
                >
                  <div style={{ width: 54, height: 54, backgroundColor: c.color, boxShadow: `4px 4px 0 ${C.navy}` }} />
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: pixelFont, fontSize: 18, color: C.bg }}>{c.name}</span>
                      <span style={{ fontFamily: bodyFont, fontSize: 26, color: C.white, backgroundColor: C.navyMid, padding: "0 8px" }}>{c.channel}</span>
                    </div>
                    <div style={{ fontFamily: bodyFont, fontSize: 32, color: C.navy, whiteSpace: "nowrap" }}>{c.snippet}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ flex: 1, position: "relative", padding: 36, display: "flex", flexDirection: "column", gap: 28 }}>
            <div
              style={{
                alignSelf: "flex-start",
                maxWidth: 680,
                padding: "18px 26px",
                backgroundColor: C.white,
                boxShadow: `6px 6px 0 ${C.navyLight}`,
                fontFamily: bodyFont,
                fontSize: 44,
                color: C.bg,
                opacity: t >= customerAt ? 1 : 0,
              }}
            >
              {customerMessage}
            </div>

            {t >= typingAt && t < replyAt ? (
              <div style={{ alignSelf: "flex-end", fontFamily: bodyFont, fontSize: 36, color: C.navyMid }}>
                Agen A sedang mengetik{".".repeat((Math.floor(frame / 6) % 3) + 1)}
              </div>
            ) : null}

            {t >= replyAt ? (
              <div
                style={{
                  alignSelf: "flex-end",
                  maxWidth: 680,
                  padding: "18px 26px",
                  backgroundColor: C.green,
                  boxShadow: `6px 6px 0 ${C.greenDark}`,
                  fontFamily: bodyFont,
                  fontSize: 44,
                  color: C.night,
                }}
              >
                <Typewriter text={agentReply} startFrame={replyAt} charsPerFrame={1} cursorColor={C.night} />
              </div>
            ) : null}

            <div style={{ alignSelf: "flex-end", display: "flex", gap: 4, opacity: t >= readAt ? 1 : 0 }}>
              <Sprite sprite="check" size={4} palette={{ G: C.navyMid }} />
              <Sprite sprite="check" size={4} palette={{ G: C.navyMid }} />
            </div>

            <div style={{ position: "absolute", left: 36, bottom: 30, opacity: t >= readAt ? 1 : 0 }}>
              <Tag bg={C.orange} style={{ fontSize: 18 }}>LABEL: PENGIRIMAN</Tag>
            </div>
          </div>
        </div>
      </PixelBox>

      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 70 }}>
        <p
          style={{
            ...body,
            textAlign: "center",
            opacity: interpolate(t, [1.5 * fps, 2 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          {caption}
        </p>
      </AbsoluteFill>
      <CrtOverlay />
    </>
  );
};

const inboxSchema = {
  level: { type: "string", default: "LEVEL 3: SHARED INBOX", description: "Level label" },
  title: { type: "string", default: "", description: "Title" },
  customerMessage: { type: "string", default: "", description: "Customer message" },
  agentReply: { type: "string", default: "", description: "Agent reply" },
  caption: { type: "string", default: "", description: "Caption" },
} as const satisfies InteractivitySchema;

export const InboxScene = Interactive.withSchema({
  Component: InboxInner,
  componentName: "InboxScene",
  schema: inboxSchema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
