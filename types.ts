export interface Assignment {
  id: string;
  title: string;
  score: number;
  maxScore: number;
  date: string;
  type: 'Homework' | 'Project' | 'Challenge';
}

export interface TestResult {
  id: string;
  title: string;
  score: number;
  maxScore: number;
  date: string;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  badges: string[];
  assignments: Assignment[];
  tests: TestResult[];
  attendance: number; // Percentage
  strengths: string[];
  weaknesses: string[];
}