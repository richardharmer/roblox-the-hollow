import Image from "next/image";

const frames = [
  { file: "dandy-room", time: 56, stamp: "0:56", title: "1. Recognize the Dandy’s World room", alt: "Dandy-themed room with flower furniture, a flower-patterned carpet and rainbow wall trim", note: "Look for the flower furniture and rainbow trim. This is the themed room in the recorded route; it is not the separate Dandy’s World experience. Continue upstairs to the puzzle room.", x: 14, y: 54, marker: "Flower furniture" },
  { file: "puzzle-room", time: 63, stamp: "1:03", title: "2. Find the six tall symbol pillars", alt: "Wooden upstairs passage opening onto tall symbol-covered pillars around a purple floor", note: "At the upper passage, look ahead for the tall pillars on the purple floor. If your route looks different, use these room landmarks instead of blindly copying left/right turns.", x: 55, y: 42, marker: "Pillar room ahead" },
  { file: "target-symbol", time: 79, stamp: "1:19", title: "3. Read the lit face, not the pillar’s color", alt: "Purple pillar glowing with a cat face beside a dark red pillar showing a different symbol", note: "The left pillar is lit and its cat face has a green border; the right pillar is still dark. In this recording, cat is the target. Identify your own lit target rather than assuming a color or copying a cat answer for every run.", x: 14, y: 35, marker: "Lit target face" },
  { file: "beams", time: 125, stamp: "2:05", title: "4. Check the whole ring before the lever", alt: "Multiple lit pillars sending colored energy paths toward the middle of the purple floor", note: "A single glowing pillar is not enough. Walk around and check all six. The completed example has the energy paths directed into the middle; check again after each turn because linked pillars can move too.", x: 51, y: 77, marker: "Energy toward center" },
  { file: "lever", time: 130, stamp: "2:10", title: "5. Pull the lever, then return with the relic", alt: "Close view of the red-handled lever in the center of the puzzle room", note: "After the pillars align, use the central red-handled lever and collect the relic. Retrace your route to the elevator. The creator shows the reward after returning; the lever alone is not the end of the task.", x: 54, y: 48, marker: "Central lever" },
];

export function NightTwoVisualGuide() {
  return (
    <section className="night-two-visual" aria-labelledby="night-two-pictures">
      <h2 id="night-two-pictures">Night 2 picture walkthrough</h2>
      <p>Start in <a href="https://www.roblox.com/games/116463962153167/The-Hollow">The Hollow hub</a>, enter the cinema and take the elevator to Floor 2. Use the pictures below to recognize the room, target and completion state.</p>
      <p>Selected gameplay frames: WaffleTrades, reviewed October 24, 2026. Our labels identify visible details. This is a recorded example, not a map of every maze layout or our own account playtest. Click any picture to watch that moment.</p>
      <div className="visual-guide-grid">
        {frames.map((frame) => (
          <figure key={frame.file}>
            <h3>{frame.title}</h3>
            <a className="guide-frame" href={`https://www.youtube.com/watch?v=VkNzTtqcLc8&t=${frame.time}s`} aria-label={`Watch ${frame.title} at ${frame.stamp}`}>
              <span className="guide-image">
                <Image src={`/images/guides/night-two/${frame.file}.jpg`} alt={frame.alt} width={880} height={495} sizes="(max-width: 760px) 100vw, 800px" />
                <span className="frame-pin" style={{left: `${frame.x}%`, top: `${frame.y}%`}} aria-hidden="true">+</span>
              </span>
              <span className="frame-caption">{frame.marker} · ▶ {frame.stamp}</span>
            </a>
            <figcaption>{frame.note}</figcaption>
          </figure>
        ))}
      </div>
      <h3>Why a solved pillar can turn off</h3>
      <svg viewBox="0 0 640 180" role="img" aria-labelledby="link-diagram-title link-diagram-desc" className="pillar-diagram">
        <title id="link-diagram-title">One input can move more than one pillar</title>
        <desc id="link-diagram-desc">Illustrative observation method: turn one pillar once, watch which other pillars move, then recheck every target face. The drawing does not assert a fixed neighbor connection.</desc>
        <rect x="1" y="1" width="638" height="178" rx="12" fill="#1b1b23" stroke="#55515f" />
        <g fill="#f4f0e9" textAnchor="middle" fontSize="17">
          <text x="100" y="34">ONE input</text><text x="330" y="34">Watch the ring</text><text x="550" y="34">Recheck</text>
          <text x="100" y="152">Turn once</text><text x="330" y="152">Which faces moved?</text><text x="550" y="152">All six targets</text>
        </g>
        <rect x="78" y="53" width="44" height="65" rx="6" fill="#cb6d3a" />
        <path d="M150 85h75m-12-9 12 9-12 9 M435 85h55m-12-9 12 9-12 9" stroke="#e6c7a1" strokeWidth="3" fill="none" />
        {[265,290,315,340,365,390].map(x => <rect key={x} x={x} y="65" width="18" height="43" rx="3" fill="#746388" />)}
        <circle cx="550" cy="85" r="31" fill="none" stroke="#edc4a2" strokeWidth="3" />
        <text x="550" y="93" textAnchor="middle" fill="#f4f0e9" fontSize="24">6 / 6</text>
      </svg>
      <p><strong>Observation diagram, not a fixed solution.</strong> The video shows linked rotations but does not establish every control’s effect. Test one turn, note all affected pillars, then check their symbols together. Do not assume that only the pillar you touched changed.</p>
      <p><strong>What remains unverified:</strong> a universal click order, the complete linkage map, device-specific controls and successful delivery on every server. If you need to compare the motion, <a href="https://www.youtube.com/watch?v=VkNzTtqcLc8&t=88s">watch linked rotations from 1:28</a>. After the relic return, check the badge and avatar inventory separately.</p>
    </section>
  );
}
