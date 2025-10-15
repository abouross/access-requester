import {Component, inject} from '@angular/core';
import {EntityListSplit} from '../../../components/entity-list/entity-list-split/entity-list-split';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {EntityListTableConfig} from '../../../components/entity-list/entity-list-table/models';
import {environment} from '../../../../environments/environment';
import {of} from 'rxjs';
import {TranslatePipe} from '@ngx-translate/core';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-validation-contexts',
  imports: [
    EntityListSplit,
    RouterOutlet,
    TranslatePipe,
    MatIcon,
    MatIconButton,
    RouterLink,
    MatTooltip
  ],
  templateUrl: './validation-contexts.html',
  styleUrl: './validation-contexts.scss'
})
export class ValidationContexts {
  private _router = inject(Router)

  protected tableConfig: EntityListTableConfig = {
    listId: 'contexts-list',
    backendUrl: environment.apiBaseUrl + '/validation-contexts',
    searchable: true,
    columns: [
      {id: 'name', type: 'text', label: 'contexts.name', sortable: true},
      {id: 'enabled', type: 'boolean', label: 'contexts.enabled', sortable: true}
    ],
    rowActions: [],
    onClickRow: row => {
      this._router.navigateByUrl('/settings/contexts/edit/' + row.id)
        .then(() => {
        })
      return of(false)
    }
  };

}
