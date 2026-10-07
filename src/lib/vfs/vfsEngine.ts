/**
 * Virtual File System - POSIX Engine & Path Resolver
 */

import type { VFSNode, VFSEvent } from "./vfsTypes";
import {
  dbGetNode,
  dbPutNode,
  dbDeleteNode,
  dbGetChildren,
  dbGetAllNodes,
} from "./vfsDatabase";

type VFSEventListener = (event: VFSEvent) => void;
const listeners = new Set<VFSEventListener>();

function emitEvent(event: VFSEvent) {
  for (const listener of listeners) {
    try {
      listener(event);
    } catch (e) {
      console.error("VFS listener error:", e);
    }
  }
}

export function onVFSChange(listener: VFSEventListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Normalizes any POSIX or Windows-style path to canonical POSIX format.
 * e.g. "C:\Users\saitarun\portfolio" -> "/home/saitarun/portfolio"
 * "/home/saitarun/../saitarun/./portfolio" -> "/home/saitarun/portfolio"
 */
export function normalizePath(pathStr: string): string {
  if (!pathStr) return "/";

  // Convert Windows backslashes
  let p = pathStr.replace(/\\/g, "/");

  // Map simulated Windows drive letters to POSIX virtual paths
  p = p.replace(/^c:\/users\/saitarun/i, "/home/saitarun");
  p = p.replace(/^c:\//i, "/");

  // Remove duplicate slashes
  p = p.replace(/\/+/g, "/");

  const parts = p.split("/").filter(Boolean);
  const stack: string[] = [];

  for (const part of parts) {
    if (part === ".") continue;
    if (part === "..") {
      if (stack.length > 0) stack.pop();
    } else {
      stack.push(part);
    }
  }

  const result = "/" + stack.join("/");
  return result === "" ? "/" : result;
}

/**
 * Resolves a target path against the current working directory
 */
export function resolvePath(cwd: string, targetPath: string): string {
  if (!targetPath) return normalizePath(cwd);
  if (targetPath.startsWith("/") || /^[a-zA-Z]:[\\/]/.test(targetPath)) {
    return normalizePath(targetPath);
  }
  return normalizePath(`${cwd}/${targetPath}`);
}

/**
 * Checks permission access for a node based on current user
 */
export function checkPermission(
  node: VFSNode,
  required: "r" | "w" | "x",
  user: "guest" | "root" = "guest"
): boolean {
  if (user === "root") return true; // Root user has full access

  const mode = node.permissions;
  const isOwner = node.owner === user;

  const ownerR = (mode & 0o400) !== 0;
  const ownerW = (mode & 0o200) !== 0;
  const ownerX = (mode & 0o100) !== 0;

  const otherR = (mode & 0o004) !== 0;
  const otherW = (mode & 0o002) !== 0;
  const otherX = (mode & 0o001) !== 0;

  if (required === "r") return isOwner ? ownerR : otherR;
  if (required === "w") return isOwner ? ownerW : otherW;
  if (required === "x") return isOwner ? ownerX : otherX;

  return false;
}

/**
 * Read file contents
 */
export async function readFile(
  pathStr: string,
  user: "guest" | "root" = "guest"
): Promise<string> {
  const normPath = normalizePath(pathStr);
  const node = await dbGetNode(normPath);

  if (!node) {
    throw new Error(`cat: ${pathStr}: No such file or directory`);
  }
  if (node.type === "dir") {
    throw new Error(`cat: ${pathStr}: Is a directory`);
  }
  if (!checkPermission(node, "r", user)) {
    throw new Error(`cat: ${pathStr}: Permission denied`);
  }

  return node.content ?? "";
}

/**
 * Write file contents (creates file if not present)
 */
export async function writeFile(
  pathStr: string,
  content: string,
  user: "guest" | "root" = "guest"
): Promise<VFSNode> {
  const normPath = normalizePath(pathStr);
  if (normPath === "/") {
    throw new Error(`Cannot overwrite root directory`);
  }

  const existing = await dbGetNode(normPath);
  const now = Date.now();

  if (existing) {
    if (existing.type === "dir") {
      throw new Error(`writeFile: ${normPath}: Is a directory`);
    }
    if (!checkPermission(existing, "w", user)) {
      throw new Error(`writeFile: ${normPath}: Permission denied`);
    }

    const updatedNode: VFSNode = {
      ...existing,
      content,
      size: new Blob([content]).size,
      updatedAt: now,
    };
    await dbPutNode(updatedNode);
    emitEvent({ type: "update", path: normPath, node: updatedNode });
    return updatedNode;
  }

  // Ensure parent directory exists
  const parentPath = getParentPath(normPath);
  const parentNode = await dbGetNode(parentPath);
  if (!parentNode) {
    throw new Error(`writeFile: cannot create file '${normPath}': No such directory '${parentPath}'`);
  }
  if (parentNode.type !== "dir") {
    throw new Error(`writeFile: '${parentPath}' is not a directory`);
  }
  if (!checkPermission(parentNode, "w", user)) {
    throw new Error(`writeFile: cannot create file '${normPath}': Permission denied in parent directory`);
  }

  const name = getBasename(normPath);
  const newNode: VFSNode = {
    id: normPath,
    path: normPath,
    name,
    parentId: parentPath,
    type: "file",
    content,
    size: new Blob([content]).size,
    mimeType: getMimeType(name),
    createdAt: now,
    updatedAt: now,
    owner: user,
    permissions: 0o644,
  };

  await dbPutNode(newNode);
  emitEvent({ type: "create", path: normPath, node: newNode });
  return newNode;
}

/**
 * Create a directory
 */
export async function mkdir(
  pathStr: string,
  user: "guest" | "root" = "guest",
  recursive = false
): Promise<VFSNode> {
  const normPath = normalizePath(pathStr);
  if (normPath === "/") return (await dbGetNode("/"))!;

  const existing = await dbGetNode(normPath);
  if (existing) {
    if (recursive) return existing;
    throw new Error(`mkdir: cannot create directory '${pathStr}': File exists`);
  }

  const parentPath = getParentPath(normPath);
  let parentNode = await dbGetNode(parentPath);

  if (!parentNode) {
    if (recursive) {
      parentNode = await mkdir(parentPath, user, true);
    } else {
      throw new Error(`mkdir: cannot create directory '${pathStr}': No such parent directory`);
    }
  }

  if (parentNode.type !== "dir") {
    throw new Error(`mkdir: cannot create directory '${pathStr}': '${parentPath}' is not a directory`);
  }
  if (!checkPermission(parentNode, "w", user)) {
    throw new Error(`mkdir: cannot create directory '${pathStr}': Permission denied in '${parentPath}'`);
  }

  const now = Date.now();
  const name = getBasename(normPath);
  const newNode: VFSNode = {
    id: normPath,
    path: normPath,
    name,
    parentId: parentPath,
    type: "dir",
    size: 4096,
    mimeType: "inode/directory",
    createdAt: now,
    updatedAt: now,
    owner: user,
    permissions: 0o755,
  };

  await dbPutNode(newNode);
  emitEvent({ type: "create", path: normPath, node: newNode });
  return newNode;
}

/**
 * Read contents of a directory
 */
export async function readDir(
  pathStr: string,
  user: "guest" | "root" = "guest"
): Promise<VFSNode[]> {
  const normPath = normalizePath(pathStr);
  const node = await dbGetNode(normPath);

  if (!node) {
    throw new Error(`ls: cannot access '${pathStr}': No such file or directory`);
  }
  if (node.type !== "dir") {
    return [node];
  }
  if (!checkPermission(node, "r", user)) {
    throw new Error(`ls: cannot open directory '${pathStr}': Permission denied`);
  }

  const children = await dbGetChildren(normPath);
  return children.sort((a, b) => {
    if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

/**
 * Stat a file or directory
 */
export async function stat(pathStr: string): Promise<VFSNode | null> {
  const normPath = normalizePath(pathStr);
  return dbGetNode(normPath);
}

/**
 * Check if a path exists
 */
export async function exists(pathStr: string): Promise<boolean> {
  const node = await stat(pathStr);
  return node !== null;
}

/**
 * Remove a file or directory
 */
export async function remove(
  pathStr: string,
  user: "guest" | "root" = "guest",
  recursive = false
): Promise<boolean> {
  const normPath = normalizePath(pathStr);
  if (normPath === "/") {
    throw new Error(`rm: cannot remove root directory '/'`);
  }

  const node = await dbGetNode(normPath);
  if (!node) {
    throw new Error(`rm: cannot remove '${pathStr}': No such file or directory`);
  }

  const parentPath = getParentPath(normPath);
  const parentNode = await dbGetNode(parentPath);
  if (parentNode && !checkPermission(parentNode, "w", user)) {
    throw new Error(`rm: cannot remove '${pathStr}': Permission denied in parent directory`);
  }

  if (node.type === "dir") {
    const children = await dbGetChildren(normPath);
    if (children.length > 0) {
      if (!recursive) {
        throw new Error(`rm: cannot remove '${pathStr}': Is a non-empty directory. Use -r flag.`);
      }
      for (const child of children) {
        await remove(child.path, user, true);
      }
    }
  }

  await dbDeleteNode(normPath);
  emitEvent({ type: "delete", path: normPath, node });
  return true;
}

/**
 * Modify permissions
 */
export async function chmod(
  pathStr: string,
  mode: number,
  user: "guest" | "root" = "guest"
): Promise<boolean> {
  const normPath = normalizePath(pathStr);
  const node = await dbGetNode(normPath);
  if (!node) throw new Error(`chmod: cannot access '${pathStr}': No such file or directory`);

  if (user !== "root" && node.owner !== user) {
    throw new Error(`chmod: changing permissions of '${pathStr}': Operation not permitted`);
  }

  const updatedNode = { ...node, permissions: mode, updatedAt: Date.now() };
  await dbPutNode(updatedNode);
  emitEvent({ type: "update", path: normPath, node: updatedNode });
  return true;
}

/**
 * Modify ownership
 */
export async function chown(
  pathStr: string,
  owner: "guest" | "root",
  user: "guest" | "root" = "guest"
): Promise<boolean> {
  const normPath = normalizePath(pathStr);
  const node = await dbGetNode(normPath);
  if (!node) throw new Error(`chown: cannot access '${pathStr}': No such file or directory`);

  if (user !== "root") {
    throw new Error(`chown: changing ownership of '${pathStr}': Operation not permitted`);
  }

  const updatedNode = { ...node, owner, updatedAt: Date.now() };
  await dbPutNode(updatedNode);
  emitEvent({ type: "update", path: normPath, node: updatedNode });
  return true;
}

/**
 * Generate ASCII tree
 */
export async function generateTree(
  rootPath = "/home/saitarun/portfolio",
  user: "guest" | "root" = "guest"
): Promise<string> {
  const normPath = normalizePath(rootPath);
  const lines: string[] = [normPath];

  async function walk(dirPath: string, prefix: string) {
    try {
      const items = await readDir(dirPath, user);
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const isLast = i === items.length - 1;
        const branch = isLast ? "└── " : "├── ";
        const nextPrefix = prefix + (isLast ? "    " : "│   ");
        lines.push(`${prefix}${branch}${item.name}${item.type === "dir" ? "/" : ""}`);
        if (item.type === "dir") {
          await walk(item.path, nextPrefix);
        }
      }
    } catch {
      // Permission denied or unreadable
    }
  }

  await walk(normPath, "");
  return lines.join("\n");
}

/* ── Helpers ────────────────────────────────────────────────────────── */
function getParentPath(pathStr: string): string {
  const lastSlash = pathStr.lastIndexOf("/");
  if (lastSlash <= 0) return "/";
  return pathStr.substring(0, lastSlash);
}

function getBasename(pathStr: string): string {
  const lastSlash = pathStr.lastIndexOf("/");
  if (lastSlash < 0) return pathStr;
  return pathStr.substring(lastSlash + 1);
}

function getMimeType(fileName: string): string {
  if (fileName.endsWith(".json")) return "application/json";
  if (fileName.endsWith(".md")) return "text/markdown";
  if (fileName.endsWith(".txt") || fileName.endsWith(".log")) return "text/plain";
  if (fileName.endsWith(".sys")) return "application/octet-stream";
  return "text/plain";
}
