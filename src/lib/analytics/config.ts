/**
 * Analytics config (single source of truth for GA4/GTM/Clarity/counter.dev).
 *
 * Resolution order per variable: NG_APP_* (new) > VITE_* (legacy) > ANALYTICS_DEFAULTS.
 * Values are trimmed; empty values and placeholders fall through to the default.
 *
 * Pure module (no Angular imports): consumed by scripts/generate-env.ts at
 * build time and by the runtime analytics services via src/configs/env.ts.
 */

export interface AnalyticsConfig {
  /** Kill switch: NG_APP_ANALYTICS_ENABLED === 'false' disables every integration. */
  readonly enabled: boolean;
  readonly clarityId: string;
  readonly ga4Id: string;
  readonly gtmId: string;
  readonly gtmEnabled: boolean;
  /** GA4 id published through GTM, when it differs from ga4Id. */
  readonly gtmGa4Id: string;
  readonly counterId: string;
  readonly counterUtcOffset: string;
  /** GTM only loads when enabled AND an id exists. */
  readonly loadGtm: boolean;
  /** Direct gtag is suppressed when GTM already publishes the same GA4 id. */
  readonly loadGtag: boolean;
  readonly loadClarity: boolean;
}

export const ANALYTICS_DEFAULTS = {
  clarityId: 'yyrpw7vjoz',
  ga4Id: 'G-MSX663TSDY',
  gtmId: '',
  gtmEnabled: false,
  gtmGa4Id: '',
  counterId: 'f30df6f3-776d-4154-959d-0210ac8a8325',
  counterUtcOffset: '-3',
} as const;

const ENV_PREFIXES = ['NG_APP_', 'VITE_'] as const;
const PLACEHOLDER_IDS = new Set(['G-XXXXXXXXXX', 'GTM-XXXXXXX']);

/** First non-empty, non-placeholder value among the prefixed candidates. */
function readEnvValue(env: Record<string, string | undefined>, names: readonly string[]): string {
  for (const name of names) {
    for (const prefix of ENV_PREFIXES) {
      const value = (env[`${prefix}${name}`] ?? '').trim();
      if (value && !PLACEHOLDER_IDS.has(value)) {
        return value;
      }
    }
  }
  return '';
}

export function resolveAnalyticsConfig(env: Record<string, string | undefined>): AnalyticsConfig {
  const enabled = readEnvValue(env, ['ANALYTICS_ENABLED']).toLowerCase() !== 'false';
  const clarityId = readEnvValue(env, ['CLARITY_ID']) || ANALYTICS_DEFAULTS.clarityId;
  const ga4Id = readEnvValue(env, ['GA4_ID', 'GA_MEASUREMENT_ID']) || ANALYTICS_DEFAULTS.ga4Id;
  const gtmId = readEnvValue(env, ['GTM_ID']) || ANALYTICS_DEFAULTS.gtmId;
  const gtmGa4Id = readEnvValue(env, ['GTM_GA4_ID']) || ANALYTICS_DEFAULTS.gtmGa4Id;
  const counterId = readEnvValue(env, ['COUNTER_ID', 'COUNTER_DEV_ID']) || ANALYTICS_DEFAULTS.counterId;
  const counterUtcOffset = readEnvValue(env, ['COUNTER_UTCOFFSET']) || ANALYTICS_DEFAULTS.counterUtcOffset;
  const gtmEnabled = readEnvValue(env, ['GTM_ENABLED']) === 'true';

  const loadGtm = enabled && gtmEnabled && gtmId !== '';
  const loadGtag = enabled && ga4Id !== '' && !(loadGtm && gtmGa4Id === ga4Id);
  const loadClarity = enabled && clarityId !== '';

  return { enabled, clarityId, ga4Id, gtmId, gtmEnabled, gtmGa4Id, counterId, counterUtcOffset, loadGtm, loadGtag, loadClarity };
}
