import { profileSeed } from './profile.data';
import type { YearMonthSeed } from './profile-seed.types';

const isValidPoint = ({ year, month }: YearMonthSeed): boolean =>
  Number.isInteger(year) && (month === undefined || (month >= 1 && month <= 12));

const monthIndex = ({ year, month }: YearMonthSeed): number => year * 12 + (month ?? 1);

/** Проверки данных до записи в базу: ошибка в файле сида видна сразу в тестах. */
describe('profile seed data', () => {
  it('has unique skill, link and project keys (they are unique in the database)', () => {
    const unique = (values: string[]) => new Set(values).size === values.length;

    expect(unique(profileSeed.skills.map((skill) => skill.name))).toBe(true);
    expect(unique(profileSeed.links.map((link) => link.url))).toBe(true);
    expect(unique(profileSeed.projects.map((project) => project.name))).toBe(true);
  });

  it('has valid experience periods', () => {
    for (const job of profileSeed.experience) {
      expect(isValidPoint(job.start)).toBe(true);
      if (job.end) {
        expect(isValidPoint(job.end)).toBe(true);
        expect(monthIndex(job.end)).toBeGreaterThanOrEqual(monthIndex(job.start));
      }
    }
  });

  it('uses only absolute https links', () => {
    const urls = [
      ...profileSeed.links.map((link) => link.url),
      ...profileSeed.projects.flatMap((project) => (project.url ? [project.url] : [])),
    ];
    for (const url of urls) {
      expect(new URL(url).protocol).toBe('https:');
    }
  });
});
