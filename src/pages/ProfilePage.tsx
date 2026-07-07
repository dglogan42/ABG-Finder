import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProfile } from "../api/discover";
import { fetchProfileFeed } from "../api/feed";
import { FeedPostCard } from "../components/FeedPostCard";
import { FlavorRatings } from "../components/FlavorRatings";
import type { FeedPost, Profile } from "../types";

export function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([fetchProfile(id), fetchProfileFeed(id)])
      .then(([profileRes, feedRes]) => {
        setProfile(profileRes.profile);
        setPosts(feedRes.posts);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <div className="loading"><div className="spinner" /></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="page">
        <div className="empty-state">
          <h3>Profile not found</h3>
          <Link to="/">Back to Discover</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <Link to="/" className="btn btn-ghost" style={{ marginBottom: "1rem", padding: 0 }}>
        ← Back
      </Link>

      <div className="profile-detail card">
        <div className="profile-detail-cover">
          <img src={profile.coverImage} alt="" />
          <div className="profile-detail-overlay" />
        </div>
        <div className="profile-detail-body">
          <img src={profile.avatar} alt={profile.name} className="profile-detail-avatar" />
          <h1>{profile.name}, {profile.age}</h1>
          <p className="profile-detail-city">📍 {profile.city}</p>
          {profile.isOnline && <span className="badge badge-online">● Online now</span>}
          <span className="badge" style={{ marginLeft: "0.4rem" }}>ABG Score {profile.abgScore}</span>

          {profile.compatibility != null && (
            <div className="profile-detail-compat">
              <strong>{profile.compatibility}%</strong> vibe match
            </div>
          )}

          <p className="profile-detail-bio">{profile.bio}</p>

          <FlavorRatings profileId={profile.id} />

          <h3 className="section-label">Vibes</h3>
          <div className="tag-row">
            {profile.vibes.map((v) => <span key={v} className="badge">{v}</span>)}
          </div>

          <h3 className="section-label">Interests</h3>
          <div className="tag-row">
            {profile.interests.map((i) => <span key={i} className="badge">{i}</span>)}
          </div>

          <h3 className="section-label">Socials</h3>
          <div className="tag-row">
            {profile.socials.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`badge badge-${s.platform}`}
              >
                {s.platform} · {s.followers ? `${(s.followers / 1000).toFixed(1)}K` : s.username}
              </a>
            ))}
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "1.5rem 0 0.75rem" }}>
        Cross-Platform Feed
      </h2>
      {posts.length === 0 ? (
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No posts yet</p>
      ) : (
        posts.map((post) => <FeedPostCard key={post.id} post={post} />)
      )}

      <style>{`
        .profile-detail { overflow: hidden; margin-bottom: 1rem; }
        .profile-detail-cover { position: relative; height: 160px; }
        .profile-detail-cover img { width: 100%; height: 100%; object-fit: cover; }
        .profile-detail-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(transparent, var(--bg-card));
        }
        .profile-detail-body { padding: 0 1.25rem 1.25rem; margin-top: -2rem; position: relative; }
        .profile-detail-avatar {
          width: 80px; height: 80px; border-radius: 50%;
          border: 3px solid var(--pink); margin-bottom: 0.5rem;
        }
        .profile-detail-body h1 { font-size: 1.5rem; font-weight: 800; }
        .profile-detail-city { color: var(--text-muted); margin: 0.25rem 0 0.5rem; }
        .profile-detail-compat {
          margin: 0.75rem 0; padding: 0.75rem;
          background: var(--gradient-subtle);
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
        }
        .profile-detail-compat strong { color: var(--pink-light); font-size: 1.1rem; }
        .profile-detail-bio { line-height: 1.6; margin: 1rem 0; color: var(--text-muted); }
        .section-label {
          font-size: 0.75rem; text-transform: uppercase;
          letter-spacing: 0.05em; color: var(--text-muted);
          margin: 1rem 0 0.5rem;
        }
        .tag-row { display: flex; flex-wrap: wrap; gap: 0.4rem; }
      `}</style>
    </div>
  );
}