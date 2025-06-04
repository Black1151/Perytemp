export interface DataPoint {
  value: number;
  title: string;
}

export interface FilterOption {
  label: string;
  value: string;
  isSelected?: boolean;
  isDisabled?: boolean;
}

export interface FilterOptionGroup {
  label: string;
  options: FilterOption[];
}

export interface SpeechBubbleData {
  currentScore: number;
  change: number;
  positiveChange: boolean;
}

export interface Person {
  userId: number;
  firstName: string;
  lastName: string;
  jobTitle: string;
  department: string;
  site: string;
  score: number;
  imageUrl: string;
  fullName: string;
}

// interfaces.ts

export interface DepartmentBarGraphData {
  department: string;
  averageScore: number;
  count: number;
  deptId: number;
}

export interface SiteBarGraphData {
  site: string;
  averageScore: number;
  count: number;
  siteId: number;
}
