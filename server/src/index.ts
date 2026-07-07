import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { getDb } from "./db.js";
import { authRouter } from "./routes/auth.js";
import { discoverRouter } from "./routes/discover.js";
import { feedRouter } from "./routes/feed.js";
import { matchesRouter } from "./routes/matches.js";
import { flavorsRouter } from "./routes/flavors.js";
import { swipesRouter } from "./routes/swipes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT || "3003", 10);

getDb();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "abg-friend-finder" });
});

app.use("/api/auth", authRouter);
app.use("/api/discover", discoverRouter);
app.use("/api/swipes", swipesRouter);
app.use("/api/matches", matchesRouter);
app.use("/api/feed", feedRouter);
app.use("/api/flavors", flavorsRouter);

const distPath = path.join(__dirname, "../../dist");
app.use(express.static(distPath));
app.get("/{*splat}", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`ABG Friend Finder API running on http://localhost:${PORT}`);
});