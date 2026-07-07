import { Router } from "express";
import { randomUUID } from "crypto";
import { getDb } from "../db.js";
import { computeCompatibility } from "../services/feedAggregator.js";
import type { Profile } from "../types.js";

export const swipesRouter = Router();

const USER_VIBES = ["baddie", "nightlife", "fashion", "foodie"];

function getProfile(id: string): Profile | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM profiles WHERE id = ?").get(id) as
    | Record<string, unknown>
    | undefined;
  if (!row) return null;

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
    isOnline: !!(row.is_online as number),
    lastActive: row.last_active as string,
  };
}

swipesRouter.post("/", (req, res) => {
  const { profileId, action } = req.body as {
    profileId: string;
    action: "like" | "pass" | "superlike";
  };

  if (!profileId || !action) {
    res.status(400).json({ error: "profileId and action required" });
    return;
  }

  const db = getDb();
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO swipes (profile_id, target_id, action, created_at)
     VALUES ('me', ?, ?, ?)
     ON CONFLICT(profile_id, target_id) DO UPDATE SET action = excluded.action`
  ).run(profileId, action, now);

  let match = null;

  if (action === "like" || action === "superlike") {
    const profile = getProfile(profileId);
    if (profile) {
      const shouldMatch =
        action === "superlike" || Math.random() > 0.4;

      if (shouldMatch) {
        const { score, sharedVibes } = computeCompatibility(
          USER_VIBES,
          profile
        );
        const matchId = randomUUID();

        db.prepare(
          `INSERT INTO matches (id, profile_id, target_id, compatibility, shared_vibes, matched_at)
           VALUES (?, 'me', ?, ?, ?, ?)`
        ).run(matchId, profileId, score, JSON.stringify(sharedVibes), now);

        match = {
          id: matchId,
          profile,
          matchedAt: now,
          compatibility: score,
          sharedVibes,
        };
      }
    }
  }

  res.json({ success: true, match });
});