import { formatPeriod, toIsoDate } from './period';

describe('period', () => {
  describe('toIsoDate', () => {
    it('formats year and month', () => {
      expect(toIsoDate({ year: 2021, month: 9 })).toBe('2021-09');
    });

    it('formats a year when the month is unknown', () => {
      expect(toIsoDate({ year: 2023, month: null })).toBe('2023');
    });
  });

  describe('formatPeriod', () => {
    it('formats a closed period with months', () => {
      expect(formatPeriod({ year: 2025, month: 9 }, { year: 2026, month: 10 })).toBe(
        '09.2025 - 10.2026',
      );
    });

    it('formats a period known only by years', () => {
      expect(formatPeriod({ year: 2023, month: null }, { year: 2025, month: null })).toBe(
        '2023 - 2025',
      );
    });

    it('shows only the start when the end is not specified', () => {
      expect(formatPeriod({ year: 2021, month: 9 }, null)).toBe('с 09.2021');
    });
  });
});
