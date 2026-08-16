// Application icons — Fluent Design SVG paths (20x20 viewBox)
import React from "react";
import { FluentIcon, IconSize, IconBadge } from "../FluentIcon";

type P = { size?: IconSize; color?: string; className?: string; badge?: IconBadge };

// ── Terminal / Command Prompt ──────────────────────────────────────────
export function TerminalIcon(props: P) {
  return (
    <FluentIcon
      paths="M2 4.5A2.5 2.5 0 0 1 4.5 2h11A2.5 2.5 0 0 1 18 4.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 2 15.5v-11zM5.854 6.146a.5.5 0 1 0-.708.708L7.293 9l-2.147 2.146a.5.5 0 0 0 .708.708l2.5-2.5a.5.5 0 0 0 0-.708l-2.5-2.5zM9.5 13a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z"
      aria-label="Terminal"
      {...props}
    />
  );
}

// ── Settings / Gear ───────────────────────────────────────────────────
export function SettingsIcon(props: P) {
  return (
    <FluentIcon
      paths="M10.75 2.5a.75.75 0 0 0-1.5 0v.79a5.75 5.75 0 0 0-2.268 1.308L6.22 3.836a.75.75 0 1 0-1.06 1.06l.762.763A5.75 5.75 0 0 0 4.61 8H3.75a.75.75 0 0 0 0 1.5h.86a5.75 5.75 0 0 0 1.31 2.27l-.762.762a.75.75 0 1 0 1.06 1.061l.763-.762A5.75 5.75 0 0 0 9.25 14.14V15a.75.75 0 0 0 1.5 0v-.86a5.75 5.75 0 0 0 2.268-1.308l.762.762a.75.75 0 1 0 1.06-1.06l-.762-.763A5.75 5.75 0 0 0 15.39 9.5h.86a.75.75 0 0 0 0-1.5h-.86a5.75 5.75 0 0 0-1.31-2.27l.762-.762a.75.75 0 0 0-1.06-1.061l-.763.762A5.75 5.75 0 0 0 10.75 3.29V2.5zM10 7a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"
      aria-label="Settings"
      {...props}
    />
  );
}

// ── User / Person ──────────────────────────────────────────────────────
export function UserIcon(props: P) {
  return (
    <FluentIcon
      paths="M10 9a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-6 8a6 6 0 1 1 12 0H4z"
      aria-label="User"
      {...props}
    />
  );
}

// ── Info ───────────────────────────────────────────────────────────────
export function InfoIcon(props: P) {
  return (
    <FluentIcon
      paths="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-11a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-1 3a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1z"
      aria-label="Info"
      {...props}
    />
  );
}

// ── Shield / Security ──────────────────────────────────────────────────
export function ShieldIcon(props: P) {
  return (
    <FluentIcon
      paths="M10 1.5l-7.5 3v6c0 3.9 3.2 7.5 7.5 8.5 4.3-1 7.5-4.6 7.5-8.5v-6L10 1.5zm3.3 7.3l-4 4a.8.8 0 0 1-1.1 0l-2-2a.75.75 0 0 1 1-1.1l1.5 1.4 3.4-3.4a.75.75 0 0 1 1.1 1l-.1.1z"
      aria-label="Shield"
      {...props}
    />
  );
}

// ── Mail / Contact ─────────────────────────────────────────────────────
export function MailIcon(props: P) {
  return (
    <FluentIcon
      paths="M2 4.5A2.5 2.5 0 0 1 4.5 2h11A2.5 2.5 0 0 1 18 4.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 2 15.5v-11zM4.5 4a.5.5 0 0 0-.5.5v.379l6 3.6 6-3.6V4.5a.5.5 0 0 0-.5-.5h-11zm11.5 2.72-5.537 3.32a1 1 0 0 1-1.026 0L4 6.72V15.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V6.72z"
      aria-label="Mail"
      {...props}
    />
  );
}

// ── Log / Experience ───────────────────────────────────────────────────
export function LogIcon(props: P) {
  return (
    <FluentIcon
      paths="M4 3a1 1 0 0 0 0 2h12a1 1 0 0 0 0-2H4zm-1 5a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zm1 3a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2H4zm-1 5a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1z"
      aria-label="Log"
      {...props}
    />
  );
}

// ── Trophy / Achievement ───────────────────────────────────────────────
export function TrophyIcon(props: P) {
  return (
    <FluentIcon
      paths="M6 2a1 1 0 0 0-1 1H2a1 1 0 1 0 0 2c0 2.21 1.79 4 4 4 .34 0 .67-.05 1-.12V10h-.5a1 1 0 0 0-.949 1.316l.5 1.5A1 1 0 0 0 7 13h.5v1.5H7a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1h-.5V13h.5a1 1 0 0 0 .949-1.184l-.5-1.5A1 1 0 0 0 12.5 10H12V8.88c.33.07.66.12 1 .12 2.21 0 4-1.79 4-4a1 1 0 1 0 0-2h-3a1 1 0 0 0-1-1H6zM5 5.83A2 2 0 0 1 4 4h1v1.83zM15 4h1a2 2 0 0 1-1 1.83V4z"
      aria-label="Trophy"
      {...props}
    />
  );
}

// ── Skills / Lightning ─────────────────────────────────────────────────
export function SkillsIcon(props: P) {
  return (
    <FluentIcon
      paths="M11.25 2a.75.75 0 0 1 .668 1.092L8.815 9H13a.75.75 0 0 1 .574 1.236l-7 8.5A.75.75 0 0 1 5.25 18v-6H2a.75.75 0 0 1-.573-1.236l7-8.5A.75.75 0 0 1 9 2h2.25z"
      aria-label="Skills"
      {...props}
    />
  );
}

// ── Image Viewer / Photo ───────────────────────────────────────────────
export function PhotoIcon(props: P) {
  return (
    <FluentIcon
      paths="M2.5 4A2.5 2.5 0 0 0 0 6.5v11A2.5 2.5 0 0 0 2.5 20h15a2.5 2.5 0 0 0 2.5-2.5v-11A2.5 2.5 0 0 0 17.5 4h-15zm0 1h15A1.5 1.5 0 0 1 19 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 1 17.5v-11A1.5 1.5 0 0 1 2.5 5zM6 8a2 2 0 1 0 0 4A2 2 0 0 0 6 8zm.5 6L3 18h14l-5-6-3.5 4L6.5 14z" viewBox="0 0 20 24"
      aria-label="Photo"
      {...props}
    />
  );
}

// ── Game / Controller ──────────────────────────────────────────────────
export function GameIcon(props: P) {
  return (
    <FluentIcon
      paths="M7 6a1 1 0 0 1 1-1h4a1 1 0 0 1 0 2H8a1 1 0 0 1-1-1zM2 10a5 5 0 0 1 5-5h6a5 5 0 0 1 4.9 6l-.9 3.6A3 3 0 0 1 14.1 17H5.9A3 3 0 0 1 3 14.6L2.1 11A4.95 4.95 0 0 1 2 10zm5-1a1 1 0 0 0 0 2h1v1a1 1 0 1 0 2 0v-1h1a1 1 0 1 0 0-2h-1V8a1 1 0 1 0-2 0v1H7zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-2 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
      aria-label="Game"
      {...props}
    />
  );
}

// ── Disk Cleanup / HDD ────────────────────────────────────────────────
export function DiskIcon(props: P) {
  return (
    <FluentIcon
      paths="M3 4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1H3V4zm0 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6H3zm8 2a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm2 3a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM6 8a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm-.5 2a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z"
      aria-label="Disk"
      {...props}
    />
  );
}

// ── Desktop Pet / Paw ─────────────────────────────────────────────────
export function PawIcon(props: P) {
  return (
    <FluentIcon
      paths="M7 2.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-4 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm10 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm3-2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM5.5 9C4 9 2 10.7 2 13c0 2.5 2.5 5 3 5s1-.5 2.5-.5 2 .5 2.5.5S13 15.5 13 13c0-2.3-2-4-3.5-4-.6 0-1.3.3-2 .3S6.1 9 5.5 9z"
      aria-label="Paw"
      {...props}
    />
  );
}
