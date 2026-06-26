/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, type ReactElement } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Page } from './types';
import DashboardLayout from './components/DashboardLayout';
import HomePage from './components/HomePage';
import UnderstandingPage from './components/UnderstandingPage';
import PrioritiesPage from './components/PrioritiesPage';
import RoadmapPage from './components/RoadmapPage';
import ReviewsPage from './components/ReviewsPage';
import ResourcesPage from './components/ResourcesPage';
import DocumentsPage from './components/DocumentsPage';
import SettingsPage from './components/SettingsPage';
import EmergingDetailsPage from './components/EmergingDetailsPage';
import AllChildrenPage from './components/AllChildrenPage';
import StyleGuidePage from './components/StyleGuidePage';
import AddChildFlow from './components/AddChildFlow';
import NewChildPreviewPage from './components/NewChildPreviewPage';
import ScrollToTop from './components/ScrollToTop';

import { ChildProvider } from './context/ChildContext';
import { LockerProvider } from './context/LockerContext';
import { useCurrentChild } from './context/ChildContext';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentChild } = useCurrentChild();
  
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

  const handlePageChange = (page: Page) => {
    navigate(`/${page === 'all-children' ? '' : page}`);
  };

  const openSetup = () => setIsSetupOpen(true);
  const closeSetup = () => setIsSetupOpen(false);

  const withPreAssessmentGuard = (element: ReactElement) => (
    currentChild.isNew ? <NewChildPreviewPage onPageChange={handlePageChange} onOpenSetup={openSetup} /> : element
  );

  return (
    <>
      <ScrollToTop />
      {isSetupOpen && (
        <AddChildFlow
          asModal
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
            onAddChildRequest={() => navigate('/setup')}
          >
            <Routes>
              <Route path="/" element={<AllChildrenPage onPageChange={handlePageChange} />} />
              <Route path="/home" element={withPreAssessmentGuard(<HomePage onPageChange={handlePageChange} onOpenSetup={openSetup} />)} />
              <Route path="/preview" element={<NewChildPreviewPage onPageChange={handlePageChange} onOpenSetup={openSetup} />} />
              <Route path="/understanding" element={<UnderstandingPage onPageChange={handlePageChange} onOpenSetup={openSetup} />} />
              <Route path="/priorities" element={withPreAssessmentGuard(<PrioritiesPage onPageChange={handlePageChange} />)} />
              <Route path="/roadmap" element={withPreAssessmentGuard(<RoadmapPage onPageChange={handlePageChange} />)} />
              <Route path="/reviews" element={withPreAssessmentGuard(<ReviewsPage onPageChange={handlePageChange} />)} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/documents" element={currentChild.isNew ? <Navigate to="/home" replace /> : <DocumentsPage />} />
              <Route path="/settings" element={
                <SettingsPage
                  onPageChange={handlePageChange}
                  onAddChildRequest={() => navigate('/setup')}
                />
              } />
              <Route path="/emerging-details" element={withPreAssessmentGuard(<EmergingDetailsPage onPageChange={handlePageChange} />)} />
              <Route path="/style-guide" element={<StyleGuidePage onPageChange={handlePageChange} />} />
              <Route path="*" element={<AllChildrenPage onPageChange={handlePageChange} />} />
            </Routes>
          </DashboardLayout>
        } />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ChildProvider>
        <LockerProvider>
          <AppContent />
        </LockerProvider>
      </ChildProvider>
    </BrowserRouter>
  );
}
