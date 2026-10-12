"use client";
import { createContext, useContext } from "react";

export interface ContextMenuSubmenuContextValue {
  activeSubmenuId: string | null;
  setActiveSubmenuId: (id: string | null) => void;
}

export const ContextMenuSubmenuContext = createContext<ContextMenuSubmenuContextValue>({
  activeSubmenuId: null,
  setActiveSubmenuId: () => {},
});

export function useContextMenuSubmenu() {
  return useContext(ContextMenuSubmenuContext);
}
