import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "../data");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  db = new Database(path.join(dataDir, "abg.db"));
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      city TEXT NOT NULL,
      bio TEXT NOT NULL,
      avatar TEXT NOT NULL,
      cover_image TEXT NOT NULL,
      vibes TEXT NOT NULL,
      interests TEXT NOT NULL,
      socials TEXT NOT NULL,
      abg_score INTEGER NOT NULL,
      lat REAL,
      lng REAL,
      is_online INTEGER DEFAULT 0,
      last_active TEXT NOT NULL,
      sauce TEXT
    );

    CREATE TABLE IF NOT EXISTS feed_posts (
      id TEXT PRIMARY KEY,
      platform TEXT NOT NULL,
      author_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      author_avatar TEXT NOT NULL,
      content TEXT NOT NULL,
      image_url TEXT,
      likes INTEGER NOT NULL,
      comments INTEGER NOT NULL,
      timestamp TEXT NOT NULL,
      hashtags TEXT NOT NULL,
      FOREIGN KEY (author_id) REFERENCES profiles(id)
    );

    CREATE TABLE IF NOT EXISTS swipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      profile_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      action TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(profile_id, target_id)
    );

    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      profile_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      compatibility INTEGER NOT NULL,
      shared_vibes TEXT NOT NULL,
      matched_at TEXT NOT NULL,
      UNIQUE(profile_id, target_id)
    );

    CREATE TABLE IF NOT EXISTS connected_accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL DEFAULT 'me',
      platform TEXT NOT NULL,
      username TEXT NOT NULL,
      access_token TEXT,
      connected_at TEXT NOT NULL,
      UNIQUE(user_id, platform)
    );

    CREATE TABLE IF NOT EXISTS snack_ratings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rater_id TEXT NOT NULL DEFAULT 'me',
      target_id TEXT NOT NULL,
      snack_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(rater_id, target_id)
    );

    CREATE TABLE IF NOT EXISTS spiciness_ratings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rater_id TEXT NOT NULL DEFAULT 'me',
      target_id TEXT NOT NULL,
      spice_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(rater_id, target_id)
    );

    CREATE TABLE IF NOT EXISTS flavor_ratings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rater_id TEXT NOT NULL DEFAULT 'me',
      target_id TEXT NOT NULL,
      dimension TEXT NOT NULL,
      level_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(rater_id, target_id, dimension)
    );
  `);

  migrateProfilesTable(db);

  return db;
}

function migrateProfilesTable(database: Database.Database) {
  const columns = database
    .prepare("PRAGMA table_info(profiles)")
    .all() as Array<{ name: string }>;

  if (!columns.some((c) => c.name === "sauce")) {
    database.exec("ALTER TABLE profiles ADD COLUMN sauce TEXT");
  }
}