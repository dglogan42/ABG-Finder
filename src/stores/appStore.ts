import { create } from "zustand";
import type { SocialPlatform } from "../types";

interface AppState {
  connectedPlatforms: SocialPlatform[];
  activeFeedPlatforms: SocialPlatform[];
  setConnectedPlatforms: (platforms: SocialPlatform[]) => void;
  toggleFeedPlatform: (platform: SocialPlatform) => void;
  setAllFeedPlatforms: (platforms: SocialPlatform[]) => void;
}

const ALL_PLATFORMS: SocialPlatform[] = ["instagram", "facebook", "x", "tiktok"];

export const useAppStore = create<AppState>((set) => ({
  connectedPlatforms: [],
  activeFeedPlatforms: ALL_PLATFORMS,
  setConnectedPlatforms: (platforms) => set({ connectedPlatforms: platforms }),
  toggleFeedPlatform: (platform) =>
    set((s) => ({
      activeFeedPlatforms: s.activeFeedPlatforms.includes(platform)
        ? s.activeFeedPlatforms.filter((p) => p !== platform)
        : [...s.activeFeedPlatforms, platform],
    })),
  setAllFeedPlatforms: (platforms) => set({ activeFeedPlatforms: platforms }),
}));