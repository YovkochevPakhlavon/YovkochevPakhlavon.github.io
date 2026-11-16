import { defineConfig } from 'vitest/config';

// Unit tests for the pure TypeScript physics in src/physics/ (npm test).
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
});
