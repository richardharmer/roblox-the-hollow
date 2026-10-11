import { z } from "zod";
export const STORAGE_KEY = "hollow-progress";
const stableId = z.string().regex(/^(quest|reward):[a-z0-9][a-z0-9-]{0,99}$/);
export const progressSchema = z
  .object({
    version: z.literal(2),
    eventId: z.literal("the-hollow-2026"),
    completed: z.array(stableId).max(10000),
  })
  .strict();
export type Progress = z.infer<typeof progressSchema>;
export const emptyProgress = (): Progress => ({
  version: 2,
  eventId: "the-hollow-2026",
  completed: [],
});
export function parseProgress(raw: unknown): Progress {
  const old = z
    .object({
      version: z.literal(1),
      eventId: z.literal("the-hollow-2026"),
      completedQuestIds: z.array(z.string().regex(/^[a-z0-9-]+$/)).max(10000),
      claimedRewardIds: z.array(z.string().regex(/^[a-z0-9-]+$/)).max(10000),
    })
    .strict()
    .safeParse(raw);
  if (old.success)
    return progressSchema.parse({
      version: 2,
      eventId: old.data.eventId,
      completed: [
        ...old.data.completedQuestIds.map((x) => "quest:" + x),
        ...old.data.claimedRewardIds.map((x) => "reward:" + x),
      ],
    });
  const data = progressSchema.parse(raw);
  return { ...data, completed: [...new Set(data.completed)] };
}
export function percentage(completed: string[], ids: string[]) {
  if (!ids.length) return null;
  return Math.round(
    (ids.filter((id) => completed.includes(id)).length / ids.length) * 100,
  );
}
