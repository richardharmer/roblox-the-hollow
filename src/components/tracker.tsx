"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, Upload, RotateCcw } from "lucide-react";
import { games, quests, rewards } from "@/lib/content";
import {
  emptyProgress,
  parseProgress,
  percentage,
  STORAGE_KEY,
  type Progress,
} from "@/lib/tracker";
import { EmptyState } from "./ui";
export function Tracker() {
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [game, setGame] = useState("");
  const [incomplete, setIncomplete] = useState(false);
  const [free, setFree] = useState(false);
  const [reset, setReset] = useState(false);
  // Hydrate browser-only storage once after the identical server/client first render.
  /* eslint-disable react-hooks/set-state-in-effect -- Hydrating persisted browser state after SSR. */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProgress(parseProgress(JSON.parse(raw)));
    } catch {
      setNotice(
        "Saved progress could not be read. It has not been overwritten. Import a valid backup or reset to start again.",
      );
    }
    setReady(true);
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setProgress(parseProgress(JSON.parse(e.newValue)));
        } catch {
          setNotice("A progress update in another tab could not be read.");
        }
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */
  function save(next: Progress) {
    setProgress(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setNotice("Progress saved on this device.");
    } catch {
      setNotice(
        "Browser storage is unavailable. Export a backup before closing this page.",
      );
    }
  }
  const items = [
    ...quests.map((q) => ({
      id: "quest:" + q.id,
      name: q.name,
      gameId: q.gameId,
      free: null,
      href: q.publishDetail ? `/quests/${q.slug}/` : "/quests/",
      type: "Quest",
    })),
    ...rewards.map((r) => ({
      id: "reward:" + r.id,
      name: r.name,
      gameId: r.gameId,
      free: r.free,
      href: r.publishDetail ? `/rewards/${r.slug}/` : "/rewards/",
      type: "Reward",
    })),
  ];
  const pct = percentage(
    progress.completed,
    items.map((x) => x.id),
  );
  const count = items.filter((x) => progress.completed.includes(x.id)).length;
  const visible = items.filter(
    (x) =>
      (!game || x.gameId === game) &&
      (!incomplete || !progress.completed.includes(x.id)) &&
      (!free || x.free === true) &&
      x.name.toLowerCase().includes(search.toLowerCase()),
  );
  function download() {
    const blob = new Blob([JSON.stringify(progress, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-hollow-progress.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  async function upload(file: File | undefined) {
    if (!file) return;
    try {
      if (file.size > 250000) throw new Error();
      const imported = parseProgress(JSON.parse(await file.text()));
      save({
        ...progress,
        completed: [...new Set([...progress.completed, ...imported.completed])],
      });
      setNotice("Backup imported and merged with your progress.");
    } catch {
      setNotice(
        "Import failed. Choose a valid Hollow progress JSON backup under 250 KB. Your current progress is unchanged.",
      );
    }
  }
  return (
    <>
      <div className="tracker-summary">
        <div className="progress-total">
          {pct === null ? "—" : `${pct}%`}
          <small>
            {pct === null
              ? "Awaiting verified tasks"
              : `${count} / ${items.length} completed`}
          </small>
        </div>
        <div>
          <h2>
            {items.length
              ? "Your journey, at a glance"
              : "Your checklist is ready. The tasks aren’t yet."}
          </h2>
          <p>
            Progress is saved locally on this device. No account or Roblox
            connection is required.
          </p>
          <div
            className="progress-track"
            role="progressbar"
            aria-label="Overall progress"
            aria-valuenow={pct ?? 0}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuetext={
              pct === null
                ? "No verified tasks yet"
                : `${count} of ${items.length} completed`
            }
          >
            <span style={{ width: `${pct ?? 0}%` }} />
          </div>
        </div>
      </div>
      <div className="filter-bar">
        <div className="field">
          <label htmlFor="progress-search">Search your checklist</label>
          <input
            id="progress-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Quest or reward name"
          />
        </div>
        <div className="field">
          <label htmlFor="progress-game">Game</label>
          <select
            id="progress-game"
            value={game}
            onChange={(e) => setGame(e.target.value)}
          >
            <option value="">All games</option>
            <option value="the-hollow-2026">
              The Hollow hub & cross-game tasks
            </option>
            {games.map((g) => (
              <option value={g.id} key={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
        <label className="check-label">
          <input
            type="checkbox"
            checked={incomplete}
            onChange={(e) => setIncomplete(e.target.checked)}
          />
          Incomplete only
        </label>
        <label className="check-label">
          <input
            type="checkbox"
            checked={free}
            onChange={(e) => setFree(e.target.checked)}
          />
          Free rewards only
        </label>
      </div>
      {!items.length ? (
        <EmptyState title="Nothing to check off just yet.">
          Verified quests and rewards will automatically appear here. There are
          no placeholder tasks, and no completion total until the checklist
          contains real items.
        </EmptyState>
      ) : (
        <div className="entry-list">
          {visible.map((x) => (
            <div className="entry-card" key={x.id}>
              <label className="check-label">
                <input
                  disabled={!ready}
                  type="checkbox"
                  aria-label={`Mark ${x.name} complete`}
                  checked={progress.completed.includes(x.id)}
                  onChange={() =>
                    save({
                      ...progress,
                      completed: progress.completed.includes(x.id)
                        ? progress.completed.filter((id) => id !== x.id)
                        : [...progress.completed, x.id],
                    })
                  }
                />
              </label>
              <div>
                <span className="eyebrow">
                  {x.type} · {games.find((g) => g.id === x.gameId)?.name}
                </span>
                <h3>
                  <Link href={x.href}>{x.name}</Link>
                </h3>
              </div>
            </div>
          ))}
          {!visible.length && (
            <p className="empty-search">No items match these filters.</p>
          )}
        </div>
      )}
      <div className="tool-actions">
        <button className="button" disabled={!ready} onClick={download}>
          <Download size={16} />
          Export JSON
        </button>
        <label className="button import-label">
          <Upload size={16} />
          Import JSON
          <input
            className="sr-only"
            type="file"
            accept=".json,application/json"
            aria-label="Import progress JSON"
            disabled={!ready}
            onChange={(e) => {
              void upload(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>
        <button
          className="button"
          disabled={!ready}
          onClick={() => setReset(true)}
        >
          <RotateCcw size={15} />
          Reset progress
        </button>
      </div>
      {reset && (
        <div className="notice">
          <p>
            Clear all saved completion marks? Export a backup first if you want
            to keep them.
          </p>
          <div className="tool-actions">
            <button
              className="button primary"
              onClick={() => {
                save(emptyProgress());
                setReset(false);
              }}
            >
              Yes, reset progress
            </button>
            <button className="button" onClick={() => setReset(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
      <p role="status" aria-live="polite" className={notice ? "notice" : ""}>
        {notice}
      </p>
      {games.length > 0 && (
        <section className="section">
          <h2>Progress by game</h2>
          {[
            {
              id: "the-hollow-2026",
              name: "The Hollow hub & cross-game tasks",
            },
            ...games,
          ].map((g) => {
            const subset = items.filter((x) => x.gameId === g.id);
            return (
              <div className="group-summary" key={g.id}>
                <span>{g.name}</span>
                <span>
                  {
                    subset.filter((x) => progress.completed.includes(x.id))
                      .length
                  }{" "}
                  / {subset.length} completed
                </span>
              </div>
            );
          })}
        </section>
      )}
      <div className="prose">
        <h2>Keep a backup of your journey</h2>
        <p>
          Clearing browser data removes local progress. Export a JSON backup
          before changing browsers or devices. Import merges completion marks
          instead of replacing existing ones. Renamed quests retain stable IDs,
          and older backup formats are migrated when supported.
        </p>
        <p>
          This is a personal checklist. Checking an item does not claim a Roblox
          reward or verify that your Roblox account owns it.
        </p>
      </div>
    </>
  );
}
