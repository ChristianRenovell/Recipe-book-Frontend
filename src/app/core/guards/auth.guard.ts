import { Router, type CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token-recipes');

  if (token) {
    return true;
  } else {
    const router = new Router();
    router.navigate(['/login']);
    return false;
  }
};
