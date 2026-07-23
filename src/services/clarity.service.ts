import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
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
  private readonly router = inject(Router);
  private loaded = false;

  /**
   * Injects the Microsoft Clarity script into <head>.
   * Only runs in browser context. Safe to call multiple times.
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

    // SPA route tracking: Clarity needs manual pageview updates for client-side navigation
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      )
      .subscribe((event: NavigationEnd) => {
        if (w.clarity) {
          w.clarity('set', 'page', event.urlAfterRedirects);
        }
      });
  }

  /**
   * Uploads a custom tag/cookie to Clarity for session identification.
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
