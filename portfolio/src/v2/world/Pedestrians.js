import React, { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, Matrix4, Object3D } from "three";
import { carPos } from "./layout";
import { buildSidewalks, spawnWalkers, stepWalker } from "./pedestrianSim";

// Blocky people strolling along both edges of the road (pedestrianSim.js).
// Every body part is one InstancedMesh, so the whole crowd costs a handful
// of draw calls. In free roam they step aside from the car.

// Body parts in a walker's local space (feet at y = 0, facing +z).
// `pivot` is where a limb swings from; `size` is the box.
const PARTS = {
  torso: { size: [0.56, 0.72, 0.32], at: [0, 1.32, 0] },
  head: { size: [0.36, 0.38, 0.36], at: [0, 1.92, 0] },
  legL: { size: [0.2, 0.92, 0.22], pivot: [0.14, 0.96, 0] },
  legR: { size: [0.2, 0.92, 0.22], pivot: [-0.14, 0.96, 0] },
  armL: { size: [0.15, 0.66, 0.17], pivot: [0.37, 1.64, 0] },
  armR: { size: [0.15, 0.66, 0.17], pivot: [-0.37, 1.64, 0] },
};

const Part = React.forwardRef(({ count, size, shadow }, ref) => (
  <instancedMesh ref={ref} args={[undefined, undefined, count]} castShadow={shadow} frustumCulled={false}>
    <boxGeometry args={size} />
    <meshStandardMaterial roughness={0.75} />
  </instancedMesh>
));

const Pedestrians = ({ count = 100 }) => {
  const walks = useMemo(buildSidewalks, []);
  const walkers = useMemo(() => spawnWalkers(count, walks), [count, walks]);
  const refs = {
    torso: useRef(),
    head: useRef(),
    legL: useRef(),
    legR: useRef(),
    armL: useRef(),
    armR: useRef(),
  };
  const tmp = useMemo(
    () => ({
      body: new Matrix4(),
      local: new Matrix4(),
      swing: new Matrix4(),
      out: new Matrix4(),
      dummy: new Object3D(),
    }),
    []
  );

  // Per-walker colours, set once.
  useLayoutEffect(() => {
    const c = new Color();
    walkers.forEach((w, i) => {
      refs.torso.current.setColorAt(i, c.set(w.shirt));
      refs.armL.current.setColorAt(i, c.set(w.shirt));
      refs.armR.current.setColorAt(i, c.set(w.shirt));
      refs.head.current.setColorAt(i, c.set(w.skin));
      refs.legL.current.setColorAt(i, c.set(w.pants));
      refs.legR.current.setColorAt(i, c.set(w.pants));
    });
    Object.values(refs).forEach((r) => {
      if (r.current.instanceColor) r.current.instanceColor.needsUpdate = true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walkers]);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.1);
    const car = carPos.on ? carPos : null;
    const { body, local, swing, out, dummy } = tmp;

    walkers.forEach((w, i) => {
      const { x, z, bob, swing: s, heading } = stepWalker(w, walks, dt, car);

      dummy.position.set(x, bob, z);
      dummy.rotation.set(0, heading, 0);
      dummy.scale.setScalar(w.size);
      dummy.updateMatrix();
      body.copy(dummy.matrix);

      Object.entries(PARTS).forEach(([name, part]) => {
        if (part.pivot) {
          // swing about the hip / shoulder, legs and arms opposite
          const amp = name.startsWith("leg") ? 0.55 : 0.45;
          const sign = name === "legL" || name === "armR" ? 1 : -1;
          local.makeTranslation(...part.pivot);
          swing.makeRotationX(s * amp * sign);
          out.multiplyMatrices(body, local).multiply(swing);
          local.makeTranslation(0, -part.size[1] / 2, 0);
          out.multiply(local);
        } else {
          local.makeTranslation(...part.at);
          out.multiplyMatrices(body, local);
        }
        refs[name].current.setMatrixAt(i, out);
      });
    });

    Object.values(refs).forEach((r) => {
      r.current.instanceMatrix.needsUpdate = true;
    });
  });

  return (
    <group>
      {Object.entries(PARTS).map(([name, part]) => (
        <Part key={name} ref={refs[name]} count={walkers.length} size={part.size} shadow={name === "torso"} />
      ))}
    </group>
  );
};

export default Pedestrians;
