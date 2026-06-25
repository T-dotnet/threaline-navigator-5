import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Bell,
  Plus,
  Settings,
  LogOut,
  Sliders,
  Users,
  Palette,
  Menu,
  X,
  Home,
  Info,
  ListTodo,
  Milestone,
  LineChart,
  BookOpen,
  Lock,
} from "lucide-react";
import { Child } from "../types";
import { Avatar } from "./ui/Avatar";
import { IconButton } from "./ui/IconButton";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";

import { useCurrentChild } from "../context/ChildContext";
import { useCallback } from "react";

interface TopBarProps {
  currentPage?: any;
  onAddChildRequest: () => void;
  onPageChange: (page: any) => void;
}

export default function TopBar({
  currentPage,
  onAddChildRequest,
  onPageChange,
}: TopBarProps) {
  const { currentChild, childrenList, setChild } = useCurrentChild();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const alertsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleChildSwitch = useCallback((child: Child) => {
    setChild(child);
    if (currentPage === "all-children") {
      onPageChange("home");
    }
    setIsDropdownOpen(false);
  }, [setChild, currentPage, onPageChange]);

  const handleAllChildrenSelect = useCallback(() => {
    onPageChange("all-children");
    setIsDropdownOpen(false);
  }, [onPageChange]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        alertsRef.current &&
        !alertsRef.current.contains(event.target as Node)
      ) {
        setIsAlertsOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between px-11 py-4.5 border-b border-black/5 bg-[var(--color-thread-off-white)] sticky top-0 z-10 max-md:px-5">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 bg-white rounded-full p-1.5 pr-2.5 cursor-pointer shadow-sm hover:shadow-md transition-all font-sans"
        >
          {currentPage === "all-children" ? (
            <>
              <Avatar
                size="sm"
                className="bg-[var(--color-thread-mid-green)] text-white"
                fallback={<Users className="w-3.5 h-3.5 stroke-[2.2]" />}
              />
              <div className="flex flex-col text-left leading-none">
                <span className="font-semibold text-[0.9rem] text-slate-900">
                  All Children
                </span>
                <span className="text-[0.68rem] text-slate-500 mt-0.5">
                  Family synthesis
                </span>
              </div>
            </>
          ) : (
            <>
              <Avatar
                size="sm"
                fallback={currentChild.initial}
                className="bg-[var(--color-thread-mid-green)] text-white font-serif"
              />
              <div className="flex flex-col text-left leading-none">
                <span className="font-semibold text-[0.9rem] text-slate-900">
                  {currentChild.name}
                </span>
                <span className="text-[0.72rem] text-slate-500 mt-0.5">
                  Age {currentChild.age}
                </span>
              </div>
            </>
          )}
          <ChevronDown
            className={cn(
              "w-[15px] h-[15px] text-slate-500 stroke-[2] ml-1 transition-transform duration-200",
              isDropdownOpen && "rotate-180",
            )}
          />
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute top-14 left-0 w-60 bg-white rounded-2xl border border-black/5 shadow-dropdown py-2 z-50 font-sans"
            >
              <div className="px-4 py-2.5">
                <span className="text-[0.6rem] tracking-[0.16em] uppercase text-slate-400 font-semibold">
                  Select Child Profile
                </span>
              </div>

              <div className="flex flex-col">
                <button
                  onClick={handleAllChildrenSelect}
                  className={cn(
                    "flex items-center gap-3.5 px-4 py-4 w-full text-left transition-all border-b border-black/5 group/all min-h-[44px]",
                    currentPage === "all-children"
                      ? "bg-slate-50"
                      : "hover:bg-slate-50"
                  )}
                  id="all-children-dropdown-option"
                >
                  <Avatar
                    size="md"
                    className={cn(
                      currentPage === "all-children"
                        ? "bg-[var(--color-thread-mid-green)] text-white"
                        : "bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)] group-hover/all:bg-[var(--color-thread-mid-green)] group-hover/all:text-white"
                    )}
                    fallback={<Users className="w-4 h-4 stroke-[2]" />}
                  />
                  <div className="flex flex-col leading-none">
                    <span className={cn(
                      "text-[0.92rem] tracking-tight font-semibold",
                      currentPage === "all-children"
                        ? "text-[var(--color-thread-mid-green)]"
                        : "text-[var(--color-thread-heading)]"
                    )}>
                      All Children Overview
                    </span>
                    <span className="text-[0.7rem] text-slate-500 mt-1">
                      Family synthesis & schemes
                    </span>
                  </div>
                </button>

                {childrenList.map((child, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleChildSwitch(child)}
                    className={cn(
                      "flex items-center gap-3.5 px-4 py-3.5 w-full text-left transition-colors min-h-[44px]",
                      (currentChild.name === child.name && currentPage !== "all-children")
                        ? "bg-slate-50"
                        : "hover:bg-slate-50",
                    )}
                  >
                    <Avatar
                      size="md"
                      className="bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)] font-serif"
                      fallback={child.initial}
                    />
                    <div className="flex flex-col leading-none">
                      <span
                        className={cn(
                          "text-[0.92rem] tracking-tight",
                          (currentChild.name === child.name && currentPage !== "all-children")
                            ? "font-semibold text-slate-900"
                            : "font-medium text-slate-700",
                        )}
                      >
                        {child.name}
                      </span>
                      <span className="text-[0.7rem] text-slate-500 mt-0.5">
                        Age {child.age}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="border-t border-black/5 mt-2 pt-2 px-2">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onAddChildRequest();
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 w-full text-left hover:bg-slate-50 rounded-xl transition-colors group"
                >
                  <div className="w-[28px] h-[28px] rounded-full border border-black/10 flex items-center justify-center text-slate-400 group-hover:text-slate-600 transition-colors">
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span className="text-[0.84rem] font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                    Add child profile
                  </span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-3 items-center">
        <div className="relative" ref={alertsRef}>
          <IconButton
            onClick={() => setIsAlertsOpen(!isAlertsOpen)}
            hasBadge
          >
            <Bell className="w-[19px] h-[19px] stroke-[1.8]" />
          </IconButton>

          <AnimatePresence>
            {isAlertsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="fixed sm:absolute top-20 sm:top-14 left-4 right-4 sm:left-auto sm:right-0 w-auto sm:w-[380px] bg-white rounded-[24px] border border-black/5 shadow-modal py-6 z-50 font-sans"
              >
                <div className="px-6 mb-5">
                  <span className="text-[0.75rem] tracking-[0.1em] uppercase text-[var(--color-thread-mid-green)] font-medium mb-1.5 block">
                    Live updates for {currentChild.name}
                  </span>
                  <h2 className="text-[1.05rem] font-semibold text-[var(--color-thread-dark-slate)] tracking-tight leading-none">
                    Development Alerts
                  </h2>
                </div>

                <div className="flex flex-col gap-3.5 px-6 mb-6 max-h-[340px] overflow-y-auto">
                  <div className="bg-white rounded-[16px] p-4.5 relative overflow-hidden shadow-sm hover:shadow-md transition-all group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-thread-mid-green)]" />
                    <h3 className="font-semibold text-[var(--color-thread-dark-slate)] text-[0.95rem] mb-1.5 tracking-tight group-hover:text-[var(--color-thread-mid-green)] transition-colors">
                      Sleep latency watch:
                    </h3>
                    <p className="text-[0.88rem] text-[var(--color-thread-gray)] leading-relaxed">
                      Mild circadian disruption detected. Recommended routine
                      alignment before reviews day.
                    </p>
                  </div>

                  <div className="bg-white rounded-[16px] p-4.5 relative overflow-hidden shadow-sm hover:shadow-md transition-all group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-thread-mid-green)]" />
                    <h3 className="font-semibold text-[var(--color-thread-dark-slate)] text-[0.95rem] mb-1.5 tracking-tight group-hover:text-[var(--color-thread-mid-green)] transition-colors">
                      Primary strategy completed:
                    </h3>
                    <p className="text-[0.88rem] text-[var(--color-thread-gray)] leading-relaxed">
                      Parent feedback form compiled & secure cloud-synced to
                      primary clinical therapist.
                    </p>
                  </div>
                </div>

                <div className="border-t border-black/5 px-6 pt-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsAlertsOpen(false)}
                      className="text-[0.84rem] font-semibold text-[var(--color-thread-gray)] hover:text-[var(--color-thread-dark-slate)] transition-colors"
                    >
                      Cleared all notices
                    </button>
                  </div>
                  <button className="text-[0.84rem] font-medium text-[var(--color-thread-gray)] hover:text-[var(--color-thread-mid-green)] transition-colors">
                    Refresh Logs
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative" ref={profileRef}>
          <Avatar
            role="button"
            tabIndex={0}
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            size="lg"
            className="cursor-pointer hover:opacity-90 font-serif bg-[var(--color-thread-mid-green)] text-white shadow-sm"
            fallback="S"
          />

          <AnimatePresence>
            {isProfileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute top-14 right-0 w-64 bg-white rounded-2xl border border-black/5 shadow-dropdown py-2.5 z-50 font-sans"
              >
                <div className="px-4.5 py-2 mb-1.5 border-b border-black/5">
                  <span className="text-[0.65rem] tracking-[0.12em] uppercase text-slate-400 font-bold block mb-0.5">
                    Clinical Workspace
                  </span>
                  <span className="text-[0.80rem] font-medium text-slate-700 block truncate">
                    dnstudio.syd@gmail.com
                  </span>
                </div>

                <div className="flex flex-col gap-0.5 px-1.5">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onPageChange("style-guide");
                    }}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl w-full text-left hover:bg-slate-50 transition-colors group min-h-[44px]"
                  >
                    <Palette className="w-[18px] h-[18px] text-slate-400 group-hover:text-[var(--color-thread-mid-green)] transition-colors" />
                    <span className="text-[0.90rem] font-medium text-slate-700 group-hover:text-slate-900">
                      Style & Design Tokens
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onPageChange("settings");
                    }}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl w-full text-left hover:bg-slate-50 transition-colors group min-h-[44px]"
                  >
                    <Settings className="w-[18px] h-[18px] text-slate-400 group-hover:text-slate-600 transition-colors" />
                    <span className="text-[0.90rem] font-medium text-slate-700 group-hover:text-slate-900">
                      App Settings
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onPageChange("settings");
                      setTimeout(() => {
                        const target = document.getElementById("notification-settings-section");
                        if (target) {
                          target.scrollIntoView({ behavior: "smooth", block: "center" });
                        }
                      }, 120);
                    }}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl w-full text-left hover:bg-slate-50 transition-colors group min-h-[44px]"
                  >
                    <Bell className="w-[18px] h-[18px] text-slate-400 group-hover:text-amber-500 transition-colors" />
                    <span className="text-[0.90rem] font-medium text-slate-700 group-hover:text-slate-900">
                      Notification Settings
                    </span>
                  </button>

                  <div className="border-t border-black/5 my-1" />

                  <button 
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl w-full text-left hover:bg-red-50 transition-colors group min-h-[44px]"
                  >
                    <LogOut className="w-[18px] h-[18px] text-slate-400 group-hover:text-red-500 transition-colors" />
                    <span className="text-[0.90rem] font-medium text-slate-700 group-hover:text-red-600">
                      Log out
                    </span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Burger Menu Button (Visible on Mobile only, placed right of user avatar) */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden flex items-center justify-center w-11 h-11 bg-white border border-black/5 rounded-full shadow-xs hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-all cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5 stroke-[2]" />
        </button>
      </div>

      {/* Full-Page Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-0 bg-white z-[999] flex flex-col font-sans p-6 overflow-y-auto"
          >
            {/* Header with App Logo and Close Button */}
            <div className="flex items-center justify-between pb-6 border-b border-black/5 mb-8">
              <div className="flex items-center gap-2.5">
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
                <div className="flex flex-col leading-none">
                  <span className="font-serif font-medium text-[1.22rem] tracking-tight text-[var(--color-thread-heading)]">
                    Threadline
                  </span>
                  <span className="font-sans text-[0.55rem] tracking-[0.22em] uppercase text-[var(--color-thread-gray)] font-semibold mt-1">
                    Safe Harbor
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile context snippet */}
            <div className="bg-slate-50 rounded-2xl p-4.5 mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar
                  size="md"
                  fallback={currentPage === "all-children" ? <Users className="w-4 h-4 stroke-[2]" /> : currentChild.initial}
                  className="bg-[var(--color-thread-mid-green)] text-white font-serif"
                />
                <div className="flex flex-col text-left leading-none">
                  <span className="font-semibold text-[0.95rem] text-slate-900">
                    {currentPage === "all-children" ? "All Children" : currentChild.name}
                  </span>
                  <span className="text-[0.74rem] text-slate-500 mt-1">
                    {currentPage === "all-children" ? "Family Synthesis" : `Age ${currentChild.age}`}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsDropdownOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="text-xs font-semibold text-[var(--color-thread-mid-green)] bg-white border border-black/5 py-1.5 px-3 rounded-lg shadow-xs cursor-pointer hover:bg-slate-50"
              >
                Switch Profile
              </button>
            </div>

            {/* Navigation links */}
            <div className="flex flex-col gap-2.5 flex-1">
              <span className="text-[0.65rem] tracking-[0.16em] uppercase text-slate-400 font-bold mb-1.5 px-3">
                Navigation Menu
              </span>
              {[
                { id: "home", label: "Home", icon: Home },
                { id: "understanding", label: "Understanding", icon: Info },
                { id: "priorities", label: "Priorities", icon: ListTodo },
                { id: "roadmap", label: "Roadmap", icon: Milestone },
                { id: "reviews", label: "Reviews", icon: LineChart },
                { id: "resources", label: "Resources", icon: BookOpen },
                { id: "documents", label: "Documents", icon: Lock },
                { id: "settings", label: "App Settings", icon: Settings },
                { id: "style-guide", label: "Style Guide & Tokens", icon: Palette },
              ].map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id as any);
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-4 px-4 py-4 rounded-xl text-[1rem] font-medium transition-all text-left cursor-pointer min-h-[48px]",
                      isActive
                        ? "bg-[var(--color-thread-light-green)] text-[var(--color-thread-dark-slate)] font-bold shadow-xs"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <item.icon className={cn(
                      "w-5 h-5 stroke-[2]",
                      isActive ? "text-[var(--color-thread-mid-green)]" : "text-slate-400"
                    )} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Footer Workspace Info */}
            <div className="mt-12 pt-6 border-t border-black/5 text-center flex flex-col items-center gap-1.5">
              <span className="text-[0.74rem] text-slate-400">Clinical Workspace</span>
              <span className="text-[0.80rem] font-medium text-slate-600">dnstudio.syd@gmail.com</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
