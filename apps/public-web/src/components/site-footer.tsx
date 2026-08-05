import Link from "next/link";

export function SiteFooter() {
  const currentYear =
    new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-container site-footer-inner">
        <div>
          <strong>Temiryo‘lchi</strong>

          <p>
            Temiryo‘l yangiliklari va elektron
            gazeta arxivi.
          </p>
        </div>

        <div className="footer-links">
          <Link href="/">
            Bosh sahifa
          </Link>

          <Link href="/arxiv">
            Gazeta arxivi
          </Link>
        </div>

        <small>
          © {currentYear} Temiryo‘lchi
        </small>
      </div>
    </footer>
  );
}