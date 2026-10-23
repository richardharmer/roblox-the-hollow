import streams from "@/data/livestreams.json";
import { SourceList, Status } from "@/components/ui";

function dateLabel(value: string, timeZone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(value));
}

export function LivestreamSchedule() {
  return (
    <section className="prose field-notes" id="livestreams">
      <h2>Official creator livestream schedule</h2>
      <Status level="CONFIRMED" />
      <p>
        Roblox’s public event API lists all nine sessions under Roblox Presents,
        in The Hollow universe 10770728771. Checked October 23, 2026. Open a
        session for its current official event page.
      </p>
      <div className="field-table-wrap">
        <table className="field-table">
          <caption>
            Scheduled starts · 2026 · times displayed to the minute
          </caption>
          <thead>
            <tr>
              <th scope="col">Livestream</th>
              <th scope="col">UTC</th>
              <th scope="col">Beijing (UTC+8)</th>
            </tr>
          </thead>
          <tbody>
            {streams.map((stream) => (
              <tr key={stream.id}>
                <th scope="row">
                  <a
                    href={`https://www.roblox.com/events/${stream.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {stream.title}
                  </a>
                </th>
                <td>
                  <time dateTime={stream.eventTime.startUtc}>
                    {dateLabel(stream.eventTime.startUtc, "UTC")}
                  </time>
                </td>
                <td>
                  <time dateTime={stream.eventTime.startUtc}>
                    {dateLabel(stream.eventTime.startUtc, "Asia/Shanghai")}
                  </time>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        The records contain a 59.606-second offset; the table omits seconds,
        matching the official event page’s minute display. Each currently lists
        a 30-minute window. These are scheduled sessions, not proof that a
        stream started or lasted exactly 30 minutes.
      </p>
      <p>
        <strong>
          Livestream order is not a verified monster-unlock calendar.
        </strong>{" "}
        The records do not establish new maze release times, quest unlocks or
        the finale’s exact start. Piggy × KreekCraft is listed for October 31 at
        16:30 UTC (November 1 at 00:30 Beijing); that listing alone does not
        identify the finale.
      </p>
      <SourceList ids={["official-hollow-livestreams"]} />
    </section>
  );
}
