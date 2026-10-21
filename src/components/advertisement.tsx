"use client";

import { useEffect, useRef, useState } from "react";

const units = {
  desktop: { key: "3b697ed4f08c77989d03b8459db477b6", width: 728, height: 90 },
  mobile: { key: "9a1a7edc1c25c225ff7981e4aa8e1fbc", width: 320, height: 50 },
  rectangle: {
    key: "5eab9d566df2017b106271025e01263d",
    width: 300,
    height: 250,
  },
} as const;

export function Advertisement({
  placement,
}: {
  placement: "header" | "content" | "sidebar" | "footer";
}) {
  const container = useRef<HTMLElement>(null);
  const [unit, setUnit] = useState<keyof typeof units | null>(null);
  const banner = placement === "header" || placement === "footer";
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    // Choose once per mount: never request a hidden mobile/desktop unit or
    // refresh paid impressions just because the viewport is resized.
    const load = () =>
      setUnit(
        banner
          ? element.clientWidth >= 728
            ? "desktop"
            : element.clientWidth >= 320
              ? "mobile"
              : "rectangle"
          : "rectangle",
      );
    if (placement === "header" || !("IntersectionObserver" in window)) {
      load();
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          load();
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [banner, placement]);
  const selected = unit ? units[unit] : null;
  return (
    <aside
      ref={container}
      className={`ad-slot ad-${placement} ${banner ? "ad-banner" : "ad-rectangle"}`}
      aria-label="Advertisement"
      data-ad-provider="adsterra"
    >
      <span className="ad-label">Advertisement</span>
      <div className="ad-frame-space">
        {selected && (
          <iframe
            title={`Advertisement — ${placement}`}
            width={selected.width}
            height={selected.height}
            scrolling="no"
            referrerPolicy="strict-origin-when-cross-origin"
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            data-ad-key={selected.key}
            srcDoc={`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head><body><script>var atOptions=${JSON.stringify({ key: selected.key, format: "iframe", height: selected.height, width: selected.width, params: {} })};</script><script src="https://bicea.org/22/${selected.key}"></script></body></html>`}
          />
        )}
      </div>
    </aside>
  );
}
