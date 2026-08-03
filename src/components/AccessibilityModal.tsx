import React from 'react';
import { Eye, Sun, Moon, Volume2, Sparkles, RefreshCw, X, Check, Type, ZapOff } from 'lucide-react';
import { useAccessibility } from '../lib/accessibilityContext';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSetting, resetSettings } = useAccessibility();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className={`w-full max-w-lg rounded-[32px] p-6 md:p-8 border shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto ${
        settings.highContrast
          ? 'bg-black border-yellow-400 text-yellow-300'
          : settings.darkMode
          ? 'bg-[#2a2a22] border-[#5a5a40]/30 text-[#f5f5f0]'
          : 'bg-[#e8e8df] border-[#5a5a40]/20 text-[#3c3c32]'
      }`}>
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#5a5a40]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5a5a40] text-[#f5f5f0] flex items-center justify-center font-bold">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-serif italic font-bold tracking-tight">
                Imkoniyatlar va Sozlamalar
              </h2>
              <p className="text-xs font-sans opacity-75">
                Ovoz va ko‘rish uchun moslashtirilgan interfeys
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#3c3c32]/50 hover:text-[#3c3c32]"
            aria-label="Sozlamalarni yopish"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Options List */}
        <div className="space-y-4">
          
          {/* Text Size Controls */}
          <div className="p-4 rounded-2xl border border-[#5a5a40]/20 space-y-2 bg-[#f5f5f0]/50 dark:bg-[#2a2a22]/50">
            <label className="font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-2 text-[#5a5a40] dark:text-[#f5f5f0]">
              <Type className="w-4 h-4 text-[#5a5a40]" />
              <span>Matn hajmini tanlash</span>
            </label>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { id: 'normal', label: 'Oddiy' },
                { id: 'large', label: 'Katta' },
                { id: 'xlarge', label: 'Juda katta' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => updateSetting('textSize', opt.id as any)}
                  className={`py-2.5 px-3 rounded-full text-xs font-sans font-bold uppercase tracking-wider border transition-all ${
                    settings.textSize === opt.id
                      ? 'bg-[#5a5a40] text-[#f5f5f0] border-[#5a5a40] shadow-xs'
                      : 'bg-[#f5f5f0] dark:bg-[#2a2a22] border-[#5a5a40]/20 text-[#3c3c32] dark:text-[#f5f5f0]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast */}
          <div className="p-4 rounded-2xl border border-[#5a5a40]/20 bg-[#f5f5f0]/50 dark:bg-[#2a2a22]/50 flex items-center justify-between">
            <div>
              <p className="font-sans font-bold text-sm">Yuqori kontrast (Sariq / Qora)</p>
              <p className="text-xs font-sans text-[#3c3c32]/70 dark:text-[#f5f5f0]/70">Ko‘zi ojiz va zaif ko‘ruvchilar uchun alohida sariq va qora kontrast</p>
            </div>
            <button
              onClick={() => updateSetting('highContrast', !settings.highContrast)}
              className={`w-14 h-8 rounded-full p-1 transition-colors ${
                settings.highContrast ? 'bg-yellow-400' : 'bg-[#5a5a40]/20'
              }`}
              aria-label="Yuqori kontrastni yoqish yoki o‘chirish"
            >
              <div className={`w-6 h-6 rounded-full bg-black transition-transform ${
                settings.highContrast ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Dark Mode */}
          <div className="p-4 rounded-2xl border border-[#5a5a40]/20 bg-[#f5f5f0]/50 dark:bg-[#2a2a22]/50 flex items-center justify-between">
            <div>
              <p className="font-sans font-bold text-sm">Qora fon (Tungi rejim)</p>
              <p className="text-xs font-sans text-[#3c3c32]/70 dark:text-[#f5f5f0]/70">Ko‘zni toalmaydigan to‘q fon rejimiga o‘tish</p>
            </div>
            <button
              onClick={() => updateSetting('darkMode', !settings.darkMode)}
              className={`w-14 h-8 rounded-full p-1 transition-colors ${
                settings.darkMode ? 'bg-[#5a5a40]' : 'bg-[#5a5a40]/20'
              }`}
              aria-label="Qora fonni yoqish yoki o‘chirish"
            >
              <div className={`w-6 h-6 rounded-full bg-white transition-transform ${
                settings.darkMode ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Reduce Motion */}
          <div className="p-4 rounded-2xl border border-[#5a5a40]/20 bg-[#f5f5f0]/50 dark:bg-[#2a2a22]/50 flex items-center justify-between">
            <div>
              <p className="font-sans font-bold text-sm">Animatsiyani kamaytirish</p>
              <p className="text-xs font-sans text-[#3c3c32]/70 dark:text-[#f5f5f0]/70">Keraksiz harakat va o‘tish effektlarini cheklash</p>
            </div>
            <button
              onClick={() => updateSetting('reduceMotion', !settings.reduceMotion)}
              className={`w-14 h-8 rounded-full p-1 transition-colors ${
                settings.reduceMotion ? 'bg-[#5a5a40]' : 'bg-[#5a5a40]/20'
              }`}
              aria-label="Animatsiyani kamaytirish"
            >
              <div className={`w-6 h-6 rounded-full bg-white transition-transform ${
                settings.reduceMotion ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Audio Only Mode */}
          <div className="p-4 rounded-2xl border border-[#5a5a40]/20 bg-[#f5f5f0]/50 dark:bg-[#2a2a22]/50 flex items-center justify-between">
            <div>
              <p className="font-sans font-bold text-sm">Faqat audio rejimi</p>
              <p className="text-xs font-sans text-[#3c3c32]/70 dark:text-[#f5f5f0]/70">Rasmlar va murakkab dizaynlarsiz faqat audioni tinglash</p>
            </div>
            <button
              onClick={() => updateSetting('audioOnlyMode', !settings.audioOnlyMode)}
              className={`w-14 h-8 rounded-full p-1 transition-colors ${
                settings.audioOnlyMode ? 'bg-[#5a5a40]' : 'bg-[#5a5a40]/20'
              }`}
              aria-label="Faqat audio rejimini yoqish"
            >
              <div className={`w-6 h-6 rounded-full bg-white transition-transform ${
                settings.audioOnlyMode ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Simple Mode (Sodda rejim) */}
          <div className="p-4 rounded-2xl border border-[#5a5a40]/30 bg-[#5a5a40]/10 text-[#3c3c32] dark:text-[#f5f5f0] flex items-center justify-between">
            <div>
              <p className="font-sans font-bold text-sm">Sodda rejim (Keksa va zaif ko‘ruvchilar)</p>
              <p className="text-xs font-sans opacity-80">Ekran sahifasida faqat eng katta 5 ta tugma qoldiriladi</p>
            </div>
            <button
              onClick={() => updateSetting('simpleMode', !settings.simpleMode)}
              className={`w-14 h-8 rounded-full p-1 transition-colors ${
                settings.simpleMode ? 'bg-[#5a5a40]' : 'bg-[#5a5a40]/20'
              }`}
              aria-label="Sodda rejimni yoqish"
            >
              <div className={`w-6 h-6 rounded-full bg-white transition-transform ${
                settings.simpleMode ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-[#5a5a40]/20 flex items-center justify-between">
          <button
            onClick={resetSettings}
            className="px-3 py-2 text-xs font-sans font-bold text-[#5a5a40] hover:underline flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Sozlamalarni tiklash</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#5a5a40] hover:bg-[#4a4a34] text-[#f5f5f0] font-sans font-bold text-xs uppercase tracking-widest shadow-xs"
          >
            Saqlash va Yopish
          </button>
        </div>

      </div>
    </div>
  );
};
