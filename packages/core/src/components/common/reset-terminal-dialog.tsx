"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface ResetTerminalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  terminalName?: string;
  terminalTitle: string;
}

export function ResetTerminalDialog({
  isOpen,
  onClose,
  onConfirm,
  terminalTitle,
  terminalName,
}: ResetTerminalDialogProps) {
  const displayName = terminalName
    ? `${terminalName} (${terminalTitle})`
    : terminalTitle;

  return (
    <Dialog onOpenChange={(open) => !open && onClose()} open={isOpen}>
      <DialogContent className="max-w-md border-border/30 bg-[#0c0c0e] p-6 shadow-2xl">
        <DialogHeader className="gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20">
            <AlertTriangle className="size-5" />
          </div>
          <div className="space-y-1">
            <DialogTitle className="font-bold text-foreground text-base tracking-tight">
              Reset Shell Session?
            </DialogTitle>
            <DialogDescription className="text-muted-foreground/80 text-xs leading-relaxed">
              This terminal (
              <strong className="font-mono text-foreground">
                {displayName}
              </strong>
              ) currently has an active running process.
              <br />
              <br />
              Resetting will terminate the current session and any running
              commands. This action cannot be undone.
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="mt-4 gap-2 sm:justify-end">
          <Button
            className="h-8.5 text-xs transition-colors hover:bg-muted/50"
            onClick={onClose}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            autoFocus
            className="h-8.5 bg-amber-600 font-bold text-white text-xs shadow-amber-900/30 shadow-md transition-all hover:bg-amber-700 hover:shadow-amber-900/50"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            type="button"
          >
            <RotateCcw className="mr-1.5 size-3.5" />
            Reset Terminal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
