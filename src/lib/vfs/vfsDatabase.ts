/**
 * Virtual File System - IndexedDB Database Driver & Seeding
 */

import type { VFSNode } from "./vfsTypes";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { experiences } from "@/data/experience";
import { achievements } from "@/data/achievements";

const DB_NAME = "vstr_os_vfs_db";
const DB_VERSION = 1;
const STORE_NODES = "vfs_nodes";

let dbInstance: IDBDatabase | null = null;
let initPromise: Promise<IDBDatabase> | null = null;

export function getIndexedDB(): Promise<IDBDatabase> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("IndexedDB is only available in the browser"));
  }

  if (dbInstance) return Promise.resolve(dbInstance);
  if (initPromise) return initPromise;

  initPromise = new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NODES)) {
        const store = db.createObjectStore(STORE_NODES, { keyPath: "id" });
        store.createIndex("parentId", "parentId", { unique: false });
        store.createIndex("type", "type", { unique: false });
      }
    };

    request.onsuccess = async () => {
      dbInstance = request.result;
      try {
        await seedDefaultFileSystem(dbInstance);
        resolve(dbInstance);
      } catch (err) {
        reject(err);
      }
    };

    request.onerror = () => {
      reject(request.error || new Error("Failed to open IndexedDB"));
    };
  });

  return initPromise;
}

/**
 * Seed the initial directory hierarchy and portfolio files if database is empty
 */
async function seedDefaultFileSystem(db: IDBDatabase): Promise<void> {
  const count = await getNodeCount(db);
  if (count > 0) return; // Already seeded

  const now = Date.now();
  const seedNodes: VFSNode[] = [
    // Directories
    {
      id: "/",
      path: "/",
      name: "",
      parentId: null,
      type: "dir",
      size: 4096,
      mimeType: "inode/directory",
      createdAt: now,
      updatedAt: now,
      owner: "root",
      permissions: 0o755,
    },
    {
      id: "/home",
      path: "/home",
      name: "home",
      parentId: "/",
      type: "dir",
      size: 4096,
      mimeType: "inode/directory",
      createdAt: now,
      updatedAt: now,
      owner: "root",
      permissions: 0o755,
    },
    {
      id: "/home/saitarun",
      path: "/home/saitarun",
      name: "saitarun",
      parentId: "/home",
      type: "dir",
      size: 4096,
      mimeType: "inode/directory",
      createdAt: now,
      updatedAt: now,
      owner: "guest",
      permissions: 0o755,
    },
    {
      id: "/home/saitarun/portfolio",
      path: "/home/saitarun/portfolio",
      name: "portfolio",
      parentId: "/home/saitarun",
      type: "dir",
      size: 4096,
      mimeType: "inode/directory",
      createdAt: now,
      updatedAt: now,
      owner: "guest",
      permissions: 0o755,
    },
    {
      id: "/home/saitarun/desktop",
      path: "/home/saitarun/desktop",
      name: "desktop",
      parentId: "/home/saitarun",
      type: "dir",
      size: 4096,
      mimeType: "inode/directory",
      createdAt: now,
      updatedAt: now,
      owner: "guest",
      permissions: 0o755,
    },
    {
      id: "/etc",
      path: "/etc",
      name: "etc",
      parentId: "/",
      type: "dir",
      size: 4096,
      mimeType: "inode/directory",
      createdAt: now,
      updatedAt: now,
      owner: "root",
      permissions: 0o755,
    },
    {
      id: "/root",
      path: "/root",
      name: "root",
      parentId: "/",
      type: "dir",
      size: 4096,
      mimeType: "inode/directory",
      createdAt: now,
      updatedAt: now,
      owner: "root",
      permissions: 0o700, // Restricted! Only root can read/enter
    },
    {
      id: "/sys",
      path: "/sys",
      name: "sys",
      parentId: "/",
      type: "dir",
      size: 4096,
      mimeType: "inode/directory",
      createdAt: now,
      updatedAt: now,
      owner: "root",
      permissions: 0o555,
    },
    {
      id: "/tmp",
      path: "/tmp",
      name: "tmp",
      parentId: "/",
      type: "dir",
      size: 4096,
      mimeType: "inode/directory",
      createdAt: now,
      updatedAt: now,
      owner: "guest",
      permissions: 0o777,
    },

    // Files in /home/saitarun/portfolio
    {
      id: "/home/saitarun/portfolio/README.md",
      path: "/home/saitarun/portfolio/README.md",
      name: "README.md",
      parentId: "/home/saitarun/portfolio",
      type: "file",
      content: `# VSTR-OS Portfolio\n\nWelcome to **VSTR-OS**, an interactive Web Operating System created by **Sai Tarun Reddy Velagala**.\n\n### Highlights\n- CS Undergrad & AI Developer\n- KG Reddy College of Engg & Technology (B.Tech CSE - AI & ML)\n- Winner: IKARUS 2024 Hackathon (First Prize)\n- Specialization: Full-Stack React/Next.js UI, Intelligent Agent Systems, Systems Programming\n\nExplore files using \`ls\`, \`cat\`, \`notepad\`, and try solving puzzles to unlock root access!`,
      size: 420,
      mimeType: "text/markdown",
      createdAt: now,
      updatedAt: now,
      owner: "guest",
      permissions: 0o644,
    },
    {
      id: "/home/saitarun/portfolio/profile.json",
      path: "/home/saitarun/portfolio/profile.json",
      name: "profile.json",
      parentId: "/home/saitarun/portfolio",
      type: "file",
      content: JSON.stringify(
        {
          name: "Sai Tarun Reddy Velagala",
          title: "CS Undergrad & AI Developer",
          location: "Hyderabad, Telangana, India",
          education: {
            institution: "KG Reddy College of Engg & Technology",
            degree: "B.Tech CSE (AI & ML)",
            cgpa: 8.41,
            graduationYear: 2027,
          },
          leadership: "Secretary, Student Council Editorial Board",
          awards: ["First Prize - IKARUS 2024 Hackathon"],
        },
        null,
        2
      ),
      size: 380,
      mimeType: "application/json",
      createdAt: now,
      updatedAt: now,
      owner: "guest",
      permissions: 0o644,
    },
    {
      id: "/home/saitarun/portfolio/projects.json",
      path: "/home/saitarun/portfolio/projects.json",
      name: "projects.json",
      parentId: "/home/saitarun/portfolio",
      type: "file",
      content: JSON.stringify(projects, null, 2),
      size: 1450,
      mimeType: "application/json",
      createdAt: now,
      updatedAt: now,
      owner: "guest",
      permissions: 0o644,
    },
    {
      id: "/home/saitarun/portfolio/skills.txt",
      path: "/home/saitarun/portfolio/skills.txt",
      name: "skills.txt",
      parentId: "/home/saitarun/portfolio",
      type: "file",
      content: skills
        .map((cat) => `${cat.title}:\n  ${cat.skills.map((s) => s.name).join(", ")}`)
        .join("\n\n"),
      size: 520,
      mimeType: "text/plain",
      createdAt: now,
      updatedAt: now,
      owner: "guest",
      permissions: 0o644,
    },
    {
      id: "/home/saitarun/portfolio/contact.txt",
      path: "/home/saitarun/portfolio/contact.txt",
      name: "contact.txt",
      parentId: "/home/saitarun/portfolio",
      type: "file",
      content: `Email: saitarunrdy@gmail.com\nPhone: +91 7043692980\nLocation: Hyderabad, Telangana, India\nLinkedIn: https://linkedin.com/in/sai-tarun-reddy\nGitHub: https://github.com/DaKaufeeBoii`,
      size: 195,
      mimeType: "text/plain",
      createdAt: now,
      updatedAt: now,
      owner: "guest",
      permissions: 0o644,
    },
    {
      id: "/home/saitarun/portfolio/achievements.txt",
      path: "/home/saitarun/portfolio/achievements.txt",
      name: "achievements.txt",
      parentId: "/home/saitarun/portfolio",
      type: "file",
      content: achievements
        .map((a) => `[${a.year}] ${a.title} - ${a.subtitle}\n  ${a.description}`)
        .join("\n\n"),
      size: 610,
      mimeType: "text/plain",
      createdAt: now,
      updatedAt: now,
      owner: "guest",
      permissions: 0o644,
    },

    // Files in /etc
    {
      id: "/etc/os-release",
      path: "/etc/os-release",
      name: "os-release",
      parentId: "/etc",
      type: "file",
      content: `NAME="VSTR-OS"\nVERSION="2.0.0 (Pro Extended)"\nID=vstr-os\nPRETTY_NAME="VSTR-OS Windows 11 / Hybrid Web Architecture"\nBUILD_ID="20261007"\nHOME_URL="https://github.com/DaKaufeeBoii/vstr-os"`,
      size: 180,
      mimeType: "text/plain",
      createdAt: now,
      updatedAt: now,
      owner: "root",
      permissions: 0o644,
    },
    {
      id: "/etc/motd",
      path: "/etc/motd",
      name: "motd",
      parentId: "/etc",
      type: "file",
      content: ` * Documentation: https://github.com/DaKaufeeBoii/vstr-os\n * Management:    VSTR System Manager v2.0\n * Storage:       IndexedDB VFS Layer Active\n\nType 'help' for command syntax. Try 'cat README.md' or 'notepad'.`,
      size: 210,
      mimeType: "text/plain",
      createdAt: now,
      updatedAt: now,
      owner: "root",
      permissions: 0o644,
    },
    {
      id: "/etc/hint.log",
      path: "/etc/hint.log",
      name: "hint.log",
      parentId: "/etc",
      type: "file",
      content: `[SECURITY AUDIT LOG]\nNote from administrator: The root master key was encoded and committed during hackathon finals.\nPasscode hint: What was Sai Tarun's winning hackathon project? (Try: 'ikarus' or 'ikarus2024')`,
      size: 230,
      mimeType: "text/plain",
      createdAt: now,
      updatedAt: now,
      owner: "root",
      permissions: 0o644,
    },

    // Files in /root (restricted 0700 area)
    {
      id: "/root/flag.txt",
      path: "/root/flag.txt",
      name: "flag.txt",
      parentId: "/root",
      type: "file",
      content: `Congratulations! You unlocked the restricted root core of VSTR-OS!\n\nSECRET MISSION KEY: VSTR{R00T_K3RN3L_M4ST3R_2025}\n\nAchievement Unlocked: Superuser Privilege Ring 0`,
      size: 180,
      mimeType: "text/plain",
      createdAt: now,
      updatedAt: now,
      owner: "root",
      permissions: 0o600,
    },
    {
      id: "/root/kernel_debug.sys",
      path: "/root/kernel_debug.sys",
      name: "kernel_debug.sys",
      parentId: "/root",
      type: "file",
      content: `MEMORY_DUMP_CONFIGURATION\nKERNEL_PAGING=ENABLED\nDEBUGGER_HOOKS=0x7FFF0042\nCRASH_CATCHER=BSOD_CONSOLE`,
      size: 110,
      mimeType: "text/plain",
      createdAt: now,
      updatedAt: now,
      owner: "root",
      permissions: 0o600,
    },
  ];

  const tx = db.transaction(STORE_NODES, "readwrite");
  const store = tx.objectStore(STORE_NODES);
  for (const node of seedNodes) {
    store.put(node);
  }

  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function getNodeCount(db: IDBDatabase): Promise<number> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NODES, "readonly");
    const store = tx.objectStore(STORE_NODES);
    const countReq = store.count();
    countReq.onsuccess = () => resolve(countReq.result);
    countReq.onerror = () => reject(countReq.error);
  });
}

export async function dbGetNode(id: string): Promise<VFSNode | null> {
  const db = await getIndexedDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NODES, "readonly");
    const store = tx.objectStore(STORE_NODES);
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function dbPutNode(node: VFSNode): Promise<void> {
  const db = await getIndexedDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NODES, "readwrite");
    const store = tx.objectStore(STORE_NODES);
    const req = store.put(node);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function dbDeleteNode(id: string): Promise<void> {
  const db = await getIndexedDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NODES, "readwrite");
    const store = tx.objectStore(STORE_NODES);
    store.delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function dbGetChildren(parentId: string): Promise<VFSNode[]> {
  const db = await getIndexedDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NODES, "readonly");
    const store = tx.objectStore(STORE_NODES);
    const index = store.index("parentId");
    const req = index.getAll(parentId);
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function dbGetAllNodes(): Promise<VFSNode[]> {
  const db = await getIndexedDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NODES, "readonly");
    const store = tx.objectStore(STORE_NODES);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}
