import React, { createContext, ReactNode, useContext, useEffect, useMemo } from "react";

type DisplayMode = "classic" | "parent-clarity";

interface DisplayModeContextType {
  displayMode: DisplayMode;
  isParentClarity: boolean;
}

const DisplayModeContext = createContext<DisplayModeContextType | undefined>(undefined);

export function DisplayModeProvider({ children }: { children: ReactNode }) {
  const displayMode: DisplayMode = "parent-clarity";

  useEffect(() => {
    document.documentElement.setAttribute("data-display-mode", displayMode);
  }, []);

  const value = useMemo(
    () => ({
      displayMode,
      isParentClarity: true,
    }),
    [],
  );

  return (
    <DisplayModeContext.Provider value={value}>
      {children}
    </DisplayModeContext.Provider>
  );
}

export function useDisplayMode() {
  const context = useContext(DisplayModeContext);
  if (!context) {
    throw new Error("useDisplayMode must be used within a DisplayModeProvider");
  }
  return context;
}
