"use client";

import { terminalRegistry } from "@workspace/core/lib/terminal-registry";
import { useWorkspaceStore } from "@workspace/core/stores/workspace-store";
import { useEffect } from "react";

/**
 * Custom hook to manage terminal switching hotkeys (Ctrl+1..8 / Cmd+1..8).
 *
 * Dynamically checks the number of panes in the active workspace and focuses
 * the target terminal pane if it exists. Prevents default browser tab switching
 * behavior for valid shortcuts.
 */
export function useTerminalHotkeys() {
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const workspaces = useWorkspaceStore((s) => s.workspaces);
  const setActivePane = useWorkspaceStore((s) => s.setActivePane);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Detect Ctrl (Windows/Linux) or Cmd (macOS)
      const isMod = e.ctrlKey || e.metaKey;
      if (!isMod) {
        return;
      }

      // 2. Parse target digit 1..8
      const digit = Number.parseInt(e.key, 10);
      if (Number.isNaN(digit) || digit < 1 || digit > 8) {
        return;
      }

      // 3. Ignore if user is currently typing inside a non-terminal input/textarea
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA") &&
        !target.classList.contains("xterm-helper-textarea")
      ) {
        return;
      }

      if (!activeWorkspaceId) {
        return;
      }

      const activeWorkspace = workspaces.find(
        (w) => w.id === activeWorkspaceId
      );
      if (!activeWorkspace?.panes) {
        return;
      }

      const targetIndex = digit - 1;
      // 4. Validate that target terminal index exists in current workspace
      if (targetIndex >= 0 && targetIndex < activeWorkspace.panes.length) {
        const targetPane = activeWorkspace.panes[targetIndex];
        if (targetPane) {
          // Prevent browser default behavior (e.g. browser tab switching)
          e.preventDefault();
          e.stopPropagation();

          // Update active pane state in store for visual highlight
          setActivePane(activeWorkspaceId, targetPane.id);

          // Request xterm.js and DOM focus via terminal registry
          terminalRegistry.focusTerminal(targetPane.id);
        }
      }
    };

    // Use capture phase to intercept shortcuts before browser default handlers
    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, [activeWorkspaceId, workspaces, setActivePane]);
}
