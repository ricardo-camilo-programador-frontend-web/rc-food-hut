import { Component, Input, inject, computed } from "@angular/core";
import { ImageComponent } from "./Image.component";
import { I18nService } from "@/services/i18n.service";
import { TranslatePipe } from "@/pipes/translate.pipe";

@Component({
  selector: "app-food-rating-card",
  standalone: true,
  imports: [ImageComponent, TranslatePipe],
  template: `
    <div class="absolute inset-0 bg-transparent p-2 mt-[3rem] lg:mt-[5rem] -ml-24 lg:-ml-9 {{ className }}">
      <div
        class="min-h-[6rem]  flex items-center space-x-2 bg-white w-max min-w-[10rem] p-1 px-3 border border-gray-100 rounded-lg shadow-lg"
      >
        <app-image
          [src]="imageSrc"
          [alt]="name"
          [width]="48"
          [height]="48"
          loading="lazy"
          [className]="'w-12 h-12 rounded'"
        />
        <div>
          <p class="font-medium">{{ name }}</p>
          <div class="flex items-center space-x-2">
            @for (star of stars; track $index) {
            <app-image
              [src]="
                star ? '/assets/svg/star.svg' : '/assets/svg/starEmpty.svg'
              "
              [alt]="star ? ('alt.star' | translate) : ('alt.starEmpty' | translate)"
              [className]="'w-4 h-4'"
              [title]="foodRatingTitle"
            />
            }
          </div>

          <p class="text-sm text-gray-600">{{ priceLabel() }}</p>
        </div>
      </div>
    </div>
  `,
})

export class FoodRatingCardComponent {
  private i18nService = inject(I18nService);

  @Input() imageSrc: string = "";
  @Input() name: string = "";
  @Input() rating: number = 0;
  @Input() price: number = 0;
  @Input() className: string = "";

  priceLabel = computed(() => this.i18nService.translate('currency.symbol') + this.price);

  get foodRatingTitle(): string {
    return this.i18nService.translate('foodRatingCard.title').replace('{{ rating }}', String(this.rating));
  }

  get stars(): boolean[] {
    return Array(5)
      .fill(0)
      .map((_, index) => index < this.rating);
  }
}
