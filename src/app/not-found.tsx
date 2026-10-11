import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container page-content">
      <header className="page-head">
        <p className="eyebrow">404 / OFF THE TRAIL</p>
        <h1>This path leads nowhere.</h1>
        <p>
          The guide you’re looking for is not published or the address is
          incorrect.
        </p>
        <Link href="/" className="button primary">
          Return to the guide
        </Link>
      </header>
    </div>
  );
}
