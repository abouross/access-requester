import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, filter, Observable} from 'rxjs';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class LoadingProgressService {
  private _auto$ = new BehaviorSubject<boolean>(true)
  private _mode$ = new BehaviorSubject<'determinate' | 'indeterminate'>('indeterminate')
  private _progress$ = new BehaviorSubject<number>(0)
  private _show$ = new BehaviorSubject<boolean>(false)
  private _urlMap = new Map<string, boolean>()
  private _router = inject(Router)

  constructor() {
    this._init()
  }

  get auto$(): Observable<boolean> {
    return this._auto$.asObservable();
  }

  get mode$(): Observable<'determinate' | 'indeterminate'> {
    return this._mode$.asObservable();
  }

  get progress$(): Observable<number> {
    return this._progress$.asObservable();
  }

  get show$(): Observable<boolean> {
    return this._show$.asObservable();
  }

  show(): void {
    this._show$.next(true);
  }

  hide(): void {
    this._show$.next(false);
  }

  setAutoMode(value: boolean): void {
    this._auto$.next(value);
  }

  setMode(value: 'determinate' | 'indeterminate'): void {
    this._mode$.next(value);
  }

  setProgress(value: number): void {
    if (value < 0 || value > 100) {
      console.error('Progress value must be between 0 and 100!');
      return;
    }

    this._progress$.next(value);
  }

  setLoadingStatus(status: boolean, url: string): void {
    // Return if the url was not provided
    if (!url) {
      console.error('The request URL must be provided!');
      return;
    }

    if (status) {
      this._urlMap.set(url, status);
      this._show$.next(true);
    } else if (!status && this._urlMap.has(url)) {
      this._urlMap.delete(url);
    }

    // Only set the status to 'false' if all outgoing requests are completed
    if (this._urlMap.size === 0) {
      this._show$.next(false);
    }
  }

  private _init() {
    // Subscribe to the router events to show/hide the loading bar
    this._router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe(() => {
        this.show();
      });

    this._router.events
      .pipe(filter((event) => event instanceof NavigationEnd || event instanceof NavigationError || event instanceof NavigationCancel))
      .subscribe(() => {
        setTimeout(() => this.hide(), 200);
      });
  }
}
