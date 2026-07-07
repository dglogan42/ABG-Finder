import { api } from "./client";
import type { FeedPost, SocialPlatform } from "../types";

export function fetchFeed(platforms?: SocialPlatform[], limit = 30) {
  const params = new URLSearchParams();
  if (platforms?.length) params.set("platforms", platforms.join(","));
  params.set("limit", String(limit));
  return api<{ posts: FeedPost[] }>(`/feed?${params}`);
}

export function fetchProfileFeed(profileId: string) {
  return api<{ posts: FeedPost[] }>(`/feed/profile/${profileId}`);
}