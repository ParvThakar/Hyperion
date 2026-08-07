export interface RegisteredTerminal {
  containerEl?: HTMLDivElement | null;
  fit?: () => void;
  focus: () => void;
  id: string;
}

class TerminalRegistry {
  private readonly terminals = new Map<string, RegisteredTerminal>();
  private batchTimer: ReturnType<typeof setTimeout> | null = null;
  private isTransitioning = false;

  register(id: string, entry: RegisteredTerminal) {
    this.terminals.set(id, entry);
  }

  unregister(id: string) {
    this.terminals.delete(id);
  }

  focusTerminal(id: string) {
    const entry = this.terminals.get(id);
    if (entry) {
      // 1. Focus xterm.js instance
      entry.focus();
      // 2. Focus container element if not already focused
      if (entry.containerEl && document.activeElement !== entry.containerEl) {
        entry.containerEl.focus({ preventScroll: true });
      }
    }
  }

  getTerminal(id: string) {
    return this.terminals.get(id);
  }

  setTransitioning(transitioning: boolean) {
    this.isTransitioning = transitioning;
  }

  getIsTransitioning() {
    return this.isTransitioning;
  }

  fitAllTerminals() {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
    requestAnimationFrame(() => {
      for (const entry of this.terminals.values()) {
        try {
          entry.fit?.();
        } catch {
          // ignore fit errors during unmount or hidden states
        }
      }
    });
  }

  scheduleBatchFit(delay = 100) {
    if (this.isTransitioning) {
      return;
    }
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
    }
    this.batchTimer = setTimeout(() => {
      this.batchTimer = null;
      this.fitAllTerminals();
    }, delay);
  }
}

export const terminalRegistry = new TerminalRegistry();
