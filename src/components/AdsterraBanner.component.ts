import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  isDevMode,
} from '@angular/core';
import { TranslatePipe } from '@/pipes/translate.pipe';
import { env } from '@/configs/env';
import {
  ADSTERRA_CONSENT_EVENT,
  type AdsterraFormat,
  type AdsterraScript,
  buildAdsterraScript,
  canonicalHostname,
  mountAdsterraScript,
  readAnalyticsConsent,
  removeAdsterraScript,
  shouldLoadAdsterra,
} from '@/lib/ads/adsterra';

function scheduleIdle(task: () => void): () => void {
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(() => task(), { timeout: 1500 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(task, 1);
  return () => window.clearTimeout(id);
}

/**
 * One labeled Adsterra slot. Renders nothing without a zone key.
 * Loads only in production, on the canonical host, after idle + intersection
 * (rootMargin 200px), and only while the project modal keeps analytics on.
 */
@Component({
  selector: 'app-adsterra-banner',
  standalone: true,
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (allowed && script; as ad) {
      <aside
        [attr.aria-label]="'adsterra.label' | translate"
        class="mx-auto w-full max-w-[768px] px-4 py-8"
      >
        <p class="mb-2 text-center text-xs uppercase tracking-widest text-gray-400">
          {{ 'adsterra.label' | translate }}
        </p>
        <div
          [id]="ad.containerId"
          #frame
          class="mx-auto w-full overflow-hidden"
          [style.minHeight.px]="ad.height"
          [style.maxWidth.px]="ad.width"
        ></div>
      </aside>
    }
  `,
})
export class AdsterraBannerComponent implements OnInit, AfterViewChecked, OnDestroy {
  /** Native banner only by default; a display banner never adds a second slot. */
  @Input() format: AdsterraFormat = 'native';

  script: AdsterraScript | null = null;
  allowed = false;

  @ViewChild('frame') private frame?: ElementRef<HTMLDivElement>;

  private observer?: IntersectionObserver;
  private cancelIdle?: () => void;
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.script = buildAdsterraScript({
      format: this.format,
      enabledFlag: env.ADSTERRA_ENABLED,
      nativeKey: env.ADSTERRA_NATIVE_KEY,
      nativeHost: env.ADSTERRA_NATIVE_HOST,
      bannerKey: env.ADSTERRA_BANNER_KEY,
      bannerHost: env.ADSTERRA_BANNER_HOST,
      viewportWidth: typeof window === 'undefined' ? 768 : window.innerWidth,
    });
    this.allowed = this.canLoad() !== null;
    window.addEventListener(ADSTERRA_CONSENT_EVENT, this.onConsent);
  }

  ngAfterViewChecked(): void {
    if (this.allowed && this.frame && !this.observer && !this.cancelIdle) {
      this.setupLoader();
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener(ADSTERRA_CONSENT_EVENT, this.onConsent);
    this.teardownLoader();
    removeAdsterraScript(document, this.script?.key);
  }

  private readonly onConsent = (event: Event): void => {
    const detail = event instanceof CustomEvent ? event.detail : undefined;
    if (detail === false) {
      this.teardownLoader();
      removeAdsterraScript(document, this.script?.key);
      this.allowed = false;
      this.changeDetectorRef.markForCheck();
      return;
    }
    const allowed = this.canLoad() !== null;
    if (allowed !== this.allowed) {
      this.allowed = allowed;
      this.changeDetectorRef.markForCheck();
    }
  };

  private canLoad(): AdsterraScript | null {
    if (typeof window === 'undefined' || !this.script) return null;
    return shouldLoadAdsterra({
      script: this.script,
      production: !isDevMode(),
      hostname: window.location.hostname,
      canonicalHostname: canonicalHostname(env.SITE_URL),
      analyticsEnabled: readAnalyticsConsent(window.rcStudyModal),
    })
      ? this.script
      : null;
  }

  private setupLoader(): void {
    const frameEl = this.frame?.nativeElement;
    if (!frameEl || !this.script) return;

    const inject = (): void => {
      const live = this.canLoad();
      if (!live || !this.frame) return;
      mountAdsterraScript(this.frame.nativeElement, live);
    };

    if (typeof window.IntersectionObserver === 'function') {
      this.observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          this.observer?.disconnect();
          this.observer = undefined;
          this.cancelIdle = scheduleIdle(inject);
        },
        { rootMargin: '200px' },
      );
      this.observer.observe(frameEl);
    } else {
      this.cancelIdle = scheduleIdle(inject);
    }
  }

  private teardownLoader(): void {
    this.observer?.disconnect();
    this.observer = undefined;
    this.cancelIdle?.();
    this.cancelIdle = undefined;
  }
}
