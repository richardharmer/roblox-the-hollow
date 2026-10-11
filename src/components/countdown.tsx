"use client";
import { useEffect, useState } from "react";
export function Countdown({
  date,
  startAt,
}: {
  date: string | null;
  startAt?: string | null;
}) {
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    const update = () => {
      if (!date) return;
      const d = new Date();
      setDays(
        Math.ceil(
          (Date.parse(date + "T00:00:00Z") -
            Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())) /
            86400000,
        ),
      );
    };
    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, [date]);
  return (
    <span className="countdown">
      {days === null
        ? "Date only"
        : days > 0
          ? `${days} calendar days away`
          : days === 0
            ? "Calendar date is today"
            : "Awaiting launch verification"}
      <small>{startAt ? `Launch: ${startAt}` : "Exact launch time TBA"}</small>
    </span>
  );
}
