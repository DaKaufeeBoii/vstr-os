"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OsIcon } from "@/components/icons/OsIcon";
import { VolumeIcon, WifiIcon, BatteryIcon, NotifIcon, ShieldIcon, DisplayIcon, ChevronRightIcon, RotationLockIcon, HotspotIcon, NearbyShareIcon, CastIcon, AccessibilityIcon } from "@/components/icons";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useOSSettings } from "@/store/osSettingsStore";
import { useSound } from "@/utils/useSound";

interface QuickSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QuickAction {
  label: string;
  icon: string;
  active: boolean;
  onToggle: () => void;
}

export default function QuickSettings({ isOpen, onClose }: QuickSettingsProps) {
  const { volume, setVolume, brightness, setBrightness, highContrast, setHighContrast } = useOSSettings();
  const { playClick } = useSound();
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [nightLightEnabled, setNightLightEnabled] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isCharging, setIsCharging] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);

  // Focus trap for the quick settings panel
  const focusTrapRef = useFocusTrap({
    enabled: isOpen,
    onEscape: () => onClose(),
    clickOutsideToClose: true,
    initialFocusRef: panelRef,
  });

  // Simulate battery drain/charge
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel(prev => {
        if (isCharging) {
          return Math.min(100, prev + 1);
        }
        return Math.max(0, prev - 0.1);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [isCharging]);

  const quickActions: QuickAction[] = [
    { label: "Wi-Fi", icon: "wifi", active: wifiEnabled, onToggle: () => setWifiEnabled(v => !v) },
    { label: "Bluetooth", icon: "bluetooth", active: bluetoothEnabled, onToggle: () => setBluetoothEnabled(v => !v) },
    { label: "Night light", icon: "nightLight", active: nightLightEnabled, onToggle: () => setNightLightEnabled(v => !v) },
    { 
      label: "High Contrast", 
      icon: "accessibility", 
      active: highContrast, 
      onToggle: () => { 
        setHighContrast(!highContrast); 
        playClick(); 
      } 
    },
  ];

  const handleVolumeChange = useCallback((value: number) => {
    setVolume(value);
    playClick();
  }, [setVolume, playClick]);

  const handleBrightnessChange = useCallback((value: number) => {
    setBrightness(value);
    // In a real app, this would use Screen Wake Lock API or CSS filter
  }, [setBrightness]);

  const getBatteryIcon = () => {
    if (batteryLevel <= 20) return "🪫";
    return "🔋";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={(el) => {
            panelRef.current = el;
            if (focusTrapRef.current) focusTrapRef.current = el;
          }}
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          style={{
            position: "fixed",
            bottom: "60px",
            right: "16px",
            width: "340px",
            background: "var(--os-surface)",
            backdropFilter: "blur(24px) saturate(180%)",
            border: "1px solid var(--os-border)",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            padding: "16px",
            zIndex: 9999,
            color: "var(--os-text)",
            fontFamily: "var(--font-mono)",
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Quick Settings"
        >
          {/* Header with battery status */}
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: "16px",
            paddingBottom: "12px",
            borderBottom: "1px solid rgba(255,255,255,0.08)"
          }}>
            <span style={{ 
              fontSize: "12px", 
              fontWeight: "bold", 
              color: "var(--os-amber)",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.1em"
            }}>
              QUICK SETTINGS
            </span>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "8px",
              fontSize: "11px",
              color: "var(--os-text-muted)",
              fontFamily: "'JetBrains Mono', monospace"
            }}>
              <span style={{ 
                background: batteryLevel <= 15 ? "rgba(239,68,68,0.2)" : "transparent",
                padding: "2px 8px",
                borderRadius: "4px",
                border: `1px solid ${batteryLevel <= 15 ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.1)"}`,
                color: batteryLevel <= 15 ? "#ef4444" : "var(--os-text-muted)"
              }}>
                {isCharging ? "⚡" : getBatteryIcon()} {Math.round(batteryLevel)}%
              </span>
            </div>
          </div>

          {/* Quick Actions Grid - 4 rows of 2 + 1 row of 2 */}
          <div role="group" aria-label="Quick Actions" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
            {quickActions.map((action, index) => (
              <button
                key={action.label}
                onClick={action.onToggle}
                aria-pressed={action.active}
                aria-label={`${action.label} ${action.active ? "enabled" : "disabled"}`}
                style={{
                  background: action.active ? "var(--os-primary)" : "rgba(255,255,255,0.05)",
                  border: action.active ? "1px solid var(--os-primary)" : "1px solid var(--os-border)",
                  borderRadius: "12px",
                  padding: "10px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: action.active ? "var(--os-bg)" : "var(--os-text)",
                  cursor: "pointer",
                  fontSize: "12px",
                  transition: "all 0.15s",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) => {
                  if (!action.active) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!action.active) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  }
                }}
              >
                <OsIcon name={action.icon} size="sm" aria-hidden="true" />
                <span style={{ whiteSpace: "nowrap" }}>{action.label}</span>
              </button>
            ))}
          </div>

          {/* Volume Slider */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <VolumeIcon size="sm" color="var(--os-text-muted)" aria-hidden="true" />
              <span id="volume-label" style={{ fontSize: "11px", color: "var(--os-text-muted)", minWidth: "40px" }}>
                {Math.round(volume * 100)}%
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                aria-label="Volume"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(volume * 100)}
                aria-labelledby="volume-label"
                style={{ flex: 1, accentColor: "var(--os-amber)" }}
              />
            </div>
          </div>

          {/* Brightness Slider */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <DisplayIcon size="sm" color="var(--os-text-muted)" aria-hidden="true" />
              <span id="brightness-label" style={{ fontSize: "11px", color: "var(--os-text-muted)", minWidth: "40px" }}>
                {Math.round(brightness * 100)}%
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={brightness}
                onChange={(e) => handleBrightnessChange(parseFloat(e.target.value))}
                aria-label="Brightness"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(brightness * 100)}
                aria-labelledby="brightness-label"
                style={{ flex: 1, accentColor: "var(--os-amber)" }}
              />
            </div>
          </div>

          {/* Footer with shortcuts */}
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            paddingTop: "12px",
            borderTop: "1px solid rgba(255,255,255,0.08)"
          }}>
            <button
              onClick={() => onClose()}
              aria-label="Close Quick Settings"
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px",
                padding: "6px 12px",
                color: "var(--os-text-muted)",
                cursor: "pointer",
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--os-text-muted)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              }}
            >
              <span style={{ transform: "rotate(180deg)", display: "inline-block" }}>
              <OsIcon name="chevronRight" size="sm" aria-hidden="true" />
            </span>
              Back
            </button>
            <button
              onClick={() => { setIsCharging(!isCharging); }}
              aria-label={isCharging ? "Disable Charging" : "Enable Battery Saver"}
              aria-pressed={isCharging}
              style={{
                background: isCharging ? "rgba(16, 185, 129, 0.15)" : "transparent",
                border: `1px solid ${isCharging ? "rgba(16, 185, 129, 0.4)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: "6px",
                padding: "6px 12px",
                color: isCharging ? "#10b981" : "var(--os-text-muted)",
                cursor: "pointer",
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!isCharging) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isCharging) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--os-text-muted)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                }
              }}
            >
              {isCharging ? "⚡" : "🔋"} {isCharging ? "Charging" : "Battery Saver"}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
