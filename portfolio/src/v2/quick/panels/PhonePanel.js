import React from "react";
import { Link } from "react-router-dom";
import Panel, { Reveal } from "../Panel";
import { PhoneScreen } from "../../hud/Phone";
import { profile } from "../../data/content";

const PhonePanel = () => (
  <Panel id="phone">
    <div className="grid md:grid-cols-2 gap-10 items-center">
      <Reveal>
        <div className="f-mono text-xs uppercase tracking-[0.3em] text-city-teal">District 07 · Phone</div>
        <h2 className="f-display uppercase text-6xl md:text-8xl leading-[0.85] mt-2">
          Got a<br />
          <span className="text-city-pink neon-text">mission?</span>
        </h2>
        <p className="text-lg text-white/85 mt-5 max-w-md">
          Open to interesting problems in full-stack, platform and AI engineering. The phone's right there — pick a
          contact.
        </p>
      </Reveal>
      <Reveal delay={0.15} className="flex justify-center md:justify-end">
        <PhoneScreen />
      </Reveal>
    </div>
    <footer className="mt-20 flex flex-wrap justify-between gap-3 f-mono text-[11px] uppercase text-white/50">
      <span>
        © {new Date().getFullYear()} {profile.name}
      </span>
      <Link to="/" className="hover:text-city-teal">
        Switch to classic site →
      </Link>
    </footer>
  </Panel>
);

export default PhonePanel;
