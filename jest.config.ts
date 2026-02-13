import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1', // @/ points to project root
  },

  setupFiles: ['dotenv/config'], // load .env for tests
};

export default config;
