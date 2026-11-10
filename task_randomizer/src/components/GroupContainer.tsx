import { motion, AnimatePresence } from 'framer-motion';
import type { Group, Student } from '../types';
import { StudentCard } from './StudentCard';
import { VariantBadge } from './VariantBadge';

interface GroupContainerProps {
  group: Group;
  groupIndex: number;
  isAssigned: boolean;
  variantOptions?: number[];
  onVariantChange?: (groupId: string, variant: number) => void;
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

export const GroupContainer = ({
  group,
  groupIndex,
  isAssigned,
  variantOptions,
  onVariantChange,
  isDragging,
  isDropTarget,
  onDragStart,
  onDragMove,
  onDragEnd,
}: GroupContainerProps) => {
  const studentsCount = group.students.length;
  const studentWord = studentsCount === 1 ? 'студент' : 'студента';

  return (
    <motion.div
      className={`group-container ${isAssigned ? 'active' : ''}`}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        delay: groupIndex * 0.1,
        type: 'spring',
      }}
      layout
    >
      <div className="group-header">
        <span className="group-title">{group.title}</span>
        <span className="group-count">
          {studentsCount} {studentWord}
        </span>
      </div>

      <div className="students-in-group">
        {group.students.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            groupId={group.id}
            isDragging={isDragging(student.id)}
            isDropTarget={isDropTarget(student.id)}
            onDragStart={onDragStart}
            onDragMove={onDragMove}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>

      <AnimatePresence>
        {isAssigned && group.variant !== null && (
          <VariantBadge
            key="variant"
            variant={group.variant}
            delay={groupIndex * 0.15}
            options={variantOptions}
            onChange={(variant) => onVariantChange?.(group.id, variant)}
          />
        )}
        {isAssigned && group.tasks.length > 0 && (
          <motion.ul
            key="tasks"
            className="group-tasks"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: groupIndex * 0.15 + 0.1 }}
          >
            {group.tasks.map((item) => (
              <li key={item.listId} className="group-task">
                <span className="group-task__list">{item.listName}</span>
                <span className="group-task__value">{item.task}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  );
};