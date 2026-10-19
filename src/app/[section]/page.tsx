import { dateBriefing, gameBriefing } from "@/lib/briefing";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  collections,
  event,
  startLabel,
  sources,
  updates,
  contact,
  formatDate,
  type Collection,
} from "@/lib/content";
import { metadata } from "@/lib/seo";
import {
  Breadcrumb,
  PageHead,
  Status,
  SourceList,
  VerifiedDates,
} from "@/components/ui";
import { Directory } from "@/components/directory";
import { Tracker } from "@/components/tracker";
const pages: Record<string, [string, string]> = {
  games: [
    "The Hollow Games",
    "Explore the nine reported games with original Roblox covers, game profiles and official experience links. Event participation and task evidence are labeled separately.",
  ],
  quests: [
    "The Hollow Quests",
    "Find sourced objectives and walkthroughs for The Hollow. Search tasks, check prerequisites and keep your own completion checklist.",
  ],
  rewards: [
    "The Hollow Rewards",
    "Browse documented reward requirements, free and paid items, and availability. No items are listed without evidence.",
  ],
  badges: [
    "The Hollow Badges",
    "Find event-linked badges and their official Roblox pages. A new Halloween badge alone does not establish a connection to The Hollow.",
  ],
  updates: [
    "The Hollow Updates",
    "Read source reviews and meaningful changes to the event guide. Community reports are labeled separately from confirmed announcements.",
  ],
  "release-date": ["The Hollow Release Date", dateBriefing],
  progress: [
    "My Hollow Progress",
    "Your private, browser-based quest and reward checklist. No login, no Roblox password, and no account sync.",
  ],
  about: [
    "About The Hollow Guide",
    "An independent fan-made event companion built to help players find reliable answers and track their journey.",
  ],
  sources: [
    "Sources & Editorial Policy",
    "See where each claim comes from, how it was checked, and what we still cannot independently verify.",
  ],
  privacy: [
    "Privacy Policy",
    "How this website handles local progress, hosting requests and contact messages.",
  ],
};
export function generateStaticParams() {
  return Object.keys(pages).map((section) => ({ section }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const p = pages[section];
  return p
    ? metadata(
        `${p[0]} | The Hollow Guide`,
        p[1],
        `/${section}/`,
        section === "progress",
      )
    : {};
}
export default async function Section({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const p = pages[section];
  if (!p) notFound();
  return (
    <div className="container page-content">
      <Breadcrumb items={[{ name: p[0], path: `/${section}/` }]} />
      <PageHead eyebrow="THE HOLLOW / 2026 FIELD GUIDE" title={p[0]}>
        {p[1]}
      </PageHead>
      {section in collections ? (
        <>
          <Directory kind={section as Collection} />
          <div className="prose">
            <h2>
              {section === "games"
                ? "Which games are confirmed?"
                : section === "quests"
                  ? "How will quest guides work?"
                  : section === "rewards"
                    ? "How do I unlock rewards?"
                    : "How are event badges verified?"}
            </h2>
            <p>
              {section === "games"
                ? gameBriefing
                : section === "quests"
                  ? "Each published guide must identify its game, prerequisites, real completion steps and supporting sources. Estimated completion times appear only when evidence supports them."
                  : section === "rewards"
                    ? "Requirements are not verified yet. A reward entry must explain what it is, which game it belongs to, how it is obtained, whether it costs anything and its documented availability."
                    : "We check the badge ID, its universe and the evidence linking it to The Hollow. Badge creation, a spooky name or a Halloween image alone is insufficient."}
            </p>
            <h2>
              {section === "games"
                ? "What do these game profiles cover?"
                : "What to do while information is pending"}
            </h2>
            {section === "games" ? (
              <p>
                Each profile introduces the original game and links to its
                verified Roblox experience. The covers come from Roblox’s
                official thumbnail service. Hollow participation is still
                reported; the Instagram teasers are supporting evidence rather
                than a playable game entry.
              </p>
            ) : (
              <p>
                Check the{" "}
                <Link href="/release-date/">release-date briefing</Link> and{" "}
                <Link href="/updates/">latest source reviews</Link>. Once
                verified entries are published, use{" "}
                <Link href="/progress/">My Hollow Progress</Link> to keep track
                of your checklist on this device.
              </p>
            )}
            <h2>What is not being carried over from 2025?</h2>
            <p>
              Halloween Spotlight is a different event. Its keys, runes, games
              and rewards are not evidence of The Hollow’s mechanics. We will
              not reuse those requirements as 2026 instructions.
            </p>
            <SourceList ids={event.sources} />
          </div>
        </>
      ) : section === "progress" ? (
        <Tracker />
      ) : section === "release-date" ? (
        <div className="prose">
          <div className="callout">
            <Status level={event.dateVerification} />
            <h2>{startLabel}</h2>
            <p>
              <strong>
                {event.startAt ? event.startAt : "Exact launch time TBA."}
              </strong>{" "}
              {dateBriefing}
            </p>
          </div>
          <h2>Where does the date come from?</h2>
          <p>
            {event.dateVerification === "CONFIRMED"
              ? "The official evidence linked below establishes the event date. See the original source for any subsequent changes."
              : "Community discussions describe a teaser pointing to October 22, 2026. The official X post could not be directly read during the initial source review. We therefore label the date REPORTED rather than CONFIRMED."}
          </p>
          <SourceList ids={event.sources} />
          <h2>What time does The Hollow start?</h2>
          <p>
            {event.startAt
              ? `The documented start is ${event.startAt}.`
              : "No precise time or time zone has been verified. A calendar-day countdown cannot tell you when servers open. We will add time-zone conversions only when an official timestamp is available."}
          </p>
          <h2>When does it end?</h2>
          <p>
            {event.endAt
              ? `The documented end is ${event.endAt}.`
              : "An end date has not been verified. Previous Roblox events do not establish this event’s duration."}
          </p>
          <h2>Where can I play?</h2>
          <p>
            {event.hubUrl ? (
              <a href={event.hubUrl}>Open the verified event hub on Roblox</a>
            ) : (
              <>
                No official hub link has been verified. Check our{" "}
                <Link href="/games/">games directory</Link> for sourced links
                when they become available.
              </>
            )}
          </p>
          <VerifiedDates
            verified={event.lastVerifiedAt}
            updated={event.updatedAt}
          />
        </div>
      ) : section === "updates" ? (
        <>
          {updates.map((u) => (
            <article className="update-row" key={u.id}>
              <time dateTime={u.publishedAt}>{formatDate(u.publishedAt)}</time>
              <div>
                <Status level={u.verificationLevel} />
                <h2>
                  {u.publishDetail ? (
                    <Link href={`/updates/${u.slug}/`}>{u.title}</Link>
                  ) : (
                    u.title
                  )}
                </h2>
                <p>{u.summary}</p>
                <SourceList ids={u.sources} />
              </div>
            </article>
          ))}
          <div className="prose">
            <h2>What counts as an update?</h2>
            <p>
              We publish meaningful event developments and source reviews.
              Routine checks and minor badge-description changes do not become
              separate news articles. Dates here reflect actual published
              content changes.
            </p>
          </div>
        </>
      ) : section === "sources" ? (
        <>
          <div className="prose">
            <h2>Three evidence levels</h2>
            <p>
              <strong>CONFIRMED:</strong> directly readable primary evidence
              establishes the specific claim. <strong>REPORTED:</strong>{" "}
              attributable reporting exists, but primary verification is
              incomplete. <strong>UNCONFIRMED:</strong> speculation or
              insufficient evidence.
            </p>
            <h2>Evidence before publication</h2>
            <p>
              We prioritize Roblox announcements and developer statements, then
              official game APIs. Community posts help discover leads. Reposts
              of the same claim are not independent corroboration. New badges do
              not automatically become event rewards.
            </p>
            <p>
              Automated checks fail closed. Unclear claims stay unpublished;
              source outages do not upgrade evidence. AI may propose
              extractions, but cannot override the source, schema or publication
              checks.
            </p>
          </div>
          {sources.map((s) => (
            <article key={s.id} className="source-record">
              <span className="eyebrow">
                {s.level} / {s.access.replaceAll("_", " ")}
              </span>
              <h2>{s.name}</h2>
              <p>{s.note}</p>
              <a
                className="text-link"
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read original source ↗
              </a>
              <p className="results-count">
                Last checked: {formatDate(s.lastCheckedAt)} · Last successful
                direct read:{" "}
                {s.lastSuccessAt ? formatDate(s.lastSuccessAt) : "Not verified"}
              </p>
            </article>
          ))}
          <div className="prose">
            <h2>Corrections</h2>
            <p>
              Email <a href={`mailto:${contact}`}>{contact}</a> with the page
              URL, a description of the error and a primary source. We
              distinguish the date a source was verified from the date the page
              changed.
            </p>
          </div>
        </>
      ) : section === "about" ? (
        <div className="prose">
          <h2>A guide for completing the event</h2>
          <p>
            The Hollow Guide brings the event’s source record, game directories
            and personal checklist into one place. Our focus is practical: find
            the right game, understand a task, check a reward and remember what
            you have completed.
          </p>
          <h2>Independent by design</h2>
          <p>
            This website is an independent fan-made guide. It is not affiliated
            with, endorsed by, or sponsored by Roblox Corporation. Roblox and
            related trademarks belong to their respective owners.
          </p>
          <p>
            Our doorway mark and forest illustration are original artwork, not
            official event assets or screenshots. We do not claim access to
            unreleased content.
          </p>
          <h2>Editorial accountability</h2>
          <p>
            Information is assembled from linked sources and reviewed under our{" "}
            <Link href="/sources/">editorial policy</Link>. We do not invent
            game lists, walkthroughs, rewards or quotes. Automated processing
            can miss information; every page remains open to correction.
          </p>
          <h2>Contact</h2>
          <p>
            For corrections, rights inquiries or questions:{" "}
            <a href={`mailto:${contact}`}>{contact}</a>.
          </p>
        </div>
      ) : (
        <div className="prose">
          <p>Effective October 11, 2026.</p>
          <h2>Progress stays in your browser</h2>
          <p>
            The checklist stores stable quest and reward IDs in localStorage
            under “hollow-progress.” This data is not sent to a server by our
            application. You can export it, merge a backup or remove it using
            Reset progress. Clearing browser storage also removes it.
          </p>
          <h2>No Roblox account connection</h2>
          <p>
            We do not request your Roblox password, authenticate your account or
            synchronize inventory. There is no user registration system.
          </p>
          <h2>Hosting and technical requests</h2>
          <p>
            When deployed on Cloudflare Pages, the hosting provider processes
            network requests, which may include IP address, browser information
            and request logs for delivery and security. These hosting records
            are separate from your local checklist.
          </p>
          <h2>Analytics and advertising</h2>
          <p>
            This site uses Google Analytics to measure visits and Microsoft
            Clarity to understand how visitors use pages through interaction
            data and session recordings. These services may use cookies and
            process device, browser and usage information. See the{" "}
            <a href="https://policies.google.com/privacy">
              Google Privacy Policy
            </a>{" "}
            and the{" "}
            <a href="https://www.microsoft.com/privacy/privacystatement">
              Microsoft Privacy Statement
            </a>{" "}
            for details. Reserved ad components do not contact ad providers.
          </p>
          <h2>External links and contact</h2>
          <p>
            Roblox and other linked sites follow their own privacy policies. If
            you email us, your email address and message are processed to
            respond. Do not include passwords or sensitive personal information.
          </p>
          <h2>Questions or deletion requests</h2>
          <p>
            Contact <a href={`mailto:${contact}`}>{contact}</a>. We cannot
            delete checklist data on your device remotely; use the reset control
            or your browser’s storage settings.
          </p>
        </div>
      )}
    </div>
  );
}
