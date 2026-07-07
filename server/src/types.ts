export type SocialPlatform = "instagram" | "facebook" | "x" | "tiktok";

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
}

export interface Match {
  id: string;
  profile: Profile;
  matchedAt: string;
  compatibility: number;
  sharedVibes: string[];
}

export interface SwipeAction {
  profileId: string;
  action: "like" | "pass" | "superlike";
}

export interface ConnectedAccount {
  platform: SocialPlatform;
  username: string;
  accessToken?: string;
  connectedAt: string;
}

export interface DiscoveryFilters {
  maxDistance?: number;
  minAge?: number;
  maxAge?: number;
  vibes?: string[];
  city?: string;
}