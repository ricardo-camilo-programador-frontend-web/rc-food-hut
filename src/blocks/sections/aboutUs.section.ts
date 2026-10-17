import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ImageComponent } from "@/components/Image.component";
import { ServiceGridComponent } from "@/components/ServiceGrid.component";
import { ServiceItem } from "@/types/ServiceItem.types";
import { getRandomLinkForRedirection } from "@/utils/getRandomLinkForRedirection";
import { TranslatePipe } from "@/pipes/translate.pipe";

@Component({
  selector: "about-us-section",
  standalone: true,
  imports: [
    CommonModule,
    ImageComponent,
    ServiceGridComponent,
    ImageComponent,
    TranslatePipe,
  ],
  template: `
    <section
      id="about-us-section"
      class="relative min-h-[38rem] flex items-center py-16 mx-auto flex-co justify-between md:max-w-[900px] lg:max-w-[1400px]"
    >
      <app-image
        [src]="'assets/svg/circular-dots-pattern.svg'"
        [alt]="'alt.circularDotsPattern' | translate"
        [className]="'w-[160px] h-auto absolute top-8 -left-[7rem]'"
      ></app-image>

      <app-image
        [src]="'assets/svg/yellow-circle-overlay.svg'"
        [alt]="'alt.yellowOverlay' | translate"
        [className]="'w-[36rem] h-[26rem] absolute lg:-bottom-[2rem] top-16 lg:-left-36 z-[-1] scale-150'"
      ></app-image>

      <app-image
        [src]="'assets/svg/scattered-spices.svg'"
        [alt]="'alt.scatteredSpices' | translate"
        [className]="
          'w-[10rem] mx-auto absolute left-[33rem] lg:left-[25rem] lg:top-[5rem] top-[4rem] z-[50] rotate-60'
        "
      ></app-image>

      <div class="container mx-auto px-4 flex flex-col justify-between lg:-mt-16">
        <div
          class="flex flex-col lg:flex-row justify-between items-center gap-12"
        >
          <div class="rounded-lg p-4 md:mx-auto">
            <div class="relative w-screen md:w-1/2 h-[17rem] ">
              <div
                class="top-0 right-0 bg-red-500 rounded-full w-[25rem] h-[25rem] -z-0 relative"
                style="background-image: url('/assets/images/circular-food-grid.webp'); background-size: cover; background-position: center;"
              ></div>

              <div
                class="relative lg:absolute inset-0 lg:top-16 w-[25rem] lg:w-[35rem] -ml-1 lg:-ml-[5rem] -mb-[4rem] lg:-mb-[10rem] rotate-180 -top-[28rem]"
              >
                <app-image
                  [src]="'assets/svg/semicircle.svg'"
                  [alt]="'alt.semicircle' | translate"
                  [className]="
                    'w-full h-auto inset-0 lg:top-16 object-contain max-h-[31rem] left-12 -bottom-[8rem]'
                  "
                ></app-image>
              </div>

              <div
                class="absolute inset-0 top-[2.5rem] w-[25rem]  object-contain h-[25rem] rounded-b-full -mt-[10rem]"
              >
                <app-image
                  [src]="'/assets/images/chef-presenting-dish.webp'"
                  [alt]="'alt.chefPresentingDish' | translate"
                  [className]="
                    'absolute inset-0 top-[1.7rem] w-full  object-contain rounded-b-full'
                  "
                />
              </div>
            </div>

            <div
              class="absolute left-[32rem] top-[13rem] w-[16rem]  object-contain h-[10rem] rounded-b-full -mt-[10rem] -rotate-45 hidden lg:block"
            >
              <app-image
                [src]="'/assets/svg/dashedArrowPath.svg'"
                [alt]="'alt.curvedDottedArrow' | translate"
                [className]="
                  'w-full rounded-b-full'
                "
              />
            </div>

            <app-image
              [src]="'assets/svg/coriander-leaves.svg'"
              [alt]="'alt.corianderLeaves' | translate"
              [className]="
                'lg:w-[9rem] w-[8rem] mx-auto absolute left-[18rem] lg:left-[15rem] top-[25rem] lg:top-[20rem] z-[50] rotate-60'
              "
            ></app-image>

            <app-image
              [src]="'assets/svg/helix-curve.svg'"
              [alt]="'alt.helixCurve' | translate"
              [className]="
                'w-[6rem] mx-auto absolute left-[30rem] top-[13rem] z-[50] rotate-60 hidden lg:block'
              "
            ></app-image>
          </div>

          <div class="w-full md:w-1/2 max-w-[43rem] text-black pt-32">
            <h2 class="text-3xl md:text-4xl font-bold mb-4">
              {{ 'aboutUs.heading1' | translate }} <span class="text-red-500">{{ 'aboutUs.heading2' | translate }}</span> {{ 'aboutUs.conjunction' | translate }}<br />
              <span class="text-amber-400">{{ 'aboutUs.heading3' | translate }}</span> {{ 'aboutUs.heading4' | translate }}
            </h2>

            <p class="text-gray-600 mb-8">
              {{ 'aboutUs.description' | translate }}
            </p>

            <app-service-grid [serviceItems]="services"></app-service-grid>

            <a
              [href]="[getRandomLinkForRedirection()]"
              class="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full transition-colors mt-6"
              rel="noopener"
              target="_blank"
            >
              {{ 'aboutUs.cta' | translate }}
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
})

export class AboutUsSection {
  services: ServiceItem[] = [
    {
      path: "/assets/svg/shopping-cart.svg",
      text: "aboutUs.services.onlineOrder",
    },
    {
      path: "/assets/svg/clock.svg",
      text: "aboutUs.services.service247",
    },
    {
      path: "/assets/svg/calendar-check.svg",
      text: "aboutUs.services.preReservation",
    },
    {
      path: "/assets/svg/calendar-check.svg",
      text: "aboutUs.services.organizedPlace",
    },
    {
      path: "/assets/svg/calendar-check.svg",
      text: "aboutUs.services.superChef",
    },
    {
      path: "/assets/svg/calendar-check.svg",
      text: "aboutUs.services.cleanKitchen",
    },
  ];

  getRandomLinkForRedirection() {
    return getRandomLinkForRedirection();
  }
}
