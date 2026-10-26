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
  placement: "header" | "content" | "sidebar" | "footer";
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
      const unit = banner
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
      className={`ad-slot ad-${placement} ${banner ? "ad-banner" : "ad-rectangle"}`}
      aria-label="Advertisement"
      data-ad-provider="adsterra"
    >
      <div ref={host} className="ad-frame-space" />
    </aside>
  );
}
