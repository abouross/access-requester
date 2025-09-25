import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, ActivationEnd, Router, RouterLink, RouterOutlet, UrlSegment} from '@angular/router';
import {MatToolbar} from '@angular/material/toolbar';
import {Destroyable} from '../destroyable';
import {AppearanceService} from './appearance-service';
import {AsyncPipe, NgOptimizedImage} from '@angular/common';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {filter, map, Observable, shareReplay, takeUntil} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {mainMenuItems, MenuItem} from './menu';
import {MatListItem, MatListItemIcon, MatNavList} from '@angular/material/list';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {environment} from '../../../environments/environment';
import {Security} from '../../security/security';
import {Profile} from '../../security/models';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    MatToolbar,
    AsyncPipe,
    MatIconButton,
    MatIcon,
    MatTooltip,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    NgOptimizedImage,
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    MatNavList,
    MatListItem,
    RouterLink,
    MatListItemIcon,
    TranslatePipe
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  providers: [AppearanceService]
})
export class Layout extends Destroyable implements OnInit {
  private _breakpointObserver = inject(BreakpointObserver)
  private _security = inject(Security)
  private _activatedRoute = inject(ActivatedRoute)
  private _router = inject(Router)
  private _translate = inject(TranslateService)

  protected appearanceService = inject(AppearanceService)
  protected appName = signal(environment.appName)
  protected profile = signal<Profile | null>(null)
  protected isHandset$: Observable<boolean> = this._breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    )
  protected menuItems = signal<MenuItem[]>(mainMenuItems)
  protected currentLanguage = signal(this._translate.getCurrentLang())
  protected readonly environment = environment;

  ngOnInit() {
    // Set main menu item
    this._initMenu()
    // Update when activated menu item when url change
    this._menuChangeListener()
    // Listen to language change
    this._translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => this.currentLanguage.set(event.lang))
  }

  protected logout() {
  }

  protected change($event: Event) {
    const lang = ($event.target as HTMLSelectElement).value
    if (lang && lang.trim().length > 0)
      this._translate.use(lang)
  }


  /**
   * Initialize main menu by checking required role and add if it's authorized
   */
  private _initMenu() {
    const tempMenuItems: MenuItem[] = []
    mainMenuItems.forEach(menu => {
      if (!menu.requiredRole || this._security.hasRoleOrAdmin(menu.requiredRole))
        tempMenuItems.push(menu);
    })
    this.menuItems.set(tempMenuItems)
    // Update activated menu item
    this._updateActivatedMenu(this._activatedRoute.snapshot.url.map((segment: UrlSegment) => segment.path).join('/'));
    // If route has activated children
    if (this._activatedRoute.children && this._activatedRoute.children.length > 0) {
      for (let i = 0; i < this._activatedRoute.children.length; i++) {
        const childRoute = this._activatedRoute.children[i];
        this._updateActivatedMenu(childRoute.snapshot.url.map((segment: UrlSegment) => segment.path).join('/'));
      }
    }
  }

  /**
   * Listen to route navigation and update activated menu
   */
  private _menuChangeListener() {
    this._router.events
      .pipe(filter(event => event instanceof ActivationEnd), takeUntil(this.destroy$))
      .subscribe(event => {
        let url = event.snapshot.url.map((segment: UrlSegment) => segment.path).join('/');
        this._updateActivatedMenu(url);
        if (!url.includes('login') && !url.includes('error/') && url.trim() !== '')
          localStorage.setItem(environment.lastPathStorageKey, url.startsWith('/') ? url : '/' + url)
      })
  }

  private _updateActivatedMenu(url: string) {
    if (!url || url === '')
      return;
    const menuItems = this.menuItems();
    menuItems.forEach(item => {
      item.isActive = false
      if (item.children && item.children.length > 0)
        item.children.forEach(child => child.isActive = false)
      // If menu is prefix of url then set it as activated
      if (item.link && url.includes(item.link))
        item.isActive = true
      // Handle for item who has children. If has at least one child active then mark it as active also
      if (item.children && item.children.length > 0) {
        let hasActiveChild: boolean = false;
        item.children.forEach(child => {
          if (child.link && url.includes(child.link)) {
            child.isActive = true;
            hasActiveChild = true
          }
        });
        if (hasActiveChild)
          item.isActive = true
      }
    })
  }

}
