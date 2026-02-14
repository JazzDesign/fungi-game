// BASE_URL: "/" en dev, "/fungi-game/" en prod (vite.config)
const BASE = (typeof import.meta !== "undefined" && import.meta.env?.BASE_URL) || "/";

/**
 * Carga sprites y sonidos. Retorna una promesa que se resuelve cuando todos están listos.
 */
export function loadAssets() {
  const laughSnd = loadSound("laugh", `${BASE}sounds/laugh.wav`);
  const surprisedSnd = loadSound("surprised", `${BASE}sounds/surprised.wav`);
  const songSnd = loadSound("song", `${BASE}sounds/song.wav`);
  const forestSnd = loadSound("forest", `${BASE}sounds/forest.wav`);
  const collectSnd = loadSound("collect", `${BASE}sounds/collect.wav`);
  const jumpSnd = loadSound("jump", `${BASE}sounds/jump.wav`);

  const walksAsset = loadSprite("walks", `${BASE}sprites/walks.png`, {
    sliceX: 5,
    sliceY: 1,
    anims: {
      idle: { from: 0, to: 0 },
      walk: { from: 1, to: 3, loop: true, speed: 12 },
    },
  });

  const laughAsset = loadSprite("laugh", `${BASE}sprites/laugh.png`, {
    sliceX: 1,
    sliceY: 1,
    anims: { laugh: 0 },
  });

  const jumpAsset = loadSprite("jump", `${BASE}sprites/jump.png`, {
    sliceX: 1,
    sliceY: 1,
    anims: { jump: 0 },
  });

  const surpriseAsset = loadSprite("surprise", `${BASE}sprites/surprise.png`, {
    sliceX: 1,
    sliceY: 1,
    anims: { surprise: 0 },
  });

  const titleAsset = loadSprite("title", `${BASE}sprites/title.png`);

  const bgGroundAsset = loadSprite("bg-ground", `${BASE}sprites/background/bg-ground.png`);
  const bgCloudsAsset = loadSprite("bg-clouds", `${BASE}sprites/background/bg-clouds.png`);
  const bgTreesAsset = loadSprite("bg-trees", `${BASE}sprites/background/bg-threes.png`);

  const m1Asset = loadSprite("m1", `${BASE}sprites/elements/m1.png`);
  const m2Asset = loadSprite("m2", `${BASE}sprites/elements/m2.png`);
  const e1Asset = loadSprite("e1", `${BASE}sprites/elements/e1.png`);

  const soundLoaders = [laughSnd, surprisedSnd, songSnd, forestSnd, collectSnd, jumpSnd].map((a) =>
    a.loaded ? Promise.resolve() : new Promise((r) => a.onLoad(() => r()))
  );

  return Promise.all([
    ...soundLoaders,
    walksAsset.loaded
      ? Promise.resolve()
      : new Promise((resolve) => walksAsset.onLoad(() => resolve())),
    laughAsset.loaded
      ? Promise.resolve()
      : new Promise((resolve) => laughAsset.onLoad(() => resolve())),
    jumpAsset.loaded
      ? Promise.resolve()
      : new Promise((resolve) => jumpAsset.onLoad(() => resolve())),
    surpriseAsset.loaded
      ? Promise.resolve()
      : new Promise((resolve) => surpriseAsset.onLoad(() => resolve())),
    titleAsset.loaded
      ? Promise.resolve()
      : new Promise((resolve) => titleAsset.onLoad(() => resolve())),
    bgGroundAsset.loaded
      ? Promise.resolve()
      : new Promise((resolve) => bgGroundAsset.onLoad(() => resolve())),
    bgCloudsAsset.loaded
      ? Promise.resolve()
      : new Promise((resolve) => bgCloudsAsset.onLoad(() => resolve())),
    bgTreesAsset.loaded
      ? Promise.resolve()
      : new Promise((resolve) => bgTreesAsset.onLoad(() => resolve())),
    m1Asset.loaded
      ? Promise.resolve()
      : new Promise((resolve) => m1Asset.onLoad(() => resolve())),
    m2Asset.loaded
      ? Promise.resolve()
      : new Promise((resolve) => m2Asset.onLoad(() => resolve())),
    e1Asset.loaded
      ? Promise.resolve()
      : new Promise((resolve) => e1Asset.onLoad(() => resolve())),
  ]);
}
