import { Router } from "express";
import { getDb } from "../db.js";
import {
  SPICE_LEVELS,
  averageSpiceLevel,
  spiceFromId,
  topSpiceFromCounts,
} from "../spiciness.js";

export const spicinessRouter = Router();

function getSpicinessSummary(targetId: string, raterId = "me") {
  const db = getDb();
  const rows = db
    .prepare(
      "SELECT spice_id, COUNT(*) as count FROM spiciness_ratings WHERE target_id = ? GROUP BY spice_id"
    )
    .all(targetId) as Array<{ spice_id: string; count: number }>;

  const counts: Record<string, number> = {};
  let totalRatings = 0;
  for (const row of rows) {
    counts[row.spice_id] = row.count;
    totalRatings += row.count;
  }

  const myRow = db
    .prepare(
      "SELECT spice_id FROM spiciness_ratings WHERE rater_id = ? AND target_id = ?"
    )
    .get(raterId, targetId) as { spice_id: string } | undefined;

  const topSpice = topSpiceFromCounts(counts);
  const avgLevel = averageSpiceLevel(counts);

  return {
    targetId,
    totalRatings,
    counts,
    averageLevel: avgLevel,
    topSpice: topSpice
      ? {
          id: topSpice.id,
          level: topSpice.level,
          emoji: topSpice.emoji,
          label: topSpice.label,
          shortLabel: topSpice.shortLabel,
          color: topSpice.color,
        }
      : null,
    myRating: myRow ? spiceFromId(myRow.spice_id) ?? null : null,
  };
}

spicinessRouter.get("/levels", (_req, res) => {
  res.json({ levels: SPICE_LEVELS });
});

spicinessRouter.get("/:targetId", (req, res) => {
  res.json(getSpicinessSummary(req.params.targetId));
});

spicinessRouter.post("/", (req, res) => {
  const { targetId, spiceId } = req.body as {
    targetId?: string;
    spiceId?: string;
  };

  if (!targetId || !spiceId) {
    res.status(400).json({ error: "targetId and spiceId required" });
    return;
  }

  const spice = spiceFromId(spiceId);
  if (!spice) {
    res.status(400).json({ error: "Invalid spice level" });
    return;
  }

  const db = getDb();
  const profile = db
    .prepare("SELECT id FROM profiles WHERE id = ?")
    .get(targetId);
  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }

  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO spiciness_ratings (rater_id, target_id, spice_id, created_at)
     VALUES ('me', ?, ?, ?)
     ON CONFLICT(rater_id, target_id) DO UPDATE SET
       spice_id = excluded.spice_id,
       created_at = excluded.created_at`
  ).run(targetId, spiceId, now);

  res.json({
    success: true,
    rating: spice,
    summary: getSpicinessSummary(targetId),
  });
});