import Link from "next/link";

export default function IssuesPage() {
  return (
    <>
      <header className="page-heading page-heading-row">
        <div>
          <p className="eyebrow">Kontent boshqaruvi</p>
          <h1>Gazeta nashrlari</h1>
          <p>
            Temiryo‘lchi gazetasining barcha sonlarini
            boshqaring.
          </p>
        </div>

        <Link
          href="/nashrlar/yangi"
          className="primary-link-button"
        >
          Yangi nashr
        </Link>
      </header>

      <section className="content-panel">
        <div className="empty-state large-empty-state">
          <div className="empty-state-icon">＋</div>
          <h2>Hali nashr qo‘shilmagan</h2>
          <p>
            Birinchi gazeta sonini yaratish uchun “Yangi
            nashr” tugmasini bosing.
          </p>

          <Link
            href="/nashrlar/yangi"
            className="primary-link-button"
          >
            Birinchi nashrni yaratish
          </Link>
        </div>
      </section>
    </>
  );
}