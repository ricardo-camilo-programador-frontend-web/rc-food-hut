import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { TranslatePipe } from "@/pipes/translate.pipe";

@Component({
  selector: "download-shortcut",
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <a
      [href]="'#app-section'"
      class="rounded-full inline-flex items-center px-4 py-2 bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 transition-colors {{className}}"
      role="button"
      [attr.aria-label]="'downloadShortcut.ariaLabel' | translate"
    >
      <span class="truncate">{{ 'downloadShortcut.buttonText' | translate }}</span>
    </a>
  `,
})
export class DownloadShortcutBlock {
  @Input() className = "";
}
