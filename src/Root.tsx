import { Composition, Folder } from "remotion";
import { MyComposition } from "./Composition";
import { PromoVideo } from "./promo/PromoVideo";
import { AiScene } from "./promo/scenes/AiScene";
import { BroadcastScene } from "./promo/scenes/BroadcastScene";
import { ChannelsScene } from "./promo/scenes/ChannelsScene";
import { FlowScene } from "./promo/scenes/FlowScene";
import { InboxScene } from "./promo/scenes/InboxScene";
import { IntroScene } from "./promo/scenes/IntroScene";
import { OutroScene } from "./promo/scenes/OutroScene";
import { ProblemScene } from "./promo/scenes/ProblemScene";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <Composition
        id="PromoWAPlatform"
        component={PromoVideo}
        durationInFrames={1410}
        fps={30}
        width={1920}
        height={1080}
      />
      <Folder name="Promo-Scenes">
        <Composition
          id="Intro"
          component={IntroScene}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ title: "WA PLATFORM", tagline: "Inbox, flow & broadcast untuk banyak nomor WhatsApp" }}
        />
        <Composition
          id="Masalah"
          component={ProblemScene}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            level: "LEVEL 1: CHAOS",
            title: "Banyak nomor. Ratusan chat.",
            caption: "Tim CS lompat-lompat antar HP, chat pelanggan terlewat.",
          }}
        />
        <Composition
          id="MultiNomor"
          component={ChannelsScene}
          durationInFrames={165}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            level: "LEVEL 2: MULTI NOMOR",
            title: "Semua nomor, satu dashboard",
            caption: "Hubungkan banyak nomor WhatsApp Business sekaligus.",
          }}
        />
        <Composition
          id="Inbox"
          component={InboxScene}
          durationInFrames={210}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            level: "LEVEL 3: SHARED INBOX",
            title: "Satu inbox untuk seluruh tim",
            customerMessage: "Kak, pesanan #1042 udah dikirim?",
            agentReply: "Sudah kak! Resi JNE: JX1042",
            caption: "Balas realtime, beri label, bagi ke agen yang tepat.",
          }}
        />
        <Composition
          id="FlowBuilder"
          component={FlowScene}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            level: "LEVEL 4: FLOW BUILDER",
            title: "Rakit bot, drag & drop",
            caption: "Bot jalan 24 jam, tanpa nulis kode.",
          }}
        />
        <Composition
          id="TanyaAI"
          component={AiScene}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            level: "LEVEL 5: TANYA AI",
            title: "AI yang paham SOP kamu",
            question: "Jam buka toko kapan?",
            answer: "Senin-Sabtu, 08.00-17.00 kak!",
            caption: "Jawaban diambil dari dokumen di Basis Pengetahuan.",
          }}
        />
        <Composition
          id="Broadcast"
          component={BroadcastScene}
          durationInFrames={165}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            level: "LEVEL 6: BROADCAST",
            title: "Satu klik, ribuan kontak",
            caption: "Kirim template ke banyak kontak, antre aman per nomor.",
            total: 12480,
          }}
        />
        <Composition
          id="Outro"
          component={OutroScene}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ title: "WA PLATFORM", tagline: "Level up layanan WhatsApp tim kamu.", cta: "PRESS START" }}
        />
      </Folder>
    </>
  );
};
