import { motion } from 'framer-motion';
import type { Group } from '../types';
import { GroupContainer } from './GroupContainer';

interface GroupsGridProps {
  groups: Group[];
  isAssigned: boolean;
}

export const GroupsGrid = ({ groups, isAssigned }: GroupsGridProps) => {
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
        />
      ))}
    </motion.div>
  );
};