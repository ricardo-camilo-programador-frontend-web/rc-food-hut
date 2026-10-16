import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { env } from '@/configs/env';
import { ClarityService } from '@/services/clarity.service';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Single bootstrap-time analytics loader: GA4 (direct gtag), optional GTM and
 * counter.dev. Clarity stays in ClarityService and is reused here.
 *
 * Consent is respected (spec: no new banner): nothing loads unless the user
 * kept analytics enabled in the intro warning modal ('analyticsEnabled' in
 * localStorage, default true) or config ANALYTICS_ENABLED is not 'false'.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT) as Document;
  private readonly clarityService = inject(ClarityService);
  private readonly analytics = env.ANALYTICS;
  private loaded = false;

  init(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.loaded) return;
    if (!this.analytics.enabled) return;
    if (localStorage.getItem('analyticsEnabled') === 'false') return;
    this.loaded = true;

    if (this.analytics.loadGtm) this.loadGtm();
    if (this.analytics.loadGtag) this.loadGtag();
    if (this.analytics.loadClarity) this.clarityService.init();
    this.loadCounterDev();
  }

  private loadGtag(): void {
    const w = window as Window;
    w.dataLayer = w.dataLayer || [];
    w.gtag = function gtag(...args: unknown[]): void {
      w.dataLayer?.push(args);
    };
    const script = this.document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.analytics.ga4Id}`;
    this.document.head.appendChild(script);
    w.gtag('config', this.analytics.ga4Id);
  }

  private loadGtm(): void {
    const w = window as Window;
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    const script = this.document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${this.analytics.gtmId}`;
    this.document.head.appendChild(script);
  }

  private loadCounterDev(): void {
    const counterId = this.analytics.counterId;
    if (!counterId) return;
    if (this.document.querySelector(`script[data-id="${counterId}"]`)) return;
    const script = this.document.createElement('script');
    script.src = 'https://cdn.counter.dev/script.js';
    script.dataset['id'] = counterId;
    script.dataset['utcoffset'] = this.analytics.counterUtcOffset;
    script.async = true;
    script.onerror = () => script.remove();
    this.document.body.appendChild(script);
  }
}
