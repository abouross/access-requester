import {Component, inject} from '@angular/core';
import {EntityListSplit} from '../../components/entity-list/entity-list-split/entity-list-split';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {EntityListTableConfig} from '../../components/entity-list/entity-list-table/models';
import {environment} from '../../../environments/environment';
import {of} from 'rxjs';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-applications',
  imports: [
    EntityListSplit,
    RouterOutlet,
    TranslatePipe,
    MatIcon,
    MatIconButton,
    RouterLink,
    MatTooltip
  ],
  templateUrl: './applications.html',
})
export class Applications {
  private _router = inject(Router)

  protected tableConfig: EntityListTableConfig = {
    backendUrl: environment.apiBaseUrl + '/applications',
    listId: 'applications-list',
    searchable: true,
    columns: [
      {id: 'name', type: 'text', label: 'applications.name', sortable: true},
      {id: 'enabled', type: 'boolean', label: 'applications.enabled', sortable: false},
    ],
    rowActions: [],
    onClickRow: row => {
      this._router.navigateByUrl('/applications/edit/' + row.id)
        .then(() => {
        })
      return of(false)
    }
  }
}
