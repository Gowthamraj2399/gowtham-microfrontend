// Single source of truth for v2. The Quick view and (later) the 3D world both
// render from this file — update content here, not in components.

import Resume from "../../assets/gowtham_resume.pdf";
import Portrait from "../../assets/images/gritty3.png";
import ABG from "../../assets/images/ABG.png";
import CGVAK from "../../assets/images/CGVAK.webp";
import TechConative from "../../assets/images/techconative.png";
import SymphonyAI from "../../assets/images/symphony.png";
import AyeVee from "../../assets/images/Ayevee.png";
import IMS from "../../assets/images/IMS.png";
import SCT from "../../assets/images/SCT.png";

export const careerStart = "2020-09-25";

export const profile = {
  name: "Gowtham Raj",
  title: "Senior Software Engineer",
  tagline: "Full Stack · Java · React · AI/LLM",
  pitch: "Building scalable full-stack and AI-powered products.",
  location: "India",
  projectsDelivered: "50+", // total projects worked on; `projects` below are the featured few
  portrait: Portrait,
  resume: Resume,
  bio: [
    "I laid eyes on a computer when I was 12. Being from a remote part of the country, technology was something I always heard of — but when I finally experienced it first-hand, there was no turning back.",
    "What started as a love for building UIs with React grew into a full-stack engineering journey. I've evolved from crafting frontend experiences to designing scalable backend systems with Java & Spring Boot, architecting micro-frontend platforms, and integrating AI capabilities using LLMs, LangGraph and MCP. Today I build end-to-end products that are fast, resilient and intelligent.",
  ],
};

// Districts in route order. `map` is the position on the minimap (0–100) and
// will also seed the 3D layout in phase 2. `toast` fires on first visit.
export const districts = [
  {
    id: "hero",
    name: "Skyline",
    section: "Start",
    map: { x: 24, y: 72 },
    toast: null,
  },
  {
    id: "about",
    name: "The Rooftop",
    section: "About",
    map: { x: 30, y: 52 },
    toast: { kind: "district", title: "Rooftop discovered", subtitle: "Character profile unlocked" },
  },
  {
    id: "skills",
    name: "Tech District",
    section: "Skills",
    map: { x: 52, y: 64 },
    toast: { kind: "district", title: "Tech District discovered", subtitle: "Loadout unlocked" },
  },
  {
    id: "missions",
    name: "Downtown",
    section: "Experience",
    map: { x: 66, y: 40 },
    toast: { kind: "mission", title: "Mission complete", subtitle: "4 jobs · 6+ years on record" },
  },
  {
    id: "garage",
    name: "The Garage",
    section: "Projects",
    map: { x: 46, y: 26 },
    toast: { kind: "district", title: "Garage discovered", subtitle: "50+ projects · 3 on display" },
  },
  {
    id: "awards",
    name: "Hall of Fame",
    section: "Awards",
    map: { x: 76, y: 18 },
    toast: { kind: "achievement", title: "Achievement unlocked", subtitle: "2 awards on record" },
  },
  {
    id: "phone",
    name: "Phone",
    section: "Contact",
    map: { x: 84, y: 66 },
    toast: { kind: "achievement", title: "Achievement unlocked", subtitle: "Contacts synced to your phone" },
  },
];

export const skillGroups = [
  { label: "Languages", icon: "code", skills: ["Java", "JavaScript", "TypeScript"] },
  {
    label: "Frontend",
    icon: "react",
    skills: ["React", "Angular", "React Native", "Redux Toolkit", "React Query", "Material UI", "Tailwind CSS"],
  },
  { label: "Backend", icon: "server", skills: ["Spring Boot", "Microservices", "REST APIs", "JPA / Hibernate"] },
  { label: "Databases", icon: "database", skills: ["MySQL", "PostgreSQL", "MongoDB", "Redis"] },
  {
    label: "Cloud & DevOps",
    icon: "cloud",
    skills: ["Docker", "Kubernetes", "AWS", "Git", "GitHub Actions", "Maven", "Gradle"],
  },
  {
    label: "Architecture",
    icon: "cubes",
    skills: ["Micro Frontends", "Webpack Module Federation", "Rollup", "Distributed Systems"],
  },
  {
    label: "AI & LLM",
    icon: "brain",
    skills: ["OpenAI API", "Prompt Engineering", "LangGraph", "LlamaIndex", "MCP", "LangSmith", "LangFuse"],
  },
];

// Newest first. endDate null = current.
export const missions = [
  {
    company: "SymphonyAI",
    role: "Software Engineer",
    startDate: "2025-02-28",
    endDate: null,
    logo: SymphonyAI,
    skills: ["React", "Java", "Spring Boot", "Microservices", "LangGraph", "Docker", "Kubernetes", "GitHub Actions"],
  },
  {
    company: "TechConative",
    role: "Software Engineer (Client: SymphonyAI)",
    startDate: "2024-03-01",
    endDate: "2025-02-27",
    logo: TechConative,
    skills: ["React", "Java", "Spring Boot", "REST APIs", "PostgreSQL"],
  },
  {
    company: "Group Data & Analytics, Aditya Birla Group",
    role: "Associate Product Engineer",
    startDate: "2022-11-14",
    endDate: "2024-02-09",
    logo: ABG,
    skills: ["React", "Redux Toolkit", "React Query", "Material UI", "REST APIs", "ML Platforms"],
  },
  {
    company: "CG-VAK Software & Exports Ltd",
    role: "Software Engineer",
    startDate: "2020-09-25",
    endDate: "2022-11-09",
    logo: CGVAK,
    skills: ["React", "React Native", "Angular", "Ionic", "Tailwind CSS", "Firebase"],
  },
];

export const projects = [
  {
    name: "AyeVee",
    platform: "React Native",
    image: AyeVee,
    description:
      "A scalable cross-platform mobile app for AyeVee, a lifestyle content platform featuring star performers across Beauty, Travel, Entertainment and Sports. A performant React Native codebase with Redux state management and video streaming via MUX.",
    specs: ["React Native", "Redux", "MUX", "Firebase"],
  },
  {
    name: "IMS Interpreter Mobile",
    platform: "Ionic · Angular",
    image: IMS,
    description:
      "An enterprise-grade cross-platform interpreter scheduling app for hospitals and clinics, built on the award-winning Primaxis technology. A seamless Ionic/Angular hybrid app that streamlined bookings and cut manual scheduling overhead.",
    specs: ["Ionic", "Cordova", "Angular"],
  },
  {
    name: "SCT Home & Admin",
    platform: "React",
    image: SCT,
    description:
      "A dynamic React web platform for SCT with a public landing page and a full admin panel, including a CMS-style careers page where admins publish job listings and applicants apply — no code changes needed.",
    specs: ["React", "Redux", "Tailwind CSS", "Firebase"],
  },
];

// Newest first.
export const awards = [
  {
    title: "Special Recognition",
    awarder: "SymphonyAI",
    year: "Q3 2025",
    description:
      "For designing and developing version history for pipeline grammars, along with side-by-side comparison of grammar versions.",
  },
  {
    title: "GDNA Genius Award",
    awarder: "GDNA – Aditya Birla Group",
    year: "2023",
    description:
      "For designing an innovative canvas-based image annotation solution that significantly improved backend image-processing workflows and team productivity.",
  },
];

export const contacts = [
  { label: "Email", handle: "gowthamraj2399@gmail.com", href: "mailto:gowthamraj2399@gmail.com", icon: "mail" },
  {
    label: "LinkedIn",
    handle: "@gowthamraj-dev",
    href: "https://www.linkedin.com/in/gowthamraj-dev/",
    icon: "linkedin",
  },
  { label: "GitHub", handle: "@Gowthamraj2399", href: "https://github.com/Gowthamraj2399", icon: "github" },
];

export const phoneMessages = [
  "But do I have all the answers?",
  "Absolutely not!",
  "But I'm always ready to learn, unlearn, ask questions, fail, and get back up.",
  "Got something to build? Ping me 👇",
];

export const loadingTips = [
  "Tip: Scroll to travel through the city. Click the map to fast-travel.",
  "Tip: Press Esc any time to open the menu.",
  "Tip: Every district you visit unlocks something.",
  "Tip: Your phone has Gowtham's number. Well, his email.",
  "Tip: The garage holds projects, not cars. Mostly.",
];
