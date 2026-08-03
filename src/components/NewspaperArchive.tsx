import React, { useState } from 'react';
import { Search, Calendar, FileText, ArrowRight, ArrowLeft } from 'lucide-react';
import { Issue } from '../types';
import { useAccessibility } from '../lib/accessibilityContext';

interface NewspaperArchiveProps {
  issues: Issue[];
  onSelectIssue: (slug: string) => void;
  onBack: () => void;
}

export const NewspaperArchive: React.FC<NewspaperArchiveProps> = ({
  issues,
  onSelectIssue,
  onBack,
}) => {
  const { settings } = useAccessibility();
  const [search, setSearch] = useState('');

  const filtered = issues.filter(i => 
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    i.issue_number.toLowerCase().includes(search.toLowerCase()) ||
    i.publication_date.includes(search)
  );

  return (
    <div className="space-y-6 pb-32">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#5a5a40]/20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-full bg-[#e8e8df] dark:bg-[#2a2a22] text-[#3c3c32] dark:text-[#f5f5f0] border border-[#5a5a40]/15"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-serif italic font-bold text-[#3c3c32] dark:text-[#f5f5f0]">
              Gazeta Nashrlari Arxivi
            </h1>
            <p className="text-xs font-sans opacity-70">
              Barcha o‘tgan oylar va yillardagi temiryo‘l gazetalarining ovozli nusxalari
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Arxivdan qidirish..."
            className="w-full pl-9 pr-4 py-2 rounded-full border border-[#5a5a40]/20 bg-[#f5f5f0] dark:bg-[#2a2a22] text-xs font-sans font-bold text-[#3c3c32] dark:text-[#f5f5f0]"
          />
          <Search className="w-4 h-4 text-[#5a5a40]/60 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((issue) => (
          <div
            key={issue.id}
            onClick={() => onSelectIssue(issue.slug)}
            className="p-5 rounded-[28px] bg-[#e8e8df] dark:bg-[#2a2a22] border border-[#5a5a40]/20 shadow-2xs hover:border-[#5a5a40] cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-[#f5f5f0] mb-4 border border-[#5a5a40]/10">
                <img
                  src={issue.cover_image_url}
                  alt={issue.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-wider rounded-full bg-[#5a5a40]/15 text-[#5a5a40] dark:text-[#f5f5f0]">
                {issue.issue_number} • {issue.publication_date}
              </span>
              <h3 className="font-serif italic font-bold text-lg text-[#3c3c32] dark:text-[#f5f5f0] mt-2 group-hover:text-[#5a5a40]">
                {issue.title}
              </h3>
              <p className="text-xs font-sans text-[#3c3c32]/70 dark:text-[#f5f5f0]/70 line-clamp-2 mt-1">
                {issue.summary}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-[#5a5a40]/15 flex items-center justify-between text-xs font-sans font-bold">
              <span className="opacity-60">{issue.page_count} bet</span>
              <span className="text-[#5a5a40] dark:text-[#f5f5f0] uppercase tracking-wider flex items-center gap-1">
                Tinglash <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
