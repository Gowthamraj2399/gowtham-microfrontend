import React, { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import { Color, DoubleSide } from "three";
import { buildingMaterial } from "./materials";
import { useCanvasTexture, drawNeon, drawBillboard, drawPlaque } from "./textures";

// Colours above 1.0 so the bloom pass picks them up.
export const glow = (hex, k = 2.2) => new Color(hex).multiplyScalar(k);

// One material per style, shared by every building that uses it.
const materials = new Map();
const getBuildingMaterial = (opts) => {
  const key = JSON.stringify(opts);
  if (!materials.has(key)) materials.set(key, buildingMaterial(opts));
  return materials.get(key);
};

// A clean tower with shader windows and an optional neon roof trim.
// `size` = [w, h, d]; sits on the ground at `position`.
export const Building = ({ size, position = [0, 0, 0], style = {}, trim }) => {
  const [w, h, d] = size;
  return (
    <group position={position}>
      <mesh position={[0, h / 2, 0]} material={getBuildingMaterial(style)} castShadow receiveShadow>
        <boxGeometry args={size} />
      </mesh>
      {trim && (
        <mesh position={[0, h + 0.09, 0]}>
          <boxGeometry args={[w + 0.12, 0.18, d + 0.12]} />
          <meshBasicMaterial color={glow(trim, 1.8)} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
};

// Glowing text sign. Width in world units; height follows the 4:1 canvas.
export const NeonSign = ({ title, sub, color, width = 16, ...props }) => {
  const tex = useCanvasTexture(1024, 256, drawNeon({ title, sub, color }), [title, sub, color]);
  return (
    <mesh {...props}>
      <planeGeometry args={[width, width / 4]} />
      <meshBasicMaterial map={tex} color={[1.5, 1.5, 1.5]} transparent toneMapped={false} side={DoubleSide} depthWrite={false} />
    </mesh>
  );
};

// Opaque label plaque (8:3). Width in world units.
export const Plaque = ({ title, sub, color, width = 8, ...props }) => {
  const tex = useCanvasTexture(1024, 384, drawPlaque({ title, sub, color }), [title, sub, color]);
  return (
    <mesh {...props}>
      <planeGeometry args={[width, (width * 3) / 8]} />
      <meshBasicMaterial map={tex} transparent toneMapped={false} />
    </mesh>
  );
};

// Poster billboard on two slim legs. `w` is the board width (3:2 canvas).
export const Billboard = ({ title, lines, color, tag, w = 6, legs = 4, ...props }) => {
  const tex = useCanvasTexture(768, 512, drawBillboard({ title, lines, color, tag }), [title, color, tag, lines?.join()]);
  const h = (w * 2) / 3;
  return (
    <group {...props}>
      {[-w / 2 + 0.6, w / 2 - 0.6].map((x) => (
        <mesh key={x} position={[x, legs / 2, -0.12]} castShadow>
          <boxGeometry args={[0.16, legs, 0.16]} />
          <meshStandardMaterial color="#141230" />
        </mesh>
      ))}
      <mesh position={[0, legs + h / 2, -0.06]} castShadow>
        <boxGeometry args={[w + 0.24, h + 0.24, 0.1]} />
        <meshBasicMaterial color={glow(color, 1.6)} toneMapped={false} />
      </mesh>
      <mesh position={[0, legs + h / 2, 0]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
};

// An image on a rounded card sized to the image's own aspect ratio (no
// letterboxing), with a thin glowing edge. `card` is the card colour behind
// transparent images (white for logos).
// `unlit` draws the card without scene lighting (logos: the purple light and
// fog turned white cards grey-lavender).
export const ImagePanel = ({ texture, maxW, maxH, pad = 0.35, card = "#0b0b1e", edge = "#FF3D7F", unlit = false, ...props }) => {
  const [w, h] = useMemo(() => {
    const img = texture.image;
    const aspect = img && img.width ? img.width / img.height : 1;
    return aspect > maxW / maxH ? [maxW, maxW / aspect] : [maxH * aspect, maxH];
  }, [texture, maxW, maxH]);
  return (
    <group {...props}>
      <RoundedBox args={[w + pad * 2 + 0.24, h + pad * 2 + 0.24, 0.12]} radius={0.06} position={[0, 0, -0.1]}>
        <meshBasicMaterial color={glow(edge, 1.7)} toneMapped={false} />
      </RoundedBox>
      <RoundedBox args={[w + pad * 2, h + pad * 2, 0.16]} radius={0.08} position={[0, 0, -0.04]} castShadow>
        {unlit ? (
          <meshBasicMaterial color={card} toneMapped={false} fog={false} />
        ) : (
          <meshStandardMaterial color={card} roughness={0.5} />
        )}
      </RoundedBox>
      <mesh position={[0, 0, 0.09]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} fog={!unlit} />
      </mesh>
    </group>
  );
};
