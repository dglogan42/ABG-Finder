import { api } from "./client";
import type { Match } from "../types";

export function swipe(
  profileId: string,
  action: "like" | "pass" | "superlike"
) {
  return api<{ success: boolean; match: Match | null }>("/swipes", {
    method: "POST",
    body: JSON.stringify({ profileId, action }),
  });
}