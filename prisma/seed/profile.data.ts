import { SkillCategory } from '../../src/generated/prisma/enums';
import type { ProfileSeed } from './profile-seed.types';

/**
 * Данные визитки. Это единственный источник правды: при изменении файла
 * сид при следующем запуске заменит данные в базе.
 */
export const profileSeed: ProfileSeed = {
  slug: 'maksim-sitnikov',
  name: 'Максим Ситников',
  title: 'Fullstack разработчик',
  description:
    'Fullstack разработчик, больше 8 лет в коммерческой разработке. Основной стек .NET и C#, ' +
    'кроме него DevOps (Docker, Kubernetes, CI/CD), Python и React с TypeScript. ' +
    'Около 4 лет руководил группой разработки до 10 человек. Работал в финтехе и legaltech, ' +
    'делал интеграции с госсистемами: API Госуслуг, ЕСИА, ЕФРСБ.',
  location: 'Москва',

  links: [
    { label: 'GitHub', url: 'https://github.com/yellow444' },
    {
      label: 'Статья на Хабре: тестируем API Госуслуг с PyCades',
      url: 'https://habr.com/ru/articles/793028/',
    },
    { label: 'Telegram-канал «Код с печатью»', url: 'https://t.me/kod_s_pechatyu' },
  ],

  skills: [
    { name: 'C#', category: SkillCategory.BACKEND },
    { name: '.NET', category: SkillCategory.BACKEND, note: 'от .NET Framework 3.5 до .NET 10' },
    { name: 'ASP.NET Core', category: SkillCategory.BACKEND },
    { name: 'Entity Framework Core', category: SkillCategory.BACKEND },
    { name: 'Dapper', category: SkillCategory.BACKEND },
    { name: 'gRPC', category: SkillCategory.BACKEND },
    { name: 'SignalR', category: SkillCategory.BACKEND },
    { name: 'Чистая архитектура, DDD, SOLID', category: SkillCategory.BACKEND },
    {
      name: 'Event sourcing',
      category: SkillCategory.BACKEND,
      note: 'платёжная система XPay',
    },
    {
      name: 'Python',
      category: SkillCategory.BACKEND,
      note: 'скрипты, API-клиенты, боты и автоматизация. Коммерческого опыта меньше, чем на C#',
    },

    { name: 'React', category: SkillCategory.FRONTEND },
    { name: 'TypeScript', category: SkillCategory.FRONTEND },
    { name: 'Redux', category: SkillCategory.FRONTEND },
    { name: 'Angular', category: SkillCategory.FRONTEND, note: 'немного' },

    { name: 'SQL и хранимые процедуры', category: SkillCategory.DATA },
    { name: 'ETL и миграция данных', category: SkillCategory.DATA },
    { name: 'Apache Airflow', category: SkillCategory.DATA },
    { name: 'Apache Superset', category: SkillCategory.DATA },
    { name: 'RabbitMQ', category: SkillCategory.DATA },
    {
      name: 'Apache Kafka',
      category: SkillCategory.DATA,
      note: 'мало: сервисы антифрода в СберМобайле',
    },

    { name: 'PostgreSQL', category: SkillCategory.DATABASES },
    { name: 'MS SQL Server', category: SkillCategory.DATABASES },
    { name: 'Redis', category: SkillCategory.DATABASES },
    { name: 'MongoDB', category: SkillCategory.DATABASES },
    { name: 'Elasticsearch', category: SkillCategory.DATABASES },

    { name: 'Docker', category: SkillCategory.DEVOPS },
    {
      name: 'Kubernetes',
      category: SkillCategory.DEVOPS,
      note: 'вёл 3 кластера, 17 нод, в том числе в закрытом контуре',
    },
    { name: 'Helm, Helmfile', category: SkillCategory.DEVOPS },
    {
      name: 'GitLab CI',
      category: SkillCategory.DEVOPS,
      note: 'сборка в Kaniko, выкладка через Helm',
    },
    { name: 'TFS, Jenkins', category: SkillCategory.DEVOPS },
    {
      name: 'Ansible, Kubespray',
      category: SkillCategory.DEVOPS,
      note: 'развёртывание новых кластеров для крупного заказчика',
    },
    {
      name: 'Prometheus, Grafana, Alertmanager',
      category: SkillCategory.DEVOPS,
      note: 'центральный мониторинг кластеров с нуля',
    },
    { name: 'ELK, Graylog', category: SkillCategory.DEVOPS },
    {
      name: 'Nexus, Harbor',
      category: SkillCategory.DEVOPS,
      note: 'свои хранилища артефактов в закрытом контуре без интернета',
    },
    { name: 'Nginx', category: SkillCategory.DEVOPS },
    { name: 'Linux', category: SkillCategory.DEVOPS, note: 'CentOS, РЕД ОС' },

    {
      name: 'LLM и AI-агенты в разработке',
      category: SkillCategory.AI,
      note: 'участвовал в выстраивании разработки с AI-агентами в XPay',
    },
    { name: 'MCP-серверы', category: SkillCategory.AI, note: 'свой MCP-сервер поиска вакансий' },

    {
      name: 'API Госуслуг (ЕПГУ) и ЕСИА',
      category: SkillCategory.INTEGRATIONS,
      note: 'подключал для 4 компаний',
    },
    {
      name: 'КриптоПро, PyCades',
      category: SkillCategory.INTEGRATIONS,
      note: 'ГОСТ-подпись в контейнерах',
    },
    { name: 'ЕФРСБ', category: SkillCategory.INTEGRATIONS },
  ],

  experience: [
    {
      company: 'Xpress Super App',
      position: 'Senior Backend-разработчик (.NET)',
      summary: 'Платёжная система XPay в облаке.',
      start: { year: 2025, month: 9 },
      end: { year: 2026, month: 10 },
      achievements: [
        'Бэкенд платёжной системы XPay на .NET 10: кошельки, мерчанты, подключение к внешним платёжным шлюзам.',
        'Классический event sourcing на хранилище событий, без Kafka.',
        'Участвовал в выстраивании разработки с AI-агентами.',
        'По необходимости фронтенд и DevOps.',
      ],
    },
    {
      company: 'СберМобайл',
      position: 'Fullstack-разработчик (проектная работа)',
      summary: 'Антифрод в телекоме: анализ голосового трафика и поиск мошенников.',
      start: { year: 2024, month: 8 },
      end: { year: 2025, month: 6 },
      achievements: [
        'Сделал сервис-оркестратор анализа голосового трафика: он принимает решения и отдаёт команды на распознавание и проверку.',
        'Переписал сервисы fraud-детекции на .NET 8, нагрузка до 2 млн запросов в сутки (Protobuf, Kafka, Redis, Prometheus, Graylog).',
        'Настроил сборку и выпуск для dev и тестовых окружений, поднял покрытие тестами до 85%.',
      ],
    },
    {
      company: 'Консультационные проекты',
      position: 'Эксперт по интеграции с API Госуслуг',
      summary: 'Проектная работа для нескольких компаний.',
      start: { year: 2023 },
      end: { year: 2025 },
      achievements: [
        'Подключил API Госуслуг для 4 компаний из финтеха, страхования и gov-tech.',
        'Стандартизировал OAuth 2.0 flow, swagger-клиенты и манифесты Kubernetes, подготовил Helm-чарты.',
      ],
    },
    {
      company: 'АО «Лаборатория Исполком» (ранее АО «Кью Лаб»)',
      position: 'Руководитель группы разработки, DevOps-инженер',
      summary:
        'Legaltech-группа: серверная часть, инфраструктура и платформа для крупного заказчика в закрытом контуре.',
      start: { year: 2021, month: 9 },
      achievements: [
        'Руководил группой до 10 человек: планирование, декомпозиция задач, code review, менторинг.',
        'Серверная часть, проектирование БД и хранилищ, ETL и миграция данных из старых систем. Интеграции с API Госуслуг и ЕФРСБ.',
        'Вёл инфраструктуру группы: 3 кластера Kubernetes на 17 нодах, PostgreSQL HA, RabbitMQ, MinIO, Elasticsearch.',
        'Пайплайны GitLab CI с Kaniko и Helm, время деплоя сократил до 15 минут.',
        'С нуля построил центральный мониторинг всех кластеров: Prometheus, Grafana, Alertmanager, алерты в Telegram.',
        'Платформа для крупного заказчика в закрытом контуре: сначала вёл фронтенд-команду, затем перешёл в DevOps. Кластеры через Kubespray и Ansible, выкладка через Helm и Helmfile, свои Nexus и Harbor.',
      ],
    },
    {
      company: 'МКА «Кворум»',
      position: '.NET-разработчик',
      start: { year: 2020, month: 6 },
      end: { year: 2021, month: 9 },
      achievements: [
        'Разрабатывал и поддерживал веб-приложение на .NET и Angular: REST API для документооборота и учёта дел.',
        'Сборка и деплой через TFS на IIS и в Kubernetes, контейнеризация сервисов.',
      ],
    },
  ],

  projects: [
    {
      name: 'cv-graphql',
      description:
        'Этот проект: цифровая визитка на GraphQL с DataLoader, автоматическими миграциями и идемпотентным сидом.',
      url: 'https://github.com/yellow444/cv-graphql',
      stack: ['TypeScript', 'NestJS', 'GraphQL', 'Prisma', 'PostgreSQL', 'Docker'],
    },
    {
      name: 'Автоматизация Telegram-канала «Код с печатью»',
      description:
        'Бот канала присылает черновики постов с кнопками одобрения, публикует по расписанию, копирует посты на сайт и модерирует группу обсуждений. ' +
        'Читатель публичных каналов (только чтение) собирает находки и вакансии, MCP-сервер даёт к ним доступ из AI-ассистента.',
      url: 'https://t.me/kod_s_pechatyu',
      stack: ['Python', 'aiogram', 'Telethon', 'MCP', 'Docker'],
    },
    {
      name: 'opportunity-scout',
      description:
        'Самохостящийся MCP-сервер для поиска вакансий и постов: hh.ru, веб-поиск и Telegram. Все инструменты только читают, ничего не публикуют.',
      stack: ['Python', 'MCP', 'Telethon', 'Docker'],
    },
    {
      name: 'Тестируем API Госуслуг с PyCades',
      description:
        'Статья на Хабре: как тестировать API Госуслуг с ГОСТ-подписью через КриптоПро и PyCades. Около 26 тыс. просмотров.',
      url: 'https://habr.com/ru/articles/793028/',
      stack: ['Python', 'КриптоПро', 'PyCades', 'API Госуслуг'],
    },
  ],
};
