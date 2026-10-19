import '@angular/compiler';
import assert from 'node:assert';
import { ANALYTICS_DEFAULTS, resolveAnalyticsConfig } from '../src/lib/analytics/config';
import { routes } from '../src/app/app-routing.module';

console.log('--- RUNNING BEHAVIOR GATE ---');

// 1. Verify Analytics SSOT
assert.strictEqual(ANALYTICS_DEFAULTS.clarityId, 'yyrpw7vjoz', 'Clarity ID must be yyrpw7vjoz');
assert.strictEqual(ANALYTICS_DEFAULTS.ga4Id, 'G-MSX663TSDY', 'GA4 ID must be G-MSX663TSDY');
assert.strictEqual(ANALYTICS_DEFAULTS.counterId, 'f30df6f3-776d-4154-959d-0210ac8a8325', 'Counter ID must match default');

const resolved = resolveAnalyticsConfig({});
assert.strictEqual(resolved.enabled, true, 'Analytics should be enabled by default');
assert.strictEqual(resolved.loadClarity, true, 'Clarity should load by default');
assert.strictEqual(resolved.loadGtag, true, 'GA4 gtag should load by default');
assert.strictEqual(resolved.clarityId, 'yyrpw7vjoz', 'Resolved clarityId must match');
assert.strictEqual(resolved.ga4Id, 'G-MSX663TSDY', 'Resolved ga4Id must match');

// 2. Verify Routes structure
assert.ok(Array.isArray(routes), 'Routes must be an array');
assert.ok(routes.length >= 1, 'Should have at least 1 top route');

console.log('✅ Analytics and Routes Gate PASSED');
