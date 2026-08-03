import React, { useState, useEffect } from 'react';
import { BarChart3, Smartphone, Users, Clock, CheckCircle2, TrendingUp, ArrowLeft } from 'lucide-react';
import { AnalyticsSummary } from '../types';

interface AnalyticsDashboardProps {
  onBack: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ onBack }) => {
  const [data, setData] = useState<AnalyticsSummary | null>(null);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(res => res.json())
      .then(d => setData(d))
      .catch(e => console.error(e));
  }, []);

  if (!data) return <div className="p-8 text-center text-slate-400">Analitika yuklanmoqda...</div>;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 md:p-8 space-y-6">
      
      <div className="max-w-7xl mx-auto flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-extrabold text-2xl">
              NFC va Audio Analitika Panel
            </h1>
            <p className="text-xs text-slate-500">
              Maxfiylikka mos, shaxsiy ma’lumotlarsiz umumiy foydalanish statistikasi
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-xs font-bold uppercase text-slate-400">Jami NFC Ochilishlar</p>
            <p className="text-3xl font-black text-red-700 dark:text-red-400 mt-1">{data.totalNfcOpens}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">↑ +18% so‘nggi haftada</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-xs font-bold uppercase text-slate-400">Noma’lum Sessiyalar</p>
            <p className="text-3xl font-black text-blue-700 dark:text-blue-400 mt-1">{data.uniqueSessions}</p>
            <p className="text-xs text-slate-500 mt-1">NFC teginish orqali</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-xs font-bold uppercase text-slate-400">Tinglash Yakunlanishi</p>
            <p className="text-3xl font-black text-emerald-700 dark:text-emerald-400 mt-1">{data.completionRate}%</p>
            <p className="text-xs text-slate-500 mt-1">Yuqori davomiylik ko‘rsatkichi</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-xs font-bold uppercase text-slate-400">O‘rtacha Tinglash</p>
            <p className="text-3xl font-black text-purple-700 dark:text-purple-400 mt-1">8.5 min</p>
            <p className="text-xs text-slate-500 mt-1">Bir sessiya bo‘yicha</p>
          </div>
        </div>

        {/* Breakdown grids */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
              Eng Ko‘p Tinglangan Gazeta Soni
            </h2>
            <div className="space-y-3">
              {data.mostListenedIssues.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-sm">
                  <span className="font-bold">{item.title}</span>
                  <span className="text-xs font-bold text-red-700 dark:text-red-400">{item.opens} marta tinglandi</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
              Qurilmalar Bo‘yicha Qamrov
            </h2>
            <div className="space-y-3">
              {data.deviceCategories.map((dev, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{dev.name}</span>
                    <span>{dev.percentage}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600 rounded-full" style={{ width: `${dev.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
