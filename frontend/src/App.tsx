import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AnalyzePage } from './pages/AnalyzePage';
import { WordsExplorerPage } from './pages/WordsExplorerPage';
import { QuizPage } from './pages/QuizPage';
import { AboutPage } from './pages/AboutPage';
import type { ActivePage } from './types';

export function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [analyzeInitialWord, setAnalyzeInitialWord] = useState<string>('');
  const [analyzeInitialSentence, setAnalyzeInitialSentence] = useState<string>('');

  const navigateTo = (page: ActivePage, params?: { word?: string; sentence?: string }) => {
    if (params?.word) {
      setAnalyzeInitialWord(params.word);
    }
    if (params?.sentence) {
      setAnalyzeInitialSentence(params.sentence);
    }
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToAnalyze = (word: string, sentence?: string) => {
    navigateTo('analyze', { word, sentence });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1F2E24] font-tamil hero-pattern">
      {/* 100% Tamil Navigation */}
      <Navbar activePage={activePage} onNavigate={(p) => navigateTo(p)} />

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {activePage === 'home' && (
          <HomePage onNavigate={navigateTo} />
        )}

        {activePage === 'analyze' && (
          <AnalyzePage
            initialWord={analyzeInitialWord}
            initialSentence={analyzeInitialSentence}
          />
        )}

        {activePage === 'words' && (
          <WordsExplorerPage onNavigateToAnalyze={handleNavigateToAnalyze} />
        )}

        {activePage === 'quiz' && (
          <QuizPage />
        )}

        {activePage === 'about' && (
          <AboutPage />
        )}
      </main>

      {/* 100% Tamil Footer */}
      <Footer onNavigate={(p) => navigateTo(p)} />
    </div>
  );
}

export default App;
