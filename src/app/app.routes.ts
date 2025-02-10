import { Routes } from '@angular/router';

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
        path: 'create',
        loadComponent: () => import('./modules/create-recipe/create-recipe.component'),
      },
    ]
  },
];
