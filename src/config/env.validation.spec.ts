import { validateEnv } from './env.validation';

describe('validateEnv', () => {
  const databaseUrl = 'postgresql://user:pass@localhost:5432/db';

  it('applies defaults and converts types', () => {
    expect(validateEnv({ DATABASE_URL: databaseUrl, PORT: '8080' })).toEqual({
      NODE_ENV: 'development',
      PORT: 8080,
      DATABASE_URL: databaseUrl,
    });
  });

  it('fails fast when DATABASE_URL is missing', () => {
    expect(() => validateEnv({})).toThrow(/DATABASE_URL/);
  });

  it('rejects a non-PostgreSQL connection string', () => {
    expect(() => validateEnv({ DATABASE_URL: 'mysql://localhost/db' })).toThrow(/DATABASE_URL/);
  });
});
