import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  connectDemo,
  disconnect,
  fetchAuthStatus,
  getAuthUrl,
} from "../api/auth";
import type { AuthStatus, SocialPlatform } from "../types";

const PLATFORM_INFO: Record<
  SocialPlatform,
  { name: string; icon: string; color: string; description: string }
> = {
  instagram: {
    name: "Instagram",
    icon: "📸",
    color: "#E1306C",
    description: "Import your IG feed & discover ABGs from your network",
  },
  facebook: {
    name: "Facebook",
    icon: "👤",
    color: "#1877F2",
    description: "Connect friends & groups in the ABG community",
  },
  x: {
    name: "X",
    icon: "𝕏",
    color: "#ffffff",
    description: "See who's tweeting about the ABG lifestyle",
  },
  tiktok: {
    name: "TikTok",
    icon: "🎵",
    color: "#00F2EA",
    description: "Pull in your FYP baddies & trending ABG content",
  },
};

export function ConnectPage() {
  const [accounts, setAccounts] = useState<AuthStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<SocialPlatform | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [toast, setToast] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { accounts: data } = await fetchAuthStatus();
      setAccounts(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    if (success) {
      setToast(`Connected ${PLATFORM_INFO[success as SocialPlatform]?.name || success}!`);
      setSearchParams({});
      load();
    } else if (error) {
      setToast("Connection failed. Try demo mode instead.");
      setSearchParams({});
    }
  }, [searchParams, setSearchParams, load]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleConnect = async (platform: SocialPlatform) => {
    setConnecting(platform);
    try {
      const { url, demo } = await getAuthUrl(platform);
      if (demo || !url) {
        await connectDemo(platform);
        setToast(`Demo ${PLATFORM_INFO[platform].name} connected!`);
        await load();
      } else {
        window.location.href = url;
      }
    } catch {
      setToast("Connection failed");
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async (platform: SocialPlatform) => {
    await disconnect(platform);
    await load();
    setToast(`Disconnected ${PLATFORM_INFO[platform].name}`);
  };

  const connectedCount = accounts.filter((a) => a.connected).length;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Connect</h1>
        <p>Link your socials to power the ABG feed</p>
      </div>

      {toast && (
        <div className="toast">{toast}</div>
      )}

      <div className="connect-status card" style={{ padding: "1rem", marginBottom: "1rem" }}>
        <p style={{ fontWeight: 600 }}>
          {connectedCount}/4 platforms connected
        </p>
        <div className="connect-progress">
          <div
            className="connect-progress-bar"
            style={{ width: `${(connectedCount / 4) * 100}%` }}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : (
        <div className="connect-list">
          {accounts.map((account) => {
            const info = PLATFORM_INFO[account.platform];
            return (
              <div key={account.platform} className="connect-card card">
                <div className="connect-card-icon" style={{ background: `${info.color}22` }}>
                  {info.icon}
                </div>
                <div className="connect-card-body">
                  <h3>{info.name}</h3>
                  <p>{info.description}</p>
                  {account.connected && (
                    <span className="badge badge-online">
                      ✓ @{account.username}
                    </span>
                  )}
                  {!account.oauthAvailable && !account.connected && (
                    <span className="badge" style={{ marginTop: "0.35rem" }}>
                      Demo mode (add API keys for live OAuth)
                    </span>
                  )}
                </div>
                <div className="connect-card-action">
                  {account.connected ? (
                    <button
                      className="btn btn-ghost"
                      onClick={() => handleDisconnect(account.platform)}
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleConnect(account.platform)}
                      disabled={connecting === account.platform}
                    >
                      {connecting === account.platform ? "..." : "Connect"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .toast {
          position: fixed; top: 1rem; left: 50%; transform: translateX(-50%);
          background: var(--bg-elevated); border: 1px solid var(--border);
          padding: 0.75rem 1.5rem; border-radius: 999px;
          font-size: 0.9rem; z-index: 300;
          box-shadow: var(--glow);
        }
        .connect-progress {
          height: 4px; background: var(--bg-elevated);
          border-radius: 2px; margin-top: 0.5rem; overflow: hidden;
        }
        .connect-progress-bar {
          height: 100%; background: var(--gradient);
          border-radius: 2px; transition: width 0.3s;
        }
        .connect-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .connect-card {
          display: flex; align-items: center; gap: 1rem; padding: 1rem;
        }
        .connect-card-icon {
          width: 48px; height: 48px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.5rem; flex-shrink: 0;
        }
        .connect-card-body { flex: 1; min-width: 0; }
        .connect-card-body h3 { font-size: 1rem; font-weight: 600; }
        .connect-card-body p {
          font-size: 0.8rem; color: var(--text-muted);
          margin: 0.2rem 0 0.4rem; line-height: 1.4;
        }
        .connect-card-action { flex-shrink: 0; }
      `}</style>
    </div>
  );
}