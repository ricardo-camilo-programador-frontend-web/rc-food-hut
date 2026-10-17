import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { isClickOutsideElement } from "@/utils/isClickOutsideElement";
import { TranslatePipe } from "@/pipes/translate.pipe";

@Component({
  selector: "app-modal",
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <dialog
      #modalRef
      [id]="id"
      role="dialog"
      aria-modal="true"
      [class]="
        'fixed inset-0 z-50 bg-black/20 text-black p-2 md:p-6 rounded-lg border border-white/20 backdrop:bg-black/50 open:animate-fade-in w-screen min-h-screen ' +
        className
      "
      [open]="isOpen"
      (close)="close()"
    >
      <div
        class="flex items-center justify-center min-h-screen"
        (click)="close()"
      >
        <div
          class="relative w-full max-w-md p-6 bg-white rounded-lg shadow-xl"
          (click)="$event.stopPropagation()"
        >
          <header
            class="flex items-center justify-between pb-2 border-b border-gray-200"
          >
            <h2 class="text-xl font-bold">{{ title }}</h2>
            <button
              (click)="onClose()"
              class="text-gray-500 hover:text-red-500 transition-colors"
              [attr.aria-label]="'modal.close' | translate"
            >
              <svg
                class="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  [attr.stroke-width]="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </header>
          <div class="mt-4">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    </dialog>
  `,
})
export class ModalComponent {
  @Input() id!: string;
  @Input() title!: string;
  @Input() className!: string;
  @Input() isOpen!: boolean;
  @Output() closeModal = new EventEmitter<void>();

  @ViewChild('modalRef') modalRef!: ElementRef;

  private previouslyFocusedElement: HTMLElement | null = null;

  open() {
    this.isOpen = true;
    this.previouslyFocusedElement = document.activeElement as HTMLElement;
    const focusableElements = this.modalRef.nativeElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }
  }

  close() {
    this.isOpen = false;
    this.restoreFocus();
    this.onClose();
  }

  private restoreFocus(): void {
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
      this.previouslyFocusedElement = null;
    }
  }

  onClose() {
    this.closeModal.emit();
  }

  isClickOutside(event: MouseEvent) {
    return isClickOutsideElement(this.modalRef.nativeElement, event);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen) {
      this.close();
    }
  }
}
