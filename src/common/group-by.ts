/**
 * Группирует элементы по ключу и при необходимости преобразует их.
 * Порядок элементов внутри группы сохраняется, поэтому сортировка из SQL не теряется.
 */
export function groupBy<T, K, R = T>(
  items: readonly T[],
  keyOf: (item: T) => K,
  map: (item: T) => R = (item) => item as unknown as R,
): Map<K, R[]> {
  const groups = new Map<K, R[]>();
  for (const item of items) {
    const key = keyOf(item);
    const group = groups.get(key);
    if (group) {
      group.push(map(item));
    } else {
      groups.set(key, [map(item)]);
    }
  }
  return groups;
}
