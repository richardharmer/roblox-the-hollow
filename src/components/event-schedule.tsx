import { event } from "@/lib/content";

export function EventSchedule() {
  return (
    <section className="event-schedule" aria-label="Official event schedule">
      <div className="schedule-card schedule-primary">
        <span className="eyebrow">PUBLIC OPENING · OCT 22</span>
        <strong>
          <time dateTime={event.startAt ?? undefined}>2:00 p.m. PDT</time>
        </strong>
        <span>21:00 UTC · Oct 23, 05:00 Beijing</span>
      </div>
      <div className="schedule-card">
        <span className="eyebrow">ROBLOX PLUS · OCT 22</span>
        <strong>
          <time dateTime={event.plusEarlyAccessAt ?? undefined}>
            12:00 p.m. PDT
          </time>
        </strong>
        <span>19:00 UTC · Oct 23, 03:00 Beijing</span>
      </div>
      <div className="schedule-card">
        <span className="eyebrow">LIVE FINALE · OCT 31</span>
        <strong>Morning · time TBA</strong>
        <span>Exact hour not yet announced</span>
      </div>
      <div className="schedule-card">
        <span className="eyebrow">REWARD CUTOFF · NOV 2</span>
        <strong>
          <time dateTime={event.rewardClaimDeadline ?? undefined}>
            12:00 p.m. PST
          </time>
        </strong>
        <span>20:00 UTC · Nov 3, 04:00 Beijing</span>
      </div>
    </section>
  );
}
