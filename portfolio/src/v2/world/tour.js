import { CatmullRomCurve3, Vector3 } from "three";
import { awards } from "../data/content";
import { downtownTowers, stops } from "./layout";
import { pierRect } from "./cityData";

// The scroll tour is a list of camera *shots*. Each shot says what to look at
// (`look`, relative to the district centre), which way the camera looks from
// (`dir`, its length is the preferred distance) and how wide the subject is
// (`width`). The camera backs off only as far as needed to fit that width on
// the current screen, so nothing shrinks more than it has to.
//
// Wide screens: one shot per district. Tall (phone) screens: wide districts
// are split into close-ups — two skill boards, two towers, one garage screen
// at a time — so text stays readable and fewer buildings get in between.

const FOV = 50; // must match the Canvas camera
const TALL = 0.75; // aspect ratio below which the phone tour is used

const wide = {
  hero: [{ look: [0, 12, 0], dir: [0, 8, 60], width: 38 }],
  about: [{ look: [0, 25, 0], dir: [16, 9, 34], width: 18 }],
  skills: [{ look: [0, 7, -2], dir: [0, 3, 32], width: 31 }],
  missions: [{ look: [0, 20, 0], dir: [0, 6, 64], width: 48 }],
  garage: [{ look: [0, 4.5, 0], dir: [0, 4.5, 30], width: 34 }],
  awards: [{ look: [0, 5, 0], dir: [9, 4, 24], width: 15 }],
  phone: [{ look: [30, 7, 0], dir: [-16, 3, 28], width: 22 }],
};

const towerPair = (a, b) => {
  const [ta, tb] = [downtownTowers[a], downtownTowers[b]];
  const y = (ta.h + tb.h) / 2 - 5;
  return { look: [(ta.x + tb.x) / 2, y, 4.5], dir: [0, 5, 50], width: 22 };
};

const tall = {
  hero: [{ look: [0, 15, 1.5], dir: [0, 4, 60], width: 32 }],
  about: [{ look: [1.5, 26, 0], dir: [14, 7, 34], width: 17 }],
  skills: [
    { look: [-7.4, 4, 1], dir: [0, 3, 30], width: 15 },
    { look: [7.4, 4, 1], dir: [0, 3, 30], width: 15 },
    { look: [-3.7, 8.7, -6], dir: [0, 6, 30], width: 15 },
    { look: [7.4, 8.7, -6], dir: [0, 6, 30], width: 8 },
  ],
  missions: [towerPair(0, 1), towerPair(2, 3)],
  garage: [-10.4, 0, 10.4].map((x) => ({ look: [x, 5.6, -0.5], dir: [0, 2.5, 22], width: 10.5 })),
  // One close-up per award pedestal (pedestals are 7 apart, centred).
  awards: awards.map((_, i) => ({ look: [(i - (awards.length - 1) / 2) * 7, 6.2, 0], dir: [5, 4, 20], width: 8.5 })),
  phone: [{ look: [pierRect.x + 10 - stops.at(-1).x, 7.5, 0], dir: [-8, 3, 26], width: 13 }],
};

// Distance at which `width` fills the screen horizontally (with a little margin).
const fitDistance = (width, aspect) => {
  const halfH = Math.tan(((FOV / 2) * Math.PI) / 180);
  return (width / 2 / (halfH * aspect)) * 1.12;
};

// Builds the tour for a screen of the given aspect ratio.
export const buildTour = (aspect) => {
  const set = aspect < TALL ? tall : wide;
  const shots = stops.flatMap((s) =>
    set[s.id].map((shot) => {
      const look = new Vector3(s.x + shot.look[0], shot.look[1], s.z + shot.look[2]);
      const dir = new Vector3(...shot.dir);
      const dist = Math.max(dir.length(), fitDistance(shot.width, aspect));
      const cam = look.clone().add(dir.normalize().multiplyScalar(dist));
      return { id: s.id, look, cam };
    })
  );
  return {
    tall: aspect < TALL,
    shots,
    camCurve: new CatmullRomCurve3(shots.map((s) => s.cam), false, "centripetal"),
    lookCurve: new CatmullRomCurve3(shots.map((s) => s.look), false, "centripetal"),
  };
};
