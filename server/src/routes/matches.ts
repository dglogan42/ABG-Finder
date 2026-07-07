import { Router } from "express";
import { getDb } from "../db.js";
import type { Match } from "../types.js";
import { rowToProfile } from "../profileMapper.js";

export const matchesRouter = Router();

matchesRouter.get("/", (_req, res) => {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT m.id as match_id, m.compatibility, m.shared_vibes, m.matched_at,
              p.id, p.name, p.age, p.city, p.bio, p.avatar, p.cover_image,
              p.vibes, p.interests, p.socials, p.abg_score, p.is_online, p.last_active, p.sauce
       FROM matches m
       JOIN profiles p ON p.id = m.target_id
       WHERE m.profile_id = 'me'
       ORDER BY m.matched_at DESC`
    )
    .all() as Array<Record<string, unknown>>;

  const matches: Match[] = rows.map((row) => {
    const profile = rowToProfile(row);

    return {
      id: row.match_id as string,
      profile,
      matchedAt: row.matched_at as string,
      compatibility: row.compatibility as number,
      sharedVibes: JSON.parse(row.shared_vibes as string),
    };
  });

  res.json({ matches });
});