// File System icons — Fluent Design SVG paths (20x20 viewBox)
import React from "react";
import { FluentIcon, IconSize, IconBadge } from "../FluentIcon";

type P = { size?: IconSize; color?: string; className?: string; badge?: IconBadge };

// ── Folder (gold/amber style shell) ──────────────────────────────────
export function FolderIcon(props: P) {
  return (
    <FluentIcon
      paths="M2 5a2 2 0 0 1 2-2h3.586a2 2 0 0 1 1.414.586l.414.414H16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5z"
      aria-label="Folder"
      {...props}
    />
  );
}

// ── Folder Open ───────────────────────────────────────────────────────
export function FolderOpenIcon(props: P) {
  return (
    <FluentIcon
      paths="M2 5a2 2 0 0 1 2-2h3.586a2 2 0 0 1 1.414.586l.414.414H16a2 2 0 0 1 2 2v1H4a2 2 0 0 0-2 2v5a1 1 0 0 1-.923-.615L.096 10.37A2 2 0 0 1 0 9.764V7a2 2 0 0 1 2-2zm1.354 5.146A.5.5 0 0 0 3 10.5v5A1.5 1.5 0 0 0 4.5 17h11a1.5 1.5 0 0 0 1.415-1.006l1.8-5.4A.5.5 0 0 0 18.25 10H4a.5.5 0 0 0-.354.146z"
      aria-label="FolderOpen"
      {...props}
    />
  );
}

// ── Document / File ───────────────────────────────────────────────────
export function FileIcon(props: P) {
  return (
    <FluentIcon
      paths="M4 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.414a2 2 0 0 0-.586-1.414l-3.414-3.414A2 2 0 0 0 12.586 2H4zm8 1.5V6a1 1 0 0 0 1 1h2.5L12 3.5zM5 9.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z"
      aria-label="File"
      {...props}
    />
  );
}

// ── Drive / HDD ───────────────────────────────────────────────────────
export function DriveIcon(props: P) {
  return (
    <FluentIcon
      paths="M2 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H2V4zm0 3v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7H2zm13 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"
      aria-label="Drive"
      {...props}
    />
  );
}

// ── Recycle Bin ───────────────────────────────────────────────────────
export function TrashIcon(props: P) {
  return (
    <FluentIcon
      paths="M8.5 1a1 1 0 0 0-1 1H4a1 1 0 0 0 0 2h12a1 1 0 0 0 0-2h-3.5a1 1 0 0 0-1-1h-3zM3.5 6a.5.5 0 0 1 .5.5l1 8a1 1 0 0 0 .995.9h7.01A1 1 0 0 0 14 14.5l1-8a.5.5 0 0 1 1 .1l-1 8A2 2 0 0 1 13.005 17h-7.01A2 2 0 0 1 4 14.6l-1-8A.5.5 0 0 1 3.5 6z M8 8.5a.5.5 0 0 1 1 0v5a.5.5 0 0 1-1 0v-5zm3 0a.5.5 0 0 1 1 0v5a.5.5 0 0 1-1 0v-5z"
      aria-label="Trash"
      {...props}
    />
  );
}
