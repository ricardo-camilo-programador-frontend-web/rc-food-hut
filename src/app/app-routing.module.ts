import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectivePreloadingStrategyService } from '@/app/selective-preloading-strategy.service';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@/app/layouts/MainLayout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('@/app/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'privacy-policy',
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
