import { useState, useMemo, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Student, Group } from './types';
import { shuffleArray, chunkArray, assignVariants } from './utils/array';
import {
  DEFAULT_STUDENTS_TEXT,
  DEFAULT_GROUP_SIZE,
  DEFAULT_VARIANTS_COUNT,
} from './utils/constants';
import { ControlsPanel } from './components/ControlsPanel';
import { StudentsPool } from './components/StudentsPool';
import { GroupsGrid } from './components/GroupsGrid';
import { useDragAndDrop } from './hooks/useDragAndDrop';

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

  const handleSwap = useCallback((studentA: Student, studentB: Student) => {
    setGroups((prevGroups) => {
      const groupA = prevGroups.find((g) =>
        g.students.some((s) => s.id === studentA.id)
      );
      const groupB = prevGroups.find((g) =>
        g.students.some((s) => s.id === studentB.id)
      );

      if (!groupA || !groupB || groupA.id === groupB.id) {
        return prevGroups;
      }

      return prevGroups.map((g) => {
        if (g.id === groupA.id) {
          return {
            ...g,
            students: g.students.map((s) =>
              s.id === studentA.id ? studentB : s
            ),
          };
        }
        if (g.id === groupB.id) {
          return {
            ...g,
            students: g.students.map((s) =>
              s.id === studentB.id ? studentA : s
            ),
          };
        }
        return g;
      });
    });
  }, []);

  const {
    draggedStudent,
    dragPosition,
    startDrag,
    moveDrag,
    endDrag,
    isDragging,
    isDropTarget,
  } = useDragAndDrop(groups, handleSwap);

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

  const overlayStyle = draggedStudent
    ? {
        position: 'fixed' as const,
        left: dragPosition.x - 70,
        top: dragPosition.y - 22,
        pointerEvents: 'none' as const,
        zIndex: 9999,
      }
    : {};

  return (
    <div className="app-container">
      <h1 className="app-title">🎓 Генератор команд и вариантов</h1>

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
          {isGrouped && (
            <GroupsGrid
              groups={groups}
              isAssigned={isAssigned}
              isDragging={isDragging}
              isDropTarget={isDropTarget}
              onDragStart={startDrag}
              onDragMove={moveDrag}
              onDragEnd={endDrag}
            />
          )}
        </AnimatePresence>
      </div>

      {}
      <AnimatePresence>
        {draggedStudent && (
          <motion.div
            className="drag-overlay"
            style={overlayStyle}
            initial={{ scale: 1.1, rotate: 0 }}
            animate={{ scale: 1.1, rotate: 2 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <div className="student-card student-card--clone">
              {draggedStudent.name}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;