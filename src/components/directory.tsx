"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  collections,
  games,
  event,
  gameProfiles,
  type Collection,
} from "@/lib/content";
import { Status, EmptyState } from "./ui";
import { TeaserGallery } from "./teasers";
export function Directory({ kind }: { kind: Collection }) {
  const [search, setSearch] = useState("");
  const [game, setGame] = useState("");
  const [status, setStatus] = useState("");
  const [claimGuide, setClaimGuide] = useState("");
  const [free, setFree] = useState(false);
  const entries = collections[kind];
  const filtered = entries.filter(
    (x) =>
      `${x.name} ${"badgeId" in x ? x.badgeId : ""} ${"universeId" in x ? x.universeId : ""}`.toLowerCase().includes(search.toLowerCase()) &&
      (!game || ("gameId" in x && x.gameId === game)) &&
      (!status || x.verificationLevel === status) &&
      (!claimGuide || ("claimInstructionsEvidence" in x && (claimGuide === "reported" ? x.claimInstructionsEvidence === "REPORTED" : x.claimInstructionsEvidence !== "REPORTED"))) &&
      (!free || ("free" in x && x.free === true)),
  );
  if (kind === "games" && gameProfiles.length) {
    const profiles = gameProfiles.filter(
      (g) =>
        g.name.toLowerCase().includes(search.toLowerCase()) &&
        (!status ||
          (games.find((entry) => entry.id === g.id)?.verificationLevel ??
            "REPORTED") === status),
    );
    return (
      <section id="reported-teasers">
        <div className="filter-bar">
          <div className="field">
            <label htmlFor="directory-search">Search games</label>
            <input
              id="directory-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find a game…"
            />
          </div>
          <div className="field">
            <label htmlFor="status-filter">Evidence</label>
            <select
              id="status-filter"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All evidence levels</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="REPORTED">Reported</option>
            </select>
          </div>
        </div>
        <p className="results-count" role="status">
          {profiles.length} of {gameProfiles.length} game profiles · 9 confirmed
          Hollow monster origin games
        </p>
        {profiles.length ? (
          <TeaserGallery ids={profiles.map((p) => p.id)} />
        ) : (
          <div className="empty-search">
            <h3>No matching games</h3>
            <p>
              {status === "CONFIRMED"
                ? "No confirmed games match this search."
                : "Try a shorter search or clear your filters."}
            </p>
            <button
              className="button"
              onClick={() => {
                setSearch("");
                setStatus("");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    );
  }
  return (
    <>
      <div className="filter-bar">
        <div className="field">
          <label htmlFor="directory-search">Search {kind}</label>
          <input
            id="directory-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Find a ${kind === "quests" ? "quest" : kind === "rewards" ? "reward" : kind === "badges" ? "badge" : "game"}…`}
          />
        </div>
        {kind !== "games" && (
          <div className="field">
            <label htmlFor="game-filter">Game</label>
            <select
              id="game-filter"
              value={game}
              onChange={(e) => setGame(e.target.value)}
            >
              <option value="">All games</option>
              <option value={event.id}>
                The Hollow hub & cross-game tasks
              </option>
              {games.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="field">
          <label htmlFor="status-filter">Evidence</label>
          <select
            id="status-filter"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All evidence levels</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="REPORTED">Reported</option>
          </select>
        </div>
        {kind === "badges" && (
          <div className="field">
            <label htmlFor="claim-filter">Claim guide</label>
            <select id="claim-filter" value={claimGuide} onChange={(e) => setClaimGuide(e.target.value)}>
              <option value="">All badges</option>
              <option value="reported">Reported guide available</option>
              <option value="unverified">Claim steps unverified</option>
            </select>
          </div>
        )}
        {kind === "rewards" && (
          <label className="check-label">
            <input
              type="checkbox"
              checked={free}
              onChange={(e) => setFree(e.target.checked)}
            />
            Free only
          </label>
        )}
      </div>
      <p className="results-count" role="status">
        {entries.length
          ? `${filtered.length} of ${entries.length} published ${kind}`
          : `Detailed ${kind} records · Announcements and partial guides are above`}
      </p>
      {entries.length === 0 ? (
        <EmptyState
          title={`The ${kind === "games" ? "game lineup" : kind === "quests" ? "quest list" : kind === "rewards" ? "reward catalog" : "badge list"} is awaiting verification.`}
        >
          Sourced announcements and partial guidance appear above. This
          searchable catalog requires complete record details, including the
          relevant IDs or documented completion requirements.
        </EmptyState>
      ) : filtered.length === 0 ? (
        <div className="empty-search">
          <h3>No matching {kind}</h3>
          <p>Try a shorter search or clear your filters.</p>
          <button
            className="button"
            onClick={() => {
              setSearch("");
              setGame("");
              setStatus("");
              setClaimGuide("");
              setFree(false);
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="entry-list">
          {filtered.map((x) => (
            <article key={x.id} className="entry-card">
              {x.image && (
                <img
                  src={x.image.url}
                  alt={x.image.alt}
                  width="80"
                  height="80"
                  loading="lazy"
                />
              )}
              <div>
                <Status level={x.verificationLevel} />
                <h3>
                  {x.publishDetail ? (
                    <Link href={`/${kind}/${x.slug}/`}>{x.name}</Link>
                  ) : (
                    x.name
                  )}
                </h3>
                <p>{x.description}</p>
                {"badgeId" in x && (
                  <>
                    <p>Badge ID: {x.badgeId} · Universe ID: {x.universeId ?? "Not recorded"}</p>
                    <p>API enabled: {x.enabled === undefined ? "Unknown" : x.enabled ? "Yes" : "No"} · Checked {x.lastVerifiedAt}</p>
                    <p>Claim instructions: {x.claimInstructionsEvidence === "REPORTED" ? "Reported — separate video-based reward guide" : "Unverified — no complete claim instructions"}</p>
                    {x.relatedRewardSlug && <Link className="text-link" href={`/rewards/${x.relatedRewardSlug}/`}>Read the reported reward guide →</Link>}
                  </>
                )}
                {"availability" in x && (
                  <p>
                    {x.costLabel ??
                      (x.free === true
                        ? "Free"
                        : x.free === false
                          ? "Paid"
                          : "Price unverified")}{" "}
                    ·{" "}
                    {x.availability === "UNAVAILABLE"
                      ? "No Longer Available"
                      : x.availability === "AVAILABLE"
                        ? "Available"
                        : "Availability unverified"}
                  </p>
                )}
                <div className="entry-actions">
                  {x.publishDetail && (
                    <Link className="text-link" href={`/${kind}/${x.slug}/`}>
                      Read guide <ArrowUpRight size={14} />
                    </Link>
                  )}
                  {"robloxUrl" in x && (
                    <a
                      className="text-link"
                      href={x.robloxUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on Roblox <ArrowUpRight size={14} />
                    </a>
                  )}
                  <Link className="text-link" href="/progress/">
                    Track progress
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
