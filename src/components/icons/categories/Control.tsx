// Window control + context menu icons — Fluent Design SVG paths (20x20 viewBox)
import React from "react";
import { FluentIcon, IconSize, IconBadge } from "../FluentIcon";

type P = { size?: IconSize; color?: string; className?: string; badge?: IconBadge };

// ── Close (X) ────────────────────────────────────────────────────────
export function CloseIcon(props: P) {
  return (
    <FluentIcon
      paths="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414z"
      aria-label="Close"
      {...props}
    />
  );
}

// ── Minimize (–) ─────────────────────────────────────────────────────
export function MinimizeIcon(props: P) {
  return (
    <FluentIcon
      paths="M3 10a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1z"
      aria-label="Minimize"
      {...props}
    />
  );
}

// ── Maximize (square) ────────────────────────────────────────────────
export function MaximizeIcon(props: P) {
  return (
    <FluentIcon
      paths="M4 4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4zm0 1h12a1 1 0 0 1 1 1v1H3V6a1 1 0 0 1 1-1zm-1 3h14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8z"
      aria-label="Maximize"
      {...props}
    />
  );
}

// ── Restore down (overlapping squares) ──────────────────────────────
export function RestoreIcon(props: P) {
  return (
    <FluentIcon
      paths="M2 6.5A2.5 2.5 0 0 1 4.5 4H7v1.5H4.5A1 1 0 0 0 3.5 6.5v7A1 1 0 0 0 4.5 14.5H7v1.5H4.5A2.5 2.5 0 0 1 2 13.5v-7zM8 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H8z"
      aria-label="Restore"
      {...props}
    />
  );
}

// ── Refresh / Reload ─────────────────────────────────────────────────
export function RefreshIcon(props: P) {
  return (
    <FluentIcon
      paths="M10 3.5a6.5 6.5 0 1 0 6.497 6.887.5.5 0 0 1 .998.07A7.5 7.5 0 1 1 15.4 5.1L16.35 4.15A.5.5 0 0 1 17 4.5V8a.5.5 0 0 1-.5.5H13a.5.5 0 0 1-.354-.854l1.42-1.42A6.47 6.47 0 0 0 10 3.5z"
      aria-label="Refresh"
      {...props}
    />
  );
}

// ── New / Add (+ in circle) ──────────────────────────────────────────
export function NewIcon(props: P) {
  return (
    <FluentIcon
      paths="M10 2a8 8 0 1 0 0 16A8 8 0 0 0 10 2zm0 1a7 7 0 1 1 0 14A7 7 0 0 1 10 3zm.5 3.5a.5.5 0 0 0-1 0V9.5H6a.5.5 0 0 0 0 1h3.5v3a.5.5 0 0 0 1 0v-3H14a.5.5 0 0 0 0-1h-3.5V6.5z"
      aria-label="New"
      {...props}
    />
  );
}

// ── Sort / Arrow down ────────────────────────────────────────────────
export function SortIcon(props: P) {
  return (
    <FluentIcon
      paths="M3 5.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z"
      aria-label="Sort"
      {...props}
    />
  );
}

// ── View / Eye ───────────────────────────────────────────────────────
export function ViewIcon(props: P) {
  return (
    <FluentIcon
      paths="M10 4C5.5 4 1.6 7.1 0 11.3c1.6 4.2 5.5 7.2 10 7.2s8.4-3 10-7.2C18.4 7.1 14.5 4 10 4zm0 12a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9zm0-2a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
      aria-label="View"
      {...props}
    />
  );
}

// ── Personalize / Paint brush ────────────────────────────────────────
export function PersonalizeIcon(props: P) {
  return (
    <FluentIcon
      paths="M14.06 3a2 2 0 0 0-1.415.586l-8.19 8.19a2 2 0 0 0-.538 1.022l-.7 3.5a.5.5 0 0 0 .585.585l3.5-.7a2 2 0 0 0 1.022-.538l8.19-8.19a2 2 0 0 0 0-2.828L15.475 3.586A2 2 0 0 0 14.06 3zm0 1.5.707.707-8.19 8.19-.707-.707 8.19-8.19zm-8.9 9.6.707.707-2.1.42.42-2.1.707.707-.707-.707L5.16 14.1z"
      aria-label="Personalize"
      {...props}
    />
  );
}

// ── Display / Monitor ────────────────────────────────────────────────
export function DisplayIcon(props: P) {
  return (
    <FluentIcon
      paths="M2 4.5A2.5 2.5 0 0 1 4.5 2h11A2.5 2.5 0 0 1 18 4.5v8a2.5 2.5 0 0 1-2.5 2.5H11v1.5h2a.5.5 0 0 1 0 1H7a.5.5 0 0 1 0-1h2V15H4.5A2.5 2.5 0 0 1 2 12.5v-8zM4.5 3A1.5 1.5 0 0 0 3 4.5v8A1.5 1.5 0 0 0 4.5 14h11a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 15.5 3h-11z"
      aria-label="Display"
      {...props}
    />
  );
}

// ── Properties / Info circle ─────────────────────────────────────────
export function PropertiesIcon(props: P) {
  return (
    <FluentIcon
      paths="M10 2a8 8 0 1 0 0 16A8 8 0 0 0 10 2zm0 1a7 7 0 1 1 0 14A7 7 0 0 1 10 3zm0 4a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-.75 3.5a.75.75 0 0 1 .75-.75H10a.75.75 0 0 1 .75.75v3.25h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25V11.25H10a.75.75 0 0 1-.75-.75z"
      aria-label="Properties"
      {...props}
    />
  );
}

// ── Chevron right (submenu arrow) ────────────────────────────────────
export function ChevronRightIcon(props: P) {
  return (
    <FluentIcon
      paths="M7.293 4.293a1 1 0 0 1 1.414 0l5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414-1.414L11.586 10 7.293 5.707a1 1 0 0 1 0-1.414z"
      aria-label="ChevronRight"
      {...props}
    />
  );
}

// ── Pin / Taskbar pin ────────────────────────────────────────────────
export function PinIcon(props: P) {
  return (
    <FluentIcon
      paths="M6.5 1A.5.5 0 0 1 7 1.5L7.5 4l5-1 .5 2.5-5 1L8 9H10.5a1 1 0 0 1 .857 1.514L9.5 13l-1-1-3.5 3.5-1-1L7.5 11l-1-1-2.5 1.86A1 1 0 0 1 2.5 11H5L4.5 8.5 2.5 8 2 5.5l5-1-.5-2.5A.5.5 0 0 1 7 1.5v-.001z"
      aria-label="Pin"
      {...props}
    />
  );
}

// ── Rotation Lock / Screen rotation ──────────────────────────────────
export function RotationLockIcon(props: P) {
  return (
    <FluentIcon
      paths="M10 2.5a.5.5 0 0 0-.5.5v5.5a.5.5 0 0 0 1 0V3a.5.5 0 0 0-.5-.5zm0 2a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zM10 15.5a.5.5 0 0 1-.5-.5V12a.5.5 0 0 1 1 0v3.5a.5.5 0 0 1-.5.5z"
      aria-label="Rotation Lock"
      {...props}
    />
  );
}

// ── Mobile Hotspot ───────────────────────────────────────────────────
export function HotspotIcon(props: P) {
  return (
    <FluentIcon
      paths="M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm0 1.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zM10 11a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-2 2a4 4 0 0 0 4 4 .5.5 0 0 1 1 0 3 3 0 0 1-6 0 .5.5 0 0 1 1 0 2 2 0 0 0 4 0 .5.5 0 0 1 1 0 1 1 0 0 1-2 0 .5.5 0 0 1-.5-.5V11a.5.5 0 0 1 .5-.5h3a.5.5 0 0 0 0-1h-3a.5.5 0 0 0-.5.5v2a3 3 0 0 1-6 0v-2a.5.5 0 0 0-.5-.5H5a.5.5 0 0 1 0-1h3a.5.5 0 0 1 .5.5v2a4 4 0 0 0 8 0v-2a.5.5 0 1 1 1 0v2a5 5 0 0 1-10 0v-2a.5.5 0 1 1 1 0v2z"
      aria-label="Hotspot"
      {...props}
    />
  );
}

// ── Nearby Share ─────────────────────────────────────────────────────
export function NearbyShareIcon(props: P) {
  return (
    <FluentIcon
      paths="M14.5 4H5.5A1.5 1.5 0 0 0 4 5.5v10A1.5 1.5 0 0 0 5.5 17h9A1.5 1.5 0 0 0 16 15.5V9l-2.5 2.5a.5.5 0 0 1-.7-.7L14.3 7.3a.5.5 0 0 1 .7 0L17 10.5V5.5A1.5 1.5 0 0 0 14.5 4zM5.5 3A2.5 2.5 0 0 0 3 5.5v10A2.5 2.5 0 0 0 5.5 18h9A2.5 2.5 0 0 0 18 15.5V9l-2.5 2.5a.5.5 0 0 1-.7-.7L17.3 7.3a.5.5 0 0 1 .7 0L20 10.5V5.5A2.5 2.5 0 0 0 14.5 3h-9z"
      aria-label="Nearby Share"
      {...props}
    />
  );
}

// ── Cast / Screen mirroring ──────────────────────────────────────────
export function CastIcon(props: P) {
  return (
    <FluentIcon
      paths="M2 10.5V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.5a.5.5 0 0 0-1 0V18H4v-7.5a.5.5 0 0 0-1 0zm10-8a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1 0-1h4.5V4.5a.5.5 0 0 1 1 0v3H12a.5.5 0 0 1 0-1h3V2.5a.5.5 0 0 1 1 0v3h1.5a.5.5 0 0 1 0 1h-3V7.5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1 0-1h4.5V2.5a.5.5 0 0 1 1 0zM2.5 2.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-2.5V8.5a.5.5 0 0 1-1 0V6H4.5v2.5a.5.5 0 0 1-1 0V3a.5.5 0 0 1 .5-.5z"
      aria-label="Cast"
      {...props}
    />
  );
}

// ── Accessibility ────────────────────────────────────────────────────
export function AccessibilityIcon(props: P) {
  return (
    <FluentIcon
      paths="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 1.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zM7 9a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM5.5 14.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM10 11a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"
      aria-label="Accessibility"
      {...props}
    />
  );
}

// ── Bluetooth ────────────────────────────────────────────────────────
export function BluetoothIcon(props: P) {
  return (
    <FluentIcon
      paths="M10 2L5.5 6.5v7L10 18l4.5-4.5v-7L10 2zm0 1.5L12.5 4v12L10 16.5 7.5 14V4L10 3.5zM10 5a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1zm0 4a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1zm0 4a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1z"
      aria-label="Bluetooth"
      {...props}
    />
  );
}

// ── Night Light ──────────────────────────────────────────────────────
export function NightLightIcon(props: P) {
  return (
    <FluentIcon
      paths="M10 1.5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5zm0 14a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5zM2.5 6.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm14 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zM18.5 15a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zM4.93 4.93a.5.5 0 0 1 .71 0l2.12 2.12a.5.5 0 0 1 0 .71l-2.12 2.12a.5.5 0 0 1-.71-.71l2.12-2.12a.5.5 0 0 1 0-.71zm12.24 12.24a.5.5 0 0 1 .71 0l2.12 2.12a.5.5 0 0 1 0 .71l-2.12 2.12a.5.5 0 0 1-.71-.71l2.12-2.12a.5.5 0 0 1 0-.71zM3.29 17.71a.5.5 0 0 1 0-.71l2.12-2.12a.5.5 0 0 1 .71.71l-2.12 2.12a.5.5 0 0 1-.71 0l-2.12-2.12a.5.5 0 0 1 0-.71zm12.24-12.24a.5.5 0 0 1 0-.71l2.12-2.12a.5.5 0 0 1 .71.71l-2.12 2.12a.5.5 0 0 1-.71 0l-2.12-2.12a.5.5 0 0 1 0-.71zM7 10a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm0 1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"
      aria-label="Night Light"
      {...props}
    />
  );
}

// ── Check (checkmark) ────────────────────────────────────────────────
export function CheckIcon(props: P) {
  return (
    <FluentIcon
      paths="M15.707 5.293a1 1 0 0 1 0 1.414l-7 7a1 1 0 0 1-1.414 0l-3.5-3.5a1 1 0 1 1 1.414-1.414L8 11.586l6.293-6.293a1 1 0 0 1 1.414 0z"
      aria-label="Check"
      {...props}
    />
  );
}

// ── Link / Shortcut ──────────────────────────────────────────────────
export function LinkIcon(props: P) {
  return (
    <FluentIcon
      paths="M11 3a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V5H5v10h5v-1a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h7zm5.707 6.293a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L13.586 11H9a1 1 0 1 1 0-2h4.586l-2.293-2.293a1 1 0 0 1 1.414-1.414l4 4z"
      aria-label="Link"
      {...props}
    />
  );
}

// ── Unpin ────────────────────────────────────────────────────────────
export function UnpinIcon(props: P) {
  return (
    <FluentIcon
      paths="M3.293 3.293a1 1 0 0 1 1.414 0l12 12a1 1 0 0 1-1.414 1.414l-2.757-2.757L11.5 15l-1.5 3-1.5-3-3 1.5 1.5-4.5L3.5 8.5l1.05-2.1L3.293 4.707a1 1 0 0 1 0-1.414zM8.5 4.5L12 1l4.5 4.5-3.5 3.5"
      aria-label="Unpin"
      {...props}
    />
  );
}

// ── Rocket ───────────────────────────────────────────────────────────
export function RocketIcon(props: P) {
  return (
    <FluentIcon
      paths="M10 2c3.5 0 6.5 2.5 7.5 6-.5 2-2 4.5-4.5 7L10 12 7 9c2.5-2.5 5-4 7-4.5C14 3.5 12 2 10 2zM4.5 13.5L2 14l2.5 2.5L2 19l2.5-2.5L7 19l.5-2.5-3-3z"
      aria-label="Rocket"
      {...props}
    />
  );
}

// ── Lock (closed padlock) ────────────────────────────────────────────
export function LockIcon(props: P) {
  return (
    <FluentIcon
      paths="M6 8V6a4 4 0 1 1 8 0v2h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h1zm2 0h4V6a2 2 0 1 0-4 0v2zm2 4a1 1 0 0 0-1 1v2a1 1 0 1 0 2 0v-2a1 1 0 0 0-1-1z"
      aria-label="Lock"
      {...props}
    />
  );
}

// ── Unlock (open padlock) ────────────────────────────────────────────
export function UnlockIcon(props: P) {
  return (
    <FluentIcon
      paths="M6 8V6a4 4 0 1 1 8 0h-2a2 2 0 1 0-4 0v2h7a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h1zm4 4a1 1 0 0 0-1 1v2a1 1 0 1 0 2 0v-2a1 1 0 0 0-1-1z"
      aria-label="Unlock"
      {...props}
    />
  );
}

// ── Target / Crosshair ───────────────────────────────────────────────
export function TargetIcon(props: P) {
  return (
    <FluentIcon
      paths="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm0 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
      aria-label="Target"
      {...props}
    />
  );
}

// ── Coins ────────────────────────────────────────────────────────────
export function CoinsIcon(props: P) {
  return (
    <FluentIcon
      paths="M10 3c-4.418 0-8 1.343-8 3s3.582 3 8 3 8-1.343 8-3-3.582-3-8-3zm-8 5v3c0 1.657 3.582 3 8 3s8-1.343 8-3V8c-1.5 1.2-4.5 2-8 2s-6.5-.8-8-2zm0 5v3c0 1.657 3.582 3 8 3s8-1.343 8-3v-3c-1.5 1.2-4.5 2-8 2s-6.5-.8-8-2z"
      aria-label="Coins"
      {...props}
    />
  );
}

// ── Frown / Sad Face ─────────────────────────────────────────────────
export function FrownIcon(props: P) {
  return (
    <FluentIcon
      paths="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm-3 5a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm6 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-6 7a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .354.854C11.15 15.05 9.8 15.5 8.5 15.5S5.85 15.05 5.146 14.354A.5.5 0 0 1 5.5 14z"
      aria-label="Frown"
      {...props}
    />
  );
}

// ── Clover ───────────────────────────────────────────────────────────
export function CloverIcon(props: P) {
  return (
    <FluentIcon
      paths="M10 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3zm-5 5a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3zm10 0a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3zm-5 5a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"
      aria-label="Clover"
      {...props}
    />
  );
}

// ── Key ──────────────────────────────────────────────────────────────
export function KeyIcon(props: P) {
  return (
    <FluentIcon
      paths="M13.5 2a4.5 4.5 0 0 0-4.33 5.757L2.293 14.636a1 1 0 0 0-.293.707V17a1 1 0 0 0 1 1h1.5v-1.5H6V15h1.5v-1.5L9.17 12.08A4.5 4.5 0 1 0 13.5 2zm2 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
      aria-label="Key"
      {...props}
    />
  );
}

