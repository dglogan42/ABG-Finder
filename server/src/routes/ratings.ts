import { Router } from "express";
import { getDb } from "../db.js";
import {
  SNACKS,
  averageTier,
  snackFromId,
  topSnackFromCounts,
} from "../snacks.js";

export const ratingsRouter = Router();

function getRatingSummary(targetId: string, raterId = "me") {
  const db = getDb();
  const rows = db
    .prepare(
      "SELECT snack_id, COUNT(*) as count FROM snack_ratings WHERE target_id = ? GROUP BY snack_id"
    )
    .all(targetId) as Array<{ snack_id: string; count: number }>;

  const counts: Record<string, number> = {};
  let totalRatings = 0;
  for (const row of rows) {
    counts[row.snack_id] = row.count;
    totalRatings += row.count;
  }

  const myRow = db
    .prepare(
      "SELECT snack_id FROM snack_ratings WHERE rater_id = ? AND target_id = ?"
    )
    .get(raterId, targetId) as { snack_id: string } | undefined;

  const topSnack = topSnackFromCounts(counts);
  const avgTier = averageTier(counts);

  return {
    targetId,
    totalRatings,
    counts,
    averageTier: avgTier,
    topSnack: topSnack
      ? { id: topSnack.id, emoji: topSnack.emoji, name: topSnack.name, label: topSnack.label }
      : null,
    myRating: myRow ? snackFromId(myRow.snack_id) ?? null : null,
  };
}

ratingsRouter.get("/snacks", (_req, res) => {
  res.json({ snacks: SNACKS });
});

ratingsRouter.get("/:targetId", (req, res) => {
  res.json(getRatingSummary(req.params.targetId));
});

ratingsRouter.post("/", (req, res) => {
  const { targetId, snackId } = req.body as {
    targetId?: string;
    snackId?: string;
  };

  if (!targetId || !snackId) {
    res.status(400).json({ error: "targetId and snackId required" });
    return;
  }

  const snack = snackFromId(snackId);
  if (!snack) {
    res.status(400).json({ error: "Invalid snack" });
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
    `INSERT INTO snack_ratings (rater_id, target_id, snack_id, created_at)
     VALUES ('me', ?, ?, ?)
     ON CONFLICT(rater_id, target_id) DO UPDATE SET
       snack_id = excluded.snack_id,
       created_at = excluded.created_at`
  ).run(targetId, snackId, now);

  res.json({
    success: true,
    rating: snack,
    summary: getRatingSummary(targetId),
  });
});