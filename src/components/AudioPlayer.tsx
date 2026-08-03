import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, RotateCw, SkipBack, SkipForward, 
  Volume2, VolumeX, Gauge, Eye, Image as ImageIcon, RefreshCw, X
} from 'lucide-react';
import { useAccessibility } from '../lib/accessibilityContext';
import { speechManager } from '../lib/speechSynthesis';

interface AudioPlayerProps {
  title: string;
  subtitle: string;
  paragraphs: string[];
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onParagraphChange: (paragraphIndex: number) => void;
  showText: boolean;
  setShowText: (show: boolean) => void;
  showImages: boolean;
  setShowImages: (show: boolean) => void;
  onClosePlayer?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  title,
  subtitle,
  paragraphs,
  currentPage,
  totalPages,
  onPageChange,
  onParagraphChange,
  showText,
  setShowText,
  showImages,
  setShowImages,
  onClosePlayer,
}) => {
  const { settings, updateSetting } = useAccessibility();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  // Sync speed changes with SpeechSynthesisManager
  const handleSpeedChange = (speed: number) => {
    updateSetting('readingSpeed', speed);
    speechManager.setRate(speed);
    setShowSpeedMenu(false);
  };

  const startPlayback = (startIdx = 0) => {
    setIsPlaying(true);
    speechManager.setRate(settings.readingSpeed);
    speechManager.speakParagraphs(
      paragraphs,
      (idx) => {
        setCurrentParagraphIndex(idx);
        onParagraphChange(idx);
      },
      () => {
        setIsPlaying(false);
        // Automatically move to next page if available!
        if (currentPage < totalPages) {
          onPageChange(currentPage + 1);
        }
      },
      startIdx
    );
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      speechManager.pause();
      setIsPlaying(false);
    } else {
      if (currentParagraphIndex >= paragraphs.length) {
        startPlayback(0);
      } else {
        speechManager.resume();
        setIsPlaying(true);
        if (!isPlaying && currentParagraphIndex === 0) {
          startPlayback(0);
        }
      }
    }
  };

  const handleRestart = () => {
    setCurrentParagraphIndex(0);
    startPlayback(0);
  };

  const handleRewind10 = () => {
    speechManager.skipToPrevious();
  };

  const handleForward10 = () => {
    speechManager.skipToNext();
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      speechManager.stop();
      setIsPlaying(false);
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      speechManager.stop();
      setIsPlaying(false);
      onPageChange(currentPage + 1);
    }
  };

  // Progress percentage based on paragraphs
  const progressPercent = paragraphs.length > 0 
    ? Math.round(((currentParagraphIndex + 1) / paragraphs.length) * 100) 
    : 0;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 border-t shadow-lg transition-all ${
      settings.highContrast
        ? 'bg-black border-yellow-400 text-yellow-300'
        : settings.darkMode
        ? 'bg-[#2a2a22] border-[#5a5a40]/30 text-[#f5f5f0]'
        : 'bg-[#f5f5f0]/95 backdrop-blur-md border-[#5a5a40]/20 text-[#3c3c32]'
    }`}>
      {/* Top status bar & progress */}
      <div className="w-full bg-[#5a5a40]/10 h-1.5 relative overflow-hidden">
        <div 
          className="h-full bg-[#5a5a40] transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-3 py-2.5 sm:px-6 md:py-3.5">
        
        {/* Main Audio Header Info */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="px-2.5 py-0.5 text-[10px] uppercase font-sans font-bold tracking-widest rounded-full bg-[#5a5a40] text-[#f5f5f0] shrink-0">
              {currentPage}-bet / {totalPages}
            </span>
            <div className="truncate">
              <p className="font-serif italic font-bold text-sm sm:text-base truncate leading-tight">
                {title}
              </p>
              <p className="text-[11px] font-sans opacity-75 truncate">
                {subtitle} • Paragraph {currentParagraphIndex + 1}/{paragraphs.length || 1}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Toggle Text Display */}
            <button
              onClick={() => setShowText(!showText)}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-1 border ${
                showText 
                  ? 'bg-[#5a5a40] text-[#f5f5f0] border-[#5a5a40]' 
                  : 'bg-[#e8e8df] text-[#3c3c32] border-[#5a5a40]/15'
              }`}
              aria-label="Matnni ko‘rsatish yoki yashirish"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Matnni ko‘rsatish</span>
            </button>

            {/* Toggle Images Display */}
            <button
              onClick={() => setShowImages(!showImages)}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-1 border ${
                showImages 
                  ? 'bg-[#5a5a40] text-[#f5f5f0] border-[#5a5a40]' 
                  : 'bg-[#e8e8df] text-[#3c3c32] border-[#5a5a40]/15'
              }`}
              aria-label="Rasmlarni ko‘rsatish yoki yashirish"
            >
              <ImageIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Rasmlarni ko‘rsatish</span>
            </button>

            {onClosePlayer && (
              <button 
                onClick={onClosePlayer}
                className="p-1 rounded-full text-[#3c3c32]/50 hover:text-[#3c3c32]"
                aria-label="Pleyerni yopish"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Core Controls Grid */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          
          {/* Page Skip Controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className="px-3 py-2 rounded-full border border-[#5a5a40]/15 text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-1 disabled:opacity-40 hover:bg-[#5a5a40]/10"
              aria-label="Oldingi betga o‘tish"
            >
              <SkipBack className="w-4 h-4" />
              <span className="hidden md:inline">Oldingi bet</span>
            </button>

            <button
              onClick={handleRewind10}
              className="p-2.5 rounded-full border border-[#5a5a40]/15 text-xs font-sans font-bold flex items-center gap-1 hover:bg-[#5a5a40]/10"
              aria-label="Orqaga 10 soniya"
              title="Orqaga 10 soniya"
            >
              <RotateCcw className="w-4 h-4 text-[#5a5a40]" />
              <span className="text-[10px] sm:text-xs">10s</span>
            </button>
          </div>

          {/* PLAY / PAUSE Main Control */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleRestart}
              className="p-2 rounded-full text-[#3c3c32]/60 hover:bg-[#5a5a40]/10"
              title="Boshidan tinglash"
              aria-label="Boshidan tinglash"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={handlePlayPause}
              className={`px-7 py-3 rounded-full font-sans font-bold text-sm md:text-base flex items-center gap-2.5 shadow-md transition-transform active:scale-95 focus:ring-4 focus:ring-[#5a5a40]/30 ${
                settings.highContrast
                  ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                  : 'bg-[#5a5a40] hover:bg-[#4a4a34] text-[#f5f5f0]'
              }`}
              aria-label={isPlaying ? "To‘xtatish" : "Davom ettirish"}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  <span>To‘xtatish</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                  <span>Tinglash</span>
                </>
              )}
            </button>
          </div>

          {/* Next & Speed Selector */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={handleForward10}
              className="p-2.5 rounded-full border border-[#5a5a40]/15 text-xs font-sans font-bold flex items-center gap-1 hover:bg-[#5a5a40]/10"
              aria-label="Oldinga 10 soniya"
              title="Oldinga 10 soniya"
            >
              <span className="text-[10px] sm:text-xs">10s</span>
              <RotateCw className="w-4 h-4 text-[#5a5a40]" />
            </button>

            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="px-3 py-2 rounded-full border border-[#5a5a40]/15 text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-1 disabled:opacity-40 hover:bg-[#5a5a40]/10"
              aria-label="Keyingi betga o‘tish"
            >
              <span className="hidden md:inline">Keyingi bet</span>
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Speed Selector */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="px-3 py-2 rounded-full border border-[#5a5a40]/15 text-xs font-sans font-bold flex items-center gap-1 bg-[#e8e8df]"
                aria-label="Ovoz tezligini tanlash"
              >
                <Gauge className="w-4 h-4 text-[#5a5a40]" />
                <span>{settings.readingSpeed}x</span>
              </button>

              {showSpeedMenu && (
                <div className="absolute right-0 bottom-12 w-32 bg-[#f5f5f0] dark:bg-[#2a2a22] border border-[#5a5a40]/20 rounded-2xl shadow-xl py-2 z-50">
                  <div className="px-3 py-1 text-[10px] font-sans font-bold uppercase text-[#5a5a40]">
                    Ovoz tezligi
                  </div>
                  {[0.75, 1.0, 1.25, 1.5, 2.0].map(s => (
                    <button
                      key={s}
                      onClick={() => handleSpeedChange(s)}
                      className={`w-full text-left px-3 py-1.5 text-xs font-sans font-bold flex items-center justify-between hover:bg-[#5a5a40]/10 ${
                        settings.readingSpeed === s ? 'text-[#5a5a40] font-black' : ''
                      }`}
                    >
                      <span>{s}x</span>
                      {settings.readingSpeed === s && <span className="w-2 h-2 rounded-full bg-[#5a5a40]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
