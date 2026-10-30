import { config } from 'dotenv';

// e2e-тесты работают с настоящей базой: DATABASE_URL берётся из окружения или из .env.
config({ quiet: true });
process.env.NODE_ENV ??= 'test';
