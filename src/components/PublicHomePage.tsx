import React from 'react';
import { Play, BookOpen, Nfc, Volume2, Shield, HeartHandshake, HelpCircle, PhoneCall, Train, Sparkles, ArrowRight } from 'lucide-react';
import { Issue } from '../types';
import { useAccessibility } from '../lib/accessibilityContext';

interface PublicHomePageProps {
  latestIssue: Issue;
  allIssues: Issue[];
  onSelectIssue: (slug: string) => void;
  onOpenHowToUse: () => void;
  onOpenArchive: () => void;
  onOpenAccessibility: () => void;
}

export const PublicHomePage: React.FC<PublicHomePageProps> = ({
  latestIssue,
  allIssues,
  onSelectIssue,
  onOpenHowToUse,
  onOpenArchive,
  onOpenAccessibility,
}) => {
  const { settings } = useAccessibility();

  const faqs = [
    {
      q: 'NFC texnologiyasi qanday ishlaydi?',
      a: 'Telefoningizni gazetadagi yoki vokzaldagi maxsus NFC belgisiga yaqinlashtirganingizda, hech qanday dastur o‘rnatmasdan brauzerda tegishli gazeta soni audio shaklida ochiladi.'
    },
    {
      q: 'Ko‘zi ojiz yo‘lovchilar uchun qanday qulayliklar bor?',
      a: 'Tizimda har bir xatboshi audio bilan mos ravishda ekranda ajratib ko‘rsatiladi. Shuningdek, ultra katta tugmali Sodda rejim va Yuqori Kontrast (Sariq/Qora) rejimlari mavjud.'
    },
    {
      q: 'Internet sekin bo‘lsa ham eshitib bo‘ladimi?',
      a: 'Ha, barcha audio va matnlar mobil internet tezligiga mos ravishda siqilgan va keshlanadi.'
    }
  ];

  return (
    <div className="space-y-12 pb-32">
      
      {/* 1. Hero Section */}
      <section className={`rounded-[40px] p-8 md:p-12 border shadow-sm relative overflow-hidden ${
        settings.highContrast
          ? 'bg-black border-yellow-400 text-yellow-300'
          : settings.darkMode
          ? 'bg-[#2a2a22] border-[#5a5a40]/30 text-[#f5f5f0]'
          : 'bg-[#5a5a40] text-[#f5f5f0] border-[#5a5a40]/20'
      }`}>
        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5f5f0]/20 text-[#f5f5f0] text-[10px] uppercase font-sans font-bold tracking-widest backdrop-blur-md">
            <Train className="w-4 h-4" />
            <span>Rasmiy NFC Audio Tizim</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-serif italic font-light tracking-tight leading-tight">
            Gazetani tinglang
          </h1>

          <p className="text-lg md:text-xl opacity-90 font-sans leading-relaxed">
            Temiryo‘l yangiliklarini o‘qish endi yanada oson. Bosma gazetadagi NFC belgisiga telefonni tekkizing va poyezdda yoki vokzalda audioga ega bo‘ling.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => onSelectIssue(latestIssue.slug)}
              className="px-8 py-4 rounded-full bg-[#f5f5f0] hover:bg-white text-[#3c3c32] font-sans font-bold text-base md:text-lg flex items-center gap-3 shadow-md transition-transform active:scale-95"
            >
              <Play className="w-6 h-6 fill-current text-[#5a5a40]" />
              <span>So‘nggi nashrni tinglash</span>
            </button>

            <button
              onClick={onOpenArchive}
              className="px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 text-[#f5f5f0] font-sans font-bold text-base border border-white/20 flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              <span>Barcha nashrlar</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. How It Works Section */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-4xl font-serif italic font-light tracking-tight text-[#3c3c32] dark:text-[#f5f5f0]">
            Qanday foydalaniladi?
          </h2>
          <p className="text-xs uppercase tracking-widest font-sans font-bold opacity-60">
            Faqat 3 ta oddiy qadam orqali ovozli gazeta bilan tanishing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-[32px] bg-[#e8e8df] dark:bg-[#2a2a22] border border-[#5a5a40]/15 space-y-4 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-[#5a5a40] text-[#f5f5f0] flex items-center justify-center font-serif font-bold text-xl">
              1
            </div>
            <h3 className="font-serif italic text-xl font-bold text-[#3c3c32] dark:text-[#f5f5f0]">NFC belgisiga telefonni yaqinlashtiring</h3>
            <p className="text-sm font-sans leading-relaxed text-[#3c3c32]/80 dark:text-[#f5f5f0]/80">
              Bosma gazeta muqovasiga yoki vokzal perronidagi belgisiga telefon orqasini tekkizing.
            </p>
          </div>

          <div className="p-8 rounded-[32px] bg-[#e8e8df] dark:bg-[#2a2a22] border border-[#5a5a40]/15 space-y-4 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-[#5a5a40] text-[#f5f5f0] flex items-center justify-center font-serif font-bold text-xl">
              2
            </div>
            <h3 className="font-serif italic text-xl font-bold text-[#3c3c32] dark:text-[#f5f5f0]">Gazeta avtomatik ochiladi</h3>
            <p className="text-sm font-sans leading-relaxed text-[#3c3c32]/80 dark:text-[#f5f5f0]/80">
              Brauzeringizda gazeta sahifasi bir zumda yuklanadi, o‘rnatish va ro‘yxatdan o‘tish talab etilmaydi.
            </p>
          </div>

          <div className="p-8 rounded-[32px] bg-[#e8e8df] dark:bg-[#2a2a22] border border-[#5a5a40]/15 space-y-4 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-[#5a5a40] text-[#f5f5f0] flex items-center justify-center font-serif font-bold text-xl">
              3
            </div>
            <h3 className="font-serif italic text-xl font-bold text-[#3c3c32] dark:text-[#f5f5f0]">Tinglashni boshlang</h3>
            <p className="text-sm font-sans leading-relaxed text-[#3c3c32]/80 dark:text-[#f5f5f0]/80">
              Katta “Tinglash” tugmasini bosing, har bir xatboshi ekranda rangli ajratilib o‘qiladi.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Latest Newspaper Issues Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#5a5a40]/15 pb-4">
          <h2 className="text-2xl md:text-3xl font-serif italic font-light tracking-tight text-[#3c3c32] dark:text-[#f5f5f0]">
            So‘nggi gazeta nashrlari
          </h2>
          <button
            onClick={onOpenArchive}
            className="text-xs uppercase tracking-widest font-sans font-bold text-[#5a5a40] dark:text-[#f5f5f0] hover:underline flex items-center gap-1"
          >
            <span>Barchasi →</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allIssues.map((issue) => (
            <div 
              key={issue.id}
              onClick={() => onSelectIssue(issue.slug)}
              className="p-5 rounded-[32px] bg-[#e8e8df] dark:bg-[#2a2a22] border border-[#5a5a40]/15 hover:border-[#5a5a40] cursor-pointer transition-all group flex flex-col justify-between shadow-2xs"
            >
              <div>
                <div className="rounded-[24px] overflow-hidden aspect-[4/3] bg-[#dcdcd0] mb-4">
                  <img 
                    src={issue.cover_image_url} 
                    alt={issue.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="px-3 py-1 text-[10px] uppercase tracking-widest font-sans font-bold rounded-full bg-[#5a5a40]/10 text-[#5a5a40] dark:text-[#f5f5f0]">
                  {issue.issue_number} • {issue.publication_date}
                </span>
                <h3 className="font-serif italic font-bold text-xl text-[#3c3c32] dark:text-[#f5f5f0] mt-3 group-hover:text-[#5a5a40]">
                  {issue.title}
                </h3>
                <p className="text-xs font-sans text-[#3c3c32]/70 dark:text-[#f5f5f0]/70 line-clamp-2 mt-1.5 leading-relaxed">
                  {issue.summary}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#5a5a40]/10 flex items-center justify-between text-xs font-sans font-bold">
                <span className="opacity-60">{issue.page_count} bet • ~12 min</span>
                <span className="text-[#5a5a40] dark:text-[#f5f5f0] flex items-center gap-1">
                  Tinglash <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Accessibility Benefits & Elderly Instructions */}
      <section className="p-8 rounded-[40px] bg-[#5a5a40] text-[#f5f5f0] border border-[#5a5a40]/20 space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <HeartHandshake className="w-8 h-8 text-[#f5f5f0]" />
          <h2 className="text-2xl font-serif italic font-light">
            Keksa va ko‘zi ojiz yo‘lovchilar uchun g‘amxo‘rlik
          </h2>
        </div>
        <p className="text-sm font-sans leading-relaxed opacity-90">
          Gazetalarimiz barcha toifadagi kitobxonlar va yo‘lovchilar uchun maxsus WCAG 2.2 standartlariga moslangan. Agar ko‘rishda qiynalsangiz, ekrandagi <strong>“Sodda rejim”</strong> yoki <strong>“Yuqori kontrast”</strong> tugmalaridan foydalanishingiz mumkin.
        </p>
        <button
          onClick={onOpenAccessibility}
          className="px-6 py-3 rounded-full bg-[#f5f5f0] text-[#3c3c32] font-sans font-bold text-xs uppercase tracking-widest shadow-xs hover:bg-white"
        >
          Imkoniyatlar sozlamalarini ochish
        </button>
      </section>

      {/* 5. FAQs Section */}
      <section className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-serif italic font-light tracking-tight text-[#3c3c32] dark:text-[#f5f5f0]">
          Ko‘p beriladigan savollar
        </h2>
        <div className="space-y-3">
          {faqs.map((f, idx) => (
            <div key={idx} className="p-6 rounded-[24px] bg-[#e8e8df] dark:bg-[#2a2a22] border border-[#5a5a40]/15 space-y-2">
              <h3 className="font-serif italic font-bold text-lg text-[#3c3c32] dark:text-[#f5f5f0]">
                {f.q}
              </h3>
              <p className="text-sm font-sans text-[#3c3c32]/80 dark:text-[#f5f5f0]/80 leading-relaxed">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Footer / Support Section */}
      <footer className="pt-8 border-t border-[#5a5a40]/15 text-center space-y-3 text-xs font-sans text-[#3c3c32]/60 dark:text-[#f5f5f0]/60">
        <div className="flex items-center justify-center gap-2">
          <Train className="w-5 h-5 text-[#5a5a40]" />
          <span className="font-serif italic font-bold text-[#3c3c32] dark:text-[#f5f5f0] text-sm">
            O‘zbekiston Temir Yo‘llari AJ
          </span>
        </div>
        <p>
          Temiryo‘l Ovozli Gazeta — Raqamli va Ovozli Foydalanish Platformasi © 2026. Barcha huquqlar himoyalangan.
        </p>
      </footer>

    </div>
  );
};
