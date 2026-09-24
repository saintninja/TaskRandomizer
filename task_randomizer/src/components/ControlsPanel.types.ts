export interface ControlsPanelProps {
  studentsText: string;
  onStudentsTextChange: (value: string) => void;

  groupSize: number;
  onGroupSizeChange: (value: number) => void;

  variantsCount: number;
  onVariantsCountChange: (value: number) => void;

  isGrouped: boolean;
  isAssigned: boolean;

  onFormGroups: () => void;
  onAssignVariants: () => void;
  onReset: () => void;
}