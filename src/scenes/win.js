/**
 * Escena: Victoria
 */
scene("win", () => {
  add([
    sprite("win_screen", { width: width(), height: height() }),
    pos(0, 0),
  ]);

  add([
    text("FELIZ DIA DEL CARINO", {
      size: 40,
      width: width() - 40,
      align: "center",
    }),
    pos(center().x, height() - 150),
    anchor("center"),
    color(255, 220, 100),
    outline(4, rgb(0, 0, 0)),
  ]);

  add([
    text("Eres mi cientifica favorita.", { size: 20 }),
    pos(center().x, height() - 80),
    anchor("center"),
    color(255, 255, 255),
    outline(2, rgb(0, 0, 0)),
  ]);

  onClick(() => go("game"));
});
