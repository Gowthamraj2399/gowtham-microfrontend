// Driving input, shared by the keyboard handler (Car.js) and the on-screen
// touch pad (hud/RoamControls.js). Plain mutable object: read every frame.
export const input = { up: false, down: false, left: false, right: false, brake: false, boost: false };

export const resetInput = () => Object.keys(input).forEach((k) => (input[k] = false));

const keyMap = {
  ArrowUp: "up",
  KeyW: "up",
  ArrowDown: "down",
  KeyS: "down",
  ArrowLeft: "left",
  KeyA: "left",
  ArrowRight: "right",
  KeyD: "right",
  Space: "brake",
  ShiftLeft: "boost",
  ShiftRight: "boost",
};

export const bindKeyboard = (onRespawn) => {
  const set = (value) => (e) => {
    const key = keyMap[e.code];
    if (key) {
      input[key] = value;
      e.preventDefault();
    } else if (value && e.code === "KeyR") onRespawn();
  };
  const down = set(true);
  const up = set(false);
  window.addEventListener("keydown", down);
  window.addEventListener("keyup", up);
  window.addEventListener("blur", resetInput);
  return () => {
    window.removeEventListener("keydown", down);
    window.removeEventListener("keyup", up);
    window.removeEventListener("blur", resetInput);
    resetInput();
  };
};
