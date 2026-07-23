import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { env } from '@/configs/env';

declare global {
  interface Window {
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[] };
  }
}

@Injectable({ providedIn: 'root' })
export class ClarityService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT) as Document;
  private loaded = false;

  /**
   * Injects the Microsoft Clarity script into <head> and sends consent signal.
   * Only runs in browser context. Safe to call multiple times.
   *
   * Per ConsentV2 docs, Clarity requires explicit consent for EEA/UK/CH users.
   * Without it, Clarity assigns a unique ID per page view (no session persistence).
   * https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2
   */
  init(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.loaded) return;
    if (!env.CLARITY_ID) return;

    const projectId = env.CLARITY_ID;
    const w = window as Window;

    // Clarity snippet — official pattern
    const clarityFn = function (...args: unknown[]) {
      (clarityFn.q = clarityFn.q || []).push(args);
    };
    clarityFn.q = [] as unknown[];
    w.clarity = clarityFn as Window['clarity'];

    const script = this.document.createElement('script');
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${projectId}`;
    script.setAttribute('data-clarity-project-id', projectId);

    const firstScript = this.document.getElementsByTagName('script')[0];
    firstScript.parentNode?.insertBefore(script, firstScript);

    this.loaded = true;

    // Send ConsentV2 signal — required for EEA/UK/CH since Oct 31, 2025
    // Without this, Clarity does not persist cookies in those regions.
    this.setConsent(true);
  }

  /**
   * Sends ConsentV2 signal to Clarity.
   * @param granted Whether the user granted analytics consent.
   *
   * When granted: Clarity sets cookies and tracks across sessions.
   * When denied:  Clarity deletes cookies, ends session, operates in no-consent mode.
   */
  setConsent(granted: boolean): void {
    if (!this.loaded || !window.clarity) return;

    window.clarity('consentv2', {
      ad_Storage: granted ? 'granted' : 'denied',
      analytics_Storage: granted ? 'granted' : 'denied',
    });
  }

  /**
   * Uploads a custom tag to Clarity for session identification.
   * @param key Tag name
   * @param value Tag value
   */
  setCustomTag(key: string, value: string): void {
    if (this.loaded && window.clarity) {
      window.clarity('set', key, value);
    }
  }

  /**
   * Identifies a user in Clarity by email or custom ID.
   * @param userId Unique identifier (email, username, etc.)
   * @param sessionId Optional custom session name
   * @param pageId Optional page identifier
   */
  identify(userId: string, sessionId?: string, pageId?: string): void {
    if (this.loaded && window.clarity) {
      window.clarity('identify', userId, sessionId, pageId);
    }
  }

  /**
   * Clears the Clarity cookie and resets the session.
   * Uses the legacy consent API as recommended for cookie erasure.
   */
  clear(): void {
    if (this.loaded && window.clarity) {
      window.clarity('consent', false);
    }
  }

  get isLoaded(): boolean {
    return this.loaded;
  }
}
