import type { ContextMenuGroupDef } from "../ContextMenuGroup";

interface DesktopMenuActions {
  refresh: () => void;
  openTerminal: () => void;
  openSettings: () => void;
}

export function getDesktopMenuGroups(actions: DesktopMenuActions): ContextMenuGroupDef[] {
  return [
    {
      items: [
        {
          label: "View",
          icon: "view",
          items: [
            { label: "Large icons", onClick: () => {} },
            { label: "Medium icons", onClick: () => {}, icon: "check" },
            { label: "Small icons", onClick: () => {} },
            { label: "Divider", disabled: true },
            { label: "Auto arrange icons", onClick: () => {} },
            { label: "Align icons to grid", onClick: () => {}, icon: "check" },
            { label: "Show desktop icons", onClick: () => {}, icon: "check" },
          ],
        },
        {
          label: "Sort by",
          icon: "sort",
          items: [
            { label: "Name", onClick: () => {} },
            { label: "Size", onClick: () => {} },
            { label: "Item type", onClick: () => {} },
            { label: "Date modified", onClick: () => {} },
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
            { label: "Folder", icon: "folder", onClick: () => {} },
            { label: "Shortcut", icon: "link", onClick: () => {} },
            { label: "Divider", disabled: true },
            { label: "Text Document", icon: "log", onClick: () => {} },
          ],
        },
      ],
    },
    {
      items: [
        {
          label: "Display settings",
          icon: "display",
          onClick: actions.openSettings,
        },
        {
          label: "Personalize",
          icon: "personalize",
          onClick: actions.openSettings,
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
          label: "Show more options",
          onClick: () => {},
        },
      ],
    },
  ];
}