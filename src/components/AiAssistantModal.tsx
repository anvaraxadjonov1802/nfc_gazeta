import React, { useState } from 'react';
import { Sparkles, MessageSquare, Send, X, Volume2, Bot, AlertCircle } from 'lucide-react';
import { useAccessibility } from '../lib/accessibilityContext';
import { speechManager } from '../lib/speechSynthesis';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  issueSlug: string;
  issueTitle: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  issueSlug,
  issueTitle,
}) => {
  const { settings } = useAccessibility();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen) return null;

  const handleAsk = async (queryText?: string) => {
    const q = queryText || question;
    if (!q.trim()) return;

    setIsLoading(true);
    setAnswer(null);

    try {
      const res = await fetch('/api/public/ai-ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issue_slug: issueSlug,
          question: q
        })
      });
      const data = await res.json();
      setAnswer(data.answer || 'Bu savolga javob gazetada topilmadi.');
    } catch (err) {
      setAnswer('Bu savolga javob gazetada topilmadi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakAnswer = () => {
    if (!answer) return;
    setIsPlayingAudio(true);
    speechManager.speakParagraphs(
      [answer],
      () => {},
      () => setIsPlayingAudio(false)
    );
  };

  const presetQuestions = [
    'Qisqacha tushuntir',
    'Oddiy tilda tushuntir',
    'Asosiy fikrlar qaysilar?',
    'Ushbu gazeta nima haqida?'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className={`w-full max-w-lg rounded-[32px] p-6 border shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto ${
        settings.highContrast
          ? 'bg-black border-yellow-400 text-yellow-300'
          : settings.darkMode
          ? 'bg-[#2a2a22] border-[#5a5a40]/30 text-[#f5f5f0]'
          : 'bg-[#e8e8df] border-[#5a5a40]/20 text-[#3c3c32]'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#5a5a40]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5a5a40] text-[#f5f5f0] flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-serif italic font-bold tracking-tight">
                AI Gazeta Yordamchisi
              </h2>
              <p className="text-xs font-sans opacity-75 truncate max-w-xs">
                {issueTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#3c3c32]/50 hover:text-[#3c3c32]"
            aria-label="Modalni yopish"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Preset Prompt Buttons */}
        <div className="space-y-2">
          <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#5a5a40] dark:text-[#f5f5f0]">
            Tayyor tezkor savollar:
          </p>
          <div className="flex flex-wrap gap-2">
            {presetQuestions.map((pq, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuestion(pq);
                  handleAsk(pq);
                }}
                className="px-3.5 py-1.5 rounded-full bg-[#5a5a40]/10 hover:bg-[#5a5a40]/20 text-[#3c3c32] dark:text-[#f5f5f0] border border-[#5a5a40]/20 text-xs font-sans font-bold uppercase tracking-wider"
              >
                {pq}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleAsk(); }} className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Gazeta haqida savolingizni yozing..."
            className="flex-1 px-4 py-3 rounded-full border border-[#5a5a40]/20 bg-[#f5f5f0] dark:bg-[#2a2a22] text-sm text-[#3c3c32] dark:text-[#f5f5f0] focus:outline-none focus:ring-2 focus:ring-[#5a5a40]"
          />
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="px-5 py-3 rounded-full bg-[#5a5a40] hover:bg-[#4a4a34] text-[#f5f5f0] font-sans font-bold text-xs uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <Sparkles className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>

        {/* Answer Display */}
        {answer && (
          <div className="p-5 rounded-2xl bg-[#5a5a40]/10 border border-[#5a5a40]/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-sans font-bold text-[#5a5a40] dark:text-[#f5f5f0] uppercase tracking-widest flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-[#5a5a40]" />
                <span>AI Javobi:</span>
              </span>
              <button
                onClick={handleSpeakAnswer}
                className="px-3 py-1 bg-[#5a5a40] text-[#f5f5f0] rounded-full text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-1"
              >
                <Volume2 className="w-4 h-4" />
                <span>Ovozli eshitish</span>
              </button>
            </div>
            <p className="text-sm md:text-base leading-relaxed text-[#3c3c32] dark:text-[#f5f5f0] font-sans font-medium">
              {answer}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
