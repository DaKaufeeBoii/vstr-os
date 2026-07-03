"use client";

import React from "react";
import { OSProvider } from "@/store/windowStore";
import Desktop from "@/components/os/Desktop";

export default function Home() {
  return (
    <OSProvider>
      <Desktop />
    </OSProvider>
  );
}
