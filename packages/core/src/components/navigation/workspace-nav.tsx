"use client";

import { useMounted } from "@workspace/core/hooks/use-mounted";
import {
  useWorkspaceStore,
  type Workspace,
} from "@workspace/core/stores/workspace-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui/components/sidebar";
import { cn } from "@workspace/ui/lib/utils";
import {
  Copy,
  Edit2,
  LayoutGrid,
  MoreHorizontal,
  Pin,
  PinOff,
  Plus,
  Terminal,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface WorkspaceNavProps {
  navigate: (path: string) => void;
  onNewWorkspace: () => void;
}

export function WorkspaceNav({ navigate, onNewWorkspace }: WorkspaceNavProps) {
  const mounted = useMounted();
  const { isMobile, setOpenMobile } = useSidebar();
  const {
    workspaces,
    activeWorkspaceId,
    setActiveWorkspace,
    deleteWorkspace,
    duplicateWorkspace,
    renameWorkspace,
    togglePinWorkspace,
  } = useWorkspaceStore();

  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const handleSelect = useCallback(
    (id: string) => {
      setActiveWorkspace(id);
      if (isMobile) {
        setOpenMobile(false);
      }
      navigate("/workspace");
    },
    [isMobile, setOpenMobile, navigate, setActiveWorkspace]
  );

  const handleRenameSave = (id: string) => {
    const trimmed = renameValue.trim();
    if (trimmed) {
      renameWorkspace(id, trimmed);
    }
    setRenamingId(null);
  };

  if (!mounted) {
    return null;
  }

  const pinnedWorkspaces = workspaces.filter((w) => w.isPinned);
  const regularWorkspaces = workspaces.filter((w) => !w.isPinned);

  const renderWorkspaceItem = (ws: Workspace) => {
    const isActive = ws.id === activeWorkspaceId;
    return (
      <SidebarMenuItem className="group/item relative px-1.5" key={ws.id}>
        {isActive && (
          <motion.div
            className="absolute top-1.5 bottom-1.5 left-0 z-20 w-[3px] rounded-full bg-primary shadow-[0_0_10px_var(--primary),0_0_20px_var(--primary)]"
            layoutId="activeWorkspaceIndicator"
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          />
        )}

        {renamingId === ws.id ? (
          <div className="flex h-10 w-full items-center gap-2 px-3">
            <input
              autoFocus
              className="flex-1 rounded-md border border-primary/50 bg-background/80 px-2 py-1 font-sans text-foreground text-xs outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              onBlur={() => handleRenameSave(ws.id)}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleRenameSave(ws.id);
                } else if (e.key === "Escape") {
                  setRenamingId(null);
                }
              }}
              value={renameValue}
            />
          </div>
        ) : (
          <>
            <div
              className={cn(
                "relative flex h-9 w-full cursor-default items-center justify-start gap-2 rounded-md px-3 font-medium transition-colors duration-200 select-none group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
              onClick={() => handleSelect(ws.id)}
            >
              <Terminal
                className={cn(
                  "size-4 shrink-0 transition-all duration-200",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground/60"
                )}
              />
              <span className="min-w-0 shrink truncate text-sm group-data-[collapsible=icon]:hidden">
                {ws.name}
              </span>

              {/* Terminal count pill */}
              <span
                className={cn(
                  "flex h-4 min-w-[16px] shrink-0 items-center justify-center rounded-full px-1 font-bold font-mono text-[10px] transition-all duration-200 group-data-[collapsible=icon]:hidden",
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground/70"
                )}
              >
                {ws.terminalCount}
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild={true}>
                <SidebarMenuAction
                  className={cn(
                    "!right-2 !top-1.5 size-6 rounded-md transition-all duration-200 aria-expanded:opacity-100",
                    isActive
                      ? "opacity-100 !text-primary-foreground peer-data-active/menu-button:!text-primary-foreground hover:!bg-primary-foreground/15 aria-expanded:!bg-primary-foreground/15"
                      : "opacity-0 group-hover/item:opacity-100 text-muted-foreground group-hover/item:text-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground"
                  )}
                  showOnHover={!isActive}
                >
                  <MoreHorizontal className="size-4" />
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align={isMobile ? "end" : "start"}
                className="w-48 border-border/60 bg-popover backdrop-blur-xl"
                side={isMobile ? "bottom" : "right"}
              >
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePinWorkspace(ws.id);
                    toast.success(
                      ws.isPinned ? "Workspace unpinned" : "Workspace pinned"
                    );
                  }}
                >
                  {ws.isPinned ? (
                    <>
                      <PinOff className="mr-2 size-3.5 text-muted-foreground" />
                      <span>Unpin Workspace</span>
                    </>
                  ) : (
                    <>
                      <Pin className="mr-2 size-3.5 text-muted-foreground" />
                      <span>Pin Workspace</span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setRenamingId(ws.id);
                    setRenameValue(ws.name);
                  }}
                >
                  <Edit2 className="mr-2 size-3.5 text-muted-foreground" />
                  <span>Rename</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateWorkspace(ws.id);
                    toast.success("Workspace duplicated successfully");
                  }}
                >
                  <Copy className="mr-2 size-3.5 text-muted-foreground" />
                  <span>Duplicate</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/40" />
                <DropdownMenuItem
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteWorkspace(ws.id);
                    toast.success("Workspace deleted");
                  }}
                >
                  <Trash2 className="mr-2 size-3.5" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </SidebarMenuItem>
    );
  };

  return (
    <SidebarGroup className="px-2">
      <div className="flex items-center justify-between px-2 py-2 group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel className="font-bold text-micro-uppercase text-muted-foreground/60 tracking-widest">
          Workspaces
        </SidebarGroupLabel>
        <button
          className="flex size-5 items-center justify-center rounded-md text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
          onClick={onNewWorkspace}
          title="New Workspace"
          type="button"
        >
          <Plus className="size-3.5 transition-transform duration-200 hover:rotate-90" />
        </button>
      </div>

      <SidebarMenu className="mt-1 gap-1.5">
        <SidebarMenuItem className="px-1.5">
          <SidebarMenuButton
            className={cn(
              "relative h-9 w-full justify-start gap-2.5 rounded-md border font-semibold transition-all duration-200 ease-out active:scale-[0.97]",
              "border-primary/25 bg-primary/10 text-primary shadow-xs hover:border-primary/45 hover:bg-primary/15 hover:text-primary",
              "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
            )}
            onClick={onNewWorkspace}
            tooltip="New Workspace"
          >
            <Plus className="size-4 shrink-0 transition-transform duration-200 ease-out group-hover/menu-button:rotate-90 group-hover/menu-button:scale-110" />
            <span className="select-none font-semibold text-xs uppercase tracking-wider group-data-[collapsible=icon]:hidden">
              New Workspace
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        {workspaces.length === 0 ? (
          <div className="mt-2 flex flex-col items-center justify-center rounded-lg border border-border/20 border-dashed bg-muted/5 px-4 py-10 text-center group-data-[collapsible=icon]:hidden">
            <LayoutGrid className="mb-2 size-6 animate-pulse text-muted-foreground/30" />
            <p className="max-w-[150px] text-[11px] text-muted-foreground/50 leading-normal">
              No workspaces yet. Create one to begin.
            </p>
          </div>
        ) : (
          <div className="mt-2.5 space-y-4">
            {pinnedWorkspaces.length > 0 && (
              <div className="space-y-1">
                <div className="select-none px-3 font-semibold text-micro-uppercase text-muted-foreground/60 tracking-widest group-data-[collapsible=icon]:hidden">
                  Pinned
                </div>
                {pinnedWorkspaces.map(renderWorkspaceItem)}
              </div>
            )}

            {regularWorkspaces.length > 0 && (
              <div className="space-y-1">
                <div className="select-none px-3 font-semibold text-micro-uppercase text-muted-foreground/60 tracking-widest group-data-[collapsible=icon]:hidden">
                  Active
                </div>
                {regularWorkspaces.map(renderWorkspaceItem)}
              </div>
            )}
          </div>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
