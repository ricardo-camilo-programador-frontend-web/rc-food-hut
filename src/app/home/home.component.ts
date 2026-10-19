import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntroSection } from '@/blocks/sections/intro.section';
import { SpecialOffersSection } from '@/blocks/sections/specialOffers.section';
import { AboutUsSection } from '@/blocks/sections/aboutUs.section';
import { MenuSection } from '@/blocks/sections/menu.section';
import { AppSection } from '@/blocks/sections/app.section';

@Component({
  selector: 'home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IntroSection, SpecialOffersSection, AboutUsSection, MenuSection, AppSection],
  template: `
    <div class="grid grid-cols-1 gap-16 pt-[6rem]">
      <intro-section></intro-section>

      @defer (on viewport) {
        <special-offers-section></special-offers-section>
      } @placeholder {
        <div class="min-h-[38rem]" aria-hidden="true"></div>
      }

      @defer (on viewport) {
        <about-us-section></about-us-section>
      } @placeholder {
        <div class="min-h-[38rem]" aria-hidden="true"></div>
      }

      @defer (on viewport) {
        <menu-section></menu-section>
      } @placeholder {
        <div class="min-h-[38rem]" aria-hidden="true"></div>
      }

      @defer (on viewport) {
        <app-section></app-section>
      } @placeholder {
        <div class="min-h-[38rem]" aria-hidden="true"></div>
      }
    </div>
  `
})

export class HomeComponent {}
