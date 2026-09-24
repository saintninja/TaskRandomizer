import type { ControlsPanelProps } from './ControlsPanel.types';
import { GROUP_SIZE_OPTIONS } from '../utils/constants';

export const ControlsPanel = ({
  studentsText,
  onStudentsTextChange,
  groupSize,
  onGroupSizeChange,
  variantsCount,
  onVariantsCountChange,
  isGrouped,
  isAssigned,
  onFormGroups,
  onAssignVariants,
  onReset,
}: ControlsPanelProps) => {
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
            disabled={isAssigned}
          />
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

      <div className="buttons-row">
        {!isGrouped && (
          <button className="btn btn-primary" onClick={onFormGroups}>
            Сформировать группы
          </button>
        )}
        {isGrouped && !isAssigned && (
          <button className="btn btn-secondary" onClick={onAssignVariants}>
            Назначить варианты
          </button>
        )}
      </div>
    </>
  );
};