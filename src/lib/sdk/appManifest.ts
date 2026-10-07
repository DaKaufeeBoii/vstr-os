/**
 * appManifest.ts
 *
 * Types and schema for VSTR-OS Application SDK and Plugin System.
 */

import type { WindowId } from "@/types";

export type AppPermission =
  | "vfs:read"
  | "vfs:write"
  | "notifications"
  | "window:manage"
  | "system:telemetry";

export type AppCategory =
  | "system"
  | "productivity"
  | "developer"
  | "utilities"
  | "network";

export interface AppManifest {
  id: WindowId | string;
  name: string;
  version: string;
  description: string;
  author: string;
  category: AppCategory;
  icon: string;
  fluentIcon?: string;
  permissions: AppPermission[];
  defaultConfig: {
    width: number;
    height: number;
    minWidth?: number;
    minHeight?: number;
    allowMultipleInstances?: boolean;
  };
  entrypoint?: string;
}

export interface SDKContext {
  manifest: AppManifest;
  hasPermission: (permission: AppPermission) => boolean;
  fs: {
    readFile: (path: string) => Promise<string>;
    writeFile: (path: string, content: string) => Promise<any>;
  };
  notify: (title: string, message: string, icon?: string) => void;
  windows: {
    open: (id: WindowId, data?: any) => void;
    close: (instanceId: string) => void;
  };
}
