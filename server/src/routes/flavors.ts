import { Router } from "express";
import { getDb } from "../db.js";
import {
  FLAVOR_DIMENSIONS,
  type FlavorDimension,
  averageLevel,
  dimensionConfig,
  levelFromId,
  topLevelFromCounts,
} from "../flavors.js";

export const flavorsRouter = Router();

const DIMENSIONS: FlavorDimension[] = ["sweetness", "spicy", "unique"];

function getDimensionSummary(
  targetId: string,
  dimension: FlavorDimension,
  raterId = "me"
) {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT level_id, COUNT(*) as count FROM flavor_ratings
       WHERE target_id = ? AND dimension = ? GROUP BY level_id`
    )
    .all(targetId, dimension) as Array<{ level_id: string; count: number }>;

  const counts: Record<string, number> = {};
  let totalRatings = 0;
  for (const row of rows) {
    counts[row.level_id] = row.count;
    totalRatings += row.count;
  }

  const myRow = db
    .prepare(
      `SELECT level_id FROM flavor_ratings
       WHERE rater_id = ? AND target_id = ? AND dimension = ?`
    )
    .get(raterId, targetId, dimension) as { level_id: string } | undefined;

  const config = dimensionConfig(dimension)!;
  const topLevel = topLevelFromCounts(dimension, counts);
  const myLevel = myRow
    ? levelFromId(dimension, myRow.level_id) ?? null
    : null;

  return {
    dimension,
    snackEmoji: config.snackEmoji,
    snackName: config.snackName,
    title: config.title,
    totalRatings,
    counts,
    averageLevel: averageLevel(dimension, counts),
    topLevel: topLevel
      ? {
          id: topLevel.id,
          level: topLevel.level,
          label: topLevel.label,
          shortLabel: topLevel.shortLabel,
          emoji: topLevel.emoji,
          color: topLevel.color,
        }
      : null,
    myRating: myLevel,
  };
}

function getAllSummaries(targetId: string, raterId = "me") {
  return {
    targetId,
    dimensions: DIMENSIONS.map((d) =>
      getDimensionSummary(targetId, d, raterId)
    ),
  };
}

flavorsRouter.get("/dimensions", (_req, res) => {
  res.json({ dimensions: FLAVOR_DIMENSIONS });
});

flavorsRouter.get("/:targetId", (req, res) => {
  res.json(getAllSummaries(req.params.targetId));
});

flavorsRouter.post("/", (req, res) => {
  const { targetId, dimension, levelId } = req.body as {
    targetId?: string;
    dimension?: FlavorDimension;
    levelId?: string;
  };

  if (!targetId || !dimension || !levelId) {
    res.status(400).json({ error: "targetId, dimension, and levelId required" });
    return;
  }

  if (!DIMENSIONS.includes(dimension)) {
    res.status(400).json({ error: "Invalid dimension" });
    return;
  }

  const level = levelFromId(dimension, levelId);
  if (!level) {
    res.status(400).json({ error: "Invalid level" });
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
    `INSERT INTO flavor_ratings (rater_id, target_id, dimension, level_id, created_at)
     VALUES ('me', ?, ?, ?, ?)
     ON CONFLICT(rater_id, target_id, dimension) DO UPDATE SET
       level_id = excluded.level_id,
       created_at = excluded.created_at`
  ).run(targetId, dimension, levelId, now);

  res.json({
    success: true,
    dimension,
    rating: level,
    summary: getDimensionSummary(targetId, dimension),
    all: getAllSummaries(targetId),
  });
});