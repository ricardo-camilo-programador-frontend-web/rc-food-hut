import { Component, Input, ChangeDetectionStrategy, booleanAttribute } from "@angular/core";
import { NgOptimizedImage } from "@angular/common";

@Component({
  selector: 'app-image',
  standalone: true,
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (useOptimized) {
      <img
        [ngSrc]="normalizedSrc"
        [alt]="alt"
        [width]="numericWidth"
        [height]="numericHeight"
        [priority]="priority"
        [class]="className"
      >
    } @else {
      <img
        [src]="src"
        [alt]="alt"
        [attr.width]="width || null"
        [attr.height]="height || null"
        [loading]="priority ? 'eager' : loading"
        [attr.fetchpriority]="priority ? 'high' : fetchpriority"
        decoding="async"
        [class]="className"
      >
    }
  `
})

export class ImageComponent {
  @Input() src = '';
  @Input() alt = '';
  @Input() width: string | number = '';
  @Input() height: string | number = '';
  @Input() loading = 'lazy';
  @Input() fetchpriority: 'high' | 'low' | 'auto' = 'auto';
  @Input({ transform: booleanAttribute }) priority = false;
  @Input() className = '';

  get numericWidth(): number {
    const val = Number(this.width);
    return Number.isFinite(val) && val > 0 ? val : 0;
  }

  get numericHeight(): number {
    const val = Number(this.height);
    return Number.isFinite(val) && val > 0 ? val : 0;
  }

  get normalizedSrc(): string {
    return this.src.startsWith('/') ? this.src.slice(1) : this.src;
  }

  get useOptimized(): boolean {
    return this.numericWidth > 0 && this.numericHeight > 0 && !this.src.endsWith('.svg');
  }
}
