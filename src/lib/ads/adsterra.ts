/**
 * Discreet Adsterra slots: native banner and display banner only.
 *
 * Zone keys and script hosts come from build-time env (scripts/generate-env.ts
 * → src/configs/env.ts). Nothing renders and no script is injected when the
 * key is missing or `NG_APP_ADSTERRA_ENABLED` is `false`. The kill switch
 * defaults to on only when a key is present.
 *
 * Consent follows the project modal (IntroWarningModal): it exposes
 * `window.rcStudyModal.isAnalyticsEnabled` and fires
 * `rc-study-modal:analytics` when the toggle changes. A missing API does not
 * block (the modal defaults analytics to on); `false` blocks the ad.
 *
 * Callers must also require `!isDevMode()` and the canonical hostname
 * (`shouldLoadAdsterra`) so local dev and deploy previews stay clean.
 */

export const DEFAULT_BANNER_HOST = 'www.highperformanceformat.com';

/** Fired by IntroWarningModal when the analytics toggle changes. */
export const ADSTERRA_CONSENT_EVENT = 'rc-study-modal:analytics';

const KEY_PATTERN = /^[a-z0-9]{8,64}$/i;
const HOST_PATTERN = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;
const DESKTOP_MIN_WIDTH = 768;

export type AdsterraFormat = 'native' | 'banner';
export type AdsterraBannerVariant = 'rectangle' | 'responsive';

export interface AdsterraAtOptions {
  key: string;
  format: 'iframe';
  height: number;
  width: number;
  params: Record<string, never>;
}

export interface AdsterraScript {
  format: AdsterraFormat;
  key: string;
  host: string;
  src: string;
  containerId: string;
  width: number;
  height: number;
  atOptions?: AdsterraAtOptions;
}

export interface BuildAdsterraScriptInput {
  format: AdsterraFormat;
  nativeKey?: string;
  nativeHost?: string;
  bannerKey?: string;
  bannerHost?: string;
  enabledFlag?: string;
  viewportWidth?: number;
  bannerVariant?: AdsterraBannerVariant;
}

export interface ShouldLoadAdsterraInput {
  script: AdsterraScript | null;
  /** `!isDevMode()` in the Angular app. */
  production: boolean;
  hostname: string;
  canonicalHostname: string;
  /**
   * `null` when `rcStudyModal.isAnalyticsEnabled` is absent.
   * `false` blocks the ad. `true` allows it.
   */
  analyticsEnabled: boolean | null;
}

export interface RcStudyModalApi {
  open?: () => void;
  isAnalyticsEnabled?: () => boolean;
}

declare global {
  interface Window {
    atOptions?: AdsterraAtOptions;
    rcStudyModal?: RcStudyModalApi;
  }
}

function clean(value: string | undefined): string {
  return value?.trim() ?? '';
}

function isExplicitlyDisabled(flag: string | undefined): boolean {
  const value = clean(flag).toLowerCase();
  return value === 'false' || value === '0' || value === 'off';
}

function validKey(value: string | undefined): string | null {
  const key = clean(value);
  return KEY_PATTERN.test(key) ? key : null;
}

function validHost(value: string | undefined, fallback?: string): string | null {
  const host = clean(value) || fallback || '';
  return HOST_PATTERN.test(host) ? host : null;
}

/** Hostname of the canonical site URL (empty string for unusable URLs). */
export function canonicalHostname(siteUrl: string): string {
  try {
    return new URL(siteUrl).hostname.toLowerCase();
  } catch {
    return '';
  }
}

function bannerSize(
  variant: AdsterraBannerVariant,
  viewportWidth: number,
): { width: number; height: number } {
  if (variant === 'rectangle') return { width: 300, height: 250 };
  if (viewportWidth >= DESKTOP_MIN_WIDTH) return { width: 728, height: 90 };
  return { width: 320, height: 50 };
}

/**
 * Builds the official invoke.js URL for a native or display banner.
 * Returns null when the slot is disabled or the key/host is unusable.
 */
export function buildAdsterraScript(input: BuildAdsterraScriptInput): AdsterraScript | null {
  if (isExplicitlyDisabled(input.enabledFlag)) return null;

  const viewportWidth = input.viewportWidth ?? DESKTOP_MIN_WIDTH;
  const variant = input.bannerVariant ?? 'responsive';

  if (input.format === 'native') {
    const key = validKey(input.nativeKey);
    const host = validHost(input.nativeHost);
    if (!key || !host) return null;
    return {
      format: 'native',
      key,
      host,
      src: `//${host}/${key}/invoke.js`,
      containerId: `container-${key}`,
      width: 728,
      height: 120,
    };
  }

  const key = validKey(input.bannerKey);
  const host = validHost(input.bannerHost, DEFAULT_BANNER_HOST);
  if (!key || !host) return null;
  const size = bannerSize(variant, viewportWidth);
  const atOptions: AdsterraAtOptions = {
    key,
    format: 'iframe',
    height: size.height,
    width: size.width,
    params: {},
  };
  return {
    format: 'banner',
    key,
    host,
    src: `//${host}/${key}/invoke.js`,
    containerId: `container-${key}`,
    width: size.width,
    height: size.height,
    atOptions,
  };
}

/** Production + canonical host + consent. A null script never loads. */
export function shouldLoadAdsterra(input: ShouldLoadAdsterraInput): boolean {
  if (!input.script) return false;
  if (!input.production) return false;
  const hostname = input.hostname.trim().toLowerCase();
  const canonical = input.canonicalHostname.trim().toLowerCase();
  if (!hostname || hostname !== canonical) return false;
  if (input.analyticsEnabled === false) return false;
  return true;
}

/**
 * Reads the project modal without throwing. `null` means the API is not there
 * yet, which does not block the ad. A thrown read fails closed and blocks the ad.
 */
export function readAnalyticsConsent(modal: RcStudyModalApi | undefined): boolean | null {
  if (typeof modal?.isAnalyticsEnabled !== 'function') return null;
  try {
    return modal.isAnalyticsEnabled() ? true : false;
  } catch {
    return false;
  }
}

const SCRIPT_ID_PREFIX = 'adsterra-invoke-';

export function adsterraScriptElementId(key: string): string {
  return `${SCRIPT_ID_PREFIX}${key}`;
}

/**
 * Inserts invoke.js once per key, inside the slot so removal unmounts with it.
 * Display banners need `window.atOptions` set before the script runs.
 * Returns null when that key's script is already in the document.
 */
export function mountAdsterraScript(
  container: HTMLElement,
  script: AdsterraScript,
): HTMLScriptElement | null {
  const doc = container.ownerDocument;
  const scriptId = adsterraScriptElementId(script.key);
  if (doc.getElementById(scriptId)) return null;

  const view = doc.defaultView;
  if (script.atOptions && view) {
    view.atOptions = script.atOptions;
  }

  const node = doc.createElement('script');
  node.id = scriptId;
  node.async = true;
  node.src = script.src;
  container.appendChild(node);
  return node;
}

export function removeAdsterraScript(doc: Document, key: string | undefined): void {
  if (!key) return;
  doc.getElementById(adsterraScriptElementId(key))?.remove();
  const view = doc.defaultView;
  if (view?.atOptions?.key === key) {
    view.atOptions = undefined;
  }
}
