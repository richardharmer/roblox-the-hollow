import Link from "next/link";
import { SocialBarTrial } from "@/components/advertisement";
import {
  AdSlot,
  Breadcrumb,
  PageHead,
  SourceList,
  VerifiedDates,
} from "@/components/ui";
import { metadata } from "@/lib/seo";

export const generateMetadata = () =>
  metadata(
    "The Hollow Puzzle & QR Code — Verified Clues | The Hollow Guide",
    "Read Roblox’s nine-name teaser clues for The Hollow. Check what is verified, why no secret word or QR-code solution is confirmed here, and where to follow updates.",
    "/puzzle/",
  );

export default function Puzzle() {
  return (
    <div className="container page-content">
      <SocialBarTrial />
      <Breadcrumb items={[{ name: "The Hollow puzzle", path: "/puzzle/" }]} />
      <PageHead
        eyebrow="TEASER EVIDENCE / OCTOBER 22, 2026"
        title="The Hollow Puzzle & QR Code"
      >
        Roblox has published a nine-name teaser. We have not verified a secret
        word, a QR-code destination or a reward for solving it.
      </PageHead>
      <AdSlot placement="header" />
      <div className="prose">
        <nav aria-label="Puzzle briefing sections" className="game-profile-nav">
          <a href="#clues">Verified clues</a>
          <a href="#qr-code">QR-code status</a>
          <a href="#next">What to do next</a>
        </nav>
        <section id="clues">
          <h2>What does the official puzzle post actually show?</h2>
          <p>
            Roblox’s verified X account posted “nine names. nine nights.”
            followed by nine numbered redacted entries. The same post names The
            Hollow and October 22. We directly read that post on October 21,
            2026.
          </p>
          <p>
            The blacked-out entries are visible clues, but the post does not
            spell out their answers. Counting blocks or matching characters to
            games is an interpretation until Roblox publishes the mapping. In
            particular, “nine nights” does not give us nine dated unlocks or an
            event end date.
          </p>
          <SourceList ids={["official-x-nine-names"]} />
          <h3>How do the Instagram characters fit in?</h3>
          <p>
            Our{" "}
            <Link href="/updates/official-instagram-teasers-located/">
              October 19 source review
            </Link>{" "}
            links to nine original Roblox Instagram teasers. Their artwork is
            primary promotional material. The game associations in the{" "}
            <Link href="/games/">games directory</Link> are now confirmed by the
            October 21 Newsroom announcement. The covers do not establish puzzle
            answers, quest steps or item unlock requirements.
          </p>
        </section>
        <AdSlot placement="native" />
        <section id="qr-code">
          <h2>Is there a verified Hollow QR code or secret word?</h2>
          <p>
            Not in the evidence we have verified. The original date post and the
            nine-name text do not document a QR-code destination, password entry
            screen or redemption process. This is a limit of our current source
            record, not proof that Roblox cannot publish another clue later.
          </p>
          <p>
            A claimed code needs an original Roblox or developer source, a
            destination that matches that source, and an explanation of what it
            does. A reposted screenshot without its original link cannot
            establish those details. We will publish a solution only when the
            steps and outcome can be checked.
          </p>
        </section>
        <AdSlot placement="content" />
        <section id="next">
          <h2>What should I do before the event opens?</h2>
          <ol>
            <li>
              Check the <Link href="/release-date/">release-date briefing</Link>
              . Public access opens October 22 at 2 p.m. PDT.
            </li>
            <li>
              Use the official source links below to compare a clue with the
              original text. Keep a character theory separate from an announced
              game.
            </li>
            <li>
              Open the <Link href="/quests/">quest directory</Link> for verified
              tasks and the <Link href="/rewards/">reward directory</Link> for
              documented unlock conditions when available.
            </li>
          </ol>
          <p>
            A fan guide’s checklist records your own progress; it does not claim
            Roblox items. Do not submit your Roblox password or account access
            to a supposed puzzle or reward page.
          </p>
        </section>
        <h2>Sources and review record</h2>
        <SourceList
          ids={[
            "official-x-date-teaser",
            "official-x-nine-names",
            "official-instagram",
            "official-newsroom-hollow",
          ]}
        />
        <VerifiedDates verified="2026-10-22" updated="2026-10-22" />
        <p>
          <Link href="/updates/october-21-official-date-verified/">
            Read the October 21 verification update
          </Link>
        </p>
      </div>
    </div>
  );
}
