import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { gameProfiles, sources, teasers } from "@/lib/content";
import { Status } from "./ui";

export function TeaserMosaic() {
  return (
    <div className="teaser-mosaic" aria-hidden="true">
      {teasers.map((t, i) => (
        <Image
          key={t.id}
          src={t.image.src}
          alt=""
          width={360}
          height={640}
          sizes="(max-width: 600px) 33vw, 220px"
          preload={i < 3}
        />
      ))}
    </div>
  );
}

export function TeaserGallery({
  featured = false,
  showNotesLink = true,
  artwork = false,
  ids,
}: {
  featured?: boolean;
  showNotesLink?: boolean;
  artwork?: boolean;
  ids?: string[];
}) {
  const entries = ids
    ? teasers.filter((t) => ids.includes(t.id))
    : featured
      ? [teasers[0], teasers[5], teasers[7]]
      : teasers;
  return (
    <div className="teaser-feature">
      <p className="teaser-intro">
        {artwork
          ? "Official October 17 teaser artwork. Open a game profile for the event status; original posts are linked separately."
          : "Original game covers from Roblox. Open a game profile for its overview, official game link and reported Hollow status."}
      </p>
      <div
        className={`teaser-grid${featured ? " teaser-grid-featured" : ""}${artwork ? " teaser-grid-artwork" : ""}`}
      >
        {entries.map((t) => {
          const source = sources.find((s) => s.id === t.officialSourceId)!;
          const profile = gameProfiles.find((p) => p.id === t.id)!;
          const cover = artwork ? t.image : profile.image;
          return (
            <article className="teaser-card" key={t.id}>
              <Link
                className="teaser-image-link"
                href={`/games/${t.id}/`}
                aria-label={`View ${t.gameName} game profile`}
              >
                <Image
                  src={cover.src}
                  alt={cover.alt}
                  width={cover.width}
                  height={cover.height}
                  sizes="(max-width: 600px) 90vw, (max-width: 800px) 45vw, 380px"
                />
                <span className="teaser-image-caption">
                  VIEW GAME PROFILE <ArrowRight size={16} />
                </span>
              </Link>
              <div className="teaser-card-body">
                <Status level={t.verificationLevel} />
                <h3>
                  <Link href={`/games/${t.id}/`}>{t.gameName}</Link>
                </h3>
                <p className="teaser-quote">
                  {artwork ? `“${t.caption}”` : profile.summary}
                </p>
                <span className="teaser-credit">{cover.credit}</span>
                <a
                  className="teaser-source-link"
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram evidence <ArrowUpRight size={13} />
                </a>
              </div>
            </article>
          );
        })}
      </div>
      <div className="teaser-footnote">
        <p>
          Game identity is verified separately from event participation. Hollow
          tasks and rewards remain pending; each profile explains the current
          evidence.
        </p>
        {showNotesLink && (
          <Link
            href="/updates/official-instagram-teasers-located/"
            className="text-link"
          >
            Read the verification notes <ArrowUpRight size={15} />
          </Link>
        )}
      </div>
    </div>
  );
}
