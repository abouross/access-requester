import {inject, Injectable} from '@angular/core';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {Subject, take} from "rxjs";
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class PaginatorIntl implements MatPaginatorIntl {
  private _translate = inject(TranslateService)
  private _emptyRangeLabel = 'pagination.empty_range'

  changes: Subject<void> = new Subject();
  itemsPerPageLabel: string = 'pagination.items_per_page';
  nextPageLabel: string = 'pagination.next_page';
  previousPageLabel: string = 'pagination.previous_page';
  firstPageLabel: string = 'pagination.first_page';
  lastPageLabel: string = 'pagination.last_page';
  getRangeLabel: (page: number, pageSize: number, length: number) => string = (page: number, pageSize: number, length: number): string => {
    if (length === 0) {
      return this._emptyRangeLabel;
    }
    const amountPages = Math.ceil(length / pageSize);
    length = Math.max(length, 0);

    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `Page: ${page + 1}/${amountPages} --- Elements: ${startIndex + 1} – ${endIndex} / ${length}`;
  };

  constructor() {
    this.updatePaginatorLabels()
    this._translate.onLangChange
      .subscribe(() => this.updatePaginatorLabels())
  }

  updatePaginatorLabels() {
    this._translate.get([
      'pagination.empty_range',
      'pagination.items_per_page',
      'pagination.next_page',
      'pagination.previous_page',
      'pagination.first_page',
      'pagination.last_page'])
      // .pipe(take(1))
      .subscribe(result => {
        this._translateLabels(result);
      });
  }

  private _translateLabels(translations: any) {
    if (translations) {
      this._emptyRangeLabel = translations['pagination.empty_range']
      this.itemsPerPageLabel = translations['pagination.items_per_page']
      this.nextPageLabel = translations['pagination.next_page']
      this.previousPageLabel = translations['pagination.previous_page']
      this.firstPageLabel = translations['pagination.first_page']
      this.lastPageLabel = translations['pagination.last_page']
      // Trigger changes
      this.changes.next()
    }
  }
}
