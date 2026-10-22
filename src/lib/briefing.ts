import { event, games, rewards, startLabel } from "./content";
export const dateBriefing = `${startLabel} is the ${event.dateVerification.toLowerCase()} date. Public access opens at 2 p.m. PDT (21:00 UTC; October 23 at 05:00 Beijing time). Roblox Plus hub access starts two hours earlier.`;
export const gameBriefing = `${games.length} games are confirmed as the origins of monsters in the shared Hollow hub. Original game links are not hub links; separate tasks in those games remain unverified.`;
export const rewardBriefing = rewards.length
  ? "Open a reward for its documented requirements. Tracking completion does not claim the item."
  : "Quest UGC and survival rewards are confirmed. Individual items and claim steps remain unverified; Marketplace purchases and Plus perks are separate.";
