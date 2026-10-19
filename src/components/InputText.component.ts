import { Component, Input } from "@angular/core";
import { LabelComponent } from "./Label.component";

@Component({
  selector: "app-input-text",
  standalone: true,
  imports: [LabelComponent],
  template: `
    <div class="relative">
      <app-label
        [for]="id"
        [required]="required"
        [error]="error"
        [label]="label"
        [className]="className"
      >
        <input
          [id]="id"
          [type]="type"
          [placeholder]="placeholder"
          class="w-full px-4 py-3 rounded-full border border-gray-200 placeholder:text-gray-600 text-gray-800 focus:outline-none focus:border-red-600 "
          [class]="inputClassName"
        />
        <ng-content></ng-content>
      </app-label>
    </div>
  `,
})

export class InputTextComponent {
  @Input() type: string = "text";
  @Input() placeholder: string = "";
  @Input() required: boolean = false;
  @Input() error: string = "";
  @Input() label: string = "";
  @Input() id: string = "";
  @Input() className: string = "";
  @Input() inputClassName: string = "";
}
