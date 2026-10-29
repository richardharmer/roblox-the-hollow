import { LivestreamSchedule } from "@/components/livestream-schedule";
import {
  RewardBoard,
  RewardIssueNotice,
  TicketsGuide,
  CodesGuide,
  LauncherGhostsGuide,
} from "@/components/player-guide";
import {
  FullLineup,
  Outskirts,
  HuntedBriefing,
  MazeEvidence,
  ThemeGuide,
} from "@/components/hollow-field-notes";
import { EventSchedule } from "@/components/event-schedule";
import { dateBriefing, gameBriefing } from "@/lib/briefing";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  collections,
  hollowBadges,
  event,
  sources,
  updates,
  contact,
  formatDate,
  type Collection,
} from "@/lib/content";
import { metadata } from "@/lib/seo";
import {
  AdSlot,
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
    "Explore the Nightly Haunts creator pairings, everyday roaming monsters and Outskirts side quests, with original Roblox game profiles.",
  ],
  quests: [
    "The Hollow Quests",
    "Find sourced objectives and walkthroughs for The Hollow. Search tasks, check prerequisites and keep your own completion checklist.",
  ],
  rewards: [
    "The Hollow Rewards",
    "Get Mimic Hoodie from Animal Hospital and documented Night 1–6 maze rewards with written claim steps. Learn how to earn and spend Tickets, check event codes, and separate free quest items from Plus-only rewards.",
  ],
  badges: [
    "The Hollow Badges",
    "Find event-linked badges and their official Roblox pages. A new Halloween badge alone does not establish a connection to The Hollow.",
  ],
  updates: [
    "The Hollow Updates",
    "Read source reviews and meaningful changes to the event guide. Community reports are labeled separately from confirmed announcements.",
  ],
  "release-date": ["The Hollow Start Time, Finale & Reward Deadline", dateBriefing],
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
      {!["privacy", "about", "sources", "progress"].includes(section) && (
        <AdSlot placement="header" />
      )}
      {section in collections ? (
        <>
          {section === "rewards" && (
            <>
              <RewardIssueNotice />
              <RewardBoard />
              <LauncherGhostsGuide />
              <TicketsGuide />
              <CodesGuide />
            </>
          )}
          {section === "quests" && (
            <>
              <RewardIssueNotice />
              <div className="prose">
                <h2>Choose a task: maze puzzles and game quests</h2>
                <p>
                  {collections.quests.filter((quest) => quest.publishDetail).length} written walkthroughs cover the reviewed event tasks, including Night 1–6 maze puzzles and participating experiences. Recordings, official written requirements and community reports are attributed in each guide.
                </p>
              </div>
              <Directory kind="quests" />
              <TicketsGuide />
            </>
          )}
          {section === "games" && (
            <>
              <LivestreamSchedule />
              <FullLineup />
              <div className="prose"><h2>More participating-game walkthroughs</h2><p><Link href="/games/home-alone-anomalies/">Home Alone Anomalies: four visitors, notice board and Floor 4 claim →</Link></p></div>
            </>
          )}
          {section === "quests" && (
            <>
              <HuntedBriefing />
              <Outskirts />
              <MazeEvidence />
            </>
          )}
          {section === "badges" && (
            <>
              <div className="prose">
                <h2>Official badge IDs and verification status</h2>
                <p>
                  {hollowBadges.length} enabled Hub badges were returned by Roblox’s official API for
                  The Hollow universe 10770728771 on October 29 (Beijing), with no
                  next-page cursor. Search by name, Badge ID or Universe ID
                  below. The directory also includes separately verified badges from participating experiences.
                </p>
                <p>
                  CONFIRMED refers to badge identity and universe ownership.
                  Empty API descriptions do not establish completion steps,
                  Tickets, free or Plus eligibility, or successful avatar-item
                  delivery. Badge IDs are not Catalog IDs. Linked video-based
                  reward guides remain REPORTED. Enabled is an API snapshot, not
                  a guarantee that a claim currently works.
                </p>
                <SourceList ids={["official-hollow-badges"]} />
              </div>
              <Directory kind="badges" />
              <HuntedBriefing />
            </>
          )}
          {section === "rewards" && <ThemeGuide />}
          {section === "quests" && (
            <div className="prose">
              <h2>Where to play and what to do</h2>
              <p>
                The Hollow takes place in a shared event hub. The nine featured
                games supply its monsters; separate original-game quests are documented where complete evidence is available. The Outskirts
                is a separately announced cross-game quest lineup, listed above.
                The official hub description now confirms avatar-item quests
                both in the hub and participating experiences. Start with the{" "}
                <a href={event.hubUrl ?? undefined}>official Hollow hub</a>. Use
                the written guides above for the tasks reviewed so far.
              </p>
              <p>
                Roblox describes a new maze each day for nine days: navigate the
                maze, search for clues and evade monsters. Completing quests
                earns UGC and survival rewards. The Night 1 and Night 2 guides above now
                cover recorded objectives and claim steps; later-night routes
                remain unverified.
              </p>
              <h2>Find live clue-solving coverage</h2>
              <p>
                Roblox names LimaMosca, KreekCraft, Bundun and SirDapper as
                creators who will stream from inside the Hollow. Their gameplay
                is a useful place to look for demonstrated solutions once play
                begins. A scheduled stream or reaction video is not a completed
                walkthrough.
              </p>
              <h2>Can you catch up after missing a day?</h2>
              <p>
                This remains unanswered. A player asks this exact question in
                post 17 of the official announcement thread; none of the 22
                posts read on October 22 provides an answer. The overall reward
                deadline does not establish that earlier daily quests remain
                available.
              </p>
              <p>
                The announced monster list also does not specify their daily
                arrival order. We will attach dates to individual monsters when
                an announcement or recorded gameplay establishes the pairing.
              </p>
              <SourceList
                ids={["official-newsroom-hollow", "official-devforum-hollow"]}
              />
            </div>
          )}
          {section === "rewards" && (
            <div className="prose">
              <h2>Three distinct reward categories</h2>
              <ul className="reward-categories">
                <li>
                  <strong>Earned through quests:</strong> exclusive UGC and
                  survival rewards. The reward board above lists the first
                  documented items and their written claim guides.
                </li>
                <li>
                  <strong>Marketplace purchases:</strong> limited-time products
                  including Hollow Horseman, avatar accessories and seasonal
                  makeup. These are not confirmed free quest rewards; prices are
                  not documented here.
                </li>
                <li>
                  <strong>Active Roblox Plus benefits:</strong> two-hour early
                  hub access, a profile frame and background, and an item
                  launcher for gifting. Active subscribers can retain the theme
                  after the finale.
                </li>
              </ul>
              <p>
                Reward collection ends November 2 at noon PST (November 3 at
                04:00 Beijing). No specific item is listed below without
                verified requirements.
              </p>
              <SourceList ids={["official-newsroom-hollow"]} />
            </div>
          )}
          {section !== "quests" && section !== "badges" && (
            <Directory kind={section as Collection} />
          )}
          <AdSlot placement="content" />
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
                    ? "Use the reward board for item-specific steps, the Tickets guide for shop credit, and the free-only filter to exclude Plus-required items."
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
                official thumbnail service. The October 21 Newsroom announcement
                confirms nine monster origin games in the shared Hollow hub;
                other profiles cover separately documented event quests. Original
                game IDs are not hub IDs.
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
            {section === "quests" && (
              <p>
                Looking for a floor solution or checking a QR claim? Read{" "}
                <Link href="/puzzle/">
                  The Hollow floor puzzles and QR-code status
                </Link>{" "}
                before treating a claimed password as a quest requirement.
              </p>
            )}
            <SourceList ids={event.sources} />
          </div>
        </>
      ) : section === "progress" ? (
        <Tracker />
      ) : section === "release-date" ? (
        <div className="prose">
          <Status level={event.dateVerification} />
          <EventSchedule />
          <h2>Where does the schedule come from?</h2>
          <p>
            Roblox published the official Newsroom announcement on October 21;
            we directly read it on October 22. Earlier X posts confirmed only
            the date.
          </p>
          <SourceList ids={event.sources} />
          <h2>Launch schedule</h2>
          <ul>
            <li>
              Public opening: October 22, 2 p.m. PDT / 21:00 UTC / October 23,
              05:00 Beijing.
            </li>
            <li>
              Active Roblox Plus subscribers: October 22, noon PDT / 19:00 UTC /
              October 23, 03:00 Beijing.
            </li>
          </ul>
          <h2>What does the hub’s 3 p.m. PT start mean?</h2>
          <p>
            The official hub description says “It opens October 22 2pm PT. It
            starts 3pm PT.” The latter is October 22 at 22:00 UTC / October 23
            at 06:00 Beijing. Roblox does not explain which gameplay phase this
            means; it is not a verified first-day quest unlock time.
          </p>
          <h2>Is 11 AM PT the confirmed launch time?</h2>
          <p>
            No. Roblox specifies 2 p.m. Pacific for public access and noon for
            Plus early hub access. DOORS seasonal update times are separate.
          </p>
          <h2>Finale and reward deadline</h2>
          <p>
            The live finale is on the morning of October 31. Its exact hour
            remains TBA.
          </p>
          <p>
            Rewards can be collected until November 2 at noon PST / 20:00 UTC /
            November 3 at 04:00 Beijing. This is the reward cutoff, not the
            finale time. Pacific time switches to PST on November 1.
          </p>
          <h2>Who can participate?</h2>
          <p>
            The announcement covers eligible Roblox accounts, generally ages 9
            and above. Age and access restrictions vary by region.
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
          <p>
            Verified October 23 through the Newsroom’s direct link: Place ID
            116463962153167, published by Roblox Presents (group 4111519).
            Universe ID 10770728771 is verified by Roblox APIs. The API reports
            active players, but we have not independently tested account entry
            or regional availability.
          </p>
          <h2>What else can I check?</h2>
          <p>
            Browse the{" "}
            <Link href="/games/">nine confirmed monster origins</Link>
            for original Roblox links, or read the{" "}
            <Link href="/puzzle/">puzzle and QR-code evidence briefing</Link>.
            Game participation, quest requirements and reward availability are
            separate checks. The Newsroom announcement confirms monster origins
            but does not supply individual task instructions.
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
                <p>
                  {u.publishedAt < "2026-10-22" && "Historical review · "}
                  {u.summary}
                </p>
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
            <h2>October 23: official hub verified</h2>
            <p>
              We followed Roblox Newsroom → The Hollow experience (Place ID
              116463962153167) → Roblox Presents (group 4111519). The official
              entry link is confirmed; live server access is not independently
              tested. The hub’s separate 3 p.m. PT start has no explained
              gameplay meaning. Its description confirms quests in the hub and
              participating experiences.
            </p>
            <SourceList
              ids={["official-newsroom-hollow", "official-hollow-hub"]}
            />
            <h2>October 22 verification update</h2>
            <p>
              We directly read Roblox’s October 21 Newsroom announcement and its
              nine original game links. The launch schedule, monster origins and
              reward categories are now confirmed. Older records below retain
              their original check dates, including the October 11 index review
              that had not found an announcement.
            </p>
            <Link href="/updates/october-22-official-mechanics/">
              Read the official announcement review
            </Link>
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
          <p>Effective October 21, 2026.</p>
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
            for details.
          </p>
          <p>
            We display labeled Adsterra advertisements to support this
            independent guide. Loading an advertisement contacts Adsterra and
            its delivery partners, which may process your IP address, device and
            browser information, page/referrer information, cookies and ad
            interactions. Ads are third-party promotions, not Roblox rewards or
            editorial recommendations. See the{" "}
            <a href="https://adsterra.com/privacy-policy/">
              Adsterra Privacy Policy
            </a>
            . Your local progress checklist is not included in our ad
            configuration. Browser privacy controls can restrict cookies and
            third-party requests.
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
