import type { FeedPost, Profile, SocialPlatform } from "../types.js";
import { getDb } from "../db.js";

const PLATFORM_WEIGHTS: Record<SocialPlatform, number> = {
  instagram: 1.0,
  tiktok: 0.95,
  x: 0.7,
  facebook: 0.6,
};

export function getAggregatedFeed(
  platforms?: SocialPlatform[],
  limit = 30
): FeedPost[] {
  const db = getDb();
  let query = "SELECT * FROM feed_posts";
  const params: string[] = [];

  if (platforms?.length) {
    const placeholders = platforms.map(() => "?").join(",");
    query += ` WHERE platform IN (${placeholders})`;
    params.push(...platforms);
  }

  query += " ORDER BY timestamp DESC LIMIT ?";
  params.push(String(limit));

  const rows = db.prepare(query).all(...params) as Array<{
    id: string;
    platform: SocialPlatform;
    author_id: string;
    author_name: string;
    author_avatar: string;
    content: string;
    image_url: string | null;
    likes: number;
    comments: number;
    timestamp: string;
    hashtags: string;
  }>;

  return rows.map((row) => ({
    id: row.id,
    platform: row.platform,
    authorId: row.author_id,
    authorName: row.author_name,
    authorAvatar: row.author_avatar,
    content: row.content,
    imageUrl: row.image_url ?? undefined,
    likes: row.likes,
    comments: row.comments,
    timestamp: row.timestamp,
    hashtags: JSON.parse(row.hashtags),
  }));
}

export function getProfileFeed(profileId: string): FeedPost[] {
  const db = getDb();
  const rows = db
    .prepare(
      "SELECT * FROM feed_posts WHERE author_id = ? ORDER BY timestamp DESC"
    )
    .all(profileId) as Array<{
    id: string;
    platform: SocialPlatform;
    author_id: string;
    author_name: string;
    author_avatar: string;
    content: string;
    image_url: string | null;
    likes: number;
    comments: number;
    timestamp: string;
    hashtags: string;
  }>;

  return rows.map((row) => ({
    id: row.id,
    platform: row.platform,
    authorId: row.author_id,
    authorName: row.author_name,
    authorAvatar: row.author_avatar,
    content: row.content,
    imageUrl: row.image_url ?? undefined,
    likes: row.likes,
    comments: row.comments,
    timestamp: row.timestamp,
    hashtags: JSON.parse(row.hashtags),
  }));
}

export function computeCompatibility(
  userVibes: string[],
  profile: Profile
): { score: number; sharedVibes: string[] } {
  const sharedVibes = userVibes.filter((v) => profile.vibes.includes(v));
  const vibeScore = (sharedVibes.length / Math.max(userVibes.length, 1)) * 60;

  const socialBonus = profile.socials.length * 5;
  const abgBonus = profile.abgScore * 0.3;

  const score = Math.min(
    99,
    Math.round(vibeScore + socialBonus + abgBonus)
  );

  return { score, sharedVibes };
}

export function rankProfiles(
  profiles: Profile[],
  userVibes: string[]
): Profile[] {
  return [...profiles].sort((a, b) => {
    const scoreA =
      computeCompatibility(userVibes, a).score * PLATFORM_WEIGHTS.instagram;
    const scoreB =
      computeCompatibility(userVibes, b).score * PLATFORM_WEIGHTS.instagram;
    return scoreB - scoreA;
  });
}