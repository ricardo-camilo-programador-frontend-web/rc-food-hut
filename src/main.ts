import {bootstrapApplication, provideProtractorTestingSupport} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app-routing.module';
import { isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';
import { AnalyticsService } from '@/services/analytics.service';

bootstrapApplication(AppComponent, {providers: [
  provideProtractorTestingSupport(),
  provideRouter(routes),
  provideServiceWorker('ngsw-worker.js', {
    enabled: !isDevMode(),
    registrationStrategy: 'registerWhenStable:3000'
  })
]}).then((appRef) => appRef.injector.get(AnalyticsService).init())
  .catch((err) =>
  console.error(err),
);
