import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-container site-header-inner">
        <Link
          href="/"
          className="site-logo"
          aria-label="Temiryo‘lchi bosh sahifasi"
        >
          <span className="site-logo-mark">
            T
          </span>

          <span>
            <strong>Temiryo‘lchi</strong>
            <small>Elektron gazeta</small>
          </span>
        </Link>

        <nav
          className="site-navigation"
          aria-label="Asosiy navigatsiya"
        >
          <Link href="/">
            Bosh sahifa
          </Link>

          <Link href="/arxiv">
            Gazeta arxivi
          </Link>
        </nav>
      </div>
    </header>
  );
}