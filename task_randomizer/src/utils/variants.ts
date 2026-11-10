import type { Group } from '../types';

export interface ChangeVariantResult {
  groups: Group[];
  swappedWith: Group | null;
}

export const changeGroupVariant = (
  groups: readonly Group[],
  groupId: string,
  newVariant: number,
  variantsCount: number
): ChangeVariantResult => {
  const target = groups.find((g) => g.id === groupId);
  if (!target || target.variant === newVariant) {
    return { groups: [...groups], swappedWith: null };
  }

  const mustBeUnique = variantsCount >= groups.length;
  const holder = mustBeUnique
    ? groups.find((g) => g.id !== groupId && g.variant === newVariant)
    : undefined;

  const updated = groups.map((g) => {
    if (g.id === groupId) return { ...g, variant: newVariant };
    if (holder && g.id === holder.id) return { ...g, variant: target.variant };
    return g;
  });

  return { groups: updated, swappedWith: holder ?? null };
};
