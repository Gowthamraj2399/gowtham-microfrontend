import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, useTexture } from "@react-three/drei";
import { LatheGeometry, SRGBColorSpace, Vector2 } from "three";
import { awards, contacts, missions, profile, projects, skillGroups, careerStart } from "../../data/content";
import { formatDuration } from "../../utils/time";
import { stopById } from "../layout";
import { downtownTowers, pierRect } from "../cityData";
import { Billboard, Building, ImagePanel, NeonSign, Plaque, glow } from "../parts";
import { useCanvasTexture } from "../textures";

const At = ({ id, children }) => {
  const s = stopById[id];
  return <group position={[s.x, 0, s.z]}>{children}</group>;
};

const useImages = (urls) => {
  const list = useTexture(urls);
  const arr = Array.isArray(list) ? list : [list];
  arr.forEach((t) => {
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 8;
  });
  return arr;
};

const hero = { base: "#1f1848", top: "#3d2f80", lit: 0.25 };
const accent = { base: "#2a1f62", top: "#5a45ad", lit: 0.28 };

// 01 · Skyline — the name billboard you see first.
const Skyline = () => (
  <At id="hero">
    <Building size={[28, 7, 10]} style={hero} trim="#FF3D7F" />
    <Billboard
      position={[0, 7, 1.5]}
      w={30}
      legs={1.2}
      color="#FF3D7F"
      tag="Now playing"
      title={profile.name}
      lines={[profile.title, profile.tagline, `${formatDuration(careerStart, null)} in the game · ${profile.location}`]}
    />
  </At>
);

// 02 · The Rooftop — apartment block with the portrait on the roof terrace.
const Rooftop = () => {
  const [portrait] = useImages([profile.portrait]);
  return (
    <At id="about">
      <Building size={[16, 24, 14]} style={accent} trim="#FFD23F" />
      <mesh position={[-5.5, 25.5, -4]} castShadow>
        <cylinderGeometry args={[1.4, 1.4, 3, 20]} />
        <meshStandardMaterial color="#4a3a92" roughness={0.6} />
      </mesh>
      <ImagePanel texture={portrait} maxW={7.5} maxH={8.5} edge="#FFD23F" card="#2a1f62" position={[1.5, 29.2, 0.5]} />
      <NeonSign title="The Rooftop" sub="Character profile" color="#FFD23F" width={11} position={[0, 20.5, 7.1]} />
    </At>
  );
};

// 03 · Tech District — one billboard per skill group, two staggered rows.
const accents = ["#FF3D7F", "#2EE6D6", "#FFD23F", "#FF8A3D", "#9b6bff"];
const TechDistrict = () => (
  <At id="skills">
    {skillGroups.map((g, i) => {
      const front = i < 4;
      const col = front ? i : i - 4;
      const count = front ? 4 : 3;
      const x = (col - (count - 1) / 2) * 7.4;
      return (
        <Billboard
          key={g.label}
          position={[x, 0, front ? 1 : -6]}
          rotation={[0, -x * 0.012, 0]}
          w={6.2}
          legs={front ? 1.8 : 6.6}
          color={accents[i % accents.length]}
          tag={`Slot ${String(i + 1).padStart(2, "0")}`}
          title={g.label}
          lines={g.skills.slice(0, 4)}
        />
      );
    })}
    <NeonSign title="Tech District" sub="Loadout" color="#2EE6D6" width={13} position={[0, 16, -7]} />
  </At>
);

// 04 · Downtown — a tower per company, height by time spent there.
const Beacon = ({ position }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.visible = Math.sin(clock.elapsedTime * 4) > -0.2;
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.55, 16, 16]} />
      <meshBasicMaterial color={glow("#FF3D7F", 3)} toneMapped={false} />
    </mesh>
  );
};

const Downtown = () => {
  const logos = useImages(missions.map((m) => m.logo));
  return (
    <At id="missions">
      {downtownTowers.map((t) => {
        const m = t.mission;
        const current = !m.endDate;
        const i = missions.indexOf(m);
        return (
          <group key={m.company} position={[t.x, 0, 0]}>
            <Building
              size={[t.w, t.h, t.w]}
              style={current ? accent : { base: "#221a52", top: "#45368c", lit: 0.22 }}
              trim={current ? "#FF3D7F" : "#2EE6D6"}
            />
            <ImagePanel
              texture={logos[i]}
              maxW={6.6}
              maxH={2.6}
              pad={0.35}
              card="#ffffff"
              unlit
              edge={current ? "#FF3D7F" : "#2EE6D6"}
              position={[0, t.h - 2.8, t.w / 2 + 0.12]}
            />
            {/* The logo above already names the company, so the plaque only says how long. */}
            <Plaque
              title={formatDuration(m.startDate, m.endDate)}
              sub={current ? "Current mission" : `Mission #${String(missions.length - i).padStart(2, "0")}`}
              color={current ? "#FF3D7F" : "#FFD23F"}
              width={8.4}
              position={[0, t.h - 7.3, t.w / 2 + 0.12]}
            />
            {current && <Beacon position={[0, t.h + 1.1, 0]} />}
          </group>
        );
      })}
    </At>
  );
};

// 05 · The Garage — an open showroom: three screens on stands under a neon arch.
const Garage = () => {
  const shots = useImages(projects.map((p) => p.image));
  const edges = ["#FF3D7F", "#2EE6D6", "#FFD23F"];
  return (
    <At id="garage">
      <RoundedBox args={[34, 0.5, 15]} radius={0.2} position={[0, 0.3, -0.5]} receiveShadow>
        <meshStandardMaterial color="#3a3080" roughness={0.35} metalness={0.3} />
      </RoundedBox>
      <mesh position={[0, 1.8, -6.5]} castShadow receiveShadow>
        <boxGeometry args={[34, 3, 1]} />
        <meshStandardMaterial color="#2a2262" roughness={0.6} />
      </mesh>
      <mesh position={[0, 3.35, -6]}>
        <boxGeometry args={[34, 0.12, 0.12]} />
        <meshBasicMaterial color={glow("#FF3D7F", 2)} toneMapped={false} />
      </mesh>
      {[-16, 16].map((x) => (
        <mesh key={x} position={[x, 6, 0]} castShadow>
          <boxGeometry args={[0.9, 12, 0.9]} />
          <meshStandardMaterial color="#2a2262" />
        </mesh>
      ))}
      <mesh position={[0, 12.2, 0]} castShadow>
        <boxGeometry args={[33, 0.9, 0.9]} />
        <meshStandardMaterial color="#2a2262" />
      </mesh>
      <mesh position={[0, 11.7, 0.46]}>
        <boxGeometry args={[33, 0.1, 0.05]} />
        <meshBasicMaterial color={glow("#2EE6D6", 2)} toneMapped={false} />
      </mesh>
      <NeonSign
        title="The Garage"
        sub={`${profile.projectsDelivered} projects · ${projects.length} on display`}
        color="#FF3D7F"
        width={13}
        position={[0, 14.4, 0]}
      />
      {projects.map((p, i) => (
        <group key={p.name} position={[(i - 1) * 10.4, 0.55, -1]}>
          <mesh position={[0, 1.6, -0.2]} castShadow>
            <boxGeometry args={[0.3, 3.2, 0.3]} />
            <meshStandardMaterial color="#141230" />
          </mesh>
          <ImagePanel texture={shots[i]} maxW={8.6} maxH={5.2} pad={0.25} edge={edges[i]} position={[0, 6.2, 0]} rotation={[-0.06, 0, 0]} />
          <NeonSign title={p.name} sub={p.platform} color={edges[i]} width={8} position={[0, 2.3, 0.5]} />
        </group>
      ))}
    </At>
  );
};

// 06 · Hall of Fame — stepped pedestal, gold trophy, spotlight.
const Trophy = (props) => {
  const ref = useRef();
  const cup = useMemo(() => {
    const pts = [
      [0, 0], [1.4, 0], [1.4, 0.3], [0.4, 0.5], [0.3, 1.6], [0.5, 1.8], [1.5, 2.4], [1.9, 3.6], [1.7, 3.7], [1.2, 2.6], [0, 2.2],
    ].map(([x, y]) => new Vector2(x, y));
    return new LatheGeometry(pts, 32);
  }, []);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.6;
  });
  return (
    <mesh ref={ref} geometry={cup} castShadow {...props}>
      <meshStandardMaterial color="#FFD23F" metalness={0.75} roughness={0.25} envMapIntensity={1.6} emissive="#a86b00" emissiveIntensity={0.45} />
    </mesh>
  );
};

// Pedestal spacing (cityData.js sizes the car's collision box for the row with the same 7).
const PEDESTAL_GAP = 7;

const HallOfFame = () => (
  <At id="awards">
    {awards.map((a, i) => {
      const x = (i - (awards.length - 1) / 2) * PEDESTAL_GAP;
      return (
        <group key={a.title} position={[x, 0, 0]}>
          <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
            <boxGeometry args={[4.6, 1.2, 4.6]} />
            <meshStandardMaterial color="#2a2262" />
          </mesh>
          <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.2, 1.6, 3.2]} />
            <meshStandardMaterial color="#141230" />
          </mesh>
          <mesh position={[0, 3.03, 0]}>
            <boxGeometry args={[3.24, 0.06, 3.24]} />
            <meshBasicMaterial color={glow("#FFD23F", 2)} toneMapped={false} />
          </mesh>
          <Trophy position={[0, 3.05, 0]} />
          <mesh position={[0, 10, 0]}>
            <coneGeometry args={[3.2, 13, 32, 1, true]} />
            <meshBasicMaterial color="#FFD23F" transparent opacity={0.07} depthWrite={false} toneMapped={false} />
          </mesh>
          <NeonSign title={a.title} sub={`${a.awarder} · ${a.year}`} color="#FFD23F" width={6.6} position={[0, 9.2, -2]} />
        </group>
      );
    })}
  </At>
);

// 07 · Phone — a giant phone at the end of the pier.
const PhoneMonument = () => {
  const screen = useCanvasTexture(
    512,
    1024,
    (ctx, w, h) => {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#1a0b3d");
      g.addColorStop(1, "#6B2BD9");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.textAlign = "center";
      ctx.fillStyle = "#FF3D7F";
      ctx.font = '120px "Anton"';
      ctx.fillText("GOT A", w / 2, 260);
      ctx.fillText("MISSION?", w / 2, 390);
      ctx.font = '700 30px "JetBrains Mono"';
      contacts.forEach((c, i) => {
        const y = 520 + i * 150;
        ctx.fillStyle = "rgba(255,255,255,0.12)";
        ctx.fillRect(40, y - 60, w - 80, 110);
        ctx.fillStyle = "#2EE6D6";
        ctx.fillText(c.label.toUpperCase(), w / 2, y - 12);
        ctx.fillStyle = "#ffffff";
        ctx.fillText(c.handle.length > 26 ? `${c.handle.slice(0, 25)}…` : c.handle, w / 2, y + 28);
      });
    },
    []
  );
  return (
    <group position={[pierRect.x + 10, 0.1, pierRect.z]} rotation={[0, -0.35, 0]}>
      <RoundedBox args={[7.4, 14.4, 0.9]} radius={0.6} position={[0, 7.2, 0]} castShadow>
        <meshStandardMaterial color="#26264a" metalness={0.6} roughness={0.3} />
      </RoundedBox>
      <mesh position={[0, 7.2, 0.47]}>
        <planeGeometry args={[6.4, 12.8]} />
        <meshBasicMaterial map={screen} color={[1.2, 1.2, 1.2]} toneMapped={false} />
      </mesh>
      <NeonSign title="Phone" sub="Contact" color="#2EE6D6" width={8} position={[-9, 4, 1]} rotation={[0, 0.35, 0]} />
    </group>
  );
};

const Districts = () => (
  <group>
    <Skyline />
    <Rooftop />
    <TechDistrict />
    <Downtown />
    <Garage />
    <HallOfFame />
    <PhoneMonument />
  </group>
);

export default Districts;
