import { api } from "./client";
import type { Match } from "../types";

export function fetchMatches() {
  return api<{ matches: Match[] }>("/matches");
}