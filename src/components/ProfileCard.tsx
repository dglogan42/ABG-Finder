import { Link } from "react-router-dom";
import { FlavorRatings } from "./FlavorRatings";
import { Sauce } from "./Sauce";
import type { Profile } from "../types";

interface Props {
  profile: Profile;
  onLike?: () => void;
  onPass?: () => void;
  onSuperlike?: () => void;
  swipeAnim?: "left" | "right" | null;
}

const platformEmoji: Record<string, string> = {
  instagram: "📸",
  tiktok: "🎵",
  x: "𝕏",
  facebook: "👤",
};

export function ProfileCard({ profile, onLike, onPass, onSuperlike, swipeAnim }: Props) {
  return (
    <div className={`profile-card card${swipeAnim ? ` swipe-${swipeAnim}` : ""}`}>
      <div className="profile-card-cover">
        <img src={profile.coverImage} alt="" />
        <div className="profile-card-overlay" />
        <div className="profile-card-header">
          {profile.isOnline && <span className="badge badge-online">● Online</span>}
          <span className="badge">ABG {profile.abgScore}</span>
        </div>
      </div>

      <div className="profile-card-body">
        <div className="profile-card-avatar-row">
          <img src={profile.avatar} alt={profile.name} className="profile-avatar" />
          <div>
            <h2>{profile.name}, {profile.age}</h2>
            <p className="profile-city">📍 {profile.city}</p>
          </div>
          {profile.compatibility != null && (
            <div className="compatibility-ring">
              <span>{profile.compatibility}%</span>
            </div>
          )}
        </div>

        <p className="profile-bio">{profile.bio}</p>

        {profile.sauce && <Sauce sauce={profile.sauce} compact />}

        <div className="profile-vibes">
          {profile.vibes.map((v) => (
            <span key={v} className="badge">{v}</span>
          ))}
        </div>

        <div className="profile-socials">
          {profile.socials.map((s) => (
            <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer" className={`badge badge-${s.platform}`}>
              {platformEmoji[s.platform]} {s.username}
            </a>
          ))}
        </div>

        {profile.sharedVibes && profile.sharedVibes.length > 0 && (
          <p className="shared-vibes">
            ✨ {profile.sharedVibes.length} shared vibes: {profile.sharedVibes.join(", ")}
          </p>
        )}

        <FlavorRatings profileId={profile.id} compact />

        <Link to={`/profile/${profile.id}`} className="view-profile-link">
          View full profile →
        </Link>
      </div>

      {(onLike || onPass || onSuperlike) && (
        <div className="swipe-actions">
          <button className="swipe-btn pass" onClick={onPass} aria-label="Pass">
            ✕
          </button>
          <button className="swipe-btn superlike" onClick={onSuperlike} aria-label="Super Like">
            ⭐
          </button>
          <button className="swipe-btn like" onClick={onLike} aria-label="Like">
            ♥
          </button>
        </div>
      )}

      <style>{`
        .profile-card { max-width: 400px; margin: 0 auto; }
        .profile-card-cover { position: relative; height: 200px; }
        .profile-card-cover img { width: 100%; height: 100%; object-fit: cover; }
        .profile-card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(transparent 40%, var(--bg-card));
        }
        .profile-card-header {
          position: absolute; top: 1rem; left: 1rem; right: 1rem;
          display: flex; justify-content: space-between;
        }
        .profile-card-body { padding: 0 1.25rem 1.25rem; margin-top: -2.5rem; position: relative; }
        .profile-card-avatar-row { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
        .profile-avatar {
          width: 72px; height: 72px; border-radius: 50%;
          border: 3px solid var(--pink); background: var(--bg-elevated);
        }
        .profile-card-avatar-row h2 { font-size: 1.25rem; font-weight: 700; }
        .profile-city { color: var(--text-muted); font-size: 0.85rem; }
        .compatibility-ring {
          margin-left: auto;
          width: 48px; height: 48px; border-radius: 50%;
          background: var(--gradient);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.7rem; font-weight: 700; flex-shrink: 0;
        }
        .profile-bio { font-size: 0.9rem; line-height: 1.5; margin-bottom: 0.75rem; color: var(--text-muted); }
        .profile-vibes, .profile-socials { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.75rem; }
        .shared-vibes { font-size: 0.8rem; color: var(--pink-light); margin-bottom: 0.5rem; }
        .view-profile-link { font-size: 0.85rem; color: var(--pink-light); font-weight: 500; }
        .swipe-actions {
          display: flex; justify-content: center; gap: 1.5rem;
          padding: 1rem 1.25rem 1.5rem;
        }
        .swipe-btn {
          width: 56px; height: 56px; border-radius: 50%;
          font-size: 1.5rem; display: flex; align-items: center; justify-content: center;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .swipe-btn:active { transform: scale(0.9); }
        .swipe-btn.pass {
          background: var(--bg-elevated); color: #f87171;
          border: 2px solid rgba(248, 113, 113, 0.3);
        }
        .swipe-btn.like {
          background: var(--gradient); color: white;
          box-shadow: var(--glow); width: 64px; height: 64px; font-size: 1.75rem;
        }
        .swipe-btn.superlike {
          background: var(--bg-elevated); color: #fbbf24;
          border: 2px solid rgba(251, 191, 36, 0.3);
        }
      `}</style>
    </div>
  );
}