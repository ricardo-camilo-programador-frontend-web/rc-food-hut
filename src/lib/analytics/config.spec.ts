import { describe, it, expect } from 'vitest';
import { resolveAnalyticsConfig, ANALYTICS_DEFAULTS } from './config';

describe('resolveAnalyticsConfig', () => {
  it('should return default analytics configuration when env is empty', () => {
    const config = resolveAnalyticsConfig({});

    expect(config.enabled).toBe(true);
    expect(config.clarityId).toBe(ANALYTICS_DEFAULTS.clarityId);
    expect(config.ga4Id).toBe(ANALYTICS_DEFAULTS.ga4Id);
    expect(config.counterId).toBe(ANALYTICS_DEFAULTS.counterId);
    expect(config.counterUtcOffset).toBe(ANALYTICS_DEFAULTS.counterUtcOffset);
    expect(config.loadClarity).toBe(true);
    expect(config.loadGtag).toBe(true);
    expect(config.loadGtm).toBe(false);
  });

  it('should maintain production ids by default', () => {
    const config = resolveAnalyticsConfig({});

    expect(config.clarityId).toBe('yyrpw7vjoz');
    expect(config.ga4Id).toBe('G-MSX663TSDY');
    expect(config.counterId).toBe('f30df6f3-776d-4154-959d-0210ac8a8325');
  });

  it('should disable all loaders when ANALYTICS_ENABLED is false', () => {
    const config = resolveAnalyticsConfig({
      NG_APP_ANALYTICS_ENABLED: 'false',
    });

    expect(config.enabled).toBe(false);
    expect(config.loadClarity).toBe(false);
    expect(config.loadGtag).toBe(false);
    expect(config.loadGtm).toBe(false);
  });

  it('should ignore placeholder IDs and fallback to defaults', () => {
    const config = resolveAnalyticsConfig({
      NG_APP_GA4_ID: 'G-XXXXXXXXXX',
      VITE_GTM_ID: 'GTM-XXXXXXX',
    });

    expect(config.ga4Id).toBe(ANALYTICS_DEFAULTS.ga4Id);
    expect(config.gtmId).toBe('');
  });

  it('should suppress direct gtag when GTM publishes the same GA4 id', () => {
    const config = resolveAnalyticsConfig({
      NG_APP_GTM_ENABLED: 'true',
      NG_APP_GTM_ID: 'GTM-123456',
      NG_APP_GTM_GA4_ID: ANALYTICS_DEFAULTS.ga4Id,
    });

    expect(config.loadGtm).toBe(true);
    expect(config.loadGtag).toBe(false);
  });
});
