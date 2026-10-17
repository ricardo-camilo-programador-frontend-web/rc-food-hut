import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "@/components/Header.component";
import { FooterComponent } from "@/blocks/sections/footer.section";
import { ImageComponent } from "@/components/Image.component";
import { IntroWarningModalSection } from "@/blocks/IntroWarningModal.section";
import { TranslatePipe } from "@/pipes/translate.pipe";

@Component({
  selector: "app-main-layout",
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ImageComponent, IntroWarningModalSection, TranslatePipe],
  template: `
    <div class="min-h-screen flex flex-col overflow-x-hidden">
      <app-header></app-header>

      <app-image
        [src]="'assets/images/black-transparent-background.webp'"
        [alt]="'alt.blackTransparentBackground' | translate"
        [className]="'min-w-screen w-full h-auto absolute inset-0 z-[-2]  -mt-24'"
      ></app-image>

      <main
        id="main-content"
        class="grid grid-cols-1 w-full mx-auto"
      >
        <router-outlet></router-outlet>
      </main>

      <intro-warning-modal></intro-warning-modal>
      <app-footer></app-footer>
    </div>
  `,
})

export class MainLayoutComponent {}
