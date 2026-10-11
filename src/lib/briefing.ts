import { event, games, rewards, startLabel } from "./content";
export const dateBriefing = `${startLabel} is the ${event.dateVerification.toLowerCase()} date. ${event.startAt ? `The documented launch instant is ${event.startAt}.` : "The exact launch time and time zone have not been verified. This guide does not assume a midnight or 10 a.m. launch."}`;
export const gameBriefing = games.length
  ? `${games.length} participating games are documented below. Each entry links to its evidence and official Roblox experience.`
  : "No complete official game list has been directly verified in our current sources. Inclusion requires an announcement from Roblox or the developer that explicitly connects the game to this event.";
export const rewardBriefing = rewards.length
  ? "Open a reward to see its documented requirements and availability, then use My Hollow Progress to track your checklist. Marking it complete does not claim the item."
  : "No reward requirements have been verified yet. This guide will connect each published reward to its game and task steps. Never enter your Roblox password on a fan site.";
