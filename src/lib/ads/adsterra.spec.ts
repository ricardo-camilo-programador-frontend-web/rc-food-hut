import { describe, expect, it } from 'vitest';
import {
  ADSTERRA_CONSENT_EVENT,
  DEFAULT_BANNER_HOST,
  adsterraScriptElementId,
  buildAdsterraScript,
  canonicalHostname,
  mountAdsterraScript,
  readAnalyticsConsent,
  removeAdsterraScript,
  shouldLoadAdsterra,
  type AdsterraScript,
} from './adsterra';

const NATIVE_INPUT = {
  format: 'native' as const,
  nativeKey: 'a1b2c3d4e5',
  nativeHost: 'www.profitableratecpmnetwork.com',
};

describe('buildAdsterraScript', () => {
  it('returns null without a native key', () => {
    expect(buildAdsterraScript({ ...NATIVE_INPUT, nativeKey: '' })).toBeNull();
    expect(buildAdsterraScript({ ...NATIVE_INPUT, nativeKey: undefined })).toBeNull();
  });

  it('returns null when the kill switch is off', () => {
    expect(buildAdsterraScript({ ...NATIVE_INPUT, enabledFlag: 'false' })).toBeNull();
    expect(buildAdsterraScript({ ...NATIVE_INPUT, enabledFlag: '0' })).toBeNull();
    expect(buildAdsterraScript({ ...NATIVE_INPUT, enabledFlag: 'off' })).toBeNull();
  });

  it('returns null for invalid key or host values', () => {
    expect(buildAdsterraScript({ ...NATIVE_INPUT, nativeKey: 'short' })).toBeNull();
    expect(buildAdsterraScript({ ...NATIVE_INPUT, nativeKey: 'has space' })).toBeNull();
    expect(buildAdsterraScript({ ...NATIVE_INPUT, nativeHost: 'not a host' })).toBeNull();
    expect(buildAdsterraScript({ ...NATIVE_INPUT, nativeHost: 'https://host.com' })).toBeNull();
  });

  it('builds the native invoke.js URL', () => {
    const script = buildAdsterraScript(NATIVE_INPUT);
    expect(script).not.toBeNull();
    expect(script?.src).toBe('//www.profitableratecpmnetwork.com/a1b2c3d4e5/invoke.js');
    expect(script?.containerId).toBe('container-a1b2c3d4e5');
    expect(script?.format).toBe('native');
    expect(script?.width).toBe(728);
    expect(script?.height).toBe(120);
  });

  it('keeps the explicit native host even with a banner default available', () => {
    const script = buildAdsterraScript({ ...NATIVE_INPUT, nativeHost: 'zz123.effectivegatecpm.com' });
    expect(script?.host).toBe('zz123.effectivegatecpm.com');
  });

  it('builds a banner with atOptions and the default host', () => {
    const script = buildAdsterraScript({
      format: 'banner',
      bannerKey: 'a1b2c3d4e5',
      bannerHost: '',
      viewportWidth: 1280,
    });
    expect(script?.host).toBe(DEFAULT_BANNER_HOST);
    expect(script?.atOptions).toEqual({
      key: 'a1b2c3d4e5',
      format: 'iframe',
      height: 90,
      width: 728,
      params: {},
    });
  });

  it('sizes the responsive banner for mobile and the rectangle variant', () => {
    const mobile = buildAdsterraScript({
      format: 'banner',
      bannerKey: 'a1b2c3d4e5',
      viewportWidth: 390,
    });
    expect(mobile?.atOptions).toMatchObject({ width: 320, height: 50 });

    const rectangle = buildAdsterraScript({
      format: 'banner',
      bannerKey: 'a1b2c3d4e5',
      bannerVariant: 'rectangle',
    });
    expect(rectangle?.atOptions).toMatchObject({ width: 300, height: 250 });
  });
});

describe('canonicalHostname', () => {
  it('extracts the hostname and tolerates paths', () => {
    expect(canonicalHostname('https://food-hut-angular-chronicles-1.netlify.app/')).toBe(
      'food-hut-angular-chronicles-1.netlify.app',
    );
  });

  it('returns empty string for unusable URLs', () => {
    expect(canonicalHostname('')).toBe('');
    expect(canonicalHostname('not-a-url')).toBe('');
  });
});

describe('shouldLoadAdsterra', () => {
  const script = buildAdsterraScript(NATIVE_INPUT) as AdsterraScript;
  const base = {
    script,
    hostname: 'food-hut-angular-chronicles-1.netlify.app',
    canonicalHostname: 'food-hut-angular-chronicles-1.netlify.app',
    analyticsEnabled: null as boolean | null,
  };

  it('never loads a null script or outside production', () => {
    expect(shouldLoadAdsterra({ ...base, script: null, production: true })).toBe(false);
    expect(shouldLoadAdsterra({ ...base, production: false })).toBe(false);
  });

  it('loads only on the canonical hostname', () => {
    expect(shouldLoadAdsterra({ ...base, production: true, hostname: 'FOOD-HUT-ANGULAR-CHRONICLES-1.netlify.app' })).toBe(true);
    expect(shouldLoadAdsterra({ ...base, production: true, hostname: 'localhost' })).toBe(false);
    expect(shouldLoadAdsterra({ ...base, production: true, hostname: 'deploy-preview-42--food-hut.netlify.app' })).toBe(false);
  });

  it('blocks when analytics consent is explicitly false', () => {
    expect(
      shouldLoadAdsterra({
        ...base,
        production: true,
        hostname: 'food-hut-angular-chronicles-1.netlify.app',
        analyticsEnabled: false,
      }),
    ).toBe(false);
  });
});

describe('readAnalyticsConsent', () => {
  it('returns null when the modal API is absent', () => {
    expect(readAnalyticsConsent(undefined)).toBeNull();
    expect(readAnalyticsConsent({})).toBeNull();
  });

  it('reads the toggle value and fails closed on throw', () => {
    expect(readAnalyticsConsent({ isAnalyticsEnabled: () => true })).toBe(true);
    expect(readAnalyticsConsent({ isAnalyticsEnabled: () => false })).toBe(false);
    expect(
      readAnalyticsConsent({
        isAnalyticsEnabled: () => {
          throw new Error('boom');
        },
      }),
    ).toBe(false);
  });
});

describe('mountAdsterraScript / removeAdsterraScript', () => {
  it('inserts invoke.js once per key inside the container', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const script = buildAdsterraScript(NATIVE_INPUT) as AdsterraScript;

    const node = mountAdsterraScript(container, script);
    expect(node?.tagName).toBe('SCRIPT');
    expect(node?.getAttribute('src')).toBe(script.src);
    expect(node?.async).toBe(true);
    expect(container.querySelector(`#${adsterraScriptElementId(script.key)}`)).not.toBeNull();

    expect(mountAdsterraScript(container, script)).toBeNull();

    removeAdsterraScript(document, script.key);
    expect(container.querySelector(`#${adsterraScriptElementId(script.key)}`)).toBeNull();
    container.remove();
  });

  it('sets window.atOptions for banners and clears it on removal', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const script = buildAdsterraScript({
      format: 'banner',
      bannerKey: 'a1b2c3d4e5',
      viewportWidth: 1280,
    }) as AdsterraScript;

    mountAdsterraScript(container, script);
    expect(window.atOptions?.key).toBe('a1b2c3d4e5');

    removeAdsterraScript(document, script.key);
    expect(window.atOptions).toBeUndefined();
    container.remove();
  });

  it('exposes the consent event name used by the modal', () => {
    expect(ADSTERRA_CONSENT_EVENT).toBe('rc-study-modal:analytics');
  });
});
