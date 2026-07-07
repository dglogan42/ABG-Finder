import { Link } from "react-router-dom";
import type { FeedPost } from "../types";

interface Props {
  post: FeedPost;
}

function formatTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function formatCount(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export function FeedPostCard({ post }: Props) {
  return (
    <article className="feed-post card">
      <div className="feed-post-header">
        <Link to={`/profile/${post.authorId}`}>
          <img src={post.authorAvatar} alt="" className="feed-avatar" />
        </Link>
        <div className="feed-post-meta">
          <Link to={`/profile/${post.authorId}`} className="feed-author">
            {post.authorName}
          </Link>
          <span className={`badge badge-${post.platform} badge-platform`}>
            {post.platform}
          </span>
          <span className="feed-time">{formatTime(post.timestamp)}</span>
        </div>
      </div>

      <p className="feed-content">{post.content}</p>

      {post.imageUrl && (
        <div className="feed-image-wrap">
          <img src={post.imageUrl} alt="" loading="lazy" />
        </div>
      )}

      <div className="feed-stats">
        <span>♥ {formatCount(post.likes)}</span>
        <span>💬 {formatCount(post.comments)}</span>
      </div>

      {post.hashtags.length > 0 && (
        <div className="feed-hashtags">
          {post.hashtags.map((tag) => (
            <span key={tag} className="hashtag">#{tag}</span>
          ))}
        </div>
      )}

      <style>{`
        .feed-post { margin-bottom: 1rem; }
        .feed-post-header { display: flex; gap: 0.75rem; padding: 1rem 1rem 0.5rem; align-items: center; }
        .feed-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--bg-elevated); }
        .feed-post-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 0.4rem; }
        .feed-author { font-weight: 600; color: var(--text); }
        .feed-time { font-size: 0.75rem; color: var(--text-muted); }
        .feed-content { padding: 0 1rem 0.75rem; line-height: 1.5; font-size: 0.95rem; }
        .feed-image-wrap img { width: 100%; max-height: 400px; object-fit: cover; }
        .feed-stats {
          display: flex; gap: 1rem; padding: 0.5rem 1rem;
          font-size: 0.85rem; color: var(--text-muted);
        }
        .feed-hashtags { padding: 0 1rem 1rem; display: flex; flex-wrap: wrap; gap: 0.35rem; }
        .hashtag { font-size: 0.8rem; color: var(--pink-light); }
      `}</style>
    </article>
  );
}