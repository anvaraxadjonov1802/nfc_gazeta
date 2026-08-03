import React, { useState } from 'react';
import { Volume2, ArrowLeft, BookOpen, Clock, User, Tag, Sparkles } from 'lucide-react';
import { Article } from '../types';
import { useAccessibility } from '../lib/accessibilityContext';
import { speechManager } from '../lib/speechSynthesis';

interface ArticleViewerProps {
  article: Article;
  issueSlug: string;
  onGoToPage: (pageNumber: number) => void;
  onBackToIssue: () => void;
}

export const ArticleViewer: React.FC<ArticleViewerProps> = ({
  article,
  issueSlug,
  onGoToPage,
  onBackToIssue,
}) => {
  const { settings } = useAccessibility();
  const [activeParaIndex, setActiveParaIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const paragraphs = article.paragraphs.length > 0 
    ? article.paragraphs 
    : article.final_text.split(/(?<=[.!?])\s+/).filter(Boolean);

  const handlePlayFull = () => {
    setIsPlaying(true);
    speechManager.speakParagraphs(
      paragraphs,
      (idx) => setActiveParaIndex(idx),
      () => setIsPlaying(false)
    );
  };

  const handlePlaySummary = () => {
    setIsPlaying(true);
    speechManager.speakParagraphs(
      [article.summary],
      (idx) => setActiveParaIndex(0),
      () => setIsPlaying(false)
    );
  };

  const handleStop = () => {
    speechManager.stop();
    setIsPlaying(false);
  };

  return (
    <div className="space-y-6 pb-32 max-w-4xl mx-auto">
      
      {/* Back Button */}
      <button
        onClick={onBackToIssue}
        className="px-5 py-2.5 rounded-full bg-[#e8e8df] dark:bg-[#2a2a22] hover:bg-[#deded3] text-[#3c3c32] dark:text-[#f5f5f0] font-sans font-bold text-xs uppercase tracking-widest flex items-center gap-2 border border-[#5a5a40]/15"
        aria-label="Gazetaga qaytish"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Gazetaga qaytish</span>
      </button>

      {/* Article Header Card */}
      <div className={`p-6 md:p-8 rounded-[32px] border shadow-2xs ${
        settings.highContrast
          ? 'bg-black border-yellow-400 text-yellow-300'
          : settings.darkMode
          ? 'bg-[#2a2a22] border-[#5a5a40]/30 text-[#f5f5f0]'
          : 'bg-[#e8e8df] border-[#5a5a40]/20 text-[#3c3c32]'
      }`}>
        
        <div className="flex flex-wrap items-center gap-2 mb-4 text-xs font-sans font-bold">
          <span className="px-3 py-1 rounded-full bg-[#5a5a40]/15 text-[#5a5a40] dark:text-[#f5f5f0] flex items-center gap-1 uppercase tracking-wider text-[10px]">
            <Tag className="w-3.5 h-3.5" />
            <span>{article.category}</span>
          </span>

          {article.author && (
            <span className="px-3 py-1 rounded-full bg-[#5a5a40]/10 text-[#3c3c32] dark:text-[#f5f5f0] flex items-center gap-1 uppercase tracking-wider text-[10px]">
              <User className="w-3.5 h-3.5" />
              <span>Muallif: {article.author}</span>
            </span>
          )}

          <span className="px-3 py-1 rounded-full bg-[#5a5a40]/10 text-[#3c3c32] dark:text-[#f5f5f0] flex items-center gap-1 uppercase tracking-wider text-[10px]">
            <Clock className="w-3.5 h-3.5" />
            <span>~{Math.ceil(article.estimated_duration / 60)} daqiqa</span>
          </span>
        </div>

        <h1 className="text-2xl md:text-4xl font-serif italic font-bold tracking-tight leading-tight mb-4 text-[#3c3c32] dark:text-[#f5f5f0]">
          {article.title}
        </h1>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 pt-2 pb-4 border-b border-[#5a5a40]/15">
          <button
            onClick={isPlaying ? handleStop : handlePlayFull}
            className={`px-6 py-3 rounded-full font-sans font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-xs transition-transform active:scale-95 ${
              settings.highContrast
                ? 'bg-yellow-400 text-black'
                : 'bg-[#5a5a40] hover:bg-[#4a4a34] text-[#f5f5f0]'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isPlaying ? "Audio to‘xtatish" : "To‘liq tinglash"}</span>
          </button>

          <button
            onClick={handlePlaySummary}
            className="px-5 py-3 rounded-full bg-[#5a5a40]/10 hover:bg-[#5a5a40]/20 text-[#3c3c32] dark:text-[#f5f5f0] font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-[#5a5a40]/20"
          >
            <Sparkles className="w-4 h-4 text-[#5a5a40]" />
            <span>Qisqacha tinglash (1 min)</span>
          </button>

          {article.page_numbers.length > 0 && (
            <button
              onClick={() => onGoToPage(article.page_numbers[0])}
              className="px-5 py-3 rounded-full bg-[#f5f5f0] dark:bg-[#2a2a22] hover:bg-[#deded3] text-[#3c3c32] dark:text-[#f5f5f0] font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-[#5a5a40]/15"
            >
              <BookOpen className="w-4 h-4 text-[#5a5a40]" />
              <span>Gazetadagi asl {article.page_numbers[0]}-betni ko‘rish</span>
            </button>
          )}
        </div>

        {/* Main Article Image */}
        {article.main_image_url && (
          <div className="my-6 rounded-2xl overflow-hidden border border-[#5a5a40]/20">
            <img 
              src={article.main_image_url} 
              alt={article.title} 
              className="w-full h-auto max-h-96 object-cover"
            />
          </div>
        )}

        {/* Summary Card */}
        <div className="p-5 my-6 rounded-2xl bg-[#5a5a40]/10 border border-[#5a5a40]/20">
          <h3 className="font-sans font-bold text-[10px] uppercase tracking-widest text-[#5a5a40] dark:text-[#f5f5f0] mb-1">
            Qisqacha Mazmun:
          </h3>
          <p className="text-base font-serif italic font-bold text-[#3c3c32] dark:text-[#f5f5f0]">
            {article.summary}
          </p>
        </div>

        {/* Body Paragraphs */}
        <div className="space-y-4">
          {paragraphs.map((para, idx) => {
            const isActive = idx === activeParaIndex && isPlaying;
            return (
              <p
                key={idx}
                className={`p-4 rounded-2xl text-base md:text-lg font-sans leading-relaxed transition-all duration-300 ${
                  isActive
                    ? 'bg-[#5a5a40] text-[#f5f5f0] border-l-8 border-[#3c3c32] font-medium shadow-sm'
                    : 'hover:bg-[#5a5a40]/10'
                }`}
              >
                {para}
              </p>
            );
          })}
        </div>

      </div>

    </div>
  );
};
