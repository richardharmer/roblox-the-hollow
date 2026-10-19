import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { gameProfiles, teasers, sources, formatDate } from "@/lib/content";
import { Breadcrumb, SourceList, Status, VerifiedDates } from "./ui";

export function GameProfile({ id }: { id: string }) {
  const game = gameProfiles.find((g) => g.id === id);
  const teaser = teasers.find((t) => t.id === id);
  if (!game || !teaser) notFound();
  const original = sources.find((s) => s.id === teaser.officialSourceId)!;
  return (
    <div className="container page-content">
      <Breadcrumb
        items={[
          { name: "Games", path: "/games/" },
          { name: game.name, path: `/games/${id}/` },
        ]}
      />
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
          <p>{game.summary}</p>
          <p className="game-publisher">By {game.creator}</p>
          <div className="game-participation">
            <Status level="REPORTED" />
            <span>The Hollow participation</span>
          </div>
          <a
            className="button primary"
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
        <a href="#overview">Overview</a>
        <a href="#hollow-status">Hollow status</a>
        <a href="#teaser-evidence">Teaser evidence</a>
        <a href="#game-sources">Sources</a>
      </nav>
      <div className="game-profile-content">
        <div className="prose">
          <section id="overview">
            <h2>About {game.name}</h2>
            {game.overview.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>
          <section id="hollow-status">
            <h2>Is {game.name} in The Hollow?</h2>
            <p>{game.eventNote}</p>
            <div className="callout">
              <strong>Current answer: reported participation.</strong>
              <p>
                The original game identity is verified. Its participation in The
                Hollow has not yet been independently confirmed against an
                explicit game announcement.
              </p>
            </div>
            <h3>Tasks, badges and rewards</h3>
            <p>
              No event-specific instructions are verified for {game.name} yet.
              Its normal objectives and seasonal updates should not be treated
              as The Hollow requirements. We will add a sourced walkthrough when
              the game’s actual event tasks and reward conditions can be
              checked.
            </p>
            <p>
              <Link href="/release-date/">Check the event date briefing</Link> ·{" "}
              <Link href="/rewards/">View documented rewards</Link>
            </p>
          </section>
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
                  game association follows the reported lineup; the artwork does
                  not supply a quest checklist.
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
                game.sourceId,
                teaser.officialSourceId,
                ...teaser.reportSourceIds,
              ]}
            />
            <VerifiedDates verified={game.checkedAt} updated={game.checkedAt} />
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
            <dd>Awaiting verification</dd>
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
            href="/updates/official-instagram-teasers-located/"
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
