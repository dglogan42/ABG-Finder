import { Router } from "express";
import {
  getAggregatedFeed,
  getProfileFeed,
} from "../services/feedAggregator.js";
import type { SocialPlatform } from "../types.js";

export const feedRouter = Router();

feedRouter.get("/", (req, res) => {
  const platforms = req.query.platforms
    ? (req.query.platforms as string).split(",") as SocialPlatform[]
    : undefined;
  const limit = req.query.limit ? Number(req.query.limit) : 30;

  const posts = getAggregatedFeed(platforms, limit);
  res.json({ posts });
});

feedRouter.get("/profile/:id", (req, res) => {
  const posts = getProfileFeed(req.params.id);
  res.json({ posts });
});