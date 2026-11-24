import React, { useLayoutEffect, useMemo, useRef } from "react";
import { BoxGeometry, BufferAttribute, BufferGeometry, Color, ExtrudeGeometry, Object3D } from "three";
import { islandShape, roadCurve, stops } from "./layout";
import { fillerBuildings, pierRect, plinth, streetLights } from "./cityData";
import { buildingMaterial, roadTexture } from "./materials";

const dummy = new Object3D();
export const NEON = ["#FF3D7F", "#2EE6D6", "#FF8A3D"];
// Colours above 1.0 so the bloom pass picks them up.
export const glowColor = (hex, k = 2.2) => new Color(hex).multiplyScalar(k);

const Island = () => {
  const geometry = useMemo(() => {
    const g = new ExtrudeGeometry(islandShape, { depth: 6, bevelEnabled: true, bevelSize: 1.5, bevelThickness: 1, bevelSegments: 2, curveSegments: 32 });
    g.rotateX(-Math.PI / 2);
    g.translate(0, -7, 0);
    return g;
  }, []);
  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial color="#2f2766" roughness={0.92} />
    </mesh>
  );
};

const Water = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]}>
    <planeGeometry args={[4000, 4000]} />
    <meshStandardMaterial color="#1a1446" roughness={0.42} metalness={0.4} envMapIntensity={0.6} />
  </mesh>
);

// Flat ribbon along the route with a proper road texture.
const Road = () => {
  const [geometry, texture] = useMemo(() => {
    const samples = 500;
    const width = 6;
    const pos = [];
    const uv = [];
    const index = [];
    let dist = 0;
    let prev = roadCurve.getPointAt(0);
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const p = roadCurve.getPointAt(t);
      const tan = roadCurve.getTangentAt(t);
      dist += p.distanceTo(prev);
      prev = p;
      const nx = -tan.z * (width / 2);
      const nz = tan.x * (width / 2);
      pos.push(p.x + nx, 0.04, p.z + nz, p.x - nx, 0.04, p.z - nz);
      uv.push(0, dist / 8, 1, dist / 8);
      if (i < samples) {
        const a = i * 2;
        index.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
      }
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(new Float32Array(pos), 3));
    g.setAttribute("uv", new BufferAttribute(new Float32Array(uv), 2));
    g.setIndex(index);
    g.computeVertexNormals();
    return [g, roadTexture()];
  }, []);
  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial map={texture} roughness={0.85} side={2} />
    </mesh>
  );
};

// Each district sits on a clean round lot with a thin neon ring.
const Plinths = () => (
  <group>
    {stops
      .filter((s) => plinth[s.id] > 0)
      .map((s, i) => (
        <group key={s.id} position={[s.x, 0, s.z]}>
          <mesh position={[0, 0.12, 0]} receiveShadow>
            <cylinderGeometry args={[plinth[s.id], plinth[s.id] + 0.4, 0.24, 64]} />
            <meshStandardMaterial color="#3b3180" roughness={0.6} metalness={0.15} />
          </mesh>
          <mesh position={[0, 0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[plinth[s.id] - 0.35, plinth[s.id] - 0.12, 96]} />
            <meshBasicMaterial color={glowColor(NEON[i % 3], 1.6)} toneMapped={false} />
          </mesh>
        </group>
      ))}
  </group>
);

const Pier = () => (
  <group position={[pierRect.x, 0, pierRect.z]}>
    <mesh position={[0, -0.2, 0]} receiveShadow castShadow>
      <boxGeometry args={[pierRect.w, 0.6, pierRect.d]} />
      <meshStandardMaterial color="#3a2f70" roughness={0.7} />
    </mesh>
    {[-1, 1].map((side) => (
      <mesh key={side} position={[0, 0.12, (side * pierRect.d) / 2]}>
        <boxGeometry args={[pierRect.w, 0.12, 0.12]} />
        <meshBasicMaterial color={glowColor("#2EE6D6", 1.8)} toneMapped={false} />
      </mesh>
    ))}
  </group>
);

// Filler city: one instanced draw for the bodies, one for the neon roof trims.
const Buildings = () => {
  const bodies = useRef();
  const trims = useRef();
  const material = useMemo(() => buildingMaterial(), []);
  const geometry = useMemo(() => {
    const g = new BoxGeometry(1, 1, 1);
    g.translate(0, 0.5, 0);
    return g;
  }, []);
  const trimmed = useMemo(() => fillerBuildings.filter((b) => b.trim >= 0), []);

  useLayoutEffect(() => {
    const tints = ["#c9c2ff", "#ffffff", "#b5aef0", "#e2dcff"].map((c) => new Color(c));
    fillerBuildings.forEach((b, i) => {
      dummy.position.set(b.x, 0, b.z);
      dummy.scale.set(b.w, b.h, b.d);
      dummy.updateMatrix();
      bodies.current.setMatrixAt(i, dummy.matrix);
      bodies.current.setColorAt(i, tints[Math.floor(b.tint * tints.length)]);
    });
    bodies.current.instanceMatrix.needsUpdate = true;
    if (bodies.current.instanceColor) bodies.current.instanceColor.needsUpdate = true;

    trimmed.forEach((b, i) => {
      dummy.position.set(b.x, b.h, b.z);
      dummy.scale.set(b.w + 0.1, 0.18, b.d + 0.1);
      dummy.updateMatrix();
      trims.current.setMatrixAt(i, dummy.matrix);
      trims.current.setColorAt(i, glowColor(NEON[b.trim], 1.8));
    });
    trims.current.instanceMatrix.needsUpdate = true;
    if (trims.current.instanceColor) trims.current.instanceColor.needsUpdate = true;
  }, [trimmed]);

  return (
    <group>
      <instancedMesh ref={bodies} args={[geometry, material, fillerBuildings.length]} castShadow receiveShadow />
      <instancedMesh ref={trims} args={[geometry, null, trimmed.length]}>
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </instancedMesh>
    </group>
  );
};

const StreetLights = () => {
  const poles = useRef();
  const heads = useRef();
  useLayoutEffect(() => {
    const pink = glowColor("#FF3D7F", 2.5);
    const teal = glowColor("#2EE6D6", 2.5);
    streetLights.forEach((p, i) => {
      dummy.scale.set(1, 1, 1);
      dummy.position.set(p.x, 2.2, p.z);
      dummy.updateMatrix();
      poles.current.setMatrixAt(i, dummy.matrix);
      dummy.position.set(p.x, 4.5, p.z);
      dummy.updateMatrix();
      heads.current.setMatrixAt(i, dummy.matrix);
      heads.current.setColorAt(i, p.teal ? teal : pink);
    });
    poles.current.instanceMatrix.needsUpdate = true;
    heads.current.instanceMatrix.needsUpdate = true;
    if (heads.current.instanceColor) heads.current.instanceColor.needsUpdate = true;
  }, []);
  return (
    <group>
      <instancedMesh ref={poles} args={[null, null, streetLights.length]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 4.4, 6]} />
        <meshStandardMaterial color="#141230" />
      </instancedMesh>
      <instancedMesh ref={heads} args={[null, null, streetLights.length]}>
        <sphereGeometry args={[0.28, 10, 10]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </instancedMesh>
    </group>
  );
};

const City = () => (
  <group>
    <Water />
    <Island />
    <Road />
    <Plinths />
    <Pier />
    <Buildings />
    <StreetLights />
  </group>
);

export default City;
