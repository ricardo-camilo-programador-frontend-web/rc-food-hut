import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import '@angular/compiler';
import { Injector, PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AnalyticsService } from '../src/services/analytics.service';
import { ClarityService } from '../src/services/clarity.service';
import { ANALYTICS_DEFAULTS } from '../src/lib/analytics/config';

console.log('🧪 Running Analytics & Headers Behavior Gate...');

// 1. Verify default analytics configuration IDs
assert.equal(ANALYTICS_DEFAULTS.ga4Id, 'G-MSX663TSDY', 'GA4 default ID must be G-MSX663TSDY');
assert.equal(ANALYTICS_DEFAULTS.clarityId, 'yyrpw7vjoz', 'Clarity default ID must be yyrpw7vjoz');
assert.equal(ANALYTICS_DEFAULTS.counterId, 'f30df6f3-776d-4154-959d-0210ac8a8325', 'counter.dev ID must match');
assert.equal(ANALYTICS_DEFAULTS.counterUtcOffset, '-3', 'counter.dev UTC offset must be -3');
console.log('✅ Gate 1: Analytics defaults verified.');

// 2. Setup mock browser environment for AnalyticsService
const injectedScripts: Array<{ src?: string; dataset?: Record<string, string>; async?: boolean }> = [];
const mockDoc = {
  createElement: (tag: string) => {
    const el: { tagName: string; dataset: Record<string, string>; setAttribute: (k: string, v: string) => void; async?: boolean; src?: string } = {
      tagName: tag,
      dataset: {},
      setAttribute: (k: string, v: string) => { el.dataset[k] = v; },
    };
    return el;
  },
  head: {
    appendChild: (el: any) => { injectedScripts.push(el); return el; },
  },
  body: {
    appendChild: (el: any) => { injectedScripts.push(el); return el; },
  },
  querySelector: () => null,
  getElementsByTagName: () => [{ parentNode: { insertBefore: () => {} } }],
};

const win: {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  localStorage: { getItem: (k: string) => string | null; setItem: (k: string, v: string) => void };
} = {
  dataLayer: undefined,
  localStorage: {
    getItem: (key: string) => (key === 'analyticsEnabled' ? 'true' : null),
    setItem: () => {},
  },
};

(globalThis as any).window = win;
(globalThis as any).localStorage = win.localStorage;

const injector = Injector.create({
  providers: [
    { provide: PLATFORM_ID, useValue: 'browser' },
    { provide: DOCUMENT, useValue: mockDoc },
    { provide: ClarityService, useValue: { init: () => {}, setConsent: () => {} } },
    { provide: AnalyticsService, useClass: AnalyticsService },
  ],
});

const service = injector.get(AnalyticsService);
service.init();

// 3. Verify GA4 dataLayer requirements
assert.ok(Array.isArray(win.dataLayer), 'window.dataLayer must be initialized as an array');
assert.ok(typeof win.gtag === 'function', 'window.gtag must be initialized as a function');

// First item must be ['js', Date] as Arguments object
const item0 = win.dataLayer![0] as any;
const item0Type = Object.prototype.toString.call(item0);
assert.equal(item0Type, '[object Arguments]', `First dataLayer item must be [object Arguments], got ${item0Type}`);
assert.equal(item0[0], 'js', 'First dataLayer argument must be "js"');
assert.ok(item0[1] instanceof Date, 'Second argument of "js" must be Date instance');

// Second item must be ['config', 'G-MSX663TSDY'] as Arguments object
const item1 = win.dataLayer![1] as any;
const item1Type = Object.prototype.toString.call(item1);
assert.equal(item1Type, '[object Arguments]', `Second dataLayer item must be [object Arguments], got ${item1Type}`);
assert.equal(item1[0], 'config', 'Second dataLayer command must be "config"');
assert.equal(item1[1], 'G-MSX663TSDY', 'Config target must be G-MSX663TSDY');

console.log('✅ Gate 2: GA4 dataLayer Arguments contract verified.');

// 4. Verify counter.dev injection
const counterScript = injectedScripts.find(s => s.src?.includes('counter.dev'));
assert.ok(counterScript, 'counter.dev script must be injected');
assert.equal(counterScript?.dataset?.['id'], 'f30df6f3-776d-4154-959d-0210ac8a8325');
console.log('✅ Gate 3: counter.dev script verified.');

// 5. Verify netlify.toml exists, validates as TOML, and contains exact required headers
assert.ok(fs.existsSync('netlify.toml'), 'netlify.toml must exist in repo root');
const pyOutput = execSync(
  `python3 -c "import tomllib, json; print(json.dumps(tomllib.load(open('netlify.toml', 'rb'))))"`,
  { encoding: 'utf-8' }
);
const tomlData = JSON.parse(pyOutput);

// Environment
assert.equal(tomlData.build?.environment?.NODE_VERSION, '22', 'NODE_VERSION must be 22');
assert.equal(tomlData.build?.command, undefined, 'No [build] command must be defined');
assert.equal(tomlData.build?.publish, undefined, 'No [build] publish must be defined');

// Headers
const headersList: Array<{ for: string; values: Record<string, string> }> = tomlData.headers ?? [];
const rootHeaders = headersList.find(h => h.for === '/*')?.values;
assert.ok(rootHeaders, 'Headers for /* must exist');

// CSP validation
const csp = rootHeaders['Content-Security-Policy'] ?? '';
assert.ok(!csp.includes("'unsafe-eval'"), 'CSP must NOT contain unsafe-eval (Angular sem eval)');
assert.ok(csp.includes('https://www.googletagmanager.com'), 'CSP must allow googletagmanager script');
assert.ok(csp.includes('https://www.google-analytics.com'), 'CSP must allow google-analytics script');
assert.ok(csp.includes('https://*.clarity.ms'), 'CSP must allow clarity script');
assert.ok(csp.includes('https://cdn.counter.dev'), 'CSP must allow counter.dev script');
assert.ok(csp.includes("'unsafe-inline'"), 'CSP must allow unsafe-inline for scripts/styles');
assert.ok(csp.includes('https://*.google-analytics.com'), 'CSP connect-src must allow google-analytics');
assert.ok(csp.includes('https://*.analytics.google.com'), 'CSP connect-src must allow analytics.google.com');
assert.ok(csp.includes('https://*.googletagmanager.com'), 'CSP connect-src must allow googletagmanager');
assert.ok(csp.includes('https://*.clarity.ms'), 'CSP connect-src must allow clarity.ms');
assert.ok(csp.includes('https://c.bing.com'), 'CSP connect-src must allow c.bing.com');
assert.ok(csp.includes('https://t.counter.dev'), 'CSP connect-src must allow t.counter.dev');
assert.ok(csp.includes('https://cdn.counter.dev'), 'CSP connect-src must allow cdn.counter.dev');
assert.ok(csp.includes("img-src 'self' data: blob: https:"), 'CSP img-src must match spec');
assert.ok(csp.includes('https://fonts.googleapis.com'), 'CSP font/style must allow fonts.googleapis.com');
assert.ok(csp.includes('https://fonts.gstatic.com'), 'CSP font/style must allow fonts.gstatic.com');
assert.ok(csp.includes("worker-src 'self'"), 'CSP worker-src must be self');
assert.ok(csp.includes("manifest-src 'self'"), 'CSP manifest-src must be self');
assert.ok(csp.includes("frame-ancestors 'none'"), 'CSP frame-ancestors must be none');

// Other security headers
assert.equal(rootHeaders['X-Frame-Options'], 'DENY');
assert.equal(rootHeaders['X-Content-Type-Options'], 'nosniff');
assert.equal(rootHeaders['Referrer-Policy'], 'strict-origin-when-cross-origin');
assert.equal(
  rootHeaders['Permissions-Policy'],
  'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
);
assert.equal(
  rootHeaders['Strict-Transport-Security'],
  'max-age=31536000; includeSubDomains'
);

// Cache-Control headers
const jsHeaders = headersList.find(h => h.for === '/*.js')?.values;
assert.ok(jsHeaders?.['Cache-Control']?.includes('max-age=31536000'), 'Cache longo para /*.js');

const cssHeaders = headersList.find(h => h.for === '/*.css')?.values;
assert.ok(cssHeaders?.['Cache-Control']?.includes('max-age=31536000'), 'Cache longo para /*.css');

const assetHeaders = headersList.find(h => h.for === '/assets/*')?.values;
assert.ok(assetHeaders?.['Cache-Control']?.includes('max-age=31536000'), 'Cache longo para /assets/*');

console.log('✅ Gate 4: netlify.toml and security headers verified.');
console.log('🎉 All behavior gates PASSED!');
