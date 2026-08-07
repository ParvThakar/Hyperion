"use client";

import { terminalRegistry } from "@workspace/core/lib/terminal-registry";
import { safeUUID } from "@workspace/core/lib/uuid";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface TerminalPane {
  id: string;
  name?: string;
  title: string;
}

const FRIENDLY_NAMES = [
  "Nova",
  "Pixel",
  "Sage",
  "Echo",
  "Zelda",
  "Cosmo",
  "Nimbus",
  "Rune",
  "Ember",
  "Lark",
  "Ella",
  "Theo",
  "Vela",
  "Koda",
  "Zara",
  "Orin",
  "Luna",
  "Juno",
  "Remy",
  "Dax",
  "Iris",
  "Faye",
  "Wren",
  "Sola",
  "Kai",
];

export interface Workspace {
  autoCommand?: string;
  createdAt: number;
  directory?: string;
  id: string;
  isPinned?: boolean;
  name: string;
  panes: TerminalPane[];
  terminalCount: number;
}

interface WorkspaceState {
  activePaneIds: Record<string, string>;
  activeWorkspaceId: string | null;
  createWorkspace: (
    name: string,
    terminalCount: number,
    directory?: string,
    autoCommand?: string
  ) => Workspace;
  deleteTerminalPane: (workspaceId: string, paneId: string) => void;
  deleteWorkspace: (id: string) => void;
  duplicateWorkspace: (id: string) => void;
  recentDirectories: string[];
  renameWorkspace: (id: string, name: string) => void;
  setActivePane: (workspaceId: string, paneId: string) => void;
  setActiveWorkspace: (id: string) => void;
  togglePinWorkspace: (id: string) => void;
  workspaces: Workspace[];
}

function generateId(): string {
  return safeUUID();
}

function createPanes(count: number): TerminalPane[] {
  const maxOffset = FRIENDLY_NAMES.length - count;
  const offset = maxOffset > 0 ? Math.floor(Math.random() * maxOffset) : 0;
  return Array.from({ length: count }, (_, i) => ({
    id: generateId(),
    title: `Terminal ${i + 1}`,
    name: FRIENDLY_NAMES[(offset + i) % FRIENDLY_NAMES.length],
  }));
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      activeWorkspaceId: null,
      activePaneIds: {},
      workspaces: [],
      recentDirectories: [],
      createWorkspace: (
        name: string,
        terminalCount: number,
        directory?: string,
        autoCommand?: string
      ) => {
        const clamped = Math.min(8, Math.max(1, terminalCount));
        const workspace: Workspace = {
          createdAt: Date.now(),
          id: generateId(),
          name,
          terminalCount: clamped,
          panes: createPanes(clamped),
          directory,
          autoCommand,
          isPinned: false,
        };
        set((state) => {
          const currentRecent = state.recentDirectories || [];
          let updatedRecent = currentRecent;
          if (directory) {
            updatedRecent = [
              directory,
              ...currentRecent.filter((d) => d !== directory),
            ].slice(0, 5);
          }
          const firstPaneId = workspace.panes[0]?.id;
          return {
            activeWorkspaceId: workspace.id,
            activePaneIds: firstPaneId
              ? { ...state.activePaneIds, [workspace.id]: firstPaneId }
              : state.activePaneIds,
            workspaces: [...state.workspaces, workspace],
            recentDirectories: updatedRecent,
          };
        });
        return workspace;
      },
      deleteTerminalPane: (workspaceId: string, paneId: string) => {
        let resultNextActivePaneId: string | undefined;

        set((state) => {
          const workspace = state.workspaces.find((w) => w.id === workspaceId);
          if (!workspace || workspace.panes.length <= 1) {
            return state;
          }

          const targetIndex = workspace.panes.findIndex((p) => p.id === paneId);
          if (targetIndex === -1) {
            return state;
          }

          const newPanes = workspace.panes
            .filter((p) => p.id !== paneId)
            .map((p, idx) => ({
              ...p,
              title: `Terminal ${idx + 1}`,
            }));

          // Determine next active terminal pane
          const currentActiveId = state.activePaneIds[workspaceId];
          let nextActiveId = currentActiveId;

          if (currentActiveId === paneId || !currentActiveId) {
            // Priority: Next terminal if available, otherwise Previous terminal
            const nextPane =
              newPanes[targetIndex] || newPanes[targetIndex - 1] || newPanes[0];
            nextActiveId = nextPane?.id;
          }

          resultNextActivePaneId = nextActiveId;

          // Close backend PTY process for deleted terminal
          import("@tauri-apps/api/core")
            .then(({ isTauri, invoke }) => {
              if (isTauri()) {
                invoke("close_terminal", { id: paneId }).catch(() => {
                  /* ignore */
                });
              }
            })
            .catch(() => {
              /* ignore */
            });

          return {
            activePaneIds: nextActiveId
              ? { ...state.activePaneIds, [workspaceId]: nextActiveId }
              : state.activePaneIds,
            workspaces: state.workspaces.map((w) =>
              w.id === workspaceId
                ? { ...w, panes: newPanes, terminalCount: newPanes.length }
                : w
            ),
          };
        });

        // Automatically move focus and cursor to the next active terminal
        if (resultNextActivePaneId) {
          const targetId = resultNextActivePaneId;
          setTimeout(() => {
            terminalRegistry.focusTerminal(targetId);
          }, 60);
        }
      },
      deleteWorkspace: (id: string) => {
        set((state) => {
          const workspace = state.workspaces.find((w) => w.id === id);
          if (workspace) {
            import("@tauri-apps/api/core")
              .then(({ isTauri, invoke }) => {
                if (isTauri()) {
                  for (const pane of workspace.panes) {
                    invoke("close_terminal", { id: pane.id }).catch(() => {
                      /* ignore */
                    });
                  }
                }
              })
              .catch(() => {
                /* ignore */
              });
          }

          const remaining = state.workspaces.filter((w) => w.id !== id);
          return {
            activeWorkspaceId:
              state.activeWorkspaceId === id
                ? (remaining[0]?.id ?? null)
                : state.activeWorkspaceId,
            workspaces: remaining,
          };
        });
      },
      duplicateWorkspace: (id: string) => {
        set((state) => {
          const workspace = state.workspaces.find((w) => w.id === id);
          if (!workspace) {
            return {};
          }
          const duplicated: Workspace = {
            ...workspace,
            id: generateId(),
            createdAt: Date.now(),
            name: `${workspace.name} (Copy)`,
            panes: createPanes(workspace.terminalCount),
            isPinned: false,
          };
          return {
            workspaces: [...state.workspaces, duplicated],
            activeWorkspaceId: duplicated.id,
          };
        });
      },
      renameWorkspace: (id: string, name: string) => {
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === id ? { ...w, name } : w
          ),
        }));
      },
      setActivePane: (workspaceId: string, paneId: string) => {
        set((state) => ({
          activePaneIds: { ...state.activePaneIds, [workspaceId]: paneId },
        }));
      },
      setActiveWorkspace: (id: string) => {
        set({ activeWorkspaceId: id });
      },
      togglePinWorkspace: (id: string) => {
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === id ? { ...w, isPinned: !w.isPinned } : w
          ),
        }));
      },
    }),
    {
      name: "hyperion-workspaces-v2",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
