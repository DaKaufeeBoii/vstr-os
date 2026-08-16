"use client";

import React from "react";
import { OSProvider } from "@/store/windowStore";
import { OSSettingsProvider } from "@/store/osSettingsStore";
import Desktop from "@/components/os/Desktop";

export default function Home() {
  return (
    <OSSettingsProvider>
      <OSProvider>
        <Desktop />
      </OSProvider>
    </OSSettingsProvider>
  );
}
