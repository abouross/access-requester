import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {Security} from './security';

export const authGuard: CanActivateFn = (route, state) => {
  const security = inject(Security);
  const router = inject(Router);
  if (!security.isAuthenticated()) {
    router.navigateByUrl('/login')
      .then(() => {
      })
    return false;
  }
  return true;
};
