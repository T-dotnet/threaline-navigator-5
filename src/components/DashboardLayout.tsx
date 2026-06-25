import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import AddChildModal from "./AddChildModal";
import { Page, Child } from "../types";
import { AnimatePresence } from "motion/react";

import { useCurrentChild } from "../context/ChildContext";

interface DashboardLayoutProps {
  children: ReactNode;
  currentPage: Page;
  onPageChange: (page: Page) => void;
  isAddChildModalOpen: boolean;
  onAddChildRequest: () => void;
  onCloseAddChildModal: () => void;
}

export default function DashboardLayout({
  children,
  currentPage,
  onPageChange,
  isAddChildModalOpen,
  onAddChildRequest,
  onCloseAddChildModal,
}: DashboardLayoutProps) {
  const { currentChild, childrenList, setChild, addChild } = useCurrentChild();

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-thread-off-white)] font-sans antialiased text-[var(--color-thread-darkest)]">
      <Sidebar currentPage={currentPage} onPageChange={onPageChange} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          currentPage={currentPage}
          currentChild={currentChild}
          childrenList={childrenList}
          onChildChange={setChild}
          onAddChildRequest={onAddChildRequest}
          onPageChange={onPageChange}
        />

        <div
          className="flex-1 overflow-y-auto scroll-smooth"
        >
          <AnimatePresence mode="wait">{children}</AnimatePresence>
        </div>
      </main>

      <AddChildModal
        isOpen={isAddChildModalOpen}
        onClose={onCloseAddChildModal}
        onAdd={addChild}
      />
    </div>
  );
}
