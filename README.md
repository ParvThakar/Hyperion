<div align="center">

# 🪐 Hyperion

**Production-Grade Cross-Platform Starter & Parallel AI Agent Workspace**

[![Live Website](https://img.shields.io/badge/Website-hyperions.bond-6366f1.svg)](https://hyperions.bond)
[![Main Repository](https://img.shields.io/badge/GitHub-Malaybhai11%2Fhyperionweb-black.svg?logo=github)](https://github.com/Malaybhai11/hyperionweb.git)
[![License: MIT](https://img.shields.io/badge/License-MIT-6366f1.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![Tauri](https://img.shields.io/badge/Tauri-2.x-orange.svg)](https://tauri.app/)
[![pnpm](https://img.shields.io/badge/pnpm-10.x-orange.svg)](https://pnpm.io/)

</div>

---

> **Build cross-platform applications from a single codebase & orchestrate parallel AI coding agents.**
>
> Hyperion is both a production-grade cross-platform starter template and a powerful agentic workspace environment. One unified codebase ships seamlessly to **Web (Next.js 16 SSR + PWA)**, **Desktop (Tauri 2 on Windows, macOS, Linux)**, and **Mobile (Android, iOS)**.

🌐 **Live Demo & Site:** [hyperions.bond](https://hyperions.bond)  
📦 **Main Repository:** [github.com/Malaybhai11/hyperionweb](https://github.com/Malaybhai11/hyperionweb.git)

---

## 🚀 Key Highlights & Architecture

- ⚡ **Single Codebase, All Platforms**: Standard Next.js 16 for Web (SSR) and static HTML export for Tauri 2 (Native Desktop & Mobile) loading into a Rust-backed system webview.
- 🎨 **40+ OKLCh Color Themes**: Instant theme switching with light/dark variants built into `@workspace/ui` using Tailwind CSS v4 and shadcn/ui.
- 🌍 **Type-Safe i18n**: Multi-language support across 10 languages (`de`, `en`, `es`, `fr`, `it`, `ja`, `pt`, `ru`, `tr`, `zh`) powered by `next-intl`.
- 🗂️ **Multi-Workspace Agent Environment**: Isolated project spaces with workspace-scoped terminal grids, agent pools, kanban task boards, and versioned prompt forge.
- 🤖 **Parallel AI Agent Orchestration**: Run multiple AI coding agents simultaneously in terminal panes, assign tasks via drag-and-drop, and orchestrate agent swarms.
- 🛠️ **CLI Scaffolder**: Scaffold projects directly via `create-hyperion` CLI published to npm (`npm create hyperion@latest`).
- ⚡ **Monorepo Powered by Turborepo & pnpm**: Lightning-fast builds, strict workspace boundaries, zero runtime cross-contamination.

---

## 📦 Monorepo Structure

```
.
├── apps/
│   ├── web/                # Next.js 16 (SSR), Landing page, Docs (Fumadocs), PWA (Serwist)
│   └── native/             # Next.js 16 (Static Export) + Tauri 2 (Desktop & Mobile)
│
├── packages/
│   ├── core/               # Shared business logic: pages, components, hooks, stores, providers
│   ├── ui/                 # Design system: shadcn/ui primitives, 40+ OKLCh themes, global CSS
│   ├── i18n/               # Type-safe translations for 10 languages (next-intl)
│   ├── cli/                # Scaffolding CLI (`create-hyperion`)
│   └── typescript-config/  # Shared tsconfig presets
│
└── content/                # Documentation & MDX contents
```

### Dependency Flow

```
apps/web  &  apps/native
  └── @workspace/core
        ├── @workspace/ui
        └── @workspace/i18n
```

---

## ✨ Workspace & Agent Features

### 🗂️ Multi-Workspace Isolation
Create self-contained workspaces per project in the sidebar. Switching workspaces instantly updates the active terminal grid, agent pool, task board, and prompt forge with zero cross-contamination.

### 🤖 Terminal Multiplexer & Agent Grid
- Run multiple AI agents concurrently, each in a dedicated terminal pane.
- Tiled xterm.js terminal panes with split horizontal/vertical support.
- Real-time output streaming with full PTY process control.

### 📋 Interactive Task Board (Kanban)
- Drag-and-drop task assignment to agents via `@dnd-kit`.
- Real-time progress and status updates streaming from agent processes back to the task board.

### ⚡ Prompt Forge
- Version-controlled agent prompt templates per workspace.
- Iterate, refine, and attach prompts directly to Kanban tasks.

---

## 🛠️ Stack & Technologies

| Layer | Technology | Purpose |
|:------|:-----------|:--------|
| **Web App** | Next.js 16, Fumadocs, Serwist | SSR web application, docs, and PWA |
| **Native App** | Tauri 2 (Rust) + Next.js Static Export | Windows, macOS, Linux, Android, iOS |
| **UI & Styling** | React 19, Tailwind CSS v4, shadcn/ui, GSAP, Three.js / OGL | Modern responsive design with 40+ OKLCh themes |
| **State Management** | Zustand + localStorage persistence | Workspace, terminal, task, and agent state |
| **Terminal & Realtime** | xterm.js, node-pty, WebSockets | Scoped terminal grids and live process streams |
| **i18n** | next-intl | Type-safe internationalization (10 languages) |
| **Tooling & Linter** | Turborepo, pnpm v10, Biome / Ultracite | Monorepo task runner, strict zero-config linter & formatter |

---

## 💻 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) v10+ (enable via `corepack enable`)
- [Rust](https://www.rust-lang.org/tools/install) (required for native desktop & mobile builds)

### Setup & Installation

```bash
# Clone the main repository
git clone https://github.com/Malaybhai11/hyperionweb.git
cd hyperionweb

# Install dependencies across monorepo (always use pnpm)
pnpm install

# Run web app & native app in parallel
pnpm dev

# Run individual targets
pnpm web dev       # Web only (http://localhost:3002)
pnpm tauri dev     # Desktop (Tauri 2)
```

---

## 📜 Available Commands

Run all scripts from the repository root:

```bash
# Development
pnpm dev                  # Starts web + native in parallel
pnpm web dev              # Web target only
pnpm tauri dev            # Desktop target (Tauri)
pnpm tauri android dev    # Android dev target
pnpm tauri ios dev        # iOS dev target

# Quality & Verification
pnpm check                # Biome / Ultracite lint & format check
pnpm fix                  # Auto-fix lint & formatting issues
pnpm typecheck            # Run TypeScript typechecks across workspaces
pnpm build                # Production build for all apps and packages

# Utilities
pnpm clean                # Clean build artifacts (.next, .turbo, dist, out)
pnpm shadcn add <component> # Add shadcn/ui component to packages/ui
pnpm deps:check           # Check outdated dependencies
pnpm deps:update          # Interactively update dependencies
```

---

## 🌐 Deployment & Official Links

- **Live Website:** [https://hyperions.bond](https://hyperions.bond)
- **GitHub Repository:** [https://github.com/Malaybhai11/hyperionweb.git](https://github.com/Malaybhai11/hyperionweb.git)
- **Scaffold CLI (npm):** `npm create hyperion@latest`

---

## 🤝 Contributing

Contributions are welcome! Please make sure to follow Conventional Commits guidelines for commit messages (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `perf:`).

```bash
# Check code before committing
pnpm check
pnpm typecheck
```

---

## 📄 License

[MIT](LICENSE) © [Hyperion Team](https://github.com/Malaybhai11/hyperionweb)

