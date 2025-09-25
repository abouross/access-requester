import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {LoadingProgressService} from './loading-progress.service';
import {concatMap, finalize, take} from 'rxjs';

export const loadingProgressInterceptor: HttpInterceptorFn = (req, next) => {
  const service = inject(LoadingProgressService);

  return service.auto$
    .pipe(
      take(1),
      concatMap(handleRequestsAutomatically => {
        // If the Auto mode is turned off, do nothing
        if (!handleRequestsAutomatically) {
          return next(req);
        }
        // Set the loading status to true
        service.setLoadingStatus(true, req.url);

        return next(req).pipe(
          finalize(() => {
            // Set the status to false if there are any errors or the request is completed
            service.setLoadingStatus(false, req.url);
          }));
      })
    )
};
