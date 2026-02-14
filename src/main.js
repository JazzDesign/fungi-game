import kaboom from "kaboom";
import { loadAssets } from "./loadAssets.js";
import { setupGamepad } from "./gamepad.js";
import { bgMusic } from "./bgMusic.js";

kaboom({
  global: true,
  font: "Merriweather",
  width: 800,
  height: 400,
  scale: 1,
  stretch: false,
  debug: true,
  background: [135, 206, 250],
  root: document.querySelector("#screen-inner") ?? document.body,
});
 
setupGamepad(document.querySelector(".gameboy"));

await loadAssets();

let songStarted = false;
const startSong = () => {
  if (songStarted) return;
  songStarted = true;
  if (typeof audioCtx !== "undefined" && audioCtx.state === "suspended") audioCtx.resume();
  bgMusic.setSong(play("song", { loop: true, volume: 0.5 }));
  const forest = getSound("forest");
  if (forest?.data?.buf && audioCtx) {
    const src = audioCtx.createBufferSource();
    src.buffer = forest.data.buf;
    src.loop = true;
    const panner = audioCtx.createStereoPanner();
    panner.pan.value = -0.4;
    const gain = audioCtx.createGain();
    gain.gain.value = 0.05;
    src.connect(panner).connect(gain).connect(audioCtx.destination);
    src.start(0);
    bgMusic.setForest(src, audioCtx.currentTime);
  }
  bgMusic.applyMute();
};
window.__applyMute = () => bgMusic.applyMute();
const unlockEl = document.getElementById("audio-unlock");
if (unlockEl) {
  const unlockAndHide = () => {
    startSong();
    unlockEl.remove();
  };
  unlockEl.addEventListener("click", unlockAndHide, { once: true });
  unlockEl.addEventListener("touchstart", unlockAndHide, { once: true });
}
document.addEventListener("click", startSong, { once: true });
document.addEventListener("keydown", startSong, { once: true });
document.addEventListener("touchstart", startSong, { once: true, passive: true });
document.addEventListener("touchend", startSong, { once: true, passive: true });

await import("./scenes/start.js");
await import("./scenes/walk.js");

go("start");
