export interface HotkeyDefinition {
  category: "navigation" | "general";
  id: string;
  keys: string;
  translationKey: string;
}

export const hotkeys: HotkeyDefinition[] = [
  {
    id: "command-palette",
    keys: "mod+k",
    translationKey: "commandPalette",
    category: "general",
  },
  {
    id: "toggle-sidebar",
    keys: "mod+b",
    translationKey: "toggleSidebar",
    category: "general",
  },
  {
    id: "toggle-agent",
    keys: "ctrl+`",
    translationKey: "toggleAgent",
    category: "general",
  },
  {
    id: "new-workspace",
    keys: "mod+n",
    translationKey: "newWorkspace",
    category: "general",
  },
  {
    id: "go-settings",
    keys: "g>s",
    translationKey: "goSettings",
    category: "navigation",
  },
  {
    id: "switch-terminal",
    keys: "mod+1..8",
    translationKey: "switchTerminal",
    category: "navigation",
  },
  {
    id: "toggle-fullscreen",
    keys: "F11",
    translationKey: "toggleFullscreen",
    category: "navigation",
  },
  {
    id: "show-hotkeys",
    keys: "?",
    translationKey: "showHotkeys",
    category: "general",
  },
];
