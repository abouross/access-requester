import {Component, inject} from '@angular/core';
import {EntityListSplit} from '../../components/entity-list/entity-list-split/entity-list-split';
import {TranslatePipe} from '@ngx-translate/core';
import {EntityListTableConfig} from '../../components/entity-list/entity-list-table/models';
import {environment} from '../../../environments/environment';
import {of} from 'rxjs';
import {Router, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-delegations',
  imports: [
    EntityListSplit,
    TranslatePipe,
    RouterOutlet
  ],
  templateUrl: './delegations.html',
  styleUrl: './delegations.scss'
})
export class Delegations {
  private _router = inject(Router)

  protected tableConfig: EntityListTableConfig = {
    backendUrl: environment.apiBaseUrl + '/delegations',
    listId: 'delegations-list',
    searchable: true,
    columns: [
      {id: 'username', type: 'text', label: 'user.username', sortable: true},
      {id: 'firstName', type: 'text', label: 'user.firstName', sortable: true},
      {id: 'lastName', type: 'text', label: 'user.lastName', sortable: true},
    ],
    rowActions: [],
    onClickRow: row => {
      this._router.navigateByUrl('/delegations/' + row.id)
        .then(() => {
        });
      return of(false)
    },
  }
}
