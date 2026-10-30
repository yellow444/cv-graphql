import type { SkillCategory } from '../../src/generated/prisma/enums';

/** Год и месяц (1-12). Месяц не указывается, если известен только год. */
export interface YearMonthSeed {
  year: number;
  month?: number;
}

export interface LinkSeed {
  label: string;
  url: string;
}

export interface SkillSeed {
  name: string;
  category: SkillCategory;
  /** Где и сколько использовал, если это важно для честной оценки. */
  note?: string;
}

export interface ExperienceSeed {
  company: string;
  position: string;
  summary?: string;
  start: YearMonthSeed;
  /** Не указано, если дата окончания неизвестна. Это не означает "по настоящее время". */
  end?: YearMonthSeed;
  achievements: string[];
}

export interface ProjectSeed {
  name: string;
  description: string;
  /** Только публичные ссылки. Закрытый код остаётся без ссылки. */
  url?: string;
  stack: string[];
}

/** Данные визитки. Порядок элементов в массивах задаёт порядок показа в API. */
export interface ProfileSeed {
  slug: string;
  name: string;
  title: string;
  description: string;
  location?: string;
  links: LinkSeed[];
  skills: SkillSeed[];
  experience: ExperienceSeed[];
  projects: ProjectSeed[];
}
