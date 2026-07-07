import { useCallback, useEffect, useState } from "react";
import { fetchDiscover } from "../api/discover";
import { swipe } from "../api/swipes";
import { MatchPopup } from "../components/MatchPopup";
import { ProfileCard } from "../components/ProfileCard";
import type { Match, Profile } from "../types";

export function DiscoverPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swipeAnim, setSwipeAnim] = useState<"left" | "right" | null>(null);
  const [match, setMatch] = useState<Match | null>(null);
  const [swiping, setSwiping] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { profiles: data } = await fetchDiscover();
      setProfiles(data);
      setIndex(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const current = profiles[index];

  const handleSwipe = async (action: "like" | "pass" | "superlike") => {
    if (!current || swiping) return;
    setSwiping(true);
    setSwipeAnim(action === "pass" ? "left" : "right");

    try {
      const result = await swipe(current.id, action);
      if (result.match) setMatch(result.match);
    } catch {
      /* continue */
    }

    setTimeout(() => {
      setSwipeAnim(null);
      setIndex((i) => i + 1);
      setSwiping(false);
    }, 350);
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading"><div className="spinner" /></div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Discover</h1>
          <p>Find your ABG vibe tribe</p>
        </div>
        <div className="empty-state">
          <h3>No more profiles</h3>
          <p>You've seen everyone! Check back later for new baddies.</p>
          <button className="btn btn-primary" onClick={load} style={{ marginTop: "1rem" }}>
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Discover</h1>
        <p>Swipe & rate: 🧋 sweet · 🍜 spicy · 🍵 unique</p>
      </div>

      <ProfileCard
        profile={current}
        swipeAnim={swipeAnim}
        onPass={() => handleSwipe("pass")}
        onLike={() => handleSwipe("like")}
        onSuperlike={() => handleSwipe("superlike")}
      />

      <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.5rem" }}>
        {index + 1} of {profiles.length}
      </p>

      {match && <MatchPopup match={match} onClose={() => setMatch(null)} />}
    </div>
  );
}