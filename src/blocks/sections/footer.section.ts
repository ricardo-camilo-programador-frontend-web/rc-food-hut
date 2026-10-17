import { Component, OnInit } from "@angular/core";
import { env } from "@/configs/env";
import { ImageComponent } from "@/components/Image.component";
import { ButtonComponent } from "@/components/Button.component";
import { getRandomLinkForRedirection } from "@/utils/getRandomLinkForRedirection";
import { InputTextComponent } from "@/components/InputText.component";
import { RouterModule } from "@angular/router";
import { BuyMeCoffeeComponent } from "@/components/BuyMeCoffee.component";
import { TranslatePipe } from "@/pipes/translate.pipe";

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [ImageComponent, ButtonComponent, InputTextComponent, RouterModule, BuyMeCoffeeComponent, TranslatePipe],
  template: `
    <footer
      class="bg-white py-12 px-4 mt-auto bottom-0 w-full max-w-[1300px] mx-auto flex flex-col items-center justify-center pt-[15rem] md:pt-[5rem]"
    >
      <div
        class="flex flex-col md:flex-row w-full justify-between gap-8"
      >
        <div class="w-full md:max-w-[21rem] flex flex-col gap-4">
          <h2 class="text-red-500 text-2xl font-bold">{{ 'footer.companyName' | translate }}</h2>
          <p class="text-gray-600 max-w-xs">
            {{ 'footer.description' | translate }}
          </p>

          <div class="flex space-x-4">
            <a
              [href]="redirectLinks[0]"
              class="text-[#FDB100] hover:opacity-80"
              rel="noopener"
              target="_blank"
            >
              <app-image
                [src]="'assets/svg/facebookIcon.svg'"
                [alt]="'alt.facebook' | translate"
                [className]="'w-6 h-6'"
              />
            </a>
            <a
              [href]="redirectLinks[1]"
              class="text-[#FDB100] hover:opacity-80"
              rel="noopener"
              target="_blank"
            >
              <app-image
                [src]="'assets/svg/instagramIcon.svg'"
                [alt]="'alt.instagram' | translate"
                [className]="'w-6 h-6'"
              />
            </a>
            <a
              [href]="redirectLinks[2]"
              class="text-[#FDB100] hover:opacity-80"
              rel="noopener"
              target="_blank"
            >
              <app-image
                [src]="'assets/svg/twitterIcon.svg'"
                [alt]="'alt.twitter' | translate"
                [className]="'w-6 h-6'"
              />
            </a>
          </div>
        </div>

        <div
          class="flex flex-col sm:flex-row md:flex-nowrap justify-between w-full md:max-w-[20rem] gap-8 md:gap-4"
        >
          <div class="min-w-[10rem]">
            <h3 class="text-red-500 text-xl font-semibold">{{ 'footer.aboutUs' | translate }}</h3>
            <ul class="space-y-2">
              <li>
                <a
                  [href]="redirectLinks[3]"
                  class="text-gray-600 hover:text-red-500"
                  rel="noopener"
                  target="_blank"
                >
                  {{ 'footer.aboutUs' | translate }}
                </a>
              </li>
              <li>
                <a
                  [href]="redirectLinks[4]"
                  class="text-gray-600 hover:text-red-500"
                  rel="noopener"
                  target="_blank"
                >
                  {{ 'footer.serviceUs' | translate }}
                </a>
              </li>
              <li>
                <a
                  [href]="redirectLinks[5]"
                  class="text-gray-600 hover:text-red-500"
                  rel="noopener"
                  target="_blank"
                >
                  {{ 'footer.contact' | translate }}
                </a>
              </li>
              <li>
                <a
                  [href]="redirectLinks[6]"
                  class="text-gray-600 hover:text-red-500"
                  rel="noopener"
                  target="_blank"
                >
                  {{ 'footer.company' | translate }}
                </a>
              </li>
            </ul>
          </div>

          <div class="min-w-[10rem]">
            <h3 class="text-red-500 text-xl font-semibold">{{ 'footer.company' | translate }}</h3>
            <ul class="space-y-2">
              <li>
                <a
                  href="#"
                  class="text-gray-600 hover:text-red-500"
                  rel="noopener"
                  target="_blank"
                >
                  {{ 'footer.partnership' | translate }}
                </a>
              </li>
              <li>
                <a
                  [href]="redirectLinks[7]"
                  class="text-gray-600 hover:text-red-500"
                  rel="noopener"
                  target="_blank"
                >
                  {{ 'footer.termsOfUse' | translate }}
                </a>
              </li>
              <li>
                <a
                  [routerLink]="['/privacy-policy']"
                  class="text-gray-600 hover:text-red-500"
                  rel="noopener"
                  target="_blank"
                  >{{ 'footer.privacyPolicy' | translate }}</a
                >
              </li>
              <li>
                <a
                  [href]="redirectLinks[8]"
                  class="text-gray-600 hover:text-red-500"
                  rel="noopener"
                  target="_blank"
                  >{{ 'footer.sitemap' | translate }}</a
                >
              </li>
            </ul>
          </div>
        </div>

        <div class="w-full md:max-w-[20rem] flex flex-col gap-4">
          <div class="flex flex-col gap-4 mr-auto">
            <h3 class="text-red-500 text-xl font-semibold">
              {{ 'footer.getInTouch' | translate }}
            </h3>
            <p class="text-gray-600">
              {{ 'footer.newsletterDescription' | translate }}
            </p>
          </div>

          <buy-me-coffee [username]="buyMeCoffeeUsername"></buy-me-coffee>

          <div class="flex flex-col sm:flex-row gap-5 items-center justify-center">
            <app-input-text
              [inputClassName]="'min-w-[12rem] w-full px-4 py-2 rounded-full bg-gray-200'"
              type="email"
              [placeholder]="'footer.email' | translate"
              class="min-w-[12rem] w-full px-4 py-2 rounded-lg "
            />

            <app-button
              [className]="
                'w-full sm:w-auto px-6 py-2 bg-red-500 text-white hover:bg-[#ff4542] transition-colors rounded-full'
              "
            >
              {{ 'footer.subscribe' | translate }}
            </app-button>
          </div>
        </div>
      </div>

      <div class="mt-12 text-center text-gray-600">
        <a
          [href]="redirectLinks[9]"
          class="hover:text-red-500"
          rel="noopener"
          target="_blank"
        >
          {{ 'footer.copyright' | translate }} © {{ currentYear }} {{ 'footer.companyName' | translate }}.
        </a>
      </div>
    </footer>
  `,
})
export class FooterComponent implements OnInit {
  currentYear = new Date().getFullYear();
  redirectLinks: string[] = [];
  buyMeCoffeeUsername = env.BUYMEACOFFEE_USERNAME;

  ngOnInit(): void {
    this.redirectLinks = Array.from({ length: 10 }, () => getRandomLinkForRedirection());
  }
}
