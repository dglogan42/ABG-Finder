import { Router } from "express";
import { getDb } from "../db.js";
import {
  computeCompatibility,
  rankProfiles,
} from "../services/feedAggregator.js";
import type { DiscoveryFilters, Profile } from "../types.js";

export const discoverRouter = Router();

const USER_VIBES = ["baddie", "nightlife", "fashion", "foodie"];

function rowToProfile(row: Record<string, unknown>): Profile {
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
  };
}

discoverRouter.get("/", (req, res) => {
  const db = getDb();
  const filters: DiscoveryFilters = {
    maxDistance: req.query.maxDistance
      ? Number(req.query.maxDistance)
      : undefined,
    minAge: req.query.minAge ? Number(req.query.minAge) : undefined,
    maxAge: req.query.maxAge ? Number(req.query.maxAge) : undefined,
    city: req.query.city as string | undefined,
    vibes: req.query.vibes
      ? (req.query.vibes as string).split(",")
      : undefined,
  };

  const swiped = db
    .prepare("SELECT target_id FROM swipes WHERE profile_id = 'me'")
    .all() as Array<{ target_id: string }>;
  const swipedIds = swiped.map((s) => s.target_id);

  let query = "SELECT *, 0 as distance_km FROM profiles WHERE 1=1";
  const params: (string | number)[] = [];

  if (swipedIds.length) {
    const placeholders = swipedIds.map(() => "?").join(",");
    query += ` AND id NOT IN (${placeholders})`;
    params.push(...swipedIds);
  }

  if (filters.minAge) {
    query += " AND age >= ?";
    params.push(filters.minAge);
  }
  if (filters.maxAge) {
    query += " AND age <= ?";
    params.push(filters.maxAge);
  }
  if (filters.city) {
    query += " AND city LIKE ?";
    params.push(`%${filters.city}%`);
  }

  const rows = db.prepare(query).all(...params) as Array<
    Record<string, unknown>
  >;

  let profiles = rows.map(rowToProfile);

  if (filters.vibes?.length) {
    profiles = profiles.filter((p) =>
      filters.vibes!.some((v) => p.vibes.includes(v))
    );
  }

  profiles = rankProfiles(profiles, USER_VIBES);

  const enriched = profiles.map((p) => {
    const { score, sharedVibes } = computeCompatibility(USER_VIBES, p);
    return { ...p, compatibility: score, sharedVibes };
  });

  res.json({ profiles: enriched });
});

discoverRouter.get("/:id", (req, res) => {
  const db = getDb();
  const row = db
    .prepare("SELECT *, 0 as distance_km FROM profiles WHERE id = ?")
    .get(req.params.id) as Record<string, unknown> | undefined;

  if (!row) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }

  const profile = rowToProfile(row);
  const { score, sharedVibes } = computeCompatibility(USER_VIBES, profile);
  res.json({ profile: { ...profile, compatibility: score, sharedVibes } });
});