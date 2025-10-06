import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {catchError, concatMap, finalize, map, Observable, of} from 'rxjs';
import {ConfirmationSheet} from '../../components/confirmation-sheet/confirmation-sheet';
import {LoadingDialog} from '../../components/loading-dialog/loading-dialog';
import {InterpolationParameters, TranslateService} from '@ngx-translate/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable()
export class UserService {
  private _http = inject(HttpClient)
  private _translate = inject(TranslateService)
  private _bottomSheet = inject(MatBottomSheet)
  private _dialog = inject(MatDialog)
  private _snackbar = inject(MatSnackBar)

  getRolesMap() {
    return this._http.get<{
      [key: string]: string
    }>(environment.apiBaseUrl + '/users/roles-map')
      .pipe(
        map(rolesMap => {
          return Object.keys(rolesMap)
            .map(key => {
              return {label: rolesMap[key], value: key}
            })
        })
      )
  }

  deleteUser(user: any, url: string, confirmation: string, confirmationArgs?: InterpolationParameters): Observable<boolean> {
    if (user)
      return this._translate.get(confirmation, confirmationArgs)
        .pipe(
          concatMap(title => this._bottomSheet.open(ConfirmationSheet, {data: {title: title}})
            .afterDismissed()),
          concatMap(confirmed => {
            if (confirmed) {
              const loading = this._dialog.open(LoadingDialog, {disableClose: true})
              return this._http.delete(url)
                .pipe(
                  catchError(httpError => {
                    if (httpError instanceof HttpErrorResponse && httpError.status === 400 && httpError.error && httpError.error.message)
                      this._snackbar.open(
                        httpError.error.message,
                        'OK',
                        {panelClass: 'error-snackbar', horizontalPosition: 'end'}
                      )
                    return []
                  }),
                  map(() => true),
                  finalize(() => loading.close())
                )
            }
            return of(confirmed)
          })
        )
    return of(false)
  }
}
