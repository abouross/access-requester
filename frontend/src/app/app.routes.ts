import {Routes} from '@angular/router';
import {environment} from '../environments/environment';
import {inject} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Layout} from './components/layout/layout';
import {authGuard} from './security/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(c => c.Login),
    title: () => {
      const translate = inject(TranslateService);
      return translate.get('title.login', {appName: environment.appName})
    }
  },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
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
        path: 'users',
        loadComponent: () => import('./pages/users/users').then(c => c.Users),
        title: () => {
          const translate = inject(TranslateService);
          return translate.get('title.users', {appName: environment.appName})
        }
      },
      {
        path: 'users/create',
        loadComponent: () => import('./pages/users/create-user/create-user').then(c => c.CreateUser)
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
