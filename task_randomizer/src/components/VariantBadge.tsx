import { motion } from 'framer-motion';

interface VariantBadgeProps {
  variant: number;
  delay?: number;
}

export const VariantBadge = ({ variant, delay = 0 }: VariantBadgeProps) => {
  return (
    <motion.div
      className="variant-badge"
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
    </motion.div>
  );
};