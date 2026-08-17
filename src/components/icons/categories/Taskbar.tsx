// Taskbar / System Tray icons — Fluent Design SVG paths (20x20 viewBox)
import React from "react";
import { FluentIcon, IconSize, IconBadge } from "../FluentIcon";

type P = { size?: IconSize; color?: string; className?: string; badge?: IconBadge };

// ── Windows Logo (stylised Win11 four-pane) ───────────────────────────
export function WindowsLogoIcon(props: P) {
  return (
    <FluentIcon
      paths="M0 3.449L8.16 2.33v7.88H0V3.45zm9.04-1.244L20 .5v9.71H9.04V2.205zm-9.04 8.565h8.16v7.88L0 17.531v-6.761zm9.04 0H20v9.71l-10.96-1.706V10.77z"
      aria-label="Windows"
      {...props}
    />
  );
}

// ── Search / Magnify ─────────────────────────────────────────────────
export function SearchIcon(props: P) {
  return (
    <FluentIcon
      paths="M12.9 14.32a8 8 0 1 1 1.41-1.41l4.38 4.37-1.42 1.42-4.37-4.38zm-.82-1.22a6 6 0 1 0-.35.35l.35-.35z"
      aria-label="Search"
      {...props}
    />
  );
}

// ── Volume / Speaker ─────────────────────────────────────────────────
export function VolumeIcon(props: P) {
  return (
    <FluentIcon
      paths={[
        "M3 7.5A1.5 1.5 0 0 1 4.5 6H7l3.8-3.16A1 1 0 0 1 12.5 3.6v12.8a1 1 0 0 1-1.7.76L7 14H4.5A1.5 1.5 0 0 1 3 12.5v-5z",
        "M14.5 7.2a1 1 0 0 1 1.4.2 4.5 4.5 0 0 1 0 5.2 1 1 0 0 1-1.6-1.2 2.5 2.5 0 0 0 0-2.8 1 1 0 0 1 .2-1.4z",
        "M16.8 4.8a1 1 0 0 1 1.4.2 8 8 0 0 1 0 10 1 1 0 0 1-1.6-1.2 6 6 0 0 0 0-7.6 1 1 0 0 1 .2-1.4z",
      ]}
      aria-label="Volume"
      {...props}
    />
  );
}

// ── Wi-Fi Signal ──────────────────────────────────────────────────────
export function WifiIcon(props: P) {
  return (
    <FluentIcon
      paths={[
        "M10 14.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z",
        "M6.82 11.82a1 1 0 0 1 1.38.16 3.75 3.75 0 0 1 3.6 0 1 1 0 1 1-1.04 1.7 1.75 1.75 0 0 0-1.68 0 1 1 0 0 1-1.38-.16l-.88-1.7z",
        "M3.28 8.29a1 1 0 0 1 1.4.15 8.75 8.75 0 0 1 10.64 0 1 1 0 1 1-1.24 1.56 6.75 6.75 0 0 0-8.22 0 1 1 0 0 1-1.4-.15l-1.18-1.56z",
        "M.78 4.99a1 1 0 0 1 1.4.15 13.75 13.75 0 0 1 15.64 0 1 1 0 0 1-1.24 1.57 11.75 11.75 0 0 0-13.36 0 1 1 0 0 1-1.4-.15l-1.04-1.57z",
      ]}
      aria-label="Wifi"
      {...props}
    />
  );
}

// ── Battery ───────────────────────────────────────────────────────────
export function BatteryIcon(props: P) {
  return (
    <FluentIcon
      paths={[
        "M2 6.5A2.5 2.5 0 0 1 4.5 4h10A2.5 2.5 0 0 1 17 6.5v1h.75a1.25 1.25 0 0 1 1.25 1.25v2.5A1.25 1.25 0 0 1 17.75 12.5H17v1A2.5 2.5 0 0 1 14.5 16h-10A2.5 2.5 0 0 1 2 13.5v-7zm2.5-1A1 1 0 0 0 3.5 6.5v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-10zM17.5 9v2h.25a.25.25 0 0 0 .25-.25v-1.5a.25.25 0 0 0-.25-.25H17.5z",
        "M5.5 7a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h6.5a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H5.5z",
      ]}
      aria-label="Battery"
      {...props}
    />
  );
}

// ── Clock / Calendar ─────────────────────────────────────────────────
export function ClockIcon(props: P) {
  return (
    <FluentIcon
      paths="M10 2a8 8 0 1 0 0 16A8 8 0 0 0 10 2zm0 1a7 7 0 1 1 0 14A7 7 0 0 1 10 3zm.5 3.5a.5.5 0 0 0-1 0V10a.5.5 0 0 0 .146.354l3 3a.5.5 0 0 0 .707-.708L10.5 9.793V6.5z"
      aria-label="Clock"
      {...props}
    />
  );
}

// ── Notification Bell ────────────────────────────────────────────────
export function NotifIcon(props: P) {
  return (
    <FluentIcon
      paths="M10 1.5a1 1 0 0 1 1 1V3a6 6 0 0 1 5 5.917l.5 5.083H16a.5.5 0 0 1 0 1h-4.5a1.5 1.5 0 0 1-3 0H4a.5.5 0 0 1 0-1h.5l.5-5.083A6 6 0 0 1 10 3V2.5a1 1 0 0 1 0-2v1z"
      aria-label="Notif"
      {...props}
    />
  );
}

// ── Power / Shutdown ─────────────────────────────────────────────────
export function PowerIcon(props: P) {
  return (
    <FluentIcon
      paths="M10 2.5a.5.5 0 0 0-.5.5v5.5a.5.5 0 0 0 1 0V3a.5.5 0 0 0-.5-.5zM5.636 4.136a.5.5 0 0 0-.707.707 6.5 6.5 0 1 0 9.942 0 .5.5 0 0 0-.707-.707 5.5 5.5 0 1 1-8.528 0z"
      aria-label="Power"
      {...props}
    />
  );
}

// ── Widgets / Dashboard ──────────────────────────────────────────────
export function WidgetsIcon(props: P) {
  return (
    <FluentIcon
      paths="M3 3h6v6H3V3zm8 0h6v6h-6V3zM3 11h6v6H3v-6zm8 0h6v6h-6v-6z"
      aria-label="Widgets"
      {...props}
    />
  );
}

// ── Bluetooth ────────────────────────────────────────────────────────
export function BluetoothIcon(props: P) {
  return (
    <FluentIcon
      paths="M10 2a.5.5 0 0 0-.5.5v6.5l-4.146-4.146a.5.5 0 0 0-.708.708l4.5 4.5a.5.5 0 0 0 .708 0l4.5-4.5a.5.5 0 0 0-.708-.708L10.5 9V2.5a.5.5 0 0 0-.5-.5zm0 15.5a.5.5 0 0 1 .5.5v6.5l4.146-4.146a.5.5 0 0 1 .708.708l-4.5 4.5a.5.5 0 0 1-.708 0l-4.5-4.5a.5.5 0 0 1 .708-.708L9.5 24.5V18a.5.5 0 0 1 .5-.5zM10.5 10l3.646 3.646a.5.5 0 0 1 0 .708L10.5 18v-8zm-1 0v8l-3.646-3.646a.5.5 0 0 1 0-.708L9.5 10z" viewBox="0 0 20 28"
      aria-label="Bluetooth"
      {...props}
    />
  );
}

// ── Night Light / Moon ───────────────────────────────────────────────
export function NightLightIcon(props: P) {
  return (
    <FluentIcon
      paths="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 1a7 7 0 1 1 0 14A7 7 0 0 1 10 3zm2.5 3a5 5 0 0 1 0 10 5 5 0 0 0 0-10z"
      aria-label="NightLight"
      {...props}
    />
  );
}

// ── Rotation Lock ───────────────────────────────────────────────────
export function RotationLockIcon(props: P) {
  return (
    <FluentIcon
      paths="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 1a7 7 0 1 1 0 14A7 7 0 0 1 10 3zm-1 3v4.5H4.5a.5.5 0 0 0 0 1H9V14a.5.5 0 0 0 1 0V9.5h4.5a.5.5 0 0 0 0-1H10V6a.5.5 0 0 0-1 0z"
      aria-label="RotationLock"
      {...props}
    />
  );
}

// ── Hotspot / Broadcast ──────────────────────────────────────────────
export function HotspotIcon(props: P) {
  return (
    <FluentIcon
      paths="M10 10a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm0-3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0-1a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm0-2a8 8 0 1 0 0 16 8 8 0 0 0 0-16z"
      aria-label="Hotspot"
      {...props}
    />
  );
}

// ── Nearby Share ─────────────────────────────────────────────────────
export function NearbyShareIcon(props: P) {
  return (
    <FluentIcon
      paths="M10 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm0-2a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm-5 12a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm0-2a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm10 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm0-2a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"
      aria-label="NearbyShare"
      {...props}
    />
  );
}

// ── Cast / Wireless Display ──────────────────────────────────────────
export function CastIcon(props: P) {
  return (
    <FluentIcon
      paths="M2 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-4v1h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4v-1H3a1 1 0 0 1-1-1V5zm3 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a4 4 0 0 0-4-4v1a3 3 0 0 1 3 3h1z"
      aria-label="Cast"
      {...props}
    />
  );
}

// ── Accessibility ────────────────────────────────────────────────────
export function AccessibilityIcon(props: P) {
  return (
    <FluentIcon
      paths="M10 2a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM4 7a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H6.5l-1 5.5-1.5 4.5a.5.5 0 0 1-.948-.316l1.2-3.6.748-4.084H4a1 1 0 0 1-1-1zm12 0a1 1 0 0 1-1 1h-2.5l-.748 4.084 1.2 3.6a.5.5 0 0 1-.948.316l-1.5-4.5-1-5.5H15a1 1 0 0 1 1 1z"
      aria-label="Accessibility"
      {...props}
    />
  );
}
