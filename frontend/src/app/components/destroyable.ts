import {Injectable, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class Destroyable implements OnDestroy {
  protected destroy$: Subject<void> = new Subject()

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
