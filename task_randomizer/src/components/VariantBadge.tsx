import { motion } from 'framer-motion';

interface VariantBadgeProps {
  variant: number;
  delay?: number;
  options?: number[];
  onChange?: (variant: number) => void;
}

export const VariantBadge = ({
  variant,
  delay = 0,
  options,
  onChange,
}: VariantBadgeProps) => {
  const isEditable = Boolean(options && options.length > 0 && onChange);

  return (
    <motion.div
      className={`variant-badge ${isEditable ? 'variant-badge--editable' : ''}`}
      initial={{ scale: 0, rotate: -180, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay,
      }}
    >
      Вариант № {variant}
      {isEditable && (
        <select
          className="variant-select"
          value={variant}
          onChange={(e) => onChange?.(Number(e.target.value))}
          aria-label="Изменить номер варианта"
          title="Нажмите, чтобы изменить вариант"
        >
          {options!.map((option) => (
            <option key={option} value={option}>
              Вариант № {option}
            </option>
          ))}
        </select>
      )}
    </motion.div>
  );
};
