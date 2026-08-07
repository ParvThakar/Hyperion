"use client";

import { TerminalPane } from "@workspace/core/components/terminal/terminal-pane";
import { useMounted } from "@workspace/core/hooks/use-mounted";
import { useWorkspaceStore } from "@workspace/core/stores/workspace-store";
import { cn } from "@workspace/ui/lib/utils";
import { AnimatePresence, motion } from "motion/react";

function getGridClass(count: number): string {
  switch (count) {
    case 1:
      return "grid-cols-1 grid-rows-1";
    case 2:
      return "grid-cols-2 grid-rows-1";
    case 3:
      return "grid-cols-2 grid-rows-2"; // 2x2 grid with 3rd pane spanning 2 cols
    case 4:
      return "grid-cols-2 grid-rows-2";
    case 5:
      return "grid-cols-6 grid-rows-2"; // 6-column grid for 3+2 layout
    case 6:
      return "grid-cols-3 grid-rows-2";
    case 7:
      return "grid-cols-12 grid-rows-2"; // 12-column grid for 4+3 layout
    case 8:
      return "grid-cols-4 grid-rows-2";
    default:
      return "grid-cols-1 grid-rows-1";
  }
}

function getPaneClass(totalCount: number, index: number): string {
  if (totalCount === 3) {
    return index === 2 ? "col-span-2" : "col-span-1";
  }
  if (totalCount === 5) {
    return index < 3 ? "col-span-2" : "col-span-3";
  }
  if (totalCount === 7) {
    return index < 4 ? "col-span-3" : "col-span-4";
  }
  return "";
}

export function TerminalGrid() {
  const mounted = useMounted();
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const workspaces = useWorkspaceStore((s) => s.workspaces);

  if (!mounted) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading terminals...</p>
      </div>
    );
  }

  if (workspaces.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center bg-background/50">
        <p className="text-muted-foreground text-sm">
          No workspaces yet. Create one to begin.
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col overflow-visible rounded-lg border border-border/30 bg-[#08080a] shadow-md">
      {workspaces.map((ws) => {
        const isActive = ws.id === activeWorkspaceId;
        const gridClass = getGridClass(ws.panes.length);

        return (
          <div
            className={cn(
              "absolute inset-0 grid gap-1.5 p-1.5 transition-all duration-300",
              gridClass,
              isActive
                ? "pointer-events-auto z-10 scale-100 opacity-100"
                : "pointer-events-none z-0 scale-[0.985] opacity-0"
            )}
            key={ws.id}
            style={{
              display: isActive ? "grid" : "none",
            }}
          >
            <AnimatePresence mode="popLayout">
              {ws.panes.map((pane, index) => (
                <motion.div
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    "h-full w-full",
                    getPaneClass(ws.panes.length, index)
                  )}
                  exit={{
                    opacity: 0,
                    scale: 0.95,
                    transition: { duration: 0.15 },
                  }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  key={pane.id}
                  layout
                  transition={{
                    layout: { type: "spring", stiffness: 300, damping: 28 },
                    opacity: { duration: 0.2 },
                    scale: { duration: 0.2 },
                  }}
                >
                  <TerminalPane
                    autoCommand={ws.autoCommand}
                    cwd={ws.directory}
                    directory={ws.directory}
                    id={pane.id}
                    index={index}
                    isActiveWorkspace={isActive}
                    name={pane.name}
                    title={`Terminal ${index + 1}`}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
