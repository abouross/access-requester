import {Component, inject, OnInit, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Context} from '../validation-contexts/models';
import {Destroyable} from '../../../components/destroyable';
import {environment} from '../../../../environments/environment';
import {finalize, of, takeUntil} from 'rxjs';
import {MatProgressBar} from '@angular/material/progress-bar';
import {TranslatePipe} from '@ngx-translate/core';
import {MatFormField, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect, MatSelectChange} from '@angular/material/select';
import {EntityListSplit} from '../../../components/entity-list/entity-list-split/entity-list-split';
import {EntityListTableConfig} from '../../../components/entity-list/entity-list-table/models';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {MatIconButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-validation-flows',
  imports: [
    MatProgressBar,
    MatFormField,
    MatLabel,
    TranslatePipe,
    MatSelect,
    MatOption,
    EntityListSplit,
    MatIcon,
    MatIconButton,
    RouterLink,
    RouterOutlet,
    MatTooltip
  ],
  templateUrl: './validation-flows.html',
  styleUrl: './validation-flows.scss'
})
export class ValidationFlows extends Destroyable implements OnInit {
  private _http = inject(HttpClient)
  private _router = inject(Router)

  protected loading = signal<boolean>(false)
  protected contexts = signal<Context[]>([]);
  protected selectContext = signal<Context | undefined>(undefined)
  tableConfig = signal<EntityListTableConfig | undefined>(undefined)

  ngOnInit() {
    this._loadContexts()
  }

  private _loadContexts() {
    if (!this.loading() && this.contexts().length <= 0) {
      this.loading.set(true)
      this._http.get<Context[]>(environment.apiBaseUrl + '/validation-contexts/actives')
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => this.loading.set(false))
        )
        .subscribe(result => {
          if (result) {
            this.contexts.set(result)
          }
        })
    }
  }

  protected contextChange($event: MatSelectChange<any>) {
    if (!this.loading() && $event.value) {
      this.selectContext.set($event.value);
      this.tableConfig.set({
        backendUrl: environment.apiBaseUrl + '/validation-flows/' + $event.value.id + '/list',
        searchable: true,
        columns: [
          {id: 'user.username', type: 'text', label: 'user.username', sortable: true},
          {id: 'user.firstName', type: 'text', label: 'user.firstName', sortable: false},
          {id: 'user.lastName', type: 'text', label: 'user.lastName', sortable: false},
        ],
        rowActions: [],
        onClickRow: row => {
          if (row)
            this._router.navigate(['/settings/flows/edit/', this.selectContext()?.id, row.id])
              .then(() => {
              });
          return of(false);
        },
        listId: 'flow-list'
      })
    }
  }
}
