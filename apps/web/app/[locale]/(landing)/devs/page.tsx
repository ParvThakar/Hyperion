"use client";

import { AgentSelect } from "../components/agent-select/agent-select";
import type { Dev } from "../components/dev-cards";

const devs: Dev[] = [
  {
    bio: "Maintains containerized virtualization layers, secure sandboxed task execution, and worktree isolation systems.",
    contribution:
      "Architected the secure multi-container orchestration system that executes background agent code safely.",
    github: "https://github.com/BhagirathsinhRana378",
    initials: "BR",
    linkedin: "https://www.linkedin.com/in/bhagirathsinh-rana",
    name: "Bhagirathsinh Rana",
    photoUrl: "/team/bhagirath.png",
    role: "Founding Engineer — Core Engine & DevOps",
    skills: ["Docker", "Linux Core", "Go"],
  },
  {
    bio: "Scales real-time terminal streaming, low-latency WebSocket streaming, and stateful session sync databases.",
    contribution:
      "Shipped the zero-latency multi-terminal shell multiplexer using xterm.js and custom stream serialization.",
    github: "https://github.com/Malaybhai11",
    initials: "MR",
    linkedin: "https://www.linkedin.com/in/malay-raval-2708b8307",
    name: "Malay Raval",
    photoUrl: "/team/malay.png",
    role: "Founding Engineer — Backend Systems & Terminal",
    skills: ["WebSockets", "NodeJS", "xterm.js"],
  },
  {
    bio: "Packages modular UI primitive packages, type-safe multi-locale translations, and automated code quality gates.",
    contribution:
      "Unified the cross-platform styling engine and structural localization routes using Next-intl.",
    github: "https://github.com/ParvThakar",
    initials: "PT",
    linkedin: "https://www.linkedin.com/in/parv-thakar",
    name: "Parv Thakar",
    photoUrl: "/team/parv.png",
    role: "Founding Engineer — Design Systems Lead",
    skills: ["Design Systems", "i18n", "CSS Modules"],
  },
  {
    bio: "Crafts high-fidelity layouts, micro-animations, and cross-platform native wrapper layouts for web, macOS, and Windows.",
    contribution:
      "Engineered the hybrid React shell architecture, fluid Framer Motion states, and native Tauri window pipelines.",
    github: "https://github.com/KarmSorathiya378",
    initials: "KS",
    linkedin: "https://www.linkedin.com/in/karm-sorathiya-b66214377",
    name: "Karm Sorathiya",
    photoUrl: "/team/karm.png",
    role: "Founding Engineer — Frontend Architect",
    skills: ["React", "Tauri", "TailwindCSS"],
  },
  {
    bio: "Shapes immersive user experiences, interactive WebGL landing environments, volumetric lighting, and layout aesthetics.",
    contribution:
      "Shipped the LaserFlow rendering pipeline, grid repulsion physics, and custom visual theme controllers.",
    github: "https://github.com/Meghraj-6093",
    initials: "MR",
    linkedin: "https://www.linkedin.com/in/meghraj-ravani",
    name: "Meghraj Ravani",
    photoUrl: "/team/meghraj.png",
    role: "Founding Engineer — Frontend & 3D Systems",
    skills: ["WebGL", "Three.js", "Creative Design"],
  },
];

export default function DevsPage() {
  return <AgentSelect devs={devs} />;
}
