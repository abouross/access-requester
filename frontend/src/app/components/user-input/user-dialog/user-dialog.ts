import {Component, inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef
} from '@angular/material/dialog';
import {EntityListTable} from '../../entity-list/entity-list-table/entity-list-table';
import {EntityListTableConfig} from '../../entity-list/entity-list-table/models';
import {of} from 'rxjs';
import {MatButton} from '@angular/material/button';
import {TranslatePipe} from '@ngx-translate/core';
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import {PaginatorIntl} from '../../entity-list/paginator-intl';

@Component({
  selector: 'app-user-dialog',
  imports: [
    MatDialogContent,
    EntityListTable,
    MatDialogActions,
    MatButton,
    TranslatePipe,
    MatDialogClose,
    MatPaginator,
  ],
  templateUrl: './user-dialog.html',
  styleUrl: './user-dialog.scss',
  providers: [{provide: MatPaginatorIntl, useClass: PaginatorIntl}]
})
export class UserDialog {
  private _dialogRef = inject(MatDialogRef<UserDialog>)
  private _data = inject(MAT_DIALOG_DATA);
  protected listConfig?: EntityListTableConfig = {
    listId: 'users_dialog',
    backendUrl: this._data.backendUrl,
    columns: [
      {id: 'username', type: 'text', label: 'user.username', sortable: true},
      {id: 'firstName', type: 'text', label: 'user.firstName', sortable: true},
      {id: 'lastName', type: 'text', label: 'user.lastName', sortable: true},
      {id: 'title', type: 'text', label: 'user.title', sortable: false},
    ],
    searchable: true,
    rowActions: [],
    onClickRow: row => {
      this._dialogRef.close(row)
      return of(false)
    }
  }

  protected readonly pageSizes = [5, 10, 20, 50, 100, 200]

  protected showFirstLastButtons(listTable: EntityListTable): boolean {
    const page = listTable.page();
    if (page) {
      return page.page.totalPages > 5
    }
    return false;
  }
}
