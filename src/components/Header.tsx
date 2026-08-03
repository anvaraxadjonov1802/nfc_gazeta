import React from 'react';
import { Train, Volume2, Eye, Search, Lock, HelpCircle, Radio, Sparkles } from 'lucide-react';
import { useAccessibility } from '../lib/accessibilityContext';

interface HeaderProps {
  onOpenAccessibility: () => void;
  onOpenHowToUse: () => void;
  onOpenAiAssistant: () => void;
  onOpenSearch: () => void;
  onOpenAdmin: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAccessibility,
  onOpenHowToUse,
  onOpenAiAssistant,
  onOpenSearch,
  onOpenAdmin,
  activeTab,
  setActiveTab
}) => {
  const { settings, toggleSimpleMode } = useAccessibility();

  return (
    <header className={`sticky top-0 z-40 border-b backdrop-blur-md shadow-xs ${
      settings.highContrast ? 'bg-black border-yellow-400 text-yellow-300' :
      settings.darkMode ? 'bg-[#2a2a22] border-[#5a5a40]/30 text-[#f5f5f0]' :
      'bg-[#f5f5f0]/95 border-[#5a5a40]/20 text-[#3c3c32]'
    }`}>
      {/* Skip Navigation Link for Accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#5a5a40] focus:text-[#f5f5f0] focus:rounded-md"
      >
        Asosiy mazmunga o‘tish
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo and Brand */}
          <button 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 text-left focus:outline-none focus:ring-2 focus:ring-[#5a5a40] rounded-xl p-1 group"
            aria-label="Temiryo‘l Ovozli Gazeta Bosh sahifasiga o‘tish"
          >
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center font-bold text-[#f5f5f0] shadow-sm transition-transform group-hover:scale-105 ${
              settings.highContrast ? 'bg-yellow-400 text-black' : 'bg-[#5a5a40]'
            }`}>
              <Train className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif italic text-lg md:text-2xl font-semibold tracking-tight leading-none text-[#3c3c32] dark:text-[#f5f5f0]">
                  Temiryo‘l Ovozli Gazeta
                </h1>
                <span className={`hidden sm:inline-block px-2.5 py-0.5 text-[10px] uppercase font-sans font-bold tracking-widest rounded-full ${
                  settings.highContrast ? 'bg-yellow-400 text-black' : 'bg-[#5a5a40]/10 text-[#5a5a40] border border-[#5a5a40]/20'
                }`}>
                  NFC Audio
                </span>
              </div>
              <p className="text-xs opacity-75 font-sans mt-0.5 hidden sm:block">
                O‘zbekiston temir yo‘llari rasmiy raqamli gazetasi
              </p>
            </div>
          </button>

          {/* Action Buttons & Accessibility Quick Access */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl flex items-center gap-2 font-medium text-sm transition-colors focus:ring-2 focus:ring-[#5a5a40] ${
                settings.highContrast 
                  ? 'border border-yellow-400 hover:bg-yellow-400 hover:text-black' 
                  : 'bg-[#e8e8df] hover:bg-[#deded3] text-[#3c3c32]'
              }`}
              aria-label="Gazetada qidirish"
            >
              <Search className="w-5 h-5 text-[#5a5a40]" />
              <span className="hidden md:inline font-sans">Qidiruv</span>
            </button>

            {/* How to use */}
            <button
              onClick={onOpenHowToUse}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl flex items-center gap-2 font-medium text-sm transition-colors focus:ring-2 focus:ring-[#5a5a40] ${
                settings.highContrast 
                  ? 'border border-yellow-400 hover:bg-yellow-400 hover:text-black' 
                  : 'bg-[#e8e8df] hover:bg-[#deded3] text-[#3c3c32]'
              }`}
              aria-label="Qanday foydalaniladi yo‘riqnomasi"
            >
              <HelpCircle className="w-5 h-5 text-[#5a5a40]" />
              <span className="hidden md:inline font-sans">Yordam</span>
            </button>

            {/* AI Assistant */}
            <button
              onClick={onOpenAiAssistant}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl flex items-center gap-2 font-medium text-sm transition-colors focus:ring-2 focus:ring-[#5a5a40] ${
                settings.highContrast 
                  ? 'border border-yellow-400 hover:bg-yellow-400 hover:text-black' 
                  : 'bg-[#5a5a40]/10 text-[#3c3c32] border border-[#5a5a40]/20 hover:bg-[#5a5a40]/20'
              }`}
              aria-label="AI Ovozli Yordamchi"
            >
              <Sparkles className="w-5 h-5 text-[#5a5a40] animate-pulse" />
              <span className="hidden lg:inline font-semibold font-sans">AI Yordamchi</span>
            </button>

            {/* Sodda Rejim (Simple Mode) */}
            <button
              onClick={toggleSimpleMode}
              className={`px-3 py-2 rounded-xl flex items-center gap-2 font-bold text-sm transition-all focus:ring-2 focus:ring-[#5a5a40] shadow-xs ${
                settings.simpleMode
                  ? 'bg-[#5a5a40] text-[#f5f5f0] ring-2 ring-[#5a5a40]/50'
                  : settings.highContrast
                  ? 'border border-yellow-400 text-yellow-300'
                  : 'bg-[#e8e8df] hover:bg-[#deded3] text-[#3c3c32]'
              }`}
              aria-label={settings.simpleMode ? "Standart rejimga o‘tish" : "Keksa va ko‘zi ojizlar uchun Sodda rejimni yoqish"}
            >
              <Radio className="w-5 h-5 text-[#5a5a40]" />
              <span className="inline-block font-sans">
                {settings.simpleMode ? "Standart rejim" : "Sodda rejim"}
              </span>
            </button>

            {/* Accessibility Panel Modal Trigger */}
            <button
              onClick={onOpenAccessibility}
              className={`p-2.5 rounded-xl flex items-center justify-center font-semibold text-sm transition-colors focus:ring-2 focus:ring-[#5a5a40] ${
                settings.highContrast
                  ? 'bg-yellow-400 text-black'
                  : 'bg-[#5a5a40] hover:bg-[#4a4a34] text-[#f5f5f0] shadow-xs'
              }`}
              aria-label="Ovoz va Ko‘rish Imkoniyatlari Sozlamalarini ochish"
            >
              <Eye className="w-5 h-5" />
            </button>

            {/* Admin Dashboard */}
            <button
              onClick={onOpenAdmin}
              className={`p-2.5 rounded-xl flex items-center justify-center transition-colors focus:ring-2 focus:ring-[#5a5a40] ${
                settings.highContrast ? 'border border-yellow-400' : 'text-[#5a5a40]/70 hover:text-[#3c3c32] hover:bg-[#e8e8df]'
              }`}
              title="Administrator kabinetiga kirish"
              aria-label="Administrator tizimi"
            >
              <Lock className="w-5 h-5" />
            </button>

          </div>
        </div>

        {/* Secondary Navigation Tabs */}
        <nav className="flex items-center gap-2 py-2 border-t border-[#5a5a40]/10 overflow-x-auto no-scrollbar text-xs uppercase tracking-widest font-sans font-medium">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'home'
                ? 'bg-[#5a5a40] text-[#f5f5f0] font-bold'
                : 'text-[#3c3c32]/70 hover:bg-[#e8e8df]'
            }`}
          >
            Bosh sahifa
          </button>
          <button
            onClick={() => setActiveTab('archive')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'archive'
                ? 'bg-[#5a5a40] text-[#f5f5f0] font-bold'
                : 'text-[#3c3c32]/70 hover:bg-[#e8e8df]'
            }`}
          >
            Barcha gazetalar
          </button>
          <button
            onClick={() => setActiveTab('current')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'current'
                ? 'bg-[#5a5a40] text-[#f5f5f0] font-bold'
                : 'text-[#3c3c32]/70 hover:bg-[#e8e8df]'
            }`}
          >
            So‘nggi nashr (Avgust 2026)
          </button>
        </nav>
      </div>
    </header>
  );
};
