import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {catchError, take} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  // const security = inject(SecurityService);
  const snackBar = inject(MatSnackBar)
  const translate = inject(TranslateService)
  return next(req)
    .pipe(catchError(httpError => {
      if (httpError instanceof HttpErrorResponse) {
        switch (httpError.status) {
          case 500:
            router.navigateByUrl('/error/500')
              .then(() => {
              })
            break;
          case 0:
            translate.get('error.unknow')
              .pipe(take(1))
              .subscribe(message =>
                snackBar.open(
                  message,
                  'OK',
                  {panelClass: 'error-snackbar', duration: 60 * 1000}
                ));
            break;
          case 401:
            // security.logout()
            break;
          case 403:
            translate.get('error.forbidden')
              .pipe(take(1))
              .subscribe(message =>
                snackBar.open(
                  message,
                  'OK',
                  {panelClass: 'error-snackbar', duration: 60 * 1000}
                ));
            break;
          case 405:
            translate.get('error.unauthorized_method')
              .pipe(take(1))
              .subscribe(message =>
                snackBar.open(
                  message,
                  'OK',
                  {panelClass: 'error-snackbar', duration: 60 * 1000}
                ));
            break;
          case 503:
            translate.get('error.service_unavailable')
              .pipe(take(1))
              .subscribe(message =>
                snackBar.open(
                  message,
                  'OK',
                  {panelClass: 'error-snackbar', duration: 60 * 1000}
                ));
            break;
          case 404:
            translate.get('error.not_found')
              .pipe(take(1))
              .subscribe(message =>
                snackBar.open(
                  message,
                  'OK',
                  {panelClass: 'error-snackbar', duration: 60 * 1000}
                ));
            break;
        }

      }
      throw httpError
    }));
};
