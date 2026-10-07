/**
 * Icon registry — maps OS icon string keys (stored in WINDOW_CONFIGS and context menus)
 * to authentic Windows 11 Fluent Design SVG path components.
 */
import React from "react";
import type { IconSize, IconBadge } from "./OsIconWrapper";

// Import custom Fluent SVG category components
import {
  TerminalIcon,
  SettingsIcon,
  UserIcon,
  InfoIcon,
  ShieldIcon,
  MailIcon,
  LogIcon,
  TrophyIcon,
  SkillsIcon,
  PhotoIcon,
  GameIcon,
  DiskIcon,
  PawIcon,
  NotepadIcon,
  GuestbookIcon,
} from "./categories/Application";

import {
  CloseIcon,
  MinimizeIcon,
  MaximizeIcon,
  RestoreIcon,
  RefreshIcon,
  NewIcon,
  SortIcon,
  ViewIcon,
  PersonalizeIcon,
  DisplayIcon,
  PropertiesIcon,
  ChevronRightIcon,
  PinIcon,
  UnpinIcon,
  CheckIcon,
  LinkIcon,
  RocketIcon,
  LockIcon,
  UnlockIcon,
  TargetIcon,
  CoinsIcon,
  FrownIcon,
  CloverIcon,
  KeyIcon,
} from "./categories/Control";

import {
  FolderIcon,
  FolderOpenIcon,
  FileIcon,
  DriveIcon,
  TrashIcon,
} from "./categories/FileSystem";

import {
  WindowsLogoIcon,
  SearchIcon,
  VolumeIcon,
  WifiIcon,
  BatteryIcon,
  ClockIcon,
  NotifIcon,
  PowerIcon,
  WidgetsIcon,
  BluetoothIcon,
  NightLightIcon,
  RotationLockIcon,
  HotspotIcon,
  NearbyShareIcon,
  CastIcon,
  AccessibilityIcon,
} from "./categories/Taskbar";

// Per-icon default vivid colors (Win11 Fluent palette)
const ICON_COLORS: Record<string, string> = {
  user:          "#60a5fa", // blue-400
  folder:        "#fbbf24", // amber-400
  skills:        "#a78bfa", // violet-400
  log:           "#34d399", // emerald-400
  trophy:        "#fbbf24", // amber-400
  terminal:      "#10b981", // emerald-500
  mail:          "#60a5fa", // blue-400
  game:          "#f472b6", // pink-400
  info:          "#38bdf8", // sky-400
  notepad:       "#38bdf8", // sky-400
  document:      "#38bdf8",
  guestbook:     "#ec4899", // pink-500
  chat:          "#ec4899",
  settings:      "#94a3b8", // slate-400
  photo:         "#fb923c", // orange-400
  image:         "#fb923c",
  disk:          "#a78bfa", // violet-400
  paw:           "#f87171", // red-400
  shield:        "#ef4444", // red-500
  trash:         "#94a3b8", // slate-400
  refresh:       "#34d399", // emerald-400
  new:           "#60a5fa", // blue-400
  sort:          "#94a3b8",
  view:          "#38bdf8",
  personalize:   "#f472b6",
  palette:       "#f472b6",
  display:       "#60a5fa",
  properties:    "#94a3b8",
  chevronRight:  "#6b7280",
  pin:           "#fbbf24",
  unpin:         "#94a3b8",
  close:         "#f87171",
  minimize:      "#fbbf24",
  maximize:      "#34d399",
  restore:       "#34d399",
  windows:       "#60a5fa",
  search:        "#94a3b8",
  volume:        "#60a5fa",
  wifi:          "#34d399",
  battery:       "#34d399",
  clock:         "#e2e8f0",
  notif:         "#fbbf24",
  power:         "#f87171",
  widgets:       "#818cf8",
  rotationLock:  "#fbbf24",
  hotspot:       "#60a5fa",
  nearbyShare:   "#34d399",
  cast:          "#a78bfa",
  accessibility: "#ef4444",
  bluetooth:     "#60a5fa",
  nightLight:    "#fbbf24",
  rocket:        "#60a5fa",
  unlock:        "#34d399",
  lock:          "#94a3b8",
  target:        "#f87171",
  coins:         "#fbbf24",
  frown:         "#ef4444",
  clover:        "#34d399",
  key:           "#60a5fa",
  check:         "#34d399",
  link:          "#60a5fa",
};

type IconComponentType = React.ComponentType<{
  size?: IconSize;
  color?: string;
  className?: string;
  badge?: IconBadge;
}>;

const FLUENT_MAP: Record<string, IconComponentType> = {
  user:          UserIcon,
  folder:        FolderIcon,
  skills:        SkillsIcon,
  log:           LogIcon,
  trophy:        TrophyIcon,
  terminal:      TerminalIcon,
  mail:          MailIcon,
  game:          GameIcon,
  info:          InfoIcon,
  notepad:       NotepadIcon,
  document:      NotepadIcon,
  guestbook:     GuestbookIcon,
  chat:          GuestbookIcon,
  settings:      SettingsIcon,
  photo:         PhotoIcon,
  image:         PhotoIcon,
  disk:          DiskIcon,
  paw:           PawIcon,
  shield:        ShieldIcon,
  trash:         TrashIcon,
  refresh:       RefreshIcon,
  new:           NewIcon,
  sort:          SortIcon,
  view:          ViewIcon,
  personalize:   PersonalizeIcon,
  palette:       PersonalizeIcon,
  display:       DisplayIcon,
  properties:    PropertiesIcon,
  chevronRight:  ChevronRightIcon,
  pin:           PinIcon,
  unpin:         UnpinIcon,
  close:         CloseIcon,
  minimize:      MinimizeIcon,
  maximize:      MaximizeIcon,
  restore:       RestoreIcon,
  windows:       WindowsLogoIcon,
  search:        SearchIcon,
  volume:        VolumeIcon,
  wifi:          WifiIcon,
  battery:       BatteryIcon,
  clock:         ClockIcon,
  notif:         NotifIcon,
  power:         PowerIcon,
  widgets:       WidgetsIcon,
  rotationLock:  RotationLockIcon,
  hotspot:       HotspotIcon,
  nearbyShare:   NearbyShareIcon,
  cast:          CastIcon,
  accessibility: AccessibilityIcon,
  bluetooth:     BluetoothIcon,
  nightLight:    NightLightIcon,
  rocket:        RocketIcon,
  unlock:        UnlockIcon,
  lock:          LockIcon,
  target:        TargetIcon,
  coins:         CoinsIcon,
  frown:         FrownIcon,
  clover:        CloverIcon,
  key:           KeyIcon,
  check:         CheckIcon,
  link:          LinkIcon,
};

interface OsIconProps {
  name: string;
  size?: IconSize;
  color?: string;
  className?: string;
  badge?: IconBadge;
}

export function OsIcon({ name, size = "md", color, className, badge }: OsIconProps) {
  const Component = FLUENT_MAP[name];
  if (!Component) return null;

  const resolvedColor = color ?? ICON_COLORS[name] ?? "currentColor";

  return <Component size={size} color={resolvedColor} className={className} badge={badge} />;
}

// Re-export named icon components for direct usage
export {
  FolderIcon,
  FolderOpenIcon,
  FileIcon,
  DriveIcon,
  TrashIcon,
  TerminalIcon,
  SettingsIcon,
  UserIcon,
  InfoIcon,
  ShieldIcon,
  MailIcon,
  LogIcon,
  TrophyIcon,
  SkillsIcon,
  PhotoIcon,
  GameIcon,
  DiskIcon,
  PawIcon,
  NotepadIcon,
  GuestbookIcon,
  WindowsLogoIcon,
  SearchIcon,
  VolumeIcon,
  WifiIcon,
  BatteryIcon,
  ClockIcon,
  NotifIcon,
  PowerIcon,
  WidgetsIcon,
  BluetoothIcon,
  NightLightIcon,
  RotationLockIcon,
  HotspotIcon,
  NearbyShareIcon,
  CastIcon,
  AccessibilityIcon,
  CloseIcon,
  MinimizeIcon,
  MaximizeIcon,
  RestoreIcon,
  RefreshIcon,
  NewIcon,
  SortIcon,
  ViewIcon,
  PersonalizeIcon,
  DisplayIcon,
  PropertiesIcon,
  ChevronRightIcon,
  PinIcon,
  UnpinIcon,
  CheckIcon,
  LinkIcon,
  RocketIcon,
  LockIcon,
  UnlockIcon,
  TargetIcon,
  CoinsIcon,
  FrownIcon,
  CloverIcon,
  KeyIcon,
};


