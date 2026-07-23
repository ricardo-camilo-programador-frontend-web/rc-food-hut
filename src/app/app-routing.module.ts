import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from '@/app/layouts/MainLayout.component';
import { SelectivePreloadingStrategyService } from '@/app/selective-preloading-strategy.service';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('@/app/home/home.component').then(m => m.HomeComponent),
      },
    ]
  },
  {
    path: 'privacy-policy',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('@/app/privacy-policy/privacy.component').then(m => m.PrivacyComponent),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false,
    preloadingStrategy: SelectivePreloadingStrategyService,
  })],
  exports: [RouterModule]
})

export class AppRoutingModule {}
