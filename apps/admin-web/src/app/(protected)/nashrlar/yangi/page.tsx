import Link from "next/link";

export default function NewIssuePage() {
  return (
    <>
      <header className="page-heading">
        <div>
          <Link
            href="/nashrlar"
            className="back-link"
          >
            ← Nashrlarga qaytish
          </Link>

          <p className="eyebrow">Yangi material</p>
          <h1>Yangi gazeta soni</h1>
          <p>
            Nashr yaratish va PDF yuklash formasi keyingi
            bosqichda backend API bilan ulanadi.
          </p>
        </div>
      </header>

      <section className="content-panel">
        <div className="empty-state large-empty-state">
          <div className="empty-state-icon">▤</div>
          <h2>Nashr yaratish moduli tayyorlanmoqda</h2>
          <p>
            Keyingi bosqichda gazeta soni, sana, PDF,
            NFC havolasi va nashr holati uchun haqiqiy forma
            qo‘shiladi.
          </p>
        </div>
      </section>
    </>
  );
}