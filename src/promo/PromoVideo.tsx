import { TransitionSeries } from "@remotion/transitions";
import { useVideoConfig } from "remotion";
import { PixelWipe } from "./pixel";
import { AiScene } from "./scenes/AiScene";
import { BroadcastScene } from "./scenes/BroadcastScene";
import { ChannelsScene } from "./scenes/ChannelsScene";
import { FlowScene } from "./scenes/FlowScene";
import { InboxScene } from "./scenes/InboxScene";
import { IntroScene } from "./scenes/IntroScene";
import { OutroScene } from "./scenes/OutroScene";
import { ProblemScene } from "./scenes/ProblemScene";

export const PromoVideo = () => {
  const { fps } = useVideoConfig();

  return (
    <TransitionSeries name="Promo">
      <TransitionSeries.Sequence name="Intro" durationInFrames={150} premountFor={fps}>
        <IntroScene title="WA PLATFORM" tagline="Inbox, flow & broadcast untuk banyak nomor WhatsApp" />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={16} premountFor={fps}>
        <PixelWipe />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="Masalah" durationInFrames={150} premountFor={fps}>
        <ProblemScene
          level="LEVEL 1: CHAOS"
          title="Banyak nomor. Ratusan chat."
          caption="Tim CS lompat-lompat antar HP, chat pelanggan terlewat."
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={16} premountFor={fps}>
        <PixelWipe />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="Multi nomor" durationInFrames={165} premountFor={fps}>
        <ChannelsScene
          level="LEVEL 2: MULTI NOMOR"
          title="Semua nomor, satu dashboard"
          caption="Hubungkan banyak nomor WhatsApp Business sekaligus."
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={16} premountFor={fps}>
        <PixelWipe />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="Inbox" durationInFrames={210} premountFor={fps}>
        <InboxScene
          level="LEVEL 3: SHARED INBOX"
          title="Satu inbox untuk seluruh tim"
          customerMessage="Kak, pesanan #1042 udah dikirim?"
          agentReply="Sudah kak! Resi JNE: JX1042"
          caption="Balas realtime, beri label, bagi ke agen yang tepat."
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={16} premountFor={fps}>
        <PixelWipe />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="Flow builder" durationInFrames={240} premountFor={fps}>
        <FlowScene
          level="LEVEL 4: FLOW BUILDER"
          title="Rakit bot, drag & drop"
          caption="Bot jalan 24 jam, tanpa nulis kode."
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={16} premountFor={fps}>
        <PixelWipe />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="Tanya AI" durationInFrames={180} premountFor={fps}>
        <AiScene
          level="LEVEL 5: TANYA AI"
          title="AI yang paham SOP kamu"
          question="Jam buka toko kapan?"
          answer="Senin-Sabtu, 08.00-17.00 kak!"
          caption="Jawaban diambil dari dokumen di Basis Pengetahuan."
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={16} premountFor={fps}>
        <PixelWipe />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="Broadcast" durationInFrames={165} premountFor={fps}>
        <BroadcastScene
          level="LEVEL 6: BROADCAST"
          title="Satu klik, ribuan kontak"
          caption="Kirim template ke banyak kontak, antre aman per nomor."
          total={12480}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={16} premountFor={fps}>
        <PixelWipe />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="Outro" durationInFrames={150} premountFor={fps}>
        <OutroScene title="WA PLATFORM" tagline="Level up layanan WhatsApp tim kamu." cta="PRESS START" />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
