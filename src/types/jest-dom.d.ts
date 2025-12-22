/* eslint-disable @typescript-eslint/no-empty-object-type */
import type matchers from '@testing-library/jest-dom/matchers';

type TestingLibraryMatchers<E = HTMLElement, R = void> = matchers.TestingLibraryMatchers<E, R>;

declare global {
  namespace jest {
    interface Matchers<R = void, T = unknown> extends TestingLibraryMatchers<T, R> {}
  }

  namespace Expect {
    interface Matchers<R = void, T = unknown> extends TestingLibraryMatchers<T, R> {}
  }

  interface JestMatchers<T = HTMLElement> extends TestingLibraryMatchers<T> {}
}

declare module '@jest/expect' {
  interface Matchers<R = void, T = unknown> extends TestingLibraryMatchers<T, R> {}
  interface AsyncMatchers<R = void, T = unknown> extends TestingLibraryMatchers<T, Promise<R>> {}
}

export {};
