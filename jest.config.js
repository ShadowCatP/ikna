import { path } from "node:path";

// Pin the timezone before Jest starts workers so calendar-day and DST tests are stable.
process.env.TZ = 'Europe/Warsaw';

/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  passWithNoTests: false,
  // npm keeps Expo's internal modules nested; the preset imports them by name.
  modulePaths: [
    path.join(
      path.dirname(require.resolve('expo/package.json')),
      'node_modules'
    ),
  ],
  collectCoverageFrom: ['src/utils/sm2.ts'],
};
