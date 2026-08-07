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
import { AlertTriangle, Trash2 } from "lucide-react";

interface DeleteTerminalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  terminalName?: string;
  terminalTitle: string;
}

export function DeleteTerminalDialog({
  isOpen,
  onClose,
  onConfirm,
  terminalTitle,
  terminalName,
}: DeleteTerminalDialogProps) {
  const displayName = terminalName
    ? `${terminalName} (${terminalTitle})`
    : terminalTitle;

  return (
    <Dialog onOpenChange={(open) => !open && onClose()} open={isOpen}>
      <DialogContent className="max-w-md border-border/30 bg-[#0c0c0e] p-6 shadow-2xl">
        <DialogHeader className="gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 ring-1 ring-rose-500/20">
            <AlertTriangle className="size-5" />
          </div>
          <div className="space-y-1">
            <DialogTitle className="font-bold text-foreground text-base tracking-tight">
              Delete Terminal?
            </DialogTitle>
            <DialogDescription className="text-muted-foreground/80 text-xs leading-relaxed">
              Are you sure you want to close{" "}
              <strong className="font-mono text-foreground">
                {displayName}
              </strong>
              ? Any running processes inside this terminal session may be
              terminated.
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
            className="h-8.5 bg-rose-600 font-bold text-white text-xs shadow-md shadow-rose-900/30 transition-all hover:bg-rose-700 hover:shadow-rose-900/50"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            type="button"
          >
            <Trash2 className="mr-1.5 size-3.5" />
            Delete Terminal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
