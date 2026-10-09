"use client";

import React, { createContext, useContext, useReducer, useCallback } from "react";
import type { WindowId } from "@/types";

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string; 
  cover?: string;
}

interface MusicState {
  playlist: Track[];
  currentTrackIndex: number;
  isPlaying: boolean;
  volume: number;
}

type MusicAction =
  | { type: "PLAY" }
  | { type: "PAUSE" }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "SET_TRACK"; index: number }
  | { type: "SET_VOLUME"; volume: number }
  | { type: "ADD_TRACK"; track: Track };

const musicReducer = (state: MusicState, action: MusicAction): MusicState => {
  switch (action.type) {
    case "PLAY": return { ...state, isPlaying: true };
    case "PAUSE": return { ...state, isPlaying: false };
    case "NEXT": return { ...state, currentTrackIndex: (state.currentTrackIndex + 1) % state.playlist.length, isPlaying: true };
    case "PREV": return { ...state, currentTrackIndex: (state.currentTrackIndex - 1 + state.playlist.length) % state.playlist.length, isPlaying: true };
    case "SET_TRACK": return { ...state, currentTrackIndex: action.index, isPlaying: true };
    case "SET_VOLUME": return { ...state, volume: action.volume };
    case "ADD_TRACK": return { ...state, playlist: [...state.playlist, action.track] };
    default: return state;
  }
};

const MusicContext = createContext<{ state: MusicState; dispatch: React.Dispatch<MusicAction> } | null>(null);

export const MusicProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(musicReducer, { playlist: [], currentTrackIndex: 0, isPlaying: false, volume: 0.7 });
  return <MusicContext.Provider value={{ state, dispatch }}>{children}</MusicContext.Provider>;
};

export const useMusic = () => useContext(MusicContext)!;
