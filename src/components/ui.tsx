import Link from "next/link";
import { Advertisement } from "./advertisement";
import {
  ArrowUpRight,
  ArrowRight,
  LockKeyhole,
  ShieldCheck,
  Ghost,
  Gamepad2,
  ScrollText,
  Gift,
  Medal,
} from "lucide-react";
import { sources, formatDate } from "@/lib/content";
import { jsonLd } from "@/lib/seo";
export const icons = {
  games: Gamepad2,
  quests: ScrollText,
  rewards: Gift,
  badges: Medal,
};
export function Status({ level }: { level: string }) {
  return (
    <span className={`status ${level.toLowerCase()}`}>
      <span className="status-dot" />
      {level.replaceAll("_", " ")}
    </span>
  );
}
export function SectionHead({
  eyebrow,
  title,
  href,
  label,
}: {
  eyebrow?: string;
  title: string;
  href?: string;
  label?: string;
}) {
  return (
    <div className="section-head">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      {href && (
        <Link className="text-link" href={href}>
          {label || "Explore"} <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
export function EmptyState({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <LockKeyhole size={28} />
      </div>
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
        <Link href="/sources/" className="text-link">
          How we verify information <ArrowUpRight size={15} />
        </Link>
      </div>
    </div>
  );
}
export function SourceList({ ids }: { ids: string[] }) {
  return (
    <ul className="source-list">
      {ids.map((id) => {
        const s = sources.find((s) => s.id === id);
        return (
          s && (
            <li key={id}>
              <a href={s.url} rel="noopener noreferrer" target="_blank">
                {s.name}
                <ArrowUpRight size={14} />
              </a>
              <span>
                {s.level.toLowerCase()} source ·{" "}
                {s.access === "READ"
                  ? "Read directly"
                  : s.access === "SEARCH_ONLY"
                    ? "Search excerpt only"
                    : "Not directly accessible"}
              </span>
            </li>
          )
        );
      })}
    </ul>
  );
}
export function Breadcrumb({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="breadcrumb">
        {all.map((x, i) => (
          <span key={x.path}>
            {i > 0 && <span aria-hidden="true">/</span>}
            {i === all.length - 1 ? (
              <span aria-current="page">{x.name}</span>
            ) : (
              <Link href={x.path}>{x.name}</Link>
            )}
          </span>
        ))}
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: all.map((x, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: x.name,
              item: "https://robloxthehollow.com" + x.path,
            })),
          }),
        }}
      />
    </>
  );
}
export function PageHead({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <header className="page-head">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{children}</p>
    </header>
  );
}
export function VerifiedDates({
  verified,
  updated,
}: {
  verified: string;
  updated: string;
}) {
  return (
    <div className="verified-dates">
      <ShieldCheck size={16} />
      <span>Last verified: {formatDate(verified)}</span>
      <span>Last updated: {formatDate(updated)}</span>
    </div>
  );
}
export function AdSlot({
  placement,
}: {
  placement: "header" | "content" | "sidebar" | "footer" | "native";
}) {
  return process.env.NEXT_PUBLIC_ADS_ENABLED === "false" ? null : (
    <Advertisement placement={placement} />
  );
}
export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="The Hollow home">
      <img src="/icon.svg" width="36" height="40" alt="" />
      <span>
        THE HOLLOW<small>UNOFFICIAL EVENT GUIDE</small>
      </span>
    </Link>
  );
}
export function GhostMark() {
  return <Ghost aria-hidden="true" size={28} />;
}
