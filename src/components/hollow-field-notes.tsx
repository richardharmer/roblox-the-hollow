import Link from "next/link";
import { SourceList, Status } from "@/components/ui";

const nightly = [
  ["99 Nights in the Forest", "The Deer", "Bundun"],
  ["Animal Hospital", "Mimic", "Kat"],
  ["Dandy’s World", "Twisted Dandy", "LimaMosca"],
  ["Demonology", "Biter", "Vanilbean + Kreative Kyle"],
  ["DOORS", "Seek", "NO_DATA"],
  ["Piggy", "Piggy", "KreekCraft"],
  ["Scary Shawarma Kiosk", "The Inspector", "ItsJustNicholas"],
  ["The Mimic", "Hiachi", "Kim Left Arm"],
  ["Warden", "The Overseer", "SirDapper"],
];
const roaming = [
  ["BEAR", "Bear"],
  ["PETAPETA", "Petapeta"],
  ["Flee the Facility", "The Beast"],
  ["Survive the Killer", "Flotsam Direwick"],
  ["Dead Rails", "Zombie Mob"],
  ["Evade", "Angry Bobo"],
  ["Home Alone: Anomalies", "Party Girl Anomaly / Grinning Guy / Goblin"],
  ["Banana Eats", "The Banana"],
  ["Aooni Nightmare", "Ao Oni"],
];
const outskirts = [
  "Steal An Egg",
  "Dress To Impress",
  "Fisch",
  "X100",
  "+1 Speed Keyboard Escape",
  "Candy & Chocolate",
  "Clean All The Leaves",
  "Hunted",
  "Search For The Needle",
  "Murderers Vs Sheriffs",
  "Murder Duels",
  "Survive Overnight In A Mega Store",
  "Color Or Die",
  "The Block",
  "Duck Duck",
  "Welcome To Bloxburg",
  "Creatures Of Sonaria",
  "Grow A Garden 2",
  "Basketball Legends",
  "Tower Defense Simulator",
  "Moo Moo Mystery",
];

export function Outskirts() {
  return (
    <section className="prose field-notes" id="outskirts">
      <h2>The Outskirts: side quests across Roblox</h2>
      <Status level="CONFIRMED" />
      <p>
        Roblox’s official lineup poster names these experiences under The
        Outskirts. This is a separate side-quest category alongside the nightly
        hub encounters and roaming monsters. Names below follow the poster;
        inclusion does not establish a task’s objective or reward.
      </p>
      <ul className="outskirts-list">
        {outskirts.map((name) => (
          <li key={name}>
            {name === "Hunted" ? (
              <Link href="/quests/#hunted">
                Hunted — special badge announced
              </Link>
            ) : (
              name
            )}
          </li>
        ))}
      </ul>
      <SourceList ids={["official-x-full-lineup"]} />
    </section>
  );
}

export function FullLineup() {
  return (
    <>
      <section className="prose field-notes" id="nightly-haunts">
        <h2>Nightly Haunts: monster and creator pairings</h2>
        <Status level="CONFIRMED" />
        <p>
          The October 21 UTC poster pairs each featured monster with a creator.
          Its ordering is a lineup, not a dated day-by-day schedule.
        </p>
        <div className="field-table-wrap">
          <table className="field-table">
            <caption>
              Nine featured encounters — daily order not announced
            </caption>
            <thead>
              <tr>
                <th scope="col">Game</th>
                <th scope="col">Monster</th>
                <th scope="col">Creator</th>
              </tr>
            </thead>
            <tbody>
              {nightly.map(([game, monster, creator]) => (
                <tr key={game}>
                  <th scope="row">{game}</th>
                  <td>{monster}</td>
                  <td>{creator}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h2>Roaming the Hollow: everyday encounters</h2>
        <p>
          The poster places the following monsters in its everyday roaming
          category. It does not specify spawn locations, counters or guaranteed
          encounter times.
        </p>
        <div className="field-table-wrap">
          <table className="field-table">
            <caption>Official roaming lineup</caption>
            <thead>
              <tr>
                <th scope="col">Game</th>
                <th scope="col">Monster</th>
              </tr>
            </thead>
            <tbody>
              {roaming.map(([game, monster]) => (
                <tr key={game}>
                  <th scope="row">{game}</th>
                  <td>{monster}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <SourceList ids={["official-x-full-lineup"]} />
      </section>
      <Outskirts />
    </>
  );
}

export function HuntedBriefing() {
  return (
    <section className="prose field-notes" id="hunted">
      <h2>Hunted side quest: a special badge is announced</h2>
      <Status level="CONFIRMED" />
      <p>
        Dark Deception’s official account says Hunted has a Hollow event quest
        that awards a special badge. Roblox’s poster independently lists Hunted
        in The Outskirts.
      </p>
      <p>
        <a
          href="https://www.roblox.com/games/136431686349723/HUNTED"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open the verified Hunted experience →
        </a>
      </p>
      <dl className="field-facts">
        <dt>Publisher</dt>
        <dd>Glowstick Entertainment x Exclusible</dd>
        <dt>Place ID</dt>
        <dd>136431686349723</dd>
        <dt>Universe ID</dt>
        <dd>7229780065</dd>
        <dt>Announced reward</dt>
        <dd>Special event badge; name and ID not yet identified</dd>
      </dl>
      <h3>What you can do now</h3>
      <ol>
        <li>
          Use the verified Hunted link above and check the publisher before
          joining.
        </li>
        <li>
          Look for an explicitly Hollow-labeled event objective when available.
          The developer has confirmed the quest, but has not supplied its
          starting NPC, menu or required actions in the announcement.
        </li>
        <li>
          Follow that event objective for the announced badge. We have not
          verified an award or an extra UGC redemption step.
        </li>
      </ol>
      <p>
        <strong>Partial guide:</strong> entry identity and the quest-to-badge
        connection are confirmed. The objective, maze route, unlock time and
        claim sequence remain unconfirmed. Hunted’s ordinary soul-shard gameplay
        is not evidence for this event’s completion condition.
      </p>
      <p>
        The public badge list returned 29 entries with no next page on October
        22; none explicitly named The Hollow. Existing chapter and PvP badges
        are not substitutes for the announced event badge.
      </p>
      <SourceList
        ids={[
          "developer-hunted-hollow",
          "official-hunted-game-api",
          "official-hunted-badges-api",
        ]}
      />
    </section>
  );
}

export function MazeEvidence() {
  return (
    <section className="prose field-notes" id="maze-preview">
      <h2>Maze preview: landmarks visible in the official trailer</h2>
      <Status level="CONFIRMED" />
      <p>
        The 24-second Roblox trailer embedded in the official DevForum
        announcement shows these environments. Timestamps are approximate visual
        reference points, not a connected route.
      </p>
      <ul>
        <li>
          <a href="https://www.youtube.com/watch?v=4oFH5keX1gY&t=2s">
            0:02 — a plaza with a Side Eye Café sign.
          </a>
        </li>
        <li>
          <a href="https://www.youtube.com/watch?v=4oFH5keX1gY&t=4s">
            0:04 — an underground corridor with overhead pipes and lamps.
          </a>
        </li>
        <li>
          <a href="https://www.youtube.com/watch?v=4oFH5keX1gY&t=7s">
            0:07–0:09 — a red-lit, theater-like facade and the nine-night
            announcement.
          </a>
        </li>
        <li>
          <a href="https://www.youtube.com/watch?v=4oFH5keX1gY&t=11s">
            0:11–0:16 — monster and creator showcases.
          </a>
        </li>
      </ul>
      <p>
        <strong>Route status:</strong> the sampled shots do not show a
        continuous spawn-to-exit run, objective UI or a successful completion.
        They cannot establish left/right turns, key locations or puzzle answers.
      </p>
      <SourceList ids={["official-hollow-trailer"]} />
      <h3>Creator coverage checked</h3>
      <p>
        <a href="https://www.twitch.tv/videos/2907048930">
          SirDapper’s 2:39:53 “THE HOLLOW PREP” replay
        </a>{" "}
        is available. Samples around 0:04, 0:30 and 1:30 show a starting screen
        and other gameplay, without a verified Hollow completion. This is a
        preparation replay, not a route source. The latest visible live-video
        lists on{" "}
        <a href="https://www.youtube.com/@KreekCraft/streams">KreekCraft</a> and{" "}
        <a href="https://www.youtube.com/@LimaMosca/streams">LimaMosca</a> did
        not yield a Hollow walkthrough in this check.
      </p>
      <p>
        <a href="https://www.youtube.com/watch?v=hF36NLsfZgI&t=375s">
          WaffleTrades at 6:15
        </a>{" "}
        displays the official lineup poster. We followed that lead to Roblox’s
        original post; the confirmed roster above comes from Roblox, rather than
        treating the video’s predictions as facts.
      </p>
    </section>
  );
}

export function ThemeGuide() {
  return (
    <section className="prose field-notes" id="app-theme">
      <h2>How to enable The Hollow app theme</h2>
      <Status level="REPORTED" />
      <p>
        KreekCraft’s October 22 demonstration shows the theme selector and its
        orange Halloween appearance. This is a creator-demonstrated setting, not
        an independently tested reward claim.
      </p>
      <ol>
        <li>Open Settings in the Roblox app.</li>
        <li>
          Find the app-theme selector and look for <strong>The Hollow</strong>.
        </li>
        <li>
          If the option is available to your account, select it. The video shows
          a dark orange interface and a changed app icon.
        </li>
      </ol>
      <p>
        <a href="https://www.youtube.com/watch?v=YtoRojJMuZI&t=0s">
          Watch the instructions at 0:00–0:08
        </a>
        ; the appearance is shown in the remainder of the 15-second video. Early
        Plus availability is reported in the clip. Device differences, rollout
        coverage and current non-Plus eligibility have not been independently
        tested.
      </p>
      <p>
        Roblox separately confirms that active Plus subscribers can retain the
        theme after the finale. The theme is an app setting, not a catalog
        avatar item or a badge. If it is missing from your settings, this
        demonstration does not establish a workaround.
      </p>
      <SourceList
        ids={["creator-kreek-hollow-theme", "official-newsroom-hollow"]}
      />
      <h3>Hunted’s special badge</h3>
      <p>
        The developer has announced a badge for its Hollow quest.{" "}
        <Link href="/quests/#hunted">
          Open the Hunted entry and partial quest guide
        </Link>
        . Its badge ID and any connection to a separate avatar item remain
        unconfirmed.
      </p>
    </section>
  );
}
