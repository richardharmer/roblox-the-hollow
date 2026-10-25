import Link from "next/link";
import { rewards, hollowBadges } from "@/lib/content";
import { SourceList, Status } from "./ui";

export function RewardIssueNotice() {
  return (
    <aside className="prose callout" aria-labelledby="reward-issue-title">
      <Status level="REPORTED" />
      <h2 id="reward-issue-title">The Hollow Tickets not showing?</h2>
      <p>
        Update October 25, 2026 (Beijing): a forum responder reports a fix,
        and the original reporter says the issue appears resolved. Check your
        own Ticket balance and avatar inventory; recovery for every account
        and every item has not been independently verified.
      </p>
      <Link className="text-link" href="#reward-troubleshooting">
        Check your reward status and read the player reports →
      </Link>
    </aside>
  );
}

export function RewardBoard({ compact = false }: { compact?: boolean }) {
  return (
    <section
      className="player-board"
      id="reward-board"
      aria-labelledby="reward-board-title"
    >
      <div className="player-board-heading">
        <div>
          <span className="eyebrow">NIGHT 3 · CHECKED OCT 25</span>
          <h2 id="reward-board-title">What can you earn today?</h2>
        </div>
        <Link className="text-link" href="/progress/">
          Save your progress →
        </Link>
      </div>
      <p>
        Night 3 guides cover Festering Felix, Dead Rails Cowboy Hat of the Dead and Demonology Biter Fedora, including the separate hub claim steps. Burned Necrobloxicon has a recorded 60-Ticket shop claim. Trick or Treat Tentacles costs another 60 Tickets and requires Roblox Plus. Earned rewards and the separately labeled Plus-only shop items are documented below. Read the requirements here,
        then follow the written claim guide.
      </p>
      <p>Haunted Harvest Crown: the video announces a 20-Ticket daily shop item, but does not demonstrate a completed purchase or establish membership eligibility. Current claim availability remains unverified; check the shop’s actual requirements before spending. <Link href="/badges/">Check all {hollowBadges.length} official Hub badge IDs →</Link></p>
      <div className="player-reward-list">
        {rewards.map((reward) => (
          <article key={reward.id} className="player-reward-row">
            <div>
              <span className="eyebrow">
                {reward.free ? "EARN IN GAME" : "PLUS REQUIRED"}
              </span>
              <h3>
                <Link href={`/rewards/${reward.slug}/`}>{reward.name}</Link>
              </h3>
            </div>
            <p>
              {reward.costLabel}
              <br />
              <span>
                {reward.id === "witches-brew-nado"
                  ? "Floor 2 → six pillars → relic → elevator"
                  : reward.id === "reeling-petal-garland"
                    ? "Dandy’s World: 200 pumpkins → hub claim"
                    : reward.id === "fuwatty-side-satchel"
                      ? "AO ONI: 50 pumpkins → Floor 2 claim"
                      : reward.id === "lord-umberhallow-bloxikin"
                  ? "5 relics → vault puzzle → elevator"
                  : reward.id === "all-seeking-antlers"
                    ? "DOORS: 50 doors in 20 minutes"
                    : reward.id === "the-beasthammer"
                      ? "Bank 100 candies + escape as survivor"
                      : "Cinema → right counter → Avatar Items"}
              </span>
            </p>
            <Link className="button" href={`/rewards/${reward.slug}/`}>
              How to claim →
            </Link>
          </article>
        ))}
      </div>
      <p className="player-evidence">
        Steps checked against October 23–24 creator recordings; official APIs
        verify the cited identities. We have not claimed these on a test
        account. Early-server credit can vary.
      </p>
      {compact && (
        <nav className="player-jumps" aria-label="Player help">
          <Link href="/rewards/#tickets">Get & spend Tickets</Link>
          <Link href="/rewards/#codes">Working codes?</Link>
          <Link href="/rewards/#launcher-ghosts">4 launcher ghosts: who to find</Link>
          <Link href="/quests/">Task walkthroughs</Link>
          <Link href="/quests/sell-lemons-sticker-packs/">New: Sell Lemons sticker-pack task</Link>
        </nav>
      )}
    </section>
  );
}

export function TicketsGuide() {
  return (
    <section className="prose player-guide" id="tickets">
      <h2>How to get Tickets and redeem them</h2>
      <p>
        <strong>
          Complete event tasks → return to the hub → Confirm → spend Tickets at
          the cinema shop.
        </strong>{" "}
        Payouts differ: the reviewed game menu shows both 10 and 20 Tickets. Do
        not assume every badge pays 20, or that repeating a completed badge pays
        again.
      </p>
      <ol className="step-list">
        <li>
          Open the cinema concession shop and choose{" "}
          <strong>Visit Games</strong>. Select a participating experience and
          complete its event objective, rather than an unrelated everyday badge.
        </li>
        <li>
          Return to The Hollow using the same account. Select{" "}
          <strong>Confirm</strong> when the new-badge credit prompt appears and
          check your Ticket balance.
        </li>
        <li>
          Inside the cinema, go to the counter on the right and open the shop.
          Choose <strong>Avatar Items</strong> for inventory cosmetics; the
          other shop section contains in-game gear.
        </li>
        <li>
          Gourdlord costs <strong>100 Tickets</strong>. Quack-o’-Lantern costs{" "}
          <strong>20 Tickets plus Roblox Plus eligibility</strong>. Select the
          item and buy with Tickets; look for <strong>OWNED</strong>, then check
          Roblox inventory.
        </li>
      </ol>
      <p>
        <strong>Budget before spending:</strong> five different 20-Ticket tasks
        total 100; a mix of 10- and 20-Ticket tasks can require more. The
        recording shows Tickets being deducted, so spending on gear reduces what
        you have left for avatar items.
      </p>
      <div className="callout">
        <h3>A straightforward first Tickets task</h3>
        <p>
          In <strong>Clean all the Leaves</strong>, select{" "}
          <strong>Chapter 3 → Halloween Haunted Mansion</strong>, set max
          players to <strong>1</strong> for the demonstrated solo setup, and
          Confirm. Stay in that map for <strong>15 minutes</strong>. The
          official badge description confirms the time requirement; clearing
          every leaf is not required by that description. Then return to the hub
          to credit the badge. The creator reports <strong>20 Tickets</strong>.
        </p>
        <Link className="text-link" href="/quests/clean-leaves-tickets/">
          Read the setup, badge check and troubleshooting →
        </Link>
      </div>
      <p><Link href="/quests/hunted-candy-collector/">Hunted Candy Collector: official candy and lobby claim instructions →</Link> Tickets payout for this task is not yet verified.</p>
      <p><Link href="/quests/sell-lemons-sticker-packs/">Sell Lemons: earn coins, open five sticker packs and manually claim the badge →</Link> The reviewed return to the hub shows a 40-Ticket confirmation offer; delivery and repeatability are not guaranteed.</p>
      <p><Link href="/quests/racket-rivals-trickster/">Racket Rivals: score two event candies, then claim the Trickster badge →</Link> The creator reports 20 Tickets; the walkthrough distinguishes badge claim from hub credit.</p>
      <h3 id="reward-troubleshooting">Badge earned, but no Tickets or item?</h3>
      <p>
        <strong>Player reports reviewed October 24, 2026 (Beijing):</strong>{" "}
        one player reported two earned event badges that the hub did not
        recognize or credit. Another reported a missing Dandy’s World flower
        accessory despite owning the badge, alongside an unexpected Ticket
        balance. We have not reproduced these problems on a test account.
        At 17:29–17:30 UTC on October 24 (October 25 in Beijing), forum
        responder skpm_plz said a fix had been pushed, and original reporter
        Bric_kz replied that it seemed fixed. Another player had reported
        possible recovery at 17:14 UTC. These are attributed recovery reports;
        the responder’s staff role and universal recovery are not independently
        verified. Check your account before replaying a completed task.
      </p>
      <SourceList ids={["devforum-hollow-ticket-report", "reddit-hollow-missing-tickets", "reddit-hollow-dandy-claim"]} />
      <ul>
        <li>
          Check that it is the event badge, on the same account you use in the
          hub.
        </li>
        <li>
          Return to the hub and check the Confirm prompt before repeating the
          task.
        </li>
        <li>
          For DOORS and Flee the Facility, use the separate reward display
          claim. Having a badge is not the same as collecting the avatar item.
        </li>
        <li>
          Compare your current Ticket balance with credits actually received,
          minus avatar purchases and in-game gear. An expected payout is not
          proof that the hub credited it.
        </li>
        <li>
          Check the item’s own claim requirements and your Roblox avatar
          inventory separately. A quest checkmark on this website is your
          personal note; it does not verify delivery by Roblox.
        </li>
        <li>
          If a reward is still missing, keep the badge link, experience name,
          time and screenshots of the balance or claim message for a bug report.
          Returning to the hub is a check, not a guaranteed fix. No universally
          effective workaround has been verified; spending Robux is not a
          documented solution.
        </li>
      </ul>
      <SourceList
        ids={[
          "sharkblox-ticket-redemption",
          "kam-ticket-values",
          "sharkblox-leaves",
          "official-leaves-badge",
        ]}
      />
    </section>
  );
}

export function CodesGuide() {
  return (
    <section className="prose player-guide" id="codes">
      <h2>The Hollow codes: none verified for this event</h2>
      <p>
        <strong>
          No working event redemption code was verified in our October 24, 2026 check.
        </strong>{" "}
        The official hub description and announcement do not publish one.
        Current documented rewards use tasks, badges and Tickets.
      </p>
      <p>
        Search results for the Bleach-inspired game <strong>HOLLOW</strong>{" "}
        advertise rerolls and EXP. Those are not codes for Roblox Presents’
        Halloween event. We have not found a verified code-entry flow for this
        event, so there is no invented redemption button or code list here.
      </p>
      <p>
        This is a checked-source result, not proof that Roblox will never
        release a code. Plus subscriptions and Marketplace items are separate
        paid offers; no event-specific discount or free-Robux offer was
        verified.
      </p>
      <SourceList ids={["official-hollow-hub", "official-newsroom-hollow"]} />
      <h3>How to claim a reward without a code</h3>
      <ol>
        <li><Link href="/quests/clean-leaves-tickets/">Open the Clean all the Leaves walkthrough</Link> for the Chapter 3 map setup and 15-minute event badge requirement.</li>
        <li>After earning the event badge, return to The Hollow on the same account. If the badge-credit prompt appears, read its amount and select Confirm.</li>
        <li>For Ticket-shop items, enter the cinema and open the counter on the right. Choose Avatar Items, check the price and any Plus requirement, then select the item to purchase. Look for OWNED and verify your avatar inventory.</li>
        <li>For a quest-specific accessory, use its own reward display instead. <Link href="/rewards/#reward-board">Choose an item for its claim steps</Link>. Missing credit? <Link href="/rewards/#reward-troubleshooting">Use the reward checks</Link> before repeating the task.</li>
      </ol>
      <p><a href="https://www.youtube.com/watch?v=2r79xI9AW-s&t=8s">Watch badge confirmation at 0:08</a> · <a href="https://www.youtube.com/watch?v=2r79xI9AW-s&t=15s">Find the shop at 0:15</a> · <a href="https://www.youtube.com/watch?v=2r79xI9AW-s&t=48s">See a recorded purchase at 0:48</a>. This is a creator demonstration, not a guarantee that current reward-credit issues are resolved.</p>
      <SourceList ids={["sharkblox-ticket-redemption"]} />
    </section>
  );
}


export function LauncherGhostsGuide() {
  return (
    <section className="prose player-guide" id="launcher-ghosts">
      <h2>Four launcher ghosts: which player do you need?</h2>
      <p>Roblox’s own item descriptions identify four additional rewards obtained by catching ghosts from launchers during The Hollow. These are separate from the cinema Ticket-shop items above.</p>
      <ul>
        <li><strong>Spotlight Specter:</strong> catch a ghost launched by a Star Creator.</li>
        <li><strong>Phantom in the Code:</strong> catch a ghost launched by a developer.</li>
        <li><strong>Incorporeal Incorporated:</strong> catch a ghost launched by a Roblox admin.</li>
        <li><strong>Little Plus-tergeist:</strong> catch a ghost launched by a Roblox Plus subscriber.</li>
      </ul>
      <p>Look for the appropriate launcher owner during the event and catch their launched ghost. Simply joining a creator’s community is not the collection condition stated by Roblox. For Little Plus-tergeist, the official description identifies the launcher owner as a Plus subscriber; it does not establish a subscription requirement for the recipient. Do not confuse it with the Plus-only Quack-o’-Lantern shop item.</p>
      <p>Checked October 23 against official catalog descriptions. The precise pickup controls, recipient eligibility and current successful delivery have not been independently tested, so these items are not yet included in our verified free-reward filter. We do not have a verified server queue or guaranteed delivery method.</p>
      <SourceList ids={["official-ghost-spotlight", "official-ghost-phantom", "official-ghost-incorporeal", "official-ghost-plus"]} />
    </section>
  );
}
