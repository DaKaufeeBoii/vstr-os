/**
 * Virtual File System (VFS) Types
 */

export interface VFSNode {
  id: string;               // Canonical absolute path (e.g. "/home/saitarun/portfolio/README.md")
  path: string;             // Canonical absolute path
  name: string;             // Basename (e.g. "README.md")
  parentId: string | null;  // Parent directory canonical path or null for root
  type: "file" | "dir";
  content?: string;         // UTF-8 content for files
  size: number;             // Size in bytes
  mimeType: string;         // e.g. "text/plain", "application/json", "inode/directory"
  createdAt: number;        // Epoch timestamp ms
  updatedAt: number;        // Epoch timestamp ms
  owner: "guest" | "root";  // User ownership
  permissions: number;      // Octal permission mask (e.g. 0o755, 0o644, 0o700)
}

export interface VFSStats {
  size: number;
  type: "file" | "dir";
  createdAt: Date;
  updatedAt: Date;
  owner: "guest" | "root";
  permissions: number;
  modeString: string;
}

export type VFSEventType = "create" | "update" | "delete";

export interface VFSEvent {
  type: VFSEventType;
  path: string;
  node?: VFSNode;
}
