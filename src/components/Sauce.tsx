import type { ProfileSauce, SocialPlatform } from "../types";

interface Props {
  sauce: ProfileSauce;
  compact?: boolean;
}

const platformMeta: Record<
  SocialPlatform,
  { emoji: string; name: string; className: string }
> = {
  instagram: { emoji: "📸", name: "Instagram", className: "sauce-instagram" },
  tiktok: { emoji: "🎵", name: "TikTok", className: "sauce-tiktok" },
  x: { emoji: "𝕏", name: "X", className: "sauce-x" },
  facebook: { emoji: "👤", name: "Facebook", className: "sauce-facebook" },
};

function formatSpotted(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function Sauce({ sauce, compact = false }: Props) {
  const meta = platformMeta[sauce.platform];

  const content = (
    <>
      <span className="sauce-jar" aria-hidden>
        🫙
      </span>
      <div className="sauce-copy">
        <span className="sauce-kicker">The Sauce</span>
        <span className="sauce-headline">
          Found on {meta.emoji} {meta.name}
        </span>
        {!compact && sauce.label && <span className="sauce-detail">{sauce.label}</span>}
        {sauce.context && <span className="sauce-context">{sauce.context}</span>}
        <span className="sauce-time">Spotted {formatSpotted(sauce.spottedAt)}</span>
      </div>
      {!compact && sauce.sourceUrl && (
        <span className="sauce-link">View source →</span>
      )}
    </>
  );

  const className = `sauce ${meta.className}${compact ? " sauce-compact" : ""}`;

  if (sauce.sourceUrl) {
    return (
      <a
        href={sauce.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        title={`Found this baddie on ${meta.name}`}
      >
        {content}
      </a>
    );
  }

  return (
    <div className={className} title={`Found this baddie on ${meta.name}`}>
      {content}
    </div>
  );
}