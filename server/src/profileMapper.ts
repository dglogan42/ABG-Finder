import type { Profile, ProfileSauce } from "./types.js";

export function parseSauce(raw: unknown): ProfileSauce | undefined {
  if (!raw) return undefined;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as ProfileSauce;
    } catch {
      return undefined;
    }
  }
  return raw as ProfileSauce;
}

export function rowToProfile(row: Record<string, unknown>): Profile {
  return {
    id: row.id as string,
    name: row.name as string,
    age: row.age as number,
    city: row.city as string,
    bio: row.bio as string,
    avatar: row.avatar as string,
    coverImage: row.cover_image as string,
    vibes: JSON.parse(row.vibes as string),
    interests: JSON.parse(row.interests as string),
    socials: JSON.parse(row.socials as string),
    abgScore: row.abg_score as number,
    distanceKm: row.distance_km as number | undefined,
    isOnline: !!(row.is_online as number),
    lastActive: row.last_active as string,
    sauce: parseSauce(row.sauce),
  };
}