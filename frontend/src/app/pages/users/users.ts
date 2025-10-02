import {Component, inject, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {catchError, concatMap, finalize, map, of, takeUntil} from 'rxjs';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {ConfirmationSheet} from '../../components/confirmation-sheet/confirmation-sheet';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Destroyable} from '../../components/destroyable';
import {MatDialog} from '@angular/material/dialog';
import {LoadingDialog} from '../../components/loading-dialog/loading-dialog';
import {LoadingProgressService} from '../../components/loading-progress/loading-progress.service';
import {EntityListTableConfig} from '../../components/entity-list/entity-list-table/models';
import {EntityListCard} from '../../components/entity-list/entity-list-card/entity-list-card';

@Component({
  selector: 'app-users',
  imports: [
    EntityListCard,
    TranslatePipe
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users extends Destroyable implements OnInit {
  private _router = inject(Router)
  private _bottomSheet = inject(MatBottomSheet)
  private _translate = inject(TranslateService)
  private _http = inject(HttpClient)
  private _snackbar = inject(MatSnackBar)
  private _dialog = inject(MatDialog)
  private _loadingProgress = inject(LoadingProgressService)

  protected tableConfig: EntityListTableConfig = {
    listId: 'users',
    backendUrl: environment.apiBaseUrl + '/users',
    columns: [
      {id: 'username', type: 'text', label: 'user.username', sortable: true},
      {id: 'firstName', type: 'text', label: 'user.firstName', sortable: true},
      {id: 'lastName', type: 'text', label: 'user.lastName', sortable: true},
      {id: 'enabled', type: 'boolean', label: 'user.enabled', sortable: true},
    ],
    searchable: true,
    rowActions: [
      {
        title: 'user.edit', icon: 'edit', status: 'info', actionHandle: row => {
          this._router.navigateByUrl('/users/edit/' + row.id);
          return of(false)
        }
      },
      {
        title: 'user.delete',
        icon: 'delete',
        status: 'error',
        actionHandle: row => this._translate.get('user.deletion_confirmation', {'user': row.username})
          .pipe(
            concatMap(title => this._bottomSheet.open(ConfirmationSheet, {data: {title: `Etes-vous sur de supprimer "${row.username}" ?`}})
              .afterDismissed()),
            concatMap(confirmed => {
              if (confirmed) {
                const loading = this._dialog.open(LoadingDialog, {disableClose: true})
                return this._http.delete(environment.apiBaseUrl + '/users/' + row.id)
                  .pipe(
                    takeUntil(this.destroy$),
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
      },
    ]
  }

  ngOnInit() {
    this._loadingProgress.setAutoMode(false)
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._loadingProgress.setAutoMode(true)
  }
}
