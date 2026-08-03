import React, { useState, useRef, useEffect } from 'react';
import { 
  Volume2, Eye, EyeOff, Image as ImageIcon, ZoomIn, Maximize2, 
  ChevronLeft, ChevronRight, FileText, Sparkles, BookOpen 
} from 'lucide-react';
import { Page, Article } from '../types';
import { useAccessibility } from '../lib/accessibilityContext';

interface PageViewerProps {
  page: Page;
  totalPages: number;
  issueSlug: string;
  issueTitle: string;
  articles: Article[];
  activeParagraphIndex: number;
  showText: boolean;
  setShowText: (show: boolean) => void;
  showImages: boolean;
  setShowImages: (show: boolean) => void;
  onPageChange: (newPage: number) => void;
  onPlayPageAudio: () => void;
  onSelectArticle: (articleSlug: string) => void;
}

export const PageViewer: React.FC<PageViewerProps> = ({
  page,
  totalPages,
  issueSlug,
  issueTitle,
  articles,
  activeParagraphIndex,
  showText,
  setShowText,
  showImages,
  setShowImages,
  onPageChange,
  onPlayPageAudio,
  onSelectArticle,
}) => {
  const { settings } = useAccessibility();
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);
  const paragraphRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Auto scroll highlighted paragraph into view
  useEffect(() => {
    if (
      activeParagraphIndex >= 0 && 
      paragraphRefs.current[activeParagraphIndex] &&
      !settings.reduceMotion
    ) {
      paragraphRefs.current[activeParagraphIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeParagraphIndex, settings.reduceMotion]);

  // Extract paragraphs from text blocks or raw text
  const paragraphsList = page.text_blocks.length > 0
    ? page.text_blocks.map(tb => tb.final_text || tb.cleaned_text)
    : page.final_text.split(/(?<=[.!?])\s+/).filter(Boolean);

  // Related page articles
  const pageArticles = articles.filter(a => a.page_numbers.includes(page.page_number));

  return (
    <div className="space-y-6 pb-32">
      
      {/* Top Page Header & Navigation Bar */}
      <div className={`p-4 rounded-[24px] border flex flex-wrap items-center justify-between gap-3 shadow-2xs ${
        settings.highContrast
          ? 'bg-black border-yellow-400 text-yellow-300'
          : settings.darkMode
          ? 'bg-[#2a2a22] border-[#5a5a40]/30 text-[#f5f5f0]'
          : 'bg-[#e8e8df] border-[#5a5a40]/20 text-[#3c3c32]'
      }`}>
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-[#5a5a40] text-[#f5f5f0] font-serif font-bold text-lg flex items-center justify-center shrink-0">
            {page.page_number}
          </span>
          <div>
            <h2 className="font-serif italic font-bold text-lg md:text-xl leading-tight">
              {page.page_number}-bet
            </h2>
            <p className="text-xs font-sans opacity-75">
              {issueTitle} (Jami {totalPages} bet)
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          <button
            onClick={onPlayPageAudio}
            className={`px-4 py-2.5 rounded-full font-sans font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-2xs transition-transform active:scale-95 ${
              settings.highContrast
                ? 'bg-yellow-400 text-black'
                : 'bg-[#5a5a40] hover:bg-[#4a4a34] text-[#f5f5f0]'
            }`}
            aria-label="Ushbu betni audio tinglash"
          >
            <Volume2 className="w-4 h-4" />
            <span>Ushbu betni tinglash</span>
          </button>

          <button
            onClick={() => setShowText(!showText)}
            className="px-3.5 py-2.5 rounded-full border border-[#5a5a40]/20 text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#5a5a40]/10"
            aria-label={showText ? "Matnni yashirish" : "Matnni ko‘rsatish"}
          >
            {showText ? <EyeOff className="w-4 h-4 text-[#5a5a40]" /> : <Eye className="w-4 h-4 text-[#5a5a40]" />}
            <span>{showText ? "Matnni yashirish" : "Matnni ko‘rsatish"}</span>
          </button>

          <button
            onClick={() => setShowImages(!showImages)}
            className="px-3.5 py-2.5 rounded-full border border-[#5a5a40]/20 text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#5a5a40]/10"
            aria-label={showImages ? "Rasmlarni yashirish" : "Rasmlarni ko‘rsatish"}
          >
            <ImageIcon className="w-4 h-4 text-[#5a5a40]" />
            <span>{showImages ? "Rasmlarni yashirish" : "Rasmlarni ko‘rsatish"}</span>
          </button>
        </div>
      </div>

      {/* Main Page Grid: Original PDF preview vs Extracted text & Images */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Rendered Original PDF Page Preview */}
        {showImages && (
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="relative group rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 bg-slate-900 shadow-md">
              <img 
                src={page.original_page_image_url} 
                alt={`${page.page_number}-bet asl nusxasi`} 
                className="w-full h-auto object-contain max-h-[600px]"
              />
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  onClick={() => setIsFullscreenImage(true)}
                  className="p-2 bg-black/70 hover:bg-black text-white rounded-xl backdrop-blur-md shadow-lg"
                  title="Kattalashtirib ko‘rish"
                  aria-label="Rasm kattalashtirish"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>
              <div className="p-3 bg-slate-900/95 text-white text-xs flex items-center justify-between border-t border-slate-800">
                <span className="font-semibold text-slate-300">Asl PDF bet nusxasi</span>
                <span className="text-emerald-400 font-bold">Tekshirilgan va aniqlangan</span>
              </div>
            </div>

            {/* Extracted Photos for Page */}
            {page.images.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500">
                  Ushbu betdagi rasmlar ({page.images.length})
                </h3>
                {page.images.map((img, idx) => (
                  <div key={img.id || idx} className="rounded-xl border overflow-hidden p-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    <img 
                      src={img.optimized_url || img.original_url} 
                      alt={img.alt_text || 'Gazetadagi rasm'} 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {img.caption && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 italic px-1">
                        Surat matni: {img.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Right Column: Cleaned Text & Paragraph-level Highlighting */}
        <div className={`${showImages ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4`}>
          
          {/* Related Articles Cards */}
          {pageArticles.length > 0 && (
            <div className="p-5 rounded-[24px] bg-[#5a5a40]/10 border border-[#5a5a40]/20">
              <h3 className="font-sans font-bold text-xs text-[#5a5a40] dark:text-[#f5f5f0] uppercase tracking-widest mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#5a5a40]" />
                <span>Ushbu betdagi ajratilgan maqolalar</span>
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {pageArticles.map(art => (
                  <button
                    key={art.id}
                    onClick={() => onSelectArticle(art.slug)}
                    className="p-3.5 rounded-2xl bg-[#f5f5f0] dark:bg-[#2a2a22] border border-[#5a5a40]/15 text-left hover:border-[#5a5a40] transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <p className="font-serif italic font-bold text-base text-[#3c3c32] dark:text-[#f5f5f0] group-hover:text-[#5a5a40]">
                        {art.title}
                      </p>
                      <p className="text-xs font-sans text-[#3c3c32]/70 dark:text-[#f5f5f0]/70 line-clamp-1 mt-0.5">
                        {art.summary}
                      </p>
                    </div>
                    <span className="text-xs font-sans font-bold text-[#5a5a40] dark:text-[#f5f5f0] shrink-0 ml-2">
                      Maqolaga o‘tish →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Paragraph List with Highlighted Active Paragraph */}
          {showText && (
            <div className={`p-6 rounded-[28px] border shadow-2xs space-y-4 ${
              settings.highContrast
                ? 'bg-black border-yellow-400 text-yellow-300'
                : settings.darkMode
                ? 'bg-[#2a2a22] border-[#5a5a40]/30 text-[#f5f5f0]'
                : 'bg-[#e8e8df] border-[#5a5a40]/15 text-[#3c3c32]'
            }`}>
              
              <div className="flex items-center justify-between pb-3 border-b border-[#5a5a40]/15">
                <span className="font-sans font-bold text-[10px] uppercase tracking-widest opacity-60">
                  O‘qilayotgan matn parchalari
                </span>
                <span className="text-xs font-sans opacity-60">
                  Har bir xatboshi audio bilan moslashtirilgan
                </span>
              </div>

              {page.text_blocks.length > 0 ? (
                page.text_blocks.map((tb, idx) => {
                  const isActive = idx === activeParagraphIndex;
                  return (
                    <div
                      key={tb.id || idx}
                      ref={el => paragraphRefs.current[idx] = el}
                      className={`p-4 rounded-2xl transition-all duration-300 ${
                        tb.type === 'heading' ? 'font-serif italic font-bold text-2xl md:text-3xl text-[#5a5a40] dark:text-[#f5f5f0] border-b border-[#5a5a40]/15 pb-2' :
                        tb.type === 'subheading' ? 'font-serif italic font-bold text-xl text-[#3c3c32] dark:text-[#f5f5f0]' :
                        tb.type === 'caption' ? 'text-sm italic font-serif opacity-75' :
                        'text-base md:text-lg font-sans leading-relaxed'
                      } ${
                        isActive
                          ? settings.highContrast
                            ? 'bg-yellow-400 text-black ring-4 ring-yellow-300 font-bold scale-[1.01]'
                            : 'bg-[#5a5a40] text-[#f5f5f0] border-l-8 border-[#3c3c32] pl-5 shadow-sm font-medium rounded-r-2xl'
                          : 'hover:bg-[#5a5a40]/10'
                      }`}
                    >
                      {isActive && (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-sans font-bold uppercase tracking-widest text-[#f5f5f0] mb-1.5 block">
                          <Volume2 className="w-4 h-4 animate-pulse text-[#f5f5f0]" />
                          <span>Hozir o‘qilmoqda</span>
                        </span>
                      )}
                      {tb.final_text || tb.cleaned_text}
                    </div>
                  );
                })
              ) : (
                paragraphsList.map((para, idx) => {
                  const isActive = idx === activeParagraphIndex;
                  return (
                    <p
                      key={idx}
                      ref={el => paragraphRefs.current[idx] = el}
                      className={`p-4 rounded-2xl font-sans leading-relaxed transition-all duration-300 text-base md:text-lg ${
                        isActive
                          ? settings.highContrast
                            ? 'bg-yellow-400 text-black ring-4 ring-yellow-300 font-bold'
                            : 'bg-[#5a5a40] text-[#f5f5f0] border-l-8 border-[#3c3c32] shadow-sm font-medium rounded-r-2xl'
                          : 'hover:bg-[#5a5a40]/10'
                      }`}
                    >
                      {para}
                    </p>
                  );
                })
              )}

            </div>
          )}

          {/* Bottom Page Navigation Controls */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => onPageChange(page.page_number - 1)}
              disabled={page.page_number <= 1}
              className="px-5 py-3 rounded-full bg-[#e8e8df] dark:bg-[#2a2a22] hover:bg-[#deded3] text-[#3c3c32] dark:text-[#f5f5f0] font-sans font-bold text-xs uppercase tracking-widest flex items-center gap-2 disabled:opacity-40 border border-[#5a5a40]/15"
              aria-label="Oldingi betga o‘tish"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>{page.page_number - 1}-bet (Oldingi)</span>
            </button>

            <button
              onClick={() => onPageChange(page.page_number + 1)}
              disabled={page.page_number >= totalPages}
              className="px-5 py-3 rounded-full bg-[#5a5a40] hover:bg-[#4a4a34] text-[#f5f5f0] font-sans font-bold text-xs uppercase tracking-widest flex items-center gap-2 disabled:opacity-40 shadow-xs"
              aria-label="Keyingi betga o‘tish"
            >
              <span>{page.page_number + 1}-bet (Keyingi)</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>

      {/* Fullscreen Image Zoom Modal */}
      {isFullscreenImage && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-md">
          <div className="absolute top-4 right-4 flex items-center gap-3">
            <button
              onClick={() => setIsFullscreenImage(false)}
              className="px-4 py-2 bg-white text-black font-bold rounded-xl shadow-lg hover:bg-slate-200"
            >
              Yopish ✕
            </button>
          </div>
          <div className="max-w-4xl max-h-[90vh] overflow-auto rounded-xl">
            <img 
              src={page.original_page_image_url} 
              alt={`${page.page_number}-bet to‘liq rasmi`}
              className="w-full h-auto object-contain" 
            />
          </div>
        </div>
      )}

    </div>
  );
};
