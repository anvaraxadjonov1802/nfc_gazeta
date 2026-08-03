import React from 'react';
import { Play, Pause, SkipForward, SkipBack, HelpCircle, X, Volume2 } from 'lucide-react';
import { useAccessibility } from '../lib/accessibilityContext';

interface SoddaRejimOverlayProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onOpenHelp: () => void;
  onExitSimpleMode: () => void;
  currentTitle?: string;
}

export const SoddaRejimOverlay: React.FC<SoddaRejimOverlayProps> = ({
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onOpenHelp,
  onExitSimpleMode,
  currentTitle = 'Temiryo‘l Ovozli Gazeta'
}) => {
  const { settings } = useAccessibility();

  return (
    <div className={`fixed inset-0 z-50 p-4 md:p-8 flex flex-col justify-between select-none ${
      settings.highContrast
        ? 'bg-black text-yellow-300'
        : 'bg-[#2a2a22] text-[#f5f5f0]'
    }`}>
      
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-[#5a5a40]/30">
        <div className="flex items-center gap-3">
          <Volume2 className="w-8 h-8 text-[#f5f5f0] animate-pulse" />
          <div>
            <h2 className="text-xl md:text-2xl font-serif italic font-bold tracking-wider text-[#f5f5f0]">
              Sodda Rejim (Audio Gazeta)
            </h2>
            <p className="text-xs md:text-sm font-sans opacity-80 truncate max-w-xs sm:max-w-md">
              {currentTitle}
            </p>
          </div>
        </div>

        <button
          onClick={onExitSimpleMode}
          className="px-5 py-2.5 bg-[#e8e8df] text-[#3c3c32] font-sans font-bold text-xs uppercase tracking-widest rounded-full shadow-lg"
          aria-label="Sodda rejimdan chiqish"
        >
          Standart rejim ✕
        </button>
      </div>

      {/* Center Huge Controls Grid - Maximum touch targets and visibility */}
      <div className="my-auto max-w-xl mx-auto w-full space-y-4">
        
        {/* Play/Pause Button - Massive Primary Target */}
        <button
          onClick={isPlaying ? onPause : onPlay}
          className={`w-full py-8 px-6 rounded-full font-sans font-bold text-2xl md:text-3xl flex items-center justify-center gap-6 shadow-2xl transition-transform active:scale-95 ring-8 ${
            isPlaying 
              ? 'bg-[#e8e8df] text-[#3c3c32] ring-[#e8e8df]/30' 
              : 'bg-[#5a5a40] text-[#f5f5f0] ring-[#5a5a40]/40'
          }`}
          aria-label={isPlaying ? "To‘xtatish" : "Tinglashni boshlash"}
        >
          {isPlaying ? (
            <>
              <Pause className="w-10 h-10 fill-current" />
              <span>To‘xtatish</span>
            </>
          ) : (
            <>
              <Play className="w-10 h-10 fill-current ml-2" />
              <span>Tinglash</span>
            </>
          )}
        </button>

        {/* Prev / Next Page Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onPrev}
            className="py-6 px-4 rounded-3xl bg-[#3c3c32] border border-[#5a5a40]/40 text-[#f5f5f0] font-sans font-bold text-lg md:text-xl flex items-center justify-center gap-3 active:scale-95 shadow-xl"
            aria-label="Orqaga poyezd yoki bet"
          >
            <SkipBack className="w-7 h-7 text-[#f5f5f0]" />
            <span>Orqaga</span>
          </button>

          <button
            onClick={onNext}
            className="py-6 px-4 rounded-3xl bg-[#3c3c32] border border-[#5a5a40]/40 text-[#f5f5f0] font-sans font-bold text-lg md:text-xl flex items-center justify-center gap-3 active:scale-95 shadow-xl"
            aria-label="Keyingi poyezd yoki bet"
          >
            <span>Keyingi</span>
            <SkipForward className="w-7 h-7 text-[#f5f5f0]" />
          </button>
        </div>

        {/* Help Button */}
        <button
          onClick={onOpenHelp}
          className="w-full py-5 px-4 rounded-3xl bg-[#5a5a40]/30 border border-[#5a5a40]/50 text-[#f5f5f0] font-sans font-bold text-base flex items-center justify-center gap-3 active:scale-95 shadow-lg"
          aria-label="Yordam va ko‘rsatmalar"
        >
          <HelpCircle className="w-6 h-6" />
          <span>Yordam va Yo‘riqnoma</span>
        </button>

      </div>

      {/* Footer Instructions */}
      <div className="text-center pt-4 border-t border-white/20 text-xs md:text-sm text-slate-300 font-semibold">
        Telefon ovozini ko‘tarishingiz mumkin. Ekranga har qanday teginish orqali boshqarishingiz oson.
      </div>

    </div>
  );
};
