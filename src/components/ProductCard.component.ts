import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { ImageComponent } from "@/components/Image.component";
import { UserPreview } from "@/components/UserPreview.component";
import { getRandomLinkForRedirection } from "@/utils/getRandomLinkForRedirection";
import { TranslatePipe } from "@/pipes/translate.pipe";
import type { Product } from "@/types/product.types";

@Component({
  selector: "app-product-card",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ImageComponent, UserPreview, TranslatePipe],
  template: `
    <div
      class="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow w-[19rem] h-[33rem] relative bg-gradient-to-b from-white via-white  to-red-500/30 {{ className }}"
    >
      <div class="relative mb-3">
        <app-image
          [src]="'assets/svg/semicircle.svg'"
          [alt]="'alt.semicircle' | translate"
          [className]="
            'w-[15rem] h-auto -top-6 left-[1rem] object-contain absolute rotate-180'
          "
        ></app-image>

        <app-image
          [src]="product.image"
          [alt]="product.name | translate"
          [width]="396"
          [height]="396"
          loading="lazy"
          [className]="'w-[12rem] h-[12rem] object-cover rounded-lg mx-auto'"
        />

        <p class="text-white text-xs font-bold rounded-full px-2 py-1 bg-amber-700 w-[4rem] h-[4rem] flex items-center justify-center truncate absolute right-12 -mt-12 border-4 border-white">
          {{ product.price }} {{ 'currency.symbol' | translate }}
        </p>
      </div>

      <div class="flex w-full items-center justify-center">
        <div
          class="flex items-center justify-center gap-1 px-2 py-1 rounded-full text-sm mx-auto w-full max-w-[17rem]"
        >
          <div class="grid grid-cols-3 h-16 items-center justify-center w-[5rem]">
            @for (user of product.users; track user.id) {
              <user-preview
                [id]="user.id"
                [imagePath]="user.imagePath"
                [name]="user.name"
              ></user-preview>
            }
          </div>

          <div class="flex items-center gap-1">
            <app-image
              [src]="'assets/svg/star.svg'"
              [alt]="'alt.rating' | translate"
              [className]="'w-8 h-8'"
            />
            <span>({{ product.rating }})</span>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-2 items-center mt-6">
        <h3 class="font-semibold text-lg mb-2 text-red-600">
          {{ product.name | translate }}
        </h3>
        <p class="text-gray-600 text-sm mb-4 max-w-[15rem] text-center px-2">
          {{ product.description | translate }}
        </p>
      </div>

      <a
        [href]="[getRandomLinkForRedirection()]"
        class="bg-red-600 text-white px-4 py-2 rounded-full text-sm hover:bg-red-700 transition-colors absolute -bottom-4 inset-x-0 w-[8rem] mx-auto text-center"
        rel="noopener"
        target="_blank"
      >
        {{ 'productCard.orderNow' | translate }}
      </a>
    </div>
  `,
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() className: string = '';

  getRandomLinkForRedirection() {
    return getRandomLinkForRedirection();
  }
}
