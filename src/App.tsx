/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense, useEffect, useState, type ReactElement } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Page } from './types';
import DashboardLayout from './components/DashboardLayout';
import ScrollToTop from './components/ScrollToTop';
import { ReflectionDeck, type ReflectionDeckData } from './components/ui/ReflectionDeck';
import { ModalCloseButton, ModalShell } from './components/ui/ModalShell';

import { ChildProvider } from './context/ChildContext';
import { LockerProvider } from './context/LockerContext';
import { useCurrentChild } from './context/ChildContext';
import { DisplayModeProvider } from './context/DisplayModeContext';
import { SecondaryUsersProvider } from './context/SecondaryUsersContext';

const AddChildFlow = lazy(() => import('./components/AddChildFlow'));
const AllChildrenPage = lazy(() => import('./components/AllChildrenPage'));
const DiaryPage = lazy(() => import('./components/DiaryPage'));
const DocumentsPage = lazy(() => import('./components/DocumentsPage'));
const EmergingDetailsPage = lazy(() => import('./components/EmergingDetailsPage'));
const HomePage = lazy(() => import('./components/HomePage'));
const NewChildPreviewPage = lazy(() => import('./components/NewChildPreviewPage'));
const PrioritiesPage = lazy(() => import('./components/PrioritiesPage'));
const ResourcesPage = lazy(() => import('./components/ResourcesPage'));
const ReviewsPage = lazy(() => import('./components/ReviewsPage'));
const SettingsPage = lazy(() => import('./components/SettingsPage'));
const StyleGuidePage = lazy(() => import('./components/StyleGuidePage'));
const UnderstandingPage = lazy(() => import('./components/UnderstandingPage'));
const WhatYouNoticedPage = lazy(() => import('./components/WhatYouNoticedPage'));

function RouteLoadingFallback() {
  return (
    <div className="min-h-[240px] flex items-center justify-center text-[0.78rem] tracking-[0.14em] uppercase text-slate-400">
      Loading
    </div>
  );
}

function resetStoredStateIfRequested() {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  if (params.get('reset') !== '1') return;

  [
    'threadline-children',
    'threadline-current-child',
    'threadline-demo-data-version',
    'thread-theme',
    'thread-font',
    'thread-hero-style',
    'thread-secondary-style',
  ].forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Storage can be unavailable in restricted contexts; the app will still use defaults.
    }
  });

  window.history.replaceState({}, '', '/');
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentChild, createNewChild } = useCurrentChild();
  
  // Derive currentPage from location
  const getCurrentPage = (): Page => {
    const path = location.pathname.substring(1) || 'all-children';
    return path as Page;
  };

  const currentPage = getCurrentPage();

  // Initialize themes safely from localStorage or fallback
  useEffect(() => {
    let savedTheme = 'energetic';
    let savedFont = 'modern-serif';
    let savedHeroStyle = 'white';
    let savedSecondaryStyle = 'light';
    
    try {
      savedTheme = localStorage.getItem('thread-theme') || 'energetic';
      savedFont = localStorage.getItem('thread-font') || 'modern-serif';
      savedHeroStyle = localStorage.getItem('thread-hero-style') || 'white';
      savedSecondaryStyle = localStorage.getItem('thread-secondary-style') || 'light';
    } catch (e) {
      console.warn("Storage access is blocked or restricted:", e);
    }

    document.documentElement.setAttribute('data-theme', savedTheme);
    document.documentElement.setAttribute('data-font', savedFont);
    document.documentElement.setAttribute('data-hero-style', savedHeroStyle);
    document.documentElement.setAttribute('data-hero-secondary', savedSecondaryStyle);
  }, []);

  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [setupInitialStep, setSetupInitialStep] = useState<1 | 2 | 3 | 4 | 5 | "welcome">("welcome");
  const [reflectionDeck, setReflectionDeck] = useState<ReflectionDeckData | null>(null);

  const showReflectionDeck = (data: ReflectionDeckData) => setReflectionDeck(data);
  const closeReflectionDeck = () => setReflectionDeck(null);

  const handlePageChange = (page: Page) => {
    navigate(`/${page === 'all-children' ? '' : page}`);
  };

  const handleAddChildRequest = () => {
    createNewChild();
    navigate('/setup');
  };

  const openSetup = (step: 1 | 2 | 3 | 4 | 5 | "welcome" = "welcome") => {
    setSetupInitialStep(step);
    setIsSetupOpen(true);
  };
  const closeSetup = () => setIsSetupOpen(false);

  const withPreAssessmentGuard = (element: ReactElement) => (
    currentChild.isNew ? <NewChildPreviewPage onPageChange={handlePageChange} onOpenSetup={openSetup} /> : element
  );

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<RouteLoadingFallback />}>
        {isSetupOpen && (
          <AddChildFlow
            asModal
            initialStep={setupInitialStep}
            onComplete={closeSetup}
            onCancel={closeSetup}
            onShowReflection={showReflectionDeck}
          />
        )}
        {reflectionDeck && (
          <ModalShell
            isOpen={Boolean(reflectionDeck)}
            titleId="reflection-deck-title"
            className="bg-black/30 p-4 sm:p-6"
            maxWidthClassName="max-w-6xl"
            zIndexClassName="z-[60]"
            panelClassName="shadow-premium"
          >
            <h2 id="reflection-deck-title" className="sr-only">
              Reflection summary
            </h2>
            <ModalCloseButton
              onClick={closeReflectionDeck}
              label="Close reflection summary"
              className="absolute right-4 top-4 z-10 h-9 w-9 bg-white/80 shadow-sm hover:bg-white"
              iconClassName="h-4 w-4"
            />
            <ReflectionDeck
              childName={reflectionDeck.childName}
              navigatorHelp={reflectionDeck.navigatorHelp}
              nextStep={reflectionDeck.nextStep}
              selectedNotices={reflectionDeck.selectedNotices}
              availableInfo={reflectionDeck.availableInfo}
              questionnaireAnswers={reflectionDeck.questionnaireAnswers}
              onBackToSetup={closeReflectionDeck}
              onGoToProfile={closeReflectionDeck}
              onSetUpAnotherChild={closeReflectionDeck}
            />
          </ModalShell>
        )}
        <Routes>
          <Route path="/setup" element={
            <AddChildFlow
              onComplete={() => {
                const params = new URLSearchParams(window.location.search);
                const fromParam = params.get('from');
                if (fromParam) {
                  handlePageChange(fromParam as Page);
                } else {
                  handlePageChange('all-children');
                }
              }}
              onCancel={() => {
                const params = new URLSearchParams(window.location.search);
                const fromParam = params.get('from');
                if (fromParam) {
                  handlePageChange(fromParam as Page);
                } else {
                  handlePageChange('all-children');
                }
              }}
              onShowReflection={showReflectionDeck}
            />
          } />
          <Route path="*" element={
            <DashboardLayout
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onAddChildRequest={handleAddChildRequest}
            >
              <Routes>
                <Route path="/" element={<AllChildrenPage onPageChange={handlePageChange} />} />
                <Route path="/home" element={withPreAssessmentGuard(<HomePage onPageChange={handlePageChange} onOpenSetup={openSetup} />)} />
                <Route path="/preview" element={<NewChildPreviewPage onPageChange={handlePageChange} onOpenSetup={openSetup} />} />
                <Route path="/what-you-noticed" element={currentChild.isNew ? <WhatYouNoticedPage onPageChange={handlePageChange} onOpenSetup={openSetup} /> : <Navigate to="/home" replace />} />
                <Route path="/understanding" element={<UnderstandingPage onPageChange={handlePageChange} onOpenSetup={openSetup} />} />
                <Route path="/priorities" element={<PrioritiesPage onPageChange={handlePageChange} />} />
                <Route path="/roadmap" element={<Navigate to={currentChild.isNew ? "/home" : "/reviews"} replace />} />
                <Route path="/reviews" element={withPreAssessmentGuard(<ReviewsPage onPageChange={handlePageChange} onOpenSetup={openSetup} />)} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/documents" element={<DocumentsPage />} />
                <Route path="/diary" element={<DiaryPage />} />
                <Route path="/settings" element={
                  <SettingsPage
                    onPageChange={handlePageChange}
                    onAddChildRequest={handleAddChildRequest}
                  />
                } />
                <Route path="/emerging-details" element={withPreAssessmentGuard(<EmergingDetailsPage onPageChange={handlePageChange} />)} />
                <Route path="/style-guide" element={<StyleGuidePage onPageChange={handlePageChange} />} />
                <Route path="*" element={<AllChildrenPage onPageChange={handlePageChange} />} />
              </Routes>
            </DashboardLayout>
          } />
        </Routes>
      </Suspense>
    </>
  );
}

export default function App() {
  resetStoredStateIfRequested();

  return (
    <BrowserRouter>
      <ChildProvider>
        <LockerProvider>
          <DisplayModeProvider>
            <SecondaryUsersProvider>
              <AppContent />
            </SecondaryUsersProvider>
          </DisplayModeProvider>
        </LockerProvider>
      </ChildProvider>
    </BrowserRouter>
  );
}
