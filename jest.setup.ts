// TypeScript setup file for Jest: register jest-dom matchers
import matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom';
import { expect } from '@jest/globals';

import { TextDecoder, TextEncoder } from 'node:util';

const globalScope = globalThis as typeof globalThis & {
  TextEncoder?: typeof TextEncoder;
  TextDecoder?: typeof TextDecoder;
};

// Add testing-library matchers to Jest's expect
expect.extend(matchers);

if (!globalScope.TextEncoder) {
  globalScope.TextEncoder = TextEncoder;
}

if (!globalScope.TextDecoder) {
  globalScope.TextDecoder = TextDecoder as typeof globalScope.TextDecoder;
}

export {};
