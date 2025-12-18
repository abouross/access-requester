import {Component} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {EntityListCard} from '../../components/entity-list/entity-list-card/entity-list-card';
import {EntityListTableConfig} from '../../components/entity-list/entity-list-table/models';
import {environment} from '../../../environments/environment';
import {of} from 'rxjs';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-access-requests',
  imports: [
    TranslatePipe,
    EntityListCard,
    MatIcon,
    MatIconButton,
    RouterLink
  ],
  templateUrl: './access-requests.html',
  styleUrl: './access-requests.scss'
})
export class AccessRequests {
  protected tableConfig: EntityListTableConfig = {
    listId: 'requests-list',
    columns: [
      {id: 'id', type: 'id', label: 'requests.id', sortable: true},
      {id: 'initiator', type: 'user', label: 'requests.initiator', sortable: false},
      {id: 'createdAt', type: 'date', label: 'requests.createdAt', sortable: true},
      {id: 'status', type: 'status', label: 'requests.status', sortable: false},
    ],
    rowActions: [
      {title: 'requests.flows', icon: 'rule', actionHandle: row => of(false)},
      {title: 'requests.edit', icon: 'edit', actionHandle: row => of(false)},
    ],
    searchable: true,
    backendUrl: environment.apiBaseUrl + '/access-requests',
    rowActionType: 'menu',
    onClickRow: row => of(false)
  };

}
