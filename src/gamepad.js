import { gamepadInput } from "./input.js";

/**
 * Configura los handlers del gamepad (botones con data-input).
 */
export function setupGamepad(container) {
  const btnMapping = {
    left: "left",
    right: "right",
    jump: "jump",
    laugh: "laugh",
    surprise: "surprise",
    start: "start",
    pause: "pause",
  };

  const buttons = container.querySelectorAll("[data-input]");
  buttons.forEach((btn) => {
    const input = btn.getAttribute("data-input");
    if (!input || !btnMapping[input]) return;

    const setDown = (down) => {
      gamepadInput[input] = down;
    };

    btn.addEventListener("mousedown", (e) => {
      e.preventDefault();
      setDown(true);
    });
    btn.addEventListener("mouseup", () => setDown(false));
    btn.addEventListener("mouseleave", () => setDown(false));

    btn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      setDown(true);
    });
    btn.addEventListener("touchend", (e) => {
      e.preventDefault();
      setDown(false);
    });
    btn.addEventListener("touchcancel", () => setDown(false));
  });
}
