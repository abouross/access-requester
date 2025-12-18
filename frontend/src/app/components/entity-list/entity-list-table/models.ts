import {Observable} from 'rxjs';
import {SortDirection} from '@angular/material/sort';

export interface EntityListTableConfig {
  backendUrl: string
  columns: Column[]
  searchable: boolean
  rowActions: Action[]
  onClickRow?: (row: any) => Observable<boolean>
  listId?: string
  rowActionType?: 'menu' | 'buttons'
  filters?: Filter[]
}

export interface Column {
  id: string,
  label: string
  type: ColumnType,
  sortable: boolean
}

export type ColumnType = 'text' | 'boolean' | 'list' | 'user' | 'date' | 'status' | 'id'

export interface Action {
  title: string
  icon: string
  actionHandle: (row: any) => Observable<boolean>
  status?: 'error' | 'warning' | 'success' | 'info'
}

export interface Page {
  content: any[]
  page: {
    size: number
    number: number
    numberOfElements: number
    totalElements: number
    totalPages: number
  }
  sort: {
    isSorted: boolean
    orders: { field: string, direction: SortDirection }[]
  }
}

export interface Filter {

}
