import { Component, ChangeDetectionStrategy } from "@angular/core";
import { ProductCardComponent } from "@/components/ProductCard.component";
import { Product } from "@/types/product.types";
import { ButtonComponent } from "@/components/Button.component";
import { TranslatePipe } from "@/pipes/translate.pipe";

@Component({
  selector: "menu-section",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductCardComponent, ButtonComponent, TranslatePipe],
  template: `
    <section
      id="menu-section"
      class="py-16 px-4 max-w-7xl mx-auto min-h-[600px] md:max-w-[900px] lg:max-w-[1400px]"
    >
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold">
          {{ 'menu.heading1' | translate }}
          <span class="text-red-600">{{ 'menu.heading2' | translate }}</span>
          <span class="text-amber-700">{{ 'menu.heading3' | translate }}</span>
        </h2>
        <h3 class="text-3xl font-bold">
          {{ 'menu.heading4' | translate }} <span class="text-red-600">{{ 'menu.heading5' | translate }}</span>
        </h3>
      </div>

      <div class="flex flex-wrap justify-center gap-3 mb-12">
        @for (category of categories; track category.id) {
          <app-button
            [className]="
              'px-6 py-2 rounded-full text-sm transition-all ' +
              (selectedCategory === category.id
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800')
            "
            (click)="selectCategory(category.id)"
          >
            {{ category.name | translate }}
          </app-button>
        }
      </div>

      @if (filteredProducts.length > 0) {
        <div
          class="hidden md:flex flex-wrap gap-6 gap-y-14 items-center justify-center"
        >
          @for (product of filteredProducts; track product.id) {
            <app-product-card
              [product]="product"
            ></app-product-card>
          }
        </div>

        <div
          class="flex md:hidden flex-wrap gap-6 gap-y-14 items-center justify-center overflow-hidden min-h-[35rem]"
        >
          <app-product-card [product]="filteredProducts[0]"></app-product-card>
        </div>
      } @else {
        <div class="col-span-full text-center py-8">
          <p class="text-gray-600 text-lg">
            {{ 'menu.noProducts' | translate }}
          </p>
        </div>
      }
    </section>
  `,
})
export class MenuSection {
  selectedCategory: string | null = null;

  categories = [
    { id: "ramen", name: "menu.categories.ramen" },
    { id: "breakfast", name: "menu.categories.breakfast" },
    { id: "lunch", name: "menu.categories.lunch" },
    { id: "dinner", name: "menu.categories.dinner" },
    { id: "mexican", name: "menu.categories.mexican" },
    { id: "italian", name: "menu.categories.italian" },
    { id: "desserts", name: "menu.categories.desserts" },
    { id: "drinks", name: "menu.categories.drinks" },
  ];

  products: Product[] = [
    {
      id: 1,
      name: "menu.products.berryBananaFrenchToast.name",
      image: "/assets/images/berry-banana-french-toast.webp",
      rating: 4.8,
      description: "menu.products.berryBananaFrenchToast.description",
      price: 12.99,
      category: "breakfast",
      users: [
        { id: "1", imagePath: "default-avatar.webp", name: "Ava Thompson" },
        { id: "2", imagePath: "default-avatar.webp", name: "Ethan Patel" },
        { id: "3", imagePath: "default-avatar.webp", name: "Lily Chen" },
      ],
    },
    {
      id: 2,
      name: "menu.products.buddhaBowl.name",
      image: "/assets/images/buddha-bowl-sauce.webp",
      rating: 4.7,
      description: "menu.products.buddhaBowl.description",
      price: 14.99,
      category: "lunch",
      users: [
        { id: "4", imagePath: "default-avatar.webp", name: "Oliver Brown" },
        { id: "5", imagePath: "default-avatar.webp", name: "Sophia Lee" },
        { id: "6", imagePath: "default-avatar.webp", name: "Mason Davis" },
      ],
    },
    {
      id: 3,
      name: "menu.products.cheeseBaconBurger.name",
      image: "/assets/images/cheese-bacon-burger.webp",
      rating: 4.6,
      description: "menu.products.cheeseBaconBurger.description",
      price: 16.99,
      category: "dinner",
      users: [
        { id: "7", imagePath: "default-avatar.webp", name: "Isabella Garcia" },
        { id: "8", imagePath: "default-avatar.webp", name: "Alexander Martin" },
        { id: "9", imagePath: "default-avatar.webp", name: "Charlotte Hall" },
      ],
    },
    {
      id: 4,
      name: "menu.products.crispyChickenBurger.name",
      image: "/assets/images/crispy-chicken-burger.webp",
      rating: 4.5,
      description: "menu.products.crispyChickenBurger.description",
      price: 15.99,
      category: "lunch",
      users: [
        { id: "10", imagePath: "default-avatar.webp", name: "Julian Sanchez" },
        { id: "11", imagePath: "default-avatar.webp", name: "Emily Taylor" },
        { id: "12", imagePath: "default-avatar.webp", name: "Benjamin White" },
      ],
    },
    {
      id: 5,
      name: "menu.products.grilledChickenPlate.name",
      image: "/assets/images/grilled-chicken-plate.webp",
      rating: 4.4,
      description: "menu.products.grilledChickenPlate.description",
      price: 17.99,
      category: "dinner",
      users: [
        { id: "13", imagePath: "default-avatar.webp", name: "Hannah Brooks" },
        { id: "14", imagePath: "default-avatar.webp", name: "Caleb Walker" },
        { id: "15", imagePath: "default-avatar.webp", name: "Abigail Lewis" },
      ],
    },
    {
      id: 6,
      name: "menu.products.grilledSalmonVegetables.name",
      image: "/assets/images/grilled-salmon-vegetables.webp",
      rating: 4.9,
      description: "menu.products.grilledSalmonVegetables.description",
      price: 24.99,
      category: "dinner",
      users: [
        { id: "16", imagePath: "default-avatar.webp", name: "Gabriel Harris" },
        { id: "17", imagePath: "default-avatar.webp", name: "Samantha Johnson" },
        { id: "18", imagePath: "default-avatar.webp", name: "Michael Brown" },
      ],
    },
    {
      id: 7,
      name: "menu.products.mixedGrillPlatter.name",
      image: "/assets/images/mixed-grill.webp",
      rating: 4.7,
      description: "menu.products.mixedGrillPlatter.description",
      price: 28.99,
      category: "dinner",
      users: [
        { id: "19", imagePath: "default-avatar.webp", name: "Olivia Williams" },
        { id: "20", imagePath: "default-avatar.webp", name: "Logan Davis" },
        { id: "21", imagePath: "default-avatar.webp", name: "Ava Rodriguez" },
      ],
    },
    {
      id: 8,
      name: "menu.products.shrimpScampi.name",
      image: "/assets/images/shrimp-scampi.webp",
      rating: 4.7,
      description: "menu.products.shrimpScampi.description",
      price: 22.99,
      category: "italian",
      users: [
        { id: "22", imagePath: "default-avatar.webp", name: "Ethan Hall" },
        { id: "23", imagePath: "default-avatar.webp", name: "Lily Martin" },
        { id: "24", imagePath: "default-avatar.webp", name: "Ava Patel" },
      ],
    },
  ];

  get filteredProducts() {
    if (this.selectedCategory === null) {
      return this.products;
    }

    return this.products.filter(
      (product) => product.category === this.selectedCategory
    );
  }

  selectCategory(categoryId: string) {
    this.selectedCategory =
      this.selectedCategory === categoryId ? null : categoryId;
  }
}
