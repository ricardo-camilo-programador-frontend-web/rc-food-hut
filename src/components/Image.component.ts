import { Component, Input, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: 'app-image',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <img
      [src]="src"
      [alt]="alt"
      [width]="width"
      [height]="height"
      [loading]="loading"
      [attr.fetchpriority]="fetchpriority"
      decoding="async"
      [class]="className"
    >
  `
})

export class ImageComponent {
  @Input() src = '';
  @Input() alt = '';
  @Input() width = '';
  @Input() height = '';
  @Input() loading = 'lazy';
  @Input() fetchpriority: 'high' | 'low' | 'auto' = 'auto';
  @Input() className = '';
}
