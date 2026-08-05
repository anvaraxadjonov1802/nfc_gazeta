import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="site-container public-page">
      <section className="public-error-state">
        <span className="public-error-code">
          404
        </span>

        <h1>Sahifa topilmadi</h1>

        <p>
          Siz ochmoqchi bo‘lgan nashr yoki
          maqola mavjud emas yoxud hali
          ommaga chiqarilmagan.
        </p>

        <Link
          href="/"
          className="public-primary-button"
        >
          Bosh sahifaga qaytish
        </Link>
      </section>
    </main>
  );
}