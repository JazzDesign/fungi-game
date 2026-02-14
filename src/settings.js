const PREFIX = "mision-honguitos-";

function get(key) {
  return localStorage.getItem(PREFIX + key) === "1";
}
function set(key, v) {
  localStorage.setItem(PREFIX + key, v ? "1" : "0");
}

export const settings = {
  get songMuted() { return get("song"); },
  set songMuted(v) { set("song", v); },
  get forestMuted() { return get("forest"); },
  set forestMuted(v) { set("forest", v); },
  get gabrielaMuted() { return get("gabriela"); },
  set gabrielaMuted(v) { set("gabriela", v); },
  get collectMuted() { return get("collect"); },
  set collectMuted(v) { set("collect", v); },
  get muted() {
    return this.songMuted && this.forestMuted && this.gabrielaMuted && this.collectMuted;
  },
};
