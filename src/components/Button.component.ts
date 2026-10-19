import { Component, Input } from "@angular/core";
import { TranslatePipe } from "@/pipes/translate.pipe";

@Component({
  selector: "app-button",
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <button
      class="px-6 py-2 rounded-full font-medium hover:opacity-90 transition-opacity"
      [class]="className "
      [title]="title || ('button.fallback' | translate)"
    >
        {{ label }}
        <ng-content></ng-content>
    </button>
  `,
})
export class ButtonComponent {
  @Input() label = "";
  @Input() className = "";
  @Input() title = "";
}
