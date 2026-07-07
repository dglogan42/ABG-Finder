import { Router } from "express";
import type { SocialPlatform } from "../types.js";
import {
  connectDemoAccount,
  disconnectAccount,
  exchangeCode,
  getAuthUrl,
  getConnectedAccounts,
} from "../services/socialAuth.js";

export const authRouter = Router();

const PLATFORMS: SocialPlatform[] = ["instagram", "facebook", "x", "tiktok"];

authRouter.get("/status", (_req, res) => {
  const accounts = getConnectedAccounts();
  const status = PLATFORMS.map((platform) => {
    const connected = accounts.find((a) => a.platform === platform);
    const { demo } = getAuthUrl(platform);
    return {
      platform,
      connected: !!connected,
      username: connected?.username,
      connectedAt: connected?.connectedAt,
      oauthAvailable: !demo,
    };
  });
  res.json({ accounts: status });
});

authRouter.get("/:platform/url", (req, res) => {
  const platform = req.params.platform as SocialPlatform;
  if (!PLATFORMS.includes(platform)) {
    res.status(400).json({ error: "Invalid platform" });
    return;
  }

  const { url, demo } = getAuthUrl(platform);
  res.json({ platform, url, demo });
});

authRouter.get("/:platform/callback", async (req, res) => {
  const platform = req.params.platform as SocialPlatform;
  const code = req.query.code as string;
  const appUrl = process.env.APP_URL || "http://localhost:5174";

  if (!code) {
    res.redirect(`${appUrl}/connect?error=no_code`);
    return;
  }

  const account = await exchangeCode(platform, code);
  if (!account) {
    res.redirect(`${appUrl}/connect?error=auth_failed`);
    return;
  }

  res.redirect(`${appUrl}/connect?success=${platform}`);
});

authRouter.post("/:platform/connect-demo", (req, res) => {
  const platform = req.params.platform as SocialPlatform;
  if (!PLATFORMS.includes(platform)) {
    res.status(400).json({ error: "Invalid platform" });
    return;
  }

  const account = connectDemoAccount(platform);
  res.json({ account });
});

authRouter.delete("/:platform", (req, res) => {
  const platform = req.params.platform as SocialPlatform;
  disconnectAccount(platform);
  res.json({ success: true });
});