import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { Issue } from '../types';

interface AdminPdfUploadProps {
  onUploadSuccess: (issue: Issue) => void;
  onCancel: () => void;
}

export const AdminPdfUpload: React.FC<AdminPdfUploadProps> = ({ onUploadSuccess, onCancel }) => {
  const [title, setTitle] = useState('');
  const [issueNumber, setIssueNumber] = useState('');
  const [pubDate, setPubDate] = useState(new Date().toISOString().split('T')[0]);
  const [newspaperName, setNewspaperName] = useState('Temiryo‘lchi');
  const [nfcSlug, setNfcSlug] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStepText, setCurrentStepText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pipelineSteps = [
    '1. PDF yuklanmoqda',
    '2. Betlar ajratilmoqda',
    '3. Matn aniqlanmoqda',
    '4. Rasmlar ajratilmoqda',
    '5. Maqolalar aniqlanmoqda',
    '6. Matn tekshirilmoqda',
    '7. Audio tayyorlanmoqda',
    '8. Nashr ko‘rib chiqishga tayyor'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type !== 'application/pdf') {
        setErrorMsg('Faqat PDF formatdagi fayllarni yuklashingiz mumkin.');
        return;
      }
      if (selected.size > 50 * 1024 * 1024) {
        setErrorMsg('Fayl hajmi ruxsat etilgan miqdordan (50MB) katta.');
        return;
      }
      setErrorMsg(null);
      setFile(selected);
      if (!title) {
        setTitle(selected.name.replace('.pdf', ''));
      }
      if (!nfcSlug) {
        setNfcSlug(selected.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
      }
    }
  };

  const handleStartProcessing = async () => {
    if (!title || !file) {
      setErrorMsg('Iltimos, gazeta sarlavhasi va PDF faylini tanlang.');
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);
    setUploadProgress(10);
    setCurrentStepText(pipelineSteps[0]);

    try {
      // 1. Create Draft Issue
      const createRes = await fetch('/api/admin/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          issue_number: issueNumber || '№ 31 (4890)',
          publication_date: pubDate,
          newspaper_name: newspaperName,
          nfc_slug: nfcSlug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        })
      });

      const draftIssue = await createRes.json();

      // 2. Upload PDF File
      const formData = new FormData();
      formData.append('pdf', file);

      // Simulate step-by-step UI progress for user clarity
      for (let i = 0; i < pipelineSteps.length; i++) {
        await new Promise(r => setTimeout(r, 600));
        setUploadProgress(Math.round(((i + 1) / pipelineSteps.length) * 100));
        setCurrentStepText(pipelineSteps[i]);
      }

      const uploadRes = await fetch(`/api/admin/issues/${draftIssue.id}/upload-pdf`, {
        method: 'POST',
        body: formData
      });

      const result = await uploadRes.json();

      // Fetch freshly processed issue details
      const detailRes = await fetch(`/api/public/issues/${draftIssue.slug}`);
      const fullIssue = await detailRes.json();

      setIsUploading(false);
      onUploadSuccess(fullIssue);
    } catch (err: any) {
      setIsUploading(false);
      setErrorMsg('PDF faylni yuklab bo‘lmadi. Internet aloqasini tekshiring va qayta urinib ko‘ring.');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-xl max-w-3xl mx-auto space-y-6">
      
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Yangi Gazeta PDF Yuklash
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            PDF fayl yuklangandan so‘ng matnlar, rasmlar va audio avtomatik tayyorlanadi.
          </p>
        </div>
        <button
          onClick={onCancel}
          disabled={isUploading}
          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
        >
          Bekor qilish
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Upload Drag & Drop Area */}
      {!isUploading ? (
        <div className="space-y-5">
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-red-300 dark:border-red-900 hover:border-red-600 bg-red-50/50 dark:bg-red-950/20 rounded-3xl p-8 text-center cursor-pointer transition-all space-y-3"
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden" 
            />
            
            <div className="w-16 h-16 rounded-2xl bg-red-700 text-white flex items-center justify-center mx-auto shadow-lg">
              <Upload className="w-8 h-8" />
            </div>

            {file ? (
              <div>
                <p className="font-extrabold text-base text-slate-900 dark:text-white">
                  {file.name}
                </p>
                <p className="text-xs text-emerald-600 font-bold mt-1">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • PDF Fayl Tayyor
                </p>
              </div>
            ) : (
              <div>
                <p className="font-bold text-base text-slate-800 dark:text-slate-200">
                  PDF faylni shu yerga tashlang yoki kompyuterdan tanlang
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Maksimal ruxsat etilgan hajm: 50MB
                </p>
              </div>
            )}
          </div>

          {/* Issue Meta Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Gazeta Nomi *
              </label>
              <input
                type="text"
                value={newspaperName}
                onChange={(e) => setNewspaperName(e.target.value)}
                placeholder="Masalan: Temiryo‘lchi"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Son Raqami
              </label>
              <input
                type="text"
                value={issueNumber}
                onChange={(e) => setIssueNumber(e.target.value)}
                placeholder="Masalan: № 31 (4890)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Gazeta Nashr Sarlavhasi *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masalan: Temiryo‘lchi Gazetasi - Avgust Soni"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Chop Etilgan Sana
              </label>
              <input
                type="date"
                value={pubDate}
                onChange={(e) => setPubDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                NFC / URL Slug
              </label>
              <input
                type="text"
                value={nfcSlug}
                onChange={(e) => setNfcSlug(e.target.value)}
                placeholder="temiryolchi-2026-08-01"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono text-xs font-semibold"
              />
            </div>
          </div>

          <button
            onClick={handleStartProcessing}
            disabled={!file || !title}
            className="w-full py-4 rounded-2xl bg-red-700 hover:bg-red-800 text-white font-extrabold text-lg flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            <span>Qayta ishlashni boshlash</span>
            <ArrowRight className="w-5 h-5" />
          </button>

        </div>
      ) : (
        /* Live 8-step Progress Status Visualization */
        <div className="py-6 space-y-6">
          <div className="text-center space-y-2">
            <Loader2 className="w-12 h-12 text-red-600 animate-spin mx-auto" />
            <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">
              {currentStepText}
            </h3>
            <p className="text-xs text-slate-500">
              Ushbu jarayon davomida PyMuPDF, OCR va AI matn tozalagichlari ishlamoqda.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-600">
              <span>Jarayon bajarilishi</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-600 transition-all duration-500" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>

          {/* Page Progress List */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4">
            {[1, 2, 3, 4].map((pNum) => {
              const isDone = uploadProgress > (pNum * 22);
              const isCurrent = uploadProgress > ((pNum - 1) * 22) && !isDone;
              return (
                <div key={pNum} className={`p-3 rounded-xl border text-center text-xs font-bold ${
                  isDone ? 'bg-emerald-50 border-emerald-300 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200' :
                  isCurrent ? 'bg-amber-50 border-amber-300 text-amber-900 dark:bg-amber-950 dark:text-amber-200 animate-pulse' :
                  'bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  <p>{pNum}-bet</p>
                  <p className="text-[10px] font-normal mt-0.5">
                    {isDone ? 'Tayyor ✓' : isCurrent ? 'Ishlanmoqda...' : 'Navbatda'}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
