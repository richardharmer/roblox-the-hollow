"use client";

import { useEffect, useRef } from "react";
import { adCodes } from "@/lib/ad-codes";

// React does not execute scripts assigned with innerHTML. Insert the original
// snippet as an executable fragment, without altering its scripts or attributes.
// Banner snippets share the vendor's atOptions global; finish one external
// script before inserting the next snippet so their settings cannot race.
let bannerQueue = Promise.resolve();

export function Advertisement({
  placement,
}: {
  placement: "header" | "content" | "sidebar" | "footer" | "native";
}) {
  const container = useRef<HTMLElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const banner = placement === "header" || placement === "footer";

  useEffect(() => {
    const element = container.current;
    const target = host.current;
    if (!element || !target) return;
    let cancelled = false;
    let finish: (() => void) | undefined;
    bannerQueue = bannerQueue.then(() => {
      if (cancelled || !target.isConnected) return;
      const unit = placement === "native" ? "native" : banner
        ? element.clientWidth >= 728
          ? "desktop"
          : element.clientWidth >= 320
            ? "mobile"
            : "rectangle"
        : "rectangle";
      const range = document.createRange();
      range.selectNodeContents(target);
      const fragment = range.createContextualFragment(adCodes[unit]);
      const script = fragment.querySelector<HTMLScriptElement>("script[src]")!;
      return new Promise<void>((resolve) => {
        finish = resolve;
        script.addEventListener("load", () => resolve(), { once: true });
        script.addEventListener("error", () => resolve(), { once: true });
        target.append(fragment);
      });
    });
    return () => {
      cancelled = true;
      target.replaceChildren();
      finish?.();
    };
  }, [banner, placement]);

  return (
    <aside
      ref={container}
      className={`ad-slot ad-${placement} ${placement === "native" ? "ad-native" : banner ? "ad-banner" : "ad-rectangle"}`}
      aria-label="Advertisement"
      data-ad-provider="adsterra"
    >
      <span className="ad-label">Advertisement</span>
      <div ref={host} className="ad-frame-space" />
    </aside>
  );
}

// Page-limited trial: the homepage and puzzle landing page mount this component.
// The provider's original script is inserted directly at the end of the body.
export function SocialBarTrial() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ADS_ENABLED === "false") return;
    if (!document.querySelector('script[src="https://bicea.org/14/278e37b3554f367cf51584d5599e6289"]')) {
      const range = document.createRange();
      range.selectNodeContents(document.body);
      document.body.append(range.createContextualFragment(adCodes.social));
    }
    // The provider has no supplied SPA teardown. Leave this trial through a
    // normal document navigation so its overlays cannot persist on other pages.
    const navigate = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest("a");
      if (!anchor || anchor.target || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      event.preventDefault();
      event.stopPropagation();
      location.assign(url.href);
    };
    const reload = () => location.reload();
    document.addEventListener("click", navigate, true);
    window.addEventListener("popstate", reload);
    return () => {
      document.removeEventListener("click", navigate, true);
      window.removeEventListener("popstate", reload);
    };
  }, []);
  return null;
}
