import { api } from "./client";
import type {
  FlavorDimension,
  FlavorDimensionConfig,
  FlavorRatingsSummary,
  DimensionSummary,
  FlavorLevel,
} from "../types";

export function fetchFlavorDimensions() {
  return api<{ dimensions: FlavorDimensionConfig[] }>("/flavors/dimensions");
}

export function fetchFlavorRatings(targetId: string) {
  return api<FlavorRatingsSummary>(`/flavors/${targetId}`);
}

export function rateFlavor(
  targetId: string,
  dimension: FlavorDimension,
  levelId: string
) {
  return api<{
    success: boolean;
    dimension: FlavorDimension;
    rating: FlavorLevel;
    summary: DimensionSummary;
    all: FlavorRatingsSummary;
  }>("/flavors", {
    method: "POST",
    body: JSON.stringify({ targetId, dimension, levelId }),
  });
}