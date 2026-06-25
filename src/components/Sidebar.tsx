import { useState } from "react";
import {
  Home,
  Info,
  ListTodo,
  Milestone,
  LineChart,
  BookOpen,
  Lock,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Page } from "../types";
import { cn } from "../lib/utils";
import { motion } from "motion/react";

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export default function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "understanding", label: "Understanding", icon: Info },
    { id: "priorities", label: "Priorities", icon: ListTodo },
    { id: "roadmap", label: "Roadmap", icon: Milestone },
    { id: "reviews", label: "Reviews", icon: LineChart },
    { id: "resources", label: "Resources", icon: BookOpen },
    { id: "documents", label: "Documents", icon: Lock },
  ] as const;

  const isAllChildrenPage = currentPage === "all-children";

  return (
    <motion.aside
      animate={{ width: (isCollapsed || isAllChildrenPage) ? 80 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex-shrink-0 bg-[var(--color-thread-off-white)] border-r border-black/5 flex flex-col p-6 max-md:hidden relative"
    >
      {!isAllChildrenPage && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-12 w-6 h-6 bg-white border border-black/10 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all z-20 shadow-sm max-md:hidden"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      )}

      <div
        className="flex items-center gap-2.5 px-2.5 pb-8 cursor-pointer group"
        onClick={() => onPageChange("all-children")}
      >
        <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
          <svg width="23" height="23" viewBox="0 0 22 22" fill="none">
            <path
              d="M3 19 C 8 14, 6 8, 11 6 C 16 4, 14 12, 19 9"
              stroke="var(--color-thread-mid-green)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle
              cx="19"
              cy="9"
              r="2.4"
              fill="var(--color-thread-mid-green)"
            />
          </svg>
        </div>
        <div
          className={cn(
            "flex flex-col leading-none transition-opacity duration-200 grow min-w-0 overflow-hidden",
            (isCollapsed || isAllChildrenPage)
              ? "opacity-0 invisible w-0"
              : "opacity-100 visible w-auto",
          )}
        >
          <span className="font-serif font-medium text-[1.22rem] tracking-tight whitespace-nowrap text-[var(--color-thread-heading)]">
            Threadline
          </span>
          <span className="font-sans text-[0.55rem] tracking-[0.22em] uppercase text-[var(--color-thread-gray)] font-semibold mt-1 whitespace-nowrap">
            Safe Harbor
          </span>
        </div>
      </div>

      {!isAllChildrenPage && (
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPageChange(item.id as Page)}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3.5 px-3 py-3 rounded-xl text-[var(--color-thread-muted-green)] font-medium text-[0.92rem] transition-all cursor-pointer hover:bg-black/5 hover:text-[var(--color-thread-dark-slate)] relative group/nav min-h-[44px]",
                currentPage === item.id &&
                  "bg-[var(--color-thread-light-green)] text-[var(--color-thread-dark-slate)] font-semibold",
              )}
            >
              <item.icon className="w-[19px] h-[19px] stroke-[1.8] flex-shrink-0" />
              <span
                className={cn(
                  "max-md:hidden transition-opacity duration-200 whitespace-nowrap overflow-hidden",
                  isCollapsed
                    ? "opacity-0 invisible w-0"
                    : "opacity-100 visible w-auto",
                )}
              >
                {item.label}
              </span>
            </motion.button>
          ))}
        </nav>
      )}

      <div className="flex-1" />

      {!isAllChildrenPage && (
        <div className="border-t border-black/5 pt-2.5">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => onPageChange("settings")}
            title={isCollapsed ? "Settings" : undefined}
            className={cn(
              "flex items-center gap-3.5 px-3 py-3 rounded-lg text-[var(--color-thread-muted-green)] font-medium text-[0.92rem] transition-all cursor-pointer hover:bg-black/5 hover:text-[var(--color-thread-dark-slate)] w-full min-h-[44px]",
              currentPage === "settings" &&
                "bg-[var(--color-thread-light-green)] text-[var(--color-thread-dark-slate)] font-semibold",
            )}
          >
            <Settings className="w-[19px] h-[19px] stroke-[1.8] flex-shrink-0" />
            <span
              className={cn(
                "max-md:hidden transition-opacity duration-200 whitespace-nowrap overflow-hidden",
                isCollapsed
                  ? "opacity-0 invisible w-0"
                  : "opacity-100 visible w-auto",
              )}
            >
              Settings
            </span>
          </motion.button>
        </div>
      )}
    </motion.aside>
  );
}
