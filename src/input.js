/**
 * Estado compartido del gamepad virtual.
 * Usado por los botones HTML y por la escena walk.
 */
export const gamepadInput = {
  left: false,
  right: false,
  jump: false,
  laugh: false,
  surprise: false,
  start: false,
  pause: false,
};

export function isInputDown(input) {
  return gamepadInput[input] ?? false;
}
