// Island outline in the 0–100 map space the districts use. Shared by the
// minimap (SVG path) and the 3D world (extruded shape) so they always match.
export const ISLAND = [
  ["M", 12, 70],
  ["C", 6, 52, 14, 30, 30, 20],
  ["C", 44, 10, 62, 6, 78, 10],
  ["C", 92, 14, 96, 30, 92, 46],
  ["C", 96, 60, 94, 78, 80, 88],
  ["C", 64, 96, 40, 96, 26, 90],
  ["C", 16, 86, 14, 80, 12, 70],
];

export const islandPath = `${ISLAND.map(([cmd, ...n]) => cmd + n.join(" ")).join(" ")} Z`;
