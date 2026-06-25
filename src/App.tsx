/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Page, Child } from './types';
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
import ScrollToTop from './components/ScrollToTop';

const INITIAL_CHILDREN: Child[] = [
  { name: 'Maya', age: 9, initial: 'M' },
  { name: 'Liam', age: 6, initial: 'L' },
  { name: 'Sophia', age: 12, initial: 'S' }
];

import { ChildProvider } from './context/ChildContext';
import { LockerProvider } from './context/LockerContext';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Derive currentPage from location
  const getCurrentPage = (): Page => {
    const path = location.pathname.substring(1) || 'all-children';
    return path as Page;
  };

  const currentPage = getCurrentPage();
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);

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

  const handlePageChange = (page: Page) => {
    navigate(`/${page === 'all-children' ? '' : page}`);
  };

  return (
    <>
      <ScrollToTop />
      <DashboardLayout
        currentPage={currentPage}
        onPageChange={handlePageChange}
        isAddChildModalOpen={isAddChildModalOpen}
        onAddChildRequest={() => setIsAddChildModalOpen(true)}
        onCloseAddChildModal={() => setIsAddChildModalOpen(false)}
      >
        <Routes>
          <Route path="/" element={<AllChildrenPage onPageChange={handlePageChange} />} />
          <Route path="/home" element={<HomePage onPageChange={handlePageChange} />} />
          <Route path="/understanding" element={<UnderstandingPage onPageChange={handlePageChange} />} />
          <Route path="/priorities" element={<PrioritiesPage onPageChange={handlePageChange} />} />
          <Route path="/roadmap" element={<RoadmapPage onPageChange={handlePageChange} />} />
          <Route path="/reviews" element={<ReviewsPage onPageChange={handlePageChange} />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/settings" element={
            <SettingsPage 
              onPageChange={handlePageChange} 
              onAddChildRequest={() => setIsAddChildModalOpen(true)}
            />
          } />
          <Route path="/emerging-details" element={<EmergingDetailsPage onPageChange={handlePageChange} />} />
          <Route path="/style-guide" element={<StyleGuidePage onPageChange={handlePageChange} />} />
          <Route path="*" element={<AllChildrenPage onPageChange={handlePageChange} />} />
        </Routes>
      </DashboardLayout>
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
