import React, { useState } from 'react';
import { Search, X, Volume2, BookOpen, FileText } from 'lucide-react';
import { useAccessibility } from '../lib/accessibilityContext';
import { Issue, Article } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIssue: (issueSlug: string) => void;
  onSelectArticle: (issueSlug: string, articleSlug: string) => void;
  onPlayArticleAudio: (article: Article) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectIssue,
  onSelectArticle,
  onPlayArticleAudio,
}) => {
  const { settings } = useAccessibility();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ issues: Issue[]; articles: any[] }>({ issues: [], articles: [] });
  const [isSearching, setIsSearching] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setResults({ issues: [], articles: [] });
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/public/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className={`w-full max-w-2xl rounded-[32px] p-6 border shadow-2xl space-y-4 max-h-[90vh] flex flex-col ${
        settings.highContrast
          ? 'bg-black border-yellow-400 text-yellow-300'
          : settings.darkMode
          ? 'bg-[#2a2a22] border-[#5a5a40]/30 text-[#f5f5f0]'
          : 'bg-[#e8e8df] border-[#5a5a40]/20 text-[#3c3c32]'
      }`}>
        
        {/* Header & Input */}
        <div className="flex items-center justify-between border-b pb-3 border-[#5a5a40]/20">
          <h2 className="text-lg font-serif italic font-bold flex items-center gap-2">
            <Search className="w-5 h-5 text-[#5a5a40]" />
            <span>Gazeta Bo‘yicha Qidiruv</span>
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-full text-[#3c3c32]/50 hover:text-[#3c3c32]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Gazeta nomi, mavzu yoki kalit so‘zni yozing..."
            className="w-full px-4 py-3.5 pl-11 rounded-full border border-[#5a5a40]/20 bg-[#f5f5f0] dark:bg-[#2a2a22] text-sm text-[#3c3c32] dark:text-[#f5f5f0] focus:outline-none focus:ring-2 focus:ring-[#5a5a40]"
            autoFocus
          />
          <Search className="w-5 h-5 text-[#5a5a40]/60 absolute left-4 top-4" />
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {isSearching && (
            <p className="text-center py-6 text-xs font-sans uppercase tracking-widest text-[#5a5a40]">
              Qidirilmoqda...
            </p>
          )}

          {!isSearching && query && results.issues.length === 0 && results.articles.length === 0 && (
            <div className="text-center py-8 space-y-2">
              <p className="font-serif italic font-bold text-lg text-[#3c3c32] dark:text-[#f5f5f0]">
                “{query}” bo‘yicha hech narsa topilmadi
              </p>
              <p className="text-xs font-sans text-[#3c3c32]/70">
                Iltimos, so‘zni to‘g‘ri yozganingizni tekshiring yoki boshqa kalit so‘z kiriting.
              </p>
            </div>
          )}

          {/* Matched Articles */}
          {results.articles.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-sans font-bold text-[10px] uppercase tracking-widest text-[#5a5a40] dark:text-[#f5f5f0]">
                Maqolalar ({results.articles.length})
              </h3>
              {results.articles.map((art: any) => (
                <div key={art.id} className="p-4 rounded-2xl border border-[#5a5a40]/15 bg-[#f5f5f0] dark:bg-[#2a2a22] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="px-2.5 py-0.5 text-[10px] font-sans font-bold uppercase tracking-wider rounded-full bg-[#5a5a40]/15 text-[#5a5a40] dark:text-[#f5f5f0]">
                      {art.issue_number} • {art.category}
                    </span>
                    <h4 className="font-serif italic font-bold text-base text-[#3c3c32] dark:text-[#f5f5f0] mt-1.5">
                      {art.title}
                    </h4>
                    <p className="text-xs font-sans text-[#3c3c32]/70 dark:text-[#f5f5f0]/70 line-clamp-2 mt-1">
                      {art.summary || art.final_text}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => {
                        onPlayArticleAudio(art);
                        onClose();
                      }}
                      className="px-3.5 py-2 rounded-full bg-[#5a5a40] hover:bg-[#4a4a34] text-[#f5f5f0] font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Tinglash</span>
                    </button>

                    <button
                      onClick={() => {
                        onSelectArticle(art.issue_slug, art.slug);
                        onClose();
                      }}
                      className="px-3.5 py-2 rounded-full bg-[#e8e8df] hover:bg-[#deded3] text-[#3c3c32] border border-[#5a5a40]/20 font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <BookOpen className="w-4 h-4 text-[#5a5a40]" />
                      <span>Ochish</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Matched Issues */}
          {results.issues.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-sans font-bold text-[10px] uppercase tracking-widest text-[#5a5a40] dark:text-[#f5f5f0]">
                Gazeta Nashrlari ({results.issues.length})
              </h3>
              {results.issues.map(iss => (
                <div key={iss.id} className="p-4 rounded-2xl border border-[#5a5a40]/15 bg-[#f5f5f0] dark:bg-[#2a2a22] flex items-center justify-between gap-3">
                  <div>
                    <h4 className="font-serif italic font-bold text-base text-[#3c3c32] dark:text-[#f5f5f0]">
                      {iss.title}
                    </h4>
                    <p className="text-xs font-sans text-[#3c3c32]/70 mt-0.5">
                      {iss.issue_number} • {iss.publication_date}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onSelectIssue(iss.slug);
                      onClose();
                    }}
                    className="px-4 py-2 rounded-full bg-[#5a5a40] hover:bg-[#4a4a34] text-[#f5f5f0] font-sans font-bold text-xs uppercase tracking-wider"
                  >
                    Ochish →
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
