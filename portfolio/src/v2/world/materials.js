import { CanvasTexture, Color, MeshStandardMaterial, RepeatWrapping, SRGBColorSpace } from "three";

// Clean building material. Everything is computed in the shader from world
// position, so it is crisp at any distance and costs no textures:
//   • a vertical colour gradient (darker base → lighter top)
//   • a regular grid of glass windows, anti-aliased, fading out with distance
//   • ~1 in 5 windows lit warm (a few teal), via a per-cell hash
// Works on plain and instanced meshes.
export const buildingMaterial = ({ base = "#231c52", top = "#4a3a92", lit = 0.2, glow = 1.25 } = {}) => {
  const m = new MeshStandardMaterial({ color: "#ffffff", roughness: 0.5, metalness: 0.3, envMapIntensity: 0.7 });
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, {
      uBase: { value: new Color(base) },
      uTop: { value: new Color(top) },
      uLit: { value: lit },
      uGlow: { value: glow },
    });
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vB;\nvarying vec3 vBN;")
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        vec4 bP = vec4(transformed, 1.0);
        vec3 bN = objectNormal;
        #ifdef USE_INSTANCING
          bP = instanceMatrix * bP;
          bN = mat3(instanceMatrix) * bN;
        #endif
        vB = (modelMatrix * bP).xyz;
        vBN = normalize(mat3(modelMatrix) * bN);`
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
        uniform vec3 uBase; uniform vec3 uTop; uniform float uLit; uniform float uGlow;
        varying vec3 vB; varying vec3 vBN;
        float bHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }`
      )
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        diffuseColor.rgb *= mix(uBase, uTop, smoothstep(0.0, 45.0, vB.y));
        float bWall = 1.0 - step(0.5, abs(vBN.y));
        float bSideX = step(0.5, abs(vBN.x));
        vec2 bCell = vec2(mix(vB.x, vB.z, bSideX) / 1.7, (vB.y - 1.4) / 2.3);
        vec2 bF = fract(bCell);
        vec2 bAA = fwidth(bCell) * 1.2;
        float bWin = smoothstep(0.24 - bAA.x, 0.24 + bAA.x, bF.x) * (1.0 - smoothstep(0.76 - bAA.x, 0.76 + bAA.x, bF.x))
                   * smoothstep(0.22 - bAA.y, 0.22 + bAA.y, bF.y) * (1.0 - smoothstep(0.78 - bAA.y, 0.78 + bAA.y, bF.y));
        bWin *= bWall * step(0.0, bCell.y) * (1.0 - clamp(max(bAA.x, bAA.y) * 2.5, 0.0, 1.0));
        float bH = bHash(floor(bCell) + bSideX * 17.0 + floor(vB.xz / 30.0) * 3.0);
        float bLit = step(1.0 - uLit, bH);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.04, 0.04, 0.1), bWin * 0.85);`
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
        vec3 bWarm = bH > 1.0 - uLit * 0.18 ? vec3(0.25, 0.95, 0.9) : vec3(1.0, 0.7, 0.36);
        totalEmissiveRadiance += bWarm * bWin * bLit * uGlow;`
      );
  };
  m.customProgramCacheKey = () => `building-${base}-${top}-${lit}-${glow}`;
  return m;
};

// Road surface: asphalt, white edge lines, dashed amber centre line.
// Repeats along the road (v), one dash cycle every 8 units.
export const roadTexture = () => {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 256;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#1a1636";
  ctx.fillRect(0, 0, 128, 256);
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.fillRect(8, 0, 4, 256);
  ctx.fillRect(116, 0, 4, 256);
  ctx.fillStyle = "#FF8A3D";
  ctx.fillRect(61, 0, 6, 150);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.wrapS = RepeatWrapping;
  t.wrapT = RepeatWrapping;
  t.anisotropy = 8;
  return t;
};
