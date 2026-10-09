import type { ContextMenuGroupDef } from "../ContextMenuGroup";

export interface DesktopMenuState {
  iconSize: "small" | "medium" | "large";
  autoArrange: boolean;
  alignToGrid: boolean;
  showDesktopIcons: boolean;
  sortBy: "name" | "size" | "type" | "date" | null;
  showMoreOptions: boolean;
}

export interface DesktopMenuActions {
  // View
  setIconSize: (size: "small" | "medium" | "large") => void;
  toggleAutoArrange: () => void;
  toggleAlignToGrid: () => void;
  toggleShowDesktopIcons: () => void;

  // Sort by
  setSortBy: (sort: "name" | "size" | "type" | "date") => void;

  // Refresh
  refresh: () => void;

  // New
  newFolder: () => void;
  newShortcut: () => void;
  newTextDocument: () => void;

  // Settings & Navigation
  openDisplaySettings: () => void;
  openPersonalizeSettings: () => void;
  openTerminal: () => void;

  // Show more options
  toggleMoreOptions: () => void;
  nextWallpaper: () => void;
  openCommandPalette: () => void;
  openQuickSettings: () => void;
  openWidgetBoard: () => void;
  openTaskView: () => void;
  openProperties: () => void;
  openAbout: () => void;
}

export function getDesktopMenuGroups(
  state: DesktopMenuState,
  actions: DesktopMenuActions
): ContextMenuGroupDef[] {
  const baseGroups: ContextMenuGroupDef[] = [
    {
      items: [
        {
          label: "View",
          icon: "view",
          items: [
            {
              label: "Large icons",
              icon: state.iconSize === "large" ? "check" : undefined,
              onClick: () => actions.setIconSize("large"),
            },
            {
              label: "Medium icons",
              icon: state.iconSize === "medium" ? "check" : undefined,
              onClick: () => actions.setIconSize("medium"),
            },
            {
              label: "Small icons",
              icon: state.iconSize === "small" ? "check" : undefined,
              onClick: () => actions.setIconSize("small"),
            },
            { label: "Divider", disabled: true },
            {
              label: "Auto arrange icons",
              icon: state.autoArrange ? "check" : undefined,
              onClick: actions.toggleAutoArrange,
            },
            {
              label: "Align icons to grid",
              icon: state.alignToGrid ? "check" : undefined,
              onClick: actions.toggleAlignToGrid,
            },
            {
              label: "Show desktop icons",
              icon: state.showDesktopIcons ? "check" : undefined,
              onClick: actions.toggleShowDesktopIcons,
            },
          ],
        },
        {
          label: "Sort by",
          icon: "sort",
          items: [
            {
              label: "Name",
              icon: state.sortBy === "name" ? "check" : undefined,
              onClick: () => actions.setSortBy("name"),
            },
            {
              label: "Size",
              icon: state.sortBy === "size" ? "check" : undefined,
              onClick: () => actions.setSortBy("size"),
            },
            {
              label: "Item type",
              icon: state.sortBy === "type" ? "check" : undefined,
              onClick: () => actions.setSortBy("type"),
            },
            {
              label: "Date modified",
              icon: state.sortBy === "date" ? "check" : undefined,
              onClick: () => actions.setSortBy("date"),
            },
          ],
        },
        {
          label: "Refresh",
          icon: "refresh",
          onClick: actions.refresh,
        },
      ],
    },
    {
      items: [
        {
          label: "New",
          icon: "new",
          items: [
            { label: "Folder", icon: "folder", onClick: actions.newFolder },
            { label: "Shortcut", icon: "link", onClick: actions.newShortcut },
            { label: "Divider", disabled: true },
            { label: "Text Document", icon: "notepad", onClick: actions.newTextDocument },
          ],
        },
      ],
    },
    {
      items: [
        {
          label: "Display settings",
          icon: "display",
          onClick: actions.openDisplaySettings,
        },
        {
          label: "Personalize",
          icon: "personalize",
          onClick: actions.openPersonalizeSettings,
        },
      ],
    },
    {
      items: [
        {
          label: "Open in Terminal",
          icon: "terminal",
          onClick: actions.openTerminal,
        },
        {
          label: state.showMoreOptions ? "Show fewer options" : "Show more options",
          icon: "properties",
          onClick: actions.toggleMoreOptions,
        },
      ],
    },
  ];

  if (state.showMoreOptions) {
    baseGroups.push({
      label: "Classic Windows Options",
      items: [
        {
          label: "Next desktop background",
          icon: "photo",
          onClick: actions.nextWallpaper,
        },
        {
          label: "Command Palette (Ctrl+K)",
          icon: "search",
          onClick: actions.openCommandPalette,
        },
        {
          label: "Quick Settings (Win+A)",
          icon: "settings",
          onClick: actions.openQuickSettings,
        },
        {
          label: "Desktop Widgets (Alt+W)",
          icon: "widgets",
          onClick: actions.openWidgetBoard,
        },
        {
          label: "Task View (Alt+T)",
          icon: "windows",
          onClick: actions.openTaskView,
        },
        {
          label: "Desktop Properties",
          icon: "properties",
          onClick: actions.openProperties,
        },
        {
          label: "About VSTR-OS",
          icon: "info",
          onClick: actions.openAbout,
        },
      ],
    });
  }

  return baseGroups;
}