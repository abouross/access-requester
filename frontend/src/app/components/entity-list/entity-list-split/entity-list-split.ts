import {Component, Input, signal} from '@angular/core';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {PaginatorIntl} from '../paginator-intl';
import {EntityListTableConfig} from '../entity-list-table/models';
import {EntityListTable} from '../entity-list-table/entity-list-table';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-entity-list-split',
  imports: [
    EntityListTable,
    MatIcon,
    MatIconButton,
    MatTooltip,
    TranslatePipe
  ],
  templateUrl: './entity-list-split.html',
  styleUrl: './entity-list-split.scss',
  providers: [
    {provide: MatPaginatorIntl, useClass: PaginatorIntl},
  ]
})
export class EntityListSplit {
  @Input() title?: string;
  @Input() tableConfig?: EntityListTableConfig

  @Input() set showFirstLastButtons(value: boolean) {
    this._showFirstLastButtons.set(value);
  }

  protected _showFirstLastButtons = signal(true)
  protected readonly pageSizes = [20, 50, 100, 200]
}
