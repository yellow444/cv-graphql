/** Точка периода: год и месяц (1-12). month = null, если известен только год. */
export interface YearMonth {
  year: number;
  month: number | null;
}

const pad = (month: number): string => String(month).padStart(2, '0');

/** ISO 8601 с точностью до месяца или года: "2021-09" или "2023". */
export function toIsoDate({ year, month }: YearMonth): string {
  return month ? `${year}-${pad(month)}` : String(year);
}

function formatPoint({ year, month }: YearMonth): string {
  return month ? `${pad(month)}.${year}` : String(year);
}

/**
 * Период для показа человеку.
 * "09.2021 - 10.2026", "2023 - 2025" или "с 09.2021", если дата окончания не указана.
 */
export function formatPeriod(start: YearMonth, end: YearMonth | null): string {
  const from = formatPoint(start);
  return end ? `${from} - ${formatPoint(end)}` : `с ${from}`;
}
