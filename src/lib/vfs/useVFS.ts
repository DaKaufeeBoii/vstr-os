"use client";

import { useEffect, useState, useCallback } from "react";
import type { VFSNode } from "./vfsTypes";
import * as vfs from "./vfsEngine";

export function useVFS() {
  const [isReady, setIsReady] = useState(false);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    // Initial stat of root triggers IndexedDB initialization & seeding
    vfs.stat("/").then(() => {
      setIsReady(true);
    });

    const unsubscribe = vfs.onVFSChange(() => {
      setVersion((v) => v + 1);
    });

    return unsubscribe;
  }, []);

  const readFile = useCallback(
    (path: string, user?: "guest" | "root") => vfs.readFile(path, user),
    []
  );

  const writeFile = useCallback(
    (path: string, content: string, user?: "guest" | "root") =>
      vfs.writeFile(path, content, user),
    []
  );

  const readDir = useCallback(
    (path: string, user?: "guest" | "root") => vfs.readDir(path, user),
    []
  );

  const mkdir = useCallback(
    (path: string, user?: "guest" | "root", recursive?: boolean) =>
      vfs.mkdir(path, user, recursive),
    []
  );

  const remove = useCallback(
    (path: string, user?: "guest" | "root", recursive?: boolean) =>
      vfs.remove(path, user, recursive),
    []
  );

  const stat = useCallback((path: string) => vfs.stat(path), []);

  const exists = useCallback((path: string) => vfs.exists(path), []);

  return {
    isReady,
    version,
    readFile,
    writeFile,
    readDir,
    mkdir,
    remove,
    stat,
    exists,
    resolvePath: vfs.resolvePath,
    normalizePath: vfs.normalizePath,
    generateTree: vfs.generateTree,
  };
}
