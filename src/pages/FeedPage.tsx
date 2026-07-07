import { useCallback, useEffect, useState } from "react";
import { fetchFeed } from "../api/feed";
import { FeedPostCard } from "../components/FeedPostCard";
import { PlatformFilter } from "../components/PlatformFilter";
import { useAppStore } from "../stores/appStore";
import type { FeedPost } from "../types";

export function FeedPage() {
  const { activeFeedPlatforms, toggleFeedPlatform } = useAppStore();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { posts: data } = await fetchFeed(
        activeFeedPlatforms.length ? activeFeedPlatforms : undefined
      );
      setPosts(data);
    } finally {
      setLoading(false);
    }
  }, [activeFeedPlatforms]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Social Feed</h1>
        <p>Aggregated from your connected platforms</p>
      </div>

      <PlatformFilter active={activeFeedPlatforms} onToggle={toggleFeedPlatform} />

      {loading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <h3>No posts yet</h3>
          <p>Connect your social accounts to see the ABG feed.</p>
        </div>
      ) : (
        posts.map((post) => <FeedPostCard key={post.id} post={post} />)
      )}
    </div>
  );
}