import { useCallback, useEffect, useState, type CSSProperties } from "react";
import {
  fetchFlavorDimensions,
  fetchFlavorRatings,
  rateFlavor,
} from "../api/flavors";
import type {
  DimensionSummary,
  FlavorDimension,
  FlavorDimensionConfig,
  FlavorRatingsSummary,
} from "../types";

interface Props {
  profileId: string;
  compact?: boolean;
}

interface DimensionSliderProps {
  config: FlavorDimensionConfig;
  summary: DimensionSummary;
  compact?: boolean;
  submitting: boolean;
  onRate: (dimension: FlavorDimension, level: number) => void;
}

function DimensionSlider({
  config,
  summary,
  compact,
  submitting,
  onRate,
}: DimensionSliderProps) {
  const [sliderLevel, setSliderLevel] = useState(
    summary.myRating?.level ?? 3
  );

  useEffect(() => {
    if (summary.myRating) setSliderLevel(summary.myRating.level);
  }, [summary.myRating]);

  const current =
    config.levels.find((l) => l.level === sliderLevel) ?? config.levels[2];
  const heatPercent = ((sliderLevel - 1) / 5) * 100;

  const handleRelease = () => {
    if (sliderLevel !== summary.myRating?.level) {
      onRate(config.id, sliderLevel);
    }
  };

  const handleTick = (level: number) => {
    setSliderLevel(level);
    onRate(config.id, level);
  };

  return (
    <div
      className={`flavor-dimension${compact ? " compact" : ""}`}
      style={{ "--accent": current.color } as CSSProperties}
    >
      <div className="flavor-dim-header">
        <span className="flavor-snack">
          {config.snackEmoji} {compact ? config.title : config.snackName}
        </span>
        <span className="flavor-current">
          {current.emoji} {compact ? current.shortLabel : current.label}
        </span>
      </div>

      {!compact && (
        <p className="flavor-desc">{config.description}</p>
      )}

      <div className="flavor-slider-wrap">
        <div
          className="flavor-track"
          style={{ background: config.gradient, opacity: 0.35 }}
        />
        <div
          className="flavor-fill"
          style={{ width: `${heatPercent}%`, background: config.gradient }}
        />
        <input
          type="range"
          min={1}
          max={6}
          step={1}
          value={sliderLevel}
          onChange={(e) => setSliderLevel(Number(e.target.value))}
          onMouseUp={handleRelease}
          onTouchEnd={handleRelease}
          className="flavor-slider"
          disabled={submitting}
        />
        <div className="flavor-ticks">
          {config.levels.map((l) => (
            <button
              key={l.id}
              type="button"
              className={`flavor-tick${sliderLevel === l.level ? " active" : ""}`}
              onClick={() => handleTick(l.level)}
              title={l.label}
              disabled={submitting}
            >
              {l.emoji}
            </button>
          ))}
        </div>
      </div>

      {!compact && (
        <div className="flavor-level-list">
          {config.levels.map((l) => (
            <button
              key={l.id}
              type="button"
              className={`flavor-level-btn${summary.myRating?.id === l.id ? " selected" : ""}`}
              onClick={() => handleTick(l.level)}
              disabled={submitting}
              style={{ "--level-color": l.color } as CSSProperties}
            >
              <span>{l.emoji}</span>
              <span className="level-name">{l.label}</span>
              {(summary.counts[l.id] ?? 0) > 0 && (
                <span className="level-count">{summary.counts[l.id]}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {summary.totalRatings > 0 && (
        <p className="flavor-community">
          {summary.totalRatings} rated · avg {summary.averageLevel}/6
          {summary.topLevel && ` · top: ${summary.topLevel.emoji} ${summary.topLevel.shortLabel}`}
        </p>
      )}
    </div>
  );
}

export function FlavorRatings({ profileId, compact }: Props) {
  const [configs, setConfigs] = useState<FlavorDimensionConfig[]>([]);
  const [summary, setSummary] = useState<FlavorRatingsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<FlavorDimension | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [dimsRes, ratingsRes] = await Promise.all([
        fetchFlavorDimensions(),
        fetchFlavorRatings(profileId),
      ]);
      setConfigs(dimsRes.dimensions);
      setSummary(ratingsRes);
    } finally {
      setLoading(false);
    }
  }, [profileId]);

  useEffect(() => { load(); }, [load]);

  const handleRate = async (dimension: FlavorDimension, levelNum: number) => {
    const config = configs.find((c) => c.id === dimension);
    const level = config?.levels.find((l) => l.level === levelNum);
    if (!level || submitting) return;

    setSubmitting(dimension);
    try {
      const result = await rateFlavor(profileId, dimension, level.id);
      setSummary(result.all);
    } finally {
      setSubmitting(null);
    }
  };

  if (loading || !summary) {
    return compact ? null : (
      <div className="flavor-loading">
        <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
      </div>
    );
  }

  return (
    <div className={`flavor-ratings${compact ? " compact" : ""}`}>
      {!compact && (
        <div className="flavor-header">
          <h3>Snack Flavor Ratings</h3>
          <p>🧋 sweetness · 🍜 spice · 🍵 unique flavor</p>
        </div>
      )}

      {compact && (
        <p className="flavor-compact-label">Rate her flavors:</p>
      )}

      {configs.map((config) => {
        const dimSummary = summary.dimensions.find(
          (d) => d.dimension === config.id
        );
        if (!dimSummary) return null;
        return (
          <DimensionSlider
            key={config.id}
            config={config}
            summary={dimSummary}
            compact={compact}
            submitting={submitting === config.id}
            onRate={handleRate}
          />
        );
      })}

      <style>{`
        .flavor-ratings { margin: 1rem 0; }
        .flavor-ratings.compact { margin: 0.75rem 0 0; }
        .flavor-header h3 {
          font-size: 0.85rem; text-transform: uppercase;
          letter-spacing: 0.05em; color: var(--text-muted);
          margin-bottom: 0.2rem;
        }
        .flavor-header p {
          font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.75rem;
        }
        .flavor-compact-label {
          font-size: 0.75rem; font-weight: 600;
          color: var(--pink-light); margin-bottom: 0.5rem;
        }
        .flavor-dimension {
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 0.75rem;
          margin-bottom: 0.5rem;
        }
        .flavor-dimension.compact { padding: 0.6rem 0.75rem; }
        .flavor-dim-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 0.4rem; gap: 0.5rem;
        }
        .flavor-snack { font-weight: 700; font-size: 0.85rem; }
        .flavor-current {
          font-size: 0.75rem; font-weight: 600;
          color: var(--accent, var(--pink-light));
          text-align: right;
        }
        .flavor-desc {
          font-size: 0.75rem; color: var(--text-muted);
          margin-bottom: 0.5rem;
        }
        .flavor-slider-wrap { position: relative; margin-bottom: 0.25rem; }
        .flavor-track {
          height: 6px; border-radius: 3px;
        }
        .flavor-fill {
          position: absolute; top: 0; left: 0; height: 6px;
          border-radius: 3px; transition: width 0.15s;
          pointer-events: none;
        }
        .flavor-slider {
          position: absolute; top: -7px; left: 0; width: 100%;
          height: 20px; opacity: 0; cursor: pointer; margin: 0;
        }
        .flavor-ticks {
          display: flex; justify-content: space-between;
          margin-top: 0.35rem;
        }
        .flavor-tick {
          font-size: ${compact ? "0.8rem" : "0.95rem"};
          padding: 0.1rem; border-radius: 4px;
          opacity: 0.45; transition: transform 0.15s, opacity 0.15s;
        }
        .flavor-tick.active {
          opacity: 1; transform: scale(1.15);
          background: color-mix(in srgb, var(--accent, #f472b6) 20%, transparent);
        }
        .flavor-tick:hover:not(:disabled) { opacity: 1; }
        .flavor-level-list {
          display: flex; flex-direction: column; gap: 0.3rem;
          margin-top: 0.6rem;
        }
        .flavor-level-btn {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.45rem 0.65rem;
          border-radius: var(--radius-sm);
          background: var(--bg-card);
          border: 2px solid var(--border);
          text-align: left; font-size: 0.8rem;
          transition: border-color 0.15s, background 0.15s;
        }
        .flavor-level-btn:hover:not(:disabled) {
          border-color: var(--level-color);
        }
        .flavor-level-btn.selected {
          border-color: var(--level-color);
          background: color-mix(in srgb, var(--level-color) 15%, transparent);
        }
        .level-name { flex: 1; font-weight: 500; }
        .level-count {
          background: var(--level-color); color: white;
          font-size: 0.6rem; font-weight: 700;
          padding: 0.1rem 0.35rem; border-radius: 999px;
        }
        .flavor-community {
          font-size: 0.7rem; color: var(--text-muted);
          margin-top: 0.4rem;
        }
        .flavor-loading {
          display: flex; justify-content: center; padding: 1rem;
        }
      `}</style>
    </div>
  );
}