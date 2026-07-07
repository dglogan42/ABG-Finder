import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMatches } from "../api/matches";
import type { Match } from "../types";

export function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches()
      .then(({ matches: data }) => setMatches(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page">
        <div className="loading"><div className="spinner" /></div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Matches</h1>
        <p>Your ABG connections 💕</p>
      </div>

      {matches.length === 0 ? (
        <div className="empty-state">
          <h3>No matches yet</h3>
          <p>Start swiping on Discover to find your vibe tribe!</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: "1rem", display: "inline-flex" }}>
            Start Discovering
          </Link>
        </div>
      ) : (
        <div className="matches-grid">
          {matches.map((m) => (
            <Link key={m.id} to={`/profile/${m.profile.id}`} className="match-card card">
              <img src={m.profile.avatar} alt={m.profile.name} />
              <div className="match-card-info">
                <h3>{m.profile.name}</h3>
                <p>{m.compatibility}% match</p>
                <div className="match-vibes">
                  {m.sharedVibes.slice(0, 3).map((v) => (
                    <span key={v} className="badge">{v}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .matches-grid { display: flex; flex-direction: column; gap: 0.75rem; }
        .match-card {
          display: flex; align-items: center; gap: 1rem;
          padding: 1rem; text-decoration: none; color: inherit;
          transition: border-color 0.15s;
        }
        .match-card:hover { border-color: rgba(255, 61, 143, 0.3); }
        .match-card img {
          width: 64px; height: 64px; border-radius: 50%;
          border: 2px solid var(--pink); flex-shrink: 0;
        }
        .match-card h3 { font-size: 1rem; font-weight: 600; }
        .match-card p { font-size: 0.8rem; color: var(--pink-light); margin: 0.15rem 0 0.4rem; }
        .match-vibes { display: flex; gap: 0.3rem; flex-wrap: wrap; }
      `}</style>
    </div>
  );
}