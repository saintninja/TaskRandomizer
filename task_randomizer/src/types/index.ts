export interface Student {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  title: string;
  students: Student[];
  variant: number | null;
}

export type AppStage = 'idle' | 'grouped' | 'assigned';