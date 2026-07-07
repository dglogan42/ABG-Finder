import type { ConnectedAccount, SocialPlatform } from "../types.js";
import { getDb } from "../db.js";

interface OAuthConfig {
  platform: SocialPlatform;
  authUrl: string;
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

function getOAuthConfig(platform: SocialPlatform): OAuthConfig | null {
  const appUrl = process.env.API_URL || "http://localhost:3003";

  const configs: Partial<Record<SocialPlatform, OAuthConfig>> = {
    facebook: {
      platform: "facebook",
      authUrl: "https://www.facebook.com/v21.0/dialog/oauth",
      tokenUrl: "https://graph.facebook.com/v21.0/oauth/access_token",
      clientId: process.env.META_APP_ID || "",
      clientSecret: process.env.META_APP_SECRET || "",
      redirectUri:
        process.env.META_REDIRECT_URI || `${appUrl}/api/auth/facebook/callback`,
      scopes: ["public_profile", "email", "user_posts"],
    },
    instagram: {
      platform: "instagram",
      authUrl: "https://www.facebook.com/v21.0/dialog/oauth",
      tokenUrl: "https://graph.facebook.com/v21.0/oauth/access_token",
      clientId: process.env.META_APP_ID || "",
      clientSecret: process.env.META_APP_SECRET || "",
      redirectUri:
        process.env.META_REDIRECT_URI || `${appUrl}/api/auth/facebook/callback`,
      scopes: [
        "instagram_basic",
        "instagram_manage_insights",
        "pages_show_list",
      ],
    },
    x: {
      platform: "x",
      authUrl: "https://twitter.com/i/oauth2/authorize",
      tokenUrl: "https://api.twitter.com/2/oauth2/token",
      clientId: process.env.X_CLIENT_ID || "",
      clientSecret: process.env.X_CLIENT_SECRET || "",
      redirectUri:
        process.env.X_REDIRECT_URI || `${appUrl}/api/auth/x/callback`,
      scopes: ["tweet.read", "users.read", "offline.access"],
    },
    tiktok: {
      platform: "tiktok",
      authUrl: "https://www.tiktok.com/v2/auth/authorize/",
      tokenUrl: "https://open.tiktokapis.com/v2/oauth/token/",
      clientId: process.env.TIKTOK_CLIENT_KEY || "",
      clientSecret: process.env.TIKTOK_CLIENT_SECRET || "",
      redirectUri:
        process.env.TIKTOK_REDIRECT_URI ||
        `${appUrl}/api/auth/tiktok/callback`,
      scopes: ["user.info.basic", "video.list"],
    },
  };

  const config = configs[platform];
  if (!config?.clientId || !config.clientSecret) return null;
  return config;
}

export function getAuthUrl(platform: SocialPlatform): {
  url: string;
  demo: boolean;
} {
  const config = getOAuthConfig(platform);

  if (!config) {
    return {
      url: "",
      demo: true,
    };
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: config.scopes.join(" "),
    state: platform,
  });

  if (platform === "x") {
    params.set("code_challenge", "challenge");
    params.set("code_challenge_method", "plain");
  }

  return {
    url: `${config.authUrl}?${params.toString()}`,
    demo: false,
  };
}

export async function exchangeCode(
  platform: SocialPlatform,
  code: string
): Promise<ConnectedAccount | null> {
  const config = getOAuthConfig(platform);
  if (!config) return null;

  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    redirect_uri: config.redirectUri,
    grant_type: "authorization_code",
  });

  if (platform === "x") {
    body.set("code_verifier", "challenge");
  }

  const res = await fetch(config.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) return null;

  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) return null;

  const account: ConnectedAccount = {
    platform,
    username: `user_${platform}`,
    accessToken: data.access_token,
    connectedAt: new Date().toISOString(),
  };

  saveConnectedAccount(account);
  return account;
}

export function saveConnectedAccount(account: ConnectedAccount): void {
  const db = getDb();
  db.prepare(
    `INSERT INTO connected_accounts (user_id, platform, username, access_token, connected_at)
     VALUES ('me', ?, ?, ?, ?)
     ON CONFLICT(user_id, platform) DO UPDATE SET
       username = excluded.username,
       access_token = excluded.access_token,
       connected_at = excluded.connected_at`
  ).run(
    account.platform,
    account.username,
    account.accessToken ?? null,
    account.connectedAt
  );
}

export function connectDemoAccount(platform: SocialPlatform): ConnectedAccount {
  const demoUsernames: Record<SocialPlatform, string> = {
    instagram: "your_ig",
    facebook: "your.fb",
    x: "your_x_handle",
    tiktok: "@yourtiktok",
  };

  const account: ConnectedAccount = {
    platform,
    username: demoUsernames[platform],
    connectedAt: new Date().toISOString(),
  };

  saveConnectedAccount(account);
  return account;
}

export function getConnectedAccounts(): ConnectedAccount[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM connected_accounts WHERE user_id = 'me'")
    .all() as Array<{
    platform: SocialPlatform;
    username: string;
    access_token: string | null;
    connected_at: string;
  }>;

  return rows.map((row) => ({
    platform: row.platform,
    username: row.username,
    accessToken: row.access_token ?? undefined,
    connectedAt: row.connected_at,
  }));
}

export function disconnectAccount(platform: SocialPlatform): void {
  const db = getDb();
  db.prepare(
    "DELETE FROM connected_accounts WHERE user_id = 'me' AND platform = ?"
  ).run(platform);
}