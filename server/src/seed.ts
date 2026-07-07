import { getDb } from "./db.js";
import { seedProfiles } from "./seed/profiles.js";
import { seedFeedPosts } from "./seed/feedPosts.js";

const coords: Record<string, [number, number]> = {
  p1: [34.0522, -118.2437],
  p2: [33.6846, -117.8265],
  p3: [37.7749, -122.4194],
  p4: [40.7128, -74.006],
  p5: [29.7604, -95.3698],
  p6: [47.6062, -122.3321],
  p7: [36.1699, -115.1398],
  p8: [42.3601, -71.0589],
};

function seed() {
  const db = getDb();

  const profileCount = db
    .prepare("SELECT COUNT(*) as count FROM profiles")
    .get() as { count: number };

  if (profileCount.count > 0) {
    console.log("Database already seeded, skipping.");
    return;
  }

  const insertProfile = db.prepare(`
    INSERT INTO profiles (id, name, age, city, bio, avatar, cover_image, vibes, interests, socials, abg_score, lat, lng, is_online, last_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertPost = db.prepare(`
    INSERT INTO feed_posts (id, platform, author_id, author_name, author_avatar, content, image_url, likes, comments, timestamp, hashtags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const tx = db.transaction(() => {
    for (const p of seedProfiles) {
      const [lat, lng] = coords[p.id] || [34.0522, -118.2437];
      insertProfile.run(
        p.id,
        p.name,
        p.age,
        p.city,
        p.bio,
        p.avatar,
        p.coverImage,
        JSON.stringify(p.vibes),
        JSON.stringify(p.interests),
        JSON.stringify(p.socials),
        p.abgScore,
        lat,
        lng,
        p.isOnline ? 1 : 0,
        p.lastActive
      );
    }

    for (const post of seedFeedPosts) {
      insertPost.run(
        post.id,
        post.platform,
        post.authorId,
        post.authorName,
        post.authorAvatar,
        post.content,
        post.imageUrl ?? null,
        post.likes,
        post.comments,
        post.timestamp,
        JSON.stringify(post.hashtags)
      );
    }
  });

  tx();
  console.log(
    `Seeded ${seedProfiles.length} profiles and ${seedFeedPosts.length} feed posts.`
  );

  seedFlavorRatings(db);
}

function seedFlavorRatings(db: ReturnType<typeof getDb>) {
  const count = db
    .prepare("SELECT COUNT(*) as count FROM flavor_ratings")
    .get() as { count: number };
  if (count.count > 0) return;

  const demoRatings: Array<{
    rater: string;
    target: string;
    dimension: string;
    level: string;
  }> = [
    { rater: "user_a", target: "p1", dimension: "sweetness", level: "full-sugar" },
    { rater: "user_b", target: "p1", dimension: "sweetness", level: "brown-sugar" },
    { rater: "user_c", target: "p1", dimension: "sweetness", level: "classic" },
    { rater: "user_a", target: "p1", dimension: "spicy", level: "extra-spicy" },
    { rater: "user_b", target: "p1", dimension: "spicy", level: "korean-fire" },
    { rater: "user_a", target: "p1", dimension: "unique", level: "distinctive" },
    { rater: "user_b", target: "p1", dimension: "unique", level: "rare" },
    { rater: "user_a", target: "p7", dimension: "sweetness", level: "coma" },
    { rater: "user_b", target: "p7", dimension: "sweetness", level: "brown-sugar" },
    { rater: "user_c", target: "p7", dimension: "sweetness", level: "coma" },
    { rater: "user_a", target: "p7", dimension: "spicy", level: "nuclear" },
    { rater: "user_b", target: "p7", dimension: "spicy", level: "nuclear" },
    { rater: "user_c", target: "p7", dimension: "spicy", level: "korean-fire" },
    { rater: "user_a", target: "p7", dimension: "unique", level: "unicorn" },
    { rater: "user_b", target: "p7", dimension: "unique", level: "rare" },
    { rater: "user_a", target: "p3", dimension: "sweetness", level: "classic" },
    { rater: "user_b", target: "p3", dimension: "spicy", level: "nuclear" },
    { rater: "user_a", target: "p3", dimension: "unique", level: "unicorn" },
    { rater: "user_a", target: "p2", dimension: "sweetness", level: "light" },
    { rater: "user_b", target: "p2", dimension: "spicy", level: "medium" },
    { rater: "user_a", target: "p2", dimension: "unique", level: "interesting" },
  ];

  const insert = db.prepare(
    "INSERT INTO flavor_ratings (rater_id, target_id, dimension, level_id, created_at) VALUES (?, ?, ?, ?, ?)"
  );
  const now = new Date().toISOString();
  const tx = db.transaction(() => {
    for (const r of demoRatings) {
      insert.run(r.rater, r.target, r.dimension, r.level, now);
    }
  });
  tx();
  console.log(`Seeded ${demoRatings.length} flavor ratings.`);
}

seed();