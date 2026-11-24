const packageJson = require("../package.json");

// Packages only the portfolio's 3D world uses. They are NOT shared through
// Module Federation: shared modules are bundled whole (no tree-shaking), which
// put all of drei (~1.6MB) in the chunk. Nothing else in the container uses them.
const LOCAL_ONLY = [
  "three",
  "@react-three/fiber",
  "@react-three/drei",
  "@react-three/postprocessing",
  "postprocessing",
  "maath",
];

module.exports = Object.fromEntries(
  Object.entries(packageJson.dependencies).filter(([name]) => !LOCAL_ONLY.includes(name))
);
