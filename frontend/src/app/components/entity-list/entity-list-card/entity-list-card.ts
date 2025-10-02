import {Component, Input, signal} from '@angular/core';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatPaginator} from '@angular/material/paginator';
import {EntityListTable} from '../entity-list-table/entity-list-table';
import {EntityListTableConfig} from '../entity-list-table/models';

@Component({
  selector: 'app-entity-list-card',
  imports: [
    MatIcon,
    MatIconButton,
    MatPaginator,
    EntityListTable
  ],
  templateUrl: './entity-list-card.html',
  styleUrl: './entity-list-card.scss'
})
export class EntityListCard {
  @Input() cardTitle?: string;
  @Input() tableConfig?: EntityListTableConfig

  @Input() set showFirstLastButtons(value: boolean) {
    this._showFirstLastButtons.set(value);
  }

  protected _showFirstLastButtons = signal(true)
  protected readonly pageSizes = [20, 50, 100, 200];
}
