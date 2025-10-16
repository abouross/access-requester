import {Routes} from '@angular/router';
import {environment} from '../environments/environment';
import {inject} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Layout} from './components/layout/layout';
import {authGuard} from './security/auth-guard';
import {UserService} from './pages/users/user-service';

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
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile').then(c => c.Profile),
        title: () => {
          const translate = inject(TranslateService);
          return translate.get('title.profile', {appName: environment.appName})
        }
      },
      /** Users **/
      {
        path: 'users',
        providers: [UserService],
        loadComponent: () => import('./pages/users/users').then(c => c.Users),
        title: () => {
          const translate = inject(TranslateService);
          return translate.get('title.users', {appName: environment.appName})
        }
      },
      {
        path: 'users/create',
        providers: [UserService],
        loadComponent: () => import('./pages/users/create-user/create-user').then(c => c.CreateUser)
      },
      {
        path: 'users/edit/:id',
        providers: [UserService],
        loadComponent: () => import('./pages/users/edit-user/edit-user').then(c => c.EditUser)
      },
      /** End Users **/

      /** Validation contexts **/
      {
        path: 'settings/contexts',
        loadComponent: () => import('./pages/settings/validation-contexts/validation-contexts').then(c => c.ValidationContexts),
        title: () => {
          const translate = inject(TranslateService);
          return translate.get('title.validation_contexts', {appName: environment.appName})
        },
        children: [
          {
            path: 'create',
            loadComponent: () => import('./pages/settings/validation-contexts/create-context/create-context').then(c => c.CreateContext)
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./pages/settings/validation-contexts/edit-context/edit-context').then(c => c.EditContext)
          }
        ]
      },
      /** End Validation contexts **/

      /** Validation Flows **/
      {
        path: 'settings/flows',
        loadComponent: () => import('./pages/settings/validation-flows/validation-flows').then(c => c.ValidationFlows),
        title: () => {
          const translate = inject(TranslateService);
          return translate.get('title.validation_flows', {appName: environment.appName})
        },
        children: [
          {
            path: 'create/:contextId',
            loadComponent: () => import('./pages/settings/validation-flows/create-flow/create-flow').then(c => c.CreateFlow)
          },
          {
            path: 'edit/:contextId/:id',
            loadComponent: () => import('./pages/settings/validation-flows/edit-flow/edit-flow').then(c => c.EditFlow)
          }
        ]
      },
      /** End Validation Flows **/

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
