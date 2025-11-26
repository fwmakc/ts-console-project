import { createDefaultPreset } from 'ts-jest';

const tsJestTransformCfg = createDefaultPreset().transform;

export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],

  clearMocks: true,
  coveragePathIgnorePatterns: ['\\\\node_modules\\\\'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  moduleDirectories: ['node_modules'],
  modulePaths: ['<rootDir>/src'],
  rootDir: './',
  // transformIgnorePatterns: ['node_modules/(?!axios)'],
  reporters: ['default',],

  transform: {
    ...tsJestTransformCfg,
  },

  roots: ['<rootDir>/src'],
  testMatch: ['<rootDir>/src/**/*(*.)@(spec|test).[tj]s?(x)',],
};
