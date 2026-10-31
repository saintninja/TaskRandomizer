export const parseTasks = (text: string): string[] => {
  const unique = new Set<string>();
  for (const line of text.split('\n')) {
    const task = line.trim();
    if (task !== '') {
      unique.add(task);
    }
  }
  return [...unique];
};
