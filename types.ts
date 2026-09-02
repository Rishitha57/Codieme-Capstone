
export interface Task {
  id: string;
  title: string;
  date?: string;
  time?: string;
  completed: boolean;
  createdAt: number;
}

export type TaskFilter = 'all' | 'active' | 'completed';
