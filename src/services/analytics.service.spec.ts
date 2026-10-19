import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AnalyticsService } from './analytics.service';
import { ClarityService } from './clarity.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let mockClarityService: { init: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    localStorage.clear();
    mockClarityService = {
      init: vi.fn(),
    };

    // Clean head/body injected scripts before each test
    document.head.querySelectorAll('script').forEach((s) => s.remove());
    document.body.querySelectorAll('script').forEach((s) => s.remove());
    delete window.dataLayer;
    delete window.gtag;

    TestBed.configureTestingModule({
      providers: [
        AnalyticsService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: DOCUMENT, useValue: document },
        { provide: ClarityService, useValue: mockClarityService },
      ],
    });

    service = TestBed.inject(AnalyticsService);
  });

  afterEach(() => {
    localStorage.clear();
    document.head.querySelectorAll('script').forEach((s) => s.remove());
    document.body.querySelectorAll('script').forEach((s) => s.remove());
    delete window.dataLayer;
    delete window.gtag;
  });

  it('should initialize and push gtag with G-MSX663TSDY to dataLayer', () => {
    service.init();

    expect(window.dataLayer).toBeDefined();
    expect(Array.isArray(window.dataLayer)).toBe(true);

    const script = document.head.querySelector('script[src*="googletagmanager.com/gtag/js?id=G-MSX663TSDY"]');
    expect(script).toBeTruthy();

    const dataLayer = window.dataLayer as unknown[];
    expect(dataLayer.length).toBeGreaterThanOrEqual(2);

    dataLayer.forEach((entry) => {
      expect(Object.prototype.toString.call(entry)).toBe('[object Arguments]');
    });

    const entries = dataLayer.map((entry) => Array.from(entry as IArguments));
    expect(entries.some((entry) => entry[0] === 'js' && entry[1] instanceof Date)).toBe(true);
    expect(entries.some((entry) => entry[0] === 'config' && entry[1] === 'G-MSX663TSDY')).toBe(true);
  });

  it('should inject counter.dev script with counter id', () => {
    service.init();

    const counterScript = document.body.querySelector('script[src="https://cdn.counter.dev/script.js"]') as HTMLScriptElement;
    expect(counterScript).toBeTruthy();
    expect(counterScript.dataset['id']).toBe('f30df6f3-776d-4154-959d-0210ac8a8325');
  });

  it('should initialize clarity service', () => {
    service.init();

    expect(mockClarityService.init).toHaveBeenCalled();
  });

  it('should not load analytics if user explicitly disabled consent in localStorage', () => {
    localStorage.setItem('analyticsEnabled', 'false');

    service.init();

    expect(window.dataLayer).toBeUndefined();
    const script = document.head.querySelector('script[src*="googletagmanager.com"]');
    expect(script).toBeNull();
    expect(mockClarityService.init).not.toHaveBeenCalled();
  });
});
