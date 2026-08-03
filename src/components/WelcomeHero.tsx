import React from 'react';
import { Play, BookOpen, HelpCircle, Volume2, Calendar, FileText, Clock, Sparkles, Nfc, QrCode } from 'lucide-react';
import { Issue } from '../types';
import { useAccessibility } from '../lib/accessibilityContext';

interface WelcomeHeroProps {
  issue: Issue;
  onStartListening: () => void;
  onViewPages: () => void;
  onOpenHowToUse: () => void;
  onOpenAccessibility: () => void;
  onOpenQrCode: () => void;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({
  issue,
  onStartListening,
  onViewPages,
  onOpenHowToUse,
  onOpenAccessibility,
  onOpenQrCode,
}) => {
  const { settings } = useAccessibility();

  return (
    <div className={`rounded-[40px] p-8 md:p-10 border shadow-sm transition-all ${
      settings.highContrast ? 'bg-black border-yellow-400 text-yellow-300' :
      settings.darkMode ? 'bg-[#2a2a22] border-[#5a5a40]/30 text-[#f5f5f0]' :
      'bg-[#5a5a40] text-[#f5f5f0] border-[#5a5a40]/20'
    }`}>
      {/* Audio volume tip banner */}
      <div className={`mb-6 p-5 rounded-[24px] flex items-center gap-4 border ${
        settings.highContrast ? 'bg-yellow-400 text-black border-yellow-500' :
        'bg-[#f5f5f0]/15 text-[#f5f5f0] border-white/20 backdrop-blur-md'
      }`}>
        <Volume2 className="w-8 h-8 shrink-0 animate-bounce" />
        <div>
          <p className="font-serif italic font-bold text-lg md:text-xl">
            Telefon ovozini yoqing va tinglashni boshlang
          </p>
          <p className="text-xs md:text-sm font-sans opacity-85">
            Imkoniyatlar menyusidan ovoz tezligi va matn hajmini o‘zgartirishingiz mumkin.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Cover Image & Metadata */}
        <div className="lg:col-span-5 flex flex-col items-center text-center">
          <div className="relative group rounded-[32px] overflow-hidden shadow-md border-2 border-white/20 w-full max-w-sm aspect-[3/4]">
            <img 
              src={issue.cover_image_url} 
              alt={`${issue.title} muqova surati`} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5 text-left">
              <span className="px-3 py-1 bg-[#f5f5f0] text-[#3c3c32] font-sans font-bold text-[10px] uppercase tracking-widest rounded-full self-start mb-2">
                NFC Faol Nashr
              </span>
              <p className="text-base font-serif italic text-white/95 font-bold">
                {issue.newspaper_name}
              </p>
              <p className="text-xs font-sans text-white/75">
                {issue.issue_number} • {issue.publication_date}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4 text-xs font-sans text-white/80">
            <button 
              onClick={onOpenQrCode}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20"
            >
              <QrCode className="w-4 h-4 text-amber-200" />
              <span>QR va NFC Nusxalash</span>
            </button>
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4 text-white/80" />
              <span>{issue.page_count} bet</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-white/80" />
              <span>~12 daqiqa audio</span>
            </div>
          </div>
        </div>

        {/* Action Controls & Information */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-white/20 text-[#f5f5f0] font-sans font-bold text-[10px] uppercase tracking-widest rounded-full">
                {issue.newspaper_name}
              </span>
              <span className="text-xs font-sans opacity-80">
                {issue.issue_number}
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-serif italic font-light tracking-tight leading-tight text-white mb-3">
              {issue.title}
            </h2>

            <p className="text-white/85 font-sans text-sm md:text-base leading-relaxed line-clamp-3 mb-4">
              {issue.summary || 'Ushbu sonda O‘zbekiston temir yo‘llaridagi eng so‘nggi yangiliklar, xavfsizlik va xizmat ko‘rsatish qulayliklari haqida audio materiallar tayyorlangan.'}
            </p>
          </div>

          {/* Core Action Buttons - Ultra Large & Easy to Touch */}
          <div className="flex flex-col gap-3.5 mb-6">
            
            {/* Extremely large primary button */}
            <button
              onClick={onStartListening}
              className={`w-full py-5 px-6 rounded-full font-sans font-bold text-lg md:text-xl flex items-center justify-center gap-4 shadow-md transition-all transform active:scale-98 focus:outline-none focus:ring-4 focus:ring-white/40 ${
                settings.highContrast
                  ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                  : 'bg-[#f5f5f0] hover:bg-white text-[#3c3c32]'
              }`}
              aria-label="Gazetani boshidan ovozli tinglashni boshlash"
            >
              <div className="w-12 h-12 rounded-full bg-[#5a5a40]/15 flex items-center justify-center shrink-0">
                <Play className="w-6 h-6 fill-current text-[#5a5a40] ml-0.5" />
              </div>
              <span className="tracking-wide">Gazetani tinglash</span>
            </button>

            {/* Secondary Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={onViewPages}
                className={`w-full py-3.5 px-4 rounded-full font-sans font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-colors border ${
                  settings.highContrast
                    ? 'border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black'
                    : 'bg-white/15 hover:bg-white/25 text-[#f5f5f0] border-white/20'
                }`}
                aria-label="Gazeta betlarini alohida ko‘rish"
              >
                <BookOpen className="w-5 h-5 text-amber-200" />
                <span>Betlarni ko‘rish</span>
              </button>

              <button
                onClick={onOpenHowToUse}
                className={`w-full py-3.5 px-4 rounded-full font-sans font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-colors border ${
                  settings.highContrast
                    ? 'border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black'
                    : 'bg-white/15 hover:bg-white/25 text-[#f5f5f0] border-white/20'
                }`}
                aria-label="Tizimdan qanday foydalanish yo‘riqnomasi"
              >
                <HelpCircle className="w-5 h-5 text-sky-200" />
                <span>Qanday foydalaniladi?</span>
              </button>
            </div>
          </div>

          {/* Visible Accessibility Shortcut */}
          <div className="pt-4 border-t border-white/15 flex items-center justify-between font-sans">
            <span className="text-xs text-white/80">
              Imkoniyati cheklangan foydalanuvchilar uchun qulaylik:
            </span>
            <button
              onClick={onOpenAccessibility}
              className="text-xs font-bold text-amber-200 underline hover:text-amber-100 flex items-center gap-1"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ovoz va Ko‘rish Sozlamalari</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
