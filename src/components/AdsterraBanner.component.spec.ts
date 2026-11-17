import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { enableProdMode } from '@angular/core';
import { AdsterraBannerComponent } from './AdsterraBanner.component';

const mockEnv = vi.hoisted(() => ({
  SITE_URL: 'http://localhost:3000/',
  ADSTERRA_ENABLED: '',
  ADSTERRA_NATIVE_KEY: '',
  ADSTERRA_NATIVE_HOST: '',
  ADSTERRA_BANNER_KEY: '',
  ADSTERRA_BANNER_HOST: '',
}));

vi.mock('@/configs/env', () => ({ env: mockEnv }));

// jsdom has no IntersectionObserver; fire immediately so the lazy-load path runs.
class FiringIntersectionObserver {
  constructor(private readonly callback: IntersectionObserverCallback) {
    queueMicrotask(() =>
      this.callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        this as unknown as IntersectionObserver,
      ),
    );
  }
  observe(): void { /* noop */ }
  unobserve(): void { /* noop */ }
  disconnect(): void { /* noop */ }
}
(globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = FiringIntersectionObserver;

enableProdMode();

const KEY = 'a1b2c3d4e5';
const HOST = 'www.profitableratecpmnetwork.com';

function mount(): void {
  TestBed.configureTestingModule({ imports: [AdsterraBannerComponent] });
  const fixture = TestBed.createComponent(AdsterraBannerComponent);
  fixture.detectChanges();
}

describe('AdsterraBannerComponent', () => {
  beforeEach(() => {
    window.rcStudyModal = undefined;
    delete window.atOptions;
    document.querySelectorAll('script[id^="adsterra-invoke-"]').forEach((n) => n.remove());
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    mockEnv.ADSTERRA_ENABLED = '';
    mockEnv.ADSTERRA_NATIVE_KEY = '';
    mockEnv.ADSTERRA_NATIVE_HOST = '';
    mockEnv.SITE_URL = 'http://localhost:3000/';
  });

  it('renders nothing without a zone key', () => {
    mount();
    const aside = document.querySelector('aside');
    expect(aside).toBeNull();
    expect(document.querySelector('script[id^="adsterra-invoke-"]')).toBeNull();
  });

  it('renders nothing when the kill switch is off', () => {
    mockEnv.ADSTERRA_ENABLED = 'false';
    mockEnv.ADSTERRA_NATIVE_KEY = KEY;
    mockEnv.ADSTERRA_NATIVE_HOST = HOST;
    mount();
    expect(document.querySelector('aside')).toBeNull();
  });

  it('injects one invoke.js after intersection when production + canonical host', async () => {
    mockEnv.ADSTERRA_NATIVE_KEY = KEY;
    mockEnv.ADSTERRA_NATIVE_HOST = HOST;
    mount();

    const aside = document.querySelector('aside');
    expect(aside).not.toBeNull();

    const frame = document.getElementById(`container-${KEY}`);
    expect(frame?.getAttribute('style')).toContain('120px');

    await vi.waitFor(() => {
      expect(document.getElementById(`adsterra-invoke-${KEY}`)).not.toBeNull();
    });
    const script = document.getElementById(`adsterra-invoke-${KEY}`);
    expect(script?.getAttribute('src')).toBe(`//${HOST}/${KEY}/invoke.js`);
    expect(document.querySelectorAll('script[id^="adsterra-invoke-"]').length).toBe(1);
  });

  it('unloads the script and hides the slot when consent turns off', async () => {
    mockEnv.ADSTERRA_NATIVE_KEY = KEY;
    mockEnv.ADSTERRA_NATIVE_HOST = HOST;
    mount();

    await vi.waitFor(() => {
      expect(document.getElementById(`adsterra-invoke-${KEY}`)).not.toBeNull();
    });

    window.dispatchEvent(new CustomEvent('rc-study-modal:analytics', { detail: false }));
    TestBed.tick(); // flush change detection for the hidden slot

    expect(document.getElementById(`adsterra-invoke-${KEY}`)).toBeNull();
    expect(document.querySelector('aside')).toBeNull();
  });

  it('never mounts outside the canonical host', async () => {
    mockEnv.ADSTERRA_NATIVE_KEY = KEY;
    mockEnv.ADSTERRA_NATIVE_HOST = HOST;
    mockEnv.SITE_URL = 'https://food-hut-angular-chronicles-1.netlify.app/';
    mount();

    expect(document.querySelector('aside')).toBeNull();
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(document.querySelector('script[id^="adsterra-invoke-"]')).toBeNull();
  });
});
