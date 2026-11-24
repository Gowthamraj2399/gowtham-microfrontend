import React, { useEffect, useRef } from "react";
import { SkyLayer, CityLayer } from "./Backdrop";
import HeroPanel from "./panels/HeroPanel";
import AboutPanel from "./panels/AboutPanel";
import SkillsPanel from "./panels/SkillsPanel";
import MissionsPanel from "./panels/MissionsPanel";
import GaragePanel from "./panels/GaragePanel";
import AwardsPanel from "./panels/AwardsPanel";
import PhonePanel from "./panels/PhonePanel";
import { useGameStore } from "../state/useGameStore";

// 2D "driver": the section crossing the middle of the viewport is the active
// district; jump requests scroll that section into view.
const QuickView = () => {
  const rootRef = useRef(null);
  const setActive = useGameStore((s) => s.setActive);
  const jump = useGameStore((s) => s.jump);

  useEffect(() => {
    const sections = rootRef.current.querySelectorAll("[data-district]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.dataset.district));
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [setActive]);

  useEffect(() => {
    if (!jump) return;
    const el = document.getElementById(`district-${jump.id}`);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: reduce ? "auto" : "smooth" });
  }, [jump]);

  return (
    <div ref={rootRef} className="relative">
      <SkyLayer />
      <CityLayer />
      <main className="relative z-[2]">
        <HeroPanel />
        <AboutPanel />
        <SkillsPanel />
        <MissionsPanel />
        <GaragePanel />
        <AwardsPanel />
        <PhonePanel />
      </main>
    </div>
  );
};

export default QuickView;
