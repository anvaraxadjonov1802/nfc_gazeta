import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export const PwaInstaller: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-24 right-4 z-40 max-w-sm bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between gap-3 animate-bounce">
      <div className="flex items-center gap-2">
        <Download className="w-6 h-6 text-red-500 shrink-0" />
        <div>
          <p className="font-bold text-xs">Telefoningizga o‘rnatib oling</p>
          <p className="text-[10px] text-slate-300">Offlayn va tezkor tinglash uchun</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={handleInstall}
          className="px-3 py-1.5 bg-red-700 text-white font-bold text-xs rounded-xl"
        >
          O‘rnatish
        </button>
        <button onClick={() => setShowPrompt(false)} className="p-1 text-slate-400">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
