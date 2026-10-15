import { loadFont as loadPressStart } from "@remotion/google-fonts/PressStart2P";
import { loadFont as loadVT323 } from "@remotion/google-fonts/VT323";

// Chunky display font for headings, VT323 for longer copy - both pixel fonts.
export const { fontFamily: pixelFont } = loadPressStart("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

export const { fontFamily: bodyFont } = loadVT323("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

// Navy and orange come from the claudewa dashboard palette (apps/web globals.css),
// green is the WhatsApp accent.
export const C = {
  night: "#0b1220",
  bg: "#141f32",
  bg2: "#223352",
  navy: "#2f466d",
  navyMid: "#4a6ba3",
  navyLight: "#86a3d1",
  sky: "#d9e3f1",
  cream: "#f0f4f9",
  orange: "#ff6f43",
  orangeDark: "#cb3c14",
  orangeLight: "#ffa78b",
  green: "#25d366",
  greenDark: "#128c4a",
  yellow: "#ffd84a",
  red: "#ff4d5e",
  white: "#ffffff",
  black: "#05080f",
  skin: "#f4c69b",
  hair: "#3b2a20",
} as const;

/** Snaps a frame to a low "animation frame rate" so motion looks like a retro sprite. */
export const stepped = (frame: number, fps: number, stepsPerSecond = 10) => {
  const step = fps / stepsPerSecond;
  return Math.floor(frame / step) * step;
};
