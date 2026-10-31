import { motion } from 'framer-motion';
import type { Student } from '../types';
import { StudentCard } from './StudentCard';

interface StudentsPoolProps {
  students: Student[];
}

export const StudentsPool = ({ students }: StudentsPoolProps) => {
  return (
    <motion.div
      className="students-pool"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
    >
      {students.map((student) => (
        <StudentCard key={student.id} student={student} groupId="pool" />
      ))}
    </motion.div>
  );
};