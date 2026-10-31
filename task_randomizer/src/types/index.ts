export interface Student {
  id: string;
  name: string;
}

export interface TaskList {
  id: string;
  name: string;
  tasksText: string;
}

export interface AssignedTask {
  listId: string;
  listName: string;
  task: string;
}

export interface Group {
  id: string;
  title: string;
  students: Student[];
  variant: number | null;
  tasks: AssignedTask[];
}

export type AppStage = 'idle' | 'grouped' | 'assigned';
