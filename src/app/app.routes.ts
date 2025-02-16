import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./modules/login/login.component'),
  },
  {
    path: '',
    loadComponent: () => import('./modules/home/home.component'),
    children: [
      {
        canActivate: [authGuard], 
        path: 'create',
        loadComponent: () => import('./modules/create-recipe/create-recipe.component'),
      },
    ]
  },
];
