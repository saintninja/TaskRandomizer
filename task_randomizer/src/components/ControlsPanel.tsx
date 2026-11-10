import type { ControlsPanelProps } from './ControlsPanel.types';
import { GROUP_SIZE_OPTIONS } from '../utils/constants';
import { parseTasks } from '../utils/tasks';

export const ControlsPanel = ({
  studentsText,
  onStudentsTextChange,
  groupSize,
  onGroupSizeChange,
  variantsCount,
  onVariantsCountChange,
  distributeVariants,
  canDisableVariants,
  onDistributeVariantsChange,
  taskLists,
  onAddTaskList,
  onUpdateTaskList,
  onRemoveTaskList,
  isGrouped,
  isAssigned,
  onFormGroups,
  onAssignVariants,
  onReset,
}: ControlsPanelProps) => {
  const assignLabel = !distributeVariants
    ? 'Назначить задачи'
    : canDisableVariants
      ? 'Назначить варианты и задачи'
      : 'Назначить варианты';

  return (
    <>
      <div className="controls-panel">
        <div className="control-group">
          <label className="control-label">
            Список студентов (каждый с новой строки):
          </label>
          <textarea
            className="control-textarea"
            value={studentsText}
            onChange={(e) => onStudentsTextChange(e.target.value)}
            placeholder="Введите данные студентов..."
            disabled={isGrouped}
          />
        </div>

        <div className="control-group">
          <label className="control-label">Размер группы (1-4):</label>
          <select
            className="control-select"
            value={groupSize}
            onChange={(e) => onGroupSizeChange(Number(e.target.value))}
            disabled={isGrouped}
          >
            {GROUP_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size} {size === 1 ? 'студент' : 'студента'}
              </option>
            ))}
          </select>

          <label className="control-label" style={{ marginTop: '20px' }}>
            Количество вариантов:
          </label>
          <input
            type="number"
            min={1}
            className="control-input"
            value={variantsCount}
            onChange={(e) => onVariantsCountChange(Number(e.target.value))}
            disabled={isAssigned || !distributeVariants}
          />

          <label className="control-checkbox">
            <input
              type="checkbox"
              checked={distributeVariants}
              onChange={(e) => onDistributeVariantsChange(e.target.checked)}
              disabled={isAssigned || !canDisableVariants}
            />
            Распределять варианты
          </label>
          {!canDisableVariants && (
            <span className="control-hint">
              Отключить можно, когда есть хотя бы один список задач
            </span>
          )}
        </div>

        <div
          className="control-group"
          style={{ justifyContent: 'center', gap: '15px' }}
        >
          <button className="btn btn-reset" onClick={onReset}>
            Сбросить
          </button>
        </div>
      </div>

      <div className="task-lists-panel">
        <div className="task-lists-header">
          <span className="control-label">
            Списки задач (каждой группе достаётся по одной задаче из каждого
            списка):
          </span>
          <button
            className="btn btn-add"
            onClick={onAddTaskList}
            disabled={isAssigned}
          >
            + Добавить список
          </button>
        </div>

        {taskLists.length === 0 && (
          <p className="control-hint">
            Списков пока нет. Добавьте список: названия файлов, номера задач,
            названия методов и т.п.
          </p>
        )}

        <div className="task-lists-grid">
          {taskLists.map((list, index) => {
            const tasksCount = parseTasks(list.tasksText).length;
            return (
              <div className="task-list" key={list.id}>
                <div className="task-list-top">
                  <input
                    className="control-input task-list-name"
                    value={list.name}
                    placeholder={`Список ${index + 1} (название)`}
                    onChange={(e) =>
                      onUpdateTaskList(list.id, { name: e.target.value })
                    }
                    disabled={isAssigned}
                  />
                  <button
                    className="btn-icon"
                    onClick={() => onRemoveTaskList(list.id)}
                    disabled={isAssigned}
                    aria-label={`Удалить список ${index + 1}`}
                    title="Удалить список"
                  >
                    ✕
                  </button>
                </div>
                <textarea
                  className="control-textarea"
                  value={list.tasksText}
                  onChange={(e) =>
                    onUpdateTaskList(list.id, { tasksText: e.target.value })
                  }
                  placeholder="Каждая задача с новой строки"
                  disabled={isAssigned}
                />
                <span className="control-hint">
                  {tasksCount === 0
                    ? 'Список пуст и будет проигнорирован'
                    : `Уникальных задач: ${tasksCount}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="buttons-row">
        {!isGrouped && (
          <button className="btn btn-primary" onClick={onFormGroups}>
            Сформировать группы
          </button>
        )}
        {isGrouped && !isAssigned && (
          <button className="btn btn-secondary" onClick={onAssignVariants}>
            {assignLabel}
          </button>
        )}
      </div>
    </>
  );
};
