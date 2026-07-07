export type SocialPlatform = "instagram" | "facebook" | "x" | "tiktok";
export type FlavorDimension = "sweetness" | "spicy" | "unique";

export interface SocialLink {
  platform: SocialPlatform;
  username: string;
  url: string;
  followers?: number;
  connected?: boolean;
}

export interface FeedPost {
  id: string;
  platform: SocialPlatform;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  timestamp: string;
  hashtags: string[];
}

export interface FlavorLevel {
  id: string;
  level: number;
  label: string;
  shortLabel: string;
  emoji: string;
  color: string;
}

export interface FlavorDimensionConfig {
  id: FlavorDimension;
  snackEmoji: string;
  snackName: string;
  title: string;
  description: string;
  gradient: string;
  levels: FlavorLevel[];
}

export interface DimensionSummary {
  dimension: FlavorDimension;
  snackEmoji: string;
  snackName: string;
  title: string;
  totalRatings: number;
  counts: Record<string, number>;
  averageLevel: number;
  topLevel: Pick<FlavorLevel, "id" | "level" | "label" | "shortLabel" | "emoji" | "color"> | null;
  myRating: FlavorLevel | null;
}

export interface FlavorRatingsSummary {
  targetId: string;
  dimensions: DimensionSummary[];
}

export interface ProfileSauce {
  platform: SocialPlatform;
  label: string;
  sourceUrl?: string;
  spottedAt: string;
  context?: string;
}

export interface Profile {
  id: string;
  name: string;
  age: number;
  city: string;
  bio: string;
  avatar: string;
  coverImage: string;
  vibes: string[];
  interests: string[];
  socials: SocialLink[];
  abgScore: number;
  distanceKm?: number;
  isOnline: boolean;
  lastActive: string;
  sauce?: ProfileSauce;
  compatibility?: number;
  sharedVibes?: string[];
  flavorRatings?: FlavorRatingsSummary;
}

export interface Match {
  id: string;
  profile: Profile;
  matchedAt: string;
  compatibility: number;
  sharedVibes: string[];
}

export interface AuthStatus {
  platform: SocialPlatform;
  connected: boolean;
  username?: string;
  connectedAt?: string;
  oauthAvailable: boolean;
}