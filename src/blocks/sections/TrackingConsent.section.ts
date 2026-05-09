declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PUBLIC_GOOGLE_TAG_MANAGER_ID: string;
    }
  }
}

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

import { Component, OnInit } from "@angular/core";
import { env } from "@/configs/env";
import { CommonModule } from "@angular/common";
import {
  saveItemOnLocalStorage,
} from "@/utils/localStorageHandler";
import { TranslatePipe } from "@/pipes/translate.pipe";

@Component({
  selector: "tracking-consent",
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div
      *ngIf="showModal"
      class="fixed bottom-6 right-0 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
        role="dialog"
        aria-modal="true"
      >
        <h2 class="text-xl font-semibold mb-4">{{ 'trackingConsent.title' | translate }}</h2>

        <p class="mb-4 text-gray-600">
          {{ 'trackingConsent.description' | translate }}
          <a
            href="/privacy-policy"
            class="text-blue-600 hover:text-blue-800 underline"
            target="_blank"
          >
            {{ 'trackingConsent.privacyPolicy' | translate }} </a
          >.
        </p>

        <div class="flex gap-4 justify-end">
          <button
            (click)="handleConsent(false)"
            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            [attr.aria-label]="'trackingConsent.declineAria' | translate"
          >
            {{ 'trackingConsent.decline' | translate }}
          </button>
          <button
            (click)="handleConsent(true)"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            [attr.aria-label]="'trackingConsent.acceptAria' | translate"
          >
            {{ 'trackingConsent.accept' | translate }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class TrackingConsentComponent implements OnInit {
  private readonly CONSENT_KEY = "tracking-consent";
  private readonly HAS_CHOSEN_KEY = "has-chosen-tracking";
  showModal = false;

  ngOnInit(): void {
    const hasChosen = localStorage.getItem(this.HAS_CHOSEN_KEY);
    const savedConsent = localStorage.getItem(this.CONSENT_KEY);

    if (hasChosen !== "true") {
      this.showModal = true;
      return;
    }

    if (savedConsent === "true") {
      this.initializeClarity();
    }
  }

  handleConsent(consent: boolean): void {
    this.showModal = false;

    saveItemOnLocalStorage(this.HAS_CHOSEN_KEY, "true");
    saveItemOnLocalStorage(this.CONSENT_KEY, String(consent));

    if (consent) {
      this.initializeClarity();
    }
  }

  private initializeClarity(): void {
    const gtmId = env.GTM_ID;

    if (gtmId) {
      window.dataLayer.push({
        event: "gtm.js",
        "gtm.start": new Date().getTime(),
        "gtm.containerId": gtmId,
      });
    }
  }
}
