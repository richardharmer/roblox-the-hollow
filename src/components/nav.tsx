"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ChartNoAxesCombined } from "lucide-react";
import { Brand } from "./ui";
const links = ["Home", "Games", "Quests", "Rewards", "Badges", "Updates"];
export function Nav() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Brand />
        <nav
          className={open ? "main-nav open" : "main-nav"}
          aria-label="Main navigation"
        >
          {links.map((x) => {
            const href = x === "Home" ? "/" : `/${x.toLowerCase()}/`;
            return (
              <Link
                key={x}
                href={href}
                aria-current={path === href ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {x}
              </Link>
            );
          })}
        </nav>
        <Link className="button progress-link" href="/progress/">
          <ChartNoAxesCombined size={16} />
          <span>My Progress</span>
        </Link>
        <button
          className="menu-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
