import { Component } from "@angular/core";

@Component({
  selector: 'app-tag',
  template: `
    <div class="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-800 font-medium">
      <ng-content></ng-content>
    </div>
  `
})

export class TagComponent {}
