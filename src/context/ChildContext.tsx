import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Child } from '../types';
import { QUESTIONNAIRE_SECTIONS } from '../questionnaire';

interface ChildContextType {
  childrenList: Child[];
  currentChild: Child;
  setChild: (child: Child) => void;
  addChild: (child: Child) => void;
  updateChild: (child: Child) => void;
  deleteChild: (childId: string) => void;
  createNewChild: () => Child;
}

const INITIAL_CHILDREN: Child[] = [
  { id: 'child-tom', name: 'Tom', age: 8, initial: 'T', isNew: true, intake: {} },
  {
    id: 'child-ava',
    name: 'Ava',
    age: 7,
    initial: 'A',
    isNew: true,
    intake: {
      relation: 'Parent',
      journeyStage: 'Waiting for assessment',
      availableInfo: ['School reports', 'Teacher observations'],
      notices: ['Attention feels harder in busy settings', 'Transitions can take extra reassurance'],
      notes: 'Ava is booked for her first session. The family has shared school context and wants help connecting everyday observations with the assessment conversation.',
      sessionDay: '26',
      sessionTime: '4:00 pm',
      questionnaireAnswers: {
        attention_focus: 'Creative or play activities',
        behaviour_emotions: 'Quiet reassurance and time',
        sleep: 'Mornings',
        learning: 'Starting or finishing tasks',
        movement_coordination: 'Transitions or changes',
        speech_communication: 'Withdraws or becomes quiet',
        school_participation: 'Participates with some support',
        friendships: 'Enjoys playing but has occasional conflicts',
        dev_available_information: ['School reports', 'Teacher observations'],
      },
      completedQuestionnaireSections: QUESTIONNAIRE_SECTIONS,
    },
  },
  { id: 'child-maya', name: 'Maya', age: 9, initial: 'M' },
  { id: 'child-liam', name: 'Liam', age: 10, initial: 'L' },
  { id: 'child-noah', name: 'Noah', age: 8, initial: 'N' },
];

const CHILDREN_STORAGE_KEY = 'threadline-children';
const CURRENT_CHILD_STORAGE_KEY = 'threadline-current-child';
const DEMO_DATA_VERSION_KEY = 'threadline-demo-data-version';
const DEMO_DATA_VERSION = 'quarter-zero-noah-v1';

const CANONICAL_CHILDREN_BY_ID: Record<string, Child> = {
  'child-maya': INITIAL_CHILDREN[2],
  'child-liam': INITIAL_CHILDREN[3],
  'child-noah': INITIAL_CHILDREN[4],
};

const LEGACY_CANONICAL_ID_ALIASES: Record<string, string> = {
  'child-new': 'child-tom',
  'child-new-0': 'child-tom',
  'child-tom-0': 'child-tom',
  'child-ava-1': 'child-ava',
  'child-maya-0': 'child-maya',
  'child-maya-1': 'child-maya',
  'child-maya-2': 'child-maya',
  'child-liam-0': 'child-liam',
  'child-liam-1': 'child-liam',
  'child-liam-2': 'child-liam',
  'child-liam-3': 'child-liam',
  'child-noah-0': 'child-noah',
  'child-noah-1': 'child-noah',
};

function createChildId() {
  return `child-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createDefaultChildName(children: Child[]) {
  const base = 'New child';
  if (!children.some((child) => child.name === base)) return base;
  let index = 1;
  while (children.some((child) => child.name === `${base} ${index}`)) {
    index += 1;
  }
  return `${base} ${index}`;
}

function childIdFor(child: Child, index: number) {
  if (!child.id && child.name === 'Tom') return 'child-tom';
  if (!child.id && child.name === 'Ava') return 'child-ava';
  if (!child.id && index === 0 && child.name === 'New child') return 'child-tom';
  if (!child.id && child.name === 'Maya') return 'child-maya';
  if (!child.id && child.name === 'Liam') return 'child-liam';
  if (!child.id && child.name === 'Noah') return 'child-noah';
  return child.id || `child-${child.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'profile'}-${index}`;
}

function resetStoredChildrenForNewDemoSeed() {
  try {
    if (localStorage.getItem(DEMO_DATA_VERSION_KEY) === DEMO_DATA_VERSION) return;
    localStorage.removeItem(CHILDREN_STORAGE_KEY);
    localStorage.removeItem(CURRENT_CHILD_STORAGE_KEY);
    localStorage.setItem(DEMO_DATA_VERSION_KEY, DEMO_DATA_VERSION);
  } catch {
    // Storage can be unavailable in restricted contexts; in-memory defaults still work.
  }
}

function normalizeChildren(children: Child[]) {
  const normalized = children.map((child, index) => {
    const id = LEGACY_CANONICAL_ID_ALIASES[childIdFor(child, index)] || childIdFor(child, index);
    const canonicalChild = CANONICAL_CHILDREN_BY_ID[id];
    return canonicalChild || {
      ...child,
      id,
    };
  });
  const hasNoah = normalized.some((child) => child.id === 'child-noah' || child.name === 'Noah');
  return hasNoah ? normalized : [...normalized, INITIAL_CHILDREN[4]];
}

function readStoredChildren() {
  try {
    resetStoredChildrenForNewDemoSeed();
    const stored = localStorage.getItem(CHILDREN_STORAGE_KEY);
    if (!stored) return INITIAL_CHILDREN;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length > 0 ? normalizeChildren(parsed) : INITIAL_CHILDREN;
  } catch {
    return INITIAL_CHILDREN;
  }
}

function readStoredCurrentChild(children: Child[]) {
  try {
    const stored = localStorage.getItem(CURRENT_CHILD_STORAGE_KEY);
    const storedId = stored ? LEGACY_CANONICAL_ID_ALIASES[stored] || stored : stored;
    return children.find((child) => child.id === storedId || child.name === storedId) || children[0];
  } catch {
    return children[0];
  }
}

const ChildContext = createContext<ChildContextType | undefined>(undefined);

export function ChildProvider({ children }: { children: ReactNode }) {
  const [childrenList, setChildrenList] = useState<Child[]>(readStoredChildren);
  const [currentChild, setCurrentChild] = useState<Child>(() => readStoredCurrentChild(childrenList));

  useEffect(() => {
    try {
      localStorage.setItem(CHILDREN_STORAGE_KEY, JSON.stringify(childrenList));
      localStorage.setItem(CURRENT_CHILD_STORAGE_KEY, currentChild.id || currentChild.name);
      localStorage.setItem(DEMO_DATA_VERSION_KEY, DEMO_DATA_VERSION);
    } catch {
      // Storage can be unavailable in restricted contexts; in-memory state still works.
    }
  }, [childrenList, currentChild.id, currentChild.name]);

  const setChild = useCallback((child: Child) => {
    setCurrentChild(child);
  }, []);

  const addChild = useCallback((child: Child) => {
    const childWithId = { ...child, id: child.id || createChildId() };
    setChildrenList((prev) => [...prev, childWithId]);
    setCurrentChild(childWithId);
    return childWithId;
  }, []);

  const createNewChild = useCallback(() => {
    const name = createDefaultChildName(childrenList);
    const child: Child = {
      id: createChildId(),
      name,
      age: 8,
      initial: name.charAt(0).toUpperCase(),
      isNew: true,
      intake: {},
    };
    setChildrenList((prev) => [...prev, child]);
    setCurrentChild(child);
    return child;
  }, [childrenList]);

  const updateChild = useCallback((child: Child) => {
    const targetId = child.id || currentChild.id;
    const childWithId = { ...child, id: targetId || createChildId() };
    setChildrenList((prev) => prev.map((item) => {
      if (targetId) return item.id === targetId ? childWithId : item;
      return item === currentChild ? childWithId : item;
    }));
    setCurrentChild(childWithId);
  }, [currentChild]);

  const deleteChild = useCallback((childId: string) => {
    setChildrenList((prev) => {
      const remaining = prev.filter((child) => child.id !== childId);
      if (remaining.length === 0) {
        const freshChild: Child = {
          id: createChildId(),
          name: 'New child',
          age: 8,
          initial: 'N',
          isNew: true,
          intake: {},
        };
        setCurrentChild(freshChild);
        return [freshChild];
      }
      if (currentChild.id === childId) {
        setCurrentChild(remaining[0]);
      }
      return remaining;
    });
  }, [currentChild.id]);

  const value = React.useMemo(() => ({
    childrenList,
    currentChild,
    setChild,
    addChild,
    updateChild,
    deleteChild,
    createNewChild,
  }), [childrenList, currentChild, setChild, addChild, updateChild, deleteChild, createNewChild]);

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
