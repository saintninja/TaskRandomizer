import type { TaskList } from '../types';

export interface ControlsPanelProps {
  studentsText: string;
  onStudentsTextChange: (value: string) => void;

  groupSize: number;
  onGroupSizeChange: (value: number) => void;

  variantsCount: number;
  onVariantsCountChange: (value: number) => void;

  distributeVariants: boolean;
  canDisableVariants: boolean;
  onDistributeVariantsChange: (value: boolean) => void;

  taskLists: TaskList[];
  onAddTaskList: () => void;
  onUpdateTaskList: (
    id: string,
    patch: Partial<Omit<TaskList, 'id'>>
  ) => void;
  onRemoveTaskList: (id: string) => void;

  isGrouped: boolean;
  isAssigned: boolean;

  onFormGroups: () => void;
  onAssignVariants: () => void;
  onReset: () => void;
}
