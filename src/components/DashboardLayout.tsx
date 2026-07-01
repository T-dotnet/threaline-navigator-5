import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import QuickNoteComposer from "./QuickNoteComposer";
import { Page } from "../types";
import { AnimatePresence } from "motion/react";

interface DashboardLayoutProps {
  children: ReactNode;
  currentPage: Page;
  onPageChange: (page: Page) => void;
  onAddChildRequest: () => void;
}

export default function DashboardLayout({
  children,
  currentPage,
  onPageChange,
  onAddChildRequest,
}: DashboardLayoutProps) {
  const showSidebar = currentPage !== "style-guide";

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-thread-off-white)] font-sans antialiased text-[var(--color-thread-darkest)]">
      {showSidebar && <Sidebar currentPage={currentPage} onPageChange={onPageChange} />}

      <main className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          currentPage={currentPage}
          onAddChildRequest={onAddChildRequest}
          onPageChange={onPageChange}
        />

        <div
          className="flex-1 overflow-y-auto scroll-smooth"
        >
          <AnimatePresence mode="wait">{children}</AnimatePresence>
        </div>
      </main>

      {currentPage !== "diary" && <QuickNoteComposer />}
    </div>
  );
}
