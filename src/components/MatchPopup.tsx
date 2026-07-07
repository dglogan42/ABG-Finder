import type { Match } from "../types";

interface Props {
  match: Match;
  onClose: () => void;
}

export function MatchPopup({ match, onClose }: Props) {
  return (
    <div className="match-popup" onClick={onClose}>
      <div className="match-popup-content" onClick={(e) => e.stopPropagation()}>
        <h2>It's a Match! 💕</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
          You and {match.profile.name} vibe together
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1.5rem" }}>
          <img
            src={match.profile.avatar}
            alt={match.profile.name}
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              border: "3px solid var(--pink)",
            }}
          />
        </div>

        <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
          {match.compatibility}% compatibility
        </p>
        <p style={{ fontSize: "0.85rem", color: "var(--pink-light)", marginBottom: "1.5rem" }}>
          Shared vibes: {match.sharedVibes.join(", ")}
        </p>

        <button className="btn btn-primary" onClick={onClose} style={{ width: "100%" }}>
          Keep Swiping
        </button>
      </div>
    </div>
  );
}