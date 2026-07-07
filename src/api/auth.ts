import { api } from "./client";
import type { AuthStatus, SocialPlatform } from "../types";

export function fetchAuthStatus() {
  return api<{ accounts: AuthStatus[] }>("/auth/status");
}

export function getAuthUrl(platform: SocialPlatform) {
  return api<{ platform: SocialPlatform; url: string; demo: boolean }>(
    `/auth/${platform}/url`
  );
}

export function connectDemo(platform: SocialPlatform) {
  return api<{ account: { platform: SocialPlatform; username: string } }>(
    `/auth/${platform}/connect-demo`,
    { method: "POST" }
  );
}

export function disconnect(platform: SocialPlatform) {
  return api<{ success: boolean }>(`/auth/${platform}`, { method: "DELETE" });
}