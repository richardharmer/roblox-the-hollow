import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Brand } from "@/components/ui";
import { contact, origin } from "@/lib/content";
import { jsonLd } from "@/lib/seo";
export const metadata: Metadata = {
  metadataBase: new URL(origin),
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32" },
      { url: "/favicon-16.png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div className="footer-top">
            <Brand />
            <p>
              Your field guide to the unknown.
              <br />
              <span>Unofficial Fan-Made Event Guide</span>
            </p>
            <div className="footer-links">
              <Link href="/about/">About</Link>
              <Link href="/sources/">Sources & editorial policy</Link>
              <Link href="/privacy/">Privacy</Link>
              <a href={`mailto:${contact}`}>Contact</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>
              This website is an independent fan-made guide. It is not
              affiliated with, endorsed by, or sponsored by Roblox Corporation.
              Roblox and related trademarks belong to their respective owners.
            </p>
            <span>© 2026 The Hollow Guide</span>
          </div>
        </footer>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "The Hollow Guide",
              description:
                "An independent fan-made guide to The Hollow, the reported 2026 Roblox Halloween event, with sourced updates, game and reward directories, and a personal progress checklist.",
              url: origin,
              inLanguage: "en-US",
            }),
          }}
        />
      </body>
    </html>
  );
}
