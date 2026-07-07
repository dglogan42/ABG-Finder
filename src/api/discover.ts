import { api } from "./client";
import type { Profile } from "../types";

export function fetchDiscover(filters?: {
  maxDistance?: number;
  minAge?: number;
  maxAge?: number;
  city?: string;
  vibes?: string[];
}) {
  const params = new URLSearchParams();
  if (filters?.maxDistance) params.set("maxDistance", String(filters.maxDistance));
  if (filters?.minAge) params.set("minAge", String(filters.minAge));
  if (filters?.maxAge) params.set("maxAge", String(filters.maxAge));
  if (filters?.city) params.set("city", filters.city);
  if (filters?.vibes?.length) params.set("vibes", filters.vibes.join(","));

  const qs = params.toString();
  return api<{ profiles: Profile[] }>(`/discover${qs ? `?${qs}` : ""}`);
}

export function fetchProfile(id: string) {
  return api<{ profile: Profile }>(`/discover/${id}`);
}