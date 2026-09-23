import { motion } from 'framer-motion';
import type { Student } from '../types';

interface StudentCardProps {
  student: Student;
  animateEntrance?: boolean;
}

export const StudentCard = ({ student, animateEntrance = false }: StudentCardProps) => {
  return (
    <motion.div
      className="student-card"
      layout
      initial={animateEntrance ? { scale: 0.8, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {student.name}
    </motion.div>
  );
};