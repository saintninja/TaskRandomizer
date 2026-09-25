import { motion } from 'framer-motion';
import type { Group, Student } from '../types';
import { GroupContainer } from './GroupContainer';

interface GroupsGridProps {
  groups: Group[];
  isAssigned: boolean;
  isDragging: (studentId: string) => boolean;
  isDropTarget: (studentId: string) => boolean;
  onDragStart: (
    student: Student,
    groupId: string,
    cardRect: DOMRect,
    clientX: number,
    clientY: number
  ) => void;
  onDragMove: (clientX: number, clientY: number) => void;
  onDragEnd: () => void;
}

export const GroupsGrid = ({
  groups,
  isAssigned,
  isDragging,
  isDropTarget,
  onDragStart,
  onDragMove,
  onDragEnd,
}: GroupsGridProps) => {
  return (
    <motion.div
      className="groups-grid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      {groups.map((group, index) => (
        <GroupContainer
          key={group.id}
          group={group}
          groupIndex={index}
          isAssigned={isAssigned}
          isDragging={isDragging}
          isDropTarget={isDropTarget}
          onDragStart={onDragStart}
          onDragMove={onDragMove}
          onDragEnd={onDragEnd}
        />
      ))}
    </motion.div>
  );
};