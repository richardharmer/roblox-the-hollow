import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  gameProfiles,
  games,
  teasers,
  sources,
  formatDate,
} from "@/lib/content";
import { QuestSteps } from "./quest-steps";
import { guidesForGame } from "@/lib/game-guides";
import { AdSlot, Breadcrumb, SourceList, Status, VerifiedDates } from "./ui";

export function GameProfile({ id }: { id: string }) {
  const game = gameProfiles.find((g) => g.id === id);
  const participation = games.find((g) => g.id === id);
  const teaser = teasers.find((t) => t.id === id);
  if (!game || !teaser) notFound();
  const guides = guidesForGame(id);
  const guideSources = [...new Set(guides.flatMap(({ quest }) => quest.sources))];
  const reviewDate = guides.map(({ quest }) => quest.lastVerifiedAt).sort().at(-1);
  const original = sources.find((s) => s.id === teaser.officialSourceId)!;
  return (
    <div className="container page-content">
      <Breadcrumb
        items={[
          { name: "Games", path: "/games/" },
          { name: game.name, path: `/games/${id}/` },
        ]}
      />
      <AdSlot placement="header" />
      <header className="game-profile-header">
        <div className="game-profile-cover">
          <Image
            src={game.image.src}
            alt={game.image.alt}
            width={game.image.width}
            height={game.image.height}
            sizes="(max-width: 800px) 100vw, 650px"
            preload
          />
          <span>{game.image.credit}</span>
        </div>
        <div className="game-profile-heading">
          <p className="eyebrow">GAME PROFILE / THE HOLLOW 2026</p>
          <h1>{game.name}</h1>
          <p>{guides.length ? guides.map(({ quest }) => quest.description).join(" ") : `${participation?.monster} is confirmed in The Hollow. A complete reward walkthrough for this game has not yet been verified.`}</p>
          <p className="game-publisher">By {game.creator}</p>
          <div className="game-participation">
            <Status level={participation?.verificationLevel ?? "REPORTED"} />
            <span>The Hollow participation</span>
          </div>
          <a className="button primary" href="#event-tasks">{guides.length ? "Read tasks and claim steps" : "Check task verification status"} <ArrowRight size={17} /></a>
          <a
            className="text-link"
            href={game.robloxUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Play on Roblox <ArrowUpRight size={17} />
          </a>
          <p className="game-link-note">
            Opens the original game. This is not an event hub link.
          </p>
        </div>
      </header>
      <nav className="game-profile-nav" aria-label="On this game page">
        <a href="#event-tasks">Tasks & rewards</a>
        <a href="#overview">Game background</a>
        <a href="#hollow-status">Hollow status</a>
        <a href="#teaser-evidence">Teaser evidence</a>
        <a href="#game-sources">Sources</a>
      </nav>
      <AdSlot placement="native" />
      <div className="game-profile-content">
        <div className="prose">
          <section id="event-tasks">
            <h2>{guides.length ? "Tasks, rewards and claim steps" : "Task guide: verification pending"}</h2>
            {guides.length ? guides.map(({ quest, rewards: taskRewards }) => (
              <article key={quest.id}>
                <Status level={quest.verificationLevel} />
                <h3>{quest.name}</h3>
                <p>{quest.id.startsWith("night-") ? "Location: The Hollow hub maze. This task takes place in the event hub." : `Location: ${game.name}, followed by the return to The Hollow hub.`}</p>
                <p>Reviewed {formatDate(quest.lastVerifiedAt)} against the cited recordings. This is not our own account playtest.</p>
                {taskRewards.map((reward) => <div className="callout" key={reward.id}>
                  <strong>Reward: <Link href={`/rewards/${reward.slug}/`}>{reward.name}</Link></strong>
                  <p>{reward.costLabel}</p>
                  <ul>{reward.requirements.map((requirement) => <li key={requirement}>{requirement}</li>)}</ul>
                </div>)}
                <h4>Complete the task and claim</h4>
                <QuestSteps id={quest.id} steps={quest.steps} />
                {quest.tips.length > 0 && <><h4>What helps</h4><ul>{quest.tips.map((tip) => <li key={tip}>{tip}</li>)}</ul></>}
                {quest.troubleshooting.length > 0 && <><h4>If it does not count</h4><ul>{quest.troubleshooting.map((tip) => <li key={tip}>{tip}</li>)}</ul></>}
                <SourceList ids={quest.sources} />
                <p><Link href={`/quests/${quest.slug}/`}>Open this task’s guide and video timestamps →</Link></p>
              </article>
            )) : <>
              <p>We have confirmed the featured monster, but have not yet checked a complete event run and its reward handover for {game.name}. A badge name or a normal seasonal objective is insufficient to publish a claim route.</p>
              <p>Still needed: the event-specific entry point, exact completion objective, reward and any Ticket or membership requirement, plus the final claim screen.</p>
              <p><Link href="/quests/">Choose a documented task you can complete now →</Link></p>
            </>}
          </section>
          <section id="hollow-status">
            <h2>Featured monster and event identity</h2>
            <p>Roblox’s official lineup confirms {participation?.monster} from {game.name} in The Hollow.</p>
            <p>Use the task location shown above to choose between the event hub and the original game. <Link href="/games/#livestreams">View the official event schedule →</Link></p>
          </section>
          <details id="overview"><summary>Original game background</summary>
            {game.overview.map((p) => <p key={p}>{p}</p>)}
          </details>
          <AdSlot placement="content" />
          <section id="teaser-evidence">
            <h2>The Instagram teaser</h2>
            <div className="game-teaser-evidence">
              <Image
                src={teaser.image.src}
                alt={teaser.image.alt}
                width={360}
                height={640}
                sizes="150px"
              />
              <div>
                <p className="eyebrow">ROBLOX / OCTOBER 17</p>
                <blockquote>“{teaser.caption}”</blockquote>
                <p>
                  This is the visible caption on the original Roblox post. The
                  later Newsroom announcement confirms the monster; this artwork
                  does not supply a quest checklist.
                </p>
                <a
                  href={original.url}
                  className="text-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View original Instagram post <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
          </section>
          <section id="game-sources">
            <h2>Sources & verification</h2>
            <SourceList
              ids={[
                ...guideSources,
                ...(participation?.sources ?? [game.sourceId]),
                teaser.officialSourceId,
                ...teaser.reportSourceIds,
              ]}
            />
            <VerifiedDates
              verified={reviewDate ?? participation?.lastVerifiedAt ?? game.checkedAt}
              updated={reviewDate ?? participation?.updatedAt ?? game.checkedAt}
            />
          </section>
        </div>
        <aside className="game-profile-facts">
          <h2>Original game identity</h2>
          <dl>
            <dt>Publisher</dt>
            <dd>{game.creator}</dd>
            <dt>Place ID</dt>
            <dd>{game.placeId}</dd>
            <dt>Universe ID</dt>
            <dd>{game.universeId}</dd>
            <dt>Identity checked</dt>
            <dd>{formatDate(game.checkedAt)}</dd>
            <dt>Event objectives</dt>
            <dd>{guides.length ? `${guides.length} recorded task guides above` : "Full claim route pending"}</dd>
          </dl>
          <a
            href={game.robloxUrl}
            className="text-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Official Roblox page <ArrowUpRight size={14} />
          </a>
          <Link
            href="/updates/october-22-official-mechanics/"
            className="text-link"
          >
            Read the lineup review <ArrowRight size={14} />
          </Link>
        </aside>
      </div>
      <section className="section">
        <h2>Explore more games</h2>
        <div className="related-game-profiles">
          {gameProfiles
            .filter((g) => g.id !== id)
            .slice(0, 3)
            .map((g) => (
              <Link href={`/games/${g.id}/`} key={g.id}>
                <Image
                  src={g.image.src}
                  alt={g.image.alt}
                  width={g.image.width}
                  height={g.image.height}
                  sizes="(max-width: 600px) 100vw, 350px"
                />
                <span>
                  {g.name}
                  <ArrowRight size={16} />
                </span>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
