export type Page = 'home' | 'understanding' | 'priorities' | 'roadmap' | 'reviews' | 'resources' | 'documents' | 'settings' | 'emerging-details' | 'all-children' | 'style-guide';

export interface Child {
  name: string;
  age: number;
  initial: string;
}

export interface Priority {
  tag: 'Now' | 'Next' | 'Later';
  name: string;
  meta: string;
  why: string;
  impact?: 'High' | 'Moderate' | 'Low';
  risk?: string;
  burden?: string;
  capacity?: string;
  progress?: number;
  dependencies?: string;
}

export interface Strategy {
  title: string;
  icon: 'school' | 'home';
  items: string[];
}

export interface Resource {
  category: string;
  title: string;
  description: string;
  readTime: string;
}

export interface DocFile {
  name: string;
  type: string;
  date: string;
  shared: boolean;
  sharedWith?: string;
}

export interface StrategyCardProps {
  title: string;
  icon: React.ReactNode;
  items: string[];
  cornerClass?: string;
  className?: string;
}

export interface ChecklistItemProps {
  title: string;
  description: string;
  className?: string;
  icon?: React.ReactNode;
}

export interface GuideCardProps {
  category: string;
  title: string;
  description: string;
  readTime: string;
  image?: string;
  cornerClass?: string;
  actionText?: string;
  className?: string;
}

export interface InsightSectionProps {
  kicker: string;
  title: string;
  description: string;
  image: string;
  actionText?: string;
  onActionClick?: () => void;
  className?: string;
  reverse?: boolean;
}

export interface ProgressChartSectionProps {
  label: string;
  title: string;
  chartLabel: string;
  chartSubtitle: string;
  data: any[];
  description: string;
  xAxisLabels: string[];
  activeLabelIndex?: number;
  className?: string;
}
