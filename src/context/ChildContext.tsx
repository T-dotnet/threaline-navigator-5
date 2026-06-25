import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Child } from '../types';

interface ChildContextType {
  childrenList: Child[];
  currentChild: Child;
  setChild: (child: Child) => void;
  addChild: (child: Child) => void;
}

const INITIAL_CHILDREN: Child[] = [
  { name: 'Maya', age: 9, initial: 'M' },
  { name: 'Liam', age: 6, initial: 'L' },
  { name: 'Sophia', age: 12, initial: 'S' }
];

const ChildContext = createContext<ChildContextType | undefined>(undefined);

export function ChildProvider({ children }: { children: ReactNode }) {
  const [childrenList, setChildrenList] = useState<Child[]>(INITIAL_CHILDREN);
  const [currentChild, setCurrentChild] = useState<Child>(INITIAL_CHILDREN[0]);

  const setChild = useCallback((child: Child) => {
    setCurrentChild(child);
  }, []);

  const addChild = useCallback((child: Child) => {
    setChildrenList((prev) => [...prev, child]);
    setCurrentChild(child);
  }, []);

  const value = React.useMemo(() => ({
    childrenList,
    currentChild,
    setChild,
    addChild
  }), [childrenList, currentChild, setChild, addChild]);

  return (
    <ChildContext.Provider value={value}>
      {children}
    </ChildContext.Provider>
  );
}

export function useCurrentChild() {
  const context = useContext(ChildContext);
  if (context === undefined) {
    throw new Error('useCurrentChild must be used within a ChildProvider');
  }
  return context;
}
