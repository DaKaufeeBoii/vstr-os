import type { ContextMenuGroupDef } from "../ContextMenuGroup";
import type { WindowId } from "@/types";

interface IconMenuActions {
  id: WindowId;
  label: string;
  fluentIcon?: string;
  onOpen: (id: WindowId) => void;
  onClose?: (id: WindowId) => void;
  onPin?: (id: WindowId) => void;
  onMinimize?: (id: WindowId) => void;
  onMaximize?: (id: WindowId) => void;
  onRestore?: (id: WindowId) => void;
  onCloseWindow?: (id: WindowId) => void;
}

export function getIconMenuGroups(actions: IconMenuActions): ContextMenuGroupDef[] {
  return [
    {
      items: [
        {
          label: `Open ${actions.label}`,
          icon: actions.fluentIcon,
          onClick: () => actions.onOpen(actions.id),
        },
      ],
    },
    {
      items: [
        {
          label: "Minimize",
          icon: "minimize",
          onClick: () => actions.onMinimize?.(actions.id),
        },
        {
          label: "Maximize",
          icon: "maximize",
          onClick: () => actions.onMaximize?.(actions.id),
        },
        {
          label: "Restore",
          icon: "maximize",
          onClick: () => actions.onRestore?.(actions.id),
        },
        {
          label: "Close",
          icon: "close",
          onClick: () => actions.onCloseWindow?.(actions.id),
        },
      ],
    },
    {
      items: [
        {
          label: "Pin to Taskbar",
          icon: "pin",
          onClick: () => actions.onPin?.(actions.id),
        },
        {
          label: "Unpin from Taskbar",
          icon: "unpin",
          onClick: () => actions.onPin?.(actions.id),
        },
      ],
    },
    {
      items: [
        {
          label: "Properties",
          icon: "info",
          onClick: () => {},
        },
      ],
    },
  ];
}
