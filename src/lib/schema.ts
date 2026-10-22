import { z } from "zod";
export const level = z.enum(["CONFIRMED", "REPORTED", "UNCONFIRMED"]);
const text = z
  .string()
  .min(1)
  .max(12000)
  .refine(
    (s) => !/<\/?[a-z][^>]*>|javascript:|ignore previous instructions/i.test(s),
    "Unsafe content",
  );
export const id = z.string().regex(/^[a-z0-9][a-z0-9-]{0,99}$/);
export const url = z.url().refine((s) => {
  const u = new URL(s);
  return u.protocol === "https:" && !u.username && !u.password;
}, "HTTPS URL required");
const date = z.iso.date();
export const eventSchema = z
  .object({
    id,
    name: text,
    year: z.number().int(),
    status: z.enum(["UPCOMING", "LIVE", "ENDED"]),
    verificationLevel: level,
    startDate: date.nullable(),
    startAt: z.iso.datetime({ offset: true }).nullable(),
    endAt: z.iso.datetime({ offset: true }).nullable(),
    plusEarlyAccessAt: z.iso
      .datetime({ offset: true })
      .nullable()
      .default(null),
    finaleDate: date.nullable().default(null),
    finaleAt: z.iso.datetime({ offset: true }).nullable().default(null),
    rewardClaimDeadline: z.iso
      .datetime({ offset: true })
      .nullable()
      .default(null),
    dateVerification: level,
    hubUrl: url.nullable(),
    summary: text,
    sources: z.array(id),
    lastVerifiedAt: date,
    updatedAt: date,
  })
  .strict();
export const sourceSchema = z
  .object({
    id,
    name: text,
    url,
    level: z.enum(["OFFICIAL", "DEVELOPER", "COMMUNITY"]),
    access: z.enum(["READ", "SEARCH_ONLY", "UNAVAILABLE"]),
    note: text,
    lastCheckedAt: date,
    lastSuccessAt: date.nullable(),
  })
  .strict();
export const teaserSchema = z
  .object({
    id,
    gameName: text,
    verificationLevel: z.literal("REPORTED"),
    officialSourceId: id,
    reportSourceIds: z.array(id).min(1),
    caption: text,
    sourceDate: date,
    checkedAt: date,
    image: z
      .object({
        src: z.string().regex(/^\/images\/teasers\/[a-z0-9-]+\.webp$/),
        alt: text,
        width: z.number().int().positive(),
        height: z.number().int().positive(),
        credit: text,
        usage: text,
      })
      .strict(),
  })
  .strict();
const base = {
  id,
  slug: id,
  name: text,
  description: text,
  verificationLevel: level,
  sources: z.array(id).min(1),
  firstSeenAt: date,
  lastVerifiedAt: date,
  updatedAt: date,
  publishDetail: z.boolean(),
  image: z.object({ url, alt: text, permission: text }).nullable(),
};
const robloxId = z.number().int().positive().max(Number.MAX_SAFE_INTEGER);
export const gameProfileSchema = z
  .object({
    id,
    name: text,
    summary: text,
    overview: z.array(text).min(2),
    eventNote: text,
    creator: text,
    creatorId: robloxId,
    creatorType: z.enum(["Group", "User"]),
    placeId: robloxId,
    universeId: robloxId,
    robloxUrl: url,
    sourceId: id,
    checkedAt: date,
    image: z
      .object({
        src: z.string().regex(/^\/images\/games\/[a-z0-9-]+\.webp$/),
        alt: text,
        width: z.number().int().positive(),
        height: z.number().int().positive(),
        credit: text,
        sourceUrl: url,
      })
      .strict(),
  })
  .strict();
export const gameSchema = z
  .object({
    ...base,
    robloxUrl: url,
    universeId: robloxId,
    placeId: robloxId,
    monster: text.nullable().default(null),
    participationStatus: z.enum(["CONFIRMED", "REPORTED", "UNCONFIRMED"]),
    walkthrough: z.array(text),
    troubleshooting: z.array(text),
  })
  .strict();
export const questSchema = z
  .object({
    ...base,
    gameId: id,
    prerequisites: z.array(text),
    steps: z.array(text).min(1),
    tips: z.array(text),
    troubleshooting: z.array(text),
    estimatedMinutes: z.number().positive().nullable(),
  })
  .strict();
export const rewardSchema = z
  .object({
    ...base,
    gameId: id,
    catalogItemId: robloxId.nullable(),
    type: text,
    free: z.boolean().nullable(),
    availability: z.enum(["AVAILABLE", "UNAVAILABLE", "UNKNOWN"]),
    requirements: z.array(text).min(1),
    steps: z.array(text).min(1),
    questIds: z.array(id),
  })
  .strict();
export const badgeSchema = z
  .object({
    ...base,
    gameId: id,
    badgeId: robloxId,
    robloxUrl: url,
    requirements: z.array(text),
  })
  .strict();
export const updateSchema = z
  .object({
    id,
    slug: id,
    title: text,
    summary: text,
    body: z.array(text).min(1),
    verificationLevel: level,
    sources: z.array(id).min(1),
    publishedAt: date,
    updatedAt: date,
    lastVerifiedAt: date,
    kind: z.enum(["EDITORIAL", "ANNOUNCEMENT"]),
    publishDetail: z.boolean(),
  })
  .strict();
export type Game = z.infer<typeof gameSchema>;
export type Quest = z.infer<typeof questSchema>;
export type Reward = z.infer<typeof rewardSchema>;
export type Badge = z.infer<typeof badgeSchema>;
export type Entry = Game | Quest | Reward | Badge;
export type Update = z.infer<typeof updateSchema>;
