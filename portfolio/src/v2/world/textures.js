import { useEffect, useMemo, useState } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";

// All in-world text is drawn to canvases with the page's own web fonts, so the
// 3D signs match the HUD and no extra font files are downloaded.

export const useFontsReady = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    Promise.all([
      document.fonts.load('96px "Anton"'),
      document.fonts.load('700 32px "JetBrains Mono"'),
      document.fonts.load('600 32px "Space Grotesk"'),
    ])
      .catch(() => {})
      .finally(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, []);
  return ready;
};

export const canvasTexture = (w, h, draw) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
  return t;
};

// Memoized texture that is disposed when the component unmounts.
export const useCanvasTexture = (w, h, draw, deps) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tex = useMemo(() => canvasTexture(w, h, draw), deps);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
};

const fitText = (ctx, text, font, maxW, startPx) => {
  let px = startPx;
  do {
    ctx.font = font.replace("{px}", px);
    px -= 4;
  } while (ctx.measureText(text).width > maxW && px > 12);
};

// Neon sign: transparent background, glowing display text.
export const drawNeon = ({ title, sub, color = "#FF3D7F" }) => (ctx, w, h) => {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  fitText(ctx, title.toUpperCase(), '{px}px "Anton"', w * 0.92, sub ? h * 0.5 : h * 0.78);
  // Crisp text; the bloom pass adds the glow.
  const ty = sub ? h * 0.33 : h * 0.52;
  ctx.fillStyle = color;
  ctx.fillText(title.toUpperCase(), w / 2, ty);
  if (sub) {
    // Sub-line large enough to read from the tour camera (was 16% of the height).
    fitText(ctx, sub.toUpperCase(), '700 {px}px "JetBrains Mono"', w * 0.92, h * 0.24);
    ctx.fillStyle = "#2EE6D6";
    ctx.fillText(sub.toUpperCase(), w / 2, h * 0.78);
  }
};

// Plaque: an opaque dark panel with a coloured border, a title and a large
// sub-line. For labels mounted on busy surfaces (lit windows), where
// transparent neon text gets lost.
export const drawPlaque = ({ title, sub, color = "#FFD23F" }) => (ctx, w, h) => {
  const r = h * 0.12;
  const line = h * 0.045;
  ctx.fillStyle = "#0b0b1e";
  ctx.beginPath();
  ctx.roundRect(line, line, w - line * 2, h - line * 2, r);
  ctx.fill();
  ctx.lineWidth = line;
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  fitText(ctx, title.toUpperCase(), '{px}px "Anton"', w * 0.86, h * 0.42);
  ctx.fillStyle = color;
  ctx.fillText(title.toUpperCase(), w / 2, h * 0.36);
  if (sub) {
    fitText(ctx, sub.toUpperCase(), '700 {px}px "JetBrains Mono"', w * 0.86, h * 0.2);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(sub.toUpperCase(), w / 2, h * 0.72);
  }
};

// Billboard: solid poster card with a title and a list of lines.
export const drawBillboard = ({ title, lines = [], color = "#FF3D7F", tag }) => (ctx, w, h) => {
  ctx.fillStyle = "#0B0B1E";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, w, h * 0.06);
  const pad = w * 0.06;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  if (tag) {
    ctx.font = `700 ${Math.round(h * 0.07)}px "JetBrains Mono"`;
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.fillText(tag.toUpperCase(), pad, h * 0.11);
  }
  fitText(ctx, title.toUpperCase(), '{px}px "Anton"', w - pad * 2, Math.round(h * 0.2));
  ctx.fillStyle = color;
  ctx.fillText(title.toUpperCase(), pad, h * 0.2);
  // Lines sized to stay readable on phones (were 7.5% of the board height).
  ctx.font = `600 ${Math.round(h * 0.098)}px "Space Grotesk"`;
  ctx.fillStyle = "#f5f3ff";
  lines.slice(0, 4).forEach((line, i) => ctx.fillText(line, pad, h * (0.45 + i * 0.125)));
};

// Striped synthwave sun with transparent gaps.
export const sunTexture = () =>
  canvasTexture(512, 512, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#FFD23F");
    g.addColorStop(1, "#FF3D7F");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "destination-out";
    [
      [0.58, 0.03],
      [0.66, 0.04],
      [0.76, 0.05],
      [0.87, 0.06],
    ].forEach(([y, hh]) => ctx.fillRect(0, h * y, w, h * hh));
  });
