import { gamepadInput } from "../input.js";

/**
 * Pantalla de inicio con título. Start inicia el juego.
 */
scene("start", () => {
  add([
    sprite("title"),
    pos(400, 200),
    anchor("center"),
    scale(0.9),
  ]);

  onUpdate(() => {
    const start = isKeyDown("enter") || gamepadInput.start;
    if (start) {
      gamepadInput.start = false;
      go("walk");
    }
  });
});
