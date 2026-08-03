import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Eye, Volume2, CheckCircle, AlertCircle, Copy, 
  Globe, Lock, RefreshCw, Trash2, ArrowLeft, QrCode, FileText, Sparkles 
} from 'lucide-react';
import { Issue, Page, User } from '../types';
import { AdminPdfUpload } from './AdminPdfUpload';
import { QrCodeModal } from './QrCodeModal';

interface AdminDashboardProps {
  onBackToApp: () => void;
  onOpenIssuePreview: (slug: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToApp, onOpenIssuePreview }) => {
  const [user, setUser] = useState<User | null>({
    id: 'usr-1',
    email: 'admin@temiryol.uz',
    full_name: 'Alisher Qodirov',
    role: 'super_admin',
    is_active: true,
    created_at: '',
    updated_at: ''
  });
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [issuePages, setIssuePages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [editingText, setEditingText] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const fetchIssues = async () => {
    try {
      const res = await fetch('/api/admin/issues');
      const data = await res.json();
      setIssues(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleSelectIssue = async (issue: Issue) => {
    setSelectedIssue(issue);
    try {
      const res = await fetch(`/api/public/issues/${issue.slug}`);
      const data = await res.json();
      setIssuePages(data.pages || []);
      if (data.pages && data.pages.length > 0) {
        setSelectedPage(data.pages[0]);
        setEditingText(data.pages[0].final_text);
      } else {
        setSelectedPage(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSavePageText = async () => {
    if (!selectedPage) return;
    try {
      const res = await fetch(`/api/admin/pages/${selectedPage.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ final_text: editingText })
      });
      const updated = await res.json();
      setSelectedPage(updated);
      setIssuePages(prev => prev.map(p => p.id === updated.id ? updated : p));
      setStatusMsg('Matn muvaffaqiyatli saqlandi!');
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (e) {
      setStatusMsg('Saqlashda xatolik yuz berdi');
    }
  };

  const handleRegenerateAudio = async () => {
    if (!selectedPage) return;
    try {
      const res = await fetch(`/api/admin/pages/${selectedPage.id}/regenerate-audio`, {
        method: 'POST'
      });
      const result = await res.json();
      setSelectedPage(result.page);
      setStatusMsg('Audio qayta tayyorlandi!');
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (e) {
      setStatusMsg('Audio tayyorlashda xatolik');
    }
  };

  const handlePublishToggle = async (issue: Issue) => {
    const endpoint = issue.is_public ? `/api/admin/issues/${issue.id}/unpublish` : `/api/admin/issues/${issue.id}/publish`;
    try {
      const res = await fetch(endpoint, { method: 'POST' });
      const updated = await res.json();
      setIssues(prev => prev.map(i => i.id === updated.id ? updated : i));
      if (selectedIssue && selectedIssue.id === updated.id) {
        setSelectedIssue(updated);
      }
      setStatusMsg(updated.is_public ? 'Nashr e’lon qilindi!' : 'Nashr e’londan olindi');
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (e) {}
  };

  const handleCopyNfcUrl = (slug: string) => {
    const url = `${window.location.origin}/nfc/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 md:p-8">
      
      {/* Top Admin Header */}
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToApp}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200"
            aria-label="Saytga qaytish"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-xl md:text-2xl">
                Administrator Kabineti
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-slate-500">
              O‘zbekiston Temir yo‘llari raqamli gazeta boshqaruv paneli
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowUpload(true)}
          className="px-5 py-3 rounded-2xl bg-red-700 hover:bg-red-800 text-white font-bold text-sm flex items-center gap-2 shadow-md"
        >
          <Plus className="w-5 h-5" />
          <span>Yangi PDF Yuklash</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        
        {statusMsg && (
          <div className="mb-4 p-4 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-md flex items-center justify-between">
            <span>{statusMsg}</span>
            <button onClick={() => setStatusMsg(null)}>✕</button>
          </div>
        )}

        {/* Show Upload Modal Screen */}
        {showUpload ? (
          <AdminPdfUpload
            onUploadSuccess={(newIssue) => {
              setShowUpload(false);
              fetchIssues();
              handleSelectIssue(newIssue);
            }}
            onCancel={() => setShowUpload(false)}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Issues List */}
            <div className="lg:col-span-4 space-y-3">
              <h2 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
                Barcha Gazeta Nashrlari ({issues.length})
              </h2>

              <div className="space-y-3">
                {issues.map((iss) => {
                  const isSelected = selectedIssue?.id === iss.id;
                  return (
                    <div
                      key={iss.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isSelected
                          ? 'bg-white dark:bg-slate-900 border-red-600 shadow-md ring-2 ring-red-500/20'
                          : 'bg-white/70 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div 
                          onClick={() => handleSelectIssue(iss)} 
                          className="cursor-pointer flex-1"
                        >
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                            iss.is_public ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {iss.is_public ? 'Nashr etilgan' : 'Ko‘rib chiqilmoqda'}
                          </span>
                          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">
                            {iss.title}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {iss.issue_number} • {iss.publication_date}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handlePublishToggle(iss)}
                            className={`p-1.5 rounded-lg text-xs font-bold ${
                              iss.is_public ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                            }`}
                            title={iss.is_public ? 'E’londan olish' : 'E’lon qilish'}
                          >
                            <Globe className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => handleCopyNfcUrl(iss.nfc_slug)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedSlug === iss.nfc_slug ? 'Nusxalandi!' : 'NFC Nusxalash'}</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedIssue(iss);
                            setShowQrModal(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1"
                        >
                          <QrCode className="w-3.5 h-3.5 text-amber-600" />
                          <span>QR Kod</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Interactive Page Review & Text/Audio Editor */}
            <div className="lg:col-span-8">
              {selectedIssue ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg space-y-6">
                  
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <h2 className="text-xl font-black text-slate-900 dark:text-white">
                        {selectedIssue.title}
                      </h2>
                      <p className="text-xs text-slate-500">
                        NFC Slug: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">{selectedIssue.nfc_slug}</code>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenIssuePreview(selectedIssue.slug)}
                        className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-white font-bold text-xs flex items-center gap-1.5"
                      >
                        <Eye className="w-4 h-4 text-emerald-600" />
                        <span>Foydalanuvchi Ko‘rinishida Ochish</span>
                      </button>

                      <button
                        onClick={() => handlePublishToggle(selectedIssue)}
                        className={`px-4 py-2 rounded-xl font-bold text-xs text-white ${
                          selectedIssue.is_public ? 'bg-amber-600' : 'bg-emerald-600'
                        }`}
                      >
                        {selectedIssue.is_public ? 'E’londan olish' : 'Nashr qilish'}
                      </button>
                    </div>
                  </div>

                  {/* Page Selector Tabs */}
                  {issuePages.length > 0 ? (
                    <div className="space-y-4">
                      
                      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800">
                        {issuePages.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => {
                              setSelectedPage(p);
                              setEditingText(p.final_text);
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                              selectedPage?.id === p.id
                                ? 'bg-red-700 text-white shadow-md'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {p.page_number}-bet
                          </button>
                        ))}
                      </div>

                      {/* Side-by-Side Review Screen */}
                      {selectedPage && (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
                          
                          {/* Original Page Image Preview */}
                          <div className="md:col-span-5 space-y-3">
                            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                              Original PDF Bet Ko‘rinishi ({selectedPage.page_number}-bet)
                            </h3>
                            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900">
                              <img 
                                src={selectedPage.original_page_image_url} 
                                alt="PDF preview" 
                                className="w-full h-auto object-contain max-h-[450px]"
                              />
                            </div>

                            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs space-y-1">
                              <p className="font-bold text-slate-700 dark:text-slate-300">
                                Aniqlash aniqligi: {(selectedPage.extraction_confidence * 100).toFixed(0)}%
                              </p>
                              <p className="text-slate-500">
                                OCR va PyMuPDF matn bloklari ajratilgan.
                              </p>
                            </div>
                          </div>

                          {/* Text Editor & Audio Re-synthesis */}
                          <div className="md:col-span-7 space-y-4">
                            
                            <div className="flex items-center justify-between">
                              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                                Matnni Tahrirlash va Ovoz Moslashtirish
                              </h3>

                              <button
                                onClick={handleRegenerateAudio}
                                className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 font-bold text-xs flex items-center gap-1.5"
                              >
                                <Volume2 className="w-4 h-4 text-amber-700" />
                                <span>Audioni qayta yaratish</span>
                              </button>
                            </div>

                            <textarea
                              rows={12}
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-600 leading-relaxed"
                            />

                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-400">
                                Har bir xatboshi ketma-ket audio shaklda o‘qiladi.
                              </span>

                              <button
                                onClick={handleSavePageText}
                                className="px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-sm shadow-md"
                              >
                                Matnni Saqlash
                              </button>
                            </div>

                          </div>

                        </div>
                      )}

                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-400 text-sm">
                      Ushbu nashr uchun betlar topilmadi.
                    </div>
                  )}

                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center text-slate-400 border border-slate-200 dark:border-slate-800">
                  Tahrirlash va ko‘rib chiqish uchun chap tomondan gazetani tanlang.
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* QR Code Modal for Admin */}
      {selectedIssue && (
        <QrCodeModal
          isOpen={showQrModal}
          onClose={() => setShowQrModal(false)}
          nfcSlug={selectedIssue.nfc_slug}
          issueTitle={selectedIssue.title}
        />
      )}

    </div>
  );
};
