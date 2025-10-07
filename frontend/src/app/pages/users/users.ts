import {Component, inject, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {of, takeUntil} from 'rxjs';
import {TranslatePipe} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {Destroyable} from '../../components/destroyable';
import {LoadingProgressService} from '../../components/loading-progress/loading-progress.service';
import {EntityListTableConfig} from '../../components/entity-list/entity-list-table/models';
import {EntityListCard} from '../../components/entity-list/entity-list-card/entity-list-card';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {UserService} from './user-service';

@Component({
  selector: 'app-users',
  imports: [
    EntityListCard,
    TranslatePipe,
    MatIcon,
    MatIconButton
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users extends Destroyable implements OnInit {
  private _router = inject(Router)
  private _loadingProgress = inject(LoadingProgressService)
  private _userService = inject(UserService)

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
        actionHandle: row => this._userService.deleteUser(
          row,
          environment.apiBaseUrl + '/users/' + row.id,
          {message: 'user.deletion_confirmation', args: {'user': row.username}},
          {message: 'user.delete_success_message', args: {'user': row.username}}
        ).pipe(takeUntil(this.destroy$))
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

  protected createForm() {
    this._router.navigateByUrl('/users/create')
      .then(() => {
      });
  }
}
