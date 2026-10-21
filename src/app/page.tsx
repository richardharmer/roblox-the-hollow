import { dateBriefing, gameBriefing, rewardBriefing } from "@/lib/briefing";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  CalendarDays,
  Check,
  Compass,
} from "lucide-react";
import {
  event,
  eventStatus,
  startLabel,
  games,
  gameProfiles,
  rewards,
  updates,
  latestReviewAt,
  formatDate,
} from "@/lib/content";
import { metadata } from "@/lib/seo";
import {
  SectionHead,
  Status,
  EmptyState,
  AdSlot,
  icons,
} from "@/components/ui";
import { Countdown } from "@/components/countdown";
import { TeaserGallery, TeaserMosaic } from "@/components/teasers";
export const generateMetadata = () =>
  metadata(
    "The Hollow Roblox 2026 – Event Guide, Games & Rewards",
    "The Hollow starts October 22, 2026. Follow verified information about Roblox’s Halloween event. Explore game, quest and reward updates and local progress tracking.",
    "/",
  );
const faq = [
  [
    "What is The Hollow Roblox event?",
    event.verificationLevel === "CONFIRMED"
      ? "The Hollow is a Roblox event documented by the official sources linked in this guide."
      : "The Hollow is the name used in community reports for a 2026 Roblox Halloween event. Our initial review could not directly verify the official teaser, so the name and event details are labeled reported.",
  ],
  ["When does The Hollow start?", dateBriefing],
  ["Which Roblox games are part of The Hollow?", gameBriefing],
  [
    "Is The Hollow free to play?",
    "Event access and reward pricing have not been verified. We will distinguish free rewards from paid items when official requirements are available.",
  ],
  ["How do I get The Hollow rewards?", rewardBriefing],
  [
    "Is this an official Roblox website?",
    "No. This is an independent fan-made guide, not a Roblox website. Links to original sources are provided so you can check each claim.",
  ],
];
export default function Home() {
  const status = eventStatus();
  return (
    <div className="container">
      <div className="edition-strip">
        <span>
          <span className="red-dot" /> HALLOWEEN 2026 / FIELD GUIDE
        </span>
        <Link href="/sources/">
          <ShieldCheck size={14} /> Evidence before speculation{" "}
          <ArrowUpRight size={13} />
        </Link>
      </div>
      <AdSlot placement="header" />
      <section className="hero hero-with-teasers">
        <TeaserMosaic />
        <div className="hero-content">
          <div className="hero-kicker">
            <Status level={status} />
            <span>2026 ROBLOX HALLOWEEN EVENT</span>
          </div>
          <h1>
            {status === "ENDED" ? (
              <>
                THE HOLLOW
                <span className="hero-subheading">
                  2026 Complete Event Archive
                </span>
              </>
            ) : (
              <>
                THE <span>HOLLOW</span>
                <span className="hero-subheading">Roblox 2026 Event Guide</span>
              </>
            )}
          </h1>
          <p className="hero-description">
            Nine faces in the dark.
            <br />
            Keep your next move in sight.
          </p>
          <p className="hero-caption">
            An independent fan-made guide to The Hollow, Roblox’s 2026 Halloween
            event announced for October 22. Follow sourced updates and track
            verified games, quests, badges and rewards as details become
            available.
          </p>
          <div className="hero-actions">
            <Link href="/games/" className="button primary">
              Explore Games <ArrowRight size={17} />
            </Link>
            <Link href="/rewards/" className="button">
              Track Rewards <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="hero-date">
            <CalendarDays size={18} />
            <div>
              <strong>{startLabel}</strong>
              <span>
                {event.dateVerification.toLowerCase()} start date ·{" "}
                <Link href="/release-date/">View evidence</Link>
              </span>
            </div>
            {status === "UPCOMING" && (
              <Countdown date={event.startDate} startAt={event.startAt} />
            )}
          </div>
        </div>
        <a
          className="art-credit"
          href="https://www.instagram.com/roblox/"
          target="_blank"
          rel="noopener noreferrer"
        >
          PROMOTIONAL ART · ROBLOX / INSTAGRAM ↗
        </a>
      </section>
      <div className="stat-bar">
        {[
          [
            "EVENT STATUS",
            `${status} · ${event.verificationLevel.toLowerCase()}`,
          ],
          ["START DATE", startLabel],
          [
            "PARTICIPATING GAMES",
            games.length
              ? `${games.length} confirmed`
              : gameProfiles.length
                ? `${gameProfiles.length} reported`
                : "To Be Announced",
          ],
          [
            "AVAILABLE REWARDS",
            rewards.length ? `${rewards.length} documented` : "To Be Announced",
          ],
          ["LATEST REVIEW", formatDate(latestReviewAt)],
        ].map(([k, v]) => (
          <div key={k}>
            <span>{k}</span>
            <strong>{v}</strong>
          </div>
        ))}
      </div>
      <div className="evidence-note">
        <ShieldCheck size={19} />
        <p>
          <strong>A clear line between facts and theories.</strong> The start
          date is {event.dateVerification.toLowerCase()}. Every published game
          and reward is linked to its evidence.
        </p>
        <Link href="/sources/">
          Our sources <ArrowUpRight size={15} />
        </Link>
      </div>
      <section className="section">
        <SectionHead
          eyebrow="THE REPORTED LINEUP"
          title="Explore the games"
          href="/games/#reported-teasers"
          label="See all nine"
        />
        <TeaserGallery featured />
      </section>
      <section className="section">
        <SectionHead
          eyebrow="YOUR EVENT COMPANION"
          title="Find your next step"
        />
        <div className="quick-grid">
          {(["games", "quests", "rewards", "badges"] as const).map((key, i) => {
            const Icon = icons[key];
            return (
              <Link className="quick-card" key={key} href={`/${key}/`}>
                <span className="card-number">0{i + 1}</span>
                <Icon size={27} />
                <h3>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                <p>
                  {
                    [
                      "Find participating experiences and their official links.",
                      "Go straight to the steps and completion requirements.",
                      "See what you can earn and how to unlock it.",
                      "Connect in-game badges to verified objectives.",
                    ][i]
                  }
                </p>
                <span className="card-foot">
                  {
                    [
                      "Browse games",
                      "Find a quest",
                      "Explore rewards",
                      "View badges",
                    ][i]
                  }
                  <ArrowUpRight size={17} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
      <div className="home-columns">
        <div>
          <section className="section">
            <SectionHead
              eyebrow="THE LINEUP"
              title="Confirmed participation"
              href="/games/"
              label="View directory"
            />
            {games.length ? (
              <div className="entry-list">
                {games.map((g) => (
                  <Link
                    key={g.id}
                    href={g.publishDetail ? `/games/${g.slug}/` : "/games/"}
                  >
                    {g.name}
                    <ArrowRight size={16} />
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState title="The lineup is still behind the door.">
                No participating games have been directly verified yet.
                Confirmed games will appear here with official links and sourced
                walkthroughs.
              </EmptyState>
            )}
          </section>
          <section className="section">
            <SectionHead
              eyebrow="THE REWARD BOARD"
              title="Know what you’re working toward"
              href="/rewards/"
              label="All rewards"
            />
            {rewards.length ? (
              <div className="entry-list">
                {rewards.slice(0, 4).map((r) => (
                  <Link
                    key={r.id}
                    href={r.publishDetail ? `/rewards/${r.slug}/` : "/rewards/"}
                  >
                    {r.name} ·{" "}
                    {r.availability === "UNAVAILABLE"
                      ? "No Longer Available"
                      : r.availability.toLowerCase()}
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState title="Rewards are yet to be revealed.">
                No verified items or unlock requirements are available. Free,
                paid, and no-longer-available items will be clearly separated.
              </EmptyState>
            )}
          </section>
        </div>
        <aside className="home-sidebar">
          <AdSlot placement="sidebar" />
          <section className="tracker-promo">
            <span className="eyebrow">YOUR PERSONAL CHECKLIST</span>
            <div className="progress-emblem">
              <Compass size={44} />
            </div>
            <h2>
              My Hollow
              <br />
              Progress
            </h2>
            <p>
              Every quest. Every reward.
              <br />
              Keep track of your own journey.
            </p>
            <ul>
              <li>
                <Check size={15} /> No account needed
              </li>
              <li>
                <Check size={15} /> Saved on this device
              </li>
              <li>
                <Check size={15} /> Export & import your checklist
              </li>
            </ul>
            <Link href="/progress/" className="button primary">
              Open My Progress <ArrowRight size={16} />
            </Link>
            <small>Your checklist opens when verified tasks arrive.</small>
          </section>
          <section className="briefing">
            <span className="eyebrow">BEFORE YOU BEGIN</span>
            <h3>
              What we know.
              <br />
              What we don’t.
            </h3>
            <p>
              A calendar date is not a launch time. A teaser theory is not a
              game announcement.
            </p>
            <Link href="/release-date/" className="text-link">
              Read the launch briefing <ArrowUpRight size={16} />
            </Link>
            <p>
              <Link href="/puzzle/">Explore the nine-name puzzle clues →</Link>
            </p>
          </section>
        </aside>
      </div>
      <section className="section">
        <SectionHead
          eyebrow="FROM THE FIELD NOTES"
          title="Latest The Hollow updates"
          href="/updates/"
          label="All updates"
        />
        {updates.slice(0, 3).map((u) => (
          <article className="update-row" key={u.id}>
            <time dateTime={u.publishedAt}>{formatDate(u.publishedAt)}</time>
            <div>
              <Status level={u.verificationLevel} />
              <h3>
                <Link href={`/updates/${u.slug}/`}>{u.title}</Link>
              </h3>
              <p>{u.summary}</p>
            </div>
            <Link
              href={`/updates/${u.slug}/`}
              className="circle-link"
              aria-label={`Read ${u.title}`}
            >
              <ArrowUpRight size={22} />
            </Link>
          </article>
        ))}
      </section>
      <section className="section faq-section">
        <div>
          <p className="eyebrow">THE SHORT ANSWERS</p>
          <h2>
            Before you
            <br />
            enter the unknown.
          </h2>
          <p>
            Frequently asked questions
            <br />
            about The Hollow.
          </p>
        </div>
        <div className="faqs">
          {faq.map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <span>+</span>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
