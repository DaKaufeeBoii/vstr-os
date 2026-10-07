"use client";

/**
 * useAppSDK.ts
 *
 * React hook exposing sandboxed OS capabilities to apps adhering to their manifest permissions.
 */

import { useMemo, useCallback } from "react";
import { appRegistry } from "./appRegistry";
import type { AppPermission, SDKContext } from "./appManifest";
import { useVFS } from "@/lib/vfs/useVFS";
import { useOSSettings } from "@/store/osSettingsStore";
import { useOS } from "@/store/windowStore";
import type { WindowId } from "@/types";

export function useAppSDK(appId: string): SDKContext {
  const manifest = useMemo(() => {
    return (
      appRegistry.getApp(appId) ?? {
        id: appId,
        name: appId,
        version: "1.0.0",
        description: "Unregistered or dynamic guest application",
        author: "Unknown",
        category: "utilities" as const,
        icon: "📦",
        permissions: [] as AppPermission[],
        defaultConfig: { width: 600, height: 400 },
      }
    );
  }, [appId]);

  const vfs = useVFS();
  const { addNotification } = useOSSettings();
  const { openWindow, closeWindow } = useOS();

  const hasPermission = useCallback(
    (permission: AppPermission): boolean => {
      return manifest.permissions.includes(permission);
    },
    [manifest.permissions]
  );

  const readFile = useCallback(
    async (path: string): Promise<string> => {
      if (!hasPermission("vfs:read")) {
        throw new Error(`[SDK SecurityException] App '${manifest.name}' lacks 'vfs:read' permission.`);
      }
      return vfs.readFile(path);
    },
    [hasPermission, manifest.name, vfs]
  );

  const writeFile = useCallback(
    async (path: string, content: string): Promise<any> => {
      if (!hasPermission("vfs:write")) {
        throw new Error(`[SDK SecurityException] App '${manifest.name}' lacks 'vfs:write' permission.`);
      }
      return vfs.writeFile(path, content);
    },
    [hasPermission, manifest.name, vfs]
  );

  const notify = useCallback(
    (title: string, message: string, icon: string = "🔔") => {
      if (!hasPermission("notifications")) {
        console.warn(`[SDK Warning] App '${manifest.name}' attempted to dispatch notification without 'notifications' permission.`);
        return;
      }
      addNotification(title, message, icon);
    },
    [hasPermission, manifest.name, addNotification]
  );

  const openWin = useCallback(
    (id: WindowId, data?: any) => {
      if (!hasPermission("window:manage")) {
        console.warn(`[SDK Warning] App '${manifest.name}' lacks 'window:manage' permission to open windows.`);
        return;
      }
      openWindow(data !== undefined ? { id, customData: data } : id);
    },
    [hasPermission, manifest.name, openWindow]
  );

  const closeWin = useCallback(
    (instanceId: string) => {
      if (!hasPermission("window:manage")) {
        console.warn(`[SDK Warning] App '${manifest.name}' lacks 'window:manage' permission to close windows.`);
        return;
      }
      closeWindow(instanceId);
    },
    [hasPermission, manifest.name, closeWindow]
  );

  return useMemo(
    () => ({
      manifest,
      hasPermission,
      fs: {
        readFile,
        writeFile,
      },
      notify,
      windows: {
        open: openWin,
        close: closeWin,
      },
    }),
    [manifest, hasPermission, readFile, writeFile, notify, openWin, closeWin]
  );
}
