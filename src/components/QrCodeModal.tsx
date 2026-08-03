import React, { useState, useEffect } from 'react';
import { QrCode, Copy, Check, Nfc, Share2, X } from 'lucide-react';
import { useAccessibility } from '../lib/accessibilityContext';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  nfcSlug: string;
  issueTitle: string;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  onClose,
  nfcSlug,
  issueTitle,
}) => {
  const { settings } = useAccessibility();
  const [copied, setCopied] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  const nfcUrl = `${window.location.origin}/nfc/${nfcSlug}`;

  useEffect(() => {
    if (isOpen) {
      fetch(`/api/public/qrcode?text=${encodeURIComponent(nfcUrl)}`)
        .then(res => res.json())
        .then(data => setQrUrl(data.qrDataUrl))
        .catch(() => {});
    }
  }, [isOpen, nfcUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(nfcUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className={`w-full max-w-md rounded-3xl p-6 border shadow-2xl space-y-5 text-center ${
        settings.highContrast
          ? 'bg-black border-yellow-400 text-yellow-300'
          : settings.darkMode
          ? 'bg-slate-900 border-slate-800 text-white'
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Nfc className="w-6 h-6 text-red-700" />
            <h3 className="font-extrabold text-base">
              NFC & QR Kod Ma’lumotlari
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Ushbu QR kod yoki NFC havolasi orqali gazeta to‘g‘ridan-to‘g mehmonga ochiladi.
        </p>

        {/* QR Code Canvas / Image */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 max-w-[220px] mx-auto shadow-md">
          {qrUrl ? (
            <img src={qrUrl} alt="Gazeta QR Kodi" className="w-full h-auto" />
          ) : (
            <div className="w-48 h-48 bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
              QR Kod tayyorlanmoqda...
            </div>
          )}
        </div>

        {/* NFC Link Box */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-left border border-slate-200 dark:border-slate-700">
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
            NFC NDEF Chip Havolasi:
          </p>
          <p className="font-mono text-xs text-red-700 dark:text-red-400 truncate">
            {nfcUrl}
          </p>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
            copied
              ? 'bg-emerald-600 text-white'
              : settings.highContrast
              ? 'bg-yellow-400 text-black'
              : 'bg-red-700 hover:bg-red-800 text-white'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-5 h-5" />
              <span>NFC havolasi nusxalandi!</span>
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              <span>NFC havolasini nusxalash</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
};
