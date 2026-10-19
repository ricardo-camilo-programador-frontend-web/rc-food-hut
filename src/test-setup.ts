import '@analogjs/vitest-angular/setup-zone';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

// jsdom não implementa IntersectionObserver (usado pelo @defer (on viewport)).
if (typeof globalThis.IntersectionObserver === 'undefined') {
  class IntersectionObserverStub {
    observe(): void { /* noop */ }
    unobserve(): void { /* noop */ }
    disconnect(): void { /* noop */ }
    takeRecords(): [] { return []; }
  }
  (globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = IntersectionObserverStub;
}
