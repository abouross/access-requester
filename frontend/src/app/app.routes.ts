import {Routes} from '@angular/router';
import {environment} from '../environments/environment';
import {inject} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Layout} from './components/layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then(c => c.Dashboard),
        title: () => {
          const translate = inject(TranslateService);
          return translate.get('title.dashboard', {appName: environment.appName})
        },
      },
      {
        path: 'error/:code',
        loadComponent: () => import('./pages/error/error').then(c => c.Error),
        title: (route) => {
          const translate = inject(TranslateService);
          return translate.get('title.error', {appName: environment.appName, code: route.params['code']})
        }
      },
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: '**', redirectTo: 'error/404', pathMatch: 'full'}
    ]
  }
];
