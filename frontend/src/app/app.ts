import {Component, DOCUMENT, inject, OnDestroy, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {LoadingProgress} from './components/loading-progress/loading-progress';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {filter, finalize, Subscription, take} from 'rxjs';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingProgress],
  template: '<app-loading-progress/><router-outlet/>',
})
export class App implements OnInit, OnDestroy {
  private _document: Document = inject(DOCUMENT)
  private _translate = inject(TranslateService)
  private _langChangeSubscription?: Subscription

  ngOnInit(): void {
    this._removeSplashScreen()
    this._initLanguage()
  }

  ngOnDestroy() {
    // Clean up subscription to prevent memory leaks
    this._langChangeSubscription?.unsubscribe();
  }

  /**
   * Check if language is loaded otherwise wait until load then remove splash screen
   * @private
   */
  private _removeSplashScreen() {
    if (this._translate.getCurrentLang() && this._translate.getCurrentLang().trim().length > 0)
      this.__removeSplashScreen()
    else
      this._translate.onLangChange
        .pipe(
          filter(event => event.lang !== null && event.lang !== undefined && event.lang.trim().length > 0),
          take(1),
          finalize(() => this._removeSplashScreen())
        ).subscribe(() => {
      })
  }

  /**
   * Remove splash screen div and style
   * @private
   */
  private __removeSplashScreen() {
    setTimeout(() => {
      this._document.getElementById('splash-screen')?.remove();
      this._document.getElementById('splash-screen-css')?.remove();
    }, 200)
  }

  /**
   * Retrieve default language and set it. Also update lang html attribute on change
   * @private
   */
  private _initLanguage() {
    // Set initial lang attribute
    this._setHtmlLangAttribute(this._translate.getCurrentLang());

    // Subscribe to language changes
    this._langChangeSubscription = this._translate.onLangChange
      .subscribe((event: LangChangeEvent) => {
          this._setHtmlLangAttribute(event.lang);
          if (event.lang && event.lang.trim().length > 0)
            localStorage.setItem(environment.translation.langKey, event.lang);
          else
            localStorage.removeItem(environment.translation.langKey)
        }
      );

    // Retrieve and set current language or get from browser
    let language: string | null | undefined = localStorage.getItem(environment.translation.langKey);
    if (!language) {
      language = this._translate.getBrowserLang()
      if (!language || !environment.translation.supportedLanguages.includes(language)) {
        language = 'en'
      }
    }
    this._translate.use(language)
  }

  private _setHtmlLangAttribute(lang: string): void {
    if (lang) {
      this._document.documentElement.setAttribute('lang', lang);
    } else
      this._document.documentElement.removeAttribute('lang');
  }

}
