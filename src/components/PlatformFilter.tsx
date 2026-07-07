import type { SocialPlatform } from "../types";

const PLATFORMS: { id: SocialPlatform; label: string; icon: string }[] = [
  { id: "instagram", label: "Instagram", icon: "📸" },
  { id: "tiktok", label: "TikTok", icon: "🎵" },
  { id: "x", label: "X", icon: "𝕏" },
  { id: "facebook", label: "Facebook", icon: "👤" },
];

interface Props {
  active: SocialPlatform[];
  onToggle: (platform: SocialPlatform) => void;
}

export function PlatformFilter({ active, onToggle }: Props) {
  return (
    <div className="platform-filter">
      {PLATFORMS.map((p) => (
        <button
          key={p.id}
          className={`platform-chip${active.includes(p.id) ? " active" : ""}`}
          onClick={() => onToggle(p.id)}
        >
          {p.icon} {p.label}
        </button>
      ))}
      <style>{`
        .platform-filter {
          display: flex; gap: 0.5rem; overflow-x: auto;
          padding-bottom: 0.5rem; margin-bottom: 1rem;
          -webkit-overflow-scrolling: touch;
        }
        .platform-chip {
          flex-shrink: 0;
          padding: 0.5rem 1rem;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 600;
          background: var(--bg-elevated);
          color: var(--text-muted);
          border: 1px solid var(--border);
          transition: all 0.15s;
        }
        .platform-chip.active {
          background: var(--gradient-subtle);
          color: var(--pink-light);
          border-color: rgba(255, 61, 143, 0.3);
        }
      `}</style>
    </div>
  );
}