import { SPEED, JUMP_FORCE, SCORE_TO_WIN } from "../config.js";

/**
 * Escena: Juego principal
 */
scene("game", () => {
  let score = 0;

  add([
    sprite("background", { width: width(), height: height() }),
    pos(0, 0),
    z(-10),
  ]);

  const player = add([
    sprite("player"),
    pos(100, height() - 150),
    area({ scale: 0.8 }),
    body(),
    anchor("center"),
    "player",
  ]);

  player.play("run");

  add([
    rect(width(), 48),
    pos(0, height() - 48),
    area(),
    body({ isStatic: true }),
    color(0, 0, 0),
    opacity(0),
    "ground",
  ]);

  function jump() {
    if (player.isGrounded()) {
      player.jump(JUMP_FORCE);
      player.play("jump");
    }
  }

  onKeyPress("space", jump);
  onClick(jump);

  player.onGround(() => {
    player.play("run");
  });

  loop(1.5, () => {
    const xPos = width() + 50;
    const esMalo = choose([true, false, false]);

    if (esMalo) {
      add([
        sprite("rock"),
        area({ scale: 0.6 }),
        pos(xPos, height() - 100),
        anchor("botleft"),
        move(LEFT, SPEED),
        offscreen({ destroy: true }),
        "danger",
      ]);
    } else {
      add([
        sprite("mushroom"),
        area(),
        pos(xPos, height() - 150 - rand(0, 150)),
        anchor("center"),
        move(LEFT, SPEED),
        offscreen({ destroy: true }),
        "point",
      ]);
    }
  });

  player.onCollide("point", (mushroom) => {
    destroy(mushroom);
    score++;
    scoreLabel.text = "Hongos: " + score + "/" + SCORE_TO_WIN;
    shake(5);

    if (score >= SCORE_TO_WIN) {
      wait(0.5, () => go("win"));
    }
  });

  player.onCollide("danger", (rock) => {
    destroy(rock);
    shake(20);
  });

  const scoreLabel = add([
    text("Hongos: 0/" + SCORE_TO_WIN),
    pos(24, 24),
    color(255, 255, 255),
    outline(2, rgb(0, 0, 0)),
  ]);
});
