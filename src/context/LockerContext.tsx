import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { FileText, Folder, Camera, Activity, LucideIcon } from 'lucide-react';

export interface DocFile {
  typeId: string;
  typeName: string;
  name: string;
  date: string;
  shared: boolean;
  sharedWith?: string;
  icon: LucideIcon;
}

const INITIAL_FILES: DocFile[] = [
  {
    typeId: "report",
    typeName: "Report",
    name: "Actionable Clarity Report",
    date: "8 Jun 2026",
    shared: false,
    icon: FileText,
  },
  {
    typeId: "schoolpack",
    typeName: "School Pack",
    name: "School Clarity Pack",
    date: "8 Jun 2026",
    shared: true,
    sharedWith: "Homeroom Teacher",
    icon: Folder,
  },
  {
    typeId: "school",
    typeName: "School",
    name: "Teacher Meeting Preparation Notes",
    date: "10 Jun 2026",
    shared: false,
    icon: Camera,
  },
  {
    typeId: "clinical",
    typeName: "Clinical",
    name: "Parent Observations Log — Sleep Prep",
    date: "12 Jun 2026",
    shared: true,
    sharedWith: "Dr. Sarah Vance",
    icon: Activity,
  },
  {
    typeId: "report",
    typeName: "Report",
    name: "Progress Review — Early Baseline",
    date: "15 Jun 2026",
    shared: false,
    icon: FileText,
  },
];

interface LockerContextType {
  files: DocFile[];
  search: string;
  filter: string;
  setSearch: (s: string) => void;
  setFilter: (f: string) => void;
  toggleShare: (index: number) => void;
  filteredFiles: DocFile[];
}

const LockerContext = createContext<LockerContextType | undefined>(undefined);

export function LockerProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<DocFile[]>(INITIAL_FILES);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const toggleShare = useCallback((index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      const file = { ...newFiles[index] };
      if (file.shared) {
        file.shared = false;
        file.sharedWith = undefined;
      } else {
        file.shared = true;
        file.sharedWith = "your care circle";
      }
      newFiles[index] = file;
      return newFiles;
    });
  }, []);

  const handleSetSearch = useCallback((s: string) => {
    setSearch(s);
  }, []);

  const handleSetFilter = useCallback((f: string) => {
    setFilter(f);
  }, []);

  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "all" || f.typeId === filter;
      return matchSearch && matchFilter;
    });
  }, [files, search, filter]);

  const value = useMemo(() => ({
    files,
    search,
    filter,
    setSearch: handleSetSearch,
    setFilter: handleSetFilter,
    toggleShare,
    filteredFiles
  }), [files, search, filter, handleSetSearch, handleSetFilter, toggleShare, filteredFiles]);

  return (
    <LockerContext.Provider value={value}>
      {children}
    </LockerContext.Provider>
  );
}

export function useLocker() {
  const context = useContext(LockerContext);
  if (context === undefined) {
    throw new Error('useLocker must be used within a LockerProvider');
  }
  return context;
}
