import {Component, inject, signal} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {AsyncPipe} from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {Appearance} from './appearance.service';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatTooltip} from '@angular/material/tooltip';
import {mainMenuItems, SidenavMenuItem} from './menu';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatTooltip,
    RouterOutlet,
    RouterLink
  ],
  providers: [Appearance],
})
export class LayoutComponent {
  private _breakpointObserver = inject(BreakpointObserver);

  protected isHandset$: Observable<boolean> = this._breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  protected appearance = inject(Appearance)
  protected profile = signal<{ displayName: string } | null>(null)
  protected menuItems = signal<SidenavMenuItem[]>(mainMenuItems);

  protected logout(): void {
  }
}
