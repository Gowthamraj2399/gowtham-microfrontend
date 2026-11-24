import React, { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import { BackSide, BufferAttribute, BufferGeometry, Color, ShaderMaterial } from "three";
import { rng, worldTime } from "./layout";
import { sunTexture } from "./textures";

const DUSK_FOG = new Color("#4a2378");
const NIGHT_FOG = new Color("#120f35");

const skyMaterial = () =>
  new ShaderMaterial({
    side: BackSide,
    depthWrite: false,
    fog: false,
    uniforms: { uNight: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform float uNight;
      varying vec3 vDir;
      void main() {
        float h = vDir.y;
        vec3 top = mix(vec3(0.10, 0.04, 0.24), vec3(0.02, 0.02, 0.08), uNight);
        vec3 mid = mix(vec3(0.42, 0.17, 0.85), vec3(0.08, 0.07, 0.29), uNight);
        vec3 hor = mix(vec3(1.00, 0.54, 0.24), vec3(0.29, 0.14, 0.47), uNight);
        vec3 c = h > 0.22 ? mix(mid, top, smoothstep(0.22, 0.85, h)) : mix(hor, mid, smoothstep(-0.05, 0.22, h));
        gl_FragColor = vec4(c, 1.0);
      }`,
  });

const Stars = ({ materialRef }) => {
  const geometry = useMemo(() => {
    const r = rng(17);
    const count = 700;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = r() * Math.PI * 2;
      const y = 0.12 + r() * 0.88; // upper hemisphere only
      const rad = Math.sqrt(1 - y * y);
      pos.set([Math.cos(theta) * rad * 900, y * 900, Math.sin(theta) * rad * 900], i * 3);
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(pos, 3));
    return g;
  }, []);
  return (
    <points geometry={geometry}>
      <pointsMaterial ref={materialRef} color="#ffffff" size={2.2} sizeAttenuation={false} transparent opacity={0} fog={false} depthWrite={false} />
    </points>
  );
};

// Sky dome + sun + stars. Time of day follows the camera along the route:
// sunset at the start, night by the Phone.
const Sky = () => {
  const { scene } = useThree();
  const material = useMemo(skyMaterial, []);
  const sun = useMemo(sunTexture, []);
  const sunRef = useRef();
  const starsRef = useRef();

  useEffect(
    () => () => {
      material.dispose();
      sun.dispose();
    },
    [material, sun]
  );

  useFrame(({ camera }) => {
    const n = worldTime.night;
    material.uniforms.uNight.value = n;
    if (scene.fog) scene.fog.color.lerpColors(DUSK_FOG, NIGHT_FOG, n);
    if (sunRef.current) sunRef.current.position.set(camera.position.x - 120, 70 - n * 170, camera.position.z - 700);
    if (starsRef.current) starsRef.current.opacity = Math.max(0, (n - 0.35) / 0.65);
  });

  return (
    <group>
      <mesh material={material} renderOrder={-2}>
        <sphereGeometry args={[1000, 32, 16]} />
      </mesh>
      <Stars materialRef={starsRef} />
      <Billboard ref={sunRef} position={[-120, 70, -700]}>
        <mesh renderOrder={-1}>
          <planeGeometry args={[240, 240]} />
          <meshBasicMaterial map={sun} transparent fog={false} depthWrite={false} toneMapped={false} />
        </mesh>
      </Billboard>
    </group>
  );
};

export default Sky;
