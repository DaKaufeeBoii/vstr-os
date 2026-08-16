import type { ContextMenuGroupDef } from "../ContextMenuGroup";

interface TaskbarMenuActions {
  openSettings: () => void;
  showDesktop: () => void;
  openTaskManager: () => void;
}

export function getTaskbarMenuGroups(actions: TaskbarMenuActions): ContextMenuGroupDef[] {
  return [
    {
      items: [
        {
          label: "Taskbar settings",
          icon: "settings",
          onClick: actions.openSettings,
        },
        {
          label: "Task Manager",
          icon: "terminal",
          onClick: actions.openTaskManager,
        },
      ],
    },
    {
      items: [
        {
          label: "Show the desktop",
          icon: "display",
          onClick: actions.showDesktop,
        },
      ],
    },
  ];
}
