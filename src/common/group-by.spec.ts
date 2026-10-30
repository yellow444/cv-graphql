import { groupBy } from './group-by';

describe('groupBy', () => {
  const rows = [
    { parentId: 1, text: 'a' },
    { parentId: 2, text: 'b' },
    { parentId: 1, text: 'c' },
  ];

  it('groups items by key and keeps their order', () => {
    const groups = groupBy(rows, (row) => row.parentId);

    expect(groups.get(1)).toEqual([rows[0], rows[2]]);
    expect(groups.get(2)).toEqual([rows[1]]);
  });

  it('maps items when a mapper is given', () => {
    const groups = groupBy(
      rows,
      (row) => row.parentId,
      (row) => row.text,
    );

    expect(groups.get(1)).toEqual(['a', 'c']);
  });

  it('returns an empty map for an empty list', () => {
    expect(groupBy([], () => 1).size).toBe(0);
  });
});
