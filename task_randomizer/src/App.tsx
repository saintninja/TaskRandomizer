import { useState, useMemo, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Student, Group, TaskList } from './types';
import {
  shuffleArray,
  chunkArray,
  assignVariants,
  distributeEvenly,
} from './utils/array';
import { parseTasks } from './utils/tasks';
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

  const [distributeVariants, setDistributeVariants] = useState<boolean>(true);
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const taskListCounter = useRef<number>(0);

  const [groups, setGroups] = useState<Group[]>([]);
  const [isGrouped, setIsGrouped] = useState<boolean>(false);
  const [isAssigned, setIsAssigned] = useState<boolean>(false);

  const parsedStudents: Student[] = useMemo(
    () => parseStudents(studentsText),
    [studentsText]
  );

  const activeLists = useMemo(
    () =>
      taskLists
        .map((list, index) => ({
          id: list.id,
          name: list.name.trim() || `Список ${index + 1}`,
          tasks: parseTasks(list.tasksText),
        }))
        .filter((list) => list.tasks.length > 0),
    [taskLists]
  );

  const hasTaskLists = activeLists.length > 0;
  const variantsEnabled = distributeVariants || !hasTaskLists;

  const handleAddTaskList = useCallback(() => {
    taskListCounter.current += 1;
    const id = `list-${taskListCounter.current}`;
    setTaskLists((prev) => [...prev, { id, name: '', tasksText: '' }]);
  }, []);

  const handleUpdateTaskList = useCallback(
    (id: string, patch: Partial<Omit<TaskList, 'id'>>) => {
      setTaskLists((prev) =>
        prev.map((list) => (list.id === id ? { ...list, ...patch } : list))
      );
    },
    []
  );

  const handleRemoveTaskList = useCallback((id: string) => {
    setTaskLists((prev) => prev.filter((list) => list.id !== id));
  }, []);

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
      tasks: [],
    }));

    setGroups(newGroups);
    setIsGrouped(true);
    setIsAssigned(false);
  };

  const handleAssignVariants = (): void => {
    if (groups.length === 0) return;
    if (variantsEnabled && variantsCount <= 0) return;
    if (!variantsEnabled && !hasTaskLists) return;

    const variants = variantsEnabled
      ? assignVariants(groups.length, variantsCount)
      : [];

    const picksPerList = activeLists.map((list) => ({
      list,
      picks: distributeEvenly(list.tasks, groups.length),
    }));

    const updatedGroups: Group[] = groups.map((group, index) => ({
      ...group,
      variant: variantsEnabled ? variants[index] : null,
      tasks: picksPerList.map(({ list, picks }) => ({
        listId: list.id,
        listName: list.name,
        task: picks[index],
      })),
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
        distributeVariants={variantsEnabled}
        canDisableVariants={hasTaskLists}
        onDistributeVariantsChange={setDistributeVariants}
        taskLists={taskLists}
        onAddTaskList={handleAddTaskList}
        onUpdateTaskList={handleUpdateTaskList}
        onRemoveTaskList={handleRemoveTaskList}
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