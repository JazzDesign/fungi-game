import { gamepadInput } from "../input.js";
import { bgMusic } from "../bgMusic.js";
import { settings } from "../settings.js";

/**
 * Capas de fondo con parallax, cámara sigue al personaje.
 * Controles: teclado + gamepad virtual (D-pad L/R, A=jump, B=laugh, Y=surprise).
 */
const WALK_SPEED = 280;
const SPRITE_SIZE = 120;
const LAUGH_SHAKE = 2;
const LEVEL_WIDTH = 16000;
const BG_TILE_WIDTH = 1600;
const MUSHROOMS_NEEDED = 14;
const MUSHROOM_SCALE = 1.5;
const ENEMY_SCALE = 0.55;
const GROUND_Y = 290;

// Posiciones de los 14 honguitos (último casi al final)
const MUSHROOM_POSITIONS = [
  { x: 300, type: "m1" },
  { x: 1400, type: "m2" },
  { x: 2600, type: "m1" },
  { x: 3800, type: "m2" },
  { x: 5000, type: "m1" },
  { x: 6200, type: "m2" },
  { x: 7400, type: "m1" },
  { x: 8600, type: "m2" },
  { x: 9800, type: "m1" },
  { x: 11000, type: "m2" },
  { x: 12200, type: "m1" },
  { x: 13400, type: "m2" },
  { x: 14600, type: "m1" },
  { x: 15800, type: "m2" },
];

const ENEMY_POSITIONS = [2500, 5500, 9000, 13000];

const VOL_EFFECTS = 0.03;
const SOUND_SEEK = 0; // 0 = sonido completo desde el inicio (más responsive)

scene("walk", () => {
  if (audioCtx?.state === "suspended") audioCtx.resume();

  let laughSoundHandle = null;

  // Capas de fondo con parallax - 2 sprites por capa para tilear (repetición infinita)
  const bgClouds1 = add([
    sprite("bg-clouds"),
    pos(0, 0),
    anchor("topleft"),
    fixed(),
    z(-3),
  ]);
  const bgClouds2 = add([
    sprite("bg-clouds"),
    pos(BG_TILE_WIDTH, 0),
    anchor("topleft"),
    fixed(),
    z(-3),
  ]);
  const bgTrees1 = add([
    sprite("bg-trees"),
    pos(0, 0),
    anchor("topleft"),
    fixed(),
    z(-2),
  ]);
  const bgTrees2 = add([
    sprite("bg-trees"),
    pos(BG_TILE_WIDTH, 0),
    anchor("topleft"),
    fixed(),
    z(-2),
  ]);
  const bgGround1 = add([
    sprite("bg-ground"),
    pos(0, 0),
    anchor("topleft"),
    fixed(),
    z(-1),
  ]);
  const bgGround2 = add([
    sprite("bg-ground"),
    pos(BG_TILE_WIDTH, 0),
    anchor("topleft"),
    fixed(),
    z(-1),
  ]);

  // Gradiente cielo (celeste arriba → más claro abajo)
  add([
    pos(0, 0),
    anchor("topleft"),
    fixed(),
    z(-10),
    {
      draw() {
        drawRect({
          width: width(),
          height: height(),
          pos: vec2(0, 0),
          anchor: "topleft",
          gradient: [rgb(135, 206, 250), rgb(176, 224, 230)],
          horizontal: false,
          fixed: true,
        });
      },
    },
  ]);

  const character = add([
    sprite("walks", { animSpeed: 1 }),
    pos(50, GROUND_Y),
    anchor("center"),
    scale(SPRITE_SIZE / 250),
    area({ scale: 0.7 }),
    "character",
  ]);

  character.play("idle");

  // Honguitos recolectables 64×64 (m1 y m2 alternados) - misma Y que el player
  MUSHROOM_POSITIONS.forEach(({ x, type: spriteType }) => {
    add([
      sprite(spriteType),
      pos(x, GROUND_Y + 20),
      anchor("center"),
      scale(MUSHROOM_SCALE),
      area({ scale: 0.8 }),
      "mushroom",
    ]);
  });

  // Enemigos 64×64 - decorativos, sin colisión con el player
  ENEMY_POSITIONS.forEach((x) => {
    add([
      sprite("e1"),
      pos(x, GROUND_Y + 50),
      anchor("center"),
      scale(ENEMY_SCALE),
      "enemy",
    ]);
  });

  let isLaughing = false;
  let isJumping = false;
  let isSurprised = false;
  let isPaused = false;
  let gameOver = false;
  let gameWon = false;
  let mushroomCount = 0;
  let basePos = vec2(50, GROUND_Y);

  let pausedText = null;
  let winTextObj = null;
  let scoreText = null;
  let typewriterIndex = 0;
  const WIN_FULL_TEXT = "🍄 ✨ Te quiero decir que te valoro mucho por cómo sos, por tus gustos, tus pasiones y tus intereses! Seguí siendo así de cool, así de única y así de genial como sos! ✨\n\nFeliz día del cariño ❤️ 🍄";

  // HUD: contador de honguitos - cintillo ancho desde el borde, texto centrado
  let scoreBg = null;
  const updateScoreHUD = () => {
    if (scoreBg) destroy(scoreBg);
    if (scoreText) destroy(scoreText);
    const bannerH = 40;
    scoreBg = add([
      rect(width(), bannerH),
      pos(0, 0),
      anchor("topleft"),
      color(0, 0, 0, 0.5),
      fixed(),
      z(49),
    ]);
    scoreText = add([
      text(`Honguitos: ${mushroomCount}/${MUSHROOMS_NEEDED}`, {
        size: 12,
        font: "Merriweather",
      }),
      pos(width() / 2, bannerH / 2),
      anchor("center"),
      color(255, 255, 255),
      fixed(),
      z(50),
    ]);
  };

  character.onCollide("mushroom", (m) => {
    if (gameOver || gameWon) return;
    if (!settings.collectMuted) play("collect", { volume: VOL_EFFECTS, seek: SOUND_SEEK });
    destroy(m);
    mushroomCount += 2;
    updateScoreHUD();
    if (mushroomCount >= MUSHROOMS_NEEDED) {
      gameWon = true;
      typewriterIndex = 0;
      add([
        rect(width(), height()),
        pos(0, 0),
        anchor("topleft"),
        color(0, 0, 0),
        opacity(0.6),
        fixed(),
        z(95),
      ]);
      winTextObj = add([
        text("", {
          size: 18,
          width: 520,
          align: "center",
          lineSpacing: 10,
        }),
        pos(width() / 2, height() / 2 - 30),
        anchor("center"),
        color(255, 255, 255),
        fixed(),
        z(100),
      ]);
      add([
        text("Press START para volver a comenzar", { size: 14 }),
        pos(width() / 2, height() / 2 + 80),
        anchor("center"),
        color(255, 255, 255),
        fixed(),
        z(100),
      ]);
    }
  });

  updateScoreHUD();

  onUpdate(() => {
    // Cámara sigue al personaje (centrada en X)
    const camX = Math.max(400, Math.min(character.pos.x, LEVEL_WIDTH - 400));
    camPos(camX, 200);

    // Parallax con tileo: nubes 0.2x, árboles 0.5x, suelo 1x
    const tileOffset = (factor) => {
      const x = -camX * factor;
      return ((x % BG_TILE_WIDTH) + BG_TILE_WIDTH) % BG_TILE_WIDTH;
    };
    const offClouds = tileOffset(0.2);
    const offTrees = tileOffset(0.5);
    const offGround = tileOffset(1);
    bgClouds1.pos.x = offClouds - BG_TILE_WIDTH;
    bgClouds2.pos.x = offClouds;
    bgTrees1.pos.x = offTrees - BG_TILE_WIDTH;
    bgTrees2.pos.x = offTrees;
    bgGround1.pos.x = offGround - BG_TILE_WIDTH;
    bgGround2.pos.x = offGround;

    const pause = isKeyDown("escape") || gamepadInput.pause;
    const start = isKeyDown("enter") || gamepadInput.start;

    // Start para reiniciar si game over o ganó
    if ((gameOver || gameWon) && start) {
      gamepadInput.start = false;
      go("walk");
      return;
    }

    const shouldTogglePause = pause || (isPaused && start);
    if (shouldTogglePause) {
      if (pause) gamepadInput.pause = false;
      if (start) gamepadInput.start = false;
      isPaused = !isPaused;
      if (isPaused) {
        bgMusic.pause();
        pausedText = add([
          text("PAUSED", { size: 20 }),
          pos(400, 200),
          anchor("center"),
          fixed(),
          z(100),
        ]);
      } else if (pausedText) {
        bgMusic.resume();
        destroy(pausedText);
        pausedText = null;
      }
    }

    if (isPaused || gameOver) return;

    // Efecto máquina de escribir en pantalla de victoria
    if (gameWon && winTextObj) {
      typewriterIndex += 25 * dt();
      const charsToShow = Math.min(Math.floor(typewriterIndex), WIN_FULL_TEXT.length);
      winTextObj.text = WIN_FULL_TEXT.substring(0, charsToShow);
    }

    if (gameWon) return;

    const jump = isKeyDown("space") || gamepadInput.jump;
    const laugh = isKeyDown("j") || gamepadInput.laugh;
    const surprise = isKeyDown("o") || gamepadInput.surprise;
    const left = isKeyDown("left") || gamepadInput.left;
    const right = isKeyDown("right") || gamepadInput.right;

    if (jump) {
      if (!isJumping) {
        isJumping = true;
        if (laughSoundHandle) { laughSoundHandle.stop(); laughSoundHandle = null; }
        basePos = character.pos.clone();
        character.use(sprite("jump", { animSpeed: 1 }));
        character.play("jump");
        if (!settings.gabrielaMuted) play("jump", { volume: VOL_EFFECTS, seek: SOUND_SEEK });
      }
      // Permitir movimiento horizontal mientras salta
      if (right) {
        character.flipX = false;
        character.pos.x = Math.min(LEVEL_WIDTH - 50, character.pos.x + WALK_SPEED * dt());
      } else if (left) {
        character.flipX = true;
        character.pos.x = Math.max(50, character.pos.x - WALK_SPEED * dt());
      }
      basePos.x = character.pos.x;
      character.pos.y = basePos.y - 50;
    } else if (surprise) {
      if (isJumping) isJumping = false;
      if (laughSoundHandle) { laughSoundHandle.stop(); laughSoundHandle = null; }
      if (!isSurprised) {
        isSurprised = true;
        basePos = character.pos.clone();
        character.use(sprite("surprise", { animSpeed: 1 }));
        character.play("surprise");
        if (!settings.gabrielaMuted) play("surprised", { volume: VOL_EFFECTS, seek: SOUND_SEEK });
      }
      character.pos.x = basePos.x;
      character.pos.y = basePos.y;
    } else if (laugh) {
      if (isJumping) isJumping = false;
      if (isSurprised) isSurprised = false;
      if (!isLaughing) {
        isLaughing = true;
        basePos = character.pos.clone();
        character.use(sprite("laugh", { animSpeed: 1 }));
        character.play("laugh");
        if (laughSoundHandle) laughSoundHandle.stop();
        if (!settings.gabrielaMuted) laughSoundHandle = play("laugh", { loop: true, volume: VOL_EFFECTS, seek: SOUND_SEEK });
      }
      character.pos.x = basePos.x;
      character.pos.y = basePos.y + wave(-LAUGH_SHAKE, LAUGH_SHAKE, time() * 12);
    } else {
      if (isJumping) {
        isJumping = false;
        character.pos.x = basePos.x;
        character.pos.y = basePos.y;
        character.use(sprite("walks", { animSpeed: 1 }));
      }
      if (isSurprised) {
        isSurprised = false;
        character.pos.x = basePos.x;
        character.pos.y = basePos.y;
        character.use(sprite("walks", { animSpeed: 1 }));
      }
      if (isLaughing) {
        isLaughing = false;
        if (laughSoundHandle) { laughSoundHandle.stop(); laughSoundHandle = null; }
        character.pos.x = basePos.x;
        character.pos.y = basePos.y;
        character.use(sprite("walks", { animSpeed: 1 }));
      }
      basePos = character.pos.clone();
      if (right) {
        character.flipX = false;
        if (character.curAnim() !== "walk") character.play("walk");
        character.pos.x = Math.min(LEVEL_WIDTH - 50, character.pos.x + WALK_SPEED * dt());
      } else if (left) {
        character.flipX = true;
        if (character.curAnim() !== "walk") character.play("walk");
        character.pos.x = Math.max(50, character.pos.x - WALK_SPEED * dt());
      } else {
        if (character.curAnim() !== "idle") character.play("idle");
      }
    }
  });
});
