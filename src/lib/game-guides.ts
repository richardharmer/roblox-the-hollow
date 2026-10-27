import { quests, rewards } from "./content";

// Explicit associations include Hub puzzles and separate original-game quests.
const guideIds: Record<string, string[]> = {
  "the-mimic": ["mimic-carnival-relics", "night-five-mirrors"],
  doors: ["doors-candy-vault", "night-one-relics"],
  "dandys-world": ["dandys-world-pumpkins", "night-two-pillars"],
  demonology: ["demonology-six-relics", "night-three-graves"],
  "99-nights-in-the-forest": ["forest-void-flowers", "night-four-path"],
};
export function guidesForGame(id: string) {
  return (guideIds[id] ?? []).flatMap((questId) => {
    const quest = quests.find((q) => q.id === questId && q.publishDetail);
    return quest ? [{ quest, rewards: rewards.filter((reward) => reward.questIds.includes(questId)) }] : [];
  });
}
