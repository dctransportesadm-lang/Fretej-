export interface Freight {
  id: string;
  clientName: string;
  description?: string;
  date: string; // ISO string YYYY-MM-DD
  value: number;
  createdAt: number;
}

export interface Expense {
  id: string;
  category: string;
  description?: string;
  date: string; // ISO string YYYY-MM-DD
  value: number;
  createdAt: number;
}

export interface TimeEntry {
  id: string;
  startTime: number;
  endTime?: number;
  date: string; // YYYY-MM-DD
}

export type DateFilterType = 'all' | 'today' | 'week' | 'month' | 'custom';
