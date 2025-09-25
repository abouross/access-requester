import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideTranslateService, TranslateLoader} from '@ngx-translate/core';
import {bearerInterceptor} from './security/bearer-interceptor';
import {loadingProgressInterceptor} from './components/loading-progress/loading-progress-interceptor';
import {errorInterceptor} from './pages/error/error-interceptor';
import {CustomTranslateLoader} from './translation/custom-translate-loader';
import {translateInterceptor} from './translation/translate-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([bearerInterceptor, translateInterceptor, loadingProgressInterceptor, errorInterceptor])),
    provideTranslateService({
      loader: {provide: TranslateLoader, useClass: CustomTranslateLoader},
    })
  ]
};
