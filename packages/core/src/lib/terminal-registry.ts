export interface RegisteredTerminal {
  containerEl?: HTMLDivElement | null;
  focus: () => void;
  id: string;
}

class TerminalRegistry {
  private terminals = new Map<string, RegisteredTerminal>();

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
}

export const terminalRegistry = new TerminalRegistry();
