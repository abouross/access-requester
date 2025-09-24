import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Language, TranslateService} from '@ngx-translate/core';

@Injectable()
export class LanguageService {
  private readonly LANGUAGE_KEY = 'access-requester-language'
  private _languageSubject: BehaviorSubject<Language>
  private _translate = inject(TranslateService)


  language$: Observable<Language>
  readonly languages = ['en', 'fr']

  constructor() {
    let language = localStorage.getItem(this.LANGUAGE_KEY);
    if (!language) {
      language = navigator.language
      if (!language || !this.languages.includes(language)) {
        language = 'en'
      }
    }
    this._languageSubject = new BehaviorSubject(language);
    this.language$ = this._languageSubject.asObservable();
    this.language$.subscribe(lang => localStorage.setItem(this.LANGUAGE_KEY, lang))
  }

  change(language: Language) {
    this._translate.use(language);
    this._languageSubject.next(language);
  }
}
