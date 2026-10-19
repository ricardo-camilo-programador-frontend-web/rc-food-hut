import { Component, inject } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { TagComponent } from "@/components/Tag.component";
import { ButtonComponent } from "@/components/Button.component";
import { InputTextComponent } from "@/components/InputText.component";
import { ImageComponent } from "@/components/Image.component";
import { DownloadShortcutBlock } from "@/blocks/downloadShortcut/DownloadShortcut.block";
import { CustomerBadgeComponent } from "@/components/CustomerBadge.component";
import { FoodRatingCardComponent } from '@/components/FoodRatingCard.component';
import { ModalComponent } from "@/components/Modal.component";
import { TranslatePipe } from "@/pipes/translate.pipe";

@Component({
  selector: "intro-section",
  standalone: true,
  imports: [
    TagComponent,
    ButtonComponent,
    InputTextComponent,
    ImageComponent,
    DownloadShortcutBlock,
    CustomerBadgeComponent,
    FoodRatingCardComponent,
    ModalComponent,
    TranslatePipe,
  ],
  template: `
    <section
      id="intro-section"
      class="mx-auto w-full px-4 py-12 flex flex-col-reverse lg:flex-row items-center justify-between min-h-[38rem] relative md:max-w-[900px] lg:max-w-[1400px]"
    >
      <app-image
        [src]="'assets/svg/dashedArrowPath.svg'"
        [alt]="'alt.dashedArrowPath' | translate"
        [className]="
          'hidden lg:block w-20 h-20 lg:w-28 lg:h-28 absolute -top-6 left-10 lg:left-28'
        "
      ></app-image>

      <app-image
        [src]="'assets/svg/curved-lines.svg'"
        [alt]="'alt.curvedLines' | translate"
        [className]="'hidden lg:block w-[23rem]  absolute top-0 right-0 z-[-2]'"
      ></app-image>

      <app-image
        [src]="'assets/svg/citrusSlice.svg'"
        [alt]="'alt.citrusSlice' | translate"
        [className]="
          'w-20 h-20 lg:w-28 lg:h-28 absolute top-[20%] left-10 lg:left-[32%]'
        "
      ></app-image>

      <app-image
        [src]="'assets/svg/vertical-progress-indicator.svg'"
        [alt]="'alt.verticalProgressIndicator' | translate"
        [className]="'w-16 h-16  absolute bottom-0 left-0 '"
      ></app-image>

      <app-image
        [src]="'assets/svg/yellow-overlay.svg'"
        [alt]="'alt.yellowOverlay' | translate"
        priority
        [className]="'lg:w-[36rem] lg:h-[26rem] h-auto absolute -top-[12rem] -right-36 z-[-1]'"
      ></app-image>

      <div class="w-full lg:w-1/2 my-auto">
        <div class="flex flex-col gap-4 mb-5">
          <app-tag class="mt-4 lg:-mt-8 text-sm">
            <app-image
              [src]="'assets/svg/heartCircle.svg'"
              [alt]="'alt.heartCircle' | translate"
              [className]="'w-4 h-4 mr-2'"
            ></app-image>
            {{ 'intro.tag' | translate }}
          </app-tag>
        </div>

        <h1
          class="text-3xl lg:text-5xl font-bold mb-6 max-w-[400px] lg:max-w-none relative"
        >
          <span>{{ 'intro.headingPart1' | translate }}</span>
          <span class="text-red-600"> {{ 'intro.headingAccent' | translate }}</span>
          <br class="lg:hidden" />
          <br />
          <span class="text-amber-700">{{ 'intro.headingPart2' | translate }}</span>
          <app-image
            [src]="'assets/svg/redBrushStroke.svg'"
            [alt]="'alt.redBrushStroke' | translate"
            [className]="'w-[20rem]  absolute left-[10rem] -bottom-4'"
          ></app-image>
        </h1>

        <p class="text-gray-600 mb-8 w-full max-w-sm text-left">
          {{ 'intro.description' | translate }}
        </p>

        <div
          class="flex items-center justify-center lg:justify-start space-x-4 mb-8"
        >
          <app-input-text [placeholder]="'intro.searchPlaceholder' | translate" class="w-full lg:w-96">
            <button
              class="absolute right-2 top-[1.46rem] -translate-y-1/2 p-2 bg-amber-600 rounded-full hover:bg-amber-700 transition-colors"
            >
              <span class="sr-only">{{ 'intro.searchSrOnly' | translate }}</span>
              <app-image
                [src]="'assets/svg/searchIcon.svg'"
                [alt]="'alt.search' | translate"
                [className]="'w-6 h-6'"
              ></app-image>
            </button>
          </app-input-text>
        </div>

        <div
          class="flex items-center justify-center lg:justify-start space-x-4"
        >
          <download-shortcut></download-shortcut>

          <app-button
            [className]="
              'flex flex-row-reverse items-center justify-center gap-2 text-gray-700 hover:bg-gray-100 hover:text-amber-700 h-12 truncate'
            "
            [title]="'intro.watchVideo' | translate"
            [label]="'intro.watchVideo' | translate"
            (click)="isVideoModalOpen = true"
          >
            <app-image
              [src]="'assets/svg/arrowRight.svg'"
              [alt]="'alt.arrowRight' | translate"
              [className]="'min-w-[3.25rem] h-[3.25rem] mt-2 flex-grow-0'"
            ></app-image>
          </app-button>
        </div>
      </div>

      <div
        class="w-full md:w-1/2 relative my-8 md:my-auto hidden md:flex items-center justify-center"
      >
        <div
          class="absolute inset-0 bg-transparent p-2 h-16 -mt-[4.5rem] z-[9]"
        >
          <app-image
            [src]="'assets/svg/fire.svg'"
            [alt]="'alt.fire' | translate"
            [className]="'w-10 h-10 lg:w-16 lg:h-16  mx-auto'"
          ></app-image>
        </div>

        <app-image
          [src]="'assets/svg/coriander-leaves.svg'"
          [alt]="'alt.corianderLeaves' | translate"
          [className]="
            'lg:w-[9rem] w-16 mx-auto absolute -top-[2rem] lg:-top-[3.5rem] right-10 lg:right-[8rem] rotate-16 z-[50]'
          "
        ></app-image>

        <app-image
          [src]="'assets/svg/leaf-outline.svg'"
          [alt]="'alt.leafOutline' | translate"
          [className]="
            'w-[9rem]  mx-auto absolute bottom-[2rem] right-0 rotate-16 z-[50]'
          "
        ></app-image>

        <div
          class="top-0 right-0 bg-red-500 rounded-full w-[300px] lg:w-[500px] -z-0 relative"
        >
          <div class="z-10 max-h-[300px] lg:max-h-[500px]">
            <app-image
              [src]="'assets/images/happy-customer.webp'"
              [alt]="'alt.happyCustomer' | translate"
              [width]="454"
              [height]="600"
              [priority]="true"
              [className]="
                'w-full h-auto object-contain max-h-[300px] lg:max-h-[500px] rounded-b-full'
              "
            />
          </div>

          <app-image
            [src]="'assets/svg/semicircle.svg'"
            [alt]="'alt.semicircle' | translate"
            [className]="
              'w-full h-auto inset-0 top-8 lg:top-12 object-contain max-h-[300px] lg:max-h-[500px] absolute'
            "
          ></app-image>

          <app-image
            [src]="'assets/images/grilled-chicken-plate.webp'"
            [alt]="'alt.grilledChickenPlate' | translate"
            [width]="266"
            [height]="266"
            loading="lazy"
            [className]="
              'w-[5rem] lg:w-[10rem] mx-auto absolute bottom-[2rem] -right-9 rotate-16 z-[50]'
            "
          ></app-image>

          <app-image
            [src]="'assets/images/salmon-salad-plate.webp'"
            [alt]="'alt.salmonSaladPlate' | translate"
            [width]="356"
            [height]="324"
            loading="lazy"
            [className]="
              'w-[5rem] lg:w-[10rem] mx-auto absolute -bottom-[3rem] lg:-bottom-[5rem] right-[2rem] lg:right-[5rem] rotate-16 z-[50]'
            "
          ></app-image>

          <app-image
            [src]="'assets/images/grilled-salmon-vegetables.webp'"
            [alt]="'alt.grilledSalmonVegetables' | translate"
            [width]="306"
            [height]="304"
            loading="lazy"
            [className]="
              'w-[5rem] lg:w-[10rem] mx-auto absolute -bottom-[4rem] lg:-bottom-[5rem] left-[3.5rem] lg:left-[5rem] rotate-16 z-[50]'
            "
          ></app-image>

          <app-image
            [src]="'assets/images/buddha-bowl-sauce.webp'"
            [alt]="'alt.buddhaBowlSauce' | translate"
            [width]="342"
            [height]="332"
            loading="lazy"
            [className]="
              'w-[5rem] lg:w-[10rem] mx-auto absolute bottom-[1rem] -left-[2rem] lg:-left-[5rem] rotate-16 z-[50]'
            "
          ></app-image>
        </div>

        <app-customer-badge
          [className]="'absolute top-24 -right-[6rem] lg:right-0 z-[50]'"
        ></app-customer-badge>

        <app-image
          [src]="'assets/svg/heart-curved-path.svg'"
          [alt]="'alt.heartCurvedPath' | translate"
          [className]="'w-[7rem] h-[20rem]  absolute -top-16 right-0 lg:block hidden'"
        ></app-image>

        <app-image
          [src]="'assets/svg/dotted-arrow-up.svg'"
          [alt]="'alt.dottedArrowUp' | translate"
          [className]="'w-[4rem] h-[20rem]  absolute -top-16  right-16 md:-right-[5rem] lg:hidden block'"
        ></app-image>

        <app-food-rating-card
          [imageSrc]="'assets/images/pizza.webp'"
          [name]="'intro.italianPizza' | translate"
          [rating]="3"
          [price]="10.50"
          [className]="'absolute bottom-0 left-0'"
        ></app-food-rating-card>
      </div>
    </section>

    <app-modal
      [id]="'video-modal'"
      [title]="'intro.watchVideo' | translate"
      [isOpen]="isVideoModalOpen"
      [class]="'w-screen h-screen'"
      (closeModal)="isVideoModalOpen = false"
    >
      <div class="aspect-video w-full">
        <iframe
          class="w-full h-full rounded-lg"
          [src]="videoUrl"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </app-modal>
  `,
})
export class IntroSection {
  isVideoModalOpen = false;

  private sanitizer = inject(DomSanitizer);
  videoUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    'https://www.youtube.com/embed/cKmv-1xcKDk'
  );
}
