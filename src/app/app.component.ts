import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MetaService } from '@/services/meta.service';
import { RESTAURANT_STRUCTURED_DATA } from '@/constants/structured-data.constants';
import { env } from '@/configs/env';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-red-500 focus:text-white focus:px-4 focus:py-2 focus:rounded">
      Skip to main content
    </a>
    <router-outlet></router-outlet>
  `
})

export class AppComponent {
  private readonly metaService = inject(MetaService);

  constructor() {
    this.metaService.updateMetadata({
      title: 'Food Hut - Delicious Food Delivery',
      description: 'Order delicious food from your favorite restaurants. Fast delivery, amazing prices, and a wide variety of cuisines.',
      url: env.SITE_URL,
      image: `${env.SITE_URL}assets/images/og-image.webp`,
      structuredData: { ...RESTAURANT_STRUCTURED_DATA },
    });
  }
}
