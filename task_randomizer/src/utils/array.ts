export const shuffleArray = <T,>(array: readonly T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export const chunkArray = <T,>(array: readonly T[], size: number): T[][] => {
  if (size <= 0) {
    throw new Error('Размер чанка должен быть больше 0');
  }
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

export const distributeEvenly = <T,>(
  items: readonly T[],
  count: number
): T[] => {
  if (count <= 0 || items.length === 0) {
    return [];
  }

  const result: T[] = [];
  while (result.length < count) {
    result.push(...shuffleArray(items));
  }
  return result.slice(0, count);
};

export const assignVariants = (
  groupsCount: number,
  variantsCount: number
): number[] => {
  if (groupsCount <= 0 || variantsCount <= 0) {
    return [];
  }

  return distributeEvenly(
    Array.from({ length: variantsCount }, (_, i) => i + 1),
    groupsCount
  );
};
