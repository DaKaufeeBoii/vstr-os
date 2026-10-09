"use client";

import React, { useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOS } from "@/store/windowStore";
import { useOSSettings } from "@/store/osSettingsStore";
import { systemMissions } from "@/data/systemMissions";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { OsIcon } from "@/components/icons/OsIcon";
import { useSound } from "@/utils/useSound";

export default function NotificationCenter() {
  const { isNotificationCenterOpen, closeNotificationCenter } = useOS();
  const { notifications, dismissNotification, clearNotifications, unlockedMissions } = useOSSettings();
  const { playClick } = useSound();
  const [dndEnabled, setDndEnabled] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const panelRef = useRef<HTMLDivElement>(null);

  const focusTrapRef = useFocusTrap({
    enabled: isNotificationCenterOpen,
    onEscape: () => closeNotificationCenter(),
    clickOutsideToClose: true,
    initialFocusRef: panelRef,
  });

  // Recent completed missions as persistent system notifications
  const missionNotifications = useMemo(() => {
    return unlockedMissions
      .map((id) => systemMissions.find((m) => m.id === id))
      .filter((m): m is (typeof systemMissions)[number] => m !== undefined)
      .slice(-5)
      .reverse();
  }, [unlockedMissions]);

  // Generate calendar days for current month
  const calendarDays = useMemo(() => {
    const today = new Date();
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: Array<{ day: number; isCurrentMonth: boolean; isToday: boolean }> = [];

    // Prev month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday =
        i === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();
      days.push({ day: i, isCurrentMonth: true, isToday });
    }

    // Next month padding to fill 35 or 42 cells
    const remaining = 35 - days.length;
    if (remaining > 0) {
      for (let i = 1; i <= remaining; i++) {
        days.push({ day: i, isCurrentMonth: false, isToday: false });
      }
    }

    return days;
  }, [selectedDate]);

  const monthYearString = useMemo(() => {
    return selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }, [selectedDate]);

  return (
    <AnimatePresence>
      {isNotificationCenterOpen && (
        <motion.div
          ref={(el) => {
            panelRef.current = el;
            if (focusTrapRef.current) focusTrapRef.current = el;
          }}
          initial={{ opacity: 0, x: 20, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, y: 10, scale: 0.96 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          style={{
            position: "fixed",
            bottom: "60px",
            right: "16px",
            width: "360px",
            maxHeight: "calc(100vh - 80px)",
            background: "var(--os-surface)",
            backdropFilter: "blur(28px) saturate(180%)",
            WebkitBackdropFilter: "blur(28px) saturate(180%)",
            border: "1px solid var(--os-border)",
            borderRadius: "16px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
            padding: "18px",
            zIndex: 9999,
            color: "var(--os-text)",
            fontFamily: "var(--font-inter), sans-serif",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            overflowY: "auto",
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Notification Center"
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: "10px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  color: "var(--os-amber)",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                NOTIFICATIONS
              </span>
              <span
                style={{
                  fontSize: "11px",
                  background: "rgba(255,255,255,0.08)",
                  padding: "1px 6px",
                  borderRadius: "10px",
                  color: "var(--os-text-muted)",
                }}
              >
                {notifications.length + missionNotifications.length}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <button
                onClick={() => {
                  playClick();
                  setDndEnabled((v) => !v);
                }}
                title={dndEnabled ? "Turn off Focus Assist" : "Turn on Focus Assist (Do Not Disturb)"}
                style={{
                  background: dndEnabled ? "var(--os-amber)" : "transparent",
                  color: dndEnabled ? "#000" : "var(--os-text-muted)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px",
                  padding: "4px 8px",
                  fontSize: "11px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  transition: "all 0.15s",
                }}
              >
                <span>{dndEnabled ? "🔕 Focus ON" : "🔔 Focus"}</span>
              </button>

              {(notifications.length > 0 || missionNotifications.length > 0) && (
                <button
                  onClick={() => {
                    playClick();
                    clearNotifications();
                  }}
                  style={{
                    background: "transparent",
                    color: "var(--os-text-muted)",
                    border: "none",
                    fontSize: "11px",
                    cursor: "pointer",
                    padding: "4px 6px",
                    borderRadius: "4px",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--os-text)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--os-text-muted)")}
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "220px", overflowY: "auto" }}>
            {notifications.length === 0 && missionNotifications.length === 0 ? (
              <div
                style={{
                  padding: "24px 0",
                  textAlign: "center",
                  color: "var(--os-text-muted)",
                  fontSize: "12px",
                }}
              >
                <div style={{ fontSize: "24px", marginBottom: "6px", opacity: 0.6 }}>📭</div>
                No new notifications
              </div>
            ) : (
              <>
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: "10px",
                      padding: "10px 12px",
                      display: "flex",
                      gap: "10px",
                      alignItems: "flex-start",
                      position: "relative",
                    }}
                  >
                    <span style={{ fontSize: "18px" }}>{notif.icon || "🔔"}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--os-text)" }}>{notif.title}</div>
                      <div style={{ fontSize: "11px", color: "var(--os-text-muted)", marginTop: "2px", lineHeight: 1.3 }}>
                        {notif.description}
                      </div>
                    </div>
                    <button
                      onClick={() => dismissNotification(notif.id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--os-text-muted)",
                        cursor: "pointer",
                        fontSize: "12px",
                        padding: "2px",
                      }}
                      title="Dismiss"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {missionNotifications.map((mission) => (
                  <div
                    key={mission.id}
                    style={{
                      background: "rgba(245, 158, 11, 0.06)",
                      border: "1px solid rgba(245, 158, 11, 0.15)",
                      borderRadius: "10px",
                      padding: "10px 12px",
                      display: "flex",
                      gap: "10px",
                      alignItems: "flex-start",
                    }}
                  >
                    <span style={{ fontSize: "18px" }}>{mission.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--os-amber)" }}>
                        {mission.title}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--os-text-muted)", marginTop: "2px", lineHeight: 1.3 }}>
                        {mission.description}
                      </div>
                      <div style={{ fontSize: "10px", color: "var(--os-jade)", marginTop: "4px", fontWeight: 500 }}>
                        ✓ Unlocked
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Calendar / Date Widget */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--os-text)",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {monthYearString}
              </span>
              <div style={{ display: "flex", gap: "4px" }}>
                <button
                  onClick={() => {
                    playClick();
                    setSelectedDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--os-text-muted)",
                    cursor: "pointer",
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                  title="Previous month"
                >
                  ◀
                </button>
                <button
                  onClick={() => {
                    playClick();
                    setSelectedDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--os-text-muted)",
                    cursor: "pointer",
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                  title="Next month"
                >
                  ▶
                </button>
              </div>
            </div>

            {/* Weekday headers */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                textAlign: "center",
                fontSize: "10px",
                color: "var(--os-text-muted)",
                marginBottom: "6px",
                fontWeight: 600,
              }}
            >
              <span>Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
            </div>

            {/* Calendar grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "2px",
                textAlign: "center",
                fontSize: "11px",
              }}
            >
              {calendarDays.map((d, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "5px 0",
                    borderRadius: "50%",
                    color: d.isToday
                      ? "#000"
                      : d.isCurrentMonth
                      ? "var(--os-text)"
                      : "rgba(255,255,255,0.2)",
                    background: d.isToday ? "var(--os-primary)" : "transparent",
                    fontWeight: d.isToday ? "bold" : "normal",
                  }}
                >
                  {d.day}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
