import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { CREATE_MODE, EDIT_MODE } from './constants/categories';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./modules/login/login.component'),
  },
  {
    path: '',
    loadComponent: () => import('./modules/home/home.component'),
    children: [
      {
        path: 'search',
        loadComponent: () => import('./modules/search/search.component'),
      },
      {
        canActivate: [authGuard], 
        path: 'create',
        loadComponent: () => import('./modules/create-recipe/create-recipe.component'),
        data: { accessType: CREATE_MODE } 
      },
      {
        canActivate: [authGuard], 
        path: 'edit/:id',
        loadComponent: () => import('./modules/create-recipe/create-recipe.component'),
        data: { accessType: EDIT_MODE }
      },
      {
        path: 'detail/:id',
        loadComponent: () => import('./modules/detail/detail.component'),
      },
    ]
  },
];
