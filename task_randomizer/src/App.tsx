import { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { Student, Group } from './types';
import { assignVariants, shuffleArray, chunkArray } from './utils/array';
import {
  DEFAULT_STUDENTS_TEXT,
  DEFAULT_GROUP_SIZE,
  DEFAULT_VARIANTS_COUNT,
} from './utils/constants';
import { ControlsPanel } from './components/ControlsPanel';
import { StudentsPool } from './components/StudentsPool';
import { GroupsGrid } from './components/GroupsGrid';

const parseStudents = (text: string): Student[] =>
  text
    .split('\n')
    .map((name) => name.trim())
    .filter((name) => name !== '')
    .map((name, index) => ({
      id: `stu-${index}-${name}`,
      name,
    }));

function App() {
  const [studentsText, setStudentsText] = useState<string>(DEFAULT_STUDENTS_TEXT);
  const [groupSize, setGroupSize] = useState<number>(DEFAULT_GROUP_SIZE);
  const [variantsCount, setVariantsCount] = useState<number>(DEFAULT_VARIANTS_COUNT);

  const [groups, setGroups] = useState<Group[]>([]);
  const [isGrouped, setIsGrouped] = useState<boolean>(false);
  const [isAssigned, setIsAssigned] = useState<boolean>(false);

  const parsedStudents: Student[] = useMemo(
    () => parseStudents(studentsText),
    [studentsText]
  );

  const handleFormGroups = (): void => {
    if (parsedStudents.length === 0) return;

    const shuffled = shuffleArray(parsedStudents);
    const chunked = chunkArray(shuffled, groupSize);

    const newGroups: Group[] = chunked.map((students, index) => ({
      id: `group-${index}`,
      title: `Группа ${index + 1}`,
      students,
      variant: null,
    }));

    setGroups(newGroups);
    setIsGrouped(true);
    setIsAssigned(false);
  };

  const handleAssignVariants = (): void => {
    if (variantsCount <= 0 || groups.length === 0) return;

    const variants = assignVariants(groups.length, variantsCount);

    const updatedGroups: Group[] = groups.map((group, index) => ({
      ...group,
      variant: variants[index],
    }));

    setGroups(updatedGroups);
    setIsAssigned(true);
  };

  const handleReset = (): void => {
    setGroups([]);
    setIsGrouped(false);
    setIsAssigned(false);
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Генератор групп и вариантов</h1>

      <ControlsPanel
        studentsText={studentsText}
        onStudentsTextChange={setStudentsText}
        groupSize={groupSize}
        onGroupSizeChange={setGroupSize}
        variantsCount={variantsCount}
        onVariantsCountChange={setVariantsCount}
        isGrouped={isGrouped}
        isAssigned={isAssigned}
        onFormGroups={handleFormGroups}
        onAssignVariants={handleAssignVariants}
        onReset={handleReset}
      />

      <div className="visualization-area">
        <AnimatePresence mode="wait">
          {!isGrouped && <StudentsPool students={parsedStudents} />}
          {isGrouped && <GroupsGrid groups={groups} isAssigned={isAssigned} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;