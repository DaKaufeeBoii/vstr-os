import type { ContextMenuGroupDef } from "../ContextMenuGroup";
import type { WindowId } from "@/types";

export interface IconMenuActions {
  id: WindowId | string;
  label: string;
  fluentIcon?: string;
  isOpenWindow?: boolean;
  isPinned?: boolean;
  isCustom?: boolean;
  onOpen: (id: string) => void;
  onMinimize?: (id: string) => void;
  onMaximize?: (id: string) => void;
  onRestore?: (id: string) => void;
  onCloseWindow?: (id: string) => void;
  onPin?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPropertyClick?: (id: string) => void;
}

export function getIconMenuGroups(actions: IconMenuActions): ContextMenuGroupDef[] {
  const groups: ContextMenuGroupDef[] = [
    {
      items: [
        {
          label: `Open ${actions.label}`,
          icon: actions.fluentIcon || "new",
          onClick: () => actions.onOpen(actions.id),
        },
      ],
    },
  ];

  // Window management group (only if currently open)
  if (actions.isOpenWindow) {
    groups.push({
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
          icon: "restore",
          onClick: () => actions.onRestore?.(actions.id),
        },
        {
          label: "Close",
          icon: "close",
          danger: true,
          onClick: () => actions.onCloseWindow?.(actions.id),
        },
      ],
    });
  }

  // Pin / Unpin group (only for system apps)
  if (!actions.isCustom) {
    groups.push({
      items: [
        actions.isPinned
          ? {
              label: "Unpin from Taskbar",
              icon: "unpin",
              onClick: () => actions.onPin?.(actions.id),
            }
          : {
              label: "Pin to Taskbar",
              icon: "pin",
              onClick: () => actions.onPin?.(actions.id),
            },
      ],
    });
  }

  // Delete for custom items
  if (actions.isCustom && actions.onDelete) {
    groups.push({
      items: [
        {
          label: "Delete",
          icon: "trash",
          danger: true,
          onClick: () => actions.onDelete?.(actions.id),
        },
      ],
    });
  }

  // Properties group
  groups.push({
    items: [
      {
        label: "Properties",
        icon: "properties",
        onClick: () => actions.onPropertyClick?.(actions.id),
      },
    ],
  });

  return groups;
}
