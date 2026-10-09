"use client";

import React from "react";
import { OSProvider } from "@/store/windowStore";
import { OSSettingsProvider } from "@/store/osSettingsStore";
import { MusicProvider } from "@/store/musicStore";
import Desktop from "@/components/os/Desktop";

export default function Home() {
  return (
    <OSSettingsProvider>
      <OSProvider>
        <MusicProvider>
          <Desktop />
        </MusicProvider>
      </OSProvider>
    </OSSettingsProvider>
  );
}
