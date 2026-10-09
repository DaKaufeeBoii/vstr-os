"use client";

import React, { useEffect, useState } from "react";
import { useAppSDK } from "@/lib/sdk/useAppSDK";
import { appRegistry } from "@/lib/sdk/appRegistry";
import type { AppManifest } from "@/lib/sdk/appManifest";
import { OsIcon } from "@/components/icons/OsIcon";

export default function AppGalleryApp() {
  const sdk = useAppSDK("app_gallery");
  const [apps, setApps] = useState<AppManifest[]>(() => appRegistry.listApps());
  const [pluginJson, setPluginJson] = useState<string>(`{
  "id": "demo-plugin",
  "name": "Demo Plugin",
  "version": "1.0.0",
  "description": "A demonstration plugin added to the registry.",
  "author": "System",
  "category": "utilities",
  "icon": "🧩",
  "permissions": [],
  "defaultConfig": {
    "width": 400,
    "height": 300
  }
}`);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    return appRegistry.subscribe(() => {
      setApps(appRegistry.listApps());
    });
  }, []);

  const handleRegisterPlugin = () => {
    try {
      const parsed = JSON.parse(pluginJson);
      if (!parsed.id || !parsed.name || !parsed.version) {
        setStatus("Error: Manifest must contain 'id', 'name', and 'version'.");
        return;
      }
      appRegistry.registerApp(parsed);
      setStatus(`Successfully registered "${parsed.name}" v${parsed.version}!`);
      sdk.notify("Plugin Registered", `Loaded "${parsed.name}" manifest successfully`, "📦");
    } catch (e: any) {
      setStatus(`JSON Error: ${e.message}`);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "var(--font-mono)", color: "var(--os-text)", height: "100%", overflowY: "auto" }}>
      <h2 style={{ color: "var(--os-amber)", marginBottom: 16 }}>📦 App Gallery</h2>
      
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <section>
          <h3 style={{ fontSize: 14, marginBottom: 8, color: "var(--os-text-muted)" }}>Installed Applications</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
            {apps.map((app) => (
              <div key={app.id} style={{ background: "rgba(255,255,255,0.05)", padding: 12, borderRadius: 8, border: "1px solid var(--os-border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {app.fluentIcon ? <OsIcon name={app.fluentIcon} size="sm" /> : <span>{app.icon}</span>}
                  <strong>{app.name}</strong> <span style={{ fontSize: 10, color: "var(--os-text-muted)" }}>v{app.version}</span>
                </div>
                <p style={{ fontSize: 11, color: "var(--os-text-muted)", marginTop: 4 }}>{app.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ borderTop: "1px solid var(--os-border)", paddingTop: 16 }}>
          <h3 style={{ fontSize: 14, marginBottom: 8, color: "var(--os-text-muted)" }}>Register Plugin</h3>
          <textarea
            value={pluginJson}
            onChange={(e) => setPluginJson(e.target.value)}
            rows={8}
            style={{ width: "100%", background: "#080c14", color: "#38bdf8", padding: 8, borderRadius: 4, fontFamily: "monospace", fontSize: 12 }}
          />
          <button 
            onClick={handleRegisterPlugin}
            style={{ marginTop: 8, padding: "8px 16px", background: "var(--os-amber)", border: "none", borderRadius: 4, cursor: "pointer", fontWeight: "bold" }}
          >
            Register Plugin
          </button>
          {status && <p style={{ fontSize: 11, marginTop: 8, color: status.startsWith("Error") ? "red" : "green" }}>{status}</p>}
        </section>
      </div>
    </div>
  );
}
