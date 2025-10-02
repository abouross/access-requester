import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

export interface ChangeEvent {
  type: 'new' | 'delete' | 'update'
  object: any
}

@Injectable({
  providedIn: 'root'
})
export class EntityListService {
  private _lists: { [id: string]: Subject<ChangeEvent> } = {};

  registerEntityListEvent(listId: string): Observable<ChangeEvent> {
    let list = this._lists[listId];
    if (!list) {
      list = new Subject();
      this._lists[listId] = list
    }
    return list.asObservable();
  }

  emitChangeEvent(listId: string, change: ChangeEvent) {
    const list = this._lists[listId];
    if (list) {
      list.next(change);
    }
  }
}
