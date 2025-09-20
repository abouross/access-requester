import {DOCUMENT, inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable()
export class Appearance {
  private readonly APPEARANCE_KEY = 'access-requester-appearance'
  private document: Document = inject(DOCUMENT)
  private _isDarkSubject: BehaviorSubject<boolean>
  isDark$: Observable<boolean>

  constructor() {
    const appearance = localStorage.getItem(this.APPEARANCE_KEY);
    const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');
    let isDark: boolean
    if (appearance !== 'light' && appearance !== 'dark') {
      isDark = matchMedia.matches;
    } else
      isDark = appearance === 'dark';
    this._isDarkSubject = new BehaviorSubject(isDark);
    this.isDark$ = this._isDarkSubject.asObservable();
    this.isDark$.subscribe(isDark => {
      const bodyElt = this.document.getElementsByTagName('body')
        .item(0);
      if (bodyElt) {
        bodyElt.classList.remove('dark-mode');
        bodyElt.classList.remove('light-mode');
        bodyElt.classList.add(isDark ? 'dark-mode' : 'light-mode')
      }
      localStorage.setItem(this.APPEARANCE_KEY, isDark ? 'dark' : 'light')
    });

    matchMedia.addEventListener('change', (event) => {
      this._isDarkSubject.next(event.matches)
    })
  }

  toggleDarkMode() {
    this._isDarkSubject.next(!this._isDarkSubject.value);
  }

}
