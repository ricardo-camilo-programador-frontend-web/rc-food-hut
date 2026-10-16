import { resolveAnalyticsConfig } from '@/lib/analytics/config';

/**
 * Committed runtime env (develop branch has no generate-env script).
 * Analytics resolution (NG_APP_* > VITE_* legacy > defaults) lives in
 * src/lib/analytics/config.ts — resolveAnalyticsConfig({}) yields the defaults.
 */
export const env = {
  ANALYTICS: resolveAnalyticsConfig({}),
} as const;
