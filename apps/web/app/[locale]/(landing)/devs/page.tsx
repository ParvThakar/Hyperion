"use client";

import { AgentSelect } from "../components/agent-select/agent-select";
import type { Dev } from "../components/dev-cards";

const devs: Dev[] = [
  {
    bio: "Specializes in containerized virtualization, secure execution sandboxes, and worktree isolation architectures.",
    contribution:
      "Engineered the multi-container orchestration engine, establishing a zero-trust execution environment for background agents.",
    github: "https://github.com/BhagirathsinhRana378",
    initials: "BR",
    linkedin: "https://www.linkedin.com/in/bhagirathsinh-rana",
    name: "Bhagirathsinh Rana",
    photoUrl: "/team/bhagirath.png",
    role: "Founding Engineer — Core Engine & DevOps",
    skills: ["Docker", "Linux Core", "Go"],
  },
  {
    bio: "Focuses on backend infrastructure, real-time terminal streaming, and low-latency WebSocket communication layers.",
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
    bio: "Drives the design system architecture, modular UI primitives, type-safe translations, and automated code quality gates.",
    contribution:
      "Unified the cross-platform styling framework and localized routing structures using Next-intl.",
    github: "https://github.com/ParvThakar",
    initials: "PT",
    linkedin: "https://www.linkedin.com/in/parv-thakar",
    name: "Parv Thakar",
    photoUrl: "/team/parv.png",
    role: "Founding Engineer — Design Systems Lead",
    skills: ["Design Systems", "i18n", "CSS Modules"],
  },
  {
    bio: "Crafts high-fidelity layouts, micro-interactions, and cross-platform native wrappers for web and desktop.",
    contribution:
      "Architected the hybrid React shell, Framer Motion state machines, and Tauri native window pipelines.",
    github: "https://github.com/KarmSorathiya378",
    initials: "KS",
    linkedin: "https://www.linkedin.com/in/karm-sorathiya-b66214377",
    name: "Karm Sorathiya",
    photoUrl: "/team/karm.png",
    role: "Founding Engineer — Frontend Architect",
    skills: ["React", "Tauri", "TailwindCSS"],
  },
  {
    bio: "Shapes immersive user experiences through interactive WebGL environments, volumetric lighting, and layout aesthetics.",
    contribution:
      "Developed the LaserFlow rendering pipeline, grid repulsion physics, and custom visual theme controllers.",
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
