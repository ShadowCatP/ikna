import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);

export default {
  preset: 'jest-expo',
  passWithNoTests: false,
  modulePaths: [
    path.join(
      path.dirname(require.resolve('expo/package.json')),
      'node_modules'
    ),
  ],
  collectCoverageFrom: ['src/utils/sm2.ts'],
};
