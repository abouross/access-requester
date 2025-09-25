import {inject, Injectable} from '@angular/core';
import {TranslateLoader, TranslationObject} from '@ngx-translate/core';
import {catchError, concatMap, finalize, Observable, of, take, tap} from "rxjs";
import {HttpBackend, HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {LoadingProgressService} from '../components/loading-progress/loading-progress.service';

@Injectable()
export class CustomTranslateLoader implements TranslateLoader {
  private _http = new HttpClient(inject(HttpBackend));
  private _loadingProgress = inject(LoadingProgressService);

  public getTranslation(lang: string): Observable<TranslationObject> {
    let path: string = `${environment.translation.loader.prefix}${lang}${environment.translation.loader.suffix ?? ".json"}`
    return this._loadingProgress.auto$
      .pipe(
        take(1),
        concatMap(handleRequestsAutomatically => {
          if (!handleRequestsAutomatically)
            return this._http.get<TranslationObject>(path)
              .pipe(
                catchError((err: HttpErrorResponse) => {
                  if (environment.translation.showLog) {
                    console.error(`Error loading translation for ${lang}:`, err);
                  }
                  return of({});
                }),
                tap(result => {
                  if (environment.translation.showLog)
                    console.debug(`Result loading translation for ${lang}:`, result);
                })
              );

          this._loadingProgress.setLoadingStatus(true, path)
          return this._http.get<TranslationObject>(path)
            .pipe(
              catchError((err: HttpErrorResponse) => {
                if (environment.translation.showLog) {
                  console.error(`Error loading translation for ${lang}:`, err);
                }
                return of({});
              }),
              tap(result => {
                if (environment.translation.showLog)
                  console.debug(`Result loading translation for ${lang}:`, result);
              }),
              finalize(() => this._loadingProgress.setLoadingStatus(false, path))
            );
        })
      )

  }
}
