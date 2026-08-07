"use client";

import { hotkeys } from "@workspace/core/config/hotkeys";
import { useTerminalHotkeys } from "@workspace/core/hooks/use-terminal-hotkeys";
import { useCommandPaletteStore } from "@workspace/core/stores/command-palette-store";
import { useHotkeysDialogStore } from "@workspace/core/stores/hotkeys-store";
import { useWorkspaceStore } from "@workspace/core/stores/workspace-store";
import { useSidebar } from "@workspace/ui/components/sidebar";
import { panelController } from "@workspace/ui/lib/panel-controller";
import { useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";

interface UseAppHotkeysOptions {
  navigate: (path: string) => void;
}

export function useAppHotkeys({ navigate }: UseAppHotkeysOptions) {
  const { toggleSidebar } = useSidebar();
  const toggleHotkeysDialog = useHotkeysDialogStore((s) => s.toggle);
  const toggleCommandPalette = useCommandPaletteStore((s) => s.toggle);
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);

  // Terminal Switching Hotkeys (Ctrl/Cmd + 1..8)
  useTerminalHotkeys();

  // Toggle Main Agent (Ctrl + `)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Detect Ctrl (Windows/Linux) or Cmd (macOS)
      const isCtrl = e.ctrlKey || e.metaKey;
      if (!isCtrl) {
        return;
      }

      // 2. Check for backtick key
      if (e.key !== "`" && e.code !== "Backquote") {
        return;
      }

      // 3. Ignore auto-repeat key events (when key is held down)
      if (e.repeat) {
        return;
      }

      // 4. Ignore if typing inside standard non-terminal input/textarea/contenteditable
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable) &&
        !target.classList.contains("xterm-helper-textarea")
      ) {
        return;
      }

      // 5. Prevent default browser behavior & stop propagation
      e.preventDefault();
      e.stopPropagation();

      // 6. Execute Main Agent toggle (shares exact same logic as AppHeader toggle button)
      if (!activeWorkspaceId) {
        toast.error("Create a workspace first to use the Main Agent");
        return;
      }

      panelController.togglePanel("agent");
    };

    // Use capture phase to intercept shortcut before terminal or browser default handlers
    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, [activeWorkspaceId]);

  const getKeys = (id: string) => hotkeys.find((h) => h.id === id)?.keys || "";

  // Command Palette
  useHotkeys(
    getKeys("command-palette"),
    (e: KeyboardEvent) => {
      e.preventDefault();
      toggleCommandPalette();
    },
    { enableOnFormTags: false, delimiter: "|" }
  );

  // Toggle Sidebar
  useHotkeys(
    getKeys("toggle-sidebar"),
    (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleSidebar();
    },
    {
      enableOnFormTags: false,
      delimiter: "|",
      eventListenerOptions: {
        capture: true,
      },
    }
  );

  // Go to Settings
  useHotkeys(
    getKeys("go-settings"),
    (e: KeyboardEvent) => {
      e.preventDefault();
      navigate("/settings");
    },
    { enableOnFormTags: false }
  );

  // Show Keyboard Shortcuts
  useHotkeys(
    getKeys("show-hotkeys"),
    (e: KeyboardEvent) => {
      e.preventDefault();
      toggleHotkeysDialog();
    },
    { enableOnFormTags: false, useKey: true }
  );
}
