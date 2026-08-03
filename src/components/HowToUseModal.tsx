import React from 'react';
import { Nfc, Smartphone, Volume2, CheckCircle2, X } from 'lucide-react';
import { useAccessibility } from '../lib/accessibilityContext';

interface HowToUseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToUseModal: React.FC<HowToUseModalProps> = ({ isOpen, onClose }) => {
  const { settings } = useAccessibility();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className={`w-full max-w-lg rounded-[32px] p-6 md:p-8 border shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto ${
        settings.highContrast
          ? 'bg-black border-yellow-400 text-yellow-300'
          : settings.darkMode
          ? 'bg-[#2a2a22] border-[#5a5a40]/30 text-[#f5f5f0]'
          : 'bg-[#e8e8df] border-[#5a5a40]/20 text-[#3c3c32]'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#5a5a40]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5a5a40] text-[#f5f5f0] flex items-center justify-center font-bold">
              <Nfc className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-serif italic font-bold tracking-tight">
                Qanday Foydalaniladi?
              </h2>
              <p className="text-xs font-sans opacity-75">
                NFC va Ovozli Gazetadan foydalanish yo‘riqnomasi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#3c3c32]/50 hover:text-[#3c3c32]"
            aria-label="Yo‘riqnomani yopish"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Step-by-step Cards */}
        <div className="space-y-4">
          
          <div className="p-4 rounded-2xl bg-[#f5f5f0] dark:bg-[#2a2a22] border border-[#5a5a40]/15 flex items-start gap-4">
            <div className="w-9 h-9 rounded-full bg-[#5a5a40] text-[#f5f5f0] font-sans font-bold text-sm flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <h3 className="font-serif italic font-bold text-base text-[#3c3c32] dark:text-[#f5f5f0]">
                NFC belgisiga telefonni yaqinlashtiring
              </h3>
              <p className="text-xs font-sans text-[#3c3c32]/70 dark:text-[#f5f5f0]/70 mt-1">
                Bosma gazetaning muqovasidagi yoki vokzaldagi NFC belgisiga telefoningiz orqasini 2-3 soniya tekkizib turing.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#f5f5f0] dark:bg-[#2a2a22] border border-[#5a5a40]/15 flex items-start gap-4">
            <div className="w-9 h-9 rounded-full bg-[#5a5a40] text-[#f5f5f0] font-sans font-bold text-sm flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <h3 className="font-serif italic font-bold text-base text-[#3c3c32] dark:text-[#f5f5f0]">
                Gazeta avtomatik ochiladi
              </h3>
              <p className="text-xs font-sans text-[#3c3c32]/70 dark:text-[#f5f5f0]/70 mt-1">
                Mobil brauzerda tegishli gazeta soni hech qanday ilova o‘rnatmasdan to‘g‘ridan-to‘g‘ri ochiladi.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#f5f5f0] dark:bg-[#2a2a22] border border-[#5a5a40]/15 flex items-start gap-4">
            <div className="w-9 h-9 rounded-full bg-[#5a5a40] text-[#f5f5f0] font-sans font-bold text-sm flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <h3 className="font-serif italic font-bold text-base text-[#3c3c32] dark:text-[#f5f5f0]">
                Tinglashni boshlang
              </h3>
              <p className="text-xs font-sans text-[#3c3c32]/70 dark:text-[#f5f5f0]/70 mt-1">
                Ekrandagi ulkan <strong>“Gazetani tinglash”</strong> tugmasini bosing. Har bir xatboshi ketma-ket ovozli o‘qiladi.
              </p>
            </div>
          </div>

        </div>

        {/* Simple Mode Note */}
        <div className="p-4 rounded-2xl bg-[#5a5a40]/10 border border-[#5a5a40]/20 text-[#3c3c32] dark:text-[#f5f5f0] text-xs font-sans">
          <strong>Maslahat:</strong> Agar ko‘rishda qiyinchilik bo‘lsa, ekranning yuqori qismidagi <strong>“Sodda rejim”</strong> tugmasini bosing.
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-full bg-[#5a5a40] hover:bg-[#4a4a34] text-[#f5f5f0] font-sans font-bold text-xs uppercase tracking-widest shadow-xs"
        >
          Tushunarli, Yopish
        </button>

      </div>
    </div>
  );
};
