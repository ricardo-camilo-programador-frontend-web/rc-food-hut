import { Component, inject, computed, signal, HostListener, ElementRef } from '@angular/core';
import { I18nService } from '@/services/i18n.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  template: `
    <div class="relative" [attr.aria-label]="ariaLabel()">
      <button
        (click)="toggleDropdown()"
        class="flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 cursor-pointer"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
        </svg>
        <span>{{ currentLabel() }}</span>
        <svg
          class="w-3 h-3 transition-transform duration-200"
          [class.rotate-180]="isOpen()"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      @if (isOpen()) {
        <div
          class="absolute right-0 mt-2 w-40 py-1 bg-white rounded-lg shadow-lg border border-gray-100 z-50 animate-[fadeIn_0.15s_ease-out]"
        >
          @for (loc of locales; track loc.code) {
            <button
              (click)="selectLanguage(loc.code)"
              class="w-full flex items-center justify-between px-4 py-2 text-sm transition-colors duration-150 cursor-pointer first:rounded-t-lg last:rounded-b-lg"
              [class]="currentLocale() === loc.code
                ? 'bg-red-600 text-white font-medium'
                : 'text-gray-700 hover:bg-gray-50'"
            >
              <span>{{ loc.label }}</span>
              @if (currentLocale() === loc.code) {
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              }
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
})
export class LanguageSelectorComponent {
  private i18nService = inject(I18nService);
  private elementRef = inject(ElementRef);

  locales = [
    { code: 'en' as const, label: 'English' },
    { code: 'pt-BR' as const, label: 'Português' },
  ];

  isOpen = signal(false);
  currentLocale = this.i18nService.getLocaleSignal();

  currentLabel = computed(() => {
    return this.locales.find(l => l.code === this.currentLocale())?.label ?? 'EN';
  });

  ariaLabel = computed(() => {
    return this.i18nService.translate('languageSelector.ariaLabel');
  });

  toggleDropdown(): void {
    this.isOpen.update(v => !v);
  }

  selectLanguage(locale: 'en' | 'pt-BR'): void {
    this.i18nService.setLocale(locale);
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: EventTarget): void {
    if (!this.elementRef.nativeElement.contains(target)) {
      this.isOpen.set(false);
    }
  }
}
