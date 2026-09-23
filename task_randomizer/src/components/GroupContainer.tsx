import { motion, AnimatePresence } from 'framer-motion';
import type { Group } from '../types';
import { StudentCard } from './StudentCard';
import { VariantBadge } from './VariantBadge';

interface GroupContainerProps {
  group: Group;
  groupIndex: number;
  isAssigned: boolean;
}

export const GroupContainer = ({ group, groupIndex, isAssigned }: GroupContainerProps) => {
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

      <div className="students-in-group" layout>
        {group.students.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>

      <AnimatePresence>
        {isAssigned && group.variant !== null && (
          <VariantBadge
            variant={group.variant}
            delay={groupIndex * 0.15}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};