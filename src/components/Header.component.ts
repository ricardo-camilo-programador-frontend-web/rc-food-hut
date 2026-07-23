import { Component } from "@angular/core";
import { LogoComponent } from "@/components/Logo.component";
import { DownloadShortcutBlock } from "@/blocks/downloadShortcut/DownloadShortcut.block";
import { LanguageSelectorComponent } from "@/components/LanguageSelector.component";
import { MobileMenuComponent } from "@/components/MobileMenu.component";
import { TranslatePipe } from "@/pipes/translate.pipe";
import { HEADER_NAVIGATION_ITEMS } from "@/constants/navigation.constants";
import type { NavigationItem } from "@/types/navigation.types";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [LogoComponent, DownloadShortcutBlock, LanguageSelectorComponent, MobileMenuComponent, TranslatePipe],
  template: `
    <header
      class="w-screen mx-auto flex justify-between items-center z-[999] px-4 py-4 fixed top-0 left-0 right-0 bg-gradient-to-b from-white via-white to-[#FFF9F3]/20 backdrop-blur-sm"
    >
      <div class="md:max-w-[900px] lg:max-w-[1400px] mx-auto flex justify-between items-center w-full">
        <div class="relative z-[1000]">
          <app-logo></app-logo>
        </div>

        <nav class="hidden lg:flex items-center space-x-8">
          @for (item of menuItems; track $index) {
            <a
              [href]="item.link"
              [attr.aria-label]="item.ariaLabel! | translate"
              class="text-gray-700 hover:text-red-500 transition-colors font-medium text-base"
            >
              {{ item.label | translate }}
            </a>
          }
        </nav>

        <div class="hidden lg:flex items-center gap-3">
          <app-language-selector></app-language-selector>
          <download-shortcut [className]="'hidden lg:block'"></download-shortcut>
        </div>
      </div>

      <div class="flex items-center gap-2 lg:hidden">
        <app-language-selector></app-language-selector>
        <button
          (click)="toggleMobileMenu()"
          class="p-3 z-[31] text-gray-700 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Open navigation menu"
          [attr.aria-expanded]="isMobileMenuOpen"
          [attr.aria-controls]="'mobile-menu'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </header>

    <app-mobile-menu
      id="mobile-menu"
      [isOpen]="isMobileMenuOpen"
      (closeMenu)="closeMobileMenu()"
    ></app-mobile-menu>
  `,
})
export class HeaderComponent {
  menuItems: NavigationItem[] = HEADER_NAVIGATION_ITEMS;
  isMobileMenuOpen = false;

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}
