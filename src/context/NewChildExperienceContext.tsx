import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

type NewChildExperience = "current" | "review";

interface NewChildExperienceContextType {
  isReviewExperience: boolean;
  newChildExperience: NewChildExperience;
  setNewChildExperience: (experience: NewChildExperience) => void;
}

const STORAGE_KEY = "threadline-new-child-experience";

const NewChildExperienceContext = createContext<NewChildExperienceContextType | undefined>(undefined);

export function NewChildExperienceProvider({ children }: { children: ReactNode }) {
  const [newChildExperience, setNewChildExperienceState] = useState<NewChildExperience>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "current" ? "current" : "review";
    } catch {
      return "review";
    }
  });

  const setNewChildExperience = (experience: NewChildExperience) => {
    setNewChildExperienceState(experience);
    try {
      localStorage.setItem(STORAGE_KEY, experience);
    } catch {
      // Storage can be unavailable in restricted contexts; in-memory state still works.
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-new-child-experience", newChildExperience);
  }, [newChildExperience]);

  const value = useMemo(
    () => ({
      isReviewExperience: newChildExperience === "review",
      newChildExperience,
      setNewChildExperience,
    }),
    [newChildExperience],
  );

  return (
    <NewChildExperienceContext.Provider value={value}>
      {children}
    </NewChildExperienceContext.Provider>
  );
}

export function useNewChildExperience() {
  const context = useContext(NewChildExperienceContext);
  if (!context) {
    throw new Error("useNewChildExperience must be used within a NewChildExperienceProvider");
  }
  return context;
}
