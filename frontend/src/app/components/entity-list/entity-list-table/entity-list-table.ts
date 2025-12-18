import {ChangeDetectorRef, Component, ElementRef, inject, Input, OnChanges, signal, SimpleChanges} from '@angular/core';
import {MatProgressBar} from '@angular/material/progress-bar';
import {Action, Column, EntityListTableConfig, Page} from './models';
import {filter, finalize, map, Observable, of, Subject, takeUntil} from 'rxjs';
import {EntityListService} from '../entity-list-service';
import {NavigationEnd, Router} from '@angular/router';
import {MatSort, MatSortHeader, Sort} from '@angular/material/sort';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatPrefix} from '@angular/material/form-field';
import {MatIconButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIcon} from '@angular/material/icon';
import {MatInput, MatSuffix} from '@angular/material/input';
import {HttpClient} from '@angular/common/http';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {AsyncPipe, DatePipe} from '@angular/common';
import {PageEvent} from '@angular/material/paginator';
import {Destroyable} from '../../destroyable';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';

const deepGet = <T extends object>(obj: T, keys: string[]): any => {
  return keys.reduce((current: any, key) => current?.[key], obj);
};

@Component({
  selector: 'app-entity-list-table',
  imports: [
    MatProgressBar,
    MatFormField,
    MatIconButton,
    MatTooltip,
    MatIcon,
    ReactiveFormsModule,
    FormsModule,
    MatInput,
    MatSort,
    MatSortHeader,
    MatPrefix,
    MatSuffix,
    TranslatePipe,
    AsyncPipe,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem
  ],
  templateUrl: './entity-list-table.html',
  styleUrl: './entity-list-table.scss',
  exportAs: 'EntityListTable',
  providers: [DatePipe]
})
export class EntityListTable extends Destroyable implements OnChanges {
  @Input() config?: EntityListTableConfig
  readonly loading = signal(false)
  readonly page = signal<Page | undefined>(undefined)
  readonly pageSize = signal(50)

  protected pageNumber = signal(0)
  protected sort?: Sort
  protected searched = signal<boolean>(false)
  protected searchCtrl: FormControl = new FormBuilder().nonNullable.control('', [Validators.min(2)])

  private _entityListService = inject(EntityListService)
  private _router = inject(Router)
  private _cd = inject(ChangeDetectorRef)
  private _http = inject(HttpClient)
  private _translate = inject(TranslateService)
  private _eltRef = inject(ElementRef<HTMLElement>)
  private _datePipe = inject(DatePipe)

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && changes['config'].currentValue) {
      if (changes['config'].previousValue) {
        this._reset()
      }
      this._init()
    }
  }

  refresh() {
    if (this.loading() || !this.config)
      return
    this.loading.set(true)
    let url = new URL(this.config.backendUrl);
    if (this.pageNumber() > 0)
      url.searchParams.append('page', String(this.pageNumber()));
    if (this.pageSize() > 0)
      url.searchParams.append('size', String(this.pageSize()));
    if (this.sort)
      url.searchParams.append('sort', this.sort.active + ',' + this.sort.direction)
    const searchKey = this.searchCtrl.value
    if (searchKey && searchKey.trim() !== '')
      url.searchParams.append('search', searchKey);
    this._http.get<Page>(url.toString())
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading.set(false)
        })
      )
      .subscribe(result => {
        this.page.set(result);
        if (searchKey && searchKey.trim() !== '')
          this.searched.set(true)
        else
          this.searched.set(false)
        if (result.sort.isSorted && result.sort.orders.length > 0 && !this.sort) {
          const order = result.sort.orders[0]
          this.sort = {active: order.field, direction: order.direction}
        }
        if (this._eltRef && this._eltRef.nativeElement) {
          this._eltRef.nativeElement.scrollTop = 0;
          this._cd.markForCheck()
        }
      })
  }

  pageChange($event: PageEvent) {
    this.pageNumber.set($event.pageIndex)
    this.pageSize.set($event.pageSize);
    this.refresh()
  }

  protected cancelSearch() {
    this.searchCtrl.reset()
    this.refresh()
  }

  protected sortChange(sortState: Sort) {
    this.sort = sortState
    this.refresh()
  }

  protected hasAction() {
    const rowActions = this.config?.rowActions || []
    return rowActions.length > 0;
  }

  protected rowClick(row: any) {
    const clickHandler = this.config?.onClickRow;
    if (clickHandler) {
      clickHandler(row)
        .pipe(takeUntil(this.destroy$))
        .subscribe(shouldRefresh => {
          if (shouldRefresh)
            this.refresh()
        })
    }
  }

  protected displayColumn(column: Column, row: any): Observable<any> {
    const value = column.id.includes('.') ? deepGet(row, column.id.split('.')) : row[column.id]
    if (column.type === 'boolean')
      return this._translate.get(value === true ? 'boolean.yes' : (value === false ? 'boolean.no' : 'boolean.na'))
        .pipe(map(translated => `<span class="boolean-type ${value === true ? 'yes' : (value === false ? 'no' : '')}">${translated}</span>`))
    if (column.type === 'user') {
      return of(`<span class="user"><span class="icon">account_circle</span><span><span class="name">${value.displayName}</span><span class="title">${value.title}</span></span></span>`)
    }
    if (column.type === 'date') {
      return of(this._datePipe.transform(value));
    }
    if (column.type === 'status') {
      return this._translate.get('status.' + value)
        .pipe(map(translated => `<span class="status-type ${value}">${translated}</span>`))
    }
    if (column.type === 'id') {
      const formatter = new Intl.NumberFormat(undefined, {useGrouping: false, minimumIntegerDigits: 6})
      return of(formatter.format(value));
    }
    return of(value)
  }

  protected rowActionClick(item: any, action: Action) {
    action.actionHandle(item)
      .pipe(takeUntil(this.destroy$))
      .subscribe(shouldRefresh => {
        if (shouldRefresh)
          this.refresh()
      })
  }

  private _init() {
    // Listen to entity list change event
    if (this.config?.listId)
      this._handleChangeEvent(this.config.listId)
    this._cd.markForCheck()
    this.refresh();
  }

  private _reset() {
    this.loading.set(false)
    this.pageNumber.set(0)
    this.pageSize.set(50)
    this.page.set(undefined)
  }

  private _handleChangeEvent(listId: string) {
    this._entityListService.registerEntityListEvent(listId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(changeEvent => {
        const object = changeEvent.object
        if (object) {
          // Add to list item and update pagination information when new event
          if (changeEvent.type === 'new') {
            this.page.update(page => {
              if (page) {
                page.content.unshift(object)
                page.page.numberOfElements += 1
                page.page.totalElements += 1
              }
              return page
            })
          } else if (changeEvent.type === 'update') {
            this.page.update(page => {
              if (page) {
                for (let i = 0; i < page.content.length; i++) {
                  const content = page.content[i]
                  if (content.id === object.id) {
                    page.content[i] = object
                    break
                  }
                }
              }
              return page
            })
          } else if (changeEvent.type === 'delete') {
            const routeSubject = new Subject<void>()
            this._router.events
              .pipe(takeUntil(routeSubject), filter(e => e instanceof NavigationEnd))
              .subscribe(() => {
                this.page.update(page => {
                  if (page) {
                    for (let i = 0; i < page.content.length; i++) {
                      const content = page.content[i]
                      if (content.id === object.id) {
                        page.page.numberOfElements -= 1
                        page.page.totalElements -= 1
                        page.content.splice(i, 1)
                        this._cd.markForCheck()
                        break;
                      }
                    }
                  }
                  return page
                })
                routeSubject.next()
                routeSubject.complete()
              })
          }
        }
      })
  }
}
