import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

export const translateInterceptor: HttpInterceptorFn = (req, next) => {
  const translate = inject(TranslateService);
  let lang = translate.getCurrentLang();
  if (!lang || lang.trim().length === 0) {
    lang = 'en';
  }
// Inject current language to the request for server translation handling
  const newRequest = req.clone({
    setHeaders: {
      "Accept-Language": lang
    },
  });
  return next(newRequest);
};
