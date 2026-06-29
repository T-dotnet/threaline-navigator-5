/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense, useEffect, useState, type ReactElement } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Page } from './types';
import DashboardLayout from './components/DashboardLayout';
import ScrollToTop from './components/ScrollToTop';

import { ChildProvider } from './context/ChildContext';
import { LockerProvider } from './context/LockerContext';
import { useCurrentChild } from './context/ChildContext';
import { DisplayModeProvider } from './context/DisplayModeContext';
import { NewChildExperienceProvider, useNewChildExperience } from './context/NewChildExperienceContext';
import { SecondaryUsersProvider } from './context/SecondaryUsersContext';

const AddChildFlow = lazy(() => import('./components/AddChildFlow'));
const AllChildrenPage = lazy(() => import('./components/AllChildrenPage'));
const DocumentsPage = lazy(() => import('./components/DocumentsPage'));
const EmergingDetailsPage = lazy(() => import('./components/EmergingDetailsPage'));
const HomePage = lazy(() => import('./components/HomePage'));
const NewChildPreviewPage = lazy(() => import('./components/NewChildPreviewPage'));
const PrioritiesPage = lazy(() => import('./components/PrioritiesPage'));
const ResourcesPage = lazy(() => import('./components/ResourcesPage'));
const ReviewsPage = lazy(() => import('./components/ReviewsPage'));
const RoadmapPage = lazy(() => import('./components/RoadmapPage'));
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
    'threadline-new-child-experience',
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
  const { isReviewExperience } = useNewChildExperience();
  
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
          />
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
                <Route path="/roadmap" element={currentChild.isNew ? (isReviewExperience ? <Navigate to="/home" replace /> : <RoadmapPage onPageChange={handlePageChange} />) : <Navigate to="/reviews" replace />} />
                <Route path="/reviews" element={withPreAssessmentGuard(<ReviewsPage onPageChange={handlePageChange} onOpenSetup={openSetup} />)} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/documents" element={<DocumentsPage />} />
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
            <NewChildExperienceProvider>
              <SecondaryUsersProvider>
                <AppContent />
              </SecondaryUsersProvider>
            </NewChildExperienceProvider>
          </DisplayModeProvider>
        </LockerProvider>
      </ChildProvider>
    </BrowserRouter>
  );
}
