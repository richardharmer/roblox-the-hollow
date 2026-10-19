import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { sources, teasers } from "@/lib/content";
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
}: {
  featured?: boolean;
  showNotesLink?: boolean;
}) {
  const entries = featured ? [teasers[0], teasers[5], teasers[7]] : teasers;
  return (
    <div className="teaser-feature">
      <p className="teaser-intro">
        Official Roblox artwork. Reported game associations. Open a card to
        inspect the original October 17 Instagram post.
      </p>
      <div className={`teaser-grid${featured ? " teaser-grid-featured" : ""}`}>
        {entries.map((t) => {
          const source = sources.find((s) => s.id === t.officialSourceId)!;
          return (
            <article className="teaser-card" key={t.id}>
              <a
                className="teaser-image-link"
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View original Roblox Instagram teaser: ${t.gameName} (reported association)`}
              >
                <Image
                  src={t.image.src}
                  alt={t.image.alt}
                  width={t.image.width}
                  height={t.image.height}
                  sizes="(max-width: 600px) 90vw, (max-width: 800px) 45vw, 380px"
                />
                <span className="teaser-image-caption">
                  VIEW ORIGINAL <ArrowUpRight size={16} />
                </span>
              </a>
              <div className="teaser-card-body">
                <Status level={t.verificationLevel} />
                <h3>{t.gameName}</h3>
                <p className="teaser-quote">“{t.caption}”</p>
                <span className="teaser-credit">{t.image.credit} · Oct 17</span>
              </div>
            </article>
          );
        })}
      </div>
      <div className="teaser-footnote">
        <p>
          Promotional covers, not gameplay. Game labels follow the reported
          lineup; participation, quests and rewards still await explicit
          verification.
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
