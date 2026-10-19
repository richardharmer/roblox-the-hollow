import Link from "next/link";
import { notFound } from "next/navigation";
import {
  collections,
  games,
  quests,
  rewards,
  badges,
  updates,
  origin,
  type Collection,
} from "@/lib/content";
import { Breadcrumb, PageHead, Status, SourceList, VerifiedDates } from "./ui";
import { jsonLd } from "@/lib/seo";
import { TeaserGallery } from "./teasers";
export function Detail({
  kind,
  slug,
}: {
  kind: Collection | "updates";
  slug: string;
}) {
  if (kind === "updates") {
    const u = updates.find((x) => x.slug === slug && x.publishDetail);
    if (!u) notFound();
    return (
      <div className="container page-content">
        <Breadcrumb
          items={[
            { name: "Updates", path: "/updates/" },
            { name: u.title, path: `/updates/${slug}/` },
          ]}
        />
        <PageHead eyebrow="EDITORIAL FIELD NOTES" title={u.title}>
          {u.summary}
        </PageHead>
        <div className="prose">
          <Status level={u.verificationLevel} />
          {u.body.map((p, i) => (
            <p key={i} style={{ marginTop: 24 }}>
              {p}
            </p>
          ))}
          {u.slug === "official-instagram-teasers-located" && (
            <TeaserGallery showNotesLink={false} />
          )}
          <h2>Sources</h2>
          <SourceList ids={u.sources} />
          <VerifiedDates verified={u.lastVerifiedAt} updated={u.updatedAt} />
          <Link href="/updates/">All updates</Link> ·{" "}
          <Link href="/games/">Games directory</Link>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: u.title,
              description: u.summary,
              datePublished: u.publishedAt,
              dateModified: u.updatedAt,
              author: {
                "@type": "Organization",
                name: "The Hollow Guide editorial team",
                url: origin + "/about/",
              },
              mainEntityOfPage: origin + `/updates/${slug}/`,
            }),
          }}
        />
      </div>
    );
  }
  const entry = collections[kind].find(
    (x) => x.slug === slug && x.publishDetail,
  );
  if (!entry) notFound();
  const game =
    "gameId" in entry ? games.find((g) => g.id === entry.gameId) : entry;
  return (
    <div className="container page-content">
      <Breadcrumb
        items={[
          { name: kind, path: `/${kind}/` },
          { name: entry.name, path: `/${kind}/${slug}/` },
        ]}
      />
      <PageHead
        eyebrow={`${kind.toUpperCase()} / THE HOLLOW 2026`}
        title={entry.name}
      >
        {entry.description}
      </PageHead>
      <div className="prose">
        <Status level={entry.verificationLevel} />
        {"participationStatus" in entry && (
          <div className="callout">
            <strong>Is this game part of The Hollow?</strong>
            <p>
              {entry.participationStatus === "CONFIRMED"
                ? "Yes. Participation is confirmed by the sources below."
                : "Participation has not been confirmed."}
            </p>
            <a href={entry.robloxUrl}>Official Roblox game link</a>
          </div>
        )}
        {"free" in entry && (
          <div className="callout">
            <p>
              Cost:{" "}
              {entry.free === true
                ? "Free"
                : entry.free === false
                  ? "Paid"
                  : "Not verified"}
            </p>
            <p>
              Availability:{" "}
              {entry.availability === "UNAVAILABLE"
                ? "No Longer Available"
                : entry.availability === "AVAILABLE"
                  ? "Available"
                  : "Not verified"}
            </p>
          </div>
        )}
        {"badgeId" in entry && (
          <p>
            <a href={entry.robloxUrl}>Official Roblox badge</a> · Badge ID:{" "}
            {entry.badgeId}
          </p>
        )}
        {"prerequisites" in entry && entry.prerequisites.length > 0 && (
          <>
            <h2>Prerequisites</h2>
            <ul>
              {entry.prerequisites.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </>
        )}
        {"requirements" in entry && (
          <>
            <h2>Unlock requirements</h2>
            <ul>
              {entry.requirements.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </>
        )}
        {("steps" in entry || "walkthrough" in entry) && (
          <>
            <h2>Step-by-step walkthrough</h2>
            <ol className="step-list">
              {("steps" in entry
                ? entry.steps
                : "walkthrough" in entry
                  ? entry.walkthrough
                  : []
              ).map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ol>
          </>
        )}
        {"troubleshooting" in entry && entry.troubleshooting.length > 0 && (
          <>
            <h2>Troubleshooting</h2>
            <ul>
              {entry.troubleshooting.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </>
        )}
        {"tips" in entry && entry.tips.length > 0 && (
          <>
            <h2>Helpful tips</h2>
            <ul>
              {entry.tips.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </>
        )}
        {game && (
          <>
            <h2>Related game & checklist</h2>
            <p>
              <Link
                href={game.publishDetail ? `/games/${game.slug}/` : "/games/"}
              >
                {game.name}
              </Link>{" "}
              · <Link href="/progress/">Track in My Hollow Progress</Link>
            </p>
            {(
              [
                ["quests", quests],
                ["rewards", rewards],
                ["badges", badges],
              ] as const
            ).map(([type, items]) => {
              const related = items.filter(
                (x) => x.gameId === game.id && x.id !== entry.id,
              );
              return (
                related.length > 0 && (
                  <section key={type}>
                    <h3>Related {type}</h3>
                    <ul>
                      {related.map((x) => (
                        <li key={x.id}>
                          <Link
                            href={
                              x.publishDetail
                                ? `/${type}/${x.slug}/`
                                : `/${type}/`
                            }
                          >
                            {x.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                )
              );
            })}
          </>
        )}
        <h2>Sources</h2>
        <SourceList ids={entry.sources} />
        <VerifiedDates
          verified={entry.lastVerifiedAt}
          updated={entry.updatedAt}
        />
        <Link href={`/${kind}/`}>Browse all {kind}</Link>
      </div>
    </div>
  );
}
