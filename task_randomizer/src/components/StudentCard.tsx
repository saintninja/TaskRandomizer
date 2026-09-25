import { motion } from 'framer-motion';
import type { Student } from '../types';

interface StudentCardProps {
  student: Student;
  groupId: string;
  isDragging?: boolean;
  isDropTarget?: boolean;
  onDragStart?: (
    student: Student,
    groupId: string,
    cardRect: DOMRect,
    clientX: number,
    clientY: number
  ) => void;
  onDragMove?: (clientX: number, clientY: number) => void;
  onDragEnd?: () => void;
}

export const StudentCard = ({
  student,
  groupId,
  isDragging = false,
  isDropTarget = false,
  onDragStart,
  onDragMove,
  onDragEnd,
}: StudentCardProps) => {
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; 
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);

    const rect = e.currentTarget.getBoundingClientRect();
    onDragStart?.(student, groupId, rect, e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      onDragMove?.(e.clientX, e.clientY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    onDragEnd?.();
  };

  const className = [
    'student-card',
    isDragging && 'student-card--dragging',
    isDropTarget && 'student-card--drop-target',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.div
      className={className}
      data-student-id={student.id}
      data-group-id={groupId}
      layout={!isDragging}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: isDropTarget ? 1.05 : 1,
        opacity: isDragging ? 0.3 : 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        touchAction: 'none',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      {student.name}
    </motion.div>
  );
};