import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {Security} from './security';

export const bearerInterceptor: HttpInterceptorFn = (req, next) => {
  const security = inject(Security)
  if (req.url.includes('/api/login'))
    return next(req);
  if (security.isAuthenticated()) {
    const JWT = `Bearer ${security.token?.token}`;
    const newRequest = req.clone({
      setHeaders: {
        Authorization: JWT,
      },
    });
    return next(newRequest);
  } else {
    return next(req);
  }
};
