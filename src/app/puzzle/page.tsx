import Link from "next/link";
import { AdSlot, Breadcrumb, PageHead, SourceList, VerifiedDates } from "@/components/ui";
import { event, quests } from "@/lib/content";
import { metadata } from "@/lib/seo";

export const generateMetadata = () =>
  metadata(
    "The Hollow Roblox Puzzle: Floors 1–6 & QR Code Status",
    "Find The Hollow floor puzzle guides: relics, pillars, grave code, tiles, mirrors and cauldron colors. Check what is real and whether a QR reward is verified.",
    "/puzzle/",
  );

const floors = [
  ["night-one-relics", "Floor 1 · Relics & vault", "Find five purple relics, connect the vault’s purple line, then carry the revealed relic back to the elevator."],
  ["night-two-pillars", "Floor 2 · Six pillars", "Find the glowing target symbol and track which pillars rotate together. Align all six beams, pull the lever and return with the relic."],
  ["night-three-graves", "Floor 3 · Grave / coffin code", "Compare the eight lifespans. Enter the symbols of the three shortest lives, youngest to oldest; use your own graves, not a copied code."],
  ["night-four-path", "Floor 4 · Tile path", "Watch the demonstration and repeat its glowing tile sequence. Collect the relic and return; the red barrier is not a jumping challenge."],
  ["night-five-mirrors", "Floor 5 · Mirror beam", "Trace the beam from the black wall through the mirror chain. Aim the final green mirror into the skull, then return with the relic."],
  ["night-six-cauldron", "Floor 6 · Cauldron colors", "Read the cauldron’s three colors and add matching ingredients in that order. Collect the relic and take it back to the elevator."],
] as const;

export default function Puzzle() {
  return (
    <div className="container page-content puzzle-page">
      <Breadcrumb items={[{ name: "The Hollow puzzle", path: "/puzzle/" }]} />
      <PageHead eyebrow="PUZZLE GUIDE / UPDATED OCTOBER 28, 2026" title="The Hollow Puzzle & QR Code">
        Looking for a floor solution or checking a QR-code claim? The Hollow is a real Roblox event. Our reviewed maze guides cover Floors 1–6; no QR reward destination or secret-word redemption is verified in the official sources checked below.
      </PageHead>
      <nav aria-label="Puzzle briefing sections" className="game-profile-nav">
        <a href="#floor-solutions">Find my floor</a>
        <a href="#qr-code">Is the QR puzzle real?</a>
        <a href="#missing-reward">Solved it, no reward?</a>
        <a href="#clues">Original teaser clues</a>
      </nav>
      <div className="prose">
        <section id="floor-solutions">
          <h2>Which Hollow floor puzzle are you solving?</h2>
          <p>Start in the Hub cinema elevator and choose your floor. Each link opens the full route, recorded evidence and reward checks. These are reviewed gameplay guides, not our own-account playtests.</p>
          <ol className="puzzle-routes">
            {floors.map(([id, label, answer]) => {
              const quest = quests.find((item) => item.id === id && item.publishDetail);
              return quest ? (
                <li key={id}>
                  <Link href={`/quests/${quest.slug}/`}>{label} <span aria-hidden="true">→</span></Link>
                  <p>{answer}</p>
                </li>
              ) : null;
            })}
          </ol>
          <p>Looking for Animal Hospital’s eight photo pieces and sliding picture? That is a separate original-game task: <Link href="/quests/hospital-slime-puzzle/">follow the Mimic Hoodie quest</Link>. Floor 6’s cauldron is in the Hub.</p>
          <p>Floors 7–9: no reviewed solution is published here yet. Check <Link href="/quests/">the quest directory</Link> for newly documented routes.</p>
        </section>
        <AdSlot placement="header" />
        <section id="qr-code">
          <h2>Is The Hollow Roblox puzzle real? Is there a QR code?</h2>
          <p>Yes, the event is real: Roblox’s announcement links to <a href={event.hubUrl!}>The Hollow by Roblox Presents</a>, place ID 116463962153167. That does not authenticate every poster, QR image or “free Robux” puzzle using its name.</p>
          <p>We re-read the official announcement and Hub description on October 28. Neither supplies a QR reward destination, a secret-word answer or a code-entry procedure. We cannot verify a claimed QR solution from those sources. This is a limit of the checked evidence, not a claim that every QR image is fake.</p>
          <h3>Where do I enter the puzzle code?</h3>
          <p>The Floor 3 coffin uses symbols from your run’s graves inside the maze. It is not a website redeem code. <Link href="/quests/night-three-graves/">Use the lifespan ordering method</Link>. Other floors use their own objects and prompts; a video’s colors or symbols are not a universal password.</p>
          <h3>Does a QR puzzle give free Robux?</h3>
          <p>No such offer is verified by the event sources checked here. They describe event quests and avatar items. If you want an item, use the <Link href="/rewards/#reward-board">reward board and its claim steps</Link>. Do not provide your password, security code or account cookie to a supposed puzzle-verification page.</p>
          <SourceList ids={["official-newsroom-hollow", "official-hollow-hub"]} />
        </section>
        <section id="missing-reward">
          <h2>Solved the puzzle but did not get the reward?</h2>
          <ol>
            <li>Collect the revealed relic. Opening the puzzle door alone does not complete the reviewed floor routes.</li>
            <li>Carry it safely back to the elevator. Check the full guide for your floor’s final step.</li>
            <li>Check badge ownership and avatar inventory separately. A badge, a Ticket balance and an avatar item are different results.</li>
            <li>For an original-game quest, check whether it requires a manual claim or a Hub display interaction. Use the same Roblox account.</li>
          </ol>
          <p>No universal delivery fix is verified. See <Link href="/rewards/#tickets">Ticket credit and claim guidance</Link> before repeating a completed task. The website’s <Link href="/progress/">progress checklist</Link> only saves your notes; it does not claim items.</p>
        </section>
        <AdSlot placement="content" />
        <section id="clues">
          <h2>What were the original nine-name clues?</h2>
          <p>Before launch, Roblox’s X teaser showed nine numbered redacted entries. We read that post on October 21. It did not spell out a secret-word solution. The <Link href="/updates/official-instagram-teasers-located/">original Instagram teaser review</Link> records the promotional artwork; the <Link href="/games/">games directory</Link> now separates confirmed monster origins from game quests.</p>
          <p>The teaser is historical context. For the playable maze puzzles, use the floor routes above.</p>
          <SourceList ids={["official-x-nine-names", "official-instagram"]} />
        </section>
        <section id="next">
          <h2>What should I do next?</h2>
          <p><a href={event.hubUrl!}>Open the official Hollow Hub</a>, choose a floor, and keep its written guide beside the game. For the finale and reward cutoff, check the <Link href="/release-date/">event schedule</Link>.</p>
        </section>
        <VerifiedDates verified="2026-10-28" updated="2026-10-28" />
      </div>
    </div>
  );
}
