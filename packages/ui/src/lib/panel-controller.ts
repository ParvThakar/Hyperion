import * as React from "react";

type PanelId = "sidebar" | "agent";

const PANEL_TRANSITION_MS = 350;

interface PanelControllerState {
  openPanels: Record<PanelId, boolean>;
  pendingPanel: PanelId | null;
  transitionGeneration: number;
  transitionTimer: ReturnType<typeof globalThis.setTimeout> | null;
}

let currentState: PanelControllerState = {
  openPanels: {
    sidebar: true,
    agent: false,
  },
  pendingPanel: null,
  transitionTimer: null,
  transitionGeneration: 0,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function clearTransitionTimer() {
  if (currentState.transitionTimer !== null) {
    globalThis.clearTimeout(currentState.transitionTimer);
  }
}

function updateState(
  updater: (state: PanelControllerState) => PanelControllerState
) {
  currentState = updater(currentState);
  emit();
}

function closePanel(panel: PanelId) {
  if (
    currentState.pendingPanel !== null ||
    currentState.transitionTimer !== null
  ) {
    return;
  }

  clearTransitionTimer();

  const generation = currentState.transitionGeneration + 1;
  const timeoutId = globalThis.setTimeout(() => {
    if (currentState.transitionGeneration !== generation) {
      return;
    }

    updateState((state) => ({
      ...state,
      transitionTimer: null,
    }));
  }, PANEL_TRANSITION_MS);

  updateState((state) => ({
    ...state,
    openPanels: {
      ...state.openPanels,
      [panel]: false,
    },
    pendingPanel: null,
    transitionTimer: timeoutId,
    transitionGeneration: generation,
  }));
}

function requestPanel(panel: PanelId) {
  const { openPanels, pendingPanel, transitionTimer, transitionGeneration } =
    currentState;
  const otherPanel: PanelId = panel === "sidebar" ? "agent" : "sidebar";

  if (openPanels[panel]) {
    closePanel(panel);
    return;
  }

  if (pendingPanel !== null || transitionTimer !== null) {
    return;
  }

  if (openPanels[otherPanel]) {
    updateState((state) => ({
      ...state,
      openPanels: {
        ...state.openPanels,
        [otherPanel]: false,
      },
      pendingPanel: panel,
      transitionTimer: null,
      transitionGeneration: state.transitionGeneration + 1,
    }));

    const generation = transitionGeneration + 1;
    const timeoutId = globalThis.setTimeout(() => {
      if (currentState.transitionGeneration !== generation) {
        return;
      }

      updateState((state) => ({
        ...state,
        openPanels: {
          ...state.openPanels,
          [panel]: true,
        },
        pendingPanel: null,
        transitionTimer: null,
      }));
    }, PANEL_TRANSITION_MS);

    updateState((state) => ({
      ...state,
      transitionTimer: timeoutId,
    }));
    return;
  }

  const generation = transitionGeneration + 1;
  const timeoutId = globalThis.setTimeout(() => {
    if (currentState.transitionGeneration !== generation) {
      return;
    }

    updateState((state) => ({
      ...state,
      transitionTimer: null,
    }));
  }, PANEL_TRANSITION_MS);

  updateState((state) => ({
    ...state,
    openPanels: {
      ...state.openPanels,
      [panel]: true,
    },
    pendingPanel: null,
    transitionTimer: timeoutId,
    transitionGeneration: generation,
  }));
}

function togglePanel(panel: PanelId) {
  if (currentState.openPanels[panel]) {
    closePanel(panel);
    return;
  }

  requestPanel(panel);
}

function isOpen(panel: PanelId) {
  return currentState.openPanels[panel];
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return currentState;
}

export const panelController = {
  closePanel,
  getSnapshot,
  isOpen,
  requestPanel,
  subscribe,
  togglePanel,
};

export function usePanelControllerStore<T>(
  selector: (state: PanelControllerState) => T
): T {
  return React.useSyncExternalStore(
    subscribe,
    () => selector(getSnapshot()),
    () => selector(getSnapshot())
  );
}

export { PANEL_TRANSITION_MS };
