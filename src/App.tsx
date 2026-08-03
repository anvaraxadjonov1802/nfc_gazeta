import React, { useState, useEffect } from 'react';
import { AccessibilityProvider, useAccessibility } from './lib/accessibilityContext';
import { Header } from './components/Header';
import { WelcomeHero } from './components/WelcomeHero';
import { PageViewer } from './components/PageViewer';
import { ArticleViewer } from './components/ArticleViewer';
import { AudioPlayer } from './components/AudioPlayer';
import { PublicHomePage } from './components/PublicHomePage';
import { NewspaperArchive } from './components/NewspaperArchive';
import { AdminDashboard } from './components/AdminDashboard';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { AccessibilityModal } from './components/AccessibilityModal';
import { HowToUseModal } from './components/HowToUseModal';
import { QrCodeModal } from './components/QrCodeModal';
import { SearchModal } from './components/SearchModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { SoddaRejimOverlay } from './components/SoddaRejimOverlay';
import { PwaInstaller } from './components/PwaInstaller';
import { Issue, Page, Article } from './types';
import { speechManager } from './lib/speechSynthesis';

type ActiveView = 'home' | 'issue' | 'page' | 'article' | 'archive' | 'admin' | 'analytics';

function AppContent() {
  const { settings, updateSetting } = useAccessibility();

  // Navigation State
  const [currentView, setCurrentView] = useState<ActiveView>('home');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);
  const [activePages, setActivePages] = useState<Page[]>([]);
  const [activeArticles, setActiveArticles] = useState<Article[]>([]);
  
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [activeParagraphIdx, setActiveParagraphIdx] = useState<number>(0);

  // Audio & Player States
  const [showPlayer, setShowPlayer] = useState(false);
  const [showText, setShowText] = useState(true);
  const [showImages, setShowImages] = useState(true);

  // Modal States
  const [showAccessibilityModal, setShowAccessibilityModal] = useState(false);
  const [showHowToUseModal, setShowHowToUseModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  // Load Issues
  useEffect(() => {
    fetch('/api/public/issues')
      .then(res => res.json())
      .then((data: Issue[]) => {
        setIssues(data);
        // Check NFC URL path or query params
        const path = window.location.pathname;
        const searchParams = new URLSearchParams(window.location.search);
        let nfcSlug = searchParams.get('nfc') || searchParams.get('issue');

        if (path.startsWith('/nfc/')) {
          nfcSlug = path.replace('/nfc/', '');
        }

        if (nfcSlug) {
          const matched = data.find(i => i.nfc_slug === nfcSlug || i.slug === nfcSlug);
          if (matched) {
            loadIssue(matched.slug);
            // Log NFC open
            fetch('/api/public/nfc-open', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ slug: matched.nfc_slug })
            }).catch(() => {});
          } else if (data.length > 0) {
            loadIssue(data[0].slug);
          }
        }
      })
      .catch(console.error);
  }, []);

  // Helper to load issue details
  const loadIssue = async (slug: string) => {
    try {
      const res = await fetch(`/api/public/issues/${slug}`);
      const data = await res.json();
      setActiveIssue(data);
      setActivePages(data.pages || []);
      setActiveArticles(data.articles || []);
      setCurrentPageNum(1);
      setActiveArticle(null);
      setCurrentView('issue');
    } catch (err) {
      console.error(err);
    }
  };

  // Helper to get current page paragraphs
  const currentPageObj = activePages.find(p => p.page_number === currentPageNum) || activePages[0];
  
  const currentParagraphs = currentPageObj
    ? currentPageObj.text_blocks.length > 0
      ? currentPageObj.text_blocks.map(tb => tb.final_text || tb.cleaned_text)
      : currentPageObj.final_text.split(/(?<=[.!?])\s+/).filter(Boolean)
    : [];

  const handleStartListening = () => {
    setShowPlayer(true);
    setCurrentView('page');
    speechManager.speakParagraphs(
      currentParagraphs,
      (idx) => setActiveParagraphIdx(idx),
      () => {
        if (currentPageNum < (activePages.length || 1)) {
          setCurrentPageNum(prev => prev + 1);
        }
      }
    );
  };

  const handlePageChange = (newPage: number) => {
    speechManager.stop();
    setCurrentPageNum(newPage);
    setActiveParagraphIdx(0);
    setCurrentView('page');
    setShowPlayer(true);
  };

  const handleSelectArticle = (issueSlug: string, articleSlug: string) => {
    fetch(`/api/public/articles/${articleSlug}`)
      .then(res => res.json())
      .then(data => {
        setActiveArticle(data);
        setCurrentView('article');
      })
      .catch(console.error);
  };

  return (
    <div className={`min-h-screen transition-colors ${
      settings.highContrast
        ? 'bg-black text-yellow-300'
        : settings.darkMode
        ? 'bg-[#22221b] text-[#f5f5f0]'
        : 'bg-[#f5f5f0] text-[#3c3c32]'
    }`}>
      
      {/* Global Accessible Header */}
      {currentView !== 'admin' && currentView !== 'analytics' && (
        <Header
          onOpenAccessibility={() => setShowAccessibilityModal(true)}
          onOpenHowToUse={() => setShowHowToUseModal(true)}
          onOpenSearch={() => setShowSearchModal(true)}
          onOpenAiAssistant={() => setShowAiModal(true)}
          onGoHome={() => setCurrentView('home')}
          onOpenArchive={() => setCurrentView('archive')}
          onOpenAdmin={() => setCurrentView('admin')}
        />
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 md:py-8">
        
        {/* VIEW 1: PUBLIC HOMEPAGE */}
        {currentView === 'home' && issues.length > 0 && (
          <PublicHomePage
            latestIssue={issues[0]}
            allIssues={issues}
            onSelectIssue={(slug) => loadIssue(slug)}
            onOpenHowToUse={() => setShowHowToUseModal(true)}
            onOpenArchive={() => setCurrentView('archive')}
            onOpenAccessibility={() => setShowAccessibilityModal(true)}
          />
        )}

        {/* VIEW 2: ISSUE LANDING SCREEN */}
        {currentView === 'issue' && activeIssue && (
          <div className="space-y-8">
            <WelcomeHero
              issue={activeIssue}
              onStartListening={handleStartListening}
              onViewPages={() => setCurrentView('page')}
              onOpenHowToUse={() => setShowHowToUseModal(true)}
              onOpenAccessibility={() => setShowAccessibilityModal(true)}
              onOpenQrCode={() => setShowQrModal(true)}
            />

            {/* Quick Pages Preview List */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-xl">
                Gazeta Betlari ({activePages.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {activePages.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handlePageChange(p.page_number)}
                    className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer hover:border-red-600 transition-all text-center space-y-2 group"
                  >
                    <div className="aspect-[3/4] bg-slate-100 rounded-xl overflow-hidden">
                      <img 
                        src={p.original_page_image_url} 
                        alt={`${p.page_number}-bet`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      {p.page_number}-bet
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: INDIVIDUAL PAGE VIEWER */}
        {currentView === 'page' && currentPageObj && activeIssue && (
          <PageViewer
            page={currentPageObj}
            totalPages={activePages.length}
            issueSlug={activeIssue.slug}
            issueTitle={activeIssue.title}
            articles={activeArticles}
            activeParagraphIndex={activeParagraphIdx}
            showText={showText}
            setShowText={setShowText}
            showImages={showImages}
            setShowImages={setShowImages}
            onPageChange={handlePageChange}
            onPlayPageAudio={() => {
              setShowPlayer(true);
              speechManager.speakParagraphs(
                currentParagraphs,
                (idx) => setActiveParagraphIdx(idx)
              );
            }}
            onSelectArticle={(aSlug) => handleSelectArticle(activeIssue.slug, aSlug)}
          />
        )}

        {/* VIEW 4: ARTICLE VIEWER */}
        {currentView === 'article' && activeArticle && activeIssue && (
          <ArticleViewer
            article={activeArticle}
            issueSlug={activeIssue.slug}
            onGoToPage={(pNum) => handlePageChange(pNum)}
            onBackToIssue={() => setCurrentView('issue')}
          />
        )}

        {/* VIEW 5: NEWSPAPER ARCHIVE */}
        {currentView === 'archive' && (
          <NewspaperArchive
            issues={issues}
            onSelectIssue={(slug) => loadIssue(slug)}
            onBack={() => setCurrentView('home')}
          />
        )}

        {/* VIEW 6: ADMIN DASHBOARD */}
        {currentView === 'admin' && (
          <AdminDashboard
            onBackToApp={() => setCurrentView('home')}
            onOpenIssuePreview={(slug) => loadIssue(slug)}
          />
        )}

        {/* VIEW 7: ANALYTICS DASHBOARD */}
        {currentView === 'analytics' && (
          <AnalyticsDashboard
            onBack={() => setCurrentView('home')}
          />
        )}

      </main>

      {/* Sticky Mobile Audio Player */}
      {showPlayer && currentPageObj && (
        <AudioPlayer
          title={currentPageObj.title || `${currentPageObj.page_number}-bet`}
          subtitle={activeIssue?.newspaper_name || 'Temiryo‘l Ovozli Gazeta'}
          paragraphs={currentParagraphs}
          currentPage={currentPageNum}
          totalPages={activePages.length || 1}
          onPageChange={handlePageChange}
          onParagraphChange={(idx) => setActiveParagraphIdx(idx)}
          showText={showText}
          setShowText={setShowText}
          showImages={showImages}
          setShowImages={setShowImages}
          onClosePlayer={() => setShowPlayer(false)}
        />
      )}

      {/* Sodda Rejim Overlay for Visually Impaired Users */}
      {settings.simpleMode && (
        <SoddaRejimOverlay
          isPlaying={speechManager.isSpeaking()}
          onPlay={() => {
            if (currentParagraphs.length > 0) {
              speechManager.speakParagraphs(
                currentParagraphs,
                (idx) => setActiveParagraphIdx(idx)
              );
            }
          }}
          onPause={() => speechManager.pause()}
          onNext={() => handlePageChange(currentPageNum + 1)}
          onPrev={() => handlePageChange(currentPageNum - 1)}
          onOpenHelp={() => setShowHowToUseModal(true)}
          onExitSimpleMode={() => updateSetting('simpleMode', false)}
          currentTitle={activeIssue?.title}
        />
      )}

      {/* Modals */}
      <AccessibilityModal
        isOpen={showAccessibilityModal}
        onClose={() => setShowAccessibilityModal(false)}
      />

      <HowToUseModal
        isOpen={showHowToUseModal}
        onClose={() => setShowHowToUseModal(false)}
      />

      {activeIssue && (
        <QrCodeModal
          isOpen={showQrModal}
          onClose={() => setShowQrModal(false)}
          nfcSlug={activeIssue.nfc_slug}
          issueTitle={activeIssue.title}
        />
      )}

      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSelectIssue={(slug) => loadIssue(slug)}
        onSelectArticle={(iSlug, aSlug) => handleSelectArticle(iSlug, aSlug)}
        onPlayArticleAudio={(art) => {
          setShowPlayer(true);
          speechManager.speakParagraphs(
            art.paragraphs,
            (idx) => setActiveParagraphIdx(idx)
          );
        }}
      />

      {activeIssue && (
        <AiAssistantModal
          isOpen={showAiModal}
          onClose={() => setShowAiModal(false)}
          issueSlug={activeIssue.slug}
          issueTitle={activeIssue.title}
        />
      )}

      {/* PWA Prompt */}
      <PwaInstaller />

    </div>
  );
}

export default function App() {
  return (
    <AccessibilityProvider>
      <AppContent />
    </AccessibilityProvider>
  );
}
