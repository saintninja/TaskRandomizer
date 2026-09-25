import { useState, useCallback } from 'react';
import type { Student, Group } from '../types';

interface DragState {
  student: Student;
  sourceGroupId: string;
  offset: { x: number; y: number };
}

interface UseDragAndDropReturn {
  draggedStudent: Student | null;
  dragPosition: { x: number; y: number };
  dropTargetId: string | null;
  startDrag: (
    student: Student,
    groupId: string,
    cardRect: DOMRect,
    clientX: number,
    clientY: number
  ) => void;
  moveDrag: (clientX: number, clientY: number) => void;
  endDrag: () => void;
  isDragging: (studentId: string) => boolean;
  isDropTarget: (studentId: string) => boolean;
}

export const useDragAndDrop = (
  groups: Group[],
  onSwap: (studentA: Student, studentB: Student) => void
): UseDragAndDropReturn => {
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  const startDrag = useCallback(
    (
      student: Student,
      groupId: string,
      cardRect: DOMRect,
      clientX: number,
      clientY: number
    ) => {
      setDragState({
        student,
        sourceGroupId: groupId,
        offset: {
          x: clientX - cardRect.left,
          y: clientY - cardRect.top,
        },
      });
      setDragPosition({ x: clientX, y: clientY });
    },
    []
  );

  const moveDrag = useCallback(
    (clientX: number, clientY: number) => {
      setDragPosition({ x: clientX, y: clientY });

      if (!dragState) return;

      const elements = document.elementsFromPoint(clientX, clientY);
      const targetElement = elements.find((el) => {
        if (!(el instanceof HTMLElement)) return false;
        const studentId = el.getAttribute('data-student-id');
        return studentId && studentId !== dragState.student.id;
      });

      if (targetElement && targetElement instanceof HTMLElement) {
        const targetId = targetElement.getAttribute('data-student-id');
        const targetGroupId = targetElement.getAttribute('data-group-id');

        if (targetGroupId && targetGroupId !== dragState.sourceGroupId) {
          setDropTargetId(targetId);
        } else {
          setDropTargetId(null);
        }
      } else {
        setDropTargetId(null);
      }
    },
    [dragState]
  );

  const endDrag = useCallback(() => {
    if (dragState && dropTargetId) {
      const targetStudent = groups
        .flatMap((g) => g.students)
        .find((s) => s.id === dropTargetId);

      if (targetStudent) {
        onSwap(dragState.student, targetStudent);
      }
    }

    setDragState(null);
    setDropTargetId(null);
  }, [dragState, dropTargetId, groups, onSwap]);

  const isDragging = useCallback(
    (studentId: string) => dragState?.student.id === studentId,
    [dragState]
  );

  const isDropTarget = useCallback(
    (studentId: string) => dropTargetId === studentId,
    [dropTargetId]
  );

  return {
    draggedStudent: dragState?.student ?? null,
    dragPosition,
    dropTargetId,
    startDrag,
    moveDrag,
    endDrag,
    isDragging,
    isDropTarget,
  };
};