import {Component, inject} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map, Observable, shareReplay} from 'rxjs';
import {Security} from '../../security/security';
import {AsyncPipe} from '@angular/common';
import {AccessRequestCounts} from './access-request-counts/access-request-counts';
import {UsersCounts} from './users-counts/users-counts';
import {FlowsCounts} from './flows-counts/flows-counts';

@Component({
  selector: 'app-dashboard',
  imports: [
    TranslatePipe,
    MatGridList,
    AsyncPipe,
    MatGridTile,
    AccessRequestCounts,
    UsersCounts,
    FlowsCounts
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  private _breakpointObserver = inject(BreakpointObserver)
  protected isHandset$: Observable<boolean> = this._breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    )
  protected security = inject(Security)
  protected tileOrientation$: Observable<'vertical' | 'horizontal'> = this._breakpointObserver
    .observe([Breakpoints.Handset, '(min-width: 1400px)'])
    .pipe(
      map(({matches}) => {
        if (matches)
          return 'horizontal';
        return 'vertical';
      })
    )
}
